---
title: "BB84 Protocol"
description: "Complete guide to BB84 quantum key distribution"
protocol: "bb84"
language: "en"
version: "1.0"
last_updated: "2025-07-09"
contributors: ["Jean-Fred", "Zubir", "ibra", "..."]
---

# BB84 Protocol - Complete Guide

## About
The BB84 protocol was proposed in 1984 by Charles Bennett of IBM and Gilles Brassard from the Université de Montréal. It involves two distinct parties, Alice and Bob, who aim to establish an [encryption key](definitions#encryption-key) to communicate securely over a [public channel](definitions#public-channel). 

The protocol begins with Alice creating a random sequence of bits and [encoding each bit](definitions#bit-encoding) using a [photon](definitions#photon). Specifically, the bit value is encoded in one of two [mutually orthogonal](definitions#orthogonal-states) polarization states of the photon. Additionally, for each photon, the basis used to describe the polarization of light is chosen randomly from two possible bases. Alice then sends these photons to Bob via a public [quantum channel](definitions#quantum-channel).

## Key: component.bb84.about.protocol-security
The security of the BB84 protocol relies on the fundamental principles of quantum mechanics, particularly the no-cloning theorem and the measurement disturbance principle. When an eavesdropper (Eve) attempts to intercept and measure the quantum states, she inevitably disturbs the system, leaving detectable traces of her presence.

## key concepts
The BB84 protocol introduces several key concepts that are fundamental to quantum cryptography:

### Quantum Superposition
Quantum systems can exist in multiple states simultaneously until measured. This property is crucial for the security of quantum key distribution.

### Measurement Disturbance
Any attempt to measure a quantum system will disturb it, making eavesdropping detectable. This is a fundamental principle that ensures the security of the protocol.

### Basis Reconciliation
Alice and Bob must compare their measurement bases to determine which bits can be used for the final key. Only bits measured in the same basis are retained.

## photon
Photons are the fundamental particles of light and electromagnetic radiation. In the BB84 protocol, photons serve as the carriers of quantum information. The polarization of photons is used to encode bit information (0 or 1), taking advantage of the quantum properties of light to ensure secure communication.

The key advantage of using photons is that they can exist in quantum superposition states and are sensitive to measurement, making any interception attempt detectable.

## encoding
Encoding a bit in a photon refers to using the polarization of photons to represent bits (0 or 1). Polarization is a property of photons that describes the direction in which their electric field oscillates. 

In the BB84 protocol, this polarization is used to encode bits by choosing between two bases:

**+ Basis (Rectilinear)**
- Horizontally polarized photon (↔) represents bit 0
- Vertically polarized photon (↕) represents bit 1

**× Basis (Diagonal)**
- Diagonally polarized photon (⤢) represents bit 0
- Anti-diagonally polarized photon (⤡) represents bit 1

Alice encodes each bit by randomly selecting one of these bases and then setting the photon's polarization according to the bit value she wants to transmit.

## orthogonal
In quantum mechanics, an orthogonal basis is a set of quantum states that are mutually perpendicular and can be perfectly distinguished from each other. In the BB84 protocol, two orthogonal bases are used:

1. **+ Basis**: Horizontal and vertical polarizations (0° and 90°)
2. **× Basis**: Diagonal polarizations (45° and 135°)

These bases are chosen because they are mutually unbiased - measuring a photon prepared in one basis with the other basis yields completely random results. This property is essential for detecting eavesdropping attempts.

## channels
The BB84 protocol uses two types of communication channels:

### Quantum Channel
A quantum channel is designed to transmit quantum information, such as the polarization state of photons. This channel preserves the quantum properties of the information, ensuring that quantum superposition and entanglement are maintained during transmission.

### Classical Channel
A classical channel is used to transmit classical information, such as binary messages or basis information. This channel is assumed to be public and can be eavesdropped upon, but it cannot be used to transmit quantum states.

The security of BB84 comes from the fact that the quantum channel provides the security (through quantum mechanics), while the classical channel is used for public communication and verification.

## Key: component.bb84.about.encryptionKey
An encryption key is a secret code (in bits) that protects information by transforming it into an unreadable format. Only those possessing the decryption key can restore the original message. The decryption key can either be the same (symmetric keys) or different (asymmetric keys).

### Example of Symmetric Key Encryption
Suppose Alice and Bob share the encryption key: `010010`. If Alice wants to send a confidential message to Bob, she performs a bitwise XOR operation between the key and her message.

**Example:**
- Message: `101001`
- Key:     `010010`
- Result:  `111011` (encrypted message)

This encrypted sequence is sent to Bob, who, as the only other person possessing the key, can decrypt the message by performing a bitwise XOR operation between the encrypted message and the key:

- Encrypted: `111011`
- Key:       `010010`
- Result:    `101001` (original message)

## eve
Detecting the presence of an eavesdropper (Eve) is a crucial feature of the BB84 protocol. The detection mechanism relies on quantum mechanics principles:

When Eve intercepts photons, she must choose a basis to measure them. Since she doesn't know which basis Alice used, she has a 50% chance of choosing the wrong basis for each photon. When she measures with the wrong basis, she disturbs the quantum state, even if she tries to retransmit a photon with the same polarization.

**Detection Process:**
1. Alice and Bob compare a random subset of their key bits over the public channel
2. If the error rate exceeds a certain threshold, they know Eve was present
3. If the error rate is low, they can proceed with the key
4. The remaining bits (not used for verification) become the final secret key

This quantum mechanical property ensures that any eavesdropping attempt can be detected, making the protocol information-theoretically secure.

## applications
The BB84 protocol has numerous practical applications in quantum cryptography:

- **Quantum Key Distribution (QKD)**: Secure distribution of cryptographic keys
- **Quantum Internet**: Foundation for quantum communication networks
- **Banking and Finance**: Ultra-secure communication for financial transactions
- **Government Communications**: Secure channels for classified information
- **Medical Records**: Protecting sensitive healthcare data
- **Research Networks**: Secure communication between research institutions
