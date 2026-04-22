import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOwnerProfileDto } from './dto/create-owner-profile.dto';
import { OwnersService } from './owners.service';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post(':userId/profile')
  createProfile(@Param('userId') userId: string, @Body() dto: CreateOwnerProfileDto) {
    return this.ownersService.createOwnerProfile(userId, dto);
  }

  @Get(':userId/profile')
  getProfile(@Param('userId') userId: string) {
    return this.ownersService.getOwnerProfileByUserId(userId);
  }
}
