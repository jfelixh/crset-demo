import * as sqlite from "sqlite3";
import {DBEntry} from "src/models/statusEntry";

export async function getIdsByStatus(
    db: sqlite.Database,
    status: string
): Promise<Set<string>> {
    return new Promise((resolve, reject) => {
        const ids = new Set<string>();

        db.all(
            "SELECT id FROM credentialStatus WHERE status = ?",
            [status],
            (err, rows: DBEntry[]) => {
                if (err) {
                    console.error("Error getting IDs by status:", err.message);
                    reject(err);
                    return;
                }

                // Populate the Set with emails
                rows.forEach((row) => ids.add(row.id));
                resolve(ids);
            }
        );
    });
}

export async function getStatusById(
    db: sqlite.Database,
    id: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT status FROM credentialStatus WHERE id = ?",
            [id],
            (err, row: DBEntry) => {
                if (err) {
                    console.error("Error getting status of id:", err.message);
                    reject(err);
                    return;
                }
                resolve(row.status);
            }
        );
    });
}

export async function updateStatusById(
    db: sqlite.Database,
    id: string,
    status: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE credentialStatus SET status = ? WHERE id = ?",
            [status, id],
            (err) => {
                if (err) {
                    console.error("Error updating status:", err.message);
                    reject(err);
                    return;
                }
                resolve();
            }
        );
    });
}

export async function patchStatusById(
    db: sqlite.Database,
    id: string,
    status: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE credentialStatus SET status = ? WHERE id = ?",
            [status, id],
            function (err) {
                if (err) {
                    console.error("Error updating entry status:", err.message);
                    reject(err);
                    return;
                }

                if (this.changes > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        );
    });
}

export async function insertStatusEntry(
    db: sqlite.Database,
    id: string,
    status: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO credentialStatus (id, status) VALUES (?, ?)",
            [id, status],
            (err) => {
                if (err) {
                    console.error("Error inserting status entry:", err.message);
                    reject(err);
                    return "";
                }
                resolve(id);
            }
        );
    });
}
