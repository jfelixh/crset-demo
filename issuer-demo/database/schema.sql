CREATE TABLE companyDataBase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    jobTitle TEXT NOT NULL,
    employmentType TEXT NOT NULL,
    isBfcPublish BOOLEAN NOT NULL CHECK (isBfcPublish IN (0, 1)),
    manager TEXT
);