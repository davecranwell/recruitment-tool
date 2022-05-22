import { NotFoundException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from './entities/user.entity'
import { FindOneDto } from 'src/util/shared.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const record = await this.prisma.organisation.findUnique({ where: { id } })
    if (!record) throw new NotFoundException('Organisation with this ID does not exist')

    return record
  }

  // TODO deprecate this
  async getById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (user) {
      return new UserEntity(user)
    }
    throw new NotFoundException('User with this id does not exist')
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (user) {
      return new UserEntity(user)
    }
    throw new NotFoundException('User with this email does not exist')
  }

  async getByEmailWithOrgs(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      // This double inclusion is ugly but saves a query, so stays for now.
      // If this is changed, the session processing in remix needs changes too.
      include: { organisations: { include: { organisation: true } } },
    })
    if (user) {
      return new UserEntity(user)
    }
    throw new NotFoundException('User with this email does not exist')
  }

  async create(accountData: { email: string; password?: string }): Promise<UserEntity> {
    return new UserEntity(await this.prisma.user.create({ data: accountData }))
  }

  async setRefreshToken(refreshToken: string, userId: number) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    })
  }

  async removeRefreshToken(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    })
  }

  async getUserIfRefreshTokenMatches(userId: number, jwtId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    const isRefreshTokenMatching = await bcrypt.compare(jwtId, user.refreshTokenHash)

    if (isRefreshTokenMatching) return new UserEntity(user)
  }

  async findOrganisations(params: FindOneDto) {
    const { id } = params

    return this.prisma.organisation.findMany({
      where: { users: { some: { userId: id } } },
    })
  }
}
