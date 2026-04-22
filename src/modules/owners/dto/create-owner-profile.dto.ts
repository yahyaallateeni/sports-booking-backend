import { IsOptional, IsString } from 'class-validator';

export class CreateOwnerProfileDto {
  @IsString()
  businessName!: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  commercialRegNumber?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;
}
