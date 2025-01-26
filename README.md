# bfc-status-demo
A monorepo containing everything required to demo the BFC-Status for VCs.

## Prerequisites / Services Used

### Altme Wallet
The bfc-status-demo requires the Altme Wallet to be installed in order to interact with the Ethereum blockchain. To install the Altme Wallet, follow the instructions on the [Altme Wallet website](https://altme.io/). Once installed, create a new wallet and save the private key.

### Ngrok
To make the demo pages publicly accessible to the wallet, [ngrok](https://ngrok.com) is used. 
Since both issuer and verifier demo are running on different ports and need to communicate with the wallet, two ngrok tunnels are required. 
With that in mind, the URL of both the issuer and verifier demo need to be specified in the `.env` file. To get these public URLs, run the following command:

```sh
docker compose up ngrok-issuer ngrok-verifier --build
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

### Redis
The demo requires Redis a Redis server for caching. Two Redis servers are required, one for the issuer demo and one for the verifier demo. These are setup with `docker compose` in this [file](./compose.yaml). You can start the Redis servers along with the rest of the demo by running the command specified in the forthcoming section.

### Env Files
The bfc-status-demo requires several environment variables to be defined in order to run the demo. These are specified in the `.env` file. You can look at the `.env.example` file to see the required variables. The `.env.example` file can be found [here](./.env.example).

## Running the Demo
Once the prerequisites are met, the demo can be run. To start the rest of the services required for the demo, run the following command:

```sh
docker compose up --build
```

The issuer demo can be accessed at `http://localhost:3000` and the verifier demo can be accessed at `http://localhost:5173`.