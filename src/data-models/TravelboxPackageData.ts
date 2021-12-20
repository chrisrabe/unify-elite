export interface TravelBoxPackageData {
  productCode: string;
  productKey: string;
  summary: Summary;
  detail: Detail;
  products: Product[];
  ancillaryProducts: any[];
  rate: Rate2;
  content: Content;
  fees: any[];
  taxes: any[];
  attributes: Attribute2[];
  additionalPackageInfo: AdditionalPackageInfo;
  links: Link[];
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
  endDate: string;
}

export interface TravelDuration {
  duration: number;
  durationType: string;
}

export interface Destination {
  cityCode: string;
  cityName: string;
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

export interface Result {
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

export interface Attribute {
  name: string;
  value: string;
}

export interface TravelDates2 {
  startDate: string;
  endDate: string;
}

export interface TravelDuration2 {
  duration: number;
  durationType: string;
}

export interface TravelTimes {
  startTime: Date;
  endTime: Date;
  embarkationTime: number;
}

export interface Summary2 {
  highlight: string;
  primaryAttribute: string;
  secondaryAttribute: string;
  serviceStartDate: string;
  serviceEndDate: string;
  duration: number;
  durationType: string;
  travelDates: TravelDates2;
  travelDuration: TravelDuration2;
  recommended: boolean;
  specialOffer: boolean;
  totalPrice: number;
  discount: number;
  priceBeforeDiscount: number;
  startTime: string;
  endTime: string;
  travelTimes: TravelTimes;
  vipBooking: boolean;
  name: string;
}

export interface Rate {
  discount: number;
  price: number;
  priceWithTax: number;
  tax: number;
  commission: number;
  commissionPercentage: number;
  priceWithoutCommission: number;
  itemSuppliemntPrice: number;
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

export interface PickupPoint {
  code: string;
  name: string;
  type: string;
  cityCode: string;
  cityName: string;
}

export interface DropoffPoint {
  code: string;
  name: string;
  type: string;
  cityCode: string;
  cityName: string;
}

export interface Destination2 {
  cityCode: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
}

export interface Detail2 {
  pickupPoints: PickupPoint[];
  dropoffPoints: DropoffPoint[];
  hotelCode: string;
  destination: Destination2;
  elementGrp: string;
  elementGrpName: string;
}

export interface External {
  id: string;
  ref: string;
}

export interface Source {
  external: External;
}

export interface Product {
  productCode: string;
  productKey: string;
  selected: boolean;
  attributes: Attribute[];
  summary: Summary2;
  multiSource: boolean;
  rate: Rate;
  additionalContents: any[];
  notes: any[];
  supplements: any[];
  discounts: any[];
  links: any[];
  detail: Detail2;
  source: Detail2;
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

export interface TravellerRateBreakdown {
  travellerNo: number;
  servicePaxType: string;
  price: number;
  tax: number;
  priceWithTax: number;
  cost: number;
}

export interface Rate2 {
  discount: number;
  price: number;
  priceWithTax: number;
  tax: number;
  commission: number;
  commissionPercentage: number;
  additionalRateInfo: AdditionalRateInfo;
  travellerRateBreakdown: TravellerRateBreakdown[];
  priceWithoutCommission: number;
  itemSuppliemntPrice: number;
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

export interface Content {
  description: string;
  contentItems: any[];
}

export interface Attribute2 {
  name: string;
  value: string;
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

export interface Link {
  rel: string;
  href: string;
}
