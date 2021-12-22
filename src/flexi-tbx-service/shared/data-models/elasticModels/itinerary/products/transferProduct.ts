import {
  BaseProduct,
  ProductWithDates,
  ProductWithLocation,
  ProductWithName,
  ProductWithPrice,
} from './components';

export interface TransferProduct
  extends BaseProduct,
    ProductWithName,
    ProductWithDates,
    ProductWithLocation,
    ProductWithPrice {}
