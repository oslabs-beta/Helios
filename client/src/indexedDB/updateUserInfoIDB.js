import db from "./mainIdb";

async function updateUserInfoIDB({ firstName, email }) {
  await db.userInfo.clear().catch((error) => {
    console.error("error deleting existing userInfo from storage", error);
    throw error;
  });

  return db.userInfo.put({ firstName, email });
}

export default updateUserInfoIDB;
