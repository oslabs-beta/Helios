import db from "./mainIdb";

async function updateIDBSignUp({ firstName, lastName, email, password }) {
  //delete the stored signup data
  await db.signup.clear().catch((error) => {
    console.error("error deleting sign up stored data", error);
    throw error;
  });

  return db.signup.put({ firstName, lastName, email, password });

}

export default updateIDBSignUp;
