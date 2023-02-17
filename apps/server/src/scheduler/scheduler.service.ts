import { Logger, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'
import * as sendgrid from '@sendgrid/mail'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name)

  constructor(
    private prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Cron('0,30 * * * * *')
  async sendUnsentInvitations() {
    const unsent = await this.prisma.invitation.findMany({
      where: { sent: false },
      include: { organisation: true },
    })

    if (unsent.length) this.logger.log(`Sending ${unsent.length} invitations`)

    for (const invitation of unsent) {
      const { email, id, organisation } = invitation

      const payload = { id }
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('INVITATION_CODE_SECRET'),
        expiresIn: `${this.configService.get('INVITATION_CODE_EXPIRATION_TIME')}s`,
      })

      const invitationMsg = {
        to: email.toLowerCase(),
        from: this.configService.get('EMAIL_FROM'),
        templateId: this.configService.get('EMAIL_TEMPLATE_INVITATION'),
        dynamicTemplateData: {
          organisationName: organisation.name,
          invitationUrl: `${this.configService.get('ROOT_URL')}/invitation-sign-in?token=${token}`,
        },
      }

      sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'))
      await sendgrid.send(invitationMsg)
    }

    await this.prisma.invitation.updateMany({
      where: { id: { in: unsent.map((un) => un.id) } },
      data: { sent: true },
    })
  }
}
