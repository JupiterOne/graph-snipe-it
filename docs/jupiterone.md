# JupiterOne Managed Integration for Snipe-IT

## Snipe-IT + JupiterOne Integration Benefits

- Visualize Snipe-IT account locations, hardware, and hardware owners in the
  JupiterOne graph.
- Map Snipe-IT users to the hardware they have or own.
- Monitor changes to locations, hardware, and hardware owners using using
  JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches Snipe-IT hardware and owners data to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when the JupiterOne graph changes.

## Requirements

- JupiterOne requires the hostname of your Snipe-IT account as well as an 
API Token configured for read access.
- You must have permission in JupiterOne to install new integrations.

## Overview

JupiterOne provides a managed integration for Snipe-IT. The integration connects
directly to [Snipe-IT REST API][1] to hardware and asset information.

Configure the integration by providing an API Token with read-only permissions.
Obtain an API token from the bottom of the "Manage API Keys" page in your
Snipe-IT account.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/master/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources | Entity `_type`    | Entity `_class` |
| --------- | ----------------- | --------------- |
| Account   | `snipeit_account` | `Account`       |
| Location  | `location`        | `Site`          |
| Service   | `snipeit_service` | `Service`       |

### Relationships

The following relationships are created/mapped:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `site`                | **HAS**               | `hardware`            |
| `snipeit_account`     | **MANAGES**           | `hardware`            |
| `snipeit_account`     | **MANAGES**           | `location`            |
| `snipeit_account`     | **PROVIDES**          | `snipeit_service`     |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->

The following relationships are mapped:

| From     | Relationship  | To         |
| -------- | ------------- | ---------- |
| `Person` | **HAS\|OWNS** | `hardware` |

[1]: https://snipe-it.readme.io/reference
