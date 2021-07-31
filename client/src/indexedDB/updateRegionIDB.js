import db from './mainIdb';

async function updateRegionIDB({ region }) {
  await db.accountRegion.clear().catch((error) => {
    console.error('error deleting existing arn from storage', error);
    throw error;
  });
  console.log('inside updating region indexedDB: ', region);
  return db.accountRegion.put({ region });
}

export default updateRegionIDB;
