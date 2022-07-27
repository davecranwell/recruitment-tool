import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { HttpException, BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { PostgresErrorCode } from '../util/db-types'
import { UserService } from '../user/user.service'

import { JwtTokenPayload, MagicTokenPayload } from './strategies/types'
import { CaslPermissions } from 'src/casl/casl.permissions'
import { Invitation } from 'src/invitation/entities/invitation.entity'
import { RegisterFromInvitationDto } from './dto/register.dto'
import { UserEntity } from 'src/user/entities/user.entity'
import { User } from '@prisma/client'
import { InvitationService } from 'src/invitation/invitation.service'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly invitationService: InvitationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly caslPermissions: CaslPermissions
  ) {}

  // public async register(registrationData) {
  //   const hashedPassword = registrationData.password ? await bcrypt.hash(registrationData.password, 10) : null

  //   try {
  //     return await this.userService.create({
  //       ...registrationData,
  //       password: hashedPassword,
  //     })
  //   } catch (error) {
  //     if (error?.code === PostgresErrorCode.UniqueViolation) {
  //       throw new BadRequestException('User with that email already exists')
  //     }
  //     throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // }

  public async signInById(userId: number) {
    const user = await this.getAuthenticatedUserById(userId)

    const { token: accessToken } = this.generateJwtToken(userId)
    const { token: refreshToken, jwtid } = this.generateJwtRefreshToken(userId)

    await this.userService.setRefreshToken(jwtid, userId)

    return { user, accessToken, refreshToken }
  }

  public async registerFromInvitation(invitation: Invitation, registrationData: RegisterFromInvitationDto) {
    const hashedPassword = registrationData.password ? await bcrypt.hash(registrationData.password, 10) : null

    try {
      const user = await this.userService.create(
        {
          name: registrationData.name,
          email: invitation.email,
          password: hashedPassword,
        },
        invitation
      )

      await this.invitationService.remove(invitation.id)

      return user
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists')
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  public generateJwtToken(userId: number) {
    const payload: JwtTokenPayload = { userId }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    })

    return {
      token,
      cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`,
    }
  }

  public generateJwtRefreshToken(userId: number) {
    // give it a unique property that we hash in the DB for comparison later
    const jwtid = uuidv4()
    const payload: JwtTokenPayload = { userId, jwtid }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}s`,
    })

    return {
      token,
      jwtid,
      cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}`,
    }
  }

  private async addAbilities(user: UserEntity) {
    user.abilities = await this.caslPermissions.asJsonForUser(user)
    return user
  }

  public async getAuthenticatedUserById(id: number) {
    return this.addAbilities(await this.userService.getById(id))
  }

  public async authenticateEmailPassword(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmailWithDetailedOrgs(email)
      await this.verifyPassword(plainTextPassword, user.password)

      user.password = undefined

      return this.addAbilities(user)
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials provided')
    }
  }

  public getCookiesForLogOut() {
    return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0']
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword)
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong credentials provided')
    }
  }

  public sendMagicLink(email: string) {
    const payload: MagicTokenPayload = { email }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('MAGIC_LINK_SECRET'),
      expiresIn: `${this.configService.get('MAGIC_LINK_EXPIRATION_TIME')}s`,
    })

    return {
      callback: `/log-in/magic/callback?token=${token}`,
    }
  }
}
