import { NotFoundException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshTokenHash)

    if (isRefreshTokenMatching) return new UserEntity(user)
  }
}
