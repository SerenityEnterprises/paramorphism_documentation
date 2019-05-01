# Introductie

Paramorphism is een obfuscator voor de Java Virtual Machine. Tot hedendaags ondersteunt het Java & Kotlin respectief, maar theoretisch gezien zou het elke JVM taal ondersteunen die niet te hevig gebruik maken van reflection of van dynamisch door-naam dispatch.

## Om te beginnen

Als u een Java applicatie hebt gebouwt als een JAR bestand, kan u het JAR bestand geven aan Paramorphism om te gebruiken voor obfuscatie

Paramorphism maakt gebruik vaan een configuratie bestand

```sh
java -jar paramorphism.jar path/to/config
```

Paramorphism ondersteunt twee formaten voor configuraties: YAML en JSON. In deze documentatie zullen wij gebruik maken van YML voor voorbeelden.

Hier is een voorbeeld van een configuratie voor een simpel 'Hello, World!' applicatie:

```yml
input: path/to/my/helloworld.jar
output: path/to/my/obfuscated-helloworld.jar

# We behouden de 'main' class HelloWorld
# zodat de 'Main-Class' in MANIFEST.MF
# niet naar een ongeldige class wijst
remapper:
  mask:
    exclude:
      - com/example/HelloWorld
```

Zoals u kunt zien, gebruiken wij `input` om aan te geven waar het JAR bestand zich bevindt die wij willen obfuscaten, en gebruiken wij `output` om aan te geven waar het geobfuscate bestand geplaatst moet worden. Als `output` niet gespecificeerd is, dan zal de waarde van `input` gelijk zijn aan het originele bestand, maar zal de extentie van het bestand veranderdt worden naar `.obf.jar`.

Verder worden er meerdere configuratie opties aangegeven in het 'Configuratie' deel van deze documentatie.

## Limiet

Het obfusceren van Java in het algemeen kan het programma van verschillende functies weerdhouden.

Bijvoorbeeld: het veranderen van namen kan reflection beïnvloeden namen die direct in het programma zijn geprogrammeerd. 

Bijvoorbeeld: `Class.forName("com.example.HelloWorldPrinterFactory")` kan een `ClassNotFoundException` na obfuscatie geven, omdat de `HelloWorldPrinterFactory` verandert zal worden naar iets zoals `a.a.c`.

Houd het daarom ook a.u.b. voor ogen als u een applicatie ontwikkelt die uiteindelijk geobfuscate zal worden, en test uw applicatie grondig na het obfuscaten.

## Problemen melden

Als u een probleem vind met de obfuscator, dan kunt u deze aangeven op de [GitHub issue tracker.](https://github.com/SerenityEnterprises/paramorphism-issues/)
