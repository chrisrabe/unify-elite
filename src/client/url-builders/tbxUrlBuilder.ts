export class TravelboxAPIUrlBuilder {
  travelboxUrl: string;
  queryParams: string[];

  constructor(travelboxUrl: string, startYear: string) {
    this.travelboxUrl = `${travelboxUrl}/tbx/package-search/v2/products`;
    this.queryParams = ['pkgType=EPKG', 'searchType=WIDE_SEARCH', `startYear=${startYear}`, 'expand=all'];
  }

  withCurrency(currency: string): TravelboxAPIUrlBuilder {
    this.queryParams.push('cur=' + currency);
    return this;
  }

  withSrcCountry(srcCountry: string): TravelboxAPIUrlBuilder {
    this.queryParams.push('srcCountry=' + srcCountry);
    return this;
  }

  withPax(adultCount: string): TravelboxAPIUrlBuilder {
    this.queryParams.push('adult=' + adultCount);
    return this;
  }

  build(): string {
    return `${this.travelboxUrl}?${this.queryParams.join('&')}`;
  }
}
