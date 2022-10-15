import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApplicantProfileForPositionService } from './applicant-profile-for-position.service'
import { CreateApplicantProfileForPositionDto } from './dto/create-applicant-profile-for-position.dto'
import { UpdateApplicantProfileForPositionDto } from './dto/update-applicant-profile-for-position.dto'

@Controller('applicant-profile-for-position')
export class ApplicantProfileForPositionController {
  constructor(private readonly applicantProfileForPositionService: ApplicantProfileForPositionService) {}

  @Post()
  create(@Body() createApplicantProfileForPositionDto: CreateApplicantProfileForPositionDto) {
    return this.applicantProfileForPositionService.create(createApplicantProfileForPositionDto)
  }

  @Get()
  findAll() {
    return this.applicantProfileForPositionService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantProfileForPositionService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicantProfileForPositionDto: UpdateApplicantProfileForPositionDto) {
    return this.applicantProfileForPositionService.update(+id, updateApplicantProfileForPositionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantProfileForPositionService.remove(+id)
  }
}
