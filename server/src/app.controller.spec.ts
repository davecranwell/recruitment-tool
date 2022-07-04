import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let module: TestingModule

  let controller: AppController

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    controller = await module.resolve<AppController>(AppController)
  })

  describe('getHello', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined()
    })
  })
})
