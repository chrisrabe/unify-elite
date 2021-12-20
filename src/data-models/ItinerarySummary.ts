import { Itinerary } from './PackageStore';

export interface ItinerarySummary {
  itineraries: Itinerary[];
  primaryItineraryCode: string;
  secondaryItineraryCode: string;
}
