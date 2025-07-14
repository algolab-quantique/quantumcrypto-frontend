---
title: "DPS Protocol"
description: "Complete guide to DPS quantum key distribution"
protocol: "dps"
language: "en"
version: "1.0"
last_updated: "2025-07-11"
contributors: ["Jean-Fred", "Zubir", "ibra", "..."]
---

<!-- 
NOTE: Image paths use ../../public/images/ for GitHub/VS Code compatibility.
When integrating with Next.js, these should be changed back to /images/ 
as Next.js serves files from the public directory automatically.
-->

# DPS Protocol Content

## About the Protocol
The Differential Phase Shift (DPS) protocol [[1]](#reference-1) is a quantum protocol for establishing encryption keys.

Unlike the BB84 and E91 protocols which encode information in the polarization of photons, the DPS protocol encodes information in the phases of a pulse train.

The protocol begins with Alice sending single photons into a device comprising three paths: A, B and C

<picture>
  <source srcset="../../public/images/alice_wb_fr.png" media="(prefers-color-scheme: light)">
  <source srcset="../../public/images/alice_bb_fr.png" media="(prefers-color-scheme: dark)">
  <img src="../../public/images/alice_bb_fr.png" alt="Alice's device diagram for DPS protocol">
</picture>

In this setup, there is the same length difference between paths A and B as between paths B and C. Thus, a pulse passing through B (C) acquires a delay T compared to a pulse passing through A (B).

Semi-reflecting mirrors ensure that the photon has the same probability of passing through each of the three paths. Once the three paths are recombined, the photon is in a superposition state

$$|\psi_{\text{photon}}\rangle = \frac{1}{\sqrt{3}} (|\psi_A\rangle + |\psi_B\rangle + |\psi_C\rangle),$$

or, equivalently

$$|\psi\rangle = \frac{1}{\sqrt{3}} (|0\rangle + |1\rangle + |2\rangle),$$

with $|0\rangle$ corresponding to the 1st pulse, $|1\rangle$ to the second pulse, and $|2\rangle$ to the last pulse of the train. For each photon sent, Alice randomly chooses 3 bits. If the bit is 1, she applies a π phase shift to the corresponding pulse and does nothing if the bit is 0. For the three pulses there are 8 possible situations, let's see four examples

<table>
  <thead>
    <tr>
      <th style="text-align: center;">bit 2</th>
      <th style="text-align: center;">bit 1</th>
      <th style="text-align: center;">bit 0</th>
      <th style="text-align: center;">pulse 2</th>
      <th style="text-align: center;">pulse 1</th>
      <th style="text-align: center;">pulse 0</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">0</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;">1</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse" style="transform: rotate(180deg);" /></td>
    </tr>
  </tbody>
</table>

<!-- Todo: images in table are only white, need to combine black and white inside svg info file, and the image will handle the preference directly -->

We note that $(-1)^0 = 1$ and $(-1)^1 = -1$, so we can write the photon state using bits $b_0$, $b_1$ and $b_2$ as follows

$$|\psi_{\text{photon}}\rangle = \frac{1}{\sqrt{3}} ((-1)^{b_0}|0\rangle + (-1)^{b_1}|1\rangle + (-1)^{b_2}|2\rangle).$$

The pulse train is then sent to Bob whose device (an interferometer) is as follows

<picture>
  <source srcset="../../public/images/bob_wb_fr.png" media="(prefers-color-scheme: light)">
  <source srcset="../../public/images/bob_bb_fr.png" media="(prefers-color-scheme: dark)">
  <img src="../../public/images/bob_bb_fr.png" alt="Bob's device diagram for DPS protocol">
</picture>



Here again, the length difference between paths D and E is such that the pulse train passing through path E is delayed by time T compared to the train passing through D. We can therefore represent the states of the pulse trains at the input of the last semi-reflecting mirror by the states

$$|\psi_D\rangle = \frac{1}{\sqrt{3}} ((-1)^{b_0}|0\rangle + (-1)^{b_1}|1\rangle + (-1)^{b_2}|2\rangle)$$

$$|\psi_E\rangle = \frac{1}{\sqrt{3}} ((-1)^{b_0}|1\rangle + (-1)^{b_1}|2\rangle + (-1)^{b_2}|3\rangle)$$

Let's take an example with bits b0 = 0, b1 = 0 and b2 = 1. We will then have the following states

<table>
  <thead>
    <tr>
      <th style="text-align: center;"></th>
      <th style="text-align: center;">pulse 3</th>
      <th style="text-align: center;">pulse 2</th>
      <th style="text-align: center;">pulse 1</th>
      <th style="text-align: center;">pulse 0</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;">Path D</td>
      <td style="text-align: center;"></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse (π-shift)" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
    </tr>
    <tr>
      <td style="text-align: center;">Path E</td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Inverted pulse (π-shift)" style="transform: rotate(180deg);" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
      <td style="text-align: center;"><img src="../../public/images/pi_wb.svg" alt="Normal pulse" /></td>
      <td style="text-align: center;"></td>
    </tr>
  </tbody>
</table>

For two incident rays A and B as illustrated in the following figure,


<picture>
  <source srcset="../../public/images/beamsplitter_wb.png" media="(prefers-color-scheme: light)">
  <source srcset="../../public/images/beamsplitter_bb.png" media="(prefers-color-scheme: dark)">
  <img src="../../public/images/beamsplitter_bb.png" alt="Bob's device diagram for DPS protocol">
</picture>


we can describe the Ubs operator associated with the semi-reflecting mirror by the transformation

$$U_{bs} |\psi_{in}\rangle = |\psi_{out}\rangle$$

$$\frac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} a \\ b \end{bmatrix} = \begin{bmatrix} c \\ d \end{bmatrix}$$

where $a$, $b$, $c$ and $d$ represent the amplitudes of states $|A\rangle$, $|B\rangle$, $|C\rangle$ and $|D\rangle$ respectively.

Applying this transformation, we get: $c = \frac{a + b}{\sqrt{2}}$ and $d = \frac{a - b}{\sqrt{2}}$.

<!-- Todo: err: in the webpage there is c = a+b and c=a-b; here I put c and d ?? -->

By taking the states $|\psi_D\rangle$ and $|\psi_E\rangle$ described previously, we can therefore calculate the states that result from the interference of pulses for each time, we obtain the following table:

| Time | D | E | DET0 | DET1 |
|:----:|:-:|:-:|:----:|:----:|
| | $|\psi_{in}\rangle$ | | $|\psi_{out}\rangle$ | |
| T0 | $(-1)^{b_0}$ | 0 | $\frac{1}{\sqrt{2}}(-1)^{b_0}$ | $-\frac{1}{\sqrt{2}}(-1)^{b_0}$ |
| T1 | $\frac{1}{\sqrt{2}}(-1)^{b_1}$ | $\frac{1}{\sqrt{2}}(-1)^{b_0}$ | $\frac{1}{2}((-1)^{b_0} + (-1)^{b_1})$ | $\frac{1}{2}((-1)^{b_0} - (-1)^{b_1})$ |
| T2 | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ | $\frac{1}{\sqrt{2}}(-1)^{b_1}$ | $\frac{1}{2}((-1)^{b_1} + (-1)^{b_2})$ | $\frac{1}{2}((-1)^{b_1} - (-1)^{b_2})$ |
| T3 | 0 | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ | $\frac{1}{\sqrt{2}}(-1)^{b_2}$ |

We note therefore that if a photon is measured at times T0 or T3, it can be detected by detector 0 or detector 1 with a probability of 50% since:

$$\left(\frac{(-1)^{b_0}}{\sqrt{2}}\right)^2 = \left(\frac{-(-1)^{b_0}}{\sqrt{2}}\right)^2 = \left(\frac{(-1)^{b_2}}{\sqrt{2}}\right)^2 = \left(\frac{-(-1)^{b_2}}{\sqrt{2}}\right)^2 = \frac{1}{2}$$

If the photon is measured at times T1 or T2, the values of $b_0$, $b_1$, and $b_2$ determine which detector will be activated. In the DPS protocol, only photons measured at times T1 and T2 are used to establish the key; photons measured at times T0 and T3 are discarded.

Let's take our example with $b_0 = 0$, $b_1 = 0$, $b_2 = 1$. We then have the following probability amplitudes:

$$
\begin{array}{|c|cc|}
\hline
& |\psi_{out}\rangle \\
\hline
\text{Time} & \text{DET0} & \text{DET1} \\
\hline
\text{T1} & 1 & 0 \\
\text{T2} & 0 & -1 \\
\hline
\end{array}
$$

In general, if $b_0 = b_1$ (phase difference of 0) and the photon is detected at time T1, detector 0 is activated and Bob records the bit 0 for his key. Conversely, if $b_0 \neq b_1$ (phase difference of $\pm\pi$) and the photon is detected at time T1, detector 1 is activated and Bob records the bit 1 for his key.

If the photon is instead detected at time T2, then Bob records the bit 0 if $b_1 = b_2$ and the bit 1 otherwise.

Now that we know how Bob can establish the encryption key, he still needs to communicate information to Alice that will allow her to obtain the same key, without the revealed information allowing an external person to deduce this key.

All Bob has to do is to transmit to Alice the detection times of each of the photons. As we have just seen, by knowing the detection time and the value of the bits $b_0$, $b_1$, and $b_2$ (Alice knows these values since she is the one who generated them), Alice can know which detector measured the photon and therefore, Bob's key!

Let's see an example in which Alice received the detection times of 6 photons:

| Photon | $b_2$ | $b_1$ | $b_0$ | Detection time | Key bit |
|:------:|:-----:|:-----:|:-----:|:--------------:|:-------:|
| 1 | 0 | 0 | 1 | T0 | – |
| 2 | 0 | 1 | 1 | T2 | 1 |
| 3 | 0 | 0 | 0 | T1 | 0 |
| 4 | 1 | 0 | 1 | T1 | 1 |
| 5 | 0 | 1 | 1 | T3 | – |
| 6 | 1 | 1 | 0 | T2 | 0 |

Photons 1 and 5 (in gray) are simply discarded because they were detected at times T0 and T3 respectively. Photon 2 was detected at time T2, so it was the pulses modulated by bits b1 and b2 that interfered. Since the phase difference is π between these 2 pulses, Alice records the bit 1 for her key. For photon 3, Bob announced time T1, so it was the pulses modulated by bits b0 and b1 that interfered. Since no phase shift was applied to these pulses, Alice records the bit 0 for her key. You can do the exercise with photons 4 and 6.

## Reference

<a id="reference-1"></a>[1] Inoue K, Waks E, Yamamoto Y. "Differential phase shift quantum key distribution." [*PRL* 89.3 (2002): 037902](https://doi.org/10.1103/PhysRevLett.89.037902).

## How to Play DPS

...

### Alice
...

### Bob
...

