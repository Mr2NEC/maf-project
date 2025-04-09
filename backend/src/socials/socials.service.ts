import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Social } from './entities/social.entity';
import { CreateSocialInput } from './dto/create-social.input';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Social) private socialRepo: Repository<Social>,
  ) {}

  async findAll(): Promise<Social[]> {
    return this.socialRepo.find();
  }

  async findOneByTypeAndLink(
    type: string,
    link: string,
  ): Promise<Social | null> {
    return this.socialRepo.findOne({ where: { type, link } });
  }

  async create(socialData: CreateSocialInput): Promise<Social> {
    const { type, link, clubId, userId } = socialData;

    if (!clubId && !userId) {
      throw new Error('Either clubId or userId must be provided');
    }

    const social = this.socialRepo.create({ type, link, clubId, userId });
    return this.socialRepo.save(social);
  }
}
