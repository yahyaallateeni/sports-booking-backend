
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBookingDto } from './dto/create-booking.dto';



@Injectable()

export class BookingsService {

  constructor(private readonly prisma: PrismaService) {}



  async create(dto: CreateBookingDto) {

    const venue = await this.prisma.venue.findUnique({

      where: { id: dto.venueId },

    });



    if (!venue) {

      throw new NotFoundException('الملعب غير موجود');

    }



    if (venue.approvalStatus !== 'APPROVED') {

      throw new BadRequestException('لا يمكن الحجز في ملعب غير معتمد');

    }



    const durationHours = Number(dto.durationHours);



    if (!Number.isFinite(durationHours) || durationHours < 1) {

      throw new BadRequestException('مدة الحجز غير صحيحة');

    }



    const totalPrice = Number(venue.defaultHourlyPrice) * durationHours;



    return this.prisma.booking.create({

      data: {

        venueId: dto.venueId,

        customerName: dto.customerName,

        customerPhone: dto.customerPhone,

        bookingDate: new Date(dto.bookingDate),

        startTime: dto.startTime,

        durationHours,

        notes: dto.notes || null,

        totalPrice,

      },

      include: {

        venue: true,

      },

    });

  }



  async findAll() {

    return this.prisma.booking.findMany({

      orderBy: { createdAt: 'desc' },

      include: {

        venue: true,

      },

    });

  }



  async updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {

    const booking = await this.prisma.booking.findUnique({

      where: { id },

    });



    if (!booking) {

      throw new NotFoundException('الحجز غير موجود');

    }



    return this.prisma.booking.update({

      where: { id },

      data: { status },

      include: {

        venue: true,

      },

    });

  }

}

