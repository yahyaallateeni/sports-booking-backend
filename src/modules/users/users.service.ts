import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from '../auth/dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserWithProfile(dto: RegisterUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const fullName = `${dto.firstName} ${dto.lastName}`.trim();

    return this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        accountType: dto.accountType,
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            fullName
          }
        }
      },
      include: { profile: true }
    });
  }

  findByEmailOrPhone(value: string) {
    return this.prisma.user.findFirst({ where: { OR: [{ email: value }, { phone: value }] } });
  }

  findPublicProfileById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, ownerProfile: true }
    });
  }
}
