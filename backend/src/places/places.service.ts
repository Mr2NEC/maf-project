import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlaceInput } from './dto/create-place.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place) private placesRepository: Repository<Place>,
  ) {}

  async findAll(): Promise<Place[]> {
    return this.placesRepository.find({ relations: ['clubs'] });
  }

  async findOneByLocation(
    country: string,
    city: string,
  ): Promise<Place | null> {
    return this.placesRepository.findOne({
      where: { country, city },
      relations: ['clubs'],
    });
  }

  async create(data: CreatePlaceInput): Promise<Place> {
    const { country, city } = data;
    if (!country || !city) {
      throw new BadRequestException('Country and city are required');
    }
    const place = this.placesRepository.create({ country, city });
    return this.placesRepository.save(place);
  }
}
