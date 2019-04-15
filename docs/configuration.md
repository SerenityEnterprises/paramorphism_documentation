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
