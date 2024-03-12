import { Injectable } from "@nestjs/common";
import { PcnRepository } from "./Pcn.repository";
import { PcnDto } from "./dto/pcn.dto";

@Injectable()
export class PcnService {
  constructor(private readonly pcnRepository: PcnRepository) {}

  public async verify(pcn: string): Promise<PcnDto> {
    return await this.pcnRepository.getPcn(pcn);
  }
}
