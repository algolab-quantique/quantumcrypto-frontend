---
title: "Glosario de Definiciones"
description: "Diccionario de conceptos clave en criptografía cuántica (BB84, E91, DPS, etc.)"
type: "glossary"
language: "es"
version: "1.0"
last_updated: "2025-07-10"
contributors: ["Jean-Fred", "ibra"]
---

# Glosario de Definiciones

## Clave de Cifrado
Una clave de cifrado es una información secreta, normalmente una secuencia de bits (0 y 1), compartida solo entre dos partes (como Alicia y Bob). Permite, mediante un algoritmo criptográfico, transformar un mensaje legible (texto plano) en un mensaje cifrado (ilegible para otros), y luego descifrarlo. A diferencia de una contraseña, la clave no está destinada a ser memorizada por una persona, sino a ser utilizada por un programa informático. El objetivo de protocolos como E91 o BB84 es generar y compartir esta clave de forma perfectamente segura, para que solo Alicia y Bob puedan usarla para proteger sus comunicaciones.

## Canal Público (y Privado)
Un canal público es un medio de comunicación (como Internet, una fibra óptica o una línea telefónica) donde cualquiera puede potencialmente interceptar o escuchar los mensajes intercambiados—como hablar en voz alta en una sala llena de gente. Por el contrario, un canal privado garantiza que solo las partes previstas puedan acceder a la comunicación, como una conversación en voz baja aparte. En la práctica, es difícil garantizar la confidencialidad de un canal: por eso se utiliza la criptografía para hacer incomprensibles los mensajes en un canal público. En los protocolos de criptografía cuántica (BB84, E91, DPS, etc.), la seguridad se basa en la física cuántica, no en la confidencialidad del canal.

