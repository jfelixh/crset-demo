import * as database from "../../../../database/database";
import { UnpublishedEntries } from "@/app/types/UnpublishedEntries";

export const GET = async () => {
  console.log("Fetching unpublished entries...");
  try {
    const response = await getUnpublishedEntries();
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching unpublished entries:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch unpublished entries" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

const getUnpublishedEntries = async (): Promise<any[]> => {
  const db = await database.connectToDb();
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
        rows.forEach((row: any) => {
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
