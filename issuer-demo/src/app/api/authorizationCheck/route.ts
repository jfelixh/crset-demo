import * as database from "../../../../database/database";
import * as sqlite from "sqlite3";

let db: sqlite.Database;

export async function POST(req: Request){
    const {idToCheck} = await req.json();

    try{
        const credentialSubjectIds = await getAllCredentialSubjectIds(db);
      //  console.log("Credential Subject IDs: ", credentialSubjectIds);
       // const result = searchCredentialSubjectId(credentialSubjectIds, "did:key:z6MkkdC46uhBGjMYS2ZDLUwCrTWdaqZdTD3596sN4397oRNd");
       const result = searchCredentialSubjectId(credentialSubjectIds, idToCheck);
       // console.log("Result from the search: ", result);
        if(result){
           // const credentialSubjectInfo = await getCredentialSubjectInfo(db, "did:key:z6MkkdC46uhBGjMYS2ZDLUwCrTWdaqZdTD3596sN4397oRNd");
           const credentialSubjectInfo = await getCredentialSubjectInfo(db, idToCheck);
          return new Response(JSON.stringify({ success: (credentialSubjectInfo.jobTitle as string).toLowerCase() === "admin" }))
          // return new Response(JSON.stringify({ success: (credentialSubjectInfo.email as string) === 'felix.hoops@tum.de' }))
        }
        return new Response(JSON.stringify({ success: result }))

    }catch(err){
        return new Response(JSON.stringify({ error: "Error fetching credential subject ids" }), { status: 500 });
    }
}

async function getAllCredentialSubjectIds(db: sqlite.Database): Promise<Set<string>> {
    db = await database.connectToDb("./database/bfc.db");
    return new Promise((resolve, reject) => {
        db.all("SELECT VC FROM companyDataBase", [], (err, rows) => {
            if (err) {
                console.error("Error querying VCs:", err.message);
                reject(err);
            } else {
                const credentialSubjectIds: Set<string> = new Set();
                
                rows.forEach((row) => {
                    if (row.VC) {
                        try {
                            const vc = JSON.parse(row.VC);
                            const credentialSubjectId = vc.credentialSubject?.id;
                            if (credentialSubjectId) {
                                credentialSubjectIds.add(credentialSubjectId);
                            }
                        } catch (e) {
                            console.error("Error parsing VC JSON:", e.message);
                        }
                    }
                });

                resolve(credentialSubjectIds);
            }
        });
    });
}


function searchCredentialSubjectId(credentialSubjectIds: Set<string>, id: string): boolean {
    return credentialSubjectIds.has(id);
}

async function getCredentialSubjectInfo(db: sqlite.Database, credentialSubjectId: string): Promise<any> {
    db = await database.connectToDb("./database/bfc.db");
    return new Promise((resolve, reject) => {
        // Query for the VC where the credentialSubject.id matches the provided id
        db.get("SELECT VC FROM companyDataBase", [], (err, row) => {
            if (err) {
                console.error("Error querying VC:", err.message);
                reject(err);
            } else {
                if (row && row.VC) {
                    try {
                        // Parse the VC JSON
                        const vc = JSON.parse(row.VC);
                        console.log("VC from my function: ", vc);
                        // Extract credentialSubject information if the id matches
                        if (vc.credentialSubject?.id === credentialSubjectId) {
                            const credentialSubject = vc.credentialSubject;
                            console.log("Credential Subject: FROM MY FUNCTION: ", credentialSubject);
                            
                            // Return the relevant information from the credentialSubject
                            resolve({
                                name: credentialSubject.name,
                                familyName: credentialSubject.familyName,
                                email: credentialSubject.email,
                                companyName: credentialSubject.companyName,
                                jobTitle: credentialSubject.jobTitle
                            });
                        } else {
                            resolve(null); // If the id doesn't match, return null
                        }
                    } catch (e) {
                        console.error("Error parsing VC JSON:", e.message);
                        reject(e);
                    }
                } else {
                    resolve(null); // If no VC is found, return null
                }
            }
        });
    });
}
