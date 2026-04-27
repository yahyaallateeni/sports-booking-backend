import { IsIn, IsString } from 'class-validator';

export class UpdateVenueApprovalStatusDto {
  @IsString()
  @IsIn(['APPROVED', 'REJECTED'])
  approvalStatus!: 'APPROVED' | 'REJECTED';
}
