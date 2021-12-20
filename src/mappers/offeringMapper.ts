import {
  AdditionalGatewayStore,
  Content,
  Itinerary,
  PackageStore,
} from 'data-models/PackageStore';
import { ENABLED_COMPONENTS } from '../constants/EnabledContentComponents';
import { Features } from 'utils/features';
import {
  DefaultGatewayResponse,
  FlyStayOffering,
  StayOffering,
} from 'data-models/PackageResponse';
import { isFlightAndHotel } from 'utils/travelbox';
import { OfferingGroup } from 'data-models/OfferingGroups';
import { ItinerarySummary } from 'data-models/ItinerarySummary';

interface CMSPricingData {
  basePrice?: string;
  valuedAt?: string;
}

export const buildOfferingGroups = (
  pkgData: PackageStore,
  itinerarySummary: ItinerarySummary,
  logMessage: (message: string) => void
): OfferingGroup[] => {
  const [valuedAtFlyStay, valuedAtStay] = getValuedAt(pkgData.content);
  const [basePriceFlyStay, basePriceStay] = getBasePrice(
    pkgData.content,
    logMessage
  );
  const offeringGroups: OfferingGroup[] = [];
  for (const itinerary of itinerarySummary.itineraries) {
    const flyStayList = [];
    const stayList = [];
    if (isFlightAndHotel(itinerary)) {
      const cmsPricingData: CMSPricingData = {
        valuedAt: valuedAtFlyStay,
        basePrice: basePriceFlyStay,
      };
      const flyStayOffering = buildFlyStayOffering(
        itinerary,
        itinerarySummary.primaryItineraryCode,
        cmsPricingData,
        logMessage
      );
      flyStayList.push(flyStayOffering);
    } else {
      const cmsPricingData: CMSPricingData = {
        valuedAt: valuedAtStay,
        basePrice: basePriceStay,
      };
      const stayOffering = buildStayOffering(
        itinerary,
        itinerarySummary.secondaryItineraryCode,
        cmsPricingData,
        logMessage
      );
      stayList.push(stayOffering);
    }
    offeringGroups.push({
      itineraryCode: itinerary.itinCode,
      flyStayOfferingList: flyStayList,
      stayOfferingList: stayList,
    });
  }
  return offeringGroups;
};

const buildStayOffering = (
  itinerary: Itinerary,
  itineraryCode: string,
  cmsPricingData: CMSPricingData,
  logMessage: (message: string) => void
): StayOffering => {
  const isSecondaryOffering = itinerary.itinCode === itineraryCode;
  const travelboxPricing = Math.ceil(itinerary.totalPrice);
  const cmsStayPrice = Math.ceil(Number(cmsPricingData.basePrice));

  const stayOffering: StayOffering = {
    type: 'STAY',
    duration: itinerary.duration,
    pax: [2, 0, 0], // 2 adults, no kid, no infrant
    price: {
      amount: 0,
      currency: 'AUD',
    },
    primaryOffering: false,
    secondaryOffering: isSecondaryOffering,
    valuedAt:
      cmsPricingData.valuedAt && isSecondaryOffering
        ? cmsPricingData.valuedAt
        : undefined,
  };

  if (isSecondaryOffering && cmsPricingData.basePrice) {
    if (cmsStayPrice) {
      stayOffering.price.amount = cmsStayPrice;
      logMessage('Using the base price from CMS for Stay offering.');
    } else {
      stayOffering.price.amount = travelboxPricing;
      logMessage(
        'Base price from CMS (Stay) cannot be parsed. Using the base price from TravelBox for Stay offering instead.'
      );
    }
  } else {
    stayOffering.price.amount = travelboxPricing;
  }

  return stayOffering;
};

