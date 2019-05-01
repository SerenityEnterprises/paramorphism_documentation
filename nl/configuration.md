# Configuratie

## Input & Output

`input` geeft aan waar het bestand die geobfuscate moet worden gevonden kan worden, terwijl `output` aangeeft waar het geobfuscate bestand opgeslagen moet worden.

Deze zijn dan relatief aan de applicatie of absoluut, dit hangt af of het bestand start met een absolute pad (zoals `/` op normale OS's, of een schijf letter zoals `C:/` op Windows).

**Voorbeeld:**

```yml
input: pad/naar/applicatie.jar
output: obfuscated-applicatie.jar
```

## Libraries

Er zijn twee manieren om libraries aan te geven met Paramorphism: `libraries` en `maven_libraries`. `libraries` is een simpele lijst met JAR bestanden (of een map met JAR bestanden), terwijl `maven_libraries` aangeeft welke maven-gelijke structuren gebruikt moeten worden. De meest voorkomende gebruik bij `maven_libraries` is de .m2 map in de gebruiker's home.

Om `libraries` te gebruiken, hoeft u simpelweg een lijst van JAR bestanden en/of mappen aangeven die u wilt gebruiken. Net zoals `input` en `output`, zijn deze paden relatief of absoluut.

**Voorbeeld: `libraries`**

```yml
libraries:
  - mijn_library-1.0.jar
  - libs/google/guava.jar
  - libs/eclipse/ # Alle JAR bestanden in de `libs/eclipse/` map
```

Om `maven_libraries` te gebruiken, moet u een basis map aangeven waarin alle bestanden zich bevinden. Deze zijn ook relatief aan het configuratie bestand.

HTTPS ondersteuning wordt geplanned voor maven bestanden in de toekomst.

**Voorbeeld: `maven_libraries`**

```yml
maven_libraries:
  /home/myself/.m2/:
    - "com.google.code.gson:gson:2.8.5"
    - "io.netty:netty-all:4.1.0.Final"

  path/to/another/maven:
    - "com.example:proprietary-library:1.0.0"
```

:::waarschuwing
Om de hernoeming van bestanden goed te laten functioneren, moeten alle libraries 
die worden gebruikt door de applicatie aangegeven worden in de configuratie.
:::

## Element Masking

Een 'element mask' geeft aan welk element er gebruikt of niet gebruikt moet worden tijdens obfuscatie. De globale mask wordt aangegeven met de `mask` optie in het configuratie bestand, en geeft aan welke classes gebruikt mogen worden door de obfuscatie strategieën.

Element masking heeft twee opties, _including_ en _excluding_. Zonder enige aanpassingen worden _alle_ elementen gebruikt. Als een element wordt gedefineerd in de `include` lijst, dan worden alleen **gelijke** elementen gebruikt. Elk ander element dat gelijk is aan een optie in de `exclude` lijst wordt niet gebruikt.

Een voorbeeld van de exclude mask is als classes die niet goed kunnen werken met hevige reflectie, bijvoorbeeld _field name introspection_ wanneer er gebruik wordt gemaakt vaan Java _serializables_ zoals Gson of dergelijke.

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

`include` en `exclude` zijn lijsten van _gelijke principes_. Dit is een simpel concept:

- If the rule ends with `/`, it will match anything starting with the rule. For instance, the rule `path/rule/` matches `path/rule/one`, `path/rule/two`, but not `anything/else/asdf`
- If the rule ends with `*`, it will act as a wildcard. For instance, the rule `wildcard/rule*` matches `wildcard/rule/one`, `wildcard/ruletwothreefour/five`, but not `wildcard/anythingelse`
- Otherwise, the rule matches anything identical to itself.

- Als de regel eindigt met `/`, dan zal het gelijk zijn aan alles met de regel. Bijvoorbeeld de regel `path/rule` zal gelijk zijn aan `path/rule/one` en `path/rule/two` maar niet gelijk aan `antyhing/else/gibberish`
- Als de regel eindigt met `*` dan zal het als een _joker_ gebruikt worden. Bijvoorbeeld de regel `wildcard/rule*` zal gelijk zijn aan `wildcard/rule/one`, `wildcard/ruletwothreefour/five` maar niet gelijk aan `wildcard/ietsanders`
- Anders zal de regel gelijk zijn aan zichzelf

## Flags

Flags zijn simpele toggles die het gedrag van de obfuscator beïnvloeden.

Tot hedendaags zijn de huidige flags geimplementeerd in Paramorphism:

- `corruption`
- `anti_decompression`
- `kotlin`

### Corruption

Met deze flag zullen de meeste analyse programma's niet meer werken, met uitzondering tot analyse programma's die specifiek voor Paramorphism veranderd zijn.

### Anti-Decompression

De 'anti decompression' flag probeert er zeker van te maken dat specifieke classes niet uit het JAR bestand gehaald kunnen worden voor analyse.

### Kotlin

De 'kotlin' flag geeft aan dat de obfuscator specifiek strategieën voor de Kotlin programmeer taal moet gebruiken. Bijvoorbeeld, een Kotlin-specifieke strategie die de debug informatie uit het bestand haalt die specifiek is voor de Kotlin compiler.

Tot hedendaags kan het gebruik van de `kotlin` flag corrupt gedrag veroorzaken die de `kotlin-reflect` library gebruiken. (Neem tot aandacht dat Java reflectie niet aangepast zal worden door deze flag)

## Strategieën

Individuele strategieën kunnen worden geconfigureerd worden in Paramorphism.

Alle strategieën hebben tenminste twee configuratie opties: `enabled` en `mask`

`enabled` geeft aan of de strategie wordt toegepast voor het obfuscatie proces, en is een boolean.
Voor alle strategieën is de standaard waarde van `enabled` true (oftewel aan), maar sommige strategieën worden beschermt door de [configuration flags](#flags).\

`mask` is a local specific mask that defines which classes the obfuscation strategy will be applied to. Please note that exclusions from the global mask cannot be overridden by an inclusion from a local mask.

`mask` is een optie specifiek aan de strategie die ingesteld wordt. Realiseer a.u.b. dat de uitzonderingen in de globale mask _NIET_ overgeschreven kan worden door een lokale mask.

Het gebruik van 'Field Access Indirection' bijvoorbeeld, zetten wij aan en zetten wij uit voor een class die de performance nodig heeft:

```yml
field_access_indirection:
  enabled: true # Hier voor de demonstratie; maar standaard aan
  mask:
    exclude:
      - com/example/project/ASuperPerformanceCriticalClass
```

Paramorphism bezit tot hedendaags deze strategieën:

- `debug_info_scrubbing`
- `kotlin_metadata_scrubbing`
- `kotlin_intrinsics_concealment`
- `remapper`
- `method_call_indirection`
- `field_access_indirection`
- `string_indirection`

Naarmate er meer strategieën beschrikbaar worden, is het mogelijk dat deze strategieën hun eigen configuratie kunnen krijgen.

## Name Generation

De naam generator is veel gebruikt in de obfuscator, maar voornamelijk door de remapper. De naam generator opereert op vier type elementen: Packages, classes, fields en methods.

Er zijn drie verschillende naam generatie opties: Dictionaries, prefixes en suffixes.

Een optie kan geconfigureerd worden om alleen op bepaalde elementen te werken:

```yml
name_generation:
  [optie]:
    all: ...
    packages: ...
    classes: ...
    # fields: ... # Since fields is omitted, its value defaults to the value of 'all'
    methods: ...
```

### Dictionaries

De verschillende 'Dictionaries' zijn ruw vertaald woordenboeken waaruit Paramorphism verschillende namen kan halen voor Packages, classes, fields en methods.

Er zijn tot hedendaags vier verschillende 'Dictionaries' in Paramorphism:

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

Prefixes zijn constante strings die worden toegepast aan het begin van elk gegenereerd naam:

```yml
name_generation:
  prefixes:
    classes: MyProjectClass
```

### Suffixes

Suffixes zijn constante strings die worden toegevoegd aan het einde van elk gegenereerd naam:

```yml
name_generation:
  suffixes:
    fields: "[]"
```

### Inflation

In toevoeging, kan de naam generator een 'inflation' optie aannemen. Deze genereerd een bepaalde hoeveelheid extra secties afhankelijk van de waarde die worden toegevoegd aan de namen. Bijvoorbeeld, de naam 'a' met inflation 0 kan 'fdgjia' worden met inflatie 5.