## Fotón
A menudo se dice que todo en el universo está hecho de partículas, incluso la luz. Las partículas que componen la luz se llaman fotones: son los “granos” fundamentales de la energía luminosa. En los protocolos de criptografía cuántica (como BB84, E91, etc.), los fotones se utilizan para transportar información entre dos partes. Su propiedad de [polarización](#polarisations) permite codificar bits (0 o 1), mientras que su naturaleza cuántica garantiza la seguridad de la transmisión: cualquier intento de interceptación altera el estado del fotón y puede ser detectado.

## Polarizaciones
La polarización describe la orientación en la que una onda de luz (como un fotón) oscila. Imagina una cuerda vibrando: puede vibrar verticalmente (↕), horizontalmente (↔) o diagonalmente (⤢). Para un fotón, la polarización es una propiedad cuántica fundamental que se mide para obtener resultados de +1 o -1.

## Entrelazamiento Máximo
Se dice que dos partículas (o qubits) están “entrelazadas” cuando comparten un estado cuántico común: los resultados de sus mediciones están correlacionados de tal manera que es imposible describirlas por separado, incluso a distancia. El “entrelazamiento máximo” se refiere a la correlación más fuerte posible entre los resultados de las mediciones, lo que significa que los resultados están perfectamente correlacionados o anti-correlacionados según la base elegida (medir una revela inmediatamente el resultado de la otra).

Matemáticamente, un estado entrelazado máximo se escribe como una superposición donde cada resultado posible tiene la misma probabilidad: por ejemplo, para dos qubits, el estado $\left|\Phi^+\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$ significa que las dos partículas son siempre idénticas (00 o 11), cada una con una probabilidad de 1/2. La “amplitud” $1/\sqrt{2}$ asegura esta probabilidad igual.

También existen estados entrelazados no máximos, donde las amplitudes no son iguales (por ejemplo, $\alpha|00\rangle + \beta|11\rangle$ con $|\alpha|^2 \neq |\beta|^2$). En este caso, las correlaciones son más débiles y el estado es menos útil para la criptografía cuántica.

El entrelazamiento máximo es esencial para garantizar la seguridad de los protocolos cuánticos: cualquier intento de interceptación altera estas correlaciones perfectas y puede ser detectado.

## Base de Medición
Una base de medición es un conjunto de orientaciones de referencia utilizadas para medir una propiedad cuántica, como la polarización de un fotón o el estado de un qubit. Es como elegir el ángulo de tu “filtro polarizador”. El resultado de la medición (por ejemplo, $+1$ o $-1$, o 0 o 1) depende de la base elegida. En protocolos como BB84 o E91, Alicia y Bob eligen aleatoriamente sus bases (denotadas $a$, $b$, $a'$, $b'$, etc.).

## Mediciones en la Misma Base
Se dice que las mediciones se realizan en la misma base cuando, para un par de partículas, Alicia y Bob han elegido aleatoriamente la misma orientación para sus dispositivos de medición (por ejemplo, ambos usaron la base $b$). Solo en este caso sus resultados están perfectamente correlacionados (o anti-correlacionados según el estado) y pueden usarse para construir la clave secreta de cifrado.


## Correlación E(a, b)
La correlación $E(a, b)$ mide el vínculo estadístico entre los resultados de medición de dos qubits entrelazados, cada uno medido en una base diferente (orientación): $a$ para el primero, $b$ para el segundo. Se calcula como el promedio de los productos de los resultados obtenidos (por ejemplo, $+1$ o $-1$), sobre un gran número de pares. Una correlación de $+1$ significa que los resultados son siempre idénticos, $-1$ significa que siempre son opuestos, y $0$ significa que no hay vínculo.

En la práctica, también se puede calcular como:
$E(a, b) = \dfrac{N_{00} + N_{11} - N_{01} - N_{10}}{N_{00} + N_{11} + N_{01} + N_{10}}$
donde $N_{ij}$ es el número de veces que el primer qubit da $i$ y el segundo da $j$.

## Pares de Bell
Los pares de Bell son pares de qubits (partículas cuánticas, como fotones) preparados en uno de los cuatro estados de [entrelazamiento cuántico máximo](#entrelazamiento-máximo), llamados estados de Bell. Estos estados muestran correlaciones perfectas, imposibles de reproducir con la física clásica, y son fundamentales para muchos protocolos de criptografía cuántica. Los cuatro estados de Bell son:

- $\left|\Phi^+\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$
- $\left|\Phi^-\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle - |11\rangle)$
- $\left|\Psi^+\right\rangle = \frac{1}{\sqrt{2}} (|01\rangle + |10\rangle)$
- $\left|\Psi^-\right\rangle = \frac{1}{\sqrt{2}} (|01\rangle - |10\rangle)$

Llevan el nombre del físico John Stewart Bell. En protocolos como E91, estos pares aseguran la seguridad mediante el entrelazamiento máximo: cualquier intento de interceptación altera las correlaciones y puede ser detectado.

## Desigualdades de Bell
Las desigualdades de Bell son un conjunto de relaciones matemáticas que siempre deben cumplirse si la naturaleza obedece las leyes de la física clásica y la idea de variables ocultas locales (es decir, los resultados de las mediciones están predeterminados y ninguna información viaja más rápido que la luz). Sin embargo, la mecánica cuántica predice—y los experimentos confirman—que ciertos sistemas entrelazados, como los [pares de Bell](#pares-de-bell), pueden violar estas desigualdades: muestran correlaciones imposibles de explicar por una teoría clásica. Probar la violación de las desigualdades de Bell demuestra así la existencia del entrelazamiento cuántico y descarta cualquier explicación por variables ocultas locales.

## La Desigualdad CHSH
La desigualdad CHSH (Clauser, Horne, Shimony, Holt) es una versión específica y experimentalmente comprobable de las [desigualdades de Bell](#desigualdades-de-bell). Se aplica a mediciones sobre dos qubits entrelazados, cada uno medido en dos bases diferentes. Según la física clásica, el valor del parámetro $S$ calculado a partir de las correlaciones medidas no puede superar 2. Sin embargo, la mecánica cuántica permite un valor máximo de $2\sqrt{2}$, demostrando así la presencia de entrelazamiento y la ausencia de variables ocultas locales. En el protocolo E91, verificar esta desigualdad garantiza la seguridad de la clave generada.

### Interpretación del Valor S
En el protocolo E91, el valor $S$ calculado a partir de las mediciones debe superar 2 para probar el origen cuántico y seguro de la clave. Si $S \leq 2$, los resultados son compatibles con la física clásica: esto significa que el entrelazamiento se ha roto, probablemente por un intento de espionaje. La clave entonces no es segura y debe ser descartada.

#### Importancia del Número de Muestras
Los resultados del protocolo (como el valor S) se basan en probabilidades y promedios. Para obtener un valor fiable que refleje la realidad, se requiere un número muy grande de mediciones (muestras). Con pocas mediciones, el azar puede distorsionar el resultado y llevar a una conclusión incorrecta sobre la seguridad de la clave.


<!-- 
Todo: Need review and verify the definitions provided below. Please check whether these definitions are general to quantum cryptography or specifically related to the BB84 protocol.
-->

## Codificación de un bit en un fotón
La codificación de un bit en un fotón se refiere a cómo se utiliza la polarización de los fotones para representar bits (0 o 1). La polarización es una propiedad de los fotones que describe la dirección en la que oscila su campo eléctrico. En el protocolo BB84, esta polarización se usa para codificar bits eligiendo entre dos bases: la base + y la base x. En la base +, un fotón polarizado horizontalmente (↔) representa el bit 0, mientras que un fotón polarizado verticalmente (↕) representa el bit 1. En la base x, un fotón polarizado diagonalmente (⤢) representa el bit 0, y un fotón polarizado en la dirección diagonal opuesta (⤡) representa el bit 1. Alice codifica cada bit de esta manera antes de enviarlo a Bob.

<!-- TODO err: there is an error in the website for that it writen orthogonal (en) -->
## Base ortogonal
En un plano cartesiano bidimensional, una base es un conjunto de dos vectores, v0 y v1​, que pueden representar cualquier vector en el plano como una combinación lineal de v0​ y v1​. Cuando v0​ y v1​ forman un ángulo de 90°, son ortogonales y crean una base ortogonal. Una base natural consiste en un vector alineado con el eje x y otro alineado con el eje y, conocida como la base + en el protocolo BB84. Al rotar los vectores de la base + a 45°, se obtiene la base x. Asociando los bits 0 y 1 con los vectores ortogonales de una base, Bob siempre mide el valor codificado por Alice cuando usan la misma base. Esto es una consecuencia del uso de una base ortogonal y de la regla de Born, que establece que la probabilidad de un resultado de medición corresponde al cuadrado de la componente del vector de polarización en esa base. Si las bases de Alice y Bob no coinciden, el vector de polarización del fotón enviado por Alice se expresa como una combinación lineal de los vectores de la base de medición de Bob. El resultado de la medición será entonces aleatorio.


## Canal clásico vs canal cuántico
Un canal clásico está diseñado para transmitir información clásica, como mensajes binarios o textuales. Transmitir información cuántica a través de un canal clásico presenta grandes desafíos de rendimiento debido al ruido introducido por la información clásica. En cambio, un canal cuántico está diseñado para transmitir información cuántica, como el estado de un fotón. Este canal conserva las propiedades cuánticas de la información, asegurando una alta probabilidad de que la información correcta se reciba intacta al otro lado.


## Detección de la presencia de Eve
Consideremos solo los fotones para los que Alice y Bob usaron la misma base, ya que estos fotones se utilizan para establecer la clave. Para obtener información sobre la clave, Eve debe elegir una base para medir los fotones que intercepta. Para un fotón dado, supongamos que Alice y Bob usan la base +. Si Eve, por casualidad, también elige la base +, medirá el valor correcto y retransmitirá el bit en un fotón con la misma polarización. En este caso, la presencia de Eve no se puede detectar. Sin embargo, si Eve mide en la base x, lo cual tiene un 50% de probabilidad de ocurrir, Eve transmitirá a Bob un fotón polarizado en una superposición de estados con respecto a la base +. El resultado de la medición de Bob será entonces probabilístico, introduciendo errores que Alice y Bob pueden usar para detectar la presencia de Eve.


## Perturbación del estado por la medición
A menudo se dice que un sistema cuántico puede estar "en dos estados a la vez", es decir, en una superposición de estados. Esto significa que al medir el sistema, no se puede predecir cuál será el resultado, pero se conoce la probabilidad de cada posible resultado. Una vez que se realiza una medición, la superposición se destruye y el sistema colapsa al estado medido. Una nueva medición dará el mismo resultado.
