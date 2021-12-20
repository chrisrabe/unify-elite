import {
  HotelComponent,
  Itinerary,
  PackageStore,
} from 'data-models/PackageStore';
import { ItinerarySummary } from 'data-models/ItinerarySummary';

export const getItinerarySummaryFromPackage = (
  pkgData: PackageStore,
  logMessage: (message: string) => void
): ItinerarySummary => {
  const mergedItinerary = mergeDefaultandSubItineraries(
    pkgData.defaultItinerary,
    pkgData.subitineraries
  );
  const secondaryItineraryCode = getSecondaryItineraryCode(pkgData, logMessage);
  const primaryItineraryCode = pkgData.defaultItinerary.itinCode;
  return {
    itineraries: mergedItinerary,
    secondaryItineraryCode,
    primaryItineraryCode,
  };
};

const mergeDefaultandSubItineraries = (
  defaultItinerary: Itinerary,
  subItineraries: Itinerary[]
): Itinerary[] => {
  const mergedItinerary = [defaultItinerary];
  for (const itinerary of subItineraries) {
    if (itinerary) {
      mergedItinerary.push(itinerary);
    }
  }
  return mergedItinerary;
};

const hasSameHotelDurationAsPrimaryHotel = (
  itinerary: Itinerary,
  primaryHotel: HotelComponent | undefined
) => {
  const secondaryHotel = itinerary.components.find(
    (component) => component.componentType === 'HTL'
  );
  return (
    (secondaryHotel as HotelComponent).details?.nights ===
    primaryHotel?.details?.nights
  );
};

const hasSamePackageDurationAsPrimary = (
  itinerary: Itinerary,
  defaultItinerary: Itinerary
) => {
  return itinerary.duration === defaultItinerary.duration;
};

const getSecondaryItineraryCode = (
  pkgData: PackageStore,
  logMessage: (message: string) => void
) => {
  const defaultItinerary = pkgData.defaultItinerary;
  const primaryHotel = defaultItinerary.components.find(
    (component) => component.componentType === 'HTL'
  );
  if (!primaryHotel) {
    logMessage(
      `Default itinerary does not have a hotel component: ${defaultItinerary.itinCode}`
    );
  }

  let secondaryItinerary;
  let hasHotelDuration = false;
  for (const itinerary of pkgData.subitineraries) {
    if (!itinerary) {
      continue;
    }
    // Criteria 1: match hotel duration of primary and secondary offerings
    if (
      hasSameHotelDurationAsPrimaryHotel(
        itinerary,
        primaryHotel as HotelComponent
      )
    ) {
      // We found the first secondary offering that matches first criteria
      hasHotelDuration = true;
      secondaryItinerary = itinerary;
      break;
    }

    // Criteria 2: Get the first package that matches the primary itinerary's duration
    if (
      !secondaryItinerary &&
      hasSamePackageDurationAsPrimary(itinerary, defaultItinerary)
    ) {
      secondaryItinerary = itinerary;
      // We keep going in-case another sub itinerary has hotel component
    }
  }
  if (!secondaryItinerary) {
    logMessage(
      `No secondary itinerary found using hotel or package duration of default itinerary: ${defaultItinerary.itinCode}.`
    );
    return '';
  }
  if (!hasHotelDuration) {
    logMessage(
      `No secondary itinerary found using hotel duration of default itinerary: ${defaultItinerary.itinCode}. Using fallback of package duration.`
    );
  }
  return secondaryItinerary.itinCode;
};
