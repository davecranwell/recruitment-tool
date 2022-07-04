import { Test, TestingModule } from '@nestjs/testing'
import { RequestWithUser } from 'src/authentication/authentication.controller'
import { CaslPermissions } from 'src/casl/casl.permissions'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from 'src/user/entities/user.entity'
import { OrganisationController } from './organisation.controller'
import { OrganisationService } from './organisation.service'

describe('OrganisationController', () => {
  let controller: OrganisationController
  let service: OrganisationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganisationController],
      providers: [OrganisationService, PrismaService, CaslPermissions],
    }).compile()

    controller = await module.resolve<OrganisationController>(OrganisationController)
    service = await module.resolve<OrganisationService>(OrganisationService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // it('should list all users in an organisation', async () => {
  //   jest.spyOn(service, 'findUsers').mockImplementation(() =>
  //     Promise.resolve({
  //       data: [
  //         {
  //           user: new UserEntity(),
  //           organisationId: 1,
  //           createdAt: 1,
  //           updatedAt: 2
  //           role: 'ORGANISATION_OWNER',
  //           userId: 1,
  //         },
  //       ],
  //       meta: {},
  //     })
  //   )

  //   const request: any = {
  //     user: { id: 1 },
  //   }

  //   expect(await controller.findUsers(request, 1, null)).toBe(['users'])
  // })
})
