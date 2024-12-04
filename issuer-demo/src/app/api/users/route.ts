import * as sqlite from "sqlite3";
import * as database from "../../../../database/database";
import {NextApiRequest, NextApiResponse} from "next";

let db: sqlite.Database;

type User = {
    name: string;
    email_address: string;
    jobTitle: string;
    VC: string;
};

export const GET = async (req, res) => {
    try {
        console.log("Fetching users...");
        const users = await getAllUsers();
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching users:', error);

        // Return an error response
        return new Response(
            JSON.stringify({error: 'Failed to fetch users'}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    console.log("Connecting to SQLite database...");
    db = await database.connectToDb("database/bfc.db");
    console.log("Connected to SQLite database1.");
    console.log(db)
    const users: User[] = [];

    try {
        const getUsers = new Promise<User[]>((resolve, reject) => {
            db.all("SELECT * FROM companyDataBase", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const users: User[] = [];
                    rows.forEach((row) => {
                        users.push({
                            name: row.name,
                            email_address: row.email,
                            jobTitle: row.jobTitle,
                            VC: row.VC,
                        });
                    });
                    resolve(users); // Resolve with the populated users array
                }
            });
        });
        // Usage:
        const userData = await getUsers;
        console.log("Users:", userData[0]);
        return userData;
    } catch (error) {
        console.error("Error getting users:", error);
        return [];
    }

};
