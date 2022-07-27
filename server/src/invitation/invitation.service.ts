import { Ability, subject } from '@casl/ability'
import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as sendgrid from '@sendgrid/mail'

import { Action } from 'src/casl/actions'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from 'src/user/entities/user.entity'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { Invitation } from './entities/invitation.entity'
import { text } from 'stream/consumers'

@Injectable()
export class InvitationService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async getById(id: number) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
    })

    if (invitation) {
      return new Invitation(invitation)
    }
  }

  async getByIdWithOrg(id: number) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id },
      include: { organisation: true },
    })

    if (invitation) {
      return new Invitation(invitation)
    }
  }

  async create(data: CreateInvitationDto, user: UserEntity) {
    const { email, role, organisationId } = data

    // get org
    const organisation = await this.prisma.organisation.findUnique({ where: { id: organisationId } })
    if (!organisation) throw new NotFoundException('Organisation with this ID does not exist')

    const ability = new Ability(user.abilities)
    if (!ability.can(Action.Manage, new Organisation({ id: organisationId }))) throw new ForbiddenException()

    const invitation = await this.prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        role: role,
        organisationId: organisationId,
      },
    })

    if (!invitation) throw new BadRequestException('This invitation could not be completed')

    const payload = { id: invitation.id }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('INVITATION_CODE_SECRET'),
      expiresIn: `${this.configService.get('INVITATION_CODE_EXPIRATION_TIME')}s`,
    })

    const invitationMsg = {
      to: email.toLowerCase(),
      from: this.configService.get('EMAIL_FROM'),
      templateId: 'd-2bd9612619864fbcb8993050e871d5a8',
      dynamicTemplateData: {
        organisationName: organisation.name,
        invitationUrl: `http://localhost:3001/invitation-sign-in?token=${token}`,
      },
    }

    sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'))
    await sendgrid.send(invitationMsg)

    return new Invitation(invitation)
  }

  // findAll() {
  //   return `This action returns all invitation`;
  // }

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
    return await this.prisma.invitation.delete({
      where: { id },
    })
  }
}
