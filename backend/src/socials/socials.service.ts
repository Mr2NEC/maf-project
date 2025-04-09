import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Social } from './entities/social.entity';
import { CreateSocialInput } from './dto/create-social.input';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Social) private socialRepository: Repository<Social>,
  ) {}

  async findAll(): Promise<Social[]> {
    return this.socialRepository.find();
  }

  async findOneByTypeAndLink(
    type: string,
    link: string,
  ): Promise<Social | null> {
    return this.socialRepository.findOne({ where: { type, link } });
  }

  async create(socialData: CreateSocialInput): Promise<Social> {
    const { type, link, clubId, userId } = socialData;

    if (!clubId && !userId) {
      throw new Error('Either clubId or userId must be provided');
    }

    const social = this.socialRepository.create({ type, link, clubId, userId });
    return this.socialRepository.save(social);
  }
}
