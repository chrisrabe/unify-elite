export interface CMSContentResponse {
  code: string;
  id: number;
  name: string;
  type: string;
  validFrom: string;
  validTo: string;
  published: boolean;
  provider: string;
  refCode: string;
  createdDateTime: string;
  createdDateTimeWithTimeZone: string;
  modifiedDateTime: string;
  modifiedDateTimeWithTimeZone: string;
  modifiedUser: string;
  createdUser: string;
  contentItems: ContentItem[];
}

export interface ContentItem {
  itemNo: number;
  itemRef: string;
  itemType: string;
  modifiedDateTime: string;
  contentItemVersions?: ContentItemVersion[];
}

export interface ContentItemVersion {
  version: number;
  versionRef?: string;
  published: boolean;
  latest: boolean;
  contentItemLocales?: ContentItemLocale[];
  contentItemImages?: ContentItemImage[];
  modifiedDate: string;
}

export interface ContentItemLocale {
  locale: string;
  name: string;
  description: string;
  modifiedDateTime: string;
}

export interface ContentItemImage {
  imageNo: number;
  imageURL: string;
  thumbnailURL: string;
  modifiedDateTime: string;
}
