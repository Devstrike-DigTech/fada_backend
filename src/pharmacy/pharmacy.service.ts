import { BadRequestException, Injectable } from "@nestjs/common";
import { PharmacyRepository } from "./pharmacy.repository";
import { CreatePharmacyDto } from "./dto/createPharmacy.dto";
import Phone from "../Helpers/lib/phone.lib";
import { UserRepository } from "../User/user.repository";
import { ROLE } from "../Helpers/Config";
import { IPharmacy } from "./pharmacy.interface";

@Injectable()
export class PharmacyService {
  constructor(
    private readonly PharmacyRepository: PharmacyRepository,
    private readonly UserRepository: UserRepository,
  ) {}

  public async createPharmacy(payload: CreatePharmacyDto, owner_id: string) {
    if (!Phone.format_validate(payload.pharmacy_phone_number)) throw new BadRequestException('Phone number not valid');

    if (!(await this.UserRepository.findOne({ id: owner_id, role: ROLE.PHARMACIST })))
      throw new BadRequestException('pharmacist doesnt exist. ');

    if (await this.PharmacyRepository.ownerAlreadyHasPharmacy(owner_id))
      throw new BadRequestException('Owner cannot create multiple pharmacies');

    return await this.PharmacyRepository.create({}, { ...payload, pharmacy_owner_id: owner_id });
  }

  public async getPharmacy(payload: Partial<IPharmacy>) {
    return await this.PharmacyRepository.findOne(payload, {__v: 0});
  }
}
