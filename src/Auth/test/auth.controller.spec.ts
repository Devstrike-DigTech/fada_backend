import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from '../strategies';

describe('Auth Controller', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService, RefreshTokenStrategy, AccessTokenStrategy],
    }).compile();
  });
});
