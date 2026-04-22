import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerProfileDto } from './dto/create-owner-profile.dto';

@Injectable()
export class OwnersService {
  constructor(private readonly prisma: PrismaService) {}

  createOwnerProfile(userId: string, dto: CreateOwnerProfileDto) {
    return this.prisma.ownerProfile.create({
      data: {
        userId,
        businessName: dto.businessName,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        commercialRegNumber: dto.commercialRegNumber,
        taxNumber: dto.taxNumber
      }
    });
  }

  getOwnerProfileByUserId(userId: string) {
    return this.prisma.ownerProfile.findUnique({
      where: { userId },
      include: { venues: true }
    });
  }
}
