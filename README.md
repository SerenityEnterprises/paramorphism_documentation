# Introduction

Paramorphism is an obfuscator for the Java Virtual Machine. It mainly supports Java and Kotlin at the present time, but theoretically should support any JVM language that does not rely too heavily on reflection or dynamic by-name dispatch.

## Getting Started

Once you have built a Java application as a JAR file, you can feed the JAR to Paramorphism for use in obfuscation.

Paramorphism supports two formats for configuration: YAML and JSON. In this documentation, we will be using YML files as sample configurations.

Here is an example configuration for a basic 'Hello, World!' application:

```yml
input: path/to/my/helloworld.jar
output: path/to/my/obfuscated-helloworld.jar

# We exclude the main HelloWorld class from being remapped
# so that the 'Main-Class' attribute in MANIFEST.MF
# does not point to an invalid class name.
remapper:
  mask:
    exclude:
      - com/example/HelloWorld
```

As you can see, we use `input` to specify the path to the JAR we want to obfuscate. `output` is used to point to where the obfuscated artifact should be placed. If `output` is unset, its value is `input` but with the `.jar` extension changed to `.obf.jar`.

Further configuration parameters are specified in the 'Configuration' portion of the documentation.

## Limitations

Java obfuscation in general can inhibit certain functionality in a program.

For instance, name remapping can break reflection calls which hardcode element names.

For example, `Class.forName("com.example.HelloWorldPrinterFactory")` can return a `ClassNotFoundException` after obfuscation, since the `HelloWorldPrinterFactory` will be named something like `a.a.c`.

Please keep this in mind when developing an application which will be eventually obfuscated, and perform thorough testing post-obfuscation.

## Report Issues

If you find an issue with the obfuscator, please report it on the [GitHub issue tracker.](https://github.com/SerenityEnterprises/paramorphism-issues/)
