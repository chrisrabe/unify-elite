import dotenv from 'dotenv';
dotenv.config();
import { fetchTravelboxData } from './client';
import fs from 'fs';
import { detailedDiff } from 'deep-object-diff';
import { TravelBoxPackageData } from './data-models/TravelboxPackageData';

const travelboxUrl = process.env.TRAVELBOX_URL ?? '';
const travelboxKey = process.env.TRAVELBOX_SUBSCRIPTION_KEY ?? '';
const startYear = '2021';

const eliteCodes = ['AU243921', '12941252', 'AU24815'];

// Notes
// AU243921 - Itin 1 (ITIN-24392-1): CAR, 2 HTL, 1 GEN. Itin 2: 2HTL, 1 GEN. CMS- Departure start/end & publish start/expiry dates added. Nothing else
// 12941252 - 1 HTL. No CMS. Only 1 itinerary
// AU24815 - 1 FLT, TRS & HTL. No CMS. Only 1 itinerary

const importElitePackages = async () => {
  const result = await fetchTravelboxData(
    travelboxUrl,
    travelboxKey,
    startYear
  );
  const elitePkgs: TravelBoxPackageData[] = [];
  const curtdPkgs: TravelBoxPackageData[] = [];

  for (const pkg of result) {
    if (eliteCodes.includes(pkg.detail.pkgCode)) {
      elitePkgs.push(pkg);
    } else {
      curtdPkgs.push(pkg);
    }
  }

  const analysisElitePkg = analysePackage(elitePkgs);

  // write JSON output to each file
  fs.writeFile('elite-analysis.json', JSON.stringify(analysisElitePkg), () => ({}));
};

const analysePackage = (packages: TravelBoxPackageData[]) => {
  const pkgResults: Record<string, any> = {};
  for (let i = 0; i < packages.length; i++) {
    const pkg = packages[i];
    const results: Record<string, any> = {};
    for (let j = 0; j < packages.length; j++) {
      if (i === j) {
        continue;
      }
      const otherPkg = packages[j];
      results[`${pkg.detail.pkgCode}-${otherPkg.detail.pkgCode}`] =
        detailedDiff(pkg, otherPkg);
    }
    pkgResults[pkg.detail.pkgCode] = results;
  }
  return pkgResults;
};

importElitePackages().then();
