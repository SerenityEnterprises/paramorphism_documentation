# 介绍

Paramorphism是Java虚拟机的混淆器，目前主要支持Java和Kotlin，理论上应该支持于任何不太依赖于反射或动态调度的JVM语言.

## 开始使用

将Java应用程序构建为JAR文件,就可以将JAR导入至Paramorphism以用于混淆.

Paramorphism是通过配置文件进行调整的.

```sh
java -jar paramorphism.jar path/to/config
```

Paramorphism支持两种配置文件格式：YAML和JSON 在本文档中，我们将使用YML文件作为示例配置.

下面是一个Hello, World的示例配置:

```yml
input: path/to/my/helloworld.jar
output: path/to/my/obfuscated-helloworld.jar

# 主HelloWorld类排除在remapper之外。
# 以便MANIFEST.MF中的'Main-Class'属性
# 以便不指向无效的类名
remapper:
  mask:
    exclude:
      - com/example/HelloWorld
```

使用“input”指定要混淆的jar的路径 output用于指向混淆后输出文件的位置。如果未设置“output”，则其值为“input”，但扩展名“.jar”将更改为“.obf.jar”.

更多配置参数请在文档的“配置”部分中查看。

## 局限性

Java混淆通常会抑制程序中的某些功能。

例如，名称映射(remapper)可以中断硬编码元素名称的反射调用。

例如 `Class.forName("com.example.HelloWorldPrinterFactory")`可以在混淆之后返回`ClassNotFoundException`,因为`HelloWorldPrinterFactory`将被命名为`a.a.c`之类的名称。

在开发最终将被混淆的应用程序时，请记住这一点，并在混淆后执行彻底的测试。

## 反馈问题

如果您发现混淆器有问题，请在[GitHub问题跟踪器](https://github.com/SerenityEnterprises/paramorphism-issues/)上反馈
