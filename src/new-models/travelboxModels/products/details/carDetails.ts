export interface CARDetails {
  make: string;
  model: string;
  class: string;
  className: string;
  typeName: string;
  motorHome: boolean;
  pickupLocations: CARLocation[];
  returnLocations: CARLocation[];
}

interface CARLocation {
  availStatus: number;
  code: string;
  name: string;
  cityCode: string;
  cityName: string;
}
