import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.venue.findMany({
      include: { city: true, area: true, ownerProfile: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.venue.findUnique({
      where: { id },
      include: { city: true, area: true, ownerProfile: true }
    });
  }

  create(dto: CreateVenueDto) {
    return this.prisma.venue.create({
      data: {
        ownerProfileId: dto.ownerProfileId,
        cityId: dto.cityId,
        areaId: dto.areaId,
        nameAr: dto.nameAr,
        slug: dto.slug,
        addressLine: dto.addressLine,
        latitude: dto.latitude ? Number(dto.latitude) : undefined,
        longitude: dto.longitude ? Number(dto.longitude) : undefined,
        googleMapsUrl: dto.googleMapsUrl,
        defaultHourlyPrice: Number(dto.defaultHourlyPrice)
      }
    });
  }
}
