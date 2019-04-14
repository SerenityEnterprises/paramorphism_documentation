# Changelog

## 1.0-beta

This is a **complete** rewrite. Upgrading from b0.14 to 1.0-beta is not advised until the documentation is made up-to-date.

- **Remapping is now much more robust** - Almost all applications that do not perform self-introspection can now be obfuscated without affecting functionality.
- The version numbering system has been redesigned: b0.x is now 1.x-beta.
- Libraries can now be addressed using maven specifiers
- Obfuscation strategies can now have individual element masks
- Mapping name generation now supports global prefixes and suffixes per element type
- Support for custom dictionaries has temporarily been removed
