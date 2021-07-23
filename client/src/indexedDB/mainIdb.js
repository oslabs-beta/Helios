import Dexie from "dexie";

let db = new Dexie("helios_database");

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
