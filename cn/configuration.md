# 配置

## 输入 & 输出

`input` 可以定义目标混淆文件的路径，而 `output` 则模糊定义已混淆文件的输出路径。

这些路径是相对于配置文件的位置或绝对路径，这大多取决于类是否以绝对基本路径开始（例如，在大多数操作系统上为`/`，或在Windows上为驱动器盘符'C：/`）。

**例如:**

```yml
input: path/to/application.jar
output: obfuscated-application.jar
```

## 资源库

使用Paramorphism定义库有两种方法：`libraries`和`maven_libraries`  libraries可以是一个简单的JAR文件（或者是JAR文件的目录），而maven_librarie一般来说在user文件夹中的.m2目录

使用 `libraries`, 只需要您列出你需要的JAR文件或一个目录. 就像`input` 和 `output`, 路径相对于配置文件的位置。

**例如: `libraries`**

```yml
libraries:
  - my_library-1.0.jar
  - libs/google/guava.jar
  - libs/eclipse/ # 在l ibs/eclipse/ 目录中所有的JAR文件
```

要使用`maven_libraries`，您需要声明到工件说明符列表的主目录。 基目录也与配置文件有关。

计划为 Maven主目录 使用 HTTPS

**例如: `maven_libraries`**

```yml
maven_libraries:
  /home/myself/.m2/:
    - "com.google.code.gson:gson:2.8.5"
    - "io.netty:netty-all:4.1.0.Final"

  path/to/another/maven:
    - "com.example:proprietary-library:1.0.0"
```

::: 注意
为了使 重命名(Remapper) 正常工作，需要在
配置文件中声明应用程序所依赖的所有库。
:::

## 元素掩蔽

元素掩码定义在混淆传递中包含和排除哪些元素。 全局掩码由配置文件中的`mask`条目定义，并控制任何混淆策略可以触及的类。

元素屏蔽有两个概念，_including_和_excluding_。 默认情况下，包含所有元素。 如果在掩码的“include”列表中定义了任何元素，则**仅包含匹配的**元素。 然后，与`exclude`列表相匹配的任何元素也被排除在外。

使用排除掩码的反射 的类时，例如，当使用Java可序列化 或 类似Gson时的字段名称内省。

```yml
mask:
  include:
    - com/example/myproject/
    - org/business/proprietarylibrary/
  exclude:
    - com/example/myproject/beans/serializable/
    - com/example/myproject/config/ConfigurationJSONBean
```

### 规则匹配
`include`和`exclude`是_matching rules_的列表。 这是一个简单的概念：

 - 如果规则以`/`结尾，它将匹配从规则开始的任何内容。 例如，规则`path/rule/` 将会匹配 `path/rule/one`，`path/rule/two`，但不匹配`any/else/asdf`
 - 如果规则以`*`结尾，则它将充当通配符。 例如，规则`wildcard/rule *` 将会匹配 `wildcard/rule/one`，`wildcard/ruletwothreefour/five`，但不匹配`wildcard/anythingelse`
 - 否则，规则匹配任何与自身相同的内容。

## 标志

标准的布尔值来规定标志，标志用于修改混淆具体行为。

目前, Paramorphism实现了以下标志:

- `corruption`
- `anti_decompression`
- `kotlin`

### 腐蚀(Corruption)

'corruption' 标志声明混淆器将使用一个技术使您的程序成为 非实质的无效的Jar文件。由于Java本身十分宽松的JAR解析，致使您的文件将可以执行。

开启了本标志，一切分析工具的功能将会无效，除了针对于 Paramorphism 定制的分析工具。

### 反解压(Anti-Decompression)

'anti decompression' 标志 尝试确保无法从JAR文件中提取单个类以进行分析。

### Kotlin

'kotlin'标志指示混淆器为Kotlin编程语言启用特定的混淆策略。 例如，特定于Kotlin的策略可能会删除Kotlin编译器独有的调试信息。

目前，使用`kotlin`标志可以破坏使用`kotlin-reflect`库的程序中的行为。 （请注意，常规Java反射不受标志的影响。）

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

随着更多策略的实施，有些人可能会开发自己特定的可配置参数。

## 名称生成(Name Generation)

名称生成器在整个混淆器中使用，但其最明显的用途是在重新映射 (Remapper) 中。名称生成器对四种类型的元素进行操作：包、类、字段和方法。
`翻译备注:随机包名 随机方法名 随机类名 随机字段 示例: 包名a.b.c.d`

有三个不同的名称自定义方式：字典、前缀与后缀。

可以配置任意一个方面方面来处理任何元素类型，如下所示：

```yml
name_generation:
  [facet]:
    all: ...
    packages: ...
    classes: ...
    # fields: ... # 由于字段被省略，其值默认为'all'的值
    methods: ...
```

### 字典

Paramorphism目前有四种不同的词典：
`翻译备注:alphabet(字母表) alphabet_upper(大写字母表) java_keywords(java数据类型如：int long char等等) enterprise(公司名)`

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

### 前缀

前缀是应用于每个生成的名称的开头的常量字符串：

```yml
name_generation:
  prefixes:
    classes: MyProjectClass
```

### 后缀

后缀是应用于每个生成的名称末尾的常量字符串：

```yml
name_generation:
  suffixes:
    fields: "[]"
```

### 膨胀(Inflation)

此外，名称生成器可以采用“inflation”参数。这会根据膨胀值生成许多随机的额外名称段。例如，膨胀率为0的“a”可以生成为膨胀率为5的“fdgjia”。
//待补充
