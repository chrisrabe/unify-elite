import {
  BaseProduct,
  ProductWithDates,
  ProductWithLocation,
  ProductWithPrice,
} from './components';

export interface FlightProduct
  extends BaseProduct,
    ProductWithDates,
    ProductWithLocation,
    ProductWithPrice {
  isDefaultGateway: boolean;
  allowAnyGateway: boolean;
  alternateGateways: AlternateGateway[];
}

interface AlternateGateway {
  departureCode: string;
  priceDifference: string;
  price: string;
}
