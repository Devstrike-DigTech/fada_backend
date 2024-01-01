import { Injectable, NotFoundException } from '@nestjs/common';
import { PcnRepository } from './Pcn.repository';
import { PcnDto } from "./dto/pcn.dto";

@Injectable()
export class PcnService {
  constructor(private readonly pcnRepository: PcnRepository) {}

  public async verify(pcn: string): Promise<PcnDto> {
    const result = await this.pcnRepository.getPcn(pcn);
    return result;
  }
}
