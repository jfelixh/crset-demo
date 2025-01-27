import * as database from "../../../../database/database";
import * as sqlite from "sqlite3";

let db: sqlite.Database;

export async function POST(req: Request){
    const {idToCheck} = await req.json();

    //console.log("Authorization check for id: ", idToCheck);

    try{
        const credentialSubjectIds = await getAllCredentialSubjectIds(db);
       // console.log("Credential Subject IDs: ", credentialSubjectIds);
       // const result = searchCredentialSubjectId(credentialSubjectIds, "did:key:z6MkkdC46uhBGjMYS2ZDLUwCrTWdaqZdTD3596sN4397oRNd");
       const result = searchCredentialSubjectId(credentialSubjectIds, idToCheck);
        if(result){
           // const credentialSubjectInfo = await getCredentialSubjectInfo(db, "did:key:z6MkkdC46uhBGjMYS2ZDLUwCrTWdaqZdTD3596sN4397oRNd");
           const credentialSubjectInfo = await getCredentialSubjectInfo(db, idToCheck);
          // console.log("Credential Subject Info: ", credentialSubjectInfo);
            //console.log("Success for admin:",(credentialSubjectInfo[0].jobTitle as string).toLowerCase() === "admin")
          return new Response(JSON.stringify({ success: (credentialSubjectInfo[0].jobTitle as string).toLowerCase() === "admin" }), { status: 200 })
          // return new Response(JSON.stringify({ success: (credentialSubjectInfo.email as string) === 'felix.hoops@tum.de' }))
        }
        //console.log("Success for non-admin:", result)
        return new Response(JSON.stringify({ success: result }), { status: 200 })

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
        // Query for all rows in the companyDataBase table
        db.all("SELECT VC FROM companyDataBase", [], (err, rows) => {
            if (err) {
                console.error("Error querying VC:", err.message);
                reject(err);
            } else {
                const results = [];
                
                // Loop through all rows and process each VC
                rows.forEach(row => {
                    if (row && row.VC) {
                        try {
                            // Parse the VC JSON
                            const vc = JSON.parse(row.VC);
                            
                            // Check if the credentialSubject id matches the provided id
                            if (vc.credentialSubject?.id === credentialSubjectId) {
                                const credentialSubject = vc.credentialSubject;
                                
                                // Push relevant information to the results array
                                results.push({
                                    name: credentialSubject.name,
                                    familyName: credentialSubject.familyName,
                                    email: credentialSubject.email,
                                    companyName: credentialSubject.companyName,
                                    jobTitle: credentialSubject.jobTitle
                                });
                            }
                        } catch (e) {
                            console.error("Error parsing VC JSON:", e.message);
                        }
                    }
                });
                
                // Resolve with the results, or null if no matching subjects were found
                resolve(results.length > 0 ? results : null);
            }
        });
    });
}
