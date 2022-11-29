<!--
  ~ Copyright 2022 Crown Copyright
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

<a name="readme-top"></a>

<div align="center">

[![Build](https://github.com/AI4VBH/AIDE-api/actions/workflows/build.yml/badge.svg)](https://github.com/AI4VBH/AIDE-api/actions/workflows/build.yml)
[![Test](https://github.com/AI4VBH/AIDE-api/actions/workflows/test.yml/badge.svg)](https://github.com/AI4VBH/AIDE-api/actions/workflows/test.yml)
[![Security Scanning](https://github.com/AI4VBH/AIDE-api/actions/workflows/security.yml/badge.svg)](https://github.com/AI4VBH/AIDE-api/actions/workflows/security.yml)

</div>

<br />
<div align="center">
  <a href="https://github.com/AI4VBH/AIDE-api">
    <img src="aide-logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">AIDE API</h3>

  <p align="center">
    The AIDE API is responsible for acting as an intermediary between the <a href="https://github.com/AI4VBH/AIDE-front-end" target="_blank">AIDE Front-End</a> and downstream services including the <a href="https://monai.io/deploy.html" target="_blank">MONAI Deploy</a> components; <a href="https://github.com/Project-MONAI/monai-deploy-informatics-gateway" target="_blank">Informatics Gateway</a> and <a href="https://github.com/Project-MONAI/monai-deploy-workflow-manager" target="_blank">Workflow Manager</a>.
    <br />
    <br />
    <a href="https://github.com/AI4VBH/AIDE-api/issues">Report Bug</a>
    ·
    <a href="https://github.com/AI4VBH/AIDE-api/issues">Request Feature</a>
  </p>
</div>

<!-- INSTALLATION -->
## Getting started

Start by cloning or creating a fork of this repository. See GitHub's documentation for help with this: https://docs.github.com/en/get-started/quickstart/fork-a-repo

Secondly ensure that you download and install [Node & NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Once you have installed Node and NPM, you can verify that it is correctly installed and referenced in your PATH system variables by executing the following and receiving similar output:

```bash
$ node -v
v16.14.0
$ npm -v
8.3.1
```

Following installation of Node and NPM, you should be able to run the following command to install the referenced project dependencies from the `src` folder within the repository:

```bash
$ npm install
```

Following installation of the project dependencies, to begin working on the application, you can execute the following commands to start the API on your local machine.

```bash
# Run the application in development mode
$ npm run start

# Run the application in development mode, with file watch mode, where changes will cause the application to reload whilst running.
$ npm run start:dev

# Run the application in production mode
$ npm run start:prod
```

<div align="right">(<a href="#readme-top">back to top</a>)</div>

<!-- TEST -->
## Test

To verify that your changes haven't affected existing functionality, you can run the unit tests and end-to-end tests, which will be required to pass for any subsequent contribution to the code base:

```bash
# Run the unit tests
npm run test:unit
# Run the end-to-end tests
npm run test:e2e
```

<div align="right">(<a href="#readme-top">back to top</a>)</div>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<div align="right">(<a href="#readme-top">back to top</a>)</div>

<!-- LICENSE -->
## License

AIDE is Apache 2.0 licensed. Please review the [LICENCE](LICENCE) for details on how the code can be used.