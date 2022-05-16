import { PartialType } from '@nestjs/swagger';
import { CreateUsersInOrganisationDto } from './create-users-in-organisation.dto';

export class UpdateUsersInOrganisationDto extends PartialType(CreateUsersInOrganisationDto) {}
