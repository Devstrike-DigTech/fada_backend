import { Schema } from 'mongoose';
import { IPharmacy, IWorkHours, IAddress } from './pharmacy.interface';
import { DaysOfWeek, GeoZone } from "../Helpers/Config";

const addressSchema = new Schema<IAddress>({
  lga: String,
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number],
  },
  address_town: String,
  address_landmark_2: String,
  address_line_1: String,
  address_line_2: String,
  address_landmark_1: String,
});

function validateTime(time: string) {
  const regex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/; // Regular expression for valid time format HH:mm
  return regex.test(time);
}

const workingHoursSchema = new Schema<IWorkHours>({
  day: {
    type: String,
    enum: DaysOfWeek,
    required: [true, 'Enter day'],
  },
  open: {
    type: String,
    required: [true, 'opening time is required'],
    validate: {
      validator: validateTime,
      message: (props) => `${props.value} is not a valid time!`,
    },
  },
  close: {
    type: String,
    required: [true, 'closing time is required'],
    validate: {
      validator: validateTime,
      message: (props) => `${props.value} is not a valid time!`,
    },
  },
});
export const pharmacySchema = new Schema<IPharmacy>({
  pharmacy_name: {
    type: String,
    required: [true, 'Pharmacy name is required'],
  },
  pharmacy_phone_number: {
    type: String,
    required: [true, 'phone number is required'],
  },
  pharmacy_address: addressSchema,
  pharmacy_state: String,
  pharmacy_images: String,
  pharmacy_owner_id: {
    type: String,
    required: [true, 'Owner required'],
  },
  pharmacy_email: {
    type: String,
    required: [true, 'Pharmacy email required'],
  },
  fada_id: String,
  pharmacy_founding_year: String,
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  },
  pharmacy_xp_points: String,
  pharmacy_geo_zone: {
    type: String,
    enum: GeoZone,
  },
  pharmacy_country: String,
  pharmacy_cac_no: {
    type: String,
    required: [true, 'Pharmacy CAC required'],
  },
  pharmacy_working_hour: [workingHoursSchema],
  head: String,
});

pharmacySchema.index({
  pharmacy_cac_no: 1,
  fada_id: 1,
  pharmacy_email: 1,
  pharmacy_phone_number: 1,
  pharmacy_address: '2dsphere',
});
