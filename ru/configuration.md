# Конфигурация

## Ввод & Вывод

`input` определяет путь, где может быть найден скомпилированный файл, в то время как`output` определяет, куда куда данный файл после обфускации будет сохранен.

These paths are either relative to the location of the configuration file or absolute, depending on if the class starts with an absolute base path (e.g. `/` on sane operating systems, or a drive letter Ã la `C:/` on Windows).

**Пример:**

```yml
input: path/to/application.jar
output: obfuscated-application.jar
```

## Библиотеки

There are two ways to define libraries with Paramorphism: `libraries` and `maven_libraries`. `libraries` is a simple list of JAR files (or directories of JAR files), whereas `maven_libraries` is a specification of maven-like structures to use. The most common use of `maven_libraries` is the .m2 directory in the user's home.

To use `libraries`, simply list the JAR files and/or directories that you wish to include. Just like `input` and `output`, these paths are relative to the location of the configuration file.

**Пример: `libraries`**

```yml
libraries:
  - my_library-1.0.jar
  - libs/google/guava.jar
  - libs/eclipse/ # Все JAR файлы находящиеся внутри директории libs/eclipse/
```

Чтобы использовать `maven_libraries`, вам нужно объявить базовые каталоги, соответствующие списку вашего приложения. Также, относятся к файлу конфигурации и базовые каталоги.

В будущем планируется поддержка HTTPS для базовых каталогов maven.

**Пример: `maven_libraries`**

```yml
maven_libraries:
  /home/myself/.m2/:
    - "com.google.code.gson:gson:2.8.5"
    - "io.netty:netty-all:4.1.0.Final"

  path/to/another/maven:
    - "com.example:proprietary-library:1.0.0"
```

::: warning
Для того, чтобы ремаппер работал правильно, все библиотеки, являющиеся зависимостями прилжения, должны быть опрелены в конфируционном файле.
:::

## Маскировка элементов

Маска элемента определяет, какие элементы должны быть включены на этапе обфускации. Глобальная маска определяется записью `mask` в файле конфигурации и контролирует классы, к которым может обращаться любая стратегия обфускации.

Элемент маскировки имеет два парамента: _including_ и _excluding_. По умолчанию все элементы включены. Если какие-либо элементы определены в списке `include`, то **включаются вписанные в него** элементы. Затем все элементы, соответствующие списку `exclude`, также исключаются.

Примером использования масок являются исключительные случаи, когда существуют классы, которые подвергаются интенсивной работе с рефлексией, например, самоанализ имен полей при использовании сериализуемых Java-программ или что-то вроде Gson.

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

## Флаги

Flags are simple boolean toggles to change obfuscation behaviour.

Currently, Paramorphism has the following flags implemented:

- `corruption`
- `anti_decompression`
- `kotlin`

### Corruption

The 'corruption' flag instructs the obfuscator to emit a JAR file that is technically invalid, but executes anyway due to Java's lenient JAR parsing.

With this flag, most analysis tools are rendered non-functional, with the exception of those custom-made for Paramorphism obfuscation.

### Анти-Декомпрессия

The 'anti decompression' flag tries to ensure that individual classes cannot be pulled out of the JAR file for analysis.

### Kotlin

The 'kotlin' flag instructs the obfuscator to enable specific obfuscation strategies for the Kotlin programming language. For example, a Kotlin-specific strategy might strip out debugging information that is unique to the Kotlin compiler.

Presently, use of the `kotlin` flag can corrupt behaviour in programs that make use of the `kotlin-reflect` library. (Please note that regular Java reflection is unaffected by the flag.)

## Стратегии

Individual strategies can be configured in Paramorphism.

All strategies have at least two configurable properties: `enabled` and `mask`

`enabled` determines whether the obfuscation strategy will be used in the obfuscation of the target program, and is a boolean. The default value of `enabled` is true for all obfuscation strategies, but some obfuscation strategies are gated by [configuration flags](#flags).

`mask` is a local specific mask that defines which classes the obfuscation strategy will be applied to. Please note that exclusions from the global mask cannot be overridden by an inclusion from a local mask.

Using the strategy 'Field Access Indirection' as an example, we set 'enabled' to true, and disable the strategy for a performance-critical class:

```yml
field_access_indirection:
  enabled: true # Только для демонстрационных целей; т.к. значение true является стандартным параментом
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
    # fields: ... # Поскольку поля опущены, его значение по умолчанию равно 'all'
    methods: ...
```

### Словари

На данный момент, Paramorphism включает в себя четыре различных словаря:

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

### Префиксы

Префиксы являются константной строкой, применяемой к началу каждого сгенерированного имени:

```yml
name_generation:
  prefixes:
    classes: MyProjectClass
```

### Суффиксы

Суффиксы — это константа, которая применяется к концу каждого сгенерированного имени:

```yml
name_generation:
  suffixes:
    fields: "[]"
```

### Inflation

К тому же, генератор имет может принимать параметр 'inflation'. Это позволяет обфускатуору генерировать определенное количество случайных дополнительных частей имени, в зависимости от значения параметра 'inflation'. Например, имя 'a' с параметром 'inflation' равным 0, может быть сгенерировано как 'fdgjia' с параметром 'inflation' равным 5.
