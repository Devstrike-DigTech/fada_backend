import { Schema } from 'mongoose';
import { IDrug } from './drug.interface';

export const drugSchema = new Schema<IDrug>({
  fada_id: String,
  drug_name: String,
  nafdac_no: String,
  alias: [String],
  ailment: [String],
  composition: String,
  category: String, //enum(oral, injectable);
  type: String, //enum (syrup, tablet)
  isPrescriptionDrug: Boolean,
  manufacturer: String,
  alternatives: [String], //other related drug in db
  contradictions: [String],
  adult_dosage: String,
  child_dosage: String,
  price: Number,
  stock_amount: Number,
  images: [String],
  owner_id: String,
});
