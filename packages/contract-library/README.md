# contract-library

contract-library is a library for building applications that can interact with the Bond Protocol contracts from within JavaScript runtimes.

## Setup for Local Development

```sh
    yarn;
    yarn dev;

    ## Or at monorepo root
    yarn dev --filter=@bond-protocol/contract-library
```

#### Adding more abis

Add the abi json to `src/abis/sources` and name it in `src/abis/abi-map`
then run `make:abis`

```sh
    yarn && yarn dev
```

## License

This software is licensed under the Apache 2.0 license. Read more about it [here](./LICENSE).

© 2022 Bond Labs
