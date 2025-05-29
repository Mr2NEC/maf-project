import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { EntityNotFoundError, FindManyOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialsService } from 'src/socials/socials.service';
import { ClubsService } from 'src/clubs/clubs.service';
import { CreateSocialInput } from 'src/socials/dto/create-social.input';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private socialsService: SocialsService,
    private clubsService: ClubsService,
    private profileService: ProfilesService,
  ) {}

  async create(input: CreateUserInput) {
    const { email, username, password, clubId, socials } = input;

    const user = await this.createUser({
      username,
      email,
      password,
    });

    const profile = await this.profileService.create({});
    user.profile = profile;

    if (Array.isArray(socials)) {
      await this.manageUserSocials(user, socials);
    }

    await this.manageUserClub(user, clubId);

    return this.usersRepository.save(user);
  }

  async createUser(input: CreateUserInput) {
    const user = await this.usersRepository.create({ ...input });
    return this.usersRepository.save(user);
  }

  async findAll(options?: FindManyOptions<User>) {
    return this.usersRepository.find({
      relations: ['socials', 'club', 'profile'],
      ...options,
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['socials', 'club', 'profile'],
    });
    if (!user) {
      throw new EntityNotFoundError(User, { id });
    }
    return user;
  }

  async findOneBy(data: Record<string, string | number>) {
    return this.usersRepository.findOneByOrFail({ ...data });
  }

  async update(id: number, input: UpdateUserInput) {
    const { lastName, firstName, username, birthdate, clubId, socials } = input;

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (typeof username !== 'undefined') user.username = username;

    if (firstName || lastName || birthdate) {
      const profile = await this.profileService.update(user.profileId, {
        firstName,
        lastName,
        birthdate,
      });

      user.profile = profile;
    }

    if (Array.isArray(socials)) {
      await this.manageUserSocials(user, socials);
    }

    await this.manageUserClub(user, clubId);

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const result = await this.usersRepository.delete(id);
    return result.affected === 1;
  }

  async manageUserSocials(
    user: User,
    socialsArray: CreateSocialInput[],
  ): Promise<void> {
    if (!socialsArray.length) return;

    const existingSocials = await this.socialsService.findByUserId(user.id);

    const newSocials = Array.isArray(existingSocials)
      ? socialsArray.filter(social => {
          return !existingSocials.some(
            existing =>
              existing.type === social.type && existing.link === social.link,
          );
        })
      : socialsArray;

    await Promise.all(
      newSocials.map(social =>
        this.socialsService.create({
          ...social,
          userId: user.id,
        }),
      ),
    );
  }

  async manageUserClub(user: User, clubId?: number | null): Promise<void> {
    if (clubId === null) {
      user.clubId = null;
      return;
    }

    if (typeof clubId !== 'undefined') {
      const club = await this.clubsService.findOne(clubId);
      if (!club)
        throw new NotFoundException(`Club with ID ${clubId} not found`);
      user.clubId = club.id;
    }
  }
}
