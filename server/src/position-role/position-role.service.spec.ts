import { Test, TestingModule } from '@nestjs/testing';
import { PositionRoleService } from './position-role.service';

describe('PositionRoleService', () => {
  let service: PositionRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionRoleService],
    }).compile();

    service = module.get<PositionRoleService>(PositionRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
