import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URL, REDIS_URL, REDIS_PORT } from './Helpers/Config';
import { UserModule } from './User/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ExternalsModule } from './Externals/externals.module';
import { MailModule } from './mail/mail.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: `redis://${REDIS_URL}:${REDIS_PORT}`,
    }),
    AuthModule,
    UserModule,
    ExternalsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(DATABASE_URL),
    MailModule,
    PharmacyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
