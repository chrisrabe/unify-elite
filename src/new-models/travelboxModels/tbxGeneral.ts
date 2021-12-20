export interface TBXKeyValuePair {
  name: string;
  value: string;
}

export interface TravelDates {
  startDate: string;
  endDate?: string;
}

export interface TravelDuration {
  duration: number;
  durationType: string;
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

export interface ProductDestination {
  cityCode: string;
  cityName: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  stateName: string;
}
