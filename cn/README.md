# 介绍

Paramorphism 是一个 Java虚拟机 的混淆器. 它目前主要支持 Java 和 Kotlin, 但理论上应该支持不怎么依赖于反射或动态调度名称(dynamic by-name dispatch)的JVM语言。

## 入门

当你构建了一个JAR文件的Java程序时，你就可以用Paramorphism来混淆它。

Paramorphism 需要使用配置文件来运行。

```sh
java -jar paramorphism.jar path/to/config
```

Paramorphism 支持配置文件的两种格式: YAML 和 JSON. 在本文档中，我们将使用 YAM文本 作为示例配置。

Here is an example configuration for a basic 'Hello, World!' application:
举个例子，这里是一个基础的 “Hello, World!” 程序配置。

```yml
input: path/to/my/helloworld.jar
output: path/to/my/obfuscated-helloworld.jar

# We exclude the main HelloWorld class from being remapped
# 我们排除了主类 HelloWorld.class，
# 以便防止 MANIFEST.MF 内的 'Main-Class'
# 指向一个无效的类
remapper:
  mask:
    exclude:
      - com/example/HelloWorld
```

如你所见, 我们使用 `input` 来指定我们想要混淆的JAR文件. `output` 用于指向混淆输出文件的路径. 如果 `output` 没被定义, 那么 `input` 所指向的JAR文件将会被命名为 `.obf.jar`。

其他的配置参数将在 'Configuration' 内进行讲解。

## 局限性

Java 混淆通常可以阻止程序内的部分功能。

例如, 重命名(name remapper) 可以破坏调用硬编码元素名称(hardcode element names)的反射。

又例如， `Class.forName("com.example.HelloWorldPrinterFactory")` 在混淆之后可以返回 `ClassNotFoundException`, 因为 `HelloWorldPrinterFactory` 将会被重命名为类似于 `a.a.c`

当您开发的程序被混淆后，请进行全面的测试以验证它的可用性，防止造成损失。

## 举报问题

如果你发现了本混淆器的问题，请上报它。 [GitHub issue tracker.](https://github.com/SerenityEnterprises/paramorphism-issues/)
