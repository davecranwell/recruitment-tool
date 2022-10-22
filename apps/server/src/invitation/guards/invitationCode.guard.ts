import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class InvitationCodeGuardQuery extends AuthGuard('invitation-code-query') {}
