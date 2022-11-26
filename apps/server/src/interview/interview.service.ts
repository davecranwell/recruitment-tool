import { Ability, subject } from '@casl/ability'
import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as sendgrid from '@sendgrid/mail'

import { Action } from 'src/casl/actions'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from 'src/user/entities/user.entity'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { CreateInterviewDto } from './dto/create-interview.dto'
import { Interview } from './entities/interview.entity'
import { Invitation } from 'src/invitation/entities/invitation.entity'

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

  async create(data: CreateInterviewDto) {
    const { startDateTime, endDateTime, positionId, stageId, applicantProfileId, attendees } = data

    const interview = await this.prisma.interview.create({
      data: {
        startDateTime,
        endDateTime,
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
            create: attendees.map((attendee) => ({ userId: attendee })),
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
