import db from "./mainIdb";

function getArnArrayIDB() {
  return db.arnRegistry.toArray().catch((error) => {
    console.error("error while getting ARNs", error);
    throw error;
  });
}

export default getArnArrayIDB;