const buildFlyStayOffering = (
  itinerary: Itinerary,
  itineraryCode: string,
  cmsPricingData: CMSPricingData,
  logMessage: (message: string) => void
): FlyStayOffering => {
  const isPrimaryOffering = itinerary.itinCode === itineraryCode;
  const gatewayInformation = getGatewayInformation(itinerary);
  const minPriceDifference = gatewayInformation.minPriceDifference ?? 0;
  const travelboxPricing = Math.ceil(itinerary.totalPrice + minPriceDifference);
  const cmsFlyStayPrice = Math.ceil(Number(cmsPricingData.basePrice));

  const flyStayOffering: FlyStayOffering = {
    type: 'FLYSTAY',
    duration: itinerary.duration,
    pax: [2, 0, 0], // 2 adults, no kid, no infant
    price: {
      amount: 0,
      currency: 'AUD',
    },
    primaryOffering: isPrimaryOffering,
    secondaryOffering: false,
    gateways: {
      defaultGateway: gatewayInformation.defaultGateway,
      additionalGateways: gatewayInformation.additionalGateways,
      allowAnyGateway: gatewayInformation.allowAnyGateway,
    },
    valuedAt:
      cmsPricingData.valuedAt && isPrimaryOffering
        ? cmsPricingData.valuedAt
        : undefined,
  };

  if (isPrimaryOffering && cmsPricingData.basePrice) {
    if (cmsFlyStayPrice) {
      flyStayOffering.price.amount = cmsFlyStayPrice;
      logMessage('Using the base price from CMS for FlyStay offering');
    } else {
      flyStayOffering.price.amount = travelboxPricing;
      logMessage(
        'Base price from CMS (FlyStay) cannot be parsed. Using the base price from TravelBox for FlyStay offering instead.'
      );
    }
  } else {
    flyStayOffering.price.amount = travelboxPricing;
  }
  return flyStayOffering;
};

const getGatewayInformation = (itinerary: Itinerary) => {
  const totalPrice = itinerary.totalPrice;
  const originalDefaultGatewayCode =
    itinerary.gateways.defaultGateway.departureCode;

  const minPriceDifference = Math.min(
    ...itinerary.gateways.additionalGateways.map((g: AdditionalGatewayStore) =>
      Number(g.priceDifference)
    )
  );

  const defaultGateway: DefaultGatewayResponse = findDefaultGateway(
    itinerary,
    minPriceDifference
  );

  const additionalGateways = [];

  for (const gateway of itinerary.gateways.additionalGateways) {
    const priceDifference = Number(gateway.priceDifference);
    if (gateway.departureCode === defaultGateway.departureCode) {
      continue;
    }
    const departureCode = gateway.departureCode;
    let price = 0;
    if (gateway.departureCode === originalDefaultGatewayCode) {
      price = Math.ceil(itinerary.totalPrice);
    } else {
      price = Number(Math.ceil(totalPrice + priceDifference));
    }
    additionalGateways.push({
      departureCode,
      price,
    });
  }
  return {
    minPriceDifference,
    defaultGateway,
    additionalGateways,
    allowAnyGateway: itinerary.gateways.allowAnyGateway,
  };
};

const findDefaultGateway = (
  itinerary: Itinerary,
  minPriceDifference: number
): DefaultGatewayResponse => {
  const gatewayWithMinimumPrice = itinerary.gateways.additionalGateways.find(
    (g: AdditionalGatewayStore) =>
      Number(g.priceDifference) === minPriceDifference
  );
  return {
    departureCode: gatewayWithMinimumPrice?.departureCode ?? '',
  };
};

const getValuedAt = (
  storedContentArray: Content[] | undefined
): [string | undefined, string | undefined] => {
  const valuedAtFlyStay = getFirstComponentOfTypeFromArray(
    storedContentArray,
    ENABLED_COMPONENTS.valuedAtFlyStay
  )?.description;

  const valuedAtStay = getFirstComponentOfTypeFromArray(
    storedContentArray,
    ENABLED_COMPONENTS.valuedAtStay
  )?.description;

  return [valuedAtFlyStay, valuedAtStay];
};

const getBasePrice = (
  storedContentArray: Content[] | undefined,
  logMessage: (message: string) => void
): [string | undefined, string | undefined] => {
  if (!Features.DEFAULT_PRICE_FROM_CMS) {
    return [undefined, undefined];
  }

  const basePriceFlyStay = getFirstComponentOfTypeFromArray(
    storedContentArray,
    ENABLED_COMPONENTS.basePriceFlyStay
  )?.description;

  const basePriceStay = getFirstComponentOfTypeFromArray(
    storedContentArray,
    ENABLED_COMPONENTS.basePriceStay
  )?.description;

  const flyStayPriceMessage =
    'Base price from CMS (FlyStay) = ' + basePriceFlyStay;
  const stayPriceMessage = 'Base price from CMS (Stay) = ' + basePriceStay;

  logMessage(flyStayPriceMessage);
  logMessage(stayPriceMessage);

  return [basePriceFlyStay, basePriceStay];
};

const getComponentsOfTypeFromArray = (
  storedContentArray: Content[] | undefined,
  contentType: string
): Content[] => {
  const contents = storedContentArray?.filter(
    (comp) => contentType === comp.type
  );
  return contents && contents.length ? contents : [];
};

const getFirstComponentOfTypeFromArray = (
  storedContentArray: Content[] | undefined,
  contentType: string
): Content => getComponentsOfTypeFromArray(storedContentArray, contentType)[0];
