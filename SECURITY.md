# Security Policy

## Scope

This security policy applies to the R<sup>2</sup>P specification and all official R<sup>2</sup>P repositories, including:

- `r2p-server` — the R<sup>2</sup>P backend service
- `r2p-webclient` — the R<sup>2</sup>P web client
- `r2p-spec` — the R<sup>2</sup>P protocol specification

The only supported version for security fixes is the **latest release** of each repository. We strongly recommend always running the most recent version.

## Reporting a Vulnerability

The R<sup>2</sup>P team takes security issues seriously. We appreciate responsible disclosure and will acknowledge your contribution.

**Do not report security vulnerabilities in public issues.**

To report a security issue, use one of the following channels:

1. **Preferred**: Use the GitHub Security Advisory feature in the relevant repository (Security → Advisories → Report a vulnerability).
2. **Alternative**: Send an encrypted email to <r2p@rail.ch> with the subject line `[SECURITY] <brief description>`.

Please include in your report:

- A description of the vulnerability and its potential impact.
- The affected repository, component, and version.
- Steps to reproduce or a proof of concept (if available).
- Any suggested mitigations you are aware of.

## Response Process

| Step | Timeline |
|------|----------|
| Acknowledgement of receipt | Within 2 business days |
| Initial assessment and severity classification | Within 5 business days |
| Progress update to reporter | Within 14 calendar days |
| Fix released or coordinated disclosure | As soon as possible; complex issues may take longer |

The R<sup>2</sup>P team will keep you informed throughout the process. We will coordinate with you on the timing of public disclosure and credit you in the security advisory unless you prefer to remain anonymous.

## Coordinated Disclosure

We follow the principle of coordinated disclosure (also known as responsible disclosure):

- We ask reporters to give us reasonable time to investigate and fix an issue before public disclosure.
- We aim to release a fix within 90 days of receiving a valid report.
- We will notify affected implementers listed in the adopter registry before public disclosure when the vulnerability could affect operational railway systems.

## Security in the R<sup>2</sup>P Specification

Because R<sup>2</sup>P is a protocol standard for inter-organisational communication in the railway sector, security properties are part of the specification itself. If you identify a vulnerability in the **protocol design** (e.g., authentication, authorisation, message integrity) rather than in an implementation, please use the same reporting channel. Protocol-level issues are handled as REPs (R<sup>2</sup>P Enhancement Proposals) with a security classification and are coordinated with all registered implementers before publication.

## Attribution

This security policy is adapted from the [OSRD Security Policy](https://github.com/OpenRailAssociation/osrd/blob/dev/SECURITY.md) published by the OpenRailAssociation.
