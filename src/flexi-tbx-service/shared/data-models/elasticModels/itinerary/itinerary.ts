import { ItineraryProduct } from './products';

export interface Itinerary {
  itinName: string;
  itinCode: string;
  duration: number;
  durationType: string;
  totalPrice: number;
  tax: number;
  pricePerPerson: number;
  products: ItineraryProduct[];
}
