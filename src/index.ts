import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { mapTBXPackageToElasticPackage } from './flexi-tbx-service/shared/mappers';
import elitePkgs from './samples/elite.json';

// const travelboxUrl = process.env.TRAVELBOX_URL ?? '';
// const travelboxKey = process.env.TRAVELBOX_SUBSCRIPTION_KEY ?? '';
// const startYear = '2021';

// Notes
// AU243921 - Itin 1 (ITIN-24392-1): CAR, 2 HTL, 1 GEN. Itin 2: 2HTL, 1 GEN. CMS- Departure start/end & publish start/expiry dates added. Nothing else
// 12941252 - 1 HTL. No CMS. Only 1 itinerary
// AU24815 - 1 FLT, TRS & HTL. No CMS. Only 1 itinerary

const importElitePackages = async () => {
  // map base elastic package
  const pkgs = elitePkgs.map((pkg: any) =>
    mapTBXPackageToElasticPackage(pkg, () => ({}))
  );

  // map itineraries and sub itineraries into itineraries

  // map CMS content

  // write JSON output to each file
  fs.writeFile('output.json', JSON.stringify(pkgs), () => ({}));
};

importElitePackages().then();
