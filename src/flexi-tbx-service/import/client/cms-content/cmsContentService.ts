'use strict';
import { CMSContentResponse } from 'data-models/CMSContentResponse';
import * as superagent from 'superagent';
import { constants } from 'config/constants';
import { TravelboxCMSUrlBuilder } from '../url-builders/cmsUrlBuilder';
import { v4 as uuidv4 } from 'uuid';

export const fetchCmsContent = async (
  itineraryCode: string,
  travelboxUrl: string,
  travelboxSubscriptionKey: string
): Promise<CMSContentResponse | null> => {
  try {
    const date = new Date();
    const travelBoxContentUrl = new TravelboxCMSUrlBuilder(
      travelboxUrl,
      itineraryCode
    )
      .withStartTime(date.getTime())
      .build();

    console.log(`Fetching content: ${travelBoxContentUrl.substr(0, 200)}...`);

    const tbxRequest = superagent
      .get(travelBoxContentUrl)
      .set(constants.CUSTOMER_REQUEST_TRACING_IDENTIFIER, uuidv4())
      .set('Ocp-Apim-Subscription-Key', travelboxSubscriptionKey);

    const response = await tbxRequest;

    if (response.body.length === 0) {
      return null;
    }

    return response.body[0];
  } catch (e: any) {
    throw new Error(`Couldn't find CMS content profile for ${itineraryCode}`);
  }
};
