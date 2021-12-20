import {
  Component,
  DefaultGatewayStore,
  Itinerary,
  PackageStore,
} from 'data-models/PackageStore';
import {
  AdditionalRateOption,
  Product,
  TravelBoxPackageData,
} from 'data-models/TravelboxPackageData';
import { notUndefined } from 'utils/filters';
import { getUnixTime, parseISO } from 'date-fns';

export const createPackageFromTravelboxAPIData = (
  tbxPackageData: TravelBoxPackageData,
  brandRegion: string
): PackageStore => ({
  // quick fill properties
  conditions: [],
  freeTextConditions: [],
  // Travelbox properties
  id: tbxPackageData.detail.pkgCode,
  productCode: tbxPackageData.productCode,
  productKey: tbxPackageData.productKey,
  defaultItineraryId: tbxPackageData.detail.itinCode,
  name: tbxPackageData.summary.name,
  destination: {
    cityCode: tbxPackageData.detail.destination.cityCode,
    cityName: tbxPackageData.detail.destination.cityName,
  },
  startDate: tbxPackageData.summary.travelDates.startDate,
  endDate: tbxPackageData.summary.travelDates.endDate,
  exclusive: isExclusive(tbxPackageData.detail.holidayType),
  defaultItinerary: mapItinerary(tbxPackageData),
  // CMS properties
  inclusions: [],
  links: [],
  content: [],
  subitineraries: [],
  description: '',
  brandRegion,
});

export const addSubItinerariesToPackage = (
  packageData: PackageStore,
  subItinerariesData: TravelBoxPackageData[]
): void => {
  for (const data of subItinerariesData) {
    packageData.subitineraries.push(mapItinerary(data));
  }
};

const isExclusive = (holidayType: string): boolean => {
  return holidayType.toLowerCase().split(',').includes('exclusive');
};

const mapItinerary = (tbx: TravelBoxPackageData): Itinerary => ({
  itinName: tbx.detail.itinName,
  itinCode: tbx.detail.itinCode,
  duration: tbx.summary.duration,
  durationType: tbx.summary.durationType,
  totalPrice: tbx.rate.price,
  pricePerPerson: tbx.rate.additionalRateInfo.averagePerPersonPrice,
  tax: tbx.rate.tax,
  components: getComponentsFromItinerary(tbx.products),
  gateways: {
    defaultGateway: getDefaultGateway(tbx.products),
    additionalGateways: getAlternateGateways(tbx),
    allowAnyGateway: getAllowAnyGateway(tbx),
  },
});

/**
 * This method checks if a given productCode is a key of variable PRODUCT_TYPE_MAPPER,
 * i.e. "FLT" or "HTL", makes Typescript compiler happy
 * @param productCode
 * @returns
 */
const isOneOfKnownProductType = (
  productCode: string
): productCode is keyof typeof PRODUCT_TYPE_MAPPER => {
  return ['FLT', 'HTL', 'GEN'].indexOf(productCode) > -1;
};

const getComponentsFromItinerary = (products: Product[]): Component[] => {
  // Cycle through each component, call the relevant mapper.
  const components = products.map((product) => {
    // We need the following runtime/typeguard check otherwise in compile time Typescript does not know
    // `product.productCode` is of the key in PRODUCT_TYPE_MAPPER
    if (!isOneOfKnownProductType(product.productCode)) {
      return undefined;
    }
    const productMapper = PRODUCT_TYPE_MAPPER[product.productCode];
    return productMapper(product);
  });
  return components.filter(notUndefined); // filter out undefined elements
};

//These could probably be extracted to its own mapper files
const mapFlightComponent = (flight: Product): Component => ({
  componentKey: flight.productKey,
  componentType: 'FLT',
  componentName: 'Flight',
  componentHighlight: flight.summary?.highlight,
  details: {
    departureCode: flight.summary?.primaryAttribute,
    arrivalCode: flight.summary?.secondaryAttribute,
  },
});

const mapHotelComponent = (hotel: Product): Component => ({
  componentKey: hotel.productKey,
  componentType: 'HTL',
  componentName: 'Hotel',
  componentHighlight: hotel.summary?.highlight,

  details: {
    hotelName: hotel.summary?.name,
    hotelCode: hotel.detail?.hotelCode,
    checkIn: hotel.summary?.serviceStartDate,
    checkOut: hotel.summary?.serviceEndDate,
    nights: hotel.summary?.duration,
  },
});

const livnTitleMatch = /^\d{1,2}(D|H|M)(\d{1,2}(H|M))?/;

const mapExperienceProduct = (experience: Product): Component => ({
  componentKey: experience.productKey,
  componentType: 'EXP',
  componentName: 'Experience',
  componentHighlight: experience.summary?.highlight,
  details: {
    name: experience.summary?.highlight.replace(livnTitleMatch, ''), // Remove the Livn Duration from the title.
    description: experience.summary?.highlight,
    highlight: experience.summary?.highlight.replace(livnTitleMatch, ''),
  },
});

const mapGenericComponent = (generic: Product): Component | undefined => {
  // This will need to be extended as we bring on more generic (GEN) components.
  return isLivnTour(generic) ? mapExperienceProduct(generic) : undefined;
};

const isLivnTour = (generic: Product): boolean => {
  // The only way we can detect a LivnTour in a Generic Component is by Name
  // eg: "2H30M Harbor Cruise" //@todo get Codegen to improve this.
  return generic.summary.name.match(livnTitleMatch) !== null;
};

const PRODUCT_TYPE_MAPPER = {
  FLT: mapFlightComponent,
  HTL: mapHotelComponent,
  GEN: mapGenericComponent,
};

const getDepartureGateways = (
  rateOptions: AdditionalRateOption[]
): AdditionalRateOption | undefined | null => {
  if (rateOptions) {
    return rateOptions.find((rateOption) => {
      return rateOption.optionCategory == 'DEPERTURE_GATEWAYS'; // yes, this is an API typo.
    });
  } else {
    return null;
  }
};

const getAlternateGateways = (travelBoxdata: TravelBoxPackageData) => {
  const gateways =
    getDepartureGateways(
      travelBoxdata.additionalPackageInfo?.additionalRateOptions
    ) ?? null;

  if (gateways?.additionalRates) {
    return gateways.additionalRates.map((gateway) => {
      return {
        departureCode: gateway.code,
        priceDifference: (gateway.rateDifference * 2).toFixed(2), // We multiply the price by 2 to get totalPrice
        price: 0,
      };
    });
  }
  return [];
};

const getDefaultGateway = (products: Product[]): DefaultGatewayStore => {
  const flightComponents = products.filter((product) => {
    return product.productCode === 'FLT';
  });

  if (flightComponents.length < 1) {
    return { departureCode: '' };
  }

  flightComponents.sort((a, b) => {
    return (
      getUnixTime(parseISO(a.summary.startTime)) -
      getUnixTime(parseISO(b.summary.startTime))
    );
  });

  return {
    departureCode: flightComponents[0].summary.primaryAttribute,
  };
};

const getAllowAnyGateway = (travelBoxdata: TravelBoxPackageData) => {
  const gateways = getDepartureGateways(
    travelBoxdata.additionalPackageInfo?.additionalRateOptions
  );

  return gateways?.optionType === 'ANY';
};
