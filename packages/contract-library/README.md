# contract-library

contract-library is a library for building applications that can interact with the Bond Protocol contracts from within JavaScript runtimes.

## Getting

contract-library is available as a package on NPM

Add both:

- `@bond-protocol/contract-library`

To your JavaScript project's `package.json` as dependencies using your preferred package manager:

```sh
$ yarn add @bond-protocol/contract-library
```

### Setup for Local Development

```sh

    # NAVIGATE TO THIS PROJECT
    cd <THIS PROJECT>
    yarn install
    yarn build
    yarn link

    # BACK TO YOUR PROJECT DIR AGAIN
    cd <YOUR PROJECT>
    yarn link @bond-protocol/contract-library

    # DONE
    # You can start this project in dev mode with
    yarn dev
```

## License

This software is licensed under the Apache 2.0 license. Read more about it [here](./LICENSE).

© 2022 Bond Labs
