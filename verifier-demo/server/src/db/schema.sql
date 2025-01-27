CREATE TABLE loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- UUID for unique identification
    amount REAL NOT NULL, -- Loan amount as a floating-point number
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp with a default value
    applicant TEXT NOT NULL, -- Decentralized Identifier (DID) of the loan applicant
    employed_by TEXT, -- Company name of the employer
    application_dump TEXT NOT NULL -- JSON dump of the loan application
);

-- Create an index on applicant for faster lookups
CREATE INDEX IF NOT EXISTS idx_loans_applicant ON loans (applicant);

-- Create an index on timestamp for time-based queries
CREATE INDEX IF NOT EXISTS idx_loans_timestamp ON loans (timestamp);