import * as sqlite from "sqlite3";
import * as database from "../../../../database/database";

let db: sqlite.Database;
export const POST = async () => {
  try {
    console.log("Posting to publish BFC...");
    await fetch("http://bfc-issuer-backend:5050/api/status/publishBFC", {
      method: "POST",
    });
    db = await database.connectToDb("data/bfc.db");
    setAllPublished(db);
    console.log("Published BFC successfully");
    return new Response("Published BFC successfully", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error publishing BFC", error);
    // Return an error response
    return new Response(JSON.stringify({ error: "Publishing BFC failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

function setAllPublished(db: sqlite.Database) {
  db.run(`UPDATE companyDataBase SET isPublished = 1`, (err: any) => {
    if (err) {
      console.error("Error updating entries:", err.message);
      return;
    }
    console.log("All entries have been set to published.");
  });
}
