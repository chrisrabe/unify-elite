'use strict';
import { TravelBoxPackageData } from 'data-models/TravelboxPackageData';
import * as superagent from 'superagent';
import { TravelboxAPIUrlBuilder } from '../url-builders/tbxUrlBuilder';
import { constants } from 'config/constants';
import { v4 as uuidv4 } from 'uuid';

export const fetchTravelboxData = async (
  travelboxUrl: string,
  travelboxSubscriptionKey: string,
  startYear: string
): Promise<TravelBoxPackageData[]> => {
  const fetchDataUrl = new TravelboxAPIUrlBuilder(travelboxUrl, startYear)
    .withPax('2')
    .build();
  const tbxRequestIdentifier = uuidv4();
  console.log(
    `About to make a tbxRequest on ${fetchDataUrl} using uniqueId: ${tbxRequestIdentifier} for fetching data`
  );

  try {
    const tbxRequest = superagent
      .get(fetchDataUrl)
      .set(constants.CUSTOMER_REQUEST_TRACING_IDENTIFIER, uuidv4())
      .set(
        constants.TRAVELBOX_SINGLE_MESSAGE_TRACING_IDENTIFIER,
        tbxRequestIdentifier
      )
      .set('Ocp-Apim-Subscription-Key', travelboxSubscriptionKey);

    const tbPackageSearchResponse = await tbxRequest;

    return tbPackageSearchResponse.body;
  } catch (e: any) {
    throw new Error(
      `Error when fetching from travelbox API: ${JSON.stringify(
        e.response.body
      )}`
    );
  }
};

export const fetchSubItineraries = async (
  tbxPackage: TravelBoxPackageData,
  travelboxUrl: string,
  travelboxSubscriptionKey: string
): Promise<TravelBoxPackageData[]> => {
  const alternativeLink = tbxPackage.links.find(
    (link) => link.rel === 'alternative'
  );

  if (!alternativeLink?.href) {
    console.log('No alternative links found');
    return [];
  }

  try {
    const tbxRequestIdentifier = uuidv4();
    const reqUrl = `${travelboxUrl}/tbx${alternativeLink.href}&expand=all`;
    console.log(
      `Fetching travelbox sub-itinerary for uniqueId ${tbxRequestIdentifier}: ${reqUrl.substr(
        0,
        200
      )}...`
    );
    const tbxRequest = superagent
      .get(reqUrl)
      .set(constants.CUSTOMER_REQUEST_TRACING_IDENTIFIER, uuidv4())
      .set(
        constants.TRAVELBOX_SINGLE_MESSAGE_TRACING_IDENTIFIER,
        tbxRequestIdentifier
      )
      .set('Ocp-Apim-Subscription-Key', travelboxSubscriptionKey);

    const tbSubItineraryResponse = await tbxRequest.then((res) => {
      if (res.body.length === 0) {
        return [];
      }

      return res.body;
    });
    return await tbSubItineraryResponse;
  } catch (e) {
    console.log(e);
    return [];
  }
};
