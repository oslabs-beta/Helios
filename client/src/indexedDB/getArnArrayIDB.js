import db from './mainIdb';

function getArnArrayIDB() {
  console.log('hit get arn array');
  return db.arnRegistry.toArray().catch((error) => {
    console.error('error while getting ARNs', error);
    throw error;
  });
}

export default getArnArrayIDB;
