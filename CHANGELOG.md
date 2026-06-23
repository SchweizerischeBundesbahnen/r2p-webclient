# Changelog

## [0.0.17](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.16...r2p-webclient-v0.0.17) (2026-06-23)


### Features

* add eight new partner organisations (TI, DBF, DBC, DBCNL, SBBC, SBBCI, RCA, MEV) ([f989477](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f989477d8340fb32b491e229d1fadca712036981))
* align data model with train.yaml 1.0.10 and require min two stops ([1c27394](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/1c273943274595e0dd928bb3a8d8f9ba70dc0fce))
* align data model with train.yaml 1.0.10 and require min two stops ([0535bc6](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/0535bc6f169b13726b0530938ef7c72d1746470e))
* hide New Train button for non-instance-owner organisations ([1a62ed6](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/1a62ed6f01650e9de3d983f13434e131b0462602))


### Bug Fixes

* add German translations for edit activity modal titles ([67bdebe](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/67bdebeb2a0cf562230b876f57cb82c4c0c02172))
* add German translations for edit activity modal titles ([7e1ecb6](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7e1ecb6a547d9e834ad452389bba53ae66482360))
* add missing .form-field-full CSS rule for staff role select ([fe30074](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fe3007436776162ab4edda62ba84f9126fbbc2b2))
* default responsibility partner id from first available partner ([5838a1b](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/5838a1b34cc9a2ba0fea2e2facb4b663e36d5146))
* display app version dynamically from package.json in header ([d1470ea](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d1470eaaef2cdbf17512d1e699ec6ad4b4502703))
* filter activity partner dropdown to train-shared organisations ([3d425fe](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/3d425feab9e78af24cac1d9dc6e055d5a430aa77))
* guard DatePipe concatenation against null rendering ([473b52f](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/473b52fea4ed9dd5b662b3fcdee65ce0184aa9ca))
* harden background re-auth failure handling ([cea60e5](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/cea60e58bcdad66ca4816db0ba7b548e21c537d9))
* preserve rolling stock unit fields on save ([785297b](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/785297ba0b0de6182bc5eb957ffe59bd187f5c02))
* scope page-states to component to avoid stale rxResource on reuse ([2ed6682](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/2ed66824018b76157e13a884b0409bfa386b6403))
* scope page-states to component to avoid stale rxResource on reuse ([62a08e8](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/62a08e8c69313a7f1e3a96751028021b6d4e15bd))
* silent re-authentication on idle session expiry ([a556f33](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a556f3317bfa6a982e20f20190fdb13d90d6c618))
* silent re-authentication on idle session expiry ([47cc14a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/47cc14ad31e62de9a8e88050c827cd7eb006beeb))
* unify date & time formatting across the app (locale-aware De/En) ([592e887](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/592e8872b60ba3ed52ba13e77c8a19bbd9d93c75))
* unify date & time formatting across the app (locale-aware De/En) ([f71f305](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f71f305808cb389074b4b1775456cb7245d8f193))
* update tests for expanded ORGANIZATION_OPTIONS and fix empty-function lint ([8c8340d](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/8c8340dd795bbcfeaeeb96661a360af8cd8fe3a0))
* use trainNumber as id for all train API calls; remove randomUUID from createBranch ([ec77546](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/ec77546072f4b58ca7b9b18a6c89a949f12ae0c5))


### Miscellaneous Chores

