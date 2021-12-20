import { FlyStayOffering, StayOffering } from './PackageResponse';

export interface OfferingGroup {
  itineraryCode: string;
  flyStayOfferingList: FlyStayOffering[];
  stayOfferingList: StayOffering[];
}
