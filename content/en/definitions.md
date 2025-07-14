---
title: "Glossary of Definitions"
description: "Dictionary of key concepts in quantum cryptography (BB84, E91, DPS, etc.)"
type: "glossary"
language: "en"
version: "1.0"
last_updated: "2025-07-10"
contributors: ["Jean-Fred", "ibra"]
---

# Glossary of Definitions

## Encryption Key
An encryption key is a secret piece of information, usually a sequence of bits (0s and 1s), shared only between two parties (such as Alice and Bob). It allows, through a cryptographic algorithm, to transform a readable message (plaintext) into an encrypted message (unreadable to others), and then to decrypt it. Unlike a password, the key is not meant to be memorized by a human, but to be used by a computer program. The goal of protocols like E91 or BB84 is to generate and share this key in a perfectly secure way, so that only Alice and Bob can use it to protect their communications.

## Public (and Private) Channel
A public channel is a means of communication (such as the Internet, an optical fiber, or a telephone line) where anyone can potentially intercept or listen to the exchanged messages—like speaking out loud in a crowded room. Conversely, a private channel ensures that only the intended parties can access the communication, like a quiet conversation aside. In practice, it is difficult to guarantee the confidentiality of a channel: this is why cryptography is used to make messages incomprehensible over a public channel. In quantum cryptography protocols (BB84, E91, DPS, etc.), security relies on quantum physics, not on the confidentiality of the channel.

