import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicantProfileForOrganisationService } from './applicant-profile-for-organisation.service';
import { CreateApplicantProfileForOrganisationDto } from './dto/create-applicant-profile-for-organisation.dto';
import { UpdateApplicantProfileForOrganisationDto } from './dto/update-applicant-profile-for-organisation.dto';

@Controller('applicant-profile-for-organisation')
export class ApplicantProfileForOrganisationController {
  constructor(private readonly applicantProfileForOrganisationService: ApplicantProfileForOrganisationService) {}

  @Post()
  create(@Body() createApplicantProfileForOrganisationDto: CreateApplicantProfileForOrganisationDto) {
    return this.applicantProfileForOrganisationService.create(createApplicantProfileForOrganisationDto);
  }

  @Get()
  findAll() {
    return this.applicantProfileForOrganisationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantProfileForOrganisationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicantProfileForOrganisationDto: UpdateApplicantProfileForOrganisationDto) {
    return this.applicantProfileForOrganisationService.update(+id, updateApplicantProfileForOrganisationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantProfileForOrganisationService.remove(+id);
  }
}
