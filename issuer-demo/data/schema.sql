CREATE TABLE IF NOT EXISTS credentialStatus (
    id TEXT PRIMARY KEY UNIQUE,
    status INT CHECK (status IN (0, 1))
);

CREATE TABLE IF NOT EXISTS bfcLogs (
    validIdsSize INT,
    invalidIdsSize INT,
    serializedDataSize INT,
    constructionTimeInSec INT,
    publicationTimeInSec INT,
    numberOfBlobs INT,
    transactionHash TEXT,
    blobVersionedHash TEXT,
    publicationTimestamp TEXT,
    transactionCost INT,
    calldataTotalCost INT,
    numberOfBfcLayers INT,
    rHat INT
);