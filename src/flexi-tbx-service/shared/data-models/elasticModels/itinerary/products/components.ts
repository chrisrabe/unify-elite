// generic product detail components

import { ProductCode } from '../../../shared';

export interface BaseProduct {
  productKey: string;
  type: ProductCode;
  price: number;
}

export interface ProductWithDuration {
  duration: number;
  durationType: string;
}

export interface ProductWithDates {
  startTime: string;
  endTime: string;
}

export interface ProductWithPrice {
  price: number;
  discount: number;
}

export interface ProductWithName {
  name: string;
  highlight: string;
}

interface Location {
  cityCode: string;
  type: string; // A - airport, H - hotel
  name?: string;
  cityName?: string;
}

export interface ProductWithLocation {
  origin: Location;
  destination: Location;
}

export interface ProductWithID {
  id: string;
}
