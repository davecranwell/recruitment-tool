import { Logger, Injectable, INestApplication, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({ log: ['info'] })
    // super({
    //   log: [
    //     {
    //       emit: 'event',
    //       level: 'query',
    //     },
    //     {
    //       emit: 'event',
    //       level: 'error',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'info',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'warn',
    //     },
    //   ],
    // }) // 'query'
  }

  async onModuleInit() {
    this.logger.log('Connected to Postgres')
    await this.$connect()

    // this.$on('query' as any, (e) => {
    //   console.log(e)
    // })
  }

  async onModuleDestroy() {
    this.logger.log('Disconnected from Postgres')
    await this.$disconnect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
