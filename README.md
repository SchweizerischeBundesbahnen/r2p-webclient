# RU - RU - Partner Communication (R<sup>2</sup>P) Webclient

[![CI](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/actions/workflows/build.yml/badge.svg)](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/actions/workflows/build.yml)
![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)

Webclient for the R2P Server that you find here: https://github.com/SchweizerischeBundesbahnen/r2p

# Reference implementation

## Disclaimer
**This is a PoC implementation not suitable to run in production.**

## Getting-Started

### Prerequisites

* Node ^22.22.3 || ^24.15.0 || >=26
* Running instance of an R2P server
* optional: Docker

### Installation

```bash
npm install
```

### Usage

#### Development server

```bash
npm start
```

The app is available at `http://localhost:4200`.

#### Run tests

```bash
npm test
```

#### Docker

**Build the image:**

```bash
docker build -t r2p-webclient .
```

**Run the container:**

```bash
docker run -p 8080:8080 r2p-webclient
```

The app is then available at `http://localhost:8080`.

## Documentation

Please consider the following information:

- [CODING_STANDARDS.md](CODING_STANDARDS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)


## License

This project is licensed under [Apache 2.0](LICENSE).

## Contributing

Open-source projects thrive on collaboration and contributions from the community. All
contributors are requested to read the [CONTRIBUTING.md](CONTRIBUTING.md) file as it outlines how to
contribute to the project, including how to submit bug reports, feature requests, and pull requests.

## Coding Standards

All contributors are requested to read the [CODING_STANDARDS.md](CODING_STANDARDS.md) file that
outlines the coding standards that you should follow when contributing to the project.

## Code of Conduct

To ensure that the project is a welcoming and an inclusive environment for all contributors, you, it
has established a good [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

