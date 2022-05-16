import { Test, TestingModule } from '@nestjs/testing';
import { PositionUserRoleController } from './position-user-role.controller';
import { PositionUserRoleService } from './position-user-role.service';

describe('PositionUserRoleController', () => {
  let controller: PositionUserRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionUserRoleController],
      providers: [PositionUserRoleService],
    }).compile();

    controller = module.get<PositionUserRoleController>(PositionUserRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
