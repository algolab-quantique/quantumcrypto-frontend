---
title: "Protocolo DPS"
description: "Guía completa del protocolo de distribución cuántica de claves DPS"
protocol: "dps"
language: "es"
version: "1.0"
last_updated: "2025-07-11"
contributors: ["Jean-Fred", "Zubir", "ibra", "..."]
---

<!-- 
NOTE: Image paths use ../../public/images/ for GitHub/VS Code compatibility.
When integrating with Next.js, these should be changed back to /images/ 
as Next.js serves files from the public directory automatically.
-->

# Contenido del Protocolo DPS

## Acerca del protocolo
El protocolo de desplazamiento de fase diferencial (DPS) [[1]](#reference-1) es un protocolo cuántico para establecer claves de cifrado.

A diferencia de los protocolos [BB84](bb84.md) y [E91](e91.md) que codifican la información en la [polarización](definitions.md#polarizaciones) de los [fotones](definitions.md#fotón), el protocolo DPS codifica la información en la [fase](definitions.md#fase) de un [tren de impulsos](definitions.md#tren-de-impulsos).

El protocolo comienza con Alice enviando fotones individuales a un dispositivo que comprende tres caminos: A, B y C.

<picture>
  <source srcset="../../public/images/alice_wb_fr.png" media="(prefers-color-scheme: light)">
  <source srcset="../../public/images/alice_bb_fr.png" media="(prefers-color-scheme: dark)">
  <img src="../../public/images/alice_bb_fr.png" alt="Esquema del dispositivo de Alice para el protocolo DPS">
</picture>

En esta configuración, existe la misma diferencia de longitud entre los caminos A y B que entre los caminos B y C. Así, un [impulso](definitions.md#impulso) que pasa por B (o C) adquiere un retraso T respecto a un impulso que pasa por A (o B).

Los [espejos semirreflectantes](definitions.md#espejo-semirreflectante) aseguran que el fotón tenga la misma probabilidad de tomar cualquiera de los tres caminos. Una vez que los tres caminos se recombinan, el fotón está en un [estado de superposición](definitions.md#estado-de-superposicion)

$$|\psi_{\text{fotón}}\rangle = \frac{1}{\sqrt{3}} (|\psi_A\rangle + |\psi_B\rangle + |\psi_C\rangle),$$

o, equivalentemente

$$|\psi\rangle = \frac{1}{\sqrt{3}} (|0\rangle + |1\rangle + |2\rangle),$$

con $|0\rangle$ correspondiente al 1er pulso, $|1\rangle$ al segundo pulso, y $|2\rangle$ al último pulso del tren. Para cada fotón enviado, Alice elige 3 bits de forma aleatoria. Si el bit es 1, aplica un [desfase](definitions.md#desfase) de π al impulso correspondiente y no hace nada si el bit es 0. Para los tres pulsos hay 8 situaciones posibles, veamos cuatro ejemplos:

<table>
  <thead>
    <tr>
      <th style="text-align: center;">bit 2</th>
      <th style="text-align: center;">bit 1</th>
      <th style="text-align: center;">bit 0</th>
      <th style="text-align: center;">pulso 2</th>
      <th style="text-align: center;">pulso 1</th>
      <th style="text-align: center;">pulso 0</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido" style="transform: rotate(180deg);" /></td>
    </tr>
  </tbody>
</table>

<!-- Todo: las imágenes en la tabla son solo blancas, necesitan combinar blanco y negro dentro del archivo svg, y la imagen manejará la preferencia directamente -->

Notamos que $(-1)^0 = 1$ y $(-1)^1 = -1$, por lo que podemos escribir el estado del fotón usando los bits $b_0$, $b_1$ y $b_2$ de la siguiente manera:

$$|\psi_{\text{fotón}}\rangle = \frac{1}{\sqrt{3}} ((-1)^{b_0}|0\rangle + (-1)^{b_1}|1\rangle + (-1)^{b_2}|2\rangle).$$

El tren de pulsos se envía a Bob, cuyo dispositivo (un [interferómetro](definitions.md#interferometro)) es el siguiente:

<picture>
  <source srcset="../../public/images/bob_wb_fr.png" media="(prefers-color-scheme: light)">
  <source srcset="../../public/images/bob_bb_fr.png" media="(prefers-color-scheme: dark)">
  <img src="../../public/images/bob_bb_fr.png" alt="Esquema del dispositivo de Bob para el protocolo DPS">
</picture>



Aquí nuevamente, la diferencia de longitud entre los caminos D y E es tal que el tren de pulsos que pasa por el camino E se retrasa un tiempo T en comparación con el tren que pasa por D. Por lo tanto, podemos representar los estados de los trenes de pulsos en la entrada del último espejo semirreflectante por los estados:

$$|\psi_D\rangle = \frac{1}{\sqrt{3}} ((-1)^{b_0}|0\rangle + (-1)^{b_1}|1\rangle + (-1)^{b_2}|2\rangle)$$

$$|\psi_E\rangle = \frac{1}{\sqrt{3}} ((-1)^{b_0}|1\rangle + (-1)^{b_1}|2\rangle + (-1)^{b_2}|3\rangle)$$

Tomemos un ejemplo con los bits b0 = 0, b1 = 0 y b2 = 1. Tendremos entonces los siguientes estados:

<table>
  <thead>
    <tr>
      <th style="text-align: center;"></th>
      <th style="text-align: center;">pulso 3</th>
      <th style="text-align: center;">pulso 2</th>
      <th style="text-align: center;">pulso 1</th>
      <th style="text-align: center;">pulso 0</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;">Camino D</td>
      <td style="text-align: center;"></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido (desfase π)" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">Camino E</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso invertido (desfase π)" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Pulso normal" /></td>
      <td style="text-align: center;"></td>
    </tr>
  </tbody>
</table>

Para dos rayos incidentes A y B como se ilustra en la siguiente figura,


<picture>
  <source srcset="../../public/images/beamsplitter_wb.png" media="(prefers-color-scheme: light)">
  <source srcset="../../public/images/beamsplitter_bb.png" media="(prefers-color-scheme: dark)">
  <img src="../../public/images/beamsplitter_bb.png" alt="Esquema del dispositivo de Bob para el protocolo DPS">
</picture>


podemos describir el [operador unitario $U_{bs}$](definitions.md#operador-unitario) asociado al espejo semirreflectante mediante la transformación

$$U_{bs} |\psi_{in}\rangle = |\psi_{out}\rangle$$

$$\frac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} a \\ b \end{bmatrix} = \begin{bmatrix} c \\ d \end{bmatrix}$$

donde $a$, $b$, $c$ y $d$ representan las amplitudes de los estados $|A\rangle$, $|B\rangle$, $|C\rangle$ y $|D\rangle$ respectivamente.

Aplicando esta transformación, obtenemos: $c = \frac{a + b}{\sqrt{2}}$ y $d = \frac{a - b}{\sqrt{2}}$.

<!-- Todo: err: en la página web hay c = a+b y c=a-b; yo aquí he puesto c y d ?? -->

Tomando los estados $|\psi_D\rangle$ y $|\psi_E\rangle$ descritos anteriormente, podemos calcular los estados que resultan de la interferencia de los pulsos para cada tiempo. Obtenemos la siguiente tabla de amplitudes de probabilidad:

| Tiempo | D | E | DET0 | DET1 |
|:-----:|:-:|:-:|:----:|:----:|
| | $|\psi_{in}\rangle$ | | $|\psi_{out}\rangle$ | |
| T0 | $(-1)^{b_0}$ | 0 | $\frac{1}{\sqrt{2}}(-1)^{b_0}$ | $-\frac{1}{\sqrt{2}}(-1)^{b_0}$ |
| T1 | $\frac{1}{\sqrt{2}}(-1)^{b_1}$ | $\frac{1}{\sqrt{2}}(-1)^{b_0}$ | $\frac{1}{2}((-1)^{b_0} + (-1)^{b_1})$ | $\frac{1}{2}((-1)^{b_0} - (-1)^{b_1})$ |
| T2 | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ | $\frac{1}{\sqrt{2}}(-1)^{b_1}$ | $\frac{1}{2}((-1)^{b_1} + (-1)^{b_2})$ | $\frac{1}{2}((-1)^{b_1} - (-1)^{b_2})$ |
| T3 | 0 | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ |

Notamos que si un fotón se mide en los tiempos T0 o T3, puede ser detectado por el detector 0 o el detector 1 con una probabilidad del 50%, ya que:

$$\left(\frac{(-1)^{b_0}}{\sqrt{2}}\right)^2 = \left(\frac{-(-1)^{b_0}}{\sqrt{2}}\right)^2 = \left(\frac{(-1)^{b_2}}{\sqrt{2}}\right)^2 = \left(\frac{-(-1)^{b_2}}{\sqrt{2}}\right)^2 = \frac{1}{2}$$

Si el fotón se mide en los tiempos T1 o T2, los valores de $b_0$, $b_1$ y $b_2$ determinan el detector que se activará. En el protocolo DPS, solo los fotones medidos en los tiempos T1 y T2 se utilizan para establecer la clave; los fotones medidos en los tiempos T0 y T3 se descartan.

Retomemos nuestro ejemplo con $b_0 = 0$, $b_1 = 0$, $b_2 = 1$. Tenemos entonces las siguientes amplitudes de probabilidad:

$$
\begin{array}{|c|cc|}
\hline
& |\psi_{out}\rangle \\
\hline
\text{Tiempo} & \text{DET0} & \text{DET1} \\
\hline
\text{T1} & 1 & 0 \\
\text{T2} & 0 & -1 \\
\hline
\end{array}
$$

De forma general, si $b_0 = b_1$ (diferencia de fase de 0) y el fotón se detecta en el tiempo T1, el detector 0 se activa y Bob registra el bit 0 para su clave. A la inversa, si $b_0 \neq b_1$ (diferencia de fase de $\pm\pi$) y el fotón se detecta en el tiempo T1, el detector 1 se activa y Bob registra el bit 1 para su clave.

Si el fotón se detecta en el tiempo T2, entonces Bob registra el bit 0 si $b_1 = b_2$ y el bit 1 en caso contrario.

Ahora que sabemos cómo Bob puede establecer la clave de cifrado, le queda comunicar a Alice información que le permitirá a esta última obtener la misma clave, sin que la información revelada permita a una persona externa deducir esta clave.

Todo lo que Bob tiene que hacer es transmitir a Alice los tiempos de detección de cada uno de los fotones. Como acabamos de ver, conociendo el tiempo de detección y los valores de los bits $b_0$, $b_1$ y $b_2$ (Alice conoce estos valores ya que es ella quien los generó), ¡Alice puede saber qué detector midió el fotón y, por lo tanto, la clave de Bob!

Veamos un ejemplo en el que Alice ha recibido los tiempos de detección de 6 fotones:

| Fotón | $b_2$ | $b_1$ | $b_0$ | Tiempo de detección | Bit de clave |
|:------:|:-----:|:-----:|:-----:|:------------------:|:----------:|
| 1 | 0 | 0 | 1 | T0 | – |
| 2 | 0 | 1 | 1 | T2 | 1 |
| 3 | 0 | 0 | 0 | T1 | 0 |
| 4 | 1 | 0 | 1 | T1 | 1 |
| 5 | 0 | 1 | 1 | T3 | – |
| 6 | 1 | 1 | 0 | T2 | 0 |

Los fotones 1 y 5 (en gris) simplemente se descartan porque fueron detectados en los tiempos T0 y T3 respectivamente. El fotón 2 fue detectado en el tiempo T2, por lo que son los pulsos modulados por los bits b1 y b2 los que interfirieron. Dado que la diferencia de fase es de π entre estos 2 pulsos, Alice registra el bit 1 para su clave. Para el fotón 3, Bob anunció el tiempo T1, por lo que son los pulsos modulados por los bits b0 y b1 los que interfirieron. Dado que no se aplicó ningún desfase a estos pulsos, Alice registra el bit 0 para su clave. Puede hacer el ejercicio con los fotones 4 y 6.

## Referencia

<a id="reference-1"></a>[1] Inoue K, Waks E, Yamamoto Y. "Differential phase shift quantum key distribution." [*PRL* 89.3 (2002): 037902](https://doi.org/10.1103/PhysRevLett.89.037902).


## Cómo jugar a DPS

El protocolo DPS implica dos actores principales: Alice y Bob, que desempeñan roles diferentes. Aquí puedes explorar los pasos que cada uno debe seguir para llevar a cabo el protocolo correctamente.

### Alice

1. **Para cada fotón que vas a enviar, genera una secuencia aleatoria de 3 bits** (b₀, b₁, b₂). Estos bits se usarán para codificar la información como una fase en el tren de pulsos asociado a ese fotón.

2. **Prepara el tren de pulsos**: aplica un desfase de π a los pulsos cuyo bit sea 1, y deja sin cambios aquellos cuyo bit sea 0.

3. **Envía el fotón** a Bob mediante tu dispositivo de tres trayectorias, que crea automáticamente el tren de pulsos en superposición cuántica preparado en el paso 2.

4. **Espera la respuesta de Bob**: él te comunicará el tiempo de detección de cada fotón (T0, T1, T2 o T3).

5. **Construye tu clave**:
   - Ignora los fotones detectados en T0 y T3.
   - Para T1: si b₀ = b₁, el bit de la clave es 0; si no, el bit es 1.
   - Para T2: si b₁ = b₂, el bit de la clave es 0; si no, el bit es 1.

6. **Cifra y envía tu mensaje** a Bob usando la clave obtenida.

---

### Bob

1. **Recibe cada fotón** y mídelo con tu interferómetro.

2. **Anota el tiempo de detección** (T0, T1, T2 o T3) y qué detector (DET0 o DET1) fue activado.

3. **Comunica públicamente** a Alice los tiempos de detección de cada fotón (pero mantén en secreto los resultados de los detectores).

4. **Construye tu clave de cifrado usando únicamente las mediciones en los tiempos T1 y T2**:
   - DET0 activado = bit 0
   - DET1 activado = bit 1

5. **Descifra el mensaje de Alice** usando tu clave.

---
