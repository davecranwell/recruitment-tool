import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

import { CreateAssessmentWithScoringDto } from './dto/create-assessment.dto'
import { Assessment } from './entities/assessment.entity'

@Injectable()
export class AssessmentService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateForInterview(data: CreateAssessmentWithScoringDto, userId: number) {
    const { score, applicantProfileId, positionId, interviewId, notes, scoringSystemId } = data

    const assessment = await this.prisma.assessment.upsert({
      where: {
        applicantProfileId_userId_positionId_interviewId_type: {
          applicantProfileId,
          userId,
          positionId,
          interviewId,
          type: 'INTERVIEW',
        },
      },
      update: {
        score,
        notes,
      },
      create: {
        type: 'INTERVIEW',
        scoringSystem: {
          connect: { id: scoringSystemId },
        },
        user: {
          connect: { id: userId },
        },
        applicantProfile: {
          connect: { id: applicantProfileId },
        },
        position: {
          connect: { id: positionId },
        },
        interview: {
          connect: { id: interviewId },
        },
      },
    })

    if (!assessment) throw new BadRequestException('This assessment could not be created')

    return new Assessment(assessment)
  }

  // async findByInterviewAndUser(applicantProfileId: number, interviewId: number, userId: number) {
  //   const assessment = await this.prisma.assessment.findFirst({
  //     where: { applicantProfileId, interviewId, userId },
  //   })

  //   if (assessment) {
  //     return new Assessment(assessment)
  //   }
  // }
}
