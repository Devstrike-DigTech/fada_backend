import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { PcnService } from './Pcn.service';
import { VerifyPcnDto } from './dto/verifyPcn.dto';
import { PcnDto } from './dto/pcn.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from "express";
import { REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE_TTL } from "../Helpers/Config";

@Controller('/externals')
export class ExternalsController {
  constructor(private readonly pcnService: PcnService) {}

  // @Post('/verify_pcn')
  // public async getPcnDetails(@Body() data: VerifyPcnDto): Promise<PcnDto> {
  //   return await this.pcnService.verify(data.pcn);
  // }

  @Post('/verify_pcn')
  public async getPcnDetails(@Req() req: Request, @Res() res: Response) {
    const pcn: PcnDto = await this.pcnService.verify(req.body.pcn);

    res.status(200).json({
      data: {
        pharmacist: pcn,
      },
    });
  }
}
