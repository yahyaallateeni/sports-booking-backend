
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';



export class CreateBookingDto {

  @IsString()

  @IsNotEmpty()

  venueId!: string;



  @IsString()

  @IsNotEmpty()

  customerName!: string;



  @IsString()

  @IsNotEmpty()

  customerPhone!: string;



  @IsString()

  @IsNotEmpty()

  bookingDate!: string;



  @IsString()

  @IsNotEmpty()

  startTime!: string;



  @IsInt()

  @Min(1)

  durationHours!: number;



  @IsString()

  @IsOptional()

  notes?: string;

}

