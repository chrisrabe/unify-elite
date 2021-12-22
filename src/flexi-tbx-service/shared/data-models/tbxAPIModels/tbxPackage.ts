import {
  TBXKeyValuePair,
  TravelDates,
  TravelDuration,
  PackageRate,
} from './tbxGeneral';
import { TBXProduct } from './products';

export interface TravelboxPackage {
  productCode: string;
  productKey: string;
  summary: Summary;
  detail: Detail;
  metaInfo: MetaInfo;
  products: TBXProduct[];
  ancillaryProducts: any[];
  additionalPackageInfo: AdditionalPackageInfo[];
  rate: PackageRate;
  content: Content;
  reservationProperties: TBXKeyValuePair[];
  fees: any[];
  taxes: any[];
  attributes: TBXKeyValuePair[];
  links: Link[];
}

export interface Link {
  rel: string;
  href: string;
}

export interface Content {
  description: string;
  contentItems: any[];
}

export interface AdditionalRate {
  code: string;
  rateDifference: number;
}

export interface AdditionalRateOption {
  optionCategory: string;
  optionType: string;
  additionalRates: AdditionalRate[];
}

export interface AdditionalPackageInfo {
  additionalRateOptions: AdditionalRateOption[];
}

export interface MetaInfo {
  result: MetaInfoResult;
  metaInfoKey: string;
}

interface MetaInfoResult {
  holidayTemplateId: number;
  compositionId: number;
  itineraryItemNo: number;
  cfScore: number;
  gridNo: number;
  gridType: number;
  itineraryNo: number;
  itineraryOrder: number;
  holidayId: number;
  pkgId: number;
  resultNo: number;
  swapItemNo: number;
  promo: boolean;
  productSetCode: string;
  optionalItineraryItem: boolean;
}

export interface Summary {
  name: string;
  highlight: string;
  primaryAttribute: string;
  secondaryAttribute: string;
  serviceStartDate: string;
  duration: number;
  durationType: string;
  travelDates: TravelDates;
  travelDuration: TravelDuration;
  recommended: boolean;
  specialOffer: boolean;
  totalPrice: number;
  discount: number;
  priceBeforeDiscount: number;
  vipBooking: boolean;
}

export interface Detail {
  pkgType: string;
  pkgCode: string;
  itinCode: string;
  itinName: string;
  productType: string;
  holidayType: string;
  destination: Destination;
  freeTextConditions: any[];
}

export interface Destination {
  cityCode: string;
  cityName: string;
}
