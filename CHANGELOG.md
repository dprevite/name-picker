# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/dprevite/name-picker/compare/v2.0.0...v2.0.1) (2025-09-25)


### 🐛 Bug Fixes

* update e2e tests to match simplified light/dark theme system ([a516042](https://github.com/dprevite/name-picker/commit/a5160420d206e84b278a9162d2a3c7bf7892d2dd))

## [2.0.0](https://github.com/dprevite/name-picker/compare/v1.0.0...v2.0.0) (2025-09-25)


### ⚠ BREAKING CHANGES

* Removes system theme detection, now only supports light/dark

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

### ✨ Features

* add pre-commit hooks with husky and lint-staged ([00ec9a2](https://github.com/dprevite/name-picker/commit/00ec9a26e516991dbd0a706d897589c2bea2a085))
* simplify theme system to light/dark toggle only ([723c6e0](https://github.com/dprevite/name-picker/commit/723c6e0484b0d89c9c1780f7848338419ef0ddf7))


### 🐛 Bug Fixes

* remove unused actualTheme variable in ThemeToggle component ([95a806e](https://github.com/dprevite/name-picker/commit/95a806e23eb455ed38921a9f4c7024c89b33cc37))
* resolve all e2e test failures and enhance theme toggle functionality ([0dfbb48](https://github.com/dprevite/name-picker/commit/0dfbb48e50da62a471a2a388928a8d1519ab4013))
* resolve sed command error in release workflow and update docker.md ([dafe198](https://github.com/dprevite/name-picker/commit/dafe1986009a62190421b4ab2e1c90f4b2a9505f))


### 📚 Documentation

* add comprehensive pre-commit quality check instructions to CLAUDE.md ([abdebf9](https://github.com/dprevite/name-picker/commit/abdebf901042ca8da362de7b7699a00d75c1ef36))

## 1.0.0 (2025-09-25)


### ✨ Features

* add URL state management for bookmarkable name lists ([deba9df](https://github.com/dprevite/name-picker/commit/deba9df538bdfc8ddb2373ab751dc610046aba23))


### 🐛 Bug Fixes

* correct repository URL in semantic-release configuration ([d927378](https://github.com/dprevite/name-picker/commit/d9273785921362cf928eaf29378ba5cfc23eca36))
* correct test expectations to match actual component implementation ([6f28ad5](https://github.com/dprevite/name-picker/commit/6f28ad580b32ea27b201c20681eed69cda65a4cd))
* resolve all test failures caused by URL state management ([ac6fbbf](https://github.com/dprevite/name-picker/commit/ac6fbbfd0424c316e0a0b5de5eb2e2caeb20e9de))
* resolve GitHub Actions CI failures ([3a3ed3d](https://github.com/dprevite/name-picker/commit/3a3ed3d14fc49a0ae41ff6ec18e7c84639ba848a))
* resolve GitHub Actions workflow issues ([e5932f1](https://github.com/dprevite/name-picker/commit/e5932f1c6e5392a80542cbd003111767695c5a29))


### 📚 Documentation

* add comprehensive release automation and Docker documentation ([fabd46d](https://github.com/dprevite/name-picker/commit/fabd46dd4248f33b15e71bb9c16382180d4a8149))
* enhance CLAUDE.md with CI/CD system and current architecture ([869b74b](https://github.com/dprevite/name-picker/commit/869b74b9029ac6500be6004250426d6e0448dbfc))
* modernize README with current features and GitHub Actions badges ([4d84076](https://github.com/dprevite/name-picker/commit/4d840769150e36174105b7cc1685d006834ffa12))


### 🛠 Build System

* add semantic-release dependencies for automated versioning ([44cb2e4](https://github.com/dprevite/name-picker/commit/44cb2e49847db6a5318fae9312c99f69032761a2))


### ⚙️ Continuous Integration

* add automated Docker build and release pipeline ([1c0d333](https://github.com/dprevite/name-picker/commit/1c0d3335e395f72ad80a1090056f947d0d8bb0b5))


### ♻️ Chores

* add conventional commit message template ([914aee3](https://github.com/dprevite/name-picker/commit/914aee3517fe388d35c2b67ae70a4bd8ae2f0534))
