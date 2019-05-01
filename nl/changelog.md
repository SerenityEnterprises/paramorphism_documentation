# Changelog

## 1.2-beta

- Fixed an issue where directories of libraries wouldn't be registered under Windows.
- Add a configuration value `name_generation.shuffle` to toggle shuffling of name generation dictionaries.

```yml
name_generation:
  shuffle: false # Disable shuffling
```

## 1.1-beta-hotfix

- Fixed a `VerifyError` when running a JAR that was remapped using a dictionary that has inflation set. (This actually happened to Paramorphism itself)
- Fixed a potential access violation when using the strategies 'Method Call Indirection' or 'Field Access Indirection'

## 1.1-beta

- Name generation dictionaries are now defined in the same manner as prefixes and suffixes.

```yml
# Old:
name_generation:
  dictionaries:
    - alphabet
    - classes
    - alphabet
    - alphabet

# New:
name_generation:
  dictionaries:
    all: alphabet
    classes: enterprise
```

- **Hotfix:** Methods in annotation classes are no longer remapped.
- The deterministic random seed can be altered using the `random_offset` config entry.
- Name generation dictionaries are now shuffled. A way to enable/disable this will come in 1.2-beta.
- The update checker has been slightly tweaked.
- There is a new strategy: Field Access Indirection, which obscures field reads/writes to external classes.

## 1.0-beta

This is a **complete** rewrite. Upgrading from b0.14 to 1.0-beta is not advised until the documentation is made up-to-date.

- **Remapping is now much more robust** - Almost all applications that do not perform self-introspection can now be obfuscated without affecting functionality.
- The version numbering system has been redesigned: b0.x is now 1.x-beta.
- Libraries can now be addressed using maven specifiers
- Obfuscation strategies can now have individual element masks
- Mapping name generation now supports global prefixes and suffixes per element type
- Support for custom dictionaries has temporarily been removed
