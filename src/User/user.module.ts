import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { userSchema } from './user.model';
import { USER_MODEL } from 'src/Helpers/Config';

@Global()
@Module({
  providers: [UserRepository],
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL, schema: userSchema }]),
  ],
  exports: [UserRepository],
})
export class UserModule {}
