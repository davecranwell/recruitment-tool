import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class InvitationCodeGuardBody extends AuthGuard('invitation-code-body') {}
