import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { userSchema } from './models/user.model';
import { AUTH_MGT_MODEL, USER_MODEL } from 'src/Helpers/Config';
import { authMgtSchema } from './models/authMgt.model';
import { AuthMgtRepository } from './authMgt.repository';

@Global()
@Module({
  providers: [UserRepository, AuthMgtRepository],
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: userSchema },
      { name: AUTH_MGT_MODEL, schema: authMgtSchema },
    ]),
  ],
  exports: [UserRepository, AuthMgtRepository],
})
export class UserModule {}
