import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { API } from '../Helpers/API';
import { PcnDto } from './dto/pcn.dto';

@Injectable()
export class PcnRepository {
  constructor() {}
  public async getPcn(pcn: string): Promise<PcnDto | null> {
    const formData = new FormData();
    formData.set('LicenceFilter', pcn);
    try {
      const api = API.getAPI('https://pcncore.azurewebsites.net/');
      const res = await api.post('PublicSearch/PharmacistLicence', formData);

      if (res.data && res.data.Data && res.data.Data.length > 0) {
        return res.data.Data[0] as PcnDto;
      }

      return null;
    } catch (e) {
      throw new InternalServerErrorException('Error Validating PCN. Try again later');
    }
  }
}
