/**
 * This is the data structure we will in elastic.
 * It is populated by transforming fetched TBX Data.
 */
export interface PackageStore {
  id: string; // packageId
  productCode: string;
  productKey: string;
  defaultItineraryId: string; // detail.itinCode
  description: string; //  content.description
  name: string; //summary.name
  destination: {
    cityCode: string; //detail.destination
    cityName: string;
  };
  startDate: string; // travelDates.startDate
  endDate: string;
  exclusive: boolean;
  defaultItinerary: Itinerary;
  freeTextConditions: FreeTextCondition[];
  inclusions: PackageInclusion[];
  conditions: Condition[];
  links: Link[];
  subitineraries: Itinerary[];
  content?: Content[];
  brandRegion: string;
}
export interface ContentImage {
  index: number;
  imageURL: string;
  thumbnailURL: string;
}

export interface Content {
  type: string;
  key: string;
  title?: string;
  description?: string;
  descriptionList?: string[];
  images?: ContentImage[];
}

export interface PackageDates extends Content {
  description: string;
}

export interface Itinerary {
  itinName: string; //detail.itinName
  itinCode: string; //detail.itinCode
  duration: number; // summary.travelDuration
  durationType: string; // summary.durationType
  totalPrice: number;
  tax: number;
  pricePerPerson: number;
  components: Component[];
  gateways: Gateways; // @todo rework into a discriminative type.
}

export interface Gateways {
  allowAnyGateway: boolean;
  defaultGateway: DefaultGatewayStore;
  additionalGateways: AdditionalGatewayStore[];
}

interface FreeTextCondition {
  header: string;
  content: string;
  order: number;
}

interface BaseComponent {
  componentKey: string; //product.productKey
  componentName: string;
  componentHighlight: string;
}

export interface FlightComponent extends BaseComponent {
  componentType: 'FLT';
  details?: FlightDetails;
}

export interface HotelComponent extends BaseComponent {
  componentType: 'HTL';
  details?: HotelDetails;
}

export interface ExperienceComponent extends BaseComponent {
  componentType: 'EXP';
  details: ExperienceDetails;
}

export type Component = FlightComponent | HotelComponent | ExperienceComponent;

export const isHotelComponent = (
  component: Component
): component is HotelComponent => component.componentType === 'HTL';

export interface FlightDetails {
  departureCode: string;
  departureName?: string;
  departureLat?: number;
  departureLon?: number;
  arrivalCode: string;
  arrivalName?: string;
  arrivalLat?: number;
  arrivalLon?: number;
}

interface HotelDetails {
  hotelName: string;
  hotelCode: string;
  starRating?: number;
  description?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amenities?: HotelAmenity[];
}

export interface ExperienceDetails {
  name: string;
  highlight: string;
  description: string;
}

type HotelAmenity = {
  name: string;
  type: string;
};

export interface PackageInclusion {
  title: string;
  description: string;
  type: string;
}

interface Condition {
  name: string;
  content: string;
}

export interface DefaultGatewayStore {
  departureCode: string;
}

export interface AdditionalGatewayStore {
  departureCode: string;
  priceDifference: string;
  price: number;
}

interface Link {
  type: string;
  href: string;
}
