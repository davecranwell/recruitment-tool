import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UpdatesService {
  constructor(private prisma: PrismaService) {}

  async getUpdates(): Promise<User[]> {
    return this.prisma.user.findMany({})
  }

  async getUpdate(id: number): Promise<User> {
    const update = await this.prisma.user.findUnique({ where: { id } })
    if (update) return update
    throw new NotFoundException('Update not found')
  }
}
