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

// db.lambdas
//   .put({ invocations: "invocationsArr", metrics: "metricsArr" })
//   .then(function () {
//     // Then when data is stored, read from it
//     return db.lambdas.get("invocationsArr");
//   })
//   .then(function (lambda) {
//     //
//     // Display the result
//     //
//     console.log("This is the log " + lambda.invocations);
//   })
//   .catch(function (error) {
//     //
//     // Finally don't forget to catch any error
//     // that could have happened anywhere in the
//     // code blocks above.
//     //
//     console.log(error, "error");
//   });

export default db;
