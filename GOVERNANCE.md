# R<sup>2</sup>P Community Governance

This document describes the governance model of the R<sup>2</sup>P project: how decisions are made, who holds which roles, how the community is organised, and what processes guide the development of the R<sup>2</sup>P standard and its reference implementations.

R<sup>2</sup>P is an open standard for railway undertaking–partner (RU–Partner) communication. It is developed collaboratively by railway operators, technology partners, and independent contributors under open-source and open-standard principles.

---

## 1. Roles

### 1.1 Technical Steering Committee (TSC)

The TSC is the governing body of the R<sup>2</sup>P project. It holds strategic and technical decision authority.

**Composition**

- Minimum 3, maximum 9 voting members.
- Each participating railway undertaking or infrastructure manager that is an Active Member may appoint one TSC representative.
- Technology partners and independent contributors may be elected to the TSC by the existing TSC (maximum 2 seats) to ensure a diversity of perspectives.
- TSC members serve two-year renewable terms.
- The TSC elects a **Chair** and a **Vice-Chair** from among its members for one-year terms.

**Responsibilities**

- Define and maintain the R<sup>2</sup>P roadmap and versioning policy.
- Approve new major versions of the R<sup>2</sup>P specification.
- Elect and remove Specification Maintainers and Core Maintainers.
- Resolve escalated technical disputes.
- Approve new Active Member organisations.
- Ensure the project complies with its open-standard and open-source commitments.

**Decision making**

Decisions are made by lazy consensus: a proposal is approved if no TSC member objects within seven calendar days. If a member objects, the TSC discusses and holds a formal vote. A simple majority of present members is required; the Chair casts a deciding vote in the event of a tie. Quorum is two-thirds of voting members.

---

### 1.2 Specification Maintainer

Specification Maintainers own the R<sup>2</sup>P protocol specification (`r2p-spec`).

**Responsibilities**

- Review and merge R<sup>2</sup>P Enhancement Proposals (REPs).
- Maintain consistency and technical correctness of the specification across all supported languages (DE, FR, EN).
- Coordinate with Core Maintainers to ensure implementations remain aligned with the specification.
- Produce and sign off on specification releases.
- Maintain the R<sup>2</sup>P service directory schema and rule-set templates.

**Appointment**

Nominated by any TSC member and approved by TSC majority vote. Minimum one, recommended two to four Specification Maintainers are active at any time.

---

### 1.3 Core Maintainer

Core Maintainers are trusted contributors with merge rights on one or more R<sup>2</sup>P repositories (`r2p-server`, `R<sup>2</sup>P-webclient`, tooling repositories).

**Responsibilities**

- Review and merge pull requests in their repository.
- Triage issues and assign labels.
- Enforce coding standards and the contribution process.
- Participate in release preparation and test coordination.
- Mentor contributors.

**Appointment**

Any Core Maintainer or Specification Maintainer may nominate a contributor. Appointment requires approval from at least two existing Core Maintainers and is ratified by the TSC. A Core Maintainer who is inactive for six months may be moved to Emeritus status by TSC decision.

---

### 1.4 Contributor

A Contributor is anyone who submits an issue, pull request, documentation improvement, or specification feedback to any R<sup>2</sup>P repository. No formal appointment is required.

**Responsibilities**

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guide](CONTRIBUTING.md).
- Sign off commits with the Developer Certificate of Origin (DCO) (`git commit -s`).
- Respond to review feedback in a timely manner.
- Disclose any conflicts of interest related to proposed changes.

---

### 1.5 Implementer

The Implementer role is a voluntary designation for organisations that wish to engage with the R<sup>2</sup>P community and benefit from the implementer forum and advisory seat.
Organisations that adopt the Implementer role are encouraged to:
•	Register their implementation in the R<sup>2</sup>P adopter registry to improve ecosystem visibility.
•	Participate in the R<sup>2</sup>P certification or conformance testing programme when available.
•	Report interoperability issues through the standard issue tracker.
•	Provide feedback on the specification from operational experience.

**Benefit**

Registered implementers are listed on the R<sup>2</sup>P project page and may participate in the implementer forum, which has a non-voting advisory seat in TSC discussions.

---

### 1.6 Community Member

