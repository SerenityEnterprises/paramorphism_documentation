# Configuration

## Input & Output

`input` defines the path where the target artifact can be found, while `output` declares where the obfuscated output will be emitted.

These paths are either relative to the location of the configuration file or absolute, depending on if the class starts with an absolute base path (e.g. `/` on sane operating systems, or a drive letter à la `C:/` on Windows).

**Example:**

```yml
input: path/to/application.jar
output: obfuscated-application.jar
```

## Libraries

There are two ways to define libraries with Paramorphism: `libraries` and `maven_libraries`. `libraries` is a simple list of JAR files (or directories of JAR files), whereas `maven_libraries` is a specification of maven-like structures to use. The most common use of `maven_libraries` is the .m2 directory in the user's home.

To use `libraries`, simply list the JAR files and/or directories that you wish to include. Just like `input` and `output`, these paths are relative to the location of the configuration file.

**Example: `libraries`**

```yml
libraries:
  - my_library-1.0.jar
  - libs/google/guava.jar
  - libs/eclipse/ # All JAR files inside the libs/eclipse/ directory
```

To use `maven_libraries`, you need to declare a base directories mapped to a list of artifact specifiers. Base directories are also relative to the configuration file.

HTTPS support is planned for maven base directories in future.

**Example: `maven_libraries`**

```yml
maven_libraries:
  /home/myself/.m2/:
    - "com.google.code.gson:gson:2.8.5"
    - "io.netty:netty-all:4.1.0.Final"

  path/to/another/maven:
    - "com.example:proprietary-library:1.0.0"
```

::: warning
In order for the remapper to function correctly, all libraries upon which
the application depends need to be declared in the configuration file.
:::

## Element Masking

An element mask defines which elements are to be included and excluded in an obfuscation pass. The global mask is defined by the `mask` entry in the configuration file, and controls which classes any obfuscation strategy can touch.

Element masking has two concepts, _including_ and _excluding_. By default, all elements are included. If any elements are defined in the mask's `include` list, then **only matching** elements are included. Then, any elements matching the `exclude` list are also excluded.

An example of a use of exclusion masks is when there are classes which are subject to heavy reflection, for instance, field name introspection when using Java serializables or something like Gson.

```yml
mask:
  include:
    - com/example/myproject/
    - org/business/proprietarylibrary/
  exclude:
    - com/example/myproject/beans/serializable/
    - com/example/myproject/config/ConfigurationJSONBean
```

### Matching Rules

`include` and `exclude` are lists of _matching rules_. This is a simple concept:

- If the rule ends with `/`, it will match anything starting with the rule. For instance, the rule `path/rule/` matches `path/rule/one`, `path/rule/two`, but not `anything/else/asdf`
- If the rule ends with `*`, it will act as a wildcard. For instance, the rule `wildcard/rule*` matches `wildcard/rule/one`, `wildcard/ruletwothreefour/five`, but not `wildcard/anythingelse`
- Otherwise, the rule matches anything identical to itself.

## Flags

Flags are simple boolean toggles to change obfuscation behaviour.

Currently, Paramorphism has the following flags implemented:

- `corruption`
- `anti_decompression`
- `kotlin`

### Corruption

The 'corruption' flag instructs the obfuscator to emit a JAR file that is technically invalid, but executes anyway due to Java's lenient JAR parsing.

With this flag, most analysis tools are rendered non-functional, with the exception of those custom-made for Paramorphism obfuscation.

### Anti-Decompression

The 'anti decompression' flag tries to ensure that individual classes cannot be pulled out of the JAR file for analysis.

### Kotlin

The 'kotlin' flag instructs the obfuscator to enable specific obfuscation strategies for the Kotlin programming language. For example, a Kotlin-specific strategy might strip out debugging information that is unique to the Kotlin compiler.

Presently, use of the `kotlin` flag can corrupt behaviour in programs that make use of the `kotlin-reflect` library. (Please note that regular Java reflection is unaffected by the flag.)

## Strategies

Individual strategies can be configured in Paramorphism.

All strategies have at least two configurable properties: `enabled` and `mask`

`enabled` determines whether the obfuscation strategy will be used in the obfuscation of the target program, and is a boolean. The default value of `enabled` is true for all obfuscation strategies, but some obfuscation strategies are gated by [configuration flags](#flags).

`mask` is a local specific mask that defines which classes the obfuscation strategy will be applied to. Please note that exclusions from the global mask cannot be overridden by an inclusion from a local mask.

Using the strategy 'Field Access Indirection' as an example, we set 'enabled' to true, and disable the strategy for a performance-critical class:

```yml
field_access_indirection:
  enabled: true # Here for demonstration purposes; but true is the default
  mask:
    exclude:
      - com/example/project/ASuperPerformanceCriticalClass
```

The following are the currently-existing strategies in Paramorphism:

- `debug_info_scrubbing`
- `kotlin_metadata_scrubbing`
- `kotlin_intrinsics_concealment`
- `remapper`
- `method_call_indirection`
- `field_access_indirection`
- `string_indirection`

As more strategies are implemented, it is likely that some will develop their own specific configurable parameters.

## Name Generation

The name generator is used throughout the obfuscator, but its most obvious use is in the remapper. The name generator operates on four types of elements: Packages, classes, fields, and methods.

There are three different name generation facets: Dictionaries, prefixes, and suffixes.

A facet can be configured to act upon any of the element types like so:

```yml
name_generation:
  [facet]:
    all: ...
    packages: ...
    classes: ...
    # fields: ... # Since fields is omitted, its value defaults to the value of 'all'
    methods: ...
```

### Dictionaries

There are currently four different dictionaries in Paramorphism:

- `alphabet`
- `alphabet_upper`
- `java_keywords`
- `enterprise`

```yml
name_generation:
  dictionaries:
    all: alphabet
    classes: enterprise
```

### Prefixes

Prefixes are a constant string applied to the start of every generated name:

```yml
name_generation:
  prefixes:
    classes: MyProjectClass
```

### Suffixes

Suffixes are a constant string applied to the end of every generated name:

```yml
name_generation:
  suffixes:
    fields: "[]"
```

### Inflation

In addition, the name generator can take an 'inflation' parameter. This generates a number of random extra name segments depending on the inflation value. For instance, the name 'a' with inflation 0 could be generated as 'fdgjia' with inflation 5.
