import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PHARMACY_MODEL } from '../Helpers/Config';
import { pharmacySchema } from './pharmacy.model';
import { PharmacyRepository } from './pharmacy.repository';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';
import { AuthMiddleware } from '../middlewares/authenticate.middleware';

@Module({
  providers: [PharmacyRepository, PharmacyService],
  imports: [MongooseModule.forFeature([{ name: PHARMACY_MODEL, schema: pharmacySchema }])],
  controllers: [PharmacyController],
  // exports: [PharmacyRepository],
})
export class PharmacyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('pharmacy');
  }
}
