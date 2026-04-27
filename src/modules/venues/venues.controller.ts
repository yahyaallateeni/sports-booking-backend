import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueApprovalStatusDto } from './dto/update-venue-approval-status.dto';
import { VenuesService } from './venues.service';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateVenueDto) {
    return this.venuesService.create(dto);
  }

  @Patch(':id/approval-status')
  updateApprovalStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVenueApprovalStatusDto
  ) {
    return this.venuesService.updateApprovalStatus(id, dto.approvalStatus);
  }
}
