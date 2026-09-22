import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityNotFoundError, Like, Repository } from 'typeorm';
import { JwtUser } from 'src/auth/types/jwt-user';
import { ClubAccessService } from 'src/club-members/club-access.service';
import { ClubMember } from 'src/club-members/entities/club-member.entity';
import { ClubOwnersService } from 'src/club-owners/club-owners.service';
import { PaginationArgs } from 'src/common/dto/pagination.args';
import { containsPattern } from 'src/common/utils/like';
import { ClubRole } from 'src/enums/club-role.enum';
import { MembershipStatus } from 'src/enums/membership-status.enum';
import { PlacesService } from 'src/places/places.service';
import { RatingPointsService } from 'src/rating/rating-points.service';
import { Social } from 'src/socials/entities/social.entity';
import { SocialsService } from 'src/socials/socials.service';
import { CreateClubInput } from './dto/create-club.input';
import { ImportClubInput } from './dto/import-club.input';
import { UpdateClubInput } from './dto/update-club.input';
import { Club } from './entities/club.entity';
import { RatingRules } from './entities/rating-rules';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club) private readonly clubsRepository: Repository<Club>,
    private readonly dataSource: DataSource,
    private readonly access: ClubAccessService,
    private readonly ratingPoints: RatingPointsService,
    private readonly ownerService: ClubOwnersService,
    private readonly placesService: PlacesService,
    private readonly socialsService: SocialsService,
  ) {}

  /** Imports a club from the catalogue (seed script); idempotent by title. */
  async importClub(input: ImportClubInput): Promise<Club> {
    const { owner, place, socials, ...clubData } = input;

    let ownerEntity = await this.ownerService.findOneByName(owner.name);
    if (!ownerEntity) {
      ownerEntity = await this.ownerService.create(owner);
    }

    let placeEntity = await this.placesService.findOneByLocation(
      place.country,
      place.city,
    );
    if (!placeEntity) {
      placeEntity = await this.placesService.create(place);
    }

    let club = await this.clubsRepository.findOne({
      where: { title: clubData.title },
    });

    if (!club) {
      club = this.clubsRepository.create({
        ...clubData,
        owner: ownerEntity,
        place: placeEntity,
      });
    }

    const socialEntities: Social[] = [];
    for (const social of socials) {
      let socialEntity = await this.socialsService.findOneByTypeAndLink(
        social.type,
        social.link,
      );
      if (!socialEntity) {
        socialEntity = await this.socialsService.create({
          ...social,
          clubId: club.id,
        });
      }
      socialEntities.push(socialEntity);
    }

    club.socials = socialEntities;

    return this.clubsRepository.save(club);
  }

  findAll({ skip, take }: PaginationArgs, search?: string): Promise<Club[]> {
    return this.clubsRepository.find({
      where: search ? { title: Like(containsPattern(search)) } : {},
      relations: ['owner', 'place', 'socials'],
      order: { title: 'ASC' },
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Club> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['owner', 'place', 'socials'],
    });
    if (!club) {
      throw new EntityNotFoundError(Club, { id });
    }
    return club;
  }

  /** Any signed-in user can found a club and becomes its admin. */
  async create(user: JwtUser, input: CreateClubInput): Promise<Club> {
    if (await this.clubsRepository.existsBy({ title: input.title })) {
      throw new ConflictException('A club with this name already exists');
    }
    const id = await this.dataSource.transaction(async manager => {
      const { identifiers } = await manager.insert(Club, {
        title: input.title,
        region: input.region,
        description: input.description ?? null,
      });
      const clubId = (identifiers[0] as { id: number }).id;
      await manager.insert(ClubMember, {
        clubId,
        userId: user.userId,
        role: ClubRole.ADMIN,
        status: MembershipStatus.ACTIVE,
      });
      return clubId;
    });
    return this.findOne(id);
  }

  async update(
    user: JwtUser,
    id: number,
    input: UpdateClubInput,
  ): Promise<Club> {
    await this.access.assert(user, id, ClubRole.ADMIN);
    if (Object.keys(input).length > 0) {
      await this.clubsRepository.update(id, input);
    }
    return this.findOne(id);
  }

  /** New rules apply to every finished game of the club, not only future ones. */
  async updateRatingRules(
    user: JwtUser,
    id: number,
    rules: RatingRules,
  ): Promise<Club> {
    await this.access.assert(user, id, ClubRole.ADMIN);
    await this.dataSource.transaction(async manager => {
      await manager.update(Club, id, { ratingRules: rules });
      await this.ratingPoints.recalculate(rules, { clubId: id }, manager);
    });
    return this.findOne(id);
  }
}
