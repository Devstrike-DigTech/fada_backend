import { Body, Controller, Get, Post } from '@nestjs/common';
import { PcnService } from './Pcn.service';
import { VerifyPcnDto } from './dto/verifyPcn.dto';
import { PcnDto } from './dto/pcn.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/externals')
export class ExternalsController {
  constructor(private readonly pcnService: PcnService) {}

  @Post('/verify_pcn')
  public async getPcnDetails(@Body() data: VerifyPcnDto): Promise<PcnDto> {
    return await this.pcnService.verify(data.pcn);
  }
}
