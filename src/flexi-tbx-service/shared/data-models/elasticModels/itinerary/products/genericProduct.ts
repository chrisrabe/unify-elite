import {
  BaseProduct,
  ProductWithDates,
  ProductWithName,
  ProductWithPrice,
} from './components';

export interface GenericProduct
  extends BaseProduct,
    ProductWithName,
    ProductWithDates,
    ProductWithPrice {
  destination: {
    cityCode: string;
    cityName: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    stateName: string;
  };
}
