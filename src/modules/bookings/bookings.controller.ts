
import { Body, Controller, Get, Headers, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';

import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';
import * as jwt from 'jsonwebtoken';



@Controller('bookings')

export class BookingsController {

  constructor(private readonly bookingsService: BookingsService) {}



  @Post()

  create(@Body() dto: CreateBookingDto) {

    return this.bookingsService.create(dto);

  }



  @Get('owner')

  findForOwner(@Headers('authorization') authorization = '') {

    const token = authorization.replace(/^Bearer\s+/i, '').trim();



    if (!token) {

      throw new UnauthorizedException('يجب تسجيل الدخول كمالك.');

    }



    const secret = process.env.JWT_ACCESS_SECRET || 'fallback-access-secret-2026';



    try {

      const payload = jwt.verify(token, secret) as {

        sub?: string;

        accountType?: string;

      };



      if (!payload.sub || payload.accountType !== 'OWNER') {

        throw new UnauthorizedException('هذه الصفحة مخصصة للمالك فقط.');

      }



      return this.bookingsService.findForOwner(payload.sub);

    } catch {

      throw new UnauthorizedException('جلسة الدخول غير صالحة.');

    }

  }



  @Get()

  findAll() {

    return this.bookingsService.findAll();

  }



  @Patch(':id/status')

  updateStatus(

    @Param('id') id: string,

    @Body() body: { status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' },

  ) {

    return this.bookingsService.updateStatus(id, body.status);

  }

}

