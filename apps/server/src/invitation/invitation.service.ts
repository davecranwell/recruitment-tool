import { Ability } from '@casl/ability'
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { Action } from 'src/casl/actions'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from 'src/user/entities/user.entity'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { Invitation } from './entities/invitation.entity'

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

    return new Invitation(invitation)
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
    return await this.prisma.invitation.delete({
      where: { id },
    })
  }
}
