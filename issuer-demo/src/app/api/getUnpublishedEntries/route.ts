import * as sqlite from "sqlite3";
import * as database from "../../../../database/database";
import { UnpublishedEntries } from "@/app/types/UnpublishedEntries";

let db: sqlite.Database;

export const GET = async () => {
  console.log("Fetching unpublished entries...");
  try {
    db = await database.connectToDb("data/bfc.db");
    
    const response = await getUnpublishedEntries(db);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching unpublished entries:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to fetch unpublished entries' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

const getUnpublishedEntries = (db: sqlite.Database): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    console.log("Fetching unpublished companies from companyDataBase...");
    const query = `SELECT * FROM companyDataBase WHERE isPublished = 0`;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching unpublished companies:", err.message);
        reject(err); // Reject the promise if there's an error
        return;
      }

      const entries: UnpublishedEntries[] = [];
      if (rows.length === 0) {
        console.log("No unpublished entries found.");
      } else {
        console.log("Unpublished entries:");
        rows.forEach((row) => {
          entries.push({
            name: row.name,
            email: row.email,
            jobTitle: row.jobTitle,
            VC: row.VC,
            isPublished: row.isPublished,
          });
        });
      }
      //console.log("Entries:", entries);
      resolve(entries); 
    });
  });
};
