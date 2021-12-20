import { Itinerary } from 'data-models/PackageStore';

const REGION_SUBSTITUTE_KEYWORD = 'BrandRegion';

export const getYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return [currentYear.toString(), nextYear.toString()];
};

export const isFlightAndHotel = (itinerary: Itinerary) => {
  return (
    itinerary.components.filter(
      (component) => 'FLT' === component.componentType
    ).length > 0
  );
};

export const getKeyRegionFromBrandRegion = (brandRegion: string): string => {
  switch (brandRegion.toLowerCase()) {
    case 'fcau':
      return 'AU';
    case 'fcnz':
      return 'NZ';
    case 'fcca':
      return 'CA';
    case 'fcza':
      return 'ZA';
    default:
      return 'AU';
  }
};

export const buildSSMPath = (tbxKeyPath: string) => (brandRegion: string) => {
  const keyRegion = getKeyRegionFromBrandRegion(brandRegion);
  const ssmKeyPath = tbxKeyPath.replace(REGION_SUBSTITUTE_KEYWORD, keyRegion);
  return {
    brandRegion: brandRegion,
    path: ssmKeyPath,
  };
};
