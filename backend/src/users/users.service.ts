import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialsService } from 'src/socials/socials.service';
import { ClubsService } from 'src/clubs/clubs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private socialsRepository: SocialsService,
    private clubsRepository: ClubsService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const { lastName, firstName, username, birthdate, clubId, socials } =
      createUserInput;

    const user = this.usersRepository.create({
      lastName,
      firstName,
      username: username ?? `${firstName} ${lastName}`,
    });

    if (Array.isArray(socials) && socials.length > 0) {
      for (const social of socials) {
        await this.socialsRepository.create({
          ...social,
          userId: user.id,
        });
      }
    }

    if (birthdate) {
      user.birthdate = birthdate;
    }

    if (clubId) {
      const club = await this.clubsRepository.findOne(clubId);
      if (club) {
        user.clubId = club.id;
      }
    }

    return this.usersRepository.save(user);
  }

  async findAll(options?: FindManyOptions<User>) {
    return this.usersRepository.find({
      relations: ['socials', 'club'],
      ...options,
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['socials', 'club'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const { lastName, firstName, username, birthdate, clubId, socials } =
      updateUserInput;

    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (username) {
      user.username = username;
    }

    if (birthdate) {
      user.birthdate = birthdate;
    }

    if (clubId) {
      const club = await this.clubsRepository.findOne(clubId);
      if (club) {
        user.clubId = club.id;
      }
    }

    if (Array.isArray(socials) && socials.length > 0) {
      for (const social of socials) {
        const existingSocial =
          await this.socialsRepository.findOneByTypeAndLink(
            social.type,
            social.link,
          );
        if (!existingSocial) {
          await this.socialsRepository.create({
            ...social,
            userId: user.id,
          });
        }
      }
    }

    return this.usersRepository.save({ ...user });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.usersRepository.delete(id);
  }
}
