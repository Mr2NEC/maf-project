import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClubsService } from 'src/clubs/clubs.service';

const uploadDir = path.join(__dirname, '..', 'uploads/clubs');

@Injectable()
export class DataInitializerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly clubsService: ClubsService,
  ) {}

  async saveImageFromUrl(url: string, filename: string) {
    try {
      const { headers, data } = await firstValueFrom(
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const contentType = String(headers['content-type'] ?? '');
      const format = contentType?.split('/')[1] || 'unknown';

      const filePath = path.join(uploadDir, `${filename}.${format}`);
      fs.writeFileSync(filePath, data);
      return filePath;
    } catch (e) {
      console.log(url);
      return url;
    }
  }

  async initializeClubs() {
    try {
      if (process.env.DATA_INIT_CLUBS) {
        const { data } = await firstValueFrom(
          this.httpService.get(process.env.DATA_INIT_CLUBS),
        );

        for (const clubData of data) {
          if (clubData?.imgSrc) {
            clubData.imgSrc = await this.saveImageFromUrl(
              clubData.imgSrc,
              `${clubData.title}_${clubData.id}`.replaceAll(' ', '_'),
            );
          }
          await this.clubsService.create(clubData);
        }

        console.log('Database initialization complete.');
      } else {
        throw new Error('Failed to initialize database.');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }
}