Anyone who uses, follows, or participates in R<sup>2</sup>P community spaces (issue discussions, mailing lists, community calls) is a Community Member.

**Responsibilities**

- Follow the Code of Conduct in all community spaces.
- Use designated channels for questions and feedback (see below).

---

### 1.7 Active Member Organisation

An Active Member is an organisation that has formally committed to participating in R<sup>2</sup>P governance (typically a railway undertaking, infrastructure manager, or recognised industry body).

**Requirements**

- Submit a written declaration of intent to the TSC.
- Assign at least one individual as the organisation's primary contact and TSC representative (if applicable).
- Contribute actively (code, specification, testing, or operational feedback) at least once per twelve months.

---

## 2. Processes

### 2.1 R<sup>2</sup>P Enhancement Proposal (REP)

Changes to the R<sup>2</sup>P specification follow the REP process.

| Step | Action | Owner |
|------|--------|-------|
| 1. **Idea** | Open a discussion issue tagged `REP-draft` | Anyone |
| 2. **Draft REP** | Submit a REP document (template in `/spec/REP-template.md`) as a pull request to the spec repository | Author |
| 3. **Community review** | Minimum 14-day comment period; all stakeholders may comment | Community |
| 4. **Specification Maintainer review** | Maintainers assess technical soundness and consistency | Spec Maintainers |
| 5. **TSC decision** | For major or breaking changes, TSC approves or rejects; minor changes are delegated to Spec Maintainers | TSC / Spec Maintainers |
| 6. **Implementation** | Reference implementations updated and test cases added | Contributors |
| 7. **Release** | Included in next appropriate release | Core Maintainers |

REP types:
- **Minor (patch)**: Clarification, editorial correction — Spec Maintainer approval sufficient.
- **Standard (minor version)**: Backward-compatible extension — Spec Maintainer approval + one TSC member sign-off.
- **Breaking (major version)**: Non-backward-compatible change — full TSC vote required.

---

### 2.2 Code Contribution Process

1. **Check for an existing issue.** If none exists, open one describing the problem or feature.
2. **Discuss** for significant changes before writing code. Use the issue or the `r2p@rail.ch` contact for large architectural changes.
3. **Fork and branch.** Use a descriptive branch name (`fix/issue-123`, `feat/taf-adapter`).
4. **Implement.** Follow the coding standards in [CODING_STANDARDS.md](CODING_STANDARDS.md). Sign off every commit with `-s`.
5. **Open a pull request** against the default branch of the target repository.
6. **Review.** At least one Core Maintainer must approve. For changes touching the specification interface, a Specification Maintainer must also review.
7. **Merge.** The approving Core Maintainer merges the PR. Squash-merge is preferred for feature branches; merge commits are used for release branches.

---

### 2.3 Release Process

R<sup>2</sup>P uses semantic versioning: `MAJOR.MINOR.PATCH` aligned across the specification and reference implementations.

| Phase | Duration | Activity |
|-------|----------|----------|
| Feature freeze | 2 weeks before release | No new features merged; only bugfixes |
| Release candidate | 1 week | RC tag published; implementers invited to test |
| Compatibility check | During RC | At least two independent implementations must confirm interoperability |
| Release | Day 0 | Tag, changelog, announcement on community channels |
| LTS designation | By TSC decision | Long-term support versions receive patch fixes for 24 months |

Specification releases and implementation releases are versioned independently but must cross-reference each other (e.g., `r2p-server v1.2.0` implements `R2P spec v1.2`).

---

### 2.4 Issue Management

- **Bug reports**: use the `bug` label; include reproduction steps, R<sup>2</sup>P spec version, and implementation version.
- **Feature requests**: use the `enhancement` label; describe the operational use case, not just the technical solution.
- **Specification questions**: use the `spec-question` label; these may become REPs if they reveal ambiguities.
- **Security issues**: do **not** open public issues; follow the [Security Policy](SECURITY.md).

Stale issues (no activity for 90 days) are labelled `stale` and closed after a further 14-day warning period unless updated.

---

### 2.5 Community Meetings

