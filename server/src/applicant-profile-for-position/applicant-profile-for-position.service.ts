import { Injectable } from '@nestjs/common'
import { CreateApplicantProfileForPositionDto } from './dto/create-applicant-profile-for-position.dto'
import { UpdateApplicantProfileForPositionDto } from './dto/update-applicant-profile-for-position.dto'

@Injectable()
export class ApplicantProfileForPositionService {
  create(createApplicantProfileForPositionDto: CreateApplicantProfileForPositionDto) {
    return 'This action adds a new applicantProfileForPosition'
  }

  findAll() {
    return `This action returns all applicantProfileForPosition`
  }

  findOne(id: number) {
    return `This action returns a #${id} applicantProfileForPosition`
  }

  update(id: number, updateApplicantProfileForPositionDto: UpdateApplicantProfileForPositionDto) {
    return `This action updates a #${id} applicantProfileForPosition`
  }

  remove(id: number) {
    return `This action removes a #${id} applicantProfileForPosition`
  }
}
