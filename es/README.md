# Introducción

'Paramorphism' (*paramorfismo*) es un obfuscador para programas que se ejecutan en la JVM. En la actualidad, es principalmente compatible con Java y Kotlin, pero en teoría es compatible con cualquier lenguaje JVM que no dependa demasiado de Reflections o del envío dinámico por nombre.

## Empezar

Una vez que una aplicación Java se construye como un archivo JAR, se puede disponer a Paramorphism para que el archivo sea usado para obfuscación.

Para ejecutar Paramorphism con un archivo de configuración:

```sh
java -jar paramorphism.jar mi/archivo/de/config
```

Paramorphism soporta dos formatos de configuración: YAML y JSON. Usaremos YAML en este ejemplo.

Aquí hay un ejemplo para un aplicación "Hello World" basica:

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

Otros parámetros de configuración son especificados en la sección 'Configuración' de este documento.

## Limitaciones

La obfuscación de Java en general puede inhibir cierta funcionalidad en un programa.

Por ejemplo, la reasignación de nombres (remapping) puede romper el uso de Reflection en casos en los que busque nombre de elementos.

Algo como `Class.forName("com.example.HelloWorldPrinterFactory")` puede devolver `ClassNotFoundException` despues de la obfuscación, dado a que `HelloWorldPrinterFactory` seria llamado algo como `a.a.c`.

Por favor ten en cuenta esto cuando desarrollas un programa que eventualmente va a ser obfuscado, y que va a ser probado despues de estar obfuscado

## Reportar problemas
Si encuentras algun problema con el obfuscador, por favor reportalo en el [GitHub issue tracker.](https://github.com/SerenityEnterprises/paramorphism-issues/)