| Forum | Frequency | Participants | Purpose |
|-------|-----------|--------------|---------|
| TSC Meeting | Monthly | TSC members | Decisions, roadmap, governance |
| Community Call | Quarterly | All community members | Progress updates, open Q&A |
| Implementer Forum | Biannual | Implementers, Spec Maintainers | Interoperability, operational feedback |
| Annual R<sup>2</sup>P Day | Yearly | All community + invited stakeholders | Year review, roadmap, workshops |

Meetings are held in English. TSC meeting minutes are published in the repository within seven days.

---

### 2.6 Onboarding

**New contributor**

1. Read [CONTRIBUTION.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
2. Set up DCO signing (`git config user.email` and `git commit -s`).
3. Pick a `good-first-issue` labelled issue or propose your contribution in a discussion.
4. Contact `r2p@rail.ch` if you need guidance.

**New organisation (Active Member)**

1. Send a declaration of intent to `r2p@rail.ch`.
2. The TSC reviews and votes (lazy consensus, 14-day window).
3. Designate a TSC representative (if eligible) and a technical contact.
4. Sign the Contributor Licence Agreement (CLA) or verify individual contributors sign the DCO.

---

### 2.7 Conflict Resolution

1. **Informal resolution**: parties discuss directly, ideally in the relevant issue or PR.
2. **Maintainer mediation**: a Core Maintainer or Spec Maintainer facilitates if direct discussion stalls.
3. **TSC escalation**: either party may request TSC mediation by emailing `r2p@rail.ch`. The TSC Chair appoints a mediator from the TSC.
4. **TSC decision**: if mediation fails, the TSC votes on the matter. The TSC Chair's decision is final.

---

## 3. Rules and Responsibilities

### 3.1 Openness and Transparency

- All technical decisions are made in public repositories or published meeting minutes.
- The reference implementations are published under an OSI-approved open-source licences (see `LICENSE`).
- Commercial use is permitted. Implementations based on R<sup>2</sup>P may be proprietary. They are encouraged to comply with the specification to ensure interoperability; compliance with the licence terms (Apache License 2.0 / CC BY 4.0) is required. Only implementations that comply with the specification may use the R<sup>2</sup>P-compatible designation.

### 3.2 Intellectual Property

- All contributions require a sign-off under the [Developer Certificate of Origin (DCO)](https://developercertificate.org/).
- The DCO sign-off confirms the contributor has the right to submit the work and agrees to licence it under the project licence.
- Organisations that wish to contribute under a Contributor Licence Agreement (CLA) instead of the DCO must contact the TSC.
- No patent encumbrance: contributors who submit code or specification text certify they are not aware of relevant patents that would prevent implementation.

### 3.3 Licensing

R<sup>2</sup>P specification documents are published under [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).  
R<sup>2</sup>P reference implementation source code is published under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

### 3.4 Language and Multilingualism

- The specification is maintained in German (DE), French (FR), and English (EN). English is the reference language for the open-source community.
- Code, comments, issue titles, and pull request descriptions must be in English.
- Community members may open issues or discussions in DE, FR, or EN; maintainers will respond in the same language where possible.

### 3.5 Conduct

All participants must follow the [Code of Conduct](CODE_OF_CONDUCT.md). The TSC is the enforcement body for conduct violations not resolved at maintainer level.

### 3.6 Responsibilities by Role

| Responsibility | TSC | Spec Maintainer | Core Maintainer | Contributor | Implementer |
|----------------|-----|-----------------|-----------------|-------------|-------------|
| Approve spec major versions | ✓ | — | — | — | advisory |
| Approve spec minor/patch | delegates | ✓ | — | — | — |
| Merge pull requests | — | (spec repo) | ✓ | — | — |
| Triage issues | — | (spec) | ✓ | encouraged | encouraged |
| Report interop issues | — | — | — | — | ✓ |
| Sign commits (DCO) | ✓ | ✓ | ✓ | ✓ | — |
| Attend monthly TSC | ✓ | invited | invited | — | — |
| Attend community calls | ✓ | ✓ | ✓ | encouraged | encouraged |
| Follow Code of Conduct | ✓ | ✓ | ✓ | ✓ | ✓ |

### 3.7 Amendments to This Document

Changes to this governance document follow the same REP process as specification changes and require TSC approval by majority vote.

---

## Contact

- General enquiries and coordination: <r2p@rail.ch>
- Security issues: see [SECURITY.md](SECURITY.md)