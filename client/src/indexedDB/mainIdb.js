import Dexie from 'dexie';

let db = new Dexie('Helios');

db.version(1).stores({
  userInfo: '++id, firstName, email',
  arnRegistry: '++id, arn',
  accountRegion: '++id, region',
});

db.open().catch(function (e) {
  console.error('error' + e);
});

export default db;
