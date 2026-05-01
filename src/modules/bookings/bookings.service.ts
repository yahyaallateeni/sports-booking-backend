
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBookingDto } from './dto/create-booking.dto';



@Injectable()

export class BookingsService {

  constructor(private readonly prisma: PrismaService) {}



  private parseTimeToMinutes(value: string): number {

    const [hourRaw, minuteRaw] = String(value || '00:00').split(':');

    const hour = Number(hourRaw || 0);

    const minute = Number(minuteRaw || 0);



    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {

      return 0;

    }



    return hour * 60 + minute;

  }



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



    const requestedStartMinutes = this.parseTimeToMinutes(dto.startTime);

    const requestedEndMinutes = requestedStartMinutes + durationHours * 60;



    const dayStart = new Date(`${dto.bookingDate}T00:00:00.000Z`);

    const dayEnd = new Date(`${dto.bookingDate}T23:59:59.999Z`);



    const existingBookings = await this.prisma.booking.findMany({

      where: {

        venueId: dto.venueId,

        bookingDate: {

          gte: dayStart,

          lte: dayEnd,

        },

        status: {

          in: ['PENDING', 'CONFIRMED'],

        },

      },

      select: {

        startTime: true,

        durationHours: true,

      },

    });



    const hasOverlap = existingBookings.some((booking) => {

      const existingStartMinutes = this.parseTimeToMinutes(booking.startTime);

      const existingEndMinutes =

        existingStartMinutes + Number(booking.durationHours || 1) * 60;



      return requestedStartMinutes < existingEndMinutes && existingStartMinutes < requestedEndMinutes;

    });



    if (hasOverlap) {

      throw new BadRequestException('هذا الوقت مشغول بالفعل لهذا الملعب. اختر وقتًا آخر.');

    }



    const totalPrice = Number(venue.defaultHourlyPrice) * durationHours;



    return this.prisma.booking.create({

      data: {

        venueId: dto.venueId,

        customerUserId: dto.customerUserId || null,

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



  async getVenueAvailability(venueId: string, date: string) {

    if (!venueId || !date) {

      throw new BadRequestException('بيانات الملعب أو التاريخ غير صحيحة');

    }



    const dayStart = new Date(`${date}T00:00:00.000Z`);

    const dayEnd = new Date(`${date}T23:59:59.999Z`);



    if (Number.isNaN(dayStart.getTime())) {

      throw new BadRequestException('صيغة التاريخ غير صحيحة');

    }



    const bookings = await this.prisma.booking.findMany({

      where: {

        venueId,

        bookingDate: {

          gte: dayStart,

          lte: dayEnd,

        },

        status: {

          in: ['PENDING', 'CONFIRMED'],

        },

      },

      orderBy: {

        startTime: 'asc',

      },

      select: {

        id: true,

        startTime: true,

        durationHours: true,

        status: true,

      },

    });



    const busySlots = bookings.map((booking) => {

      const [hourRaw, minuteRaw] = String(booking.startTime || '00:00').split(':');

      const startHour = Number(hourRaw || 0);

      const startMinute = Number(minuteRaw || 0);

      const durationHours = Number(booking.durationHours || 1);



      const startTotalMinutes = startHour * 60 + startMinute;

      const endTotalMinutes = startTotalMinutes + durationHours * 60;



      const endHour = Math.floor(endTotalMinutes / 60);

      const endMinute = endTotalMinutes % 60;



      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;



      return {

        id: booking.id,

        startTime: booking.startTime,

        endTime,

        durationHours,

        status: booking.status,

      };

    });



    return {

      venueId,

      date,

      busySlots,

    };

  }



  async findAll() {

    return this.prisma.booking.findMany({

      orderBy: { createdAt: 'desc' },

      include: {

        venue: true,

      },

    });

  }



  async findForOwner(userId: string) {

    return this.prisma.booking.findMany({

      where: {

        venue: {

          ownerProfile: {

            userId,

          },

        },

      },

      orderBy: { createdAt: 'desc' },

      include: {

        venue: true,

      },

    });

  }



  async findForCustomer(userId: string) {

    return this.prisma.booking.findMany({

      where: {

        customerUserId: userId,

      },

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

