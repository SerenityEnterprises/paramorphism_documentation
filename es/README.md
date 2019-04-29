# Introducción

'Paramorphism' (*paramorfismo*) es un obfuscador para programas que se ejecutan en la JVM. En la actualidad, es principalmente compatible con Java y Kotlin, pero en teoría sea compatible con cualquier lenguaje JVM que no dependa demasiado de la reflexión o del envío dinámico por nombre.

## Empezar

Una vez que una aplicación Java se construye como un archivo JAR, se puede disponer a Paramorphism el archivo para usarlo por obfuscación.

Se ejecuta Paramorphism con una archivo de configuración:

```sh
java -jar paramorphism.jar mi/archivo/de/config
```

Paramorphism supporta dos formatos de configuración: YAML y JSON. Este documento va usar YML en sus especimenes.

Aquí hay un ejemplo para un applicacion "Hello World" basico:

```yml
input: programas/mi/helloworld.jar # Suministrar el archivo a Paramorphism
output: programas/mi/helloworld-obfuscada.jar

# Aquí se excluye el archivo class HelloWorld de ser renombrado
# para que el atributo 'Main-Class' en MANIFEST.MF no lleve a
# un nombre inválido
remapper:
  mask:
    exclude:
      - com/example/HelloWorld
```

Se usa `input` para especificar la ruta al archivo que se quiere obfuscar. Se usa `output` para especificar la ruta del archivo de destino. Si `output` no está especificado, su valor es el de `input` con `.jar` transformado en `.obf.jar`.

Otros parámetros de configuración son especificado en el sección 'Configuración' de este documento.

## Limitaciones

El obfuscation de Java en general puede inhibir cierta funcionidad en una programa.
