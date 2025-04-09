import { Injectable } from '@nestjs/common';
import { CreateClubInput } from './dto/create-club.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { PlacesService } from 'src/places/places.service';
import { ClubOwnersService } from 'src/club-owners/club-owners.service';
import { SocialsService } from 'src/socials/socials.service';
import { Social } from 'src/socials/entities/social.entity';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club) private readonly clubsRepository: Repository<Club>,
    private readonly ownerService: ClubOwnersService,
    private readonly placesService: PlacesService,
    private readonly socialsService: SocialsService,
  ) {}

  async create(createClubInput: CreateClubInput): Promise<Club> {
    const { owner, place, socials, ...clubData } = createClubInput;

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

  findAll(): Promise<Club[]> {
    return this.clubsRepository.find({
      relations: ['owner', 'place', 'socials'],
    });
  }

  findOne(id: number): Promise<Club | null> {
    return this.clubsRepository.findOne({
      where: { id },
      relations: ['owner', 'place', 'socials'],
    });
  }
}
