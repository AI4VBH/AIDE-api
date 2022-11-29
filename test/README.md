<!--
  ~ Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
-->

# Testing

## Pre-requisites

- Install [Node & NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

## Usage

Unit tests

```bash
npm run test:unit
```

E2E tests

```bash
npm run test:e2e
```

## Details

### Location of test files

- Unit test files are labelled *.spec.ts and are located with the development files.
- Integration/e2e test files are labelled *.e2e-spec.ts and are located in the /test folder in a directory labelled after the controller they are testing.

### Results

- Results will be shown as text in the terminal in which the tests are run. In the pipeline they will be shown in the step in which the test command was executed.
- A HTML report will be created at the root of the project and exported as an artifact in Github actions after running named:
  - e2e-test-report.html
  - unit-test-report.html  

### Snapshots

Most of the Integration/e2e tests are using Jest snapshots. These will be located in the /test/snapshots folder. It is very important that these are checked regularly as an incorrectly commited snapshot means a test that is checking for the wrong thing. For further info on how to use these please see [the docs](https://jestjs.io/docs/snapshot-testing).
> Please note where we are repetitively returning a set body e.g. general 500 tests or where we are returning simple objects e.g. "{}" we do not use snapshots as what you gain from ease of use does not outweigh the danger that these could be added incorrectly. In this case we do a literal assertion for the object.

### Mocking

For the Integration/e2e tests we have mocked the external API's ([MONAI Workflow Manager](https://github.com/Project-MONAI/monai-deploy-workflow-manager), [MONAI Informatics Gateway](https://github.com/Project-MONAI/monai-deploy-informatics-gateway), [MINIO](https://min.io/), [OpenSearch](https://opensearch.org/)) server responses. These can be found in /test/test_data/mocks. It is important to make sure these are accurate to how these services respond as if these drift our testing will not work correctly.

## Contributing

Tests should be written alongside the development code and pushed in the same pull request. We must ensure any new/altered tests have the correct snapshot as this is easy to miss. It is also important for the individual doing the code review to look at the snapshots and ensure they agree with the output.

Please ensure you follow all the conventions above for name/location/layout of test code. If in doubt try to copy the format of previous tests.
