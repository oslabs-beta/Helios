import db from "./mainIdb";

async function updateIDBSignIn({ email, password }) {
  await db.signin.clear().catch((error) => {
    console.error("error deleting sign in stored data", error);
    throw error;
  });
  return db.signin.put({ email, password });
}

export default updateIDBSignIn;