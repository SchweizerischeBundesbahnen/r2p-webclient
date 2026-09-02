# R2P Web Client

[![CI](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/actions/workflows/build.yml/badge.svg)](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/actions/workflows/build.yml)
![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)

Webclient for the R2P Server that you find here: https://github.com/SchweizerischeBundesbahnen/r2p

## Disclaimer

This is a PoC implementation not suitable to run in production.

## Overview

- Status: PoC
- Primary maintainers: R2P Projectteam
- Support channel: mailto:r2p@rail.ch
- License: Apache 2.0 for the Code, CC BY-ND 4.0 for the OpenAPI specification

## Getting Started

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for reporting bugs, proposing changes, and submitting pull requests.
