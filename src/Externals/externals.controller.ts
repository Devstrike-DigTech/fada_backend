import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PcnService } from './Pcn.service';
import { VerifyPcnDto } from './dto/verifyPcn.dto';
import { PcnDto } from './dto/pcn.dto';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('/externals')
export class ExternalsController {
  constructor(private readonly pcnService: PcnService) {}
  @ApiTags('Pharmacist Verification')
  @Post('/verify_pcn')
  public async getPcnDetails(@Body() body: VerifyPcnDto, @Req() req: Request, @Res() res: Response) {
    const pcn: PcnDto = await this.pcnService.verify(body.pcn);

    res.status(200).json({
      data: {
        pharmacist: pcn,
      },
    });
  }
}
