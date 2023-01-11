import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateInterviewDto } from './dto/create-interview.dto'
import { Interview } from './entities/interview.entity'

@Injectable()
export class InterviewService {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
    })

    if (interview) {
      return new Interview(interview)
    }
  }

  async findByApplicantAndStage(applicantProfileId: number, stageId: number) {
    const interview = await this.prisma.interview.findFirst({
      where: { applicantProfileId, stageId },
    })

    if (interview) {
      return new Interview(interview)
    }
  }

  async create(data: CreateInterviewDto) {
    const { startDateTime, endDateTime, positionId, stageId, applicantProfileId, attendees } = data

    const interview = await this.prisma.interview.create({
      data: {
        startDateTime,
        endDateTime,
        scoringSystem: {
          connect: { id: 1 },
        },
        applicantProfile: {
          connect: { id: applicantProfileId },
        },
        stage: {
          connect: { id: stageId },
        },
        position: {
          connect: { id: positionId },
        },
        ...(attendees && {
          attendees: {
            create: Array.isArray(attendees)
              ? attendees.map((attendee) => ({ userId: attendee }))
              : { userId: attendees },
          },
        }),
      },
    })

    if (!interview) throw new BadRequestException('This interview could not be created')

    return new Interview(interview)
  }
}
