import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateAssessmentDto } from './dto/create-assessment.dto'
import { Assessment } from './entities/assessment.entity'

@Injectable()
export class AssessmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAssessmentDto) {
    // const { startDateTime, endDateTime, positionId, stageId, applicantProfileId, attendees } = data

    // const assessment = await this.prisma.interview.create({
    //   data: {
    //     startDateTime,
    //     endDateTime,
    //     scoringSystem: {
    //       connect: { id: 1 },
    //     },
    //     applicantProfile: {
    //       connect: { id: applicantProfileId },
    //     },
    //     stage: {
    //       connect: { id: stageId },
    //     },
    //     position: {
    //       connect: { id: positionId },
    //     },
    //     ...(attendees && {
    //       attendees: {
    //         create: Array.isArray(attendees)
    //           ? attendees.map((attendee) => ({ userId: attendee }))
    //           : { userId: attendees },
    //       },
    //     }),
    //   },
    // })

    // if (!assessment) throw new BadRequestException('This assessment could not be created')

    return new Assessment({})
  }
}
