import { PartialType } from '@nestjs/swagger';
import { CreateApplicantProfileForPositionDto } from './create-applicant-profile-for-position.dto';

export class UpdateApplicantProfileForPositionDto extends PartialType(CreateApplicantProfileForPositionDto) {}
