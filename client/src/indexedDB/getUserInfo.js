import db from './mainIdb';

function getUserInfoArrayIDB() {
  return db.userInfo.toArray().catch((error) => {
    console.error('error while getting ARNs', error);
    throw error;
  });
}

export default getUserInfoArrayIDB;
