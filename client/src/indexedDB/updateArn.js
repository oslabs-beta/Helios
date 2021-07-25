import db from "./mainIdb";

async function updateArn({ arn }) {
  console.log(arn);
  await db.registerArn.clear().catch((error) => {
    console.error("error deleting existing arn from storage", error);
    throw error;
  });
  return db.registerArn.put({ arn });
}
export default updateArn;
