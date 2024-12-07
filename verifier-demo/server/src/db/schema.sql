CREATE TABLE newLoans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,              -- UUID for unique identification
    amount REAL NOT NULL,             -- Loan amount as a floating-point number
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp with a default value
    applicant TEXT NOT NULL,           -- Decentralized Identifier (DID) of the loan applicant
    employed_by TEXT,                  -- Company name of the employer
    application_dump TEXT NOT NULL     -- JSON dump of the loan application
);

-- Populate the table with some sample data
-- INSERT INTO newLoans (id, amount, applicant) VALUES
--     ('1', 1000.0, 'did:example:123'),
--     ('2', 2000.0, 'did:example:456');