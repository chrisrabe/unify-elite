import {
  CMSContentResponse,
  ContentItem,
  ContentItemImage,
} from 'data-models/CMSContentResponse';
import { format, isMatch, parse } from 'date-fns';
import { enAU } from 'date-fns/locale';
import {
  Content,
  ContentImage,
  PackageInclusion,
  PackageStore,
} from 'data-models/PackageStore';
import { ENABLED_COMPONENTS } from '../constants/EnabledContentComponents';
import { notUndefined } from 'utils/filters';

const ContentListSeparator = '\n';
const ENGLISH_LOCALE = 'en';

export const addCMSContentToPackage = (
  packageData: PackageStore,
  cmsContent: CMSContentResponse | null,
  logMessage: (message: string) => void
): void => {
  if (!cmsContent || !cmsContent.contentItems) {
    logMessage('No Travelbox CMS content to add');
    return;
  }
  const logMessageWithCMSReference = (message: string) => {
    logMessage(`${cmsContent.refCode}: ${message}`);
  };
  packageData.inclusions = mapInclusions(cmsContent.contentItems);
  packageData.content = mapContentData(
    cmsContent.contentItems,
    logMessageWithCMSReference
  );
};

const mapContentData = (
  cmsItineraryContents: ContentItem[],
  logMessage: (message: string) => void
) => {
  return cmsItineraryContents
    .filter(removeDeletedComponents)
    .map((cmsItineraryContent) => {
      let content: Content | undefined = undefined;
      switch (cmsItineraryContent.itemType) {
        case ENABLED_COMPONENTS.cepWowFactor2:
        case ENABLED_COMPONENTS.cepDescription:
        case ENABLED_COMPONENTS.cepWhyWeLoveItSubtitle:
        case ENABLED_COMPONENTS.cepWhyWeLoveItTitle:
        case ENABLED_COMPONENTS.termsConditions:
        case ENABLED_COMPONENTS.consultantNotes:
        case ENABLED_COMPONENTS.basePriceFlyStay:
        case ENABLED_COMPONENTS.basePriceStay:
        case ENABLED_COMPONENTS.valuedAtFlyStay:
        case ENABLED_COMPONENTS.valuedAtStay:
          content =
            contentMappers.COMPONENT_WITH_TEXT_MAPPER(cmsItineraryContent);
          break;
        case ENABLED_COMPONENTS.cepPkgImageGallery:
          content =
            contentMappers.COMPONENT_WITH_LIST_OF_IMAGES_AND_TEXT_MAPPER(
              cmsItineraryContent
            );
          break;
        case ENABLED_COMPONENTS.cepWhyWeLoveItUSPs:
          content =
            contentMappers.COMPONENT_WITH_TEXT_LIST_MAPPER(cmsItineraryContent);
          break;
        case ENABLED_COMPONENTS.packagePublishDate:
        case ENABLED_COMPONENTS.packageExpiryDate:
        case ENABLED_COMPONENTS.travelStartDate:
        case ENABLED_COMPONENTS.travelEndDate:
          content = contentMappers.DATE_COMPONENT_MAPPER(
            cmsItineraryContent,
            logMessage
          );
          break;
        case ENABLED_COMPONENTS.imageGalleryItem:
          content =
            contentMappers.COMPONENT_WITH_IMAGE_AND_TEXT(cmsItineraryContent);
          break;
      }
      return content;
    })
    .filter(notUndefined); // filter out undefined elements
};

const mapInclusions = (
  cmsItineraryContents: ContentItem[]
): PackageInclusion[] =>
  cmsItineraryContents
    .filter(removeDeletedComponents)
    .filter(
      (component) =>
        ENABLED_COMPONENTS.cepHolidayInclusionGeneric === component.itemType
    )
    .map((packageInclusion) => ({
      type: packageInclusion.itemType,
      title: getLatestTextContentInEnglish(packageInclusion)?.name ?? '',
      description:
        getLatestTextContentInEnglish(packageInclusion)?.description ?? '',
    }));

const getLatestContentItem = (item: ContentItem) =>
  item.contentItemVersions
    ?.filter((itemVersion) => itemVersion.published)
    .sort((firstItem, secondItem) => secondItem.version - firstItem.version) //version Desc
    .filter((itemVersion) => itemVersion.latest)[0];

const getLatestTextContentInEnglish = (item: ContentItem) => {
  const latestContentItem = getLatestContentItem(item);

  if (
    latestContentItem &&
    Array.isArray(latestContentItem.contentItemLocales)
  ) {
    return latestContentItem.contentItemLocales?.filter(
      (itemLocale) => itemLocale.locale === ENGLISH_LOCALE
    )[0];
  }

  return undefined;
};

const convertDate = (
  date: ContentItem,
  logMessage: (message: string) => void
): string | undefined => {
  const englishDate = getLatestTextContentInEnglish(date)?.description;

  if (!englishDate) {
    logMessage(`No valid date found for ${date.itemType}`);
    return undefined;
  }

  if (!isMatch(englishDate, 'dd/mm/yyyy', { locale: enAU })) {
    logMessage(
      `Invalid date format for ${date.itemType} - received ${englishDate} - expected dd/MM/yyyy`
    );
    return undefined;
  }

  const convertedDate = parse(englishDate, 'dd/MM/yyyy', new Date(), {
    locale: enAU,
  });

  return format(convertedDate, "yyyy-MM-dd'T'HH:mmXX");
};

const mapContentImage = (image: ContentItemImage): ContentImage => ({
  index: image.imageNo,
  imageURL: image.imageURL,
  thumbnailURL: image.thumbnailURL,
});

const contentMappers = {
  COMPONENT_WITH_TEXT_MAPPER: (item: ContentItem): Content => ({
    type: item.itemType,
    key: item.itemRef,
    description: getLatestTextContentInEnglish(item)?.description,
  }),
  COMPONENT_WITH_TITLE_AND_TEXT_MAPPER: (item: ContentItem): Content => ({
    type: item.itemType,
    key: item.itemRef,
    title: getLatestTextContentInEnglish(item)?.name,
    description: getLatestTextContentInEnglish(item)?.description,
  }),
  COMPONENT_WITH_TEXT_LIST_MAPPER: (item: ContentItem): Content => ({
    type: item.itemType,
    key: item.itemRef,
    descriptionList:
      getLatestTextContentInEnglish(item)?.description.split(
        ContentListSeparator
      ),
  }),
  COMPONENT_WITH_LIST_OF_IMAGES_MAPPER: (item: ContentItem): Content => ({
    type: item.itemType,
    key: item.itemRef,
    images: getLatestContentItem(item)?.contentItemImages?.map(mapContentImage),
  }),
  COMPONENT_WITH_LIST_OF_IMAGES_AND_TEXT_MAPPER: (
    item: ContentItem
  ): Content => ({
    type: item.itemType,
    key: item.itemRef,
    description: getLatestTextContentInEnglish(item)?.description,
    images: getLatestContentItem(item)?.contentItemImages?.map(mapContentImage),
  }),
  DATE_COMPONENT_MAPPER: (
    item: ContentItem,
    logMessage: (message: string) => void
  ): Content => ({
    type: item.itemType,
    key: item.itemRef,
    description: convertDate(item, logMessage),
  }),
  COMPONENT_WITH_IMAGE_AND_TEXT: (item: ContentItem): Content => ({
    type: item.itemType,
    key: item.itemRef,
    description: getLatestTextContentInEnglish(item)?.description,
    title: getLatestTextContentInEnglish(item)?.name,
    images: getLatestContentItem(item)?.contentItemImages?.map(mapContentImage),
  }),
};

//TBX has a bug where deleted components will still be returned, albeit without content
//This method will filter them out
const removeDeletedComponents = (cmsItineraryContent: ContentItem) => {
  return cmsItineraryContent.contentItemVersions !== undefined;
};
