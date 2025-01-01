# bfc-status-demo
A monorepo containing everything required to demo the BFC-Status for VCs.

## Getting Started
To get started with the bfc-status-demo, you need to clone the repository along with serveral submodules. Use the following command:

```sh
git clone --recurse-submodules https://github.com/jfelixh/bfc-status-demo.git
```

Alternatively, you can clone the repository as you would normally and then run the following command to initialize the submodules:

```sh
git submodule update --init --recursive --remote
```

The bfc-status-demo repository currently contains the following submodules:
- `bfc-status-check`
- `bfc-status-issuer-backend`
- `padded-bloom-filter-cascade`

A successful initialization of the submodules should result in the following submodule directory structure (other files exist in the repository as well):

```
bfc-status-demo/
├── bfc-status-check/
├── bfc-status-issuer-backend/
├── padded-bloom-filter-cascade/
│   └── bloomfilter-sha256/
```

## Prerequisites

### Altme Wallet
The bfc-status-demo requires the Altme Wallet to be installed in order to interact with the Ethereum blockchain. To install the Altme Wallet, follow the instructions on the [Altme Wallet website](https://altme.io/). Once installed, create a new wallet and save the private key.

### Ngrok
To make the demo pages publicly accessible to the wallet, ngrok is required. To install ngrok, follow the instructions on the [ngrok website](https://ngrok.com/download). Once installed, run the following command to create a public URL for the verifier-demo:

```sh
ngrok http 8080
```

And the following command to create a public URL for the issuer-demo:

```sh
ngrok http 3000
```

Both of these URLs will be required in the `.env` files for the verifier-demo and issuer-demo, specified in the forthcoming section.

### Redis
The verifier-demo requires Redis to be installed in order to store the state of the demo. To install Redis, follow the instructions on the [Redis website](https://redis.io/download). Once installed, run the following command to start the Redis server:

```sh
redis-server
```

### Initializing Dependencies
Before running the demo, you need to install the dependencies for each submodule. To do this, navigate to the root directory of the bfc-status-demo repository and run the following command:

```sh
chmod +x install_dependencies.sh
./install_dependencies.sh
```


### Env Files
The bfc-status-demo requires several environment files to be created in order to run the demo. The following environment files are required:

- `bfc-status-issuer-backend/.env`
Create an `.env` file in the `bfc-status-issuer-backend` directory with the following variables:

    ```
    PORT=8080
    INFURA_API_KEY=<your infura api key>
    ADDRESS=<your crypto wallet address>
    PRIVATE_KEY=<private key of your crypto wallet>
    DB_LOCATION='./src/db/bfc.db'
    ```

- `issuer-demo/.env`
Create an `.env` file in the `issuer-demo` directory with the following variables:

    ```
    NEXT_PUBLIC_URL=<ngrok url for port 3000>
    DID_KEY_JWK={"kty":"OKP","crv":"Ed25519","x":"cwa3dufHNLg8aQb2eEUqTyoM1cKQW3XnOkMkj_AAl5M","d":"me03qhLByT-NKrfXDeji-lpADSpVOKWoaMUzv5EyzKY"}
    ```

- `verifier-demo/server/.env`
Create an `.env` file here with the following variables:

    ```
    PORT=8080
    DID_KEY_JWK={"kty":"OKP","crv":"Ed25519","x":"cwa3dufHNLg8aQb2eEUqTyoM1cKQW3XnOkMkj_AAl5M","d":"me03qhLByT-NKrfXDeji-lpADSpVOKWoaMUzv5EyzKY"}
    LOGIN_POLICY=./src/policies/acceptAnything.json
    EXTERNAL_URL=<ngrok url for port 8080>
    REDIS_HOST=localhost
    REDIS_PORT=6380
    SECRET=FearIsTheMindKiller
    INFURA_API_KEY=<your infura api key>
    ALCHEMY_API_KEY=<your alchemy api key>
    BLOBSCAN_API_URL=https://api.sepolia.blobscan.com/blobs/
    MORALIS_API_KEY=<your moralis api key>
    ```

- `verifier-demo/client/.env`
Create an `.env` file here with the following variables:

    ```
    EXTERNAL_URL=<ngrok url for port 8080>
    ```

## Running the Demo

To run the demo, navigate (starting from the root project directory) to the `bfc-status-issuer-backend` and run the following command:

```sh
npm run dev
```

Then navigate back to the `issuer-demo` directory and run the following commands:

```sh
docker-compose up
npm run dev
```

Now navigate to `verifier-demo/server` and run the following command:

```sh
npm run dev
```

Finally, navigate to `verifier-demo/client` and run the following command:

```sh
npm run dev
```