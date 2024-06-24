# Introduction

The Vickrey Auction Secure Bid App is a cutting-edge application designed to ensure the highest level of security and privacy for bidders participating in Vickrey auctions. Utilizing the advanced capabilities of the Nada program and the innovative technology of Nillion, the app guarantees that all bids remain confidential while accurately determining the highest bidder.

## Key features

### Secure Bidding:

Leveraging the Nada program, the app ensures that all bid submissions are securely encrypted and protected from unauthorized access. This maintains the confidentiality of each bidder's information throughout the auction process.

### Innovative Technology:

Powered by Nillion's groundbreaking technology, the app performs secure computations to accurately identify the highest bid without compromising the privacy of individual bidders.

### Transparent Results:

The app transparently calculates and reveals the winning bid in compliance with Vickrey auction principles, ensuring fair and trustworthy outcomes.

### User-Friendly Interface:

Designed with the user in mind, the app offers an intuitive and seamless bidding experience, making it accessible and easy to use for participants of all levels.

## Requirements

Before you begin, you need to install the following tools:

- `nilup`, an installer and version manager for the [Nillion SDK tools](https://docs.nillion.com/nillion-sdk-and-tools). Install nilup:

  _For the security-conscious, please download the `install.sh` script, so that you can inspect how
  it works, before piping it to `bash`._

  ```
  curl https://nilup.nilogy.xyz/install.sh | bash
  ```

  - Confirm `nilup` installation
    ```
    nilup -V
    ```

- [Nillion SDK tools](https://docs.nillion.com/nillion-sdk-and-tools) Use `nilup` to install these:
  ```bash
  nilup install latest
  nilup use latest
  nilup init
  ```
  - Confirm global Nillion tool installation
    ```
    nillion -V
    ```
- [Node (>= v18.17)](https://nodejs.org/en/download/)

  - Check version with
    ```
    node -v
    ```

- [python3](https://www.python.org/downloads/) version 3.11 or higher with a working [pip](https://pip.pypa.io/en/stable/getting-started/) installed

  - Confirm that you have python3 (version >=3.11) and pip installed:
    ```
    python3 --version
    python3 -m pip --version
    ```

- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
  - Check version with
    ```
    yarn -v
    ```
- [Git](https://git-scm.com/downloads)

To use this app, you need to have the MetaMask Flask browser extension installed and to store your Nillion user key in MetaMask Snaps

1. Install the [MetaMask Flask browser extension](https://docs.metamask.io/snaps/get-started/install-flask/) that will let you work with experimental snaps.
2. Create a new test wallet in MetaMask Flask
3. Temporarily disable any other wallet browser extensions (Classic MetaMask, Rainbow Wallet, etc.) while using MetaMask Flask
4. [Visit the Nillion Key Management UI](https://nillion-snap-site.vercel.app/) to generate a user key and store it in MetaMask Snaps - this saves your user key within MetaMask so it can be used by other Nillion web apps
5. This quickstart will ask you to "Connect to Snap" to use your Nillion user key

## Quickstart

To get started, follow the steps below:

### 1. Clone this repo & install dependencies

```
git clone https://github.com/daningyn/tinybid-nillion-blind-app.git
cd tinybid-nillion-blind-app
yarn install
```

### 2. Run the Nillion devnet in the first terminal:

This bootstraps Nillion devnet, a local network of nodes and adds cluster info to your NextJS app .env file and blockchain info to your Hardhat .env file

```
yarn nillion-devnet
```

### 3. Run a local ethereum network in the second terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

### 4. Open a third terminal and deploy the test ethereum contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

### 6. Open one more terminal to start your NextJS web app:

```
cd packages/nextjs
```

Install nextjs app
```
pnpm install
```

Run app
```
pnpm dev
```

Visit your app on: `http://localhost:3000`.

