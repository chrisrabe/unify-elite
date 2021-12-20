export interface TravelboxPackage {
  productCode: string;
  productKey: string;
  summary: Summary;
  detail: Detail;
  metaInfo: MetaInfo;
  products: any; // @todo revisit
  ancillaryProducts: any[];
  additionalPackageInfo: AdditionalPackageInfo[];
  rate: PackageRate;
  content: Content;
  reservationProperties: PackageAttribute[];
  fees: any[];
  taxes: any[];
  attributes: PackageAttribute[];
  links: Link[];
}

export interface Link {
  rel: string;
  href: string;
}
export interface PackageAttribute {
  name: string;
  value: string;
}

export interface Content {
  description: string;
  contentItems: any[];
}

export interface PackageRate {
  discount: number;
  price: number;
  priceWithTax: number;
  tax: number;
  commission: number;
  commissionPercentage: number;
  additionalRateInfo: AdditionalRateInfo;
  travellerRateBreakdown: TravellerRateBreakdown[];
  priceWithoutCommission: number;
  itemSuppliemntPrice: number; // the typo is intentional
  amendmentCharge: number;
  cancellationCharge: number;
  cnxPrice: number;
  sellingToBaseExchangeRate: number;
  basePrice: number;
  manualCommission: boolean;
  itemDiscount: number;
  totalItemFeeBase: number;
  totalItemFee: number;
  totalTaxBase: number;
  totalTax: number;
  totalNettBookingTax: number;
}

export interface TravellerRateBreakdown {
  travellerNo: number;
  servicePaxType: string;
  price: number;
  tax: number;
  priceWithTax: number;
  cost: number;
}

export interface AdditionalRateInfo {
  grossAdult: number;
  grossChild: number;
  grossInfant: number;
  nettAdult: number;
  nettChild: number;
  nettInfant: number;
  adultPerPerson: number;
  childPerPerson: number;
  infantPerPerson: number;
  ecPrice: number;
  lcPrice: number;
  extraNightPrice: number;
  nonCommissionablePrice: number;
  averagePerPersonPrice: number;
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

export interface TravelDates {
  startDate: string;
  endDate?: string;
}

export interface TravelDuration {
  duration: number;
  durationType: string;
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
