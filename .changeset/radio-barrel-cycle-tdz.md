---
'@educarehq/solaris-ui': patch
---

Fix `ReferenceError: Cannot access 'SolarisRadioComponent' before initialization` when evaluating the built bundle. `solaris-radio` imported the group tokens through the `radio-group` barrel while `solaris-radio-group` imported the radio component through the `radio` barrel — the only barrel cycle in the library. The radio component now imports `SOLARIS_RADIO_GROUP`/`SOLARIS_RADIO_GROUP_NAME` directly from the token file, matching the `checkbox`/`switch` pattern. No API or behavior change.
