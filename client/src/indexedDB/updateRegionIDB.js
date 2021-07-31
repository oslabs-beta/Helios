import db from './mainIdb';

async function updateRegionIDB({ region }) {
  await db.accountRegion.clear().catch((error) => {
    console.error('error deleting existing region from storage', error);
    throw error;
  });
  return db.accountRegion.put({ region });
}

export default updateRegionIDB;
