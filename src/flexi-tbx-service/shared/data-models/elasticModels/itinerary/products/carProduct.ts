import {
  BaseProduct,
  ProductWithDates,
  ProductWithDuration,
  ProductWithLocation,
  ProductWithName,
  ProductWithPrice,
} from './components';

export interface CarProduct
  extends BaseProduct,
    ProductWithName,
    ProductWithDuration,
    ProductWithDates,
    ProductWithPrice,
    ProductWithLocation {
  make: string;
  model: string;
  className: string;
  typeName: string;
}
