import { Document } from 'mongoose';

export interface IDrug extends Document {
  fada_id: string;
  drug_name: string;
  nafdac_no: string;
  alias: string[];
  ailment: string[];
  composition: string;
  category: string; //enum(oral, injectable);
  type: string; //enum (syrup, tablet)
  isPrescriptionDrug: boolean;
  manufacturer: string;
  alternatives: string[]; //other related drug in db
  contradictions: string[];
  adult_dosage: string;
  child_dosage: string;
  price: number;
  stock_amount: number;
  images: string[];
  owner_id: string;
}
