export interface TRSDetails {
  pickupPoints: TRSPoint[];
  dropoffPoints: TRSPoint[];
}

interface TRSPoint {
  code: string;
  name: string;
  type: string;
  cityCode: string;
  cityName: string;
}
