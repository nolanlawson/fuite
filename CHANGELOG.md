# [1.5.0](https://github.com/nolanlawson/fuite/compare/v1.4.2...v1.5.0) (2022-06-11)


### Features

* add optional teardown to scenario ([#48](https://github.com/nolanlawson/fuite/issues/48)) ([0f08c4a](https://github.com/nolanlawson/fuite/commit/0f08c4a80f5238181c5afff76a08f0eb08e790ca))



## [1.4.2](https://github.com/nolanlawson/fuite/compare/v1.4.1...v1.4.2) (2022-03-18)


### Bug Fixes

* remove source-map-resolve ([#46](https://github.com/nolanlawson/fuite/issues/46)) ([e897f0d](https://github.com/nolanlawson/fuite/commit/e897f0da55ebd25e5bb0e4def1e7d5fcec1afbe4))



## [1.4.1](https://github.com/nolanlawson/fuite/compare/v1.4.0...v1.4.1) (2022-03-18)

### Chores

* chore: update deps and fix typo ([#45](https://github.com/nolanlawson/fuite/issues/45)) ([d5f0955](https://github.com/nolanlawson/fuite/commit/d5f0955ec6bb8bb16d904610c3552d8349c64904))


# [1.4.0](https://github.com/nolanlawson/fuite/compare/v1.3.2...v1.4.0) (2022-01-16)


### Bug Fixes

* add changelog ([#43](https://github.com/nolanlawson/fuite/issues/43)) ([1bbf391](https://github.com/nolanlawson/fuite/commit/1bbf3910b2b3a6e62b394495e87c11defec35681)), closes [#38](https://github.com/nolanlawson/fuite/issues/38)


### Features

* add --browser-arg option ([#42](https://github.com/nolanlawson/fuite/issues/42)) ([2942208](https://github.com/nolanlawson/fuite/commit/2942208e75acc425a65df8e187979c1f22c94c53)), closes [#39](https://github.com/nolanlawson/fuite/issues/39)



## [1.3.2](https://github.com/nolanlawson/fuite/compare/v1.3.1...v1.3.2) (2022-01-13)


### Bug Fixes

* fix dynamic import on windows ([#41](https://github.com/nolanlawson/fuite/issues/41)) ([a63d5f6](https://github.com/nolanlawson/fuite/commit/a63d5f62f2ad2cfb38f614fc42146cfa32bfdb97)), closes [#40](https://github.com/nolanlawson/fuite/issues/40)



## [1.3.1](https://github.com/nolanlawson/fuite/compare/v1.3.0...v1.3.1) (2022-01-03)


### Bug Fixes

* update minimum node version, test in 14 ([#36](https://github.com/nolanlawson/fuite/issues/36)) ([8824b31](https://github.com/nolanlawson/fuite/commit/8824b3139591cc334b89688b0103b4dac05db927))



# [1.3.0](https://github.com/nolanlawson/fuite/compare/v1.2.0...v1.3.0) (2021-12-28)


### Features

* track stacktraces for leaking collections ([#25](https://github.com/nolanlawson/fuite/issues/25)) ([59fa3da](https://github.com/nolanlawson/fuite/commit/59fa3da4ad3b0998b10d56bad23f2f8433efb6c5)), closes [#14](https://github.com/nolanlawson/fuite/issues/14)



# [1.2.0](https://github.com/nolanlawson/fuite/compare/v1.1.0...v1.2.0) (2021-12-21)


### Bug Fixes

* better handle changing dom node descriptions ([#21](https://github.com/nolanlawson/fuite/issues/21)) ([fa0b974](https://github.com/nolanlawson/fuite/commit/fa0b974f9b4752215fb8dc393e7669e5e593fd8c))
* fix collections that throw on size/length ([#18](https://github.com/nolanlawson/fuite/issues/18)) ([255bcb2](https://github.com/nolanlawson/fuite/commit/255bcb2a3ceb6a36dd0dd373bce46dd2c4d2eff3)), closes [#17](https://github.com/nolanlawson/fuite/issues/17)
* handle changing event/node names ([#22](https://github.com/nolanlawson/fuite/issues/22)) ([3bb2535](https://github.com/nolanlawson/fuite/commit/3bb2535df7c5bae59c0c6fd6b30251b2d5906e2b))
* support shadow dom ([#19](https://github.com/nolanlawson/fuite/issues/19)) ([9133267](https://github.com/nolanlawson/fuite/commit/91332672ecf76c5c53dae5caddf2fdd43e10c6e9)), closes [#1](https://github.com/nolanlawson/fuite/issues/1)


### Features

* show detail on leaking dom nodes ([#20](https://github.com/nolanlawson/fuite/issues/20)) ([7bc6ffa](https://github.com/nolanlawson/fuite/commit/7bc6ffa00e2296c0623a255fa828fe168ec6f8e1)), closes [#7](https://github.com/nolanlawson/fuite/issues/7)



# [1.1.0](https://github.com/nolanlawson/fuite/compare/v1.0.2...v1.1.0) (2021-12-18)


### Features

* add --setup flag ([#13](https://github.com/nolanlawson/fuite/issues/13)) ([17efa65](https://github.com/nolanlawson/fuite/commit/17efa65ef50e3866bfdddaa16e7bf019266f34e5)), closes [#12](https://github.com/nolanlawson/fuite/issues/12)



## [1.0.2](https://github.com/nolanlawson/fuite/compare/v1.0.1...v1.0.2) (2021-12-17)


### Bug Fixes

* use path.resolve(), tidy output, add docs ([#8](https://github.com/nolanlawson/fuite/issues/8)) ([00e9202](https://github.com/nolanlawson/fuite/commit/00e9202e483aa0271887514ffef7b8cb56bf12f9))



## [1.0.1](https://github.com/nolanlawson/fuite/compare/v1.0.0...v1.0.1) (2021-12-17)


### Bug Fixes

* use abort controller polyfill for node 14 ([#5](https://github.com/nolanlawson/fuite/issues/5)) ([00fd09c](https://github.com/nolanlawson/fuite/commit/00fd09ca1484966832d4075625a46144790c1347))



# [1.0.0](https://github.com/nolanlawson/fuite/compare/545610dbf379992d696f427f486c9417a4650758...v1.0.0) (2021-12-17)

Initial commit.
