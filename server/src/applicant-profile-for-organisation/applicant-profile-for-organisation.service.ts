import { Injectable } from '@nestjs/common'
import { CreateApplicantProfileForOrganisationDto } from './dto/create-applicant-profile-for-organisation.dto'
import { UpdateApplicantProfileForOrganisationDto } from './dto/update-applicant-profile-for-organisation.dto'

@Injectable()
export class ApplicantProfileForOrganisationService {
  create(createApplicantProfileForOrganisationDto: CreateApplicantProfileForOrganisationDto) {
    return 'This action adds a new applicantProfileForOrganisation'
  }

  findAll() {
    return `This action returns all applicantProfileForOrganisation`
  }

  findOne(id: number) {
    return `This action returns a #${id} applicantProfileForOrganisation`
  }

  update(id: number, updateApplicantProfileForOrganisationDto: UpdateApplicantProfileForOrganisationDto) {
    return `This action updates a #${id} applicantProfileForOrganisation`
  }

  remove(id: number) {
    return `This action removes a #${id} applicantProfileForOrganisation`
  }
}
