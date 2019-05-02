# 配置

## 导入 & 导出

`input` 用来指定目标jar的路径 `output` 文件混淆后的输出路径

这些路径要么相对于配置文件的位置，要么是绝对路径 (例如，在正常的操作系统上使用/，或者在Windows上使用驱动器盘符，例如C:/)。

**示例:**

```yml
input: path/to/application.jar
output: obfuscated-application.jar
```

## Libraries(支持库)

使用Paramorphism定义库有两种方法：`libraries`和`maven_libraries`  libraries可以是一个简单的JAR文件（或者是JAR文件的目录），而maven_librarie一般来说在user文件夹中的.m2目录

要使用`libraries`，只需列出要包含的JAR文件或目录。就像`input`和`output`一样，这些路径是相对于配置文件的位置。

**示例: `libraries`**

```yml
libraries:
  - my_library-1.0.jar
  - libs/google/guava.jar
  - libs/eclipse/ # All JAR files inside the libs/eclipse/ directory
```

要使用“maven_libraries”，您需要声明一个映射到Maven Artifact列表的基本目录。基本目录也相对于配置文件。

未来计划将对Maven提供HTTPS支持

**示例: `maven_libraries`**

```yml
maven_libraries:
  /home/myself/.m2/:
    - "com.google.code.gson:gson:2.8.5"
    - "io.netty:netty-all:4.1.0.Final"

  path/to/another/maven:
    - "com.example:proprietary-library:1.0.0"
```

::: 警告
为了使remapper正确的工作, java应用程序中所有使用的支持库,必须在配置文件中进行导入
:::

## Element Masking(元素屏蔽)

元素掩码定义在混淆传递中包含和排除哪些类。全局掩码由mask配置文件中的条目定义，并控制任何混淆策略可以触及的类。

元素掩码有两个概念，包括和排除_。默认情况下，所有元素都包括在内。如果在掩码的`exclude`列表中定义了任何元素，那么*只包含匹配的*元素。然后，与`exclude`列表相匹配的任何元素也被排除在外。

使用排除掩码的一个例子是当存在严重反射的类时，例如，当使用Java可序列化或类似Gson时的字段名称内省。

```yml
mask:
  include:
    - com/example/myproject/
    - org/business/proprietarylibrary/
  exclude:
    - com/example/myproject/beans/serializable/
    - com/example/myproject/config/ConfigurationJSONBean
```

### Matching Rules(规则匹配)

`include`和`exclude`是匹配规则的列表,这是一个简单的概念：

- 如果规则以`/`结尾，它将匹配以规则开头的任何内容
- 如果规则以`*`结尾，它将充当通配符 例如：规则`wildcard/rule*`匹配`wildcard/rule/one`，`wildcard/ruletwothreefour/five`但不匹配`wildcard/anythingelse`
- 否则，该规则将匹配任何与其本身相同的内容。

## Flags

Flags 使用false/true改变混淆行为

目前，有下列flag可供使用：

- `corruption`
- `anti_decompression`
- `kotlin`
```yml
flags: 
    corruption: false
    anti_decompression: false
    kotlin: false
```


### Corruption
把class集成为（encrypted_data / name），让大部分反编译器无法编译，除了那些为Paramorphism混淆定制的分析工具
### Anti-Decompression

确保不能从JAR文件中提取单个类进行分析。

### Kotlin

`kotlin`混淆器为Kotlin编程语言启用特定的混淆策略。例如，特定于Kotlin的策略可能会删除Kotlin编译器独有的调试信息。

目前，使用该kotlin标志可以破坏使用该kotlin-reflect库的程序中的行为。（请注意，常规Java反射不受Flag的影响。）

## 策略

单个策略可以配置在Paramorphism中.

所有策略都至少有两个可配置属性:`enabled`和`mask`

“enabled”决定是否在目标程序的混淆中使用混淆策略，并且是一个布尔值。默认值“enabled”适用于所有的混淆策略，但是有些混淆策略是由[Flags]控制的。(#flags).

“mask”是一个局部特定的掩码，它定义了将应用混淆策略的类。请注意，全局掩码中的`exclude`不能被本地掩码中的`include`覆盖。

以策略“Field Access Indirection”为例，我们将“enabled”设置为true，并禁用性能关键类的策略:

```yml
field_access_indirection:
  enabled: true # 此处用于演示，但默认为true
  mask:
    exclude:
      - com/example/project/ASuperPerformanceCriticalClass
```

目前可使用的Paramorphism策略:
`翻译备注：如果你不进行定义，这些策略会全部开启`
- `debug_info_scrubbing`
- `kotlin_metadata_scrubbing`
- `kotlin_intrinsics_concealment`
- `remapper`
- `method_call_indirection`
- `field_access_indirection`
- `string_indirection`


随着更多策略的实施，一些人很可能会开发自己特定的可配置参数

## Name Generation（名称生成）

名称生成器在整个混淆器中使用，但其最明显的用途是在重组器中。名称生成器对四种类型的元素进行操作：包、类、字段和方法。
`翻译备注:随机包名 随机方法名 随机类名 随机字段 示例: 包名a.b.c.d`

有三个不同的名称自定义方式：字典、前缀与后缀。

可以配置任意一个方面方面来处理任何元素类型，如下所示：



```yml
name_generation:
  [facet]:
    all: ...
    packages: ...
    classes: ...
    # fields: ... # 由于字段被省略，其值默认为“all”的值。
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
