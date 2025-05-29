import { Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async create(data: CreateProfileInput) {
    const profile = this.profilesRepository.create({ ...data });

    return this.profilesRepository.save(profile);
  }

  async findOne(id: number) {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  async update(id: number, data: UpdateProfileInput) {
    const { firstName, lastName, birthdate } = data;
    const profile = await this.findOne(id);

    if (typeof firstName !== 'undefined') profile.firstName = firstName;
    if (typeof lastName !== 'undefined') profile.lastName = lastName;
    if (typeof birthdate !== 'undefined') profile.birthdate = birthdate;

    return this.profilesRepository.save(profile);
  }
}
