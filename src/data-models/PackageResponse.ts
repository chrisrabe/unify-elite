/**
 * This is the structure of the response we return to CuratedUI.
 */
export interface PackageResponse {
  id: string; // "123456"
  name: string; // "Lux Rainforest ..."
  packagePublishDate?: string;
  packageExpiryDate?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  packageStatus?: string;
  destination: string; // "Bali, Indonesia"
  images: Image[]; // Main Gallery Images
  offerings: Offering[]; // Length = 2
  packageInclusions: PackageInclusion[];
  hotelDetails: HotelDetails;
  exclusive: boolean;
  experiences: ExperienceItemProps[];
  description: string;
  wowFactor?: WowFactor;
  whyWeLoveIt?: WhyWeLoveIt;
  termsConditions?: string;
  consultantNotes: string | null;
}

export interface WhyWeLoveIt {
  title?: string;
  subTitle?: string;
  consultantImage: Image;
  usps?: string[];
}

export interface WowFactor {
  exclusive: boolean; // true
  wowFactorText?: string; // up to 25% off
}

interface Price {
  amount: number; // 1200
  currency?: string; // AUD
}

export interface Offering {
  type: string;
  valuedAt?: string;
  duration: number; // 5
  pax: number[]; //
  price: Price;
}

export interface FlyStayOffering extends Offering {
  type: 'FLYSTAY';
  gateways: GatewaysResponse;
  primaryOffering: boolean;
  secondaryOffering: false;
}

export interface StayOffering extends Offering {
  type: 'STAY';
  primaryOffering: false;
  secondaryOffering: boolean;
}

export interface PackageInclusion {
  type: 'STAY' | 'FLIGHT' | 'TRANSFER' | 'EXPERIENCE' | 'COVID19COMP' | 'OTHER';
  title: string;
  description: string;
}

export interface Image {
  url: string;
  description?: string;
  title: string;
}

interface HotelAmenity {
  name: string;
  type: HotelFacilityType;
}

export type TopAmenity =
  | 'Restaurant'
  | 'Fitness facilities'
  | 'Pool'
  | 'Parking'
  | 'Free WiFi'
  | 'Laundry'
  | 'Child minding'
  | 'Bar'
  | 'Accessible'
  | 'Concierge services'
  | 'Smoke free property'
  | 'Tennis court'
  | 'Casino'
  | 'Designated smoking areas'
  | 'Bicycle rentals'
  | 'Spa'
  | 'Library'
  | 'Winery'
  | 'BBQ facilities'
  | 'Conference space'
  | 'Meeting rooms'
  | 'Golf course'
  | 'Multilingual staff'
  | 'Nightclub';

interface HotelDetails {
  hotelName: string;
  images: Image[];
  rating: number;
  checkInTime: string;
  checkOutTime: string;
  description: string;
  amenities: HotelAmenity[];
  topAmenities: TopAmenity[];
  hotelLogo: string;
}

export interface ExperienceItemProps {
  title: string;
  description: string;
}

export interface GatewaysResponse {
  allowAnyGateway: boolean;
  additionalGateways: AdditionalGatewayResponse[];
  defaultGateway: DefaultGatewayResponse;
}
export interface AdditionalGatewayResponse {
  departureCode: string;
  price: number;
}

export interface DefaultGatewayResponse {
  departureCode: string;
}

export enum HotelFacilityType {
  'HotelFacility' = 'hotel',
  'RoomFacility' = 'room',
  'Other' = 'other',
}
