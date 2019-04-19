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

Element masking has two concepts, *including* and *excluding*. By default, all elements are included. If any elements are defined in the mask's `include` list, then **only matching** elements are included. Then, any elements matching the `exclude` list are also excluded.

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

`include` and `exclude` are lists of *matching rules*. This is a simple concept:

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

### Anti Decompression

The 'anti decompression' flag tries to ensure that individual classes cannot be pulled out of the JAR file for analysis.

### Kotlin

The 'kotlin' flag instructs the obfuscator to enable specific obfuscation strategies for the Kotlin programming language. For example, a Kotlin-specific strategy might strip out debugging information that is unique to the Kotlin compiler.

Presently, use of the `kotlin` flag can corrupt behaviour in programs that make use of the `kotlin-reflect` library. (Please note that regular Java reflection is unaffected by the flag.)
