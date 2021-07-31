import db from './mainIdb';

async function updateArnIDB({ arn }) {
  await db.arnRegistry.clear().catch((error) => {
    console.error('error deleting existing arn from storage', error);
    throw error;
  });

  return db.arnRegistry.put({ arn });
}

export default updateArnIDB;
