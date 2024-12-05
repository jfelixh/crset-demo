CREATE TABLE loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,              -- UUID for unique identification
    amount REAL NOT NULL,             -- Loan amount as a floating-point number
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp with a default value
    applicant TEXT NOT NULL           -- Decentralized Identifier (DID) of the loan applicant
);

-- Populate the table with some sample data
INSERT INTO loans (id, amount, applicant) VALUES
    ('1', 1000.0, 'did:example:123'),
    ('2', 2000.0, 'did:example:456');