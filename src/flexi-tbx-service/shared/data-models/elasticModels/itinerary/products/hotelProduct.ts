import {
  BaseProduct,
  ProductWithDates,
  ProductWithDuration,
  ProductWithID,
  ProductWithName,
} from './components';

export interface HotelProduct
  extends BaseProduct,
    ProductWithID,
    ProductWithName,
    ProductWithDuration,
    ProductWithDates {}
