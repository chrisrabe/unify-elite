import { MappingFunction } from './mapper';
import { TravelboxPackage } from '../data-models/tbxAPIModels';
import {
  ElasticPackage,
  ElasticPackageType,
} from '../data-models/elasticModels';

export const mapTBXPackageToElasticPackage: MappingFunction<
  TravelboxPackage,
  ElasticPackage
> = (pkg) => {
  return {
    // root metadata
    id: pkg.detail.pkgCode, // packageId
    name: pkg.summary.name,
    type: getElasticType(pkg.detail.holidayType),
    productCode: pkg.productCode,
    productKey: pkg.productKey,
    defaultItineraryId: pkg.detail.itinCode, // detail.itinCode
    destination: {
      cityCode: pkg.detail.destination.cityCode,
      cityName: pkg.detail.destination.cityName,
    },
    startDate: pkg.summary.travelDates.startDate,
    endDate: pkg.summary.travelDates.endDate ?? '',
    exclusive: isExclusive(pkg.detail.holidayType),

    // fields to fill later
    itineraries: [],
  };
};

const isExclusive = (holidayType: string): boolean => {
  return holidayType.toLowerCase().split(',').includes('exclusive');
};

export const isLite = (holidayType: string): boolean => {
  return holidayType.toLowerCase().split(',').includes('website offers');
}

export const getElasticType = (holidayType: string): ElasticPackageType => {
  if (isLite(holidayType)) {
    return ElasticPackageType.lite;
  }
  return ElasticPackageType.curated;
};
