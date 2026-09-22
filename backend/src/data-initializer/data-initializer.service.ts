import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import { ClubsService } from 'src/clubs/clubs.service';
import { CreateClubInput } from 'src/clubs/dto/create-club.input';

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'clubs');

const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

type ClubSeed = CreateClubInput & { id?: number | string };

/** Keeps names like "Mafia Club #1" safe for the file system (no ../ tricks). */
export function toSafeFileName(name: string): string {
  return (
    name
      .normalize('NFC')
      .replace(/[^\p{L}\p{N}_-]+/gu, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 80) || 'club'
  );
}

@Injectable()
export class DataInitializerService {
  private readonly logger = new Logger(DataInitializerService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly clubsService: ClubsService,
  ) {}

  /** Downloads an image; returns the local path, or the original URL if that fails. */
  async saveImageFromUrl(url: string, name: string): Promise<string> {
    try {
      const { headers, data } = await firstValueFrom(
        this.httpService.get<ArrayBuffer>(url, {
          responseType: 'arraybuffer',
          timeout: 10_000,
          maxContentLength: 5 * 1024 * 1024,
        }),
      );

      const contentType = String(headers['content-type'] ?? '').split(';')[0];
      const extension = IMAGE_EXTENSIONS[contentType];
      if (!extension) {
        this.logger.warn(`Skipping ${url}: not an image (${contentType})`);
        return url;
      }

      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      const filePath = path.join(
        UPLOAD_DIR,
        `${toSafeFileName(name)}.${extension}`,
      );
      fs.writeFileSync(filePath, Buffer.from(data));
      return filePath;
    } catch (error) {
      this.logger.warn(`Failed to download ${url}: ${String(error)}`);
      return url;
    }
  }

  /** Imports clubs from the JSON list at `sourceUrl`. Returns the number of clubs created. */
  async initializeClubs(sourceUrl: string): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService.get<ClubSeed[]>(sourceUrl, { timeout: 30_000 }),
    );

    let created = 0;
    for (const { id, ...club } of data) {
      if (club.imgSrc) {
        club.imgSrc = await this.saveImageFromUrl(
          club.imgSrc,
          `${club.title}_${id ?? created}`,
        );
      }
      await this.clubsService.create(club);
      created++;
    }

    this.logger.log(`Imported ${created} clubs`);
    return created;
  }
}
