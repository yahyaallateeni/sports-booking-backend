import { Injectable, NotFoundException } from '@nestjs/common';
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
        latitude: dto.latitude ? Number(dto.latitude) : null,
        longitude: dto.longitude ? Number(dto.longitude) : null,
        googleMapsUrl: dto.googleMapsUrl || null,
        defaultHourlyPrice: Number(dto.defaultHourlyPrice)
      },
      include: {
        city: true,
        area: true,
        ownerProfile: true
      }
    });
  }

  async updateApprovalStatus(id: string, approvalStatus: 'APPROVED' | 'REJECTED') {
    const venue = await this.prisma.venue.findUnique({
      where: { id }
    });

    if (!venue) {
      throw new NotFoundException('الملعب غير موجود');
    }

    return this.prisma.venue.update({
      where: { id },
      data: { approvalStatus },
      include: {
        city: true,
        area: true,
        ownerProfile: true
      }
    });
  }
}
