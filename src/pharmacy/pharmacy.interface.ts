import { Document } from 'mongoose';

export interface IAddress {
  type?: string;
  lga: string;
  coordinates: number[];
  address_town: string;
  address_landmark_2: string;
  address_line_1: string;
  address_line_2: string;
  address_landmark_1: string;
}

export interface IWorkHours {
  day: string;
  open: string;
  close: string;
}

export interface IPharmacy extends Document {
  pharmacy_name: string;
  pharmacy_phone_number: string;
  pharmacy_address: IAddress;
  pharmacy_state: string;
  pharmacy_images: string[];
  pharmacy_owner_id: string;
  pharmacy_email: string;
  fada_id: string;
  pharmacy_founding_year: string;
  status: string; //(active, suspended)
  pharmacy_xp_points: string;
  pharmacy_geo_zone: string;
  pharmacy_country: string;
  pharmacy_cac_no: string;
  pharmacy_type: string; //enum head branch
  pharmacy_working_hour: IWorkHours[];
  head: boolean;
  // +subscription_id: String
  // +branches: [String]? (if head)
  // +head_id: String? (if branch)
}
