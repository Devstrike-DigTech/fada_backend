import { Module } from '@nestjs/common';
import { ExternalsController } from './externals.controller';
import { PcnService } from './Pcn.service';
import { PcnRepository } from './Pcn.repository';

@Module({
  imports: [],
  controllers: [ExternalsController],
  providers: [PcnRepository, PcnService],
  exports: [PcnService],
})
export class ExternalsModule {}
