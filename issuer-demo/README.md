This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

# Run the demo

1. Install dependencies with `npm install`
2. Inside issuer-demo folder, run `docker-compose up ` to start redis
3. Inside issuer-demo folder, run `npm run dev` to start the nextjs issuer-demo app
4. Inside issuer-demo folder, go inside bfc-status-issuer-backend folder and run `npm run dev` to start the issuer-backend

# Setup

Database setup:

1. Inside database folder, inside database.ts there is a function to create a table for companyDataBase and statusEntry. Put them inside initDB() function and run uncomment initDB() and run it (only if you dont have the database tables already)
2. Inside database folder, inside database.ts there is a function to clear the tables (if there is data inside them). Clear them inside initDB() function and run uncomment initDB() and run it.
3. Following the steps above, you can perform the same steps to populate the companyDataBase table and statusEntry table with the data from the csv file.

4. Create admin (ignore the functions inside database.ts to create an admin)
   4.1. Start the app and go to localhost:3000/credentialIssuance and create a certificate for you. This way we have a qr code in our wallet. !!IMPORTANT!! Make sure jobTitle is "admin"
   4.2. You should be able to authenticate using this credential
