import db from './mainIdb';

async function clearIDB() {
  await db.arnRegistry.clear().catch((error) => {
    console.error('error deleting existing arn from storage', error);
    throw error;
  });
  await db.accountRegion.clear().catch((error) => {
    console.error('error deleting existing region from storage', error);
    throw error;
  });
  await db.userInfo.clear().catch((error) => {
    console.error('error deleting existing userInfo from storage', error);
    throw error;
  });
}

export default clearIDB;
