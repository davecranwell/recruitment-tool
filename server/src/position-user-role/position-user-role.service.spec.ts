import { Test, TestingModule } from '@nestjs/testing';
import { PositionUserRoleService } from './position-user-role.service';

describe('PositionUserRoleService', () => {
  let service: PositionUserRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionUserRoleService],
    }).compile();

    service = module.get<PositionUserRoleService>(PositionUserRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
