CREATE TABLE IF NOT EXISTS companyDataBase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    jobTitle TEXT NOT NULL,
    employmentType TEXT NOT NULL,
    isPublished BOOLEAN NOT NULL CHECK (isPublished IN (0, 1)),
    manager TEXT NOT NULL,
    VC TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bfcLogs (
    validIdsSize INTEGER NOT NULL,
    invalidIdsSize INTEGER NOT NULL,
    serializedDataSize INTEGER NOT NULL,
    constructionTimeInSec REAL NOT NULL,
    publicationTimeInSec REAL NOT NULL,
    numberOfBlobs INTEGER NOT NULL,
    transactionHash TEXT PRIMARY KEY NOT NULL,
    blobVersionedHash TEXT NOT NULL,
    publicationTimestamp TEXT NOT NULL,
    transactionCost REAL NOT NULL,
    calldataTotalCost REAL NOT NULL,
    numberOfBfcLayers INTEGER NOT NULL,
    rHat REAL NOT NULL
);
