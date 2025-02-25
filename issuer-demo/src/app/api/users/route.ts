import * as database from "../../../../database/database";

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

const getAllUsers = async (): Promise<User[]> => {
  const db = await database.connectToDb();
  try {
    const getUsers = new Promise<User[]>((resolve, reject) => {
      db.all(
        "SELECT * FROM companyDataBase ORDER BY name ASC LIMIT 10000",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const users: User[] = [];
            rows.forEach((row: any) => {
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
