import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, Logger, BadRequestException, ValidationError } from '@nestjs/common'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import * as compression from 'compression'

import { SwaggerConfig } from './config/configuration.interface'
import { PrismaService } from './prisma/prisma.service'
import { AppModule } from './app.module'
import getLogLevels from './getLogLevels'
import { exit } from 'process'
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter'
import { NotFoundExceptionFilter } from './not-found-exception.filter'

const logger = new Logger()

const isProduction = process.env.NODE_ENV === 'production'

process.on('unhandledRejection', (err: PromiseRejectedResult) => {
  logger.error(`Unhandled promise rejection reason: ${err}`)
  exit(1)
})

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err}`)
  exit(1) // exit the process to avoid unknown state
})

process.on('SIGTERM', async () => {
  logger.log('SIGTERM sent to process.')
  exit(0)
})

process.on('SIGHUP', async () => {
  logger.log('SIGHUP sent to process.')
  exit(0)
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(isProduction),
  })

  if (isProduction) {
    // The frontend calls this server with X-Forwarded-For
    app.getHttpAdapter().getInstance().set('trust proxy', true)
  }

  app.use(compression())
  app.enableCors()
  app.use(helmet())
  app.use(helmet.frameguard({ action: 'deny' })) // Prevent any iframes
  app.use(helmet.hsts({ maxAge: 63072000 })) // Two years
  app.enableShutdownHooks()
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // this provides better structured error objects which are more
      // attributable to the field(s) on error
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors)
      },
      transformOptions: { enableImplicitConversion: true },
    })
  )
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter), new NotFoundExceptionFilter(httpAdapter))

  const configService = app.get(ConfigService)
  const swaggerConfig = configService.get<SwaggerConfig>('swagger')

  const prismaService: PrismaService = app.get(PrismaService)
  prismaService.enableShutdownHooks(app)

  // Swagger Api
  if (!isProduction && swaggerConfig.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refresh-token')
      .build()

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    }

    const document = SwaggerModule.createDocument(app, config, options)

    SwaggerModule.setup(swaggerConfig.path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: swaggerConfig.title,
    })
  }

  await app.listen(configService.get('port'))
  logger.log(`Ready on port ${configService.get('port')}`)

  if (!isProduction && swaggerConfig.enabled) {
    logger.log(`Open API documentation available on path: /${swaggerConfig.path}`)
  }
}
bootstrap()
