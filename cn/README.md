# 介绍

Paramorphism 是一个 Java虚拟机 的混淆器. 它目前主要支持 Java 和 Kotlin, 但理论上应该支持不怎么依赖于反射或动态调度名称(dynamic by-name dispatch)的JVM语言。

## 入门

当你构建了一个JAR文件的Java程序时，你就可以用Paramorphism来混淆它。

Paramorphism 需要使用配置文件来运行。

```sh
java -jar paramorphism.jar path/to/config
```

Paramorphism 支持配置文件的两种格式: YAML 和 JSON. 在本文档中，我们将使用 YAM文件 作为示例配置。

下面是一个Hello, World的示例配置:

```yml
input: path/to/my/helloworld.jar
output: path/to/my/obfuscated-helloworld.jar

# 我们排除了主类 HelloWorld.class，
# 以便防止 MANIFEST.MF 内的 'Main-Class'
# 指向一个无效的类
remapper:
  mask:
    exclude:
      - com/example/HelloWorld
```

如你所见, 我们使用 `input` 来指定我们想要混淆的JAR文件. `output` 用于指向混淆输出文件的路径. 如果 `output` 没被定义, 那么 `input` 所指向的JAR文件将会被命名为 `.obf.jar`。

其他的配置参数将在 '配置文件' 内进行讲解。

## 局限性

Java混淆通常会抑制程序中的某些功能。

例如，名称映射(remapper)可以中断硬编码元素名称的反射调用。

例如 `Class.forName("com.example.HelloWorldPrinterFactory")`可以在混淆之后返回`ClassNotFoundException`,因为`HelloWorldPrinterFactory`将被命名为`a.a.c`之类的名称。

在开发最终将被混淆的应用程序时，请记住这一点，并在混淆后执行彻底的测试。

## 反馈问题

如果您发现混淆器有问题，请在[GitHub问题跟踪器](https://github.com/SerenityEnterprises/paramorphism-issues/)上反馈
