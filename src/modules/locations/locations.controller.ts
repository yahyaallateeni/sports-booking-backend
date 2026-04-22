import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('cities')
  findCities() {
    return this.locationsService.findCities();
  }

  @Get('cities/:cityId/areas')
  findAreas(@Param('cityId') cityId: string) {
    return this.locationsService.findAreasByCity(cityId);
  }
}
