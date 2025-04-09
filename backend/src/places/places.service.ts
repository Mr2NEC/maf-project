import { Injectable } from '@nestjs/common';
import { CreatePlaceInput } from './dto/create-place.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlacesService {
  constructor(@InjectRepository(Place) private placeRepo: Repository<Place>) {}

  async findAll(): Promise<Place[]> {
    return this.placeRepo.find();
  }

  async findOneByLocation(
    country: string,
    city: string,
  ): Promise<Place | null> {
    return this.placeRepo.findOne({ where: { country, city } });
  }

  async create(placeData: CreatePlaceInput): Promise<Place> {
    const place = this.placeRepo.create(placeData);
    return this.placeRepo.save(place);
  }
}
