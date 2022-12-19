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

  // async getByEmailAndOrg(email: string, organisationId: number): Promise<Invitation> {
  //   const invitation = await this.prisma.invitation.findUnique({
  //     where: {
  //       email_organisationId: {
  //         email: email.toLowerCase(),
  //         organisationId,
  //       },
  //     },
  //   })
  //   if (invitation) return new Invitation(invitation)

  //   throw new NotFoundException('Invitation with these details does not exist')
  // }

  // async acceptCode(code: Invitation) {
  //   return await this.prisma.invitation.delete({
  //     where: {
  //       email_organisationId: {
  //         email: code.email,
  //         organisationId: code.organisationId,
  //       },
  //     },
  //   })
  // }

  // update(id: number, updateInvitationDto: UpdateInvitationDto) {
  //   return `This action updates a #${id} invitation`;
  // }

  async remove(id: number) {
    return await this.prisma.interview.delete({
      where: { id },
    })
  }
}
