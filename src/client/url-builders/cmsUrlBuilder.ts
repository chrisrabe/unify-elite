export class TravelboxCMSUrlBuilder {
  travelboxUrl: string;
  queryParams: string[];

  constructor(travelboxUrl: string, iterenaryCode: string) {
    this.travelboxUrl = `${travelboxUrl}/tbx/content-read/v2/content-profiles/${iterenaryCode}`;
    this.queryParams = ['locale=EN', 'published=true', 'latest=true'];
  }

  withStartTime(startTime: number): TravelboxCMSUrlBuilder {
    this.queryParams.push('s=' + startTime);
    return this;
  }

  build(): string {
    return `${this.travelboxUrl}?${this.queryParams.join('&')}`;
  }
}
