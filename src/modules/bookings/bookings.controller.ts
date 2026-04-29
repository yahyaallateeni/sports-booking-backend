
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { BookingsService } from './bookings.service';

import { CreateBookingDto } from './dto/create-booking.dto';



@Controller('bookings')

export class BookingsController {

  constructor(private readonly bookingsService: BookingsService) {}



  @Post()

  create(@Body() dto: CreateBookingDto) {

    return this.bookingsService.create(dto);

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

