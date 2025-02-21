# bfc-status-demo

This project is a showcase of the novel revocation mechanism for _W3C Verifiable Credential_ with **cascading padded bloom filters**, as proposed in the paper **[CRSet: Non-Interactive Verifiable Credential Revocation with Metadata Privacy for Issuers and Everyone Else](https://arxiv.org/abs/2501.17089)**.

The demo consists of two parts: the _issuer demo_ and the _verifier demo_. Specifically in our demo case, the issuer is a fictitious company called "CMW" and the verifier is a fictitious bank called "M26". The issuer issues an employee credential to the prospective holder, which the holder can in our scenario use to apply for a loan at the bank. The bank verifies the credential and checks the revocation status of the credential as part of the verification process.

As such, the issuer demo showcases the revocation mechanism, while the verifier demo showcases the verification of credentials, including the revocation status. To this avail, the issuer demo uses as separate service called **[bfc-status-issuer-backend](https://github.com/jfelixh/bfc-status-issuer-backend)**. The verifier demo utilizes a separate library to check the revocation status of credentials, namely **[bfc-status-check](https://github.com/jfelixh/bfc-status-check)**.

For more details on the underlying mechanism, please refer to the paper and the linked repositories, as well as the links in the [references section](#links-and-references).

## Technical Overview

### Components

![UML Component Diagram of the bfc-status-demo](docs/assets/component-diagram.png)

### Folder Structure

The project is structured as follows (only the most relevant files and folders are shown):

```bash
|-- bfc-status-demo/
    |-- issuer-demo/
    |   |-- Dockerfile
    |   |-- package.json
    |   |-- database/
    |   |-- src/
    |-- verifier-demo/
    |   |-- client/
    |   |   |-- Dockerfile
    |   |   |-- package.json
    |   |   |-- src/
    |   |-- server/
    |   |   |-- Dockerfile
    |   |   |-- package.json
    |   |   |-- src/
    |-- .env.example
    |-- compose.yaml
```

## Prerequisites

Several prerequisites are required in order to run the demo. These are outlined below.

### Altme Wallet

The bfc-status-demo requires the Altme Wallet to be installed in order to interact with the Ethereum blockchain. To install the Altme Wallet, follow the instructions on the [Altme Wallet website](https://altme.io/). Once installed, create a new wallet and save the private key.

### BFC Status Issuer Backend

As mentioned earlier, the bfc-status-demo requires the **[bfc-status-issuer-backend](https://github.com/jfelixh/bfc-status-issuer-backend)** to be running in order to manage credentials. To start the bfc-status-issuer-backend, follow the instructions in the [README](https://github.com/jfelixh/bfc-status-issuer-backend/blob/main/README.md) of the repository.

### Ngrok

Additionally, to make the demo pages publicly accessible to the wallet, [ngrok](https://ngrok.com) is required.
Since both issuer and verifier demo are running on different ports and need to communicate with the wallet, two ngrok tunnels are required.
With that in mind, the URL of both the issuer and verifier demo need to be specified in the `.env` file. To get these public URLs, run the following command:

```sh
docker compose --profile up --build
```

This will start two ngrok tunnels, one for the issuer demo and one for the verifier demo. The URLs can be found in by accessing the dashboard and will look like this:

```
http://<random-string>.ngrok-free.app
```

Head to the dashboards (ngrok [verifier dashboard](http://localhost:4040), [ngrok issuer dashboard](http://localhost:4041)) to find the URLs. Now copy the URLs to the `.env` file:

```
...
EXTERNAL_URL=<ngrok url for port 8080, from localhost:4040>
NEXT_PUBLIC_URL=<ngrok url for port 3000, from localhost:4041>
...
```

### Env Files

The bfc-status-demo requires several environment variables to be defined in order to run the demo. These are specified in the `.env` file. You can look at the `.env.example` file to see the required variables. The `.env.example` file can be found [here](./.env.example).

## Running the Demo

Once the prerequisites are met, the demo can be run. Since we assume only one ngrok tunnel to be available, the issuer and verifier applications can be started separately. To start the services required for the demo, run one of the following commands:

```sh
docker compose --profile issuer up --build
```

or

```sh
docker compose --profile verifier up --build
```

This will start the respective demo.
The issuer demo can be accessed at `http://localhost:3000` and the verifier demo can be accessed at `http://localhost:5173`.

## Links and References

- ![arXiv](https://img.shields.io/badge/arXiv-2501.17089-b31b1b.svg) **[CRSet: Non-Interactive Verifiable Credential Revocation with Metadata Privacy for Issuers and Everyone Else](https://arxiv.org/abs/2501.17089)**  
  _Hoops et al., 2025._
- ![GitHub](https://img.shields.io/badge/GitHub-crset--issuer--backend-blue?logo=github) **[crset-issuer-backend](https://github.com/jfelixh/crset-issuer-backend)**
- ![GitHub](https://img.shields.io/badge/GitHub-crset--check-blue?logo=github) **[crset-check](https://github.com/jfelixh/crset-check)**
- ![GitHub](https://img.shields.io/badge/GitHub-crset--cascade-blue?logo=github)
  **[crset-cascade](https://github.com/jfelixh/crset-cascade/)**

- **[EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844)**
- **[W3C Verifiable Credentials Data Model 1.1](https://www.w3.org/TR/vc-data-model/)**

