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

要使用`libraries`，只需列出要包含的JAR文件或目录。就像`input`和`output`一样，这些路径是相对于配置文件的位置的。

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
