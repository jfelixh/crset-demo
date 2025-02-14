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