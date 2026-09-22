import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, FindManyOptions, Repository } from 'typeorm';
import { UserRole } from 'src/enums/user-role.enum';
import { ProfilesService } from 'src/profiles/profiles.service';
import { CreateSocialInput } from 'src/socials/dto/create-social.input';
import { SocialsService } from 'src/socials/socials.service';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

type NewUser = Pick<User, 'username' | 'email'> & { password: string };

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly socialsService: SocialsService,
    private readonly profileService: ProfilesService,
  ) {}

  /** Creates a user with an empty profile. `password` must already be hashed. */
  async create(input: NewUser): Promise<User> {
    const profile = await this.profileService.create({});
    const user = this.usersRepository.create({
      ...input,
      role: UserRole.USER,
      profile,
    });
    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.id);
  }

  findAll(options?: FindManyOptions<User>) {
    return this.usersRepository.find({
      relations: ['socials', 'club', 'profile'],
      ...options,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['socials', 'club', 'profile'],
    });
    if (!user) {
      throw new EntityNotFoundError(User, { id });
    }
    return user;
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.usersRepository.existsBy({ email });
  }

  /** The only place where the password hash is loaded. */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  /** Minimal lookup used on every authenticated request. */
  findAuthInfo(id: number): Promise<Pick<User, 'id' | 'role'> | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: { id: true, role: true },
    });
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    const { firstName, lastName, birthdate, username, socials } = input;
    const user = await this.findOne(id);

    if (username !== undefined) {
      user.username = username;
    }

    if (
      firstName !== undefined ||
      lastName !== undefined ||
      birthdate !== undefined
    ) {
      user.profile = await this.profileService.update(user.profileId, {
        firstName,
        lastName,
        birthdate,
      });
    }

    // Save before adding socials: saving an entity with a loaded relation array
    // would unlink socials created after it was loaded
    await this.usersRepository.save(user);

    if (socials?.length) {
      await this.addMissingSocials(user, socials);
    }

    return this.findOne(id);
  }

  async setRole(id: number, role: UserRole): Promise<User> {
    await this.findOne(id);
    await this.usersRepository.update(id, { role });
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected === 1;
  }

  private async addMissingSocials(
    user: User,
    socials: CreateSocialInput[],
  ): Promise<void> {
    const existing = await this.socialsService.findByUserId(user.id);

    const newSocials = socials.filter(
      social =>
        !existing.some(
          current =>
            current.type === social.type && current.link === social.link,
        ),
    );

    await Promise.all(
      newSocials.map(social =>
        this.socialsService.create({
          ...social,
          userId: user.id,
          clubId: undefined,
        }),
      ),
    );
  }
}