* adjust name according to google search ([74cb593](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/74cb593471cf8b463d4650c71b9ab129a8ec9807))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.8 to 4.1.9 ([4cf3bbf](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/4cf3bbff99a6bffdbd926554d40c63371f447442))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.8 to 4.1.9 ([b6a3561](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/b6a35618eb94af3212bebfcd022db26899aef9b3))
* **deps-dev:** bump eslint from 10.4.1 to 10.5.0 ([a37a8a2](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a37a8a2e9be941c465e3ea90a70558032b9f709d))
* **deps-dev:** bump eslint from 10.4.1 to 10.5.0 ([8776785](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/87767850bdee3d98b0894c0e461917e0c656a956))
* **deps-dev:** bump typescript-eslint from 8.61.0 to 8.61.1 ([215935d](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/215935dd33b51cc19729c19f33c9026c46a9b8fb))
* **deps-dev:** bump typescript-eslint from 8.61.0 to 8.61.1 ([9020b7a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/9020b7a1566bdc8cee63a581a1419f286b9752ed))
* **deps-dev:** bump vitest from 4.1.8 to 4.1.9 ([6fddc74](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/6fddc74744454e36596fa00a428da556df83f355))
* **deps-dev:** bump vitest from 4.1.8 to 4.1.9 ([7752f93](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7752f93b4d8ccaec3fa2647c590ce9c246206185))
* drop unused en-US locale file and fix sync label ([bcafee1](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/bcafee144eef10ecbc8c844b32c57b304a1e8900))


### Code Refactoring

* remove duplicate .form-field-full from edit-activity-modal ([5824a93](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/5824a93a2933e39240bf0d64f6312f1e0f35f42d))
* simplify partners computed — remove redundant ownOrg prepend ([70dd4c9](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/70dd4c90c3d1e3a21363a7203560723fe5b8c190))


### Tests

* assert full timestamp string for date and time together ([7e07ac6](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7e07ac64e3dc4bb80cf8c0bfd3245d99de08b3e9))

## [0.0.16](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.15...r2p-webclient-v0.0.16) (2026-06-11)


### Features

* add Delete Train button for Lead RU with confirmation modal ([f2dcb26](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f2dcb262080bd2bbc41dd734b29dd9c19af0dd0e))
* hide Share Train button when all partners already shared ([fdc5625](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fdc5625fd94bd20fbd7507ce723e9abe02a1408e))
* implement JourneyRoute with MatDialog modals and clean component split ([1e2b6f2](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/1e2b6f250956e97538770254c60b0a54a54d542d))
* implement overall status indicator for traffic overview and view ([753f98b](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/753f98bb52920099994904cb46abb1b4e9667d6b))
* improve traffic overview table UX — compact rows and partner badges ([19d131e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/19d131e30208ef5e381ce2ca8e9c89a51f7afd41))
* JourneyRoutes Editor and code restructuring ([c9bc839](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/c9bc839cc35715139593e0224a08608ccb3f7cc6))
* unified icon-button pattern across route editor and variants list ([8526272](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/8526272457601ceccbcdebf6704385a177828bac))


### Bug Fixes

* add missing i18n keys and fix rejectMergeModal placeholder mismatch ([92fc966](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/92fc966deff9582939c129b70c537b54031362da))
* apply code review fixes from Copilot review ([7de1de1](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7de1de1d96f487b8489987fa739900fce5895c60))
* edit stop modal title, required fields, remove checkmark ([c7fee19](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/c7fee195a360fd0d9b4f6255b88a3b68b4e26d4f))
* guard against NaN/uppercase status in activity builder and badge ([97ed80e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/97ed80ef3a35fc900f39bedc598c79c2284d1d39))
* initialise journey with featuresets[] to satisfy API contract ([3bd6bb5](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/3bd6bb5796832fbf0d35c63dee428b4cb0c8a878))
* load Roboto font, staff-role dropdown with i18n, feature type translations ([c1142b7](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/c1142b722338e0e3fc571dc60c31bf6b0eb33c36))
* neue Variante erstellen kopiert aktuellen Stand des Hauptasts ([38b4e27](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/38b4e2737d54caf3290690ac49fead74a69ddeac))
* new train starts with empty journey route ([dd8c862](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/dd8c862d7dcabd7543e7b22557d2f6e650709c2d))
* reload traffic view when state is reused after navigation ([37ebb8c](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/37ebb8c9a1129084fe102a7b515d38c2eacb47de))
* remove misleading variant name hint and rename stale i18n key ([8d44159](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/8d44159ef42b681aabe82a78c9db02419097a354))
* remove non-functional edit variant button from read view ([9db4823](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/9db482350babb3fb937d88dbf272dbadb1cc6613))
* replace no-explicit-any casts with typed unknown assertions in specs ([9b8e628](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/9b8e6280aac4bb5dc8e0b9e294be29bc9748a18c))
* resolve component style budget error and fix Angular view encapsulation ([b0536a4](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/b0536a40582b1715f61b08fbba5911d6d54c7284))
* send required fields when creating activities to satisfy backend validation ([fed63ca](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fed63ca79ae299a4004e422a7092fe94d555e099))
* show inline spinner on New Variant button during reload ([29e7865](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/29e78654276420a64828d4114387d3561a376cd2))
* show org prefix inline in new-variant modal, remove branch icon ([1e8f423](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/1e8f423579bb909aa4413afa4795967bdd3223a5))
* truncate long variant names with ellipsis and tooltip in traffic view ([d5f8df1](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d5f8df1b5390c86bd93cedfeee3ebbb29839e034))
* update specs after icon-button and label refactor ([07fb4bf](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/07fb4bf0c73c452e7858d06ca87bcc2e91411f3f))
* use format-neutral placeholder in new variant modal ([38aa169](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/38aa16933aa608a9bea957bfc4790aaf3e161c9d))
* use Train.id as train number — remove UUID generation ([e1421e3](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/e1421e3968a38af70efd561ad8dab0a9a07ffa73))


