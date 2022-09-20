# Testing

## Pre-requisites

- Install [Node & NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Usage

Unit tests

```bash
npm run test:unit
```

Integration/e2e tests

```bash
npm run test:int
```

## Details

### Location of test files

- Unit test files are labelled *.spec.ts and are located with the development files.
- Integration/e2e test files are labelled *.e2e-spec.ts and are located in the /test folder in a directory labelled after the controller they are testing.

### Results

Results will be shown as text in the terminal in which the tests are run. In the pipeline they will be shown in the step in which the test command was executed.

### Snapshots

Most of the Integration/e2e tests are using Jest snapshots. These will be located in the /test/snapshots folder. It is very important that these are checked regularly as an incorrectly commited snapshot means a test that is checking for the wrong thing. For further info on how to use these please see [the docs](https://jestjs.io/docs/snapshot-testing).

### Mocking

For the Integration/e2e tests we have mocked the [Monai](https://github.com/Project-MONAI) server responses. These can be found in /test/test_data/mocks. It is important to make sure these are accurate to how Monai responds as if these drift our testing will not work correctly.

## Contributing

Tests should be written alongside the development code and pushed in the same pull request. We must ensure any new/altered tests have the correct snapshot as this is easy to miss. It is also important for the individual doing the code review to look at the snapshots and ensure they agree with the output.

Please ensure you follow all the conventions above for name/location/layout of test code. If in doubt try to copy the format of previous tests.
