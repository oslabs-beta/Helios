import db from './mainIdb';

function getRegionIDB() {
  return db.accountRegion.toArray().catch((error) => {
    console.error('error while getting ARNs', error);
    throw error;
  });
}

export default getRegionIDB;
