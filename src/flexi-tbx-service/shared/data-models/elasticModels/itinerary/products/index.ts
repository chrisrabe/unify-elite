import { HotelProduct } from './hotelProduct';
import { TransferProduct } from './transferProduct';
import { CarProduct } from './carProduct';
import { FlightProduct } from './flightProduct';
import { GenericProduct } from './genericProduct';

export * from './components';

export type ItineraryProduct =
  | HotelProduct
  | TransferProduct
  | CarProduct
  | FlightProduct
  | GenericProduct;

export {
  HotelProduct,
  TransferProduct,
  CarProduct,
  FlightProduct,
  GenericProduct,
};
