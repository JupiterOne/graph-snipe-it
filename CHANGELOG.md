# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2.0.3 - 2023-03-15

### Fixed

- Consumable, License and User entities types and fields.
- Added authorization error handling.

## 2.0.2 - 2023-03-06

### Changed

- Updated `package.json` file (`main`, `types` and `files` section).
- Updated `build.yaml` file to latest patterns.
- Ran prettier.
- Added `questions.yaml` file.

## 2.0.1 - 2023-01-27

### Fixed

- `Device.displayName` was set to null in some cases, add default for it

## 2.0.0 - 2022-11-10

- Reorganized files
- Added more test cases
- Updated J1 SDK packages to v8.x
- Added new entities and relationships:

### Entities

| Resources  | Entity `_type`                 | Entity `_class` |
| ---------- | ------------------------------ | --------------- |
| Consumable | `snipeit_consumable_resource`  | `Resource`      |
| License    | `snipeit_licensed_application` | `Application`   |
| User       | `snipeit_user`                 | `User`          |

### Relationships

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`          |
| --------------------- | --------------------- | ------------------------------ |
| `snipeit_account`     | **HAS**               | `snipeit_consumable_resource`  |
| `snipeit_account`     | **HAS**               | `snipeit_licensed_application` |
| `snipeit_account`     | **HAS**               | `snipeit_user`                 |
| `snipeit_user`        | **USES**              | `snipeit_consumable_resource`  |

### Mapped Relationships

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` | Direction |
| --------------------- | --------------------- | --------------------- | --------- |
| `snipeit_user`        | **IS**                | `*person*`            | FORWARD   |

## 1.0.0 - 2021-01-14

### Changed

- Upgrade to latest managed integration patterns and libraries

### Added

- `Device.email` to allow for mapping to `Person`

### Fixed

- `Device.username` was not ingested

## 0.1.0 - 2020-05-18

### Added

- Initial release.
