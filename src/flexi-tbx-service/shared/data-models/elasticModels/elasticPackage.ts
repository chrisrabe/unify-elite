import { Itinerary } from './itinerary';

export enum ElasticPackageType {
  lite = 'LITE', // holidayType has Web Offers
  curated = 'CURATED',
}

export interface ElasticPackage {
  // root metadata
  id: string; // packageId
  name: string;
  type: ElasticPackageType;
  productCode: string;
  productKey: string;
  defaultItineraryId: string; // detail.itinCode
  destination: {
    cityCode: string;
    cityName: string;
  };
  startDate: string;
  endDate: string;
  exclusive: boolean;

  // Package products
  itineraries: Itinerary[];

  // @todo CMS Content
}