### Miscellaneous Chores

* add de-CH translations for JourneyRoute modals and activity items ([9f57aba](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/9f57abad96beaef19fb5a7987de2ef21fd9a8c6d))
* add dependency-cruiser and architecture docs ([8fc9635](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/8fc9635d31898f31febd3d93c525de342f744008))
* **deps-dev:** bump prettier from 3.8.3 to 3.8.4 ([#68](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/68)) ([053f1e5](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/053f1e55433607d85516d165c6e3e32e45f7111d))
* remove r2p spec ([7cd275b](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7cd275bab0eda12bf3b2ab32a7282f02a53f7595))


### Code Refactoring

* consolidate duplicate i18n keys into common.* namespace ([b6f0b36](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/b6f0b36049d4339d5716da44e1bf073c8b63c568))
* decompose traffic-overview-page into TrainFilterBar and TrainTable ([f350e12](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f350e1242ebaf92fc28abcf2ff4f9c6b231a1d41))
* extract large inline templates into separate HTML files ([dc457ac](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/dc457ac0bb82f2f9b2b494bc7cc108d22ef230ca))
* extract StickyEditBar, DetailGrid, AlertBanner and PartnerBadge shared components ([629663b](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/629663b4f012ef496ffad2cbffdb4f797302ecf6))
* extract TrainDetailsFormCard and wire journey editing in create-train ([ac534b8](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/ac534b84c8dbb1ccd03db37d01d79287c3dfa103))
* extract utils, fix stale spec class names, clarify test runner ([a5fe334](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a5fe334e0ff05cdb6ec54032b7e4dac7958f8a86))
* introduce core/ layer and consolidate singleton infrastructure ([7c5a290](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7c5a290d18e0b00544dd1e02e8108f8dc457730b))
* migrate to Angular Material buttons, forms and dialogs ([f7e6038](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f7e6038ed86c299f7d0b75b2314b39303b6951cf))
* move component styles into components, slim styles.scss ([fdcd7d4](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fdcd7d4c6ece2f1db5f24bfc0736f4f98ec58cf1))
* reduce font sizes and add left padding in traffic overview table row ([7bb96c9](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7bb96c9ad137a8899e5e1d39ef484fa199c9c24c))
* replace remaining partner-badge spans in journey-route-card ([a6ff909](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a6ff909c8adf4fb58e8b1d5d881d04195ae87120))
* standardize modal button validation to Pattern B ([96f96b1](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/96f96b13b8add76dffec7d568637e4ef46692f2e))
* styling quick wins — drop BEM prefixes, extract inline styles, isolate plan-status colors ([50b0805](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/50b0805d309165afd3f779a4ce2809e5184ca0de))
* type Responsibility with ResponsibilityType and PlanStatus, fix stale rp type, add tru/pru ([174bf38](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/174bf38f05ef794b9748dc3e3391ab62f1052255))
* ui polish — status i18n, inline styles to css, material filter bar ([16d4f7a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/16d4f7a9769e6d275d34aa7bba995e760aa18593))


### Tests

* add spec for NewVariantModal covering validation, submit, and error paths ([cca516d](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/cca516da3a4339b15d772d4f17373d446473908d))
* add specs for CreateTrainPage and CreatePageState ([f604036](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f604036462ceb524c396098ee9034bbb4204cdf9))
* extend CreateTrainPage specs with per-field validation and createTrain() paths ([2b0507a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/2b0507a868dbb4d6696cf7f5598a7fd1caaac5cb))
* increase coverage to ~82% and add CI coverage reporting ([bf8d1ef](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/bf8d1ef233087268590d5d4a1eabf9454bec9963))


### Continuous Integration

* fix coverage reporting and upload coverage artifact ([96ee9fc](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/96ee9fcc2f6da1b1c6d06d8b9868ef0565ec4201))
* run tests with --coverage and write summary to GitHub Step Summary ([bf8d1ef](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/bf8d1ef233087268590d5d4a1eabf9454bec9963))

## [0.0.15](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.14...r2p-webclient-v0.0.15) (2026-06-09)


### Features

* display journey route (read only) in component (BPSGLO-14066) ([#65](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/65)) ([44e0150](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/44e015069cac78c14874f7dcc4dca06ad0398720))


### Miscellaneous Chores

* **deps-dev:** bump @commitlint/cli from 21.0.1 to 21.0.2 ([#60](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/60)) ([6503c6a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/6503c6acde56c747c505bab334f5f75d6eaec007))
* **deps-dev:** bump @commitlint/config-conventional ([bfc16a5](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/bfc16a54d8457b593fe89e32616d5a970a7c3f9d))
* **deps-dev:** bump @commitlint/config-conventional from 21.0.1 to 21.0.2 ([3423f0b](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/3423f0b8b556fd36dd7b9b27b917742851e4877c))
* **deps-dev:** bump eslint from 10.4.0 to 10.4.1 ([f317127](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f3171277eeac16ab87cb882f9cd7d1f6dd8ce8d6))
* **deps-dev:** bump eslint from 10.4.0 to 10.4.1 ([ea69967](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/ea699671923de447cad02244c8c42084525065f9))
* **deps-dev:** bump typescript-eslint from 8.60.0 to 8.61.0 ([d4dced0](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d4dced08e5453f0af45816d9f7e47adb689fc7e7))
* **deps-dev:** bump vitest from 4.1.7 to 4.1.8 ([d57a309](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d57a30924f7d968d34fa3fe289688e1efa33c78b))
* **deps-dev:** bump vitest from 4.1.7 to 4.1.8 ([197305d](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/197305dc4fb531cb1c8d53841d13e8bd99fee282))

## [0.0.14](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.13...r2p-webclient-v0.0.14) (2026-06-01)


### Features

* replace loading fallbacks with Angular Material spinners ([2098709](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/20987092504234790d4a1e890d54bd779bca3893))
* **traffic:** add variant propose/accept/reject functionality ([085fcec](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/085fceca75141f3a779af3b7185846df95e82253))
* **traffic:** add variant propose/accept/reject functionality ([085fcec](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/085fceca75141f3a779af3b7185846df95e82253))


### Bug Fixes

* **guard:** prevent white screen when SPA dev-server returns 200 for OIDC discovery ([d6236f2](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d6236f2c9d63f51a1172ab093d73b36db8e05128))
* **settings:** reject Azure AD v1 authority and normalize serverUrl ([aa3e4fc](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/aa3e4fc9d342dbe62f126e5879f852341fe91f3e))


### Miscellaneous Chores

* rename loading-spinner directory ([a2ff7bd](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a2ff7bdb2c236310db4bf92e7bf0fd199554c867))


### Code Refactoring

* address PR [#56](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/56) review – generalise spinner component ([7099b27](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7099b273609a092b29e2515d67be519e4ebf320d))
* migrate Angular Material Modules to standalone components ([c85f6bc](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/c85f6bc1b8c8ad59223c08f8a9ab5b949eaf1bc1))
* **settings:** remove configurable response_mode, fix to query ([a006883](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a0068838a93148e2e58a4b5cb96144e76de2cc5e))

## [0.0.13](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.12...r2p-webclient-v0.0.13) (2026-05-29)


### Features

* banner don't use for production ([4a79d10](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/4a79d10b608b502f76e2fa74f8cb85624ba90497))
* bpsglo-14510 support locale for date/time ([97a3796](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/97a3796b436a2ac8cab3ca4238fbf04b09695b92))
* enable language switching ([a18da16](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a18da16fae9cb48d12ee861f4144dfb173222c47))
* enable settings dialog and material theme ([bf192c7](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/bf192c7391c7cb605bb4f0aafed0638ed78c7026))
* i18n and german translation ([f771549](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f771549d055501b0be3d39c3e700b80670f35bd2))
* locale support for traffic-page.ts date ([093c238](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/093c23888abaa9f0013554c9d09559e148c569bf))
* migrate translation mechanism fully to json ([e539154](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/e53915444c561a5d82bc2668a067d45bdaa9bfe7))
* settings-driven OIDC config, robust error handling, multi-tenant support ([de45049](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/de4504911e466eb7e2ae39ac2ca957572de8e13c))
* settings-driven OIDC config, robust error handling, multi-tenant support ([f64a5f9](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f64a5f9ebfc6877bf26b57b32abad97df8f88d08))
* show empty train section ([731c4b3](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/731c4b3029ed211840a98a8127357e8c929ccb91))
* show error message to user when api calls fail ([bede14f](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/bede14f1724f704fdced318e1078646549664e3d))
* **traffic:** add share train modal with partner selection ([6e8d0b1](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/6e8d0b1b1b3fcfebdc0a5ff01f267cd55d02e92a))
* **traffic:** add share train modal with partner selection ([8e0da95](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/8e0da95f4866f4f5472eb06fb7aaca6cf5a57793))


### Bug Fixes

* alert not displayed on traffic-overview page ([560eebb](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/560eebbd9fe811544aa3cbe5c444986958182c1e))
* allow deeplinks in the docker image ([e254bb9](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/e254bb9d879a089bfb433259712efad6a4968e6f))
* reset button not wide enough ([7f830d5](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7f830d589090776d6eb633bf36a5222d983ca9a2))


### Documentation

* explain the error concept ([f1280f9](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f1280f91f54622f517890e65587f6bf8d795cb21))
* update the readme to contain the most important commands ([f23d31e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f23d31ed544ddb4e4ed9ce08fb7af6b3bd9e85b5))


### Miscellaneous Chores

* address review comments ([704eb87](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/704eb8765fb2f6efb13530d736390234a87550e9))
* avoid dom entries when there are no errors ([cc807d6](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/cc807d6bfbd705e874c1821b18403a6f93b39c04))
* **deps-dev:** bump angular-eslint from 21.3.1 to 21.4.0 ([9b95880](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/9b958800da039af90880d2f42a598f4a64ea984c))
* **deps-dev:** bump eslint from 10.3.0 to 10.4.0 ([4b38294](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/4b3829410d766d14bdaa012a37c6f62cfa0f7e46))
* **deps-dev:** bump typescript-eslint from 8.59.3 to 8.59.4 ([de9038a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/de9038ab74b6c02fde1c5dcf3eaa864fc3ba0086))
* **deps-dev:** bump typescript-eslint from 8.59.4 to 8.60.0 ([7623ed5](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7623ed5ef7208946a6ecbb3a6922aa40f112bba0))
* **deps-dev:** bump vitest from 4.1.6 to 4.1.7 ([afa2f48](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/afa2f489db8fbfc6c7862cd5a7eece0281ed5c22))
* **deps:** bump the angular group across 1 directory with 13 updates ([93daa31](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/93daa31e5a7231925290db20456d93109cbb2bea))
* extract a dedicated journey route component ([d4a7a69](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d4a7a699640376507ed8ac01f507007d406a1710))
* make isOidcError more specific ([d6d9893](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d6d9893597cddfcc3c11ddb6be835be300f3c99c))
* remove not needed i18n block ([da76a7f](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/da76a7f4285449c61a60a15909fb5d31a2f2f7f1))
* remove unneded baseHref as the locales are directly integrated and switched dynamically ([21c5474](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/21c5474ac154fb3a5264913fdf13c85b5531b849))
* remove unused variable ([9cedcbc](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/9cedcbc3e3547f4f3c5d680265477da680aa7b8e))
* restructure eslint ([951bd18](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/951bd1870b7bc35acefb390686e6516bdb717354))
* simplify test code a bit and address copilot findings ([68ba9ea](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/68ba9ea77c2475c9357d1a209be495460183a6c5))
* unify fallback behavior ([117ce4e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/117ce4eff06a2fc3d486db98573ca902c619e961))
* use rxResource directly in the template instead of a computed ([fbeca2c](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fbeca2c8ed29b93150f42cb32c3c5c7b489ed571))

## [0.0.12](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.11...r2p-webclient-v0.0.12) (2026-05-20)


### Features

* add create train page ([7b4cc50](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7b4cc50e940a2b0973e09077c805fd9c24136b54))
* add oauth ([ed76814](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/ed76814596c186296220086335043cacdd8d5b16))
* add overview page ([62bcdeb](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/62bcdebe0b77a39dba62000ac62bbcf260520d4d))
* add read train page and improvements ([369d509](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/369d50968d97d20166769b4e1bba4908803e557c))
* add read view page and improvements ([88a2a3e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/88a2a3ecfb0f528b486b7936afecc655eefa91d9))
* add styles ([df8312e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/df8312e250962ef835a7a23eff226cf03fae1d90))
* add traffic view page ([fb53780](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fb53780a3c16abb7e32fe4b4dedadd6441213fa5))
* apply copilot feedback ([27eb893](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/27eb893c277eb7d0a58bdf3aff7357b3223a165d))
* apply copilot feedback ([ae9dfbc](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/ae9dfbcafb545f0cdfac76e4e3a7496de3cc7f63))
* apply copilot feedback ([b7d970f](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/b7d970f2f7b66f902e02e2f8f5344ce527bb2875))
* apply PR feedback ([006a79c](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/006a79c1dd477447a9abdce87e4047df8efbec74))
* implement create train ([5f4d2bf](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/5f4d2bff4de0b4dacb20158914935e37410ded4a))
* implement edit page & variant modal ([34b5c6c](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/34b5c6c68e9892e326085bb0ce446a937673b4d7))
* implement read view and improvements ([37ae94d](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/37ae94d000811a5c0adb90479d83c7080e4fcf2a))
* implement traffic overview ([8c8ff13](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/8c8ff135d16c114d6c8c64b3f50fb661c64a93b6))
* implement traffic page ([24533b9](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/24533b973dff753c26d3976aa05b128916cb01e9))
* improvements ([0f5771e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/0f5771eedac8e162777e5e73d0c45e3a63b44c50))
* refactoring ([9a886e0](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/9a886e025dd2bf6987cacb45183f4cc10731cdbd))
* remove unhelpful tests ([4561717](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/4561717abedaf1524a6ca675026e97d13ad9bb97))
* renaming ([0cdb644](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/0cdb6449f5bad9ee0a49cb2cd7f9e21e4e93878e))
* use prod url ([3bd2d22](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/3bd2d22b4aa22c6fdd9fd6c723d90bb04fc67346))


### Miscellaneous Chores

* **deps-dev:** bump @commitlint/cli from 20.5.3 to 21.0.1 ([d0494c2](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d0494c20c75add76bfcdd691b87d7321c4ddf543))
* **deps-dev:** bump @commitlint/config-conventional ([bedd50a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/bedd50acc5148b7751e7a34209fbfe4ef53e38ba))
* **deps-dev:** bump jsdom from 28.1.0 to 29.1.1 ([3fdfd5a](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/3fdfd5a8fac83866b1f668194eace730e1fce4ba))
* **deps-dev:** bump typescript-eslint from 8.56.1 to 8.59.3 ([fede6b0](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fede6b06d47b050cb157938f7fda8c3a1d6dbcce))
* **deps-dev:** bump vitest from 4.1.5 to 4.1.6 ([d09cb7c](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d09cb7c31727eecc6a572a7613899799c75725c8))
* **deps:** bump actions/github-script from 8 to 9 ([633282f](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/633282f7906ad0c6fe406da3642b7d27ef7aaec9))
* **deps:** bump docker/build-push-action from 6 to 7 ([b2bb35d](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/b2bb35d5fc5e0dcc5d546ff4882f0778cecedbb6))
* **deps:** bump the angular group with 13 updates ([a70f2f8](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/a70f2f898d19313ec392933148d337627c3d04de))


### Continuous Integration

* group angular updates for dependabot ([67fc0ea](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/67fc0eaa37ade842714fd5fcc71049240297a97f))

## [0.0.11](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.10...r2p-webclient-v0.0.11) (2026-05-12)


### Bug Fixes

* fix artifact build action authentication ([fdec70e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/fdec70e42c79a8af6a96e302b48012ff1a31fa4c))

## [0.0.10](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.9...r2p-webclient-v0.0.10) (2026-05-12)


### Bug Fixes

* fix artifact build action authentication ([0a1c5b3](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/0a1c5b3d99d033a2f469535e49f59dfaab58b115))

## [0.0.9](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.8...r2p-webclient-v0.0.9) (2026-05-12)


### Bug Fixes

* build artifact based on release-please ([d4676fa](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d4676faa4202aa3d455c61b1f155213fe6fbd982))

## [0.0.8](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.7...r2p-webclient-v0.0.8) (2026-05-12)


### Bug Fixes

* update dockerfile and deployment ([907e557](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/907e557b914dbb560a3e52b27928e36e8e93616e))

## [0.0.7](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.6...r2p-webclient-v0.0.7) (2026-05-12)


### Bug Fixes

* switch github user for pushing to docker repo ([7588a22](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7588a226f00e95a3d8185b377cd62991aa399530))

## [0.0.6](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.5...r2p-webclient-v0.0.6) (2026-05-12)


### Bug Fixes

* fix permission for publishing docker image ([c1f414e](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/c1f414e004a5e63108469c50415f4cf3b01b360d))

## [0.0.5](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.4...r2p-webclient-v0.0.5) (2026-05-12)


### Bug Fixes

* set github username for actions ([4f659a0](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/4f659a0779be125e82387d56f18e169cbccf97a5))

## [0.0.4](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.3...r2p-webclient-v0.0.4) (2026-05-12)


### Bug Fixes

* fix tag uppercase docker repository ([7acf5eb](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/7acf5eb733a4b816c5def7be9b5af5eee278316d))

## [0.0.3](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.2...r2p-webclient-v0.0.3) (2026-05-12)


### Features

* update version ([#10](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/10)) ([68f8b21](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/68f8b2161f681e4360336b6f13fcdb02f70d8433))
* update version ([#12](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/12)) ([16edb0f](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/16edb0fcd7e7340dffe5ab5d087a5511893860b9))


### Miscellaneous Chores

* add webclient artifacts ([d441023](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/d441023ea1b2df8060fa63773e8d0d34d64e5c74))


### Continuous Integration

* fix release ([#13](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/13)) ([f13f147](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/f13f147bb0218fae6b63fdf938602a8822f177c8))

## [0.0.2](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/compare/r2p-webclient-v0.0.1...r2p-webclient-v0.0.2) (2026-05-11)


### Features

* update README ([#7](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/issues/7)) ([4d36b01](https://github.com/SchweizerischeBundesbahnen/r2p-webclient/commit/4d36b01229cac8f6d2d805b8ca69d60c3164ed45))

## Changelog
