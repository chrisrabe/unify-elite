import {
  TBXKeyValuePair,
  TravelDuration,
  TravelDates,
  PackageRate,
} from '../tbxGeneral';
import { ProductDetails } from './details';
import { ProductSource } from './source';
import { ProductCode } from '../../shared';

export interface TBXProduct {
  productCode: ProductCode;
  productKey: string;
  selected: boolean;
  attributes: TBXKeyValuePair[];
  summary: TBXProductSummary;
  multiSource: boolean;
  rate: PackageRate;
  additionalContents: any[];
  notes: any[];
  supplements: any[];
  discounts: any[];
  links: any[];
  detail?: ProductDetails; // undefined for FLT
  source?: ProductSource; // only defined in HTL
}

export interface TBXProductSummary {
  name: string;
  highlight: string;
  primaryAttribute: string;
  secondaryAttribute: string;
  serviceStartDate: string;
  serviceEndDate: string;
  duration: number;
  durationType: string;
  travelDates: TravelDates;
  travelDuration: TravelDuration;
  recommended: boolean;
  specialOffer: boolean;
  totalPrice: number;
  discount: number;
  priceBeforeDiscount: number;
  startTime: string; // iso
  endTime: string; // iso
  travelTimes: TravelTimes;
  vipBooking: boolean;
}

export interface TravelTimes {
  startTime: Date;
  endTime: Date;
  embarkationTime: number;
}
