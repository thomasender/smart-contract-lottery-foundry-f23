# Smart Contract Lottery - Prooveably Random Raffle Contract

## About

This project is a simple smart contract lottery that uses a prooveably uses randomness to draw a winner. It is based on the [Chainlink VRF](https://dev.chain.link/products/vrf) and [Chainlink Automation](https://dev.chain.link/products/automation) to automate the draw.

### TODO / How it works:

- [X] Users can enter the lottery by buying a ticket
  - [X] 90% of the ticket fees sum up to the prize pool and are distributed to the winner
  - [X] 10% of the ticket fees are distributed to the owner of the raffle
  - [X] the owner is responsible for refunding the chainlink subscription and chainlink automation
  - [X] there is no way for the owner to withdraw the prize pool
- [X] After a certain amount of time, the lottery is closed and a winner is drawn
  - [X] This will be done utilising Chainlink's VRF for Randomness and Chainlink's Automation for executing the draw


## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
