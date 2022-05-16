import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesOfUserService } from './user-roles-of-user.service';

describe('UserRolesOfUserService', () => {
  let service: UserRolesOfUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRolesOfUserService],
    }).compile();

    service = module.get<UserRolesOfUserService>(UserRolesOfUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