## Photon
It is often said that everything in the universe is made of particles, even light. The particles that make up light are called photons: they are the fundamental “grains” of light energy. In quantum cryptography protocols (such as BB84, E91, etc.), photons are used to carry information between two parties. Their [polarization](#polarisations) property allows encoding bits (0 or 1), while their quantum nature guarantees the security of the transmission: any attempt at interception alters the state of the photon and can be detected.

## Polarizations
Polarization describes the orientation in which a light wave (such as a photon) oscillates. Imagine a vibrating string: it can vibrate vertically (↕), horizontally (↔), or diagonally (⤢). For a photon, polarization is a fundamental quantum property that is measured to obtain results of +1 or -1.

## Maximally Entangled
Two particles (or qubits) are said to be "entangled" when they share a common quantum state: their measurement results are correlated in such a way that it is impossible to describe them separately, even at a distance. "Maximal entanglement" refers to the strongest possible correlation between measurement results, meaning the results are perfectly correlated or anti-correlated depending on the chosen basis (measuring one immediately reveals the result of the other).

Mathematically, a maximally entangled state is written as a superposition where each possible outcome has the same probability: for example, for two qubits, the state $\left|\Phi^+\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$ means the two particles are always identical (00 or 11), each with a probability of 1/2. The “amplitude” $1/\sqrt{2}$ ensures this equal probability.

There are also non-maximally entangled states, where the amplitudes are not equal (for example, $\alpha|00\rangle + \beta|11\rangle$ with $|\alpha|^2 \neq |\beta|^2$). In this case, the correlations are weaker and the state is less useful for quantum cryptography.

Maximal entanglement is essential to guarantee the security of quantum protocols: any attempt at interception alters these perfect correlations and can be detected.

## Measurement Basis
A measurement basis is a set of reference orientations used to measure a quantum property, such as the polarization of a photon or the state of a qubit. It is like choosing the angle of your “polarizing filter.” The measurement result (for example, $+1$ or $-1$, or 0 or 1) depends on the chosen basis. In protocols like BB84 or E91, Alice and Bob randomly choose their bases (denoted $a$, $b$, $a'$, $b'$, etc.).

## Measurements in the Same Basis
Measurements are said to be performed in the same basis when, for a given pair of particles, Alice and Bob have randomly chosen the same orientation for their measurement devices (for example, both used basis $b$). Only in this case are their results perfectly correlated (or anti-correlated depending on the state) and can be used to build the secret encryption key.

## Correlation $E(a, b)$
The correlation $E(a, b)$ measures the statistical link between the measurement results of two entangled qubits, each measured in a different basis (orientation): $a$ for the first, $b$ for the second. It is calculated as the average of the products of the obtained results (for example, $+1$ or $-1$), over a large number of pairs. A correlation of $+1$ means the results are always identical, $-1$ means they are always opposite, and $0$ means there is no link.

In practice, it can also be calculated as:
$E(a, b) = \dfrac{N_{00} + N_{11} - N_{01} - N_{10}}{N_{00} + N_{11} + N_{01} + N_{10}}$
where $N_{ij}$ is the number of times the first qubit gives $i$ and the second gives $j$.

## Bell Pairs
Bell pairs are pairs of qubits (quantum particles, such as photons) prepared in one of the four states of [maximal quantum entanglement](#maximally-entangled), called Bell states. These states exhibit perfect correlations, impossible to reproduce with classical physics, and are fundamental to many quantum cryptography protocols. The four Bell states are:

- $\left|\Phi^+\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$
- $\left|\Phi^-\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle - |11\rangle)$
- $\left|\Psi^+\right\rangle = \frac{1}{\sqrt{2}} (|01\rangle + |10\rangle)$
- $\left|\Psi^-\right\rangle = \frac{1}{\sqrt{2}} (|01\rangle - |10\rangle)$

They are named after physicist John Stewart Bell. In protocols like E91, these pairs ensure security through maximal entanglement: any attempt at interception alters the correlations and can be detected.

## Bell Inequalities
Bell inequalities are a set of mathematical relations that must always be satisfied if nature obeys the laws of classical physics and the idea of local hidden variables (meaning measurement results are predetermined and no information travels faster than light). However, quantum mechanics predicts—and experiments confirm—that certain entangled systems, such as [Bell pairs](#bell-pairs), can violate these inequalities: they exhibit correlations impossible to explain by a classical theory. Testing the violation of Bell inequalities thus proves the existence of quantum entanglement and rules out any explanation by local hidden variables.

## The CHSH Inequality
The CHSH inequality (Clauser, Horne, Shimony, Holt) is a specific and experimentally testable version of the [Bell inequalities](#bell-inequalities). It applies to measurements on two entangled qubits, each measured in two different bases. According to classical physics, the value of the parameter $S$ calculated from the measured correlations cannot exceed 2. However, quantum mechanics allows a maximum value of $2\sqrt{2}$, thus proving the presence of entanglement and the absence of local hidden variables. In the E91 protocol, verifying this inequality ensures the security of the generated key.

### Interpretation of the S Value
In the E91 protocol, the value $S$ calculated from the measurements must exceed 2 to prove the quantum and secure origin of the key. If $S \leq 2$, the results are compatible with classical physics: this means the entanglement has been broken, most likely by an eavesdropping attempt. The key is then not secure and must be discarded.

#### Importance of the Number of Samples
The results of the protocol (such as the S value) are based on probabilities and averages. To obtain a reliable value that reflects reality, a very large number of measurements (samples) is required. With few measurements, chance can distort the result and lead to an incorrect conclusion about the security of the key.

<!-- 
Todo: Need review and verify the definitions provided below. Please check whether these definitions are general to quantum cryptography or specifically related to the BB84 protocol.
-->

## Encoding a Bit in a Photon
Encoding a bit in a photon refers to using the polarization of photons to represent bits (0 or 1). Polarization is a property of photons that describes the direction in which their electric field oscillates. In the BB84 protocol, this polarization is used to encode bits by choosing between two bases: the + basis and the × basis. In the + basis, a horizontally polarized photon (↔) represents bit 0, while a vertically polarized photon (↕) represents bit 1. In the × basis, a diagonally polarized photon (⤢) represents bit 0, and a photon polarized in the opposite diagonal direction (⤡) represents bit 1. Alice encodes each bit in this manner before sending it to Bob.

## Orthogonal Basis
In a two-dimensional Cartesian plane, a basis is a set of two vectors, v0 ​and v1​, that can represent any vector in the plane as a linear combination of v0​ and v1​. When v0​ and v1​ form a 90° angle, they are orthogonal and create an orthogonal basis. A natural basis consists of one vector aligned with the x-axis and another aligned with the y-axis, known as the + basis in the BB84 protocol. By rotating the + basis vectors by 45°, the x basis is obtained. By associating bits 0 and 1 with the orthogonal vectors of a basis, Bob always measures the value encoded by Alice when they use the same basis. This is a consequence of using an orthogonal basis and Born's rule, which states that the probability of a measurement outcome corresponds to the square of the polarization vector's component in that basis. If Alice's and Bob's bases do not match, the polarization vector of the photon sent by Alice is expressed as a linear combination of the measurement basis vectors chosen by Bob. The measurement result is then random.


## Classical vs. Quantum Channels
A classical channel is designed to transmit classical information, such as binary or textual messages. Transmitting quantum information through a classical channel presents significant performance challenges due to the noise introduced by classical information. On the other hand, a quantum channel is designed to transmit quantum information, such as the state of a photon. This channel preserves the quantum properties of the information, ensuring a high likelihood that the correct information is received intact on the other end.


## Detecting Eve's Presence
Consider only the photons for which Alice and Bob used the same basis, as these photons are used to establish the key. To obtain information about the key, Eve must choose a basis to measure the photons she intercepts. For a given photon, suppose Alice and Bob use the + basis. If Eve, by chance, also chooses the + basis, she will measure the correct value and retransmit the bit in a photon with the same polarization. In this case, Eve's presence cannot be detected. However, if Eve measures in the x basis, which has a 50% chance of occurring, she will transmit to Bob a photon polarized in a superposition of states relative to the + basis. Bob's measurement result will then be probabilistic, introducing errors that Alice and Bob can use to detect Eve's presence.


---

## Disturbance of the State by Measurement
It is often said that a quantum system can be "in two states at once," that is, in a superposition of states. In reality, this means the system is described by a mathematical combination of several possible states (see the definition of [quantum superposition](#quantum-superposition) below). When the system is measured, the outcome cannot be predicted in advance, but the probability of each result is known. Once the measurement is made, the superposition is destroyed and the system ends up in the state corresponding to the measured result. Any subsequent measurement will yield the same result.

---

## Quantum Superposition
Quantum superposition is a fundamental principle of quantum mechanics stating that a system can be described by a linear combination of several eigenstates. Mathematically, if $|\psi_1\rangle$ and $|\psi_2\rangle$ are solutions of the Schrödinger equation (i.e., possible states described by the fundamental law of quantum mechanics), then $|\Psi\rangle = c_1|\psi_1\rangle + c_2|\psi_2\rangle$ (with $c_1$, $c_2$ complex numbers) is also a solution. This means the system is not in several states at once, but in a unique state that is a mathematical combination of possible states. Upon measurement, the system adopts one of the eigenstates with a probability given by the squared modulus of the corresponding amplitude.

## Phase
The **phase** of a quantum or classical wave is a quantity that describes the relative position of a point in the cycle of a periodic oscillation. Mathematically, for a complex wave $\psi = A e^{i\phi}$, the phase $\phi$ is the argument of the exponential. Differences in phase between two waves or pulses determine interference phenomena. In quantum cryptography protocols, information can be encoded in the phase difference between successive pulses.

---

## Phase Shift
A **phase shift** is a modification of the phase of a wave or pulse. In quantum optics, a phase shift of $\pi$ (180°) corresponds to an inversion of the sign of the amplitude. In the DPS protocol, the phase shift is used to encode information in the relative phase of the pulses.

---

## Pulse
A **pulse** is a brief emission of energy, often light, characterized by its duration, amplitude, and phase. In quantum optics, a pulse corresponds to a wave packet of light, used to transmit information or interact with optical devices. In quantum key distribution protocols, pulses serve as the support for encoding bits.

---

## Pulse Train
A **pulse train** is a sequence of light pulses (or other signals) emitted at regular time intervals. In quantum cryptography, a photon can be prepared in a superposition state of several temporal pulses, thus forming a train where information is encoded in the relative phase between pulses.

---

## Beamsplitter
A **beamsplitter** (or semi-reflective mirror) is an optical component that divides a light beam into two: one part is reflected, the other transmitted. For a single photon, the beamsplitter creates a quantum superposition of the two possible paths, which is essential for interference experiments.

---

## Interferometer
An **interferometer** is an optical device that splits a light beam into several paths, then recombines them to produce interference. The phase difference accumulated between the paths allows very precise measurements of physical quantities. The Mach-Zehnder interferometer is a classic example used in quantum cryptography.

---

## Probability Amplitude
In quantum mechanics, the **probability amplitude** is a complex number associated with the probability of finding a system in a given state. The actual probability is obtained by taking the square of the modulus of the amplitude. Amplitudes can add or cancel, giving rise to quantum interference phenomena.

---

## Unitary Operator
A **unitary operator** is a linear transformation that preserves the norm of state vectors in Hilbert space. In quantum mechanics, the evolution of a closed system is described by a unitary operator, ensuring the conservation of total probability.
