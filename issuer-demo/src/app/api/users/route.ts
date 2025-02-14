import * as sqlite from "sqlite3";
import * as database from "../../../../database/database";

let db: sqlite.Database;

type User = {
  name: string;
  email: string;
  jobTitle: string;
  VC: string;
  published: boolean;
};

export const GET = async () => {
  try {
    // console.log("Fetching users...");
    const users = await getAllUsers();
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return an error response
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  //console.log("Connecting to SQLite database...");
  db = await database.connectToDb("data/bfc.db");
  // console.log("Connected to SQLite database1.");
  //   console.log(db)

  try {
    const getUsers = new Promise<User[]>((resolve, reject) => {
      db.all(
        "SELECT * FROM companyDataBase ORDER BY name ASC LIMIT 10000",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const users: User[] = [];
            rows.forEach((row) => {
              users.push({
                name: row.name,
                email: row.email,
                jobTitle: row.jobTitle,
                VC: row.VC,
                published: row.isPublished === 1,
              });
            });
            resolve(users); // Resolve with the populated users array
          }
        },
      );
    });
    // Usage:
    const userData = await getUsers;
    return userData;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};
