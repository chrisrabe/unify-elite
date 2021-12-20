import { TRSDetails } from './transferDetails';
import { HTLDetails } from './hotelDetails';
import { CARDetails } from './carDetails';
import { GENDetails } from './genericDetails';

export { TRSDetails, HTLDetails, CARDetails, GENDetails };

export type ProductDetails = TRSDetails | HTLDetails | CARDetails | GENDetails;
