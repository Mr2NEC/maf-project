import { Injectable } from '@nestjs/common';
import { ClubOwner } from './entities/club-owner.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClubOwnerInput } from './dto/create-club-owner.input';

@Injectable()
export class ClubOwnersService {
  constructor(
    @InjectRepository(ClubOwner) private ownerRepo: Repository<ClubOwner>,
  ) {}

  create(input: CreateClubOwnerInput): Promise<ClubOwner> {
    const club = this.ownerRepo.create(input);
    return this.ownerRepo.save(club);
  }

  findAll(): Promise<ClubOwner[]> {
    return this.ownerRepo.find();
  }

  async findOneByName(name: string): Promise<ClubOwner | null> {
    return this.ownerRepo.findOne({ where: { name } });
  }
}
