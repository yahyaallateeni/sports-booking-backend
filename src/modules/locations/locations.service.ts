import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  findCities() {
    return this.prisma.city.findMany({ orderBy: { nameAr: 'asc' } });
  }

  findAreasByCity(cityId: string) {
    return this.prisma.area.findMany({ where: { cityId }, orderBy: { nameAr: 'asc' } });
  }
}
