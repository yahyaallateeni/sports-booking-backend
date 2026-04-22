import { IsOptional, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  ownerProfileId!: string;

  @IsString()
  cityId!: string;

  @IsString()
  areaId!: string;

  @IsString()
  nameAr!: string;

  @IsString()
  slug!: string;

  @IsString()
  addressLine!: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  googleMapsUrl?: string;

  @IsString()
  defaultHourlyPrice!: string;
}
