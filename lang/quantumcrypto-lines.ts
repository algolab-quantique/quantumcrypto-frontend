// Order derived from Language enum defined in the LanguageProvider
// 0: English
// 1: French
// 2: Spanish

import { LanguageItem } from '@/types';

export const quantumcryptoLines: LanguageItem[] = [
    {   // ... (English translations)
        'component.main.name': 'John',
        'component.header.howToPlay': 'How to play',
        'component.header.about': 'About',
        'component.header.about.bb84': 'About BB84',
        'component.sidebar.play': 'Play',
        'component.main.game': 'A Quantum Encryption Game',
        'component.main.nameRequired': 'A name is required',
        'component.main.nameMin': 'Your name should be at least 2 characters',
        'component.main.nameMax': 'Your name cannot be longer than 10 characters',
        'component.main.pinRequired': 'A waiting-room PIN is required',
        'component.main.pinLength': 'The waiting-room PIN must be 5 characters long',
        'component.main.nameDescription': 'This will be your public display name',
        'component.main.nameLabel': 'Name',
        'component.main.pinLabel': 'Game PIN',
        'component.main.createGame': 'Create Game',
        'component.main.createGame.description': 'Pick the number of' +
            ' photons and whether you want Eve to be present in your game',
        'component.main.createGame.descriptionNoEve': 'Pick the number of photons',
        'component.main.join': 'Join',
        'component.main.invalidCodeTitle': 'Error joining waiting-room.',
        'component.main.invalidCodeMessage': 'Verify the waiting-room PIN',
        'component.waitingRoom.players': 'Players',
        'component.waitingRoom.joinAt': 'Join at',
        'component.waitingRoom.start': 'Start',
        'component.waitingRoom.exit': 'Exit',
        'component.waitingRoom.in': 'You\'re in,',
        'component.waitingRoom.wait': 'Wait for the host to start the waiting-room',
        'component.main.takenNameTitle': 'Name taken',
        'component.main.takenNameDescription': 'That name is taken. Please' +
            ' pick a different one.',
        'component.waitingRoom.gameEndedTitle': 'Game ended',
        'component.waitingRoom.gameEndedDescription': 'The host has ended the waiting-room',
        'component.waitingRoom.atLeastOnePlayer': 'You need at least one player',
        'component.createGame.keyLength': 'Number of photons',
        'component.createGame.eve': 'Is Eve present?',
        'component.createGame.keyError': 'Only numbers between 10 and 30',
        'component.createGame.keyMin': 'The minimum number of photons is 16' +
            ' if Eve is present and 10 otherwise',
        'component.createGame.keyMax': 'The maximum number of photons is 30',
        'component.createGame.ready': 'Ready!',
        'component.waitingRoom.connectionLostTitle': 'Connection lost',
        'component.waitingRoom.connectionLostDescription': 'You lost' +
            ' connection to the server. Try re-joining the waiting-room',
        'component.waitingRoom.copied': 'Copied!',
        'component.main.gameStarted': 'Game started',
        'component.main.gameStartedDescription': 'The game you are trying' +
            ' to connect to has already started.',
        'component.createGame.numbersOnly': 'Only numbers are allowed',
        'component.createGame.validationLength': 'The validation bits must' +
            ' be less than or equal to half of the key length',
        'component.createGame.validationDescription': 'Validation bits',
        'component.main.errorCreating': 'Error creating game',
        'component.createGame.evePercentage.invalidType': 'Only numbers' +
            ' between 0.1 and 1',
        'component.createGame.evePercentage.positive': 'Must be positive',
        'component.createGame.evePercentage.greaterThan': 'Must be 0.1 or more',
        'component.createGame.evePercentage.lessThan': 'Must be 1 or less',
        'component.createGame.evePercentage.label': 'Eve probability',
        'component.bb84.gameFound': 'Game Found!',
        'component.bb84.gameFound.desc': 'It looks like you left a game' +
            ' while it was still active. Would you like to rejoin?',
        'component.bb84.gameFound.action': 'Rejoin',
        'general.close': 'Close',
        'component.bb84.play.sorry': 'Sorry, we could not find a partner for you :(',
        'component.homePage.protocolsSection.bb84.description': 'A protocol' +
            ' for securely sharing cryptographic keys between two parties' +
            ' over an insecure communication channel.',
        'component.homePage.protocolsSection.e91.description': 'The E91 protocol' +
            ' uses quantum entanglement to ensure communication security by' +
            ' allowing parties to exchange unbreakable cryptographic keys.',
        'component.homePage.title.description': 'Learn and practice quantum' +
            ' cryptography protocols',
        'component.homePage.aboutSection': 'QuantumCrypto is a web platform' +
            ' for quantum cryptography education. It offers a growing' +
            ' number of interactive experiences for playing with different' +
            ' protocols. QuantumCrypto aims to bridge the gap between' +
            ' theoretical quantum concepts and practical understanding by' +
            ' enabling users to engage in real-time simulations of quantum' +
            ' cryptography protocols. The main features of our platform are',
        'component.homePage.userFriendly': 'Enjoy an intuitive user' +
            ' interface designed for a better learning experience.',
        'component.homePage.multiplayer': 'Create and join games with your' +
            ' friends to put into practice your quantum cryptography knowledge.',
        'component.homePage.extensible': 'A modular design allows' +
            ' contributors to extend our app with new features, including new protocols.',
        'component.homePage.openSource': 'All our code is available on' +
            ' GitHub. You can find the links at the bottom of the page.',
        'component.bb84.about.part1': 'The BB84 protocol was proposed in 1984 by Charles Bennett of IBM and Gilles Brassard from the Université de Montréal',
        'component.bb84.about.part2': '. It involves two distinct parties, Alice and Bob, who aim to establish an <link2>encryption key</link2> to communicate securely over a <link3>public channel</link3>. ' +
            'The protocol begins with Alice creating a random sequence of bits and <link5>encoding each bit</link5> using a <link1>photon</link1>. ' +
            'Specifically, the bit value is encoded in one of two <link6>mutually orthogonal</link6> polarization states of the photon. ' +
            'Additionally, for each photon, the basis used to describe the polarization of light is chosen randomly from two possible bases. Alice then sends these photons to Bob via a public <link4>quantum channel</link4>. ' +
            'When Bob receives the photons, he measures them using one of the two bases, also chosen randomly. Subsequently, Alice and Bob publicly announce the bases they used to encode and measure each photon. ' +
            'A key is formed by keeping only the bits for which Alice and Bob\'s bases match. ' +
            'Finally, by comparing a subset of the bits from their key, Alice and Bob can detect the <link8>presence of an eavesdropper</link8>, typically referred to as Eve, and thus ensure the security of their quantum communication channel. ' +
            'This is because, according to the fundamental principles of quantum mechanics, any attempt by Eve to intercept and measure these photons will <link7>disturb their state</link7>, introducing inconsistencies that Alice and Bob can detect. ' +
            'If they conclude that the quantum channel has not been compromised, they can use the generated encryption key to securely send a message. Otherwise, they must repeat the procedure. ',
        'component.bb84.about.encryptionKey.title': 'Encryption Key',
        'component.bb84.about.encryptionKey.part1': 'An encryption key is a secret code (in bits) that protects information by transforming it into an unreadable format. Only those possessing the decryption key can restore the original message. The decryption key can either be the same (symmetric keys) or different (asymmetric keys). For instance, in a symmetric key encryption scenario, Alice and Bob share the encryption key: 010010. If Alice wants to send a confidential message to Bob, she performs a bitwise XOR operation between the key and her message. Here\'s how the XOR operation works for different bit values: ',
        'component.bb84.about.encryptionKey.part2': 'Let\'s say the message Alice wants to send is 111000. The encryption operation generates the sequence 101010, as shown in this table: ',
        'component.bb84.about.encryptionKey.part3': 'This sequence is sent to Bob, who, as the only other person possessing the key, can decrypt the message by performing a bitwise XOR operation between the encrypted message and the key. ',
        'component.bb84.about.encryptionKey.message': 'Message',
        'component.bb84.about.encryptionKey.key': 'Key',
        'component.bb84.about.encryptionKey.cypher': 'Encrypted Message',
        'component.bb84.about.photon.title': 'Photon',
        'component.bb84.about.photon': 'It is often said that everything in the universe is composed of particles, including light. In fact, the particles that make up light are called photons, and they are responsible for carrying light energy. The BB84 protocol uses the polarization of photons to convey bit information (0 or 1). This essential quantum property of light particles ensures the protocol\'s security. ',
        'component.bb84.about.publicPrivate.title': 'Public vs. Private Channels',
        'component.bb84.about.publicPrivate': 'A public channel is a communication medium where anyone can potentially eavesdrop on the exchanged messages, similar to speaking loudly in a room full of people. In contrast, a private channel ensures that communication occurs only between the intended parties without the risk of interception, like a whispered conversation that no one else can hear. Since guaranteeing the privacy of a communication channel can be challenging, cryptography is used to render messages incomprehensible over a public channel, thus protecting the confidentiality of the data. ',
        'component.bb84.about.classicalQuantum.title': 'Classical vs. Quantum Channels',
        'component.bb84.about.classicalQuantum': 'A classical channel is designed to transmit classical information, such as binary or textual messages. Transmitting quantum information through a classical channel presents significant performance challenges due to the noise introduced by classical information. On the other hand, a quantum channel is designed to transmit quantum information, such as the state of a photon. This channel preserves the quantum properties of the information, ensuring a high likelihood that the correct information is received intact on the other end. ',
        'component.bb84.about.encoding.title': 'Encoding a Bit in a Photon ',
        'component.bb84.about.encoding': 'Encoding a bit in a photon refers to using the polarization of photons to represent bits (0 or 1). Polarization is a property of photons that describes the direction in which their electric field oscillates. In the BB84 protocol, this polarization is used to encode bits by choosing between two bases: the + basis and the × basis. In the + basis, a horizontally polarized photon (↔) represents bit 0, while a vertically polarized photon (↕) represents bit 1. In the × basis, a diagonally polarized photon (⤢) represents bit 0, and a photon polarized in the opposite diagonal direction (⤡) represents bit 1. Alice encodes each bit in this manner before sending it to Bob. ',
        'component.bb84.about.orthogonal.title': 'Orthogonal Basis ',
        'component.bb84.about.orthogonal': 'In a two-dimensional Cartesian plane, a basis is a set of two vectors, v0 ​and v1​, that can represent any vector in the plane as a linear combination of v0​ and v1​. When v0​ and v1​ form a 90° angle, they are orthogonal and create an orthogonal basis. A natural basis consists of one vector aligned with the x-axis and another aligned with the y-axis, known as the + basis in the BB84 protocol. By rotating the + basis vectors by 45°, the x basis is obtained. By associating bits 0 and 1 with the orthogonal vectors of a basis, Bob always measures the value encoded by Alice when they use the same basis. This is a consequence of using an orthogonal basis and Born\'s rule, which states that the probability of a measurement outcome corresponds to the square of the polarization vector\'s component in that basis. If Alice\'s and Bob\'s bases do not match, the polarization vector of the photon sent by Alice is expressed as a linear combination of the measurement basis vectors chosen by Bob. The measurement result is then random. ',
        'component.bb84.about.disturbance.title': 'State Disturbance by Measurement ',
        'component.bb84.about.disturbance': 'It is often said that a quantum system can be "in two states at once," meaning it is in a superposition of states. This implies that upon measurement, the system\'s outcome cannot be predicted, but the probability of each result is known. Once a measurement is made, the superposition state is destroyed, and the system collapses into the measured state. Any subsequent measurement will yield the same result. ',
        'component.bb84.about.eve.title': 'Detecting Eve\'s Presence ',
        'component.bb84.about.eve': 'Consider only the photons for which Alice and Bob used the same basis, as these photons are used to establish the key. To obtain information about the key, Eve must choose a basis to measure the photons she intercepts. For a given photon, suppose Alice and Bob use the + basis. If Eve, by chance, also chooses the + basis, she will measure the correct value and retransmit the bit in a photon with the same polarization. In this case, Eve\'s presence cannot be detected. However, if Eve measures in the x basis, which has a 50% chance of occurring, she will transmit to Bob a photon polarized in a superposition of states relative to the + basis. Bob\'s measurement result will then be probabilistic, introducing errors that Alice and Bob can use to detect Eve\'s presence. ',
        'component.homePage.userFriendlyTitle': 'User-friendly',
        'component.homePage.multiplayerTitle': 'Multiplayer Experience',
        'component.homePage.extensibleTitle': 'Highly Extensible',
        'component.bb84.aboutTitle': 'About the protocol',
        'component.header.protocols': 'Protocols',
        'component.header.guide': 'Guide',
        'component.header.guide.howToPlay': 'How to Play',
        'component.header.guide.terminology': 'Terminology',
        'component.header.guide.context': 'Context',
        'component.header.guide.comingSoon': 'Coming soon',
        'component.header.guide.comingSoonDesc': 'This section is under construction. Check back soon!',
        'component.header.guide.howToPlayDesc': 'Learn how to play each quantum cryptography protocol.',
        'component.header.guide.terminologyDesc': 'Key definitions used across all quantum cryptography protocols.',
        'component.bb84.howToPlayTitle': 'How to play BB84',
        'component.bb84.howToPlayDescription': 'The BB84 protocol has two' +
            ' main actors: Alice and Bob, who play different roles. Here' +
            ' you can explore the set of steps that each one of them must' +
            ' take in order to complete the protocol successfully.',
        'component.bb84.steps.step1Alice': ' of 0s and 1s. This string will be' +
            ' used to build your encryption key.',
        'component.bb84.steps.step2Alice': ' to encode each of the bits. You' +
            ' can choose between the + and x bases.',
        'component.bb84.steps.step3Alice': ' in the polarization of your photons.',
        'component.bb84.steps.step4Alice': ' with Bob and wait for him to' +
            ' finish receiving and measuring them.',
        'component.bb84.steps.step5Alice': ' and discard the bits where the bases don\'t match.',
        'component.bb84.steps.step6Alice': ' by verifying that the randomly' +
            ' selected bits from your raw key match with Bob\'s. If they' +
            ' match, you can assume that the probability of an eavesdropper' +
            ' being present is very low and you can safely use the key.' +
            ' Otherwise, you have detected the presence of an eavesdropper' +
            ' and must restart the protocol.',
        'component.bb84.steps.step7Alice': ' to Bob.',
        'component.bb84.highlights.highlight1Alice': 'Create a random bit string',
        'component.bb84.highlights.highlight2Alice': 'Randomly select a set of bases',
        'component.bb84.highlights.highlight3Alice': 'Encode your bits',
        'component.bb84.highlights.highlight4Alice': 'Share your photons',
        'component.bb84.highlights.highlight5Alice': 'Compare your bases to Bob\'s',
        'component.bb84.highlights.highlight6Alice': 'Validate your key',
        'component.bb84.highlights.highlight7Alice': 'Encrypt and send your' +
            ' message',
        'component.bb84.additionalStep': 'In QuantumCrypto, not all BB84' +
            ' games have an eavesdropper. This next step only applies if' +
            ' there is one in your game. You\'ll find out at the end!',
        'component.bb84.rawKeyInfo': 'At this point, you possess the "raw' +
            ' key", which will be used to detect the presence of an' +
            ' eavesdropper.',
        'component.bb84.steps.step1Bob': ' to measure each of Alice\'s photons.' +
            ' You can choose between the + and x bases.',
        'component.bb84.steps.step2Bob': ' and make note of your outcomes.',
        'component.bb84.steps.step3Bob': ' with Alice.',
        'component.bb84.steps.step4Bob': ' and discard the bits where the bases don\'t match.',
        'component.bb84.steps.step5Bob': ' by verifying' +
            ' that the randomly selected bits from your raw key match with' +
            ' Bob\'s. If they match, you can assume that the probability of' +
            ' an eavesdropper being present is very low, and you can safely' +
            ' use the key. Otherwise, you have detected the presence of an' +
            ' eavesdropper and must restart the protocol.',
        'component.bb84.steps.step6Bob': ' using your key.',
        'component.bb84.highlights.highlight1Bob': 'Randomly select a set of bases',
        'component.bb84.highlights.highlight2Bob': 'Measure the photons',
        'component.bb84.highlights.highlight3Bob': 'Share your bases',
        'component.bb84.highlights.highlight4Bob': 'Compare your bases to Alice\'s',
        'component.bb84.highlights.highlight5Bob': 'Validate your key',
        'component.bb84.highlights.highlight6Bob': 'Decrypt Alice\'s message',
        'component.quantumCrypto.gamesPlayed': 'Total games played: ',
        'component.bb84.playSolo': 'Play solo',
        'component.bb84.startSolo': 'Start solo game',
        'component.bb84.soloRoleSelect': 'Select your role',
        'component.e91.playSolo': 'Play solo',
        'component.e91.startSolo': 'Start solo game',
        'component.e91.soloRoleSelect': 'Select your role',
        'component.header.about.e91': 'About E91',
        'component.e91.howToPlayTitle': 'How to play E91',
        'component.e91.howToPlayDescription': 'The E91 protocol has two' +
            ' main actors: Alice and Bob, who play different roles. Here' +
            ' you can explore the set of steps that each one of them must' +
            ' take in order to complete the protocol successfully.',
        'component.e91.results.room': 'Room',
        'component.e91.results.evePresent': 'Eve present',
        'component.e91.results.eveDetected': 'Eve detected',
        'component.e91.results.time': 'Time',
        'component.e91.results.score': 'Score',
        'component.e91.highlights.highlight1': 'Randomly choose a measurement basis for the incoming photons.',
        'component.e91.steps.step1': ' Each photon you receive is entangled in a Bell pair with a partner photon received by Bob.',
        'component.e91.highlights.highlight2': 'Share your measurement bases',
        'component.e91.steps.step2Alice': ' with Bob.',
        'component.e91.steps.step2Bob': ' with Alice.',
        'component.e91.highlights.highlight3': 'Extract your encryption key',
        'component.e91.steps.step3': ' from the measurement outcomes obtained for identical base pairs.',
        'component.e91.highlights.highlight4': 'Validate your key',
        'component.e91.steps.step4': ' by testing the CHSH inequality with the measurements taken with the other base' +
            ' combinations.',
        'component.e91.highlights.highlight5Alice': 'Encrypt and send your message',
        'component.e91.steps.step5Alice': ' to Bob.',
        'component.e91.highlights.highlight5Bob': 'Decrypt Alice\'s message',
        'component.e91.steps.step5Bob': ' using your key.',
        'component.e91.about.part1.0': 'The protocol was proposed in 1991 by Artur Ekert',
        'component.e91.about.part1.1': '. It involves two distinct parties, Alice and Bob, who aim to establish <link2>an encryption key</link2> to securely communicate over <link3>a public channel</link3>. In this protocol, Alice and Bob each receive <link1>a photon</link1> from a source that emits pairs of photons whose <link4>polarizations</link4> are <link5>maximally entangled</link5>: these photons form what is known as <link6>Bell pairs</link6>. For each pair, the polarization of one photon is measured by Alice and the other by Bob. Alice performs each measurement by randomly choosing <link7>a basis</link7> from the set of three bases {a, b, a′}. Bob does the same, choosing from the bases {b, a′, b′}. Among these bases, Alice and Bob share two common bases, b and a′.',
        'component.e91.about.part2': 'Bob does the same, choosing from the bases',
        'component.e91.about.part3': '. Among these bases, Alice and Bob share two common bases, ',
        'component.e91.about.figures.title': 'Figure of the Bases',
        'component.e91.about.figures.part1': 'For each measurement, Alice and Bob record the result: +1 or -1. Once the transmission of photon pairs is complete and the measurements are made, Alice and Bob disclose the measurement bases they used for each photon. The results of measurements performed in the same basis are kept to form the encryption key. This occurs, on average, 2 out of 9 times: when Alice and Bob both measure in the b basis or in the a\' basis. The results of measurements performed in different bases are disclosed and used to validate the security of the source and the quantum channel. To do this, the E91 protocol relies on one of the most remarkable experiments in quantum mechanics: testing Bell inequalities. There are several formulations of these inequalities, and the E91 protocol specifically uses the CHSH inequality. Alice and Bob work only with the results of measurements made in the following bases: ',
        'component.e91.about.figures.part2': 'Thus, on average, 4 out of 9 photon pairs are used to verify the CHSH inequality. For each pair of results derived from the combinations of bases in the above table, Alice and Bob compute the product mA × mB, where mA and mB are the measurement results obtained by Alice and Bob, respectively. The average of the products is then calculated for each basis combination. ',
        'component.e91.about.figures.part3': 'Suppose Alice and Bob have made the following measurements:',
        'component.e91.about.figures.part4': 'The calculation of averages (correlation E(a,b)) gives:',
        'component.e91.about.figures.part5': 'The CHSH inequality is checked by verifying that ',
        'component.e91.about.figures.chsh.classical': 'Classical limit: S ≤ 2 (Bell\'s inequality)',
        'component.e91.about.figures.chsh.quantum': 'Quantum maximum: S = 2√2 ≈ 2.83 (Tsirelson\'s bound)',
        'component.e91.about.figures.chsh.example': 'Our example: S = |0.33 + 0 + 1 - 0| = 1.33 ≤ 2 ✓',
        'component.e91.about.figures.noMeasurements': 'no measurements in this example',
        'component.e91.about.figures.part6': 'It turns out that when S is calculated from entangled photons, this inequality is violated. In fact, it can be shown that S = 2√2 ≈ 2.83 for maximally entangled photons. Thus, if the photon pair emitter is reliable and the communication channel is neither noisy nor eavesdropped upon, Alice and Bob should observe that the value of S approaches 2√2 as they increase the number of photon pairs considered in their calculations. They can then use the key obtained to encrypt their messages. Conversely, if this value remains below 2, they cannot trust the key and should refrain from using it. Be aware that average values are statistical quantities that require many samples to be significant. For a limited number of samples, statistical anomalies may occur, making it difficult to draw conclusions. ',
        'component.e91.about.figures.part7.1': 'Finally, note that three combinations of measurement bases are not used in the E91 protocol: ',
        'component.e91.about.figures.part7.2': 'The measurements made with these base pairs are simply discarded. ',

        // E91 definitions
        'component.e91.about.photon.title': 'Photon',
        'component.e91.about.photon': 'It is often said that everything in the universe is made of particles, even light. The particles that make up light are called photons: they are the fundamental "grains" of light energy. In quantum cryptography protocols (such as BB84, E91, etc.), photons are used to carry information between two parties. Their polarization property allows encoding bits (0 or 1), while their quantum nature guarantees the security of the transmission: any attempt at interception alters the state of the photon and can be detected.',

        'component.e91.about.encryptionKey.title': 'Encryption Key',
        'component.e91.about.encryptionKey': 'An encryption key is a secret piece of information, usually a sequence of bits (0s and 1s), shared only between two parties (such as Alice and Bob). It allows, through a cryptographic algorithm, to transform a readable message (plaintext) into an encrypted message (unreadable to others), and then to decrypt it. Unlike a password, the key is not meant to be memorized by a human, but to be used by a computer program. The goal of protocols like BB84, E91 or DPS is to generate and share this key in a perfectly secure way, so that only Alice and Bob can use it to protect their communications.',

        'component.e91.about.publicPrivate.title': 'Public (and Private) Channel',
        'component.e91.about.publicPrivate': 'A public channel is a means of communication (such as the Internet, an optical fiber, or a telephone line) where anyone can potentially intercept or listen to the exchanged messages—like speaking out loud in a crowded room. Conversely, a private channel ensures that only the intended parties can access the communication, like a quiet conversation aside. In practice, it is difficult to guarantee the confidentiality of a channel: this is why cryptography is used to make messages incomprehensible over a public channel. In quantum cryptography protocols (BB84, E91, DPS, etc.), security relies on quantum physics, not on the confidentiality of the channel.',

        'component.e91.about.polarization.title': 'Polarizations',
        'component.e91.about.polarization': 'Polarization describes the orientation in which a light wave (such as a photon) oscillates. Imagine a vibrating string: it can vibrate vertically (↕), horizontally (↔), or diagonally (⤢). For a photon, polarization is a fundamental quantum property that is measured to obtain results of +1 or -1.',

        'component.e91.about.maximallyEntangled.title': 'Maximally Entangled',
        'component.e91.about.maximallyEntangled.part1': 'Two particles (or qubits) are said to be "entangled" when they share a common quantum state: their measurement results are correlated in such a way that it is impossible to describe them separately, even at a distance. "Maximal entanglement" refers to the strongest possible correlation between measurement results, meaning the results are perfectly correlated or anti-correlated depending on the chosen basis (measuring one immediately reveals the result of the other).',
        'component.e91.about.maximallyEntangled.part2': 'Mathematically, a maximally entangled state is written as a superposition where each possible outcome has the same probability: for example, for two qubits, the state',
        'component.e91.about.maximallyEntangled.equation1': '$$\\left|\\Phi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle + |11\\rangle)$$',
        'component.e91.about.maximallyEntangled.part3': 'means the two particles are always identical (00 or 11), each with a probability of 1/2. The "amplitude" 1/√2 ensures this equal probability.',
        'component.e91.about.maximallyEntangled.part4': 'There are also non-maximally entangled states, where the amplitudes are not equal (for example, \\(\\alpha \\lvert 00 \\rangle + \\beta \\lvert 11 \\rangle\\) with \\(\\lvert\\alpha\\rvert^{2} \\neq \\lvert\\beta\\rvert^{2}\\)). In this case, the correlations are weaker and the state is less useful for quantum cryptography.',
        'component.e91.about.maximallyEntangled.part5': 'Maximal entanglement is essential to guarantee the security of quantum protocols: any attempt at interception alters these perfect correlations and can be detected.',

        'component.e91.about.bellPairs.title': 'Bell Pairs',
        'component.e91.about.bellPairs.part1': 'Bell pairs are pairs of qubits (quantum particles, such as photons) prepared in one of the four states of maximal quantum entanglement, called Bell states. These states exhibit perfect correlations, impossible to reproduce with classical physics, and are fundamental to many quantum cryptography protocols. The four Bell states are:',
        'component.e91.about.bellPairs.equation1': '$$\\left|\\Phi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle + |11\\rangle)$$',
        'component.e91.about.bellPairs.equation2': '$$\\left|\\Phi^-\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle - |11\\rangle)$$',
        'component.e91.about.bellPairs.equation3': '$$\\left|\\Psi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|01\\rangle + |10\\rangle)$$',
        'component.e91.about.bellPairs.equation4': '$$\\left|\\Psi^-\\right\\rangle = \\frac{1}{\\sqrt{2}} (|01\\rangle - |10\\rangle)$$',
        'component.e91.about.bellPairs.part2': 'They are named after physicist John Stewart Bell. In protocols like E91, these pairs ensure security through maximal entanglement: any attempt at interception alters the correlations and can be detected.',

        'component.e91.about.measurementBasis.title': 'Measurement Basis',
        'component.e91.about.measurementBasis': 'A measurement basis is a set of reference orientations used to measure a quantum property, such as the polarization of a photon or the state of a qubit. It is like choosing the angle of your "polarizing filter." The measurement result (for example, +1 or -1, or 0 or 1) depends on the chosen basis. In protocols like BB84 or E91, Alice and Bob randomly choose their bases (denoted a, b, a′, b′, etc.).',

        'component.e91.about.bellInequalities.title': 'Bell Inequalities',
        'component.e91.about.bellInequalities': 'Bell inequalities are a set of mathematical relations that must always be satisfied if nature obeys the laws of classical physics and the idea of local hidden variables (meaning measurement results are predetermined and no information travels faster than light). However, quantum mechanics predicts—and experiments confirm—that certain entangled systems, such as Bell pairs, can violate these inequalities: they exhibit correlations impossible to explain by a classical theory. Testing the violation of Bell inequalities thus proves the existence of quantum entanglement and rules out any explanation by local hidden variables.',

        'component.e91.about.chshInequality.title': 'CHSH Inequality',
        'component.e91.about.chshInequality': 'The CHSH inequality (Clauser, Horne, Shimony, Holt) is a specific and experimentally testable version of the Bell inequalities. It applies to measurements on two entangled qubits, each measured in two different bases. According to classical physics, the value of the parameter S calculated from the measured correlations cannot exceed 2. However, quantum mechanics allows a maximum value of 2√2, thus proving the presence of entanglement and the absence of local hidden variables. In the E91 protocol, verifying this inequality ensures the security of the generated key.',
        'component.e91.createGame.keyMin': 'The minimum number of photon pairs is {minWithEve} when Eve is present, and {minWithoutEve} otherwise.',

        // E91 Solo Game Keys
        'component.e91.backToHome': 'Back to Home',
        'component.e91.measurement.bit': 'Bit',
        'component.e91.autoClassify': 'Auto-Classify',
        'component.e91.classify.error': 'Please classify all photons correctly',
        'component.e91.shortKey': 'Not enough key bits',
        'component.e91.continue': 'Continue',
        'component.e91.continueAnyway': 'Continue Anyway',

        // CHSH Step
        'component.e91.chsh.title': 'CHSH Inequality Test',
        'component.e91.chsh.description': 'The CHSH inequality helps detect eavesdroppers. If S ≤ 2, Eve may be present.',
        'component.e91.chsh.eveWarning': '⚠️ Warning: Potential eavesdropper detected!',
        'component.e91.chsh.noEve': '✅ Channel appears secure',
        'component.e91.chsh.calculate': 'Calculate CHSH Value',
        'component.e91.chsh.below2': 'The calculated S value is ≤ 2, indicating the presence of an eavesdropper.',
        'component.e91.chsh.above2': 'The calculated S value is > 2, confirming quantum correlations.',

        // Solo Results Page
        'component.e91.results.title': 'E91 Solo Game Results',
        'component.e91.results.keyLength': 'Key Length',
        'component.e91.results.yes': 'Yes',
        'component.e91.results.no': 'No',
        'component.e91.results.success': '🎉 Congratulations! Game completed successfully!',
        'component.e91.results.failure': '❌ Game ended.',
        'component.e91.results.replay': 'Play Again',
        'component.e91.results.home': 'Main Menu',

        // Multiplayer Results Page
        'component.results.title': 'Results for game',
        'component.results.waiting': '⏳ Waiting for players to finish their games...',
        'component.results.gamesFinished': 'Some games have finished!',

        // Messaging Step
        'component.messaging.send': 'Send Message',
        'component.messaging.decrypt': 'Decrypt Message',
        'component.messaging.inputPlaceholder': 'Enter your message (0 or 1)',
        'component.messaging.decryptPlaceholder': 'Enter decrypted bit',
        'component.messaging.cipherError': 'Invalid encryption',
        'component.messaging.decryptError': 'Invalid decryption',
        'component.messaging.yourKey': 'Your Key',
        'component.messaging.yourMessage': 'Your Message',
        'component.messaging.aliceEncrypted': 'Alice\'s Encrypted Message',
        'component.messaging.yourEncrypted': 'Your Encrypted Message',
        'component.messaging.aliceDecrypt': 'Decrypted Message',
        'component.messaging.validateAndSend': 'Validate and Send',

        // DPS definitions
        'component.dps.about.cles-chiffrement.title': 'Encryption Key',
        'component.dps.about.cles-chiffrement': 'An encryption key is a secret piece of information, usually a sequence of bits (0s and 1s), shared only between two parties (such as Alice and Bob). It allows, through a cryptographic algorithm, to transform a readable message (plaintext) into an encrypted message (unreadable to others), and then to decrypt it. Unlike a password, the key is not meant to be memorized by a human, but to be used by a computer program. The goal of protocols like E91 or BB84 is to generate and share this key in a perfectly secure way, so that only Alice and Bob can use it to protect their communications.',

        'component.dps.about.polarisation.title': 'Polarizations',
        'component.dps.about.polarisation': 'Polarization describes the orientation in which a light wave (such as a photon) oscillates. Imagine a vibrating string: it can vibrate vertically (↕), horizontally (↔), or diagonally (⤢). For a photon, polarization is a fundamental quantum property that is measured to obtain results of +1 or -1.',

        'component.dps.about.photons.title': 'Photon',
        'component.dps.about.photons': 'It is often said that everything in the universe is made of particles, even light. The particles that make up light are called photons: they are the fundamental "grains" of light energy. In quantum cryptography protocols (such as BB84, E91, etc.), photons are used to carry information between two parties.',

        'component.dps.about.phases.title': 'Phase',
        'component.dps.about.phases.part1': 'The phase of a quantum or classical wave is a quantity that describes the relative position of a point in the cycle of a periodic oscillation. Mathematically, for a complex wave',
        'component.dps.about.phases.equation': '$$\\psi = A e^{i\\phi}$$',
        'component.dps.about.phases.part2': 'the phase φ is the argument of the exponential. Differences in phase between two waves or pulses determine interference phenomena. In quantum cryptography protocols, information can be encoded in the phase difference between successive pulses.',

        'component.dps.about.train-impulsions.title': 'Pulse Train',
        'component.dps.about.train-impulsions': 'A pulse train is a sequence of light pulses (or other signals) emitted at regular time intervals. In quantum cryptography, a photon can be prepared in a superposition state of several temporal pulses, forming a train where information is encoded in the relative phase between pulses.',

        'component.dps.about.impulsion_word': 'Pulse',
        'component.dps.about.impulsion_definition.title': 'Pulse',
        'component.dps.about.impulsion_definition.content': 'A pulse is a brief emission of energy, often light, characterized by its duration, amplitude, and phase. In quantum optics, a pulse corresponds to a light wave packet, used to transmit information or interact with optical devices.',

        'component.dps.about.miroirs-semi-reflechissants.title': 'Semi-reflecting Mirror',
        'component.dps.about.miroirs-semi-reflechissants': 'A semi-reflecting mirror (or beam splitter) is an optical component that divides a light beam in two: one part is reflected, the other transmitted. For a single photon, the mirror creates a quantum superposition of the two possible paths, which is essential for interference experiments.',

        'component.dps.about.etat-superposition.title': 'Superposition State',
        'component.dps.about.etat-superposition': 'Quantum superposition is a fundamental principle of quantum mechanics whereby a system can be described by a linear combination of several eigenstates. This means the system is not in several states at once, but in a unique state that is a mathematical combination of possible states.',

        'component.dps.about.dephasage.title': 'Phase Shift',
        'component.dps.about.dephasage': 'A phase shift is a modification of the phase of a wave or pulse. In quantum optics, a phase shift of π (180°) corresponds to a sign inversion of the amplitude. In the DPS protocol, phase shift is used to encode information in the relative phase of pulses.',

        'component.dps.about.interferometre.title': 'Interferometer',
        'component.dps.about.interferometre': 'An interferometer is an optical device that separates a light beam into several paths, then recombines them to produce interference. The phase difference accumulated between the paths allows measuring physical quantities with high precision.',

        'component.dps.about.operateur-unitaire.title': 'Unitary Operator',
        'component.dps.about.operateur-unitaire': 'A unitary operator is a linear transformation that preserves the norm of state vectors in Hilbert space. In quantum mechanics, the evolution of a closed system is described by a unitary operator, guaranteeing conservation of total probability.',

        'component.homePage.protocolsSection.dps.description': 'The DPS protocol uses the principles' +
            ' of superposition and interference to establish an encryption key shared by Alice and Bob.',
        'component.validation.gameRestarted': 'The game has been restarted.',
        'component.game.playerLeft': 'You\'ve quit the games!',
        'component.game.playerLeft.desc': 'You will be redirected to the home page.',
        'component.header.about.dps': 'About DPS',

        // DPS How to play En --------------------
        'component.dps.howToPlayTitle': 'How to play DPS',
        'component.dps.howToPlayDescription': 'The DPS protocol involves two main actors: Alice and Bob, who play different roles. Here you can explore the steps each must follow to successfully carry out the protocol.',
        'component.dps.howToPlay.Alice.step1.part0': 'For each photon to be sent, generate a random sequence of 3 bits',
        'component.dps.howToPlay.Alice.step1.part1': ' (b₀, b₁, b₂). These bits will be used to encode information as a phase in the pulse train associated with that photon.',
        'component.dps.howToPlay.Alice.step2.part0': 'Generate a pulse train',
        'component.dps.howToPlay.Alice.step2.part1': ' by circulating the photon in a 3-path device.',
        'component.dps.howToPlay.Alice.step3.part0': 'Apply a phase shift of π',
        'component.dps.howToPlay.Alice.step3.part1': ' for which the corresponding bit is 1.',
        'component.dps.howToPlay.Alice.step4.part0': 'Wait for Bob\'s response',
        'component.dps.howToPlay.Alice.step4.part1': ': he will communicate the detection time for each photon (T0, T1, T2, or T3).',
        'component.dps.howToPlay.Alice.step5.part0': 'Build your key',
        'component.dps.howToPlay.Alice.step5.part1': ': Ignore photons detected at T0 and T3. For T1: if b₀ = b₁, the key bit is 0; otherwise, the bit is 1. For T2: if b₁ = b₂, the key bit is 0; otherwise, the bit is 1.',
        'component.dps.howToPlay.Alice.step6.part0': 'Encrypt and send your message',
        'component.dps.howToPlay.Alice.step6.part1': ' to Bob using the obtained key.',
        'component.dps.howToPlay.Bob.step1.part0': 'Receive each photon',
        'component.dps.howToPlay.Bob.step1.part1': ' and measure it with your interferometer.',
        'component.dps.howToPlay.Bob.step2.part0': 'Note the detection time',
        'component.dps.howToPlay.Bob.step2.part1': ' (T0, T1, T2, or T3) and which detector (DET0 or DET1) was activated.',
        'component.dps.howToPlay.Bob.step3.part0': 'Publicly communicate',
        'component.dps.howToPlay.Bob.step3.part1': ' to Alice the detection times for each photon (but keep the detector results secret).',
        'component.dps.howToPlay.Bob.step4.part0': 'Build your encryption key using only the measurements at times T1 and T2',
        'component.dps.howToPlay.Bob.step4.part1': ': DET0 activated = bit 0, DET1 activated = bit 1.',
        'component.dps.howToPlay.Bob.step5.part0': 'Decrypt Alice\'s message',
        'component.dps.howToPlay.Bob.step5.part1': ' using your key.',

        // DPS about (content) in EN
        'component.dps.about.part1.0': 'The Differential <link9>Phase Shift</link9> (DPS) protocol',
        'component.dps.about.part1.1': ' is a quantum protocol for establishing ',
        'component.dps.about.part1.2': '<link1>encryption keys</link1>',
        'component.dps.about.part1.3': '.',
        'component.dps.about.part2': 'Unlike the BB84 and E91 protocols which encode information in the <link2>polarization</link2> of <link3>photons</link3>, the DPS protocol encodes information in the <link4>phases</link4> of a <link5>pulse train</link5>.',
        'component.dps.about.part3': 'The protocol begins with Alice sending single photons into a device comprising three paths: <b>A</b>, <b>B</b> and <b>C</b>.',
        'component.dps.about.part4': 'In this setup, there is the same length difference between paths ',
        'component.dps.about.and': ' and ',
        'component.dps.about.part5': ' as between paths ',
        'component.dps.about.part6': ' Thus, a <link6>pulse</link6> passing through ',
        'component.dps.about.part7': ' is delayed by T compared to a <link6>pulse</link6> passing through ',
        'component.dps.about.part8': '<link7>Beamsplitters</link7> ensure that the photon has the same probability to take any of the three paths. Once the three paths are recombined, the photon is in a <link8>quantum superposition</link8>, ',
        'component.dps.about.part9': ' or equivalently ',
        'component.dps.about.with': 'with ',
        'component.dps.about.part10': ' corresponding to the 1st pulse, ',
        'component.dps.about.part11': ' to the second pulse, and ',
        'component.dps.about.part12': ' to the last pulse of the train. For each photon sent, Alice randomly chooses 3 bits. If the bit is 1, she applies a <link9>phase shift</link9> of π to the corresponding pulse, and does nothing if the bit is 0. For the three pulses there are 8 possible situations, let\'s see four examples ',
        'component.dps.about.part13': 'We note that ',
        'component.dps.about.part14': ' so we can write the photon state using bits ',
        'component.dps.about.part15': ' as follows ',
        'component.dps.about.part16': 'The pulse train is then sent to Bob, whose device (an <link10>interferometer</link10>) is as follows ',
        'component.dps.about.part17': 'Here again, the length difference between paths ',
        'component.dps.about.part18': ' is such that the pulse train passing through path ',
        'component.dps.about.part19': ' is delayed by time T compared to the train passing through ',
        'component.dps.about.part20': 'We can therefore represent the states of the pulse trains at the input of the last semi-reflecting mirror by the states ',
        'component.dps.about.part21': 'Let\'s take an example with bits ',
        'component.dps.about.part22': 'We will then have the following states',
        'component.dps.about.route': 'Path',
        'component.dps.about.part23': 'For two incident rays ',
        'component.dps.about.part24': ' as illustrated in the following figure,',
        'component.dps.about.part25': 'we can describe the <link11>unitary operator</link11> ',
        'component.dps.about.part26': ' associated with the beamsplitter by the transformation',
        'component.dps.about.where': 'where ',
        'component.dps.about.part27': ' represent the amplitudes of states ',
        'component.dps.about.part28': ' respectively.',
        'component.dps.about.part29': ' Applying this transformation, we get ',
        'component.dps.about.part30': 'Taking the states ',
        'component.dps.about.part31': ' described previously, we can calculate the states ' +
            'that result from the interference of the pulses for each time ',
        'component.dps.about.part32': 'We note therefore that if a photon is measured at times ',
        'component.dps.about.or': ' or ',
        'component.dps.about.part33': 'it can be detected by detector 0 or detector 1 with ',
        'component.dps.about.part34': 'a probability of 50%',
        'component.dps.about.part35': ' since',
        'component.dps.about.part36': ' If the photon is measured at times ',
        'component.dps.about.part37': ' the values of ',
        'component.dps.about.part38': ' determine which detector will be activated. In the DPS protocol, only photons measured at times ',
        'component.dps.about.part39': ' are used to establish the key; photons measured at times',
        'component.dps.about.part40': ' are discarded',
        'component.dps.about.part41': 'Let\'s take our example with ',
        'component.dps.about.part42': ' We then have the following probability amplitudes ',
        'component.dps.about.part43': 'In general, if ',
        'component.dps.about.part44': '(phase difference of 0) and the photon is detected at time ',
        'component.dps.about.part45': 'detector 0 is activated and Bob records the bit 0 for his key. Conversely, if ',
        'component.dps.about.part46': '(phase difference of ',
        'component.dps.about.part47': ') and the photon is detected at time ',
        'component.dps.about.part48': 'detector 1 is activated and Bob records the bit 1 for his key.',
        'component.dps.about.part49': 'If the photon is instead detected at time ',
        'component.dps.about.part50': 'then Bob records the bit 0 if ',
        'component.dps.about.part51': ' and the bit 1 otherwise.',
        'component.dps.about.part52': 'Now that we know how Bob can establish the encryption key, he still needs to communicate information to Alice that will allow her to obtain the same key, without the revealed information allowing an external person to deduce this key.',
        'component.dps.about.part53': 'All Bob has to do is to transmit to Alice the detection times of each of the photons. As we have just seen, by knowing the detection time and the value of the bits ',
        'component.dps.about.part54': ' (Alice knows these values since she is the one who generated them), Alice can know which detector measured the photon and therefore, Bob\'s key!',
        'component.dps.about.part55': 'Let\'s see an example in which Alice received the detection times of 6 photons:',
        'component.dps.about.photon': 'Photon',
        'component.dps.about.detectionTime': 'Detection time',
        'component.dps.about.keyBit': 'Key bit',
        'component.dps.about.part56': 'Photons 1 and 5 (in gray) are simply discarded because they were detected at times ',
        'component.dps.about.part57': 'respectively. Photon 2 was detected at time ',
        'component.dps.about.part58': 'so it was the pulses modulated by bits',
        'component.dps.about.part59': ' that interfered. Since the phase difference is π between these 2 pulses, Alice records the bit 1 for her key. For photon 3, Bob announced time ',
        'component.dps.about.part60': 'so it was the pulses modulated by bits ',
        'component.dps.about.part61': ' that interfered. Since no phase shift was applied to these pulses, Alice records the bit 0 for her key. You can do the exercise with photons 4 and 6.',
    },
    {
        // ... (French translations)
        'component.main.name': 'Charlie',
        'component.header.howToPlay': 'Comment jouer',
        'component.header.about': 'À propos',
        'component.header.about.bb84': 'À propos de BB84',
        'component.sidebar.play': 'Jouer',
        'component.main.game': 'Un jeu de chiffrement quantique',
        'component.main.nameRequired': 'Un nom est requis',
        'component.main.nameMin': 'Votre nom doit comporter au moins 2 caractères',
        'component.main.nameMax': 'Votre nom ne peut pas dépasser 10 caractères',
        'component.main.pinRequired': 'Un code de jeu PIN est requis',
        'component.main.pinLength': 'Le code de jeu PIN doit comporter 5' +
            ' caractères',
        'component.main.nameDescription': 'C\'est ainsi que les autres' +
            ' joueurs vous verront',
        'component.main.nameLabel': 'Nom',
        'component.main.pinLabel': 'Code du jeu PIN',
        'component.main.createGame': 'Créer un jeu',
        'component.main.createGame.description': 'Choisissez le nombre de' +
            ' photons et si vous voulez qu\'Ève soit présente dans votre jeu',
        'component.main.createGame.descriptionNoEve': 'Choisissez le nombre de photons',
        'component.main.join': 'Rejoindre',
        'component.main.invalidCodeTitle': 'Erreur lors de la connexion au jeu.',
        'component.main.invalidCodeMessage': 'Vérifiez le code du jeu PIN',
        'component.waitingRoom.players': 'Joueurs',
        'component.waitingRoom.joinAt': 'Rejoignez sur',
        'component.waitingRoom.start': 'Démarrer',
        'component.waitingRoom.exit': 'Quitter',
        'component.waitingRoom.in': 'Vous êtes connecté,',
        'component.waitingRoom.wait': 'Attendez que l\'hôte lance le jeu',
        'component.main.takenNameTitle': 'Nom déjà pris',
        'component.main.takenNameDescription': 'Ce nom est déjà pris. Veuillez' +
            ' en choisir un différent.',
        'component.waitingRoom.gameEndedTitle': 'Partie terminée',
        'component.waitingRoom.gameEndedDescription': 'L\'hôte a mis fin au jeu',
        'component.waitingRoom.atLeastOnePlayer': 'Vous avez besoin d\'au moins un joueur',
        'component.createGame.keyLength': 'Nombre de photons',
        'component.createGame.eve': 'Ève est-elle présente ?',
        'component.createGame.keyError': 'Seuls les chiffres entre 10 et 30 sont autorisés',
        'component.createGame.keyMin': 'Le nombre minimum de photons est' +
            ' 16 si Ève est présente et 10 sinon',
        'component.createGame.keyMax': 'La longueur maximale de la clé est 30',
        'component.createGame.ready': 'Prêt !',
        'component.waitingRoom.connectionLostTitle': 'Connexion perdue',
        'component.waitingRoom.connectionLostDescription': 'Vous avez perdu' +
            ' la connexion au serveur. Essayez de rejoindre le jeu à nouveau',
        'component.waitingRoom.copied': 'Copié !',
        'component.main.gameStarted': 'Jeu commencé',
        'component.main.gameStartedDescription': 'Le jeu auquel vous' +
            ' essayez de vous connecter a déjà commencé.',
        'component.createGame.numbersOnly': 'Seuls les chiffres sont autorisés',
        'component.createGame.validationLength': 'Le nombre de bits de' +
            ' validation doit être inférieur ou égal à la moitié' +
            ' de la longueur de la clé',
        'component.createGame.validationDescription': 'Bits de validation',
        'component.main.errorCreating': 'Erreur lors de la création du jeu',
        'component.createGame.evePercentage.invalidType': 'Doit être entre 0.1 et 1',
        'component.createGame.evePercentage.positive': 'Doit être positif',
        'component.createGame.evePercentage.greaterThan': 'Doit être' +
            ' supérieur ou égal à 0.1',
        'component.createGame.evePercentage.lessThan': 'Doit être inférieur ou égal à 1',
        'component.createGame.evePercentage.label': 'Probabilité d\'Ève',
        'component.bb84.gameFound': 'Partie trouvée !',
        'component.bb84.gameFound.desc': 'Il semble que vous avez quitté' +
            ' une partie alors qu\'elle était encore active. Souhaitez-vous rejoindre ?',
        'component.bb84.gameFound.action': 'Rejoindre',
        'general.close': 'Fermer',
        'component.bb84.play.sorry': 'Désolé, nous n\'avons pas pu trouver' +
            ' de partenaire pour vous :(',
        'component.homePage.protocolsSection.bb84.description': 'Un' +
            ' protocole pour établir de manière sécurisée des clés' +
            ' cryptographiques entre deux parties sur un canal de' +
            ' communication non sécurisé.',
        'component.homePage.protocolsSection.e91.description': 'Le protocole E91 utilise' +
            ' l\'intrication quantique pour garantir la sécurité des communications en' +
            ' permettant aux parties d\'échanger des clés cryptographiques inviolables.',

        'component.homePage.protocolsSection.dps.description': 'Le protocole DPS utilise les principes de superposition et d\'interférence pour établir une clé de chiffrement partagée par Alice et Bob.',

        'component.homePage.title.description': 'Apprenez et pratiquez les protocoles' +
            ' de cryptographie quantique',
        'component.homePage.aboutSection': 'QuantumCrypto est une' +
            ' plateforme web dédiée à l\'éducation à la cryptographie' +
            ' quantique. Elle propose des expériences' +
            ' interactives pour jouer avec différents protocoles.' +
            ' QuantumCrypto vise à combler le fossé entre les concepts' +
            ' quantiques théoriques et la compréhension pratique en' +
            ' permettant aux utilisateurs de participer à des simulations' +
            ' en temps réel de protocoles de cryptographie quantique. Les' +
            ' principales fonctionnalités de notre plateforme sont',
        'component.homePage.userFriendly': 'Profitez d\'une interface' +
            ' utilisateur intuitive conçue pour une meilleure expérience d\'apprentissage.',
        'component.homePage.multiplayer': 'Créez et rejoignez des jeux avec' +
            ' vos amis pour mettre en pratique vos connaissances en cryptographie quantique.',
        'component.homePage.extensible': 'Une conception modulaire permet' +
            ' aux contributeurs d\'étendre notre application avec de' +
            ' nouvelles fonctionnalités, y compris de nouveaux protocoles.',
        'component.homePage.openSource': 'Tout notre code est disponible' +
            ' sur GitHub. Vous trouverez les liens au bas de la page.',
        'component.bb84.about.part1': 'Le protocole BB84 a été proposé en 1984 par Charles Bennett' +
            ' d\'IBM et Gilles Brassard de l\'Université de Montréal',
        'component.bb84.about.part2': '. Il implique deux parties' +
            ' distinctes, Alice et Bob, qui souhaitent établir une <link2>clé de chiffrement</link2>' +
            ' afin de communiquer de manière sécurisée via un <link3>canal public</link3>.' +
            ' Le protocole commence avec Alice qui crée une séquence aléatoire de bits et qui' +
            ' <link5>encode chaque bit</link5> à l\'aide d\'un <link1>photon</link1>. Plus' +
            ' précisément, la valeur du bit est encodée dans un des deux <link6>états mutuellement' +
            ' orthogonaux</link6> de la polarisation du photon. ' +
            'De plus, pour chaque photon, la base utilisée pour décrire la polarisation de la lumière est choisie au hasard parmi deux bases possibles. Alice envoie ensuite ces photons à Bob via un <link4>canal quantique</link4> public. Lorsque' +
            ' Bob reçoit les photons, il les mesure en utilisant une des deux bases également choisies' +
            ' au hasard. Ensuite, Alice et Bob annoncent publiquement les bases qu\'ils ont utilisées' +
            ' pour encoder et mesurer chaque photon. Une clé est formée en conservant seulement les bits' +
            ' pour lesquels les bases utilisées par Alice et Bob correspondent. ' +
            'Enfin, en comparant un sous-ensemble des bits de leur clé, Alice et Bob peuvent détecter la <link8>présence d\'un espion</link8>, généralement appelé Ève, et s\'assurer ainsi de la sécurité de leur canal' +
            ' de communication quantique. En effet, en raison des principes fondamentaux de la mécanique' +
            ' quantique, toute tentative par Ève d\'intercepter et de mesurer ces photons' +
            ' <link7>perturbera leur état</link7>, introduisant ainsi des incohérences qu\'Alice et Bob' +
            ' peuvent détecter. S\'ils concluent que le canal quantique n\'a pas été compromis, ils peuvent' +
            ' utiliser la clé de chiffrement générée pour envoyer un message en toute sécurité. Sinon,' +
            ' ils doivent recommencer la procédure.',
        'component.bb84.about.encryptionKey.title': 'Clé de chiffrement ',
        'component.bb84.about.encryptionKey.part1': 'Une clé de chiffrement est un code secret (en bits) qui' +
            ' permet de protéger des informations en les transformant en un format illisible. Seules les' +
            ' personnes possédant la clé de déchiffrement pourront restaurer le message original. La clé de' +
            ' déchiffrement peut être la même clé (on parle alors de clés symétriques), ou une clé différente' +
            ' (clés asymétriques). Prenons un exemple de chiffrement avec clés symétriques dans lequel Alice et' +
            ' Bob possèdent la clé de chiffrement suivante : 010010. Si Alice souhaite transmettre un message à' +
            ' Bob de manière confidentielle, elle effectue l\'opération XOR (OU-exclusif) bit par bit entre la' +
            ' clé et son message. Voici comment fonctionne l\'opération XOR pour les différentes valeurs possibles' +
            ' des bits b0 et b1: ',
        'component.bb84.about.encryptionKey.part2': 'Supposons que le message qu\'elle veuille envoyer à Bob est' +
            ' 111000. L\'opération de chiffrement génère la séquence 101010 comme on peut le voir dans ce tableau',
        'component.bb84.about.encryptionKey.part3': 'Cette séquence est transmise à Bob qui, puisqu\'il est la' +
            ' seule autre personne possédant la clé, peut déchiffrer le message en appliquant à son tour' +
            ' l\'opération XOR bit par bit entre le message chiffré et la clé.',
        'component.bb84.about.encryptionKey.message': 'Message',
        'component.bb84.about.encryptionKey.key': 'Clé',
        'component.bb84.about.encryptionKey.cypher': 'Message encrypté',
        'component.bb84.about.photon.title': 'Photon',
        'component.bb84.about.photon': 'On dit bien souvent que tout dans l\'univers est composé de particules,' +
            ' même la lumière. En effet, les particules qui composent la lumière sont appelées photons, et ils' +
            ' sont responsables de transporter l\'énergie lumineuse. Le protocole BB84 utilise la polarisation' +
            ' des photons pour envoyer l\'information des bits (0 ou 1). En effet, cette propriété quantique' +
            ' essentielle des particules de lumière assure la sécurité du protocole.',
        'component.bb84.about.publicPrivate.title': 'Canal public vs privé ',
        'component.bb84.about.publicPrivate': 'Un canal public est un moyen de communication où tout le monde' +
            ' peut potentiellement écouter les messages échangés, comme si vous parliez à voix haute dans une' +
            ' pièce pleine de gens. Un canal privé, en revanche, garantit que la communication se fait seulement' +
            ' entre les personnes concernées sans possibilité d\'interception, un peu comme une conversation à' +
            ' voix basse entre deux interlocuteurs où personne d\'autre ne peut entendre. Comme il peut être' +
            ' difficile de garantir le caractère privé d\'un canal de communication, la cryptographie est utilisée' +
            ' pour rendre les messages incompréhensibles sur un canal public et ainsi protéger la confidentialité' +
            ' des données. ',
        'component.bb84.about.classicalQuantum.title': 'Canal classique vs quantique',
        'component.bb84.about.classicalQuantum': 'Un canal classique est un moyen de communication conçu pour transmettre de l\'information classique, comme des messages binaires ou textuels. L\'envoie d\'information quantique à travers un canal classique pose de grands défis de performance étant donné le bruit induit par l\'information classique qui y circule. En revanche, un canal quantique est conçu pour transmettre de l\'information quantique, comme l\'état d\'un photon. Ce canal permet de conserver les propriétés quantiques de l\'information, garantissant ainsi une grande probabilité que la bonne information soit reçue de l\'autre côté, intacte. ',
        'component.bb84.about.encoding.title': 'Encodage d\'un bit dans un photon ',
        'component.bb84.about.encoding': 'L\'encodage d\'un bit dans un photon fait référence à la façon dont on utilise la polarisation des photons pour représenter des bits (0 ou 1). La polarisation est une propriété des photons qui décrit la direction dans laquelle leur champ électrique oscille. Dans le protocole BB84, cette polarisation est utilisée pour encoder des bits en choisissant entre deux bases : la base + et la base x. Dans la base +, un photon polarisé horizontalement (↔) représente le bit 0, tandis qu\'un photon polarisé verticalement (↕) représente le bit 1. Dans la base x, un photon polarisé en diagonale (⤢) représente le bit 0, et un photon polarisé en diagonale opposée (⤡) représente le bit 1. Alice encode alors chaque bit de cette manière avant de l\'envoyer à Bob.',
        'component.bb84.about.orthogonal.title': 'Base orthogonale ',
        'component.bb84.about.orthogonal': 'Si on considère le plan cartésien à 2 dimensions, une base est un ensemble de deux vecteurs, v0 et v1, qui permet de représenter n\'importe quel vecteur du plan par une combinaison linéaire de v0 et v1. Lorsque v0 et v1 forment un angle de 90o, ils sont orthogonaux et ils forment une base orthogonale. Une base naturelle consiste à prendre un vecteur aligné avec l\'axe des x et un autre aligné avec l\'axe des y, ce qu\'on appelle la base + dans le protocole BB84. En effectuant une rotation de 45o des deux vecteurs de la base +, on obtient la base x. En associant les bits 0 et 1 aux vecteurs orthogonaux d\'une base, on s\'assure que Bob mesure toujours la valeur qui avait été encodée par Alice lorsque la même base est utilisée. Il s\'agit d\'une conséquence de l\'utilisation d\'une base orthogonale et de la règle de Born, qui stipule que la probabilité d\'un résultat de mesure correspond au carré de la composante du vecteur de polarisation, exprimé dans cette base. Si les bases d\'Alice et de Bob ne concordent pas, le vecteur de polarisation du photon envoyé par Alice s\'exprime alors comme une combinaison linéaire des vecteurs de la base de mesure de Bob. Le résultat de la mesure est alors aléatoire.',
        'component.bb84.about.disturbance.title': 'Perturbation de l\'état par la mesure',
        'component.bb84.about.disturbance': 'On entend souvent qu\'un système quantique peut être « dans deux états en même temps », c\'est-à-dire en superposition d\'états. Cela signifie que si on mesure le système, on ne peut pas prédire quel sera le résultat de la mesure, mais on connaît avec quelle probabilité chacun des résultats peut être observé. Une fois la mesure effectuée, l\'état de superposition est détruit et le système est dans l\'état qui a été mesuré. Une nouvelle mesure donnerait le même résultat. ',
        'component.bb84.about.eve.title': 'Détection de la présence d\'Ève',
        'component.bb84.about.eve': 'Considérons seulement les photons pour lesquels Alice et Bob ont utilisé la même base puisque ce sont ces photons qui servent à établir la clé. Pour détenir de l\'information sur la clé, Ève doit choisir dans quelle base elle mesure les photons qu\'elle intercepte. Pour un de ces photons, supposons qu\'Alice et Bob utilisent la base +. Si, par chance, Ève choisit également la base +, elle mesurera à coup sûr la bonne valeur puis pourra retransmettre le bit dans un nouveau photon de même polarisation. La présence d\'Eve ne peut pas être détectée dans ce cas-ci. Si elle fait plutôt sa mesure dans la base x, ce qui a une chance sur deux de se produire, Ève transmettra à Bob un photon polarisé en superposition d\'états par rapport à la base +. Le résultat de la mesure de Bob est alors probabiliste et la présence d\'Ève peut être détectée.',
        'component.homePage.userFriendlyTitle': 'Convivial',
        'component.homePage.multiplayerTitle': 'Expérience multijoueur',
        'component.homePage.extensibleTitle': 'Hautement extensible',
        'component.bb84.aboutTitle': 'À propos du protocole',
        'component.header.protocols': 'Protocoles',
        'component.header.guide': 'Guide',
        'component.header.guide.howToPlay': 'Comment jouer',
        'component.header.guide.terminology': 'Terminologie',
        'component.header.guide.context': 'Contexte',
        'component.header.guide.comingSoon': 'Bientôt disponible',
        'component.header.guide.comingSoonDesc': 'Cette section est en cours de construction. Revenez bientôt !',
        'component.header.guide.howToPlayDesc': 'Apprenez à jouer à chaque protocole de cryptographie quantique.',
        'component.header.guide.terminologyDesc': 'Définitions clés utilisées dans tous les protocoles de cryptographie quantique.',
        'component.bb84.howToPlayTitle': 'Comment jouer à BB84',
        'component.bb84.howToPlayDescription': 'Le protocole BB84 implique' +
            ' deux acteurs principaux : Alice et Bob, qui jouent des rôles' +
            ' différents. Vous pouvez ici explorer l\'ensemble des étapes' +
            ' que chacun d\'eux doit suivre pour mener à bien le protocole.',
        'component.bb84.steps.step1Alice': ' composée de 0 et de 1. Cette chaîne' +
            ' sera utilisée pour construire votre clé de chiffrement.',
        'component.bb84.steps.step2Alice': ' un ensemble de bases pour' +
            ' encoder chacun des bits. Vous pouvez choisir entre les bases +' +
            ' et x.',
        'component.bb84.steps.step3Alice': ' dans la polarisation de vos' +
            ' photons.',
        'component.bb84.steps.step4Alice': ' avec Bob et attendez qu\'il' +
            ' termine la réception et la mesure.',
        'component.bb84.steps.step5Alice': ' et supprimez les bits où les bases ne correspondent pas.',
        'component.bb84.steps.step6Alice': ' en vérifiant' +
            ' que' +
            ' les bits sélectionnés aléatoirement à partir de votre clé' +
            ' brute correspondent à ceux de Bob. S\'ils correspondent, vous' +
            ' pouvez supposer que la probabilité qu\'un espion soit présent' +
            ' est très faible et vous pouvez utiliser la clé en toute' +
            ' sécurité. Sinon, vous avez détecté la présence d\'un espion et' +
            ' vous devez redémarrer le protocole.',
        'component.bb84.steps.step7Alice': ' à Bob.',
        'component.bb84.highlights.highlight1Alice': 'Créez une chaîne de bits' +
            ' aléatoire',
        'component.bb84.highlights.highlight2Alice': 'Sélectionnez' +
            ' aléatoirement un ensemble de bases',
        'component.bb84.highlights.highlight3Alice': 'Encodez vos bits',
        'component.bb84.highlights.highlight4Alice': 'Partagez vos photons',
        'component.bb84.highlights.highlight5Alice': 'Comparez vos bases' +
            ' avec celles de Bob',
        'component.bb84.highlights.highlight6Alice': 'Validez votre clé',
        'component.bb84.highlights.highlight7Alice': 'Chiffrez et envoyez' +
            ' votre message',
        'component.bb84.additionalStep': 'Dans le jeu BB84 de QuantumCrypto, ce ne' +
            ' sont pas toutes les parties qui ont un espion. Cette prochaine étape ne s\'applique' +
            ' que s\'il y en a un dans votre jeu. Ce que vous découvrirez à la fin!',
        'component.bb84.rawKeyInfo': 'À ce stade, vous possédez la « clé' +
            ' brute », qui sera utilisée pour détecter la présence d\'un' +
            ' espion.',
        'component.bb84.steps.step1Bob': ' pour mesurer chacun des photons d\'Alice.' +
            ' Vous pouvez choisir entre les bases + et x.',
        'component.bb84.steps.step2Bob': ' et notez vos' +
            ' résultats.',
        'component.bb84.steps.step3Bob': ' avec Alice.',
        'component.bb84.steps.step4Bob': ' et supprimez les bits où les' +
            ' bases ne correspondent pas.',
        'component.bb84.steps.step5Bob': ' en vérifiant' +
            ' que les bits sélectionnés aléatoirement à partir de votre clé' +
            ' brute correspondent à ceux de Bob. S\'ils correspondent,' +
            ' vous pouvez supposer que la probabilité qu\'un espion soit' +
            ' présent est très faible, et vous pouvez utiliser la clé en' +
            ' toute sécurité. Sinon, vous avez détecté la présence d\'un' +
            ' espion et devez redémarrer le protocole.',
        'component.bb84.steps.step6Bob': ' à' +
            ' l\'aide de votre clé.',
        'component.bb84.highlights.highlight1Bob': 'Sélectionnez' +
            ' aléatoirement un ensemble de bases',
        'component.bb84.highlights.highlight2Bob': 'Mesurez les photons',
        'component.bb84.highlights.highlight3Bob': 'Partagez vos bases',
        'component.bb84.highlights.highlight4Bob': 'Comparez vos bases à' +
            ' celles d\'Alice',
        'component.bb84.highlights.highlight5Bob': 'Validez votre clé',
        'component.bb84.highlights.highlight6Bob': 'Déchiffrez le message' +
            ' d\'Alice',
        'component.bb84.playSolo': 'Jouer solo',
        'component.bb84.startSolo': 'Commencer une partie solo',
        'component.bb84.soloRoleSelect': 'Sélectionnez votre rôle',
        'component.e91.playSolo': 'Jouer solo',
        'component.e91.startSolo': 'Commencer une partie solo',
        'component.e91.soloRoleSelect': 'Sélectionnez votre rôle',
        'component.quantumCrypto.gamesPlayed': 'Nombre de parties jouées:',
        'component.header.about.e91': 'À propos de E91',
        'component.e91.howToPlayTitle': 'Comment jouer à E91',
        'component.e91.howToPlayDescription': 'Le protocole E91 implique' +
            ' deux acteurs principaux : Alice et Bob, qui jouent des rôles' +
            ' différents. Vous pouvez ici explorer l\'ensemble des étapes' +
            ' que chacun d\'eux doit suivre pour mener à bien le protocole.',
        'component.e91.results.room': 'Salle',
        'component.e91.results.evePresent': 'Ève présente',
        'component.e91.results.eveDetected': 'Ève détectée',
        'component.e91.results.time': 'Temps',
        'component.e91.results.score': 'Points',
        'component.e91.highlights.highlight1': 'Choisissez de façon aléatoire une base de mesure pour les photons incidents.',
        'component.e91.steps.step1': ' Notez que chacun des photons que vous recevez forme une paire de Bell avec un autre photon qui est reçu par Bob.',
        'component.e91.highlights.highlight2': 'Partagez vos bases de mesure',
        'component.e91.steps.step2Alice': ' avec Bob.',
        'component.e91.steps.step2Bob': ' avec Alice.',
        'component.e91.highlights.highlight3': 'Extrayez votre clé de chiffrement',
        'component.e91.steps.step3': ' à partir des résultats de mesure obtenus pour des paires de' +
            ' bases identiques.',
        'component.e91.highlights.highlight4': 'Validez votre clé',
        'component.e91.steps.step4': ' en testant l\'inégalité de CHSH avec les mesures effectuées avec les autres' +
            ' combinaisons de bases.',
        'component.e91.highlights.highlight5Alice': 'Chiffrez et envoyez votre message',
        'component.e91.steps.step5Alice': ' à Bob.',
        'component.e91.highlights.highlight5Bob': 'Déchiffrez le message d\'Alice',
        'component.e91.steps.step5Bob': ' en utilisant votre clé.',
        'component.e91.about.part1.0': 'Le protocole a été proposé en 1991 par Artur Ekert',
        'component.e91.about.part1.1': '. Il implique deux parties distinctes, Alice et Bob, qui souhaitent établir <link2>une clé de chiffrement</link2> afin de communiquer de manière sécurisée via <link3>un canal public</link3>. Dans ce protocole, Alice et Bob reçoivent tous les deux <link1>un photon</link1> provenant d\'une source qui émet des paires de photons dont les <link4>polarisations</link4> sont <link5>maximalement intriquées</link5> : les photons forment ce qu\'on appelle des <link6>paires de Bell</link6>. Pour chaque paire, la polarisation d\'un photon est mesurée par Alice et l\'autre par Bob. Alice effectue chaque mesure en choisissant aléatoirement <link7>une base</link7> parmi l\'ensemble de trois bases {a, b, a′}. Bob fait de même en choisissant parmi les bases {b, a′, b′}. Parmi les bases de mesure à leur disposition, Alice et Bob en ont donc 2 qu\'ils partagent, b et a′.',
        'component.e91.about.part2': 'Bob fait de même en choisissant parmi les bases',
        'component.e91.about.part3': '. Parmi les bases de mesure à leur disposition, Alice et Bob en ont donc 2 qu\'ils partagent, ',
        'component.e91.about.figures.title': 'Figure des bases ',
        'component.e91.about.figures.part1': 'Pour chaque mesure, Alice et Bob enregistrent le résultat : +1 ou -1. Une fois la transmission des paires de photons terminée et les mesures effectuées, Alice et Bob divulguent les bases de mesure qu\'ils ont utilisées pour chaque photon. Les résultats des mesures effectuées dans la même base sont conservés pour former la clé de chiffrement. Cette situation survient en moyenne 2 fois sur 9 : lorsqu\'Alice et Bob mesurent tous les deux dans la base b ou encore dans la base a\'. Les résultats des mesures effectuées dans des bases différentes sont révélés et utilisés pour valider la sécurité de la source et du canal quantique qui ont été utilisés. Pour ce faire, le protocole E91 s\'appuie une des expériences les plus spectaculaires de la mécanique quantique : la vérification des inégalités de Bell. Il existe plusieurs formulations de ces inégalités et le protocole E91 s\'appuie spécifiquement sur l\'inégalité de CHSH. Alice et Bob travailleront seulement avec les résultats des mesures effectuées dans les bases suivantes ',
        'component.e91.about.figures.part2': 'Ce sont donc, en moyenne, 4 paires de photons sur 9 qui sont utilisées pour vérifier l\'inégalité de CHSH. Pour chaque paire de résultats issus des combinaisons de bases du tableau précédent, Alice et Bob calculent le produit mA × mB où mA et mB sont les résultats de la mesure effectuée par Alice et Bob respectivement. La moyenne des produits est ensuite calculée pour chacune des combinaisons de base. ',
        'component.e91.about.figures.part3': 'En guise d\'exemple, supposons qu\'Alice et Bob ont effectué les mesures suivantes:',
        'component.e91.about.figures.part4': 'Le calcul des moyennes (corrélation E(a,b)) donne :',
        'component.e91.about.figures.part5': 'L\'inégalité de CHSH consiste à vérifier que',
        'component.e91.about.figures.chsh.classical': 'Limite classique : S ≤ 2 (inégalité de Bell)',
        'component.e91.about.figures.chsh.quantum': 'Maximum quantique : S = 2√2 ≈ 2.83 (borne de Tsirelson)',
        'component.e91.about.figures.chsh.example': 'Notre exemple : S = |0.33 + 0 + 1 - 0| = 1.33 ≤ 2 ✓',
        'component.e91.about.figures.noMeasurements': 'aucune mesure dans cet exemple',
        'component.e91.about.figures.part6': 'Il s\'avère que lorsque S est calculé à partir de photons intriqués, cette inégalité n\'est pas vérifiée. En fait, on peut montrer que 𝑆 = 2√2 ≈ 2.83 pour des photons maximalement intriqués. Ainsi, si l\'émetteur de paires de photons est fiable et que le canal de communication n\'est pas bruité – ou pire espionné ! – Alice et Bob devraient observer que la valeur de S tend vers 2√2 au fur et à mesure qu\'ils augmentent le nombre de paires de photons considérées dans leur calcul. Ils pourront alors utiliser la clé qu\'ils ont obtenue pour chiffrer leur message. À l\'inverse, si cette valeur demeure sous 2 ils ne peuvent avoir confiance en la clé obtenue et devraient s\'abstenir de l\'utiliser. Attention, les valeurs moyennes sont des quantités statistiques qui nécessitent un grand échantillon pour être significatives. Pour un nombre limité d\'échantillons des anomalies statistiques peuvent survenir et il peut être difficile de tirer des conclusions. ',
        'component.e91.about.figures.part7.1': 'Notez qu\'il reste 3 combinaisons de bases de mesure qui ne sont pas utilisées dans le protocole E91 : ',
        'component.e91.about.figures.part7.2': 'Les mesures effectuées avec ces paires de bases sont simplement jetées. ',

        // E91 definitions FR
        'component.e91.about.photon.title': 'Photon',
        'component.e91.about.photon': 'On dit souvent que tout dans l\'univers est composé de particules, même la lumière. Les particules qui composent la lumière sont appelées photons : ce sont les "grains" fondamentaux de l\'énergie lumineuse. Dans les protocoles de cryptographie quantique (comme BB84, E91…), les photons servent à transporter l\'information entre deux parties. Leur propriété de polarisation permet de coder les bits (0 ou 1), tandis que leur nature quantique garantit la sécurité de la transmission : toute tentative d\'interception modifie l\'état du photon et peut être détectée.',

        'component.e91.about.encryptionKey.title': 'Clé de chiffrement',
        'component.e91.about.encryptionKey': 'Une clé de chiffrement est une information secrète, généralement une suite de bits (0 et 1), partagée uniquement entre deux parties (comme Alice et Bob). Elle permet, grâce à un algorithme cryptographique, de transformer un message lisible (texte clair) en un message chiffré (illisible pour les autres), puis de le déchiffrer. Contrairement à un mot de passe, la clé n\'est pas destinée à être mémorisée par un humain, mais à être utilisée par un programme informatique. L\'objectif des protocoles comme BB84, E91 ou DPS est de générer et partager cette clé de façon parfaitement sécurisée, afin que seuls Alice et Bob puissent l\'utiliser pour protéger leurs communications.',

        'component.e91.about.publicPrivate.title': 'Canal public (et privé)',
        'component.e91.about.publicPrivate': 'Un canal public est un moyen de communication (comme Internet, une fibre optique ou une ligne téléphonique) où toute personne peut potentiellement intercepter ou écouter les messages échangés, un peu comme parler à voix haute dans une pièce pleine de monde. À l\'inverse, un canal privé garantit que seuls les interlocuteurs concernés peuvent accéder à la communication, comme une conversation à voix basse à l\'écart. Dans la pratique, il est difficile d\'assurer la confidentialité d\'un canal : c\'est pourquoi la cryptographie est utilisée pour rendre les messages incompréhensibles sur un canal public. Dans les protocoles de cryptographie quantique (BB84, E91, DPS…), la sécurité repose sur la physique quantique, et non sur la confidentialité du canal.',

        'component.e91.about.polarization.title': 'Polarisations',
        'component.e91.about.polarization': 'La polarisation décrit l\'orientation dans laquelle une onde lumineuse (comme un photon) oscille. Imaginez une corde qui vibre : elle peut le faire verticalement (↕), horizontalement (↔) ou en diagonale (⤢). Pour un photon, la polarisation est une propriété quantique fondamentale qui est mesurée pour obtenir les résultats +1 ou -1.',

        'component.e91.about.maximallyEntangled.title': 'Maximalement intriquées',
        'component.e91.about.maximallyEntangled.part1': 'Deux particules (ou qubits) sont dites « intriquées » lorsqu\'elles partagent un état quantique commun : leurs résultats de mesure sont corrélés de façon telle qu\'il est impossible de les décrire séparément, même à distance. On parle d\'« intrication maximale » lorsque la corrélation entre les résultats de mesure est la plus forte possible, c\'est-à-dire que les résultats sont parfaitement corrélés ou anticorrélés selon la base choisie (si l\'on mesure l\'une, on connaît immédiatement le résultat de la mesure de l\'autre).',
        'component.e91.about.maximallyEntangled.part2': 'Mathématiquement, un état d\'intrication maximale s\'écrit sous la forme d\'une superposition où chaque résultat possible a la même probabilité : par exemple, pour deux qubits, l\'état',
        'component.e91.about.maximallyEntangled.equation1': '$$\\left|\\Phi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle + |11\\rangle)$$',
        'component.e91.about.maximallyEntangled.part3': 'signifie que les deux particules sont toujours identiques (00 ou 11), chacune avec une probabilité de 1/2. L\'« amplitude » 1/√2 assure cette probabilité égale.',
        'component.e91.about.maximallyEntangled.part4': 'Il existe aussi des états intriqués non maximaux, où les amplitudes ne sont pas égales (par exemple, \\(\\alpha \\lvert 00 \\rangle + \\beta \\lvert 11 \\rangle\\) avec \\(\\lvert\\alpha\\rvert^{2} \\neq \\lvert\\beta\\rvert^{2}\\)). Dans ce cas, les corrélations sont plus faibles et l\'état n\'est pas aussi utile pour la cryptographie quantique.',
        'component.e91.about.maximallyEntangled.part5': 'L\'intrication maximale est essentielle pour garantir la sécurité des protocoles quantiques : toute tentative d\'interception modifie ces corrélations parfaites et peut être détectée.',

        'component.e91.about.bellPairs.title': 'Paires de Bell',
        'component.e91.about.bellPairs.part1': 'Les paires de Bell sont des paires de qubits (particules quantiques, comme des photons) préparées dans l\'un des quatre états d\'intrication quantique maximale, appelés états de Bell. Ces états présentent des corrélations parfaites, impossibles à reproduire avec la physique classique, et sont fondamentaux pour de nombreux protocoles de cryptographie quantique. Les quatre états de Bell sont :',
        'component.e91.about.bellPairs.equation1': '$$\\left|\\Phi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle + |11\\rangle)$$',
        'component.e91.about.bellPairs.equation2': '$$\\left|\\Phi^-\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle - |11\\rangle)$$',
        'component.e91.about.bellPairs.equation3': '$$\\left|\\Psi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|01\\rangle + |10\\rangle)$$',
        'component.e91.about.bellPairs.equation4': '$$\\left|\\Psi^-\\right\\rangle = \\frac{1}{\\sqrt{2}} (|01\\rangle - |10\\rangle)$$',
        'component.e91.about.bellPairs.part2': 'Ils portent le nom du physicien John Stewart Bell. Dans les protocoles comme E91, ces paires assurent la sécurité grâce à l\'intrication maximale : toute tentative d\'interception altère les corrélations et peut être détectée.',

        'component.e91.about.measurementBasis.title': 'Base (de mesure)',
        'component.e91.about.measurementBasis': 'Une base de mesure est un ensemble d\'orientations de référence utilisées pour mesurer une propriété quantique, comme la polarisation d\'un photon ou l\'état d\'un qubit. C\'est comme choisir l\'angle de son « filtre polarisant ». Le résultat de la mesure (par exemple, +1 ou -1, ou bien 0 ou 1) dépend de la base choisie. Dans les protocoles comme BB84 ou E91, Alice et Bob choisissent aléatoirement leurs bases (notées a, b, a′, b′…).',

        'component.e91.about.bellInequalities.title': 'Inégalités de Bell',
        'component.e91.about.bellInequalities': 'Les inégalités de Bell sont un ensemble de relations mathématiques qui doivent toujours être respectées si la nature obéit aux lois de la physique classique et à l\'idée de variables cachées locales (c\'est-à-dire que les résultats des mesures sont prédéterminés et aucune information ne voyage plus vite que la lumière). Or, la mécanique quantique prédit – et l\'expérience confirme – que certains systèmes intriqués, comme les paires de Bell, peuvent violer ces inégalités : ils présentent des corrélations impossibles à expliquer par une théorie classique. Tester la violation des inégalités de Bell permet donc de prouver l\'existence de l\'intrication quantique et d\'écarter toute explication par des variables cachées locales.',

        'component.e91.about.chshInequality.title': 'L\'inégalité de CHSH',
        'component.e91.about.chshInequality': 'L\'inégalité de CHSH (Clauser, Horne, Shimony, Holt) est une version particulière et testable expérimentalement des inégalités de Bell. Elle s\'applique à des mesures sur deux qubits intriqués, chacun mesuré selon deux bases différentes. Selon la physique classique, la valeur du paramètre S calculé à partir des corrélations mesurées ne peut pas dépasser 2. Or, la mécanique quantique permet d\'atteindre une valeur maximale de 2√2, prouvant ainsi la présence d\'intrication et l\'absence de variables cachées locales. Dans le protocole E91, la vérification de cette inégalité garantit la sécurité de la clé générée.',
        'component.e91.createGame.keyMin': 'Le nombre minimal de paires de photons est de {minWithEve} lorsqu\'Ève est présente et de {minWithoutEve} dans le cas contraire.',

        // E91 Solo Game Keys FR
        'component.e91.backToHome': 'Retour à l\'accueil',
        'component.e91.measurement.bit': 'Bit',
        'component.e91.autoClassify': 'Auto-Classification',
        'component.e91.classify.error': 'Veuillez classifier tous les photons correctement',
        'component.e91.shortKey': 'Pas assez de bits de clé',
        'component.e91.continue': 'Continuer',
        'component.e91.continueAnyway': 'Continuer quand même',

        // CHSH Step FR
        'component.e91.chsh.title': 'Test de l\'inégalité CHSH',
        'component.e91.chsh.description': 'L\'inégalité CHSH aide à détecter les espions. Si S ≤ 2, Ève peut être présente.',
        'component.e91.chsh.eveWarning': '⚠️ Attention : Espion potentiel détecté !',
        'component.e91.chsh.noEve': '✅ Le canal semble sécurisé',
        'component.e91.chsh.calculate': 'Calculer la valeur CHSH',
        'component.e91.chsh.below2': 'La valeur S calculée est ≤ 2, indiquant la présence d\'un espion.',
        'component.e91.chsh.above2': 'La valeur S calculée est > 2, confirmant les corrélations quantiques.',

        // Solo Results Page FR
        'component.e91.results.title': 'Résultats E91 Mode Solo',
        'component.e91.results.keyLength': 'Longueur de Clé',
        'component.e91.results.yes': 'Oui',
        'component.e91.results.no': 'Non',
        'component.e91.results.success': '🎉 Félicitations ! Partie terminée avec succès !',
        'component.e91.results.failure': '❌ Partie terminée.',
        'component.e91.results.replay': 'Rejouer',
        'component.e91.results.home': 'Menu Principal',

        // Multiplayer Results Page FR
        'component.results.title': 'Résultats de la partie',
        'component.results.waiting': '⏳ En attente que les joueurs terminent leurs parties...',
        'component.results.gamesFinished': 'Des parties sont terminées !',

        // Messaging Step FR
        'component.messaging.send': 'Envoyer le message',
        'component.messaging.decrypt': 'Déchiffrer le message',
        'component.messaging.inputPlaceholder': 'Entrez votre message (0 ou 1)',
        'component.messaging.decryptPlaceholder': 'Entrez le bit déchiffré',
        'component.messaging.cipherError': 'Chiffrement invalide',
        'component.messaging.decryptError': 'Déchiffrement invalide',
        'component.messaging.yourKey': 'Votre clé',
        'component.messaging.yourMessage': 'Votre message',
        'component.messaging.aliceEncrypted': 'Message chiffré d\'Alice',
        'component.messaging.yourEncrypted': 'Votre message chiffré',
        'component.messaging.aliceDecrypt': 'Message déchiffré',
        'component.messaging.validateAndSend': 'Valider et envoyer',

        // DPS definitions FR
        'component.dps.about.cles-chiffrement.title': 'Clé de chiffrement',
        'component.dps.about.cles-chiffrement': 'Une clé de chiffrement est une information secrète, généralement une suite de bits (0 et 1), partagée uniquement entre deux parties (comme Alice et Bob). Elle permet, grâce à un algorithme cryptographique, de transformer un message lisible (texte clair) en un message chiffré (illisible pour les autres), puis de le déchiffrer.',

        'component.dps.about.polarisation.title': 'Polarisations',
        'component.dps.about.polarisation': 'La polarisation décrit l\'orientation dans laquelle une onde lumineuse (comme un photon) oscille. Imaginez une corde qui vibre : elle peut le faire verticalement (↕), horizontalement (↔) ou en diagonale (⤢). Pour un photon, la polarisation est une propriété quantique fondamentale qui est mesurée pour obtenir les résultats +1 ou -1.',

        'component.dps.about.photons.title': 'Photon',
        'component.dps.about.photons': 'On dit souvent que tout dans l\'univers est composé de particules, même la lumière. Les particules qui composent la lumière sont appelées photons : ce sont les "grains" fondamentaux de l\'énergie lumineuse. Dans les protocoles de cryptographie quantique (comme BB84, E91…), les photons servent à transporter l\'information entre deux parties.',

        'component.dps.about.phases.title': 'Phase',
        'component.dps.about.phases.part1': 'La phase d\'une onde quantique ou classique est une grandeur qui décrit la position relative d\'un point dans le cycle d\'une oscillation périodique. Mathématiquement, pour une onde complexe',
        'component.dps.about.phases.equation': '$$\\psi = A e^{i\\phi}$$',
        'component.dps.about.phases.part2': 'la phase φ est l\'argument de l\'exponentielle. Les différences de phase entre deux ondes ou impulsions déterminent les phénomènes d\'interférence. Dans les protocoles de cryptographie quantique, l\'information peut être encodée dans la différence de phase entre des impulsions successives.',

        'component.dps.about.train-impulsions.title': 'Train d\'impulsions',
        'component.dps.about.train-impulsions': 'Un train d\'impulsions est une séquence d\'impulsions lumineuses (ou d\'autres signaux) émises à des intervalles de temps réguliers. En cryptographie quantique, un photon peut être préparé dans un état de superposition de plusieurs impulsions temporelles, formant ainsi un train où l\'information est encodée dans la phase relative entre les impulsions.',

        'component.dps.about.impulsion_word': 'Impulsion',
        'component.dps.about.impulsion_definition.title': 'Impulsion',
        'component.dps.about.impulsion_definition.content': 'Une impulsion est une brève émission d\'énergie, souvent lumineuse, caractérisée par sa durée, son amplitude et sa phase. En optique quantique, une impulsion correspond à un paquet d\'onde de lumière, utilisé pour transmettre de l\'information ou interagir avec des dispositifs optiques.',

        'component.dps.about.miroirs-semi-reflechissants.title': 'Miroir semi-réfléchissant',
        'component.dps.about.miroirs-semi-reflechissants': 'Un miroir semi-réfléchissant (ou séparateur de faisceau) est un composant optique qui divise un faisceau lumineux en deux : une partie est réfléchie, l\'autre transmise. Pour un photon unique, le miroir crée une superposition quantique des deux chemins possibles, ce qui est essentiel pour les expériences d\'interférence.',

        'component.dps.about.etat-superposition.title': 'État de superposition',
        'component.dps.about.etat-superposition': 'La superposition quantique est un principe fondamental de la mécanique quantique selon lequel un système peut être décrit par une combinaison linéaire de plusieurs états propres. Cela signifie que le système n\'est pas dans plusieurs états à la fois, mais dans un état unique qui est une combinaison mathématique des états possibles.',

        'component.dps.about.dephasage.title': 'Déphasage',
        'component.dps.about.dephasage': 'Un déphasage est une modification de la phase d\'une onde ou d\'une impulsion. En optique quantique, un déphasage de π (180°) correspond à une inversion du signe de l\'amplitude. Dans le protocole DPS, le déphasage est utilisé pour encoder l\'information dans la phase relative des impulsions.',

        'component.dps.about.interferometre.title': 'Interféromètre',
        'component.dps.about.interferometre': 'Un interféromètre est un dispositif optique qui sépare un faisceau lumineux en plusieurs chemins, puis les recombine pour produire des interférences. La différence de phase accumulée entre les chemins permet de mesurer des grandeurs physiques avec une grande précision.',

        'component.dps.about.operateur-unitaire.title': 'Opérateur unitaire',
        'component.dps.about.operateur-unitaire': 'Un opérateur unitaire est une transformation linéaire qui conserve la norme des vecteurs d\'état dans l\'espace de Hilbert. En mécanique quantique, l\'évolution d\'un système fermé est décrite par un opérateur unitaire, garantissant la conservation de la probabilité totale.',
        // DPS definitions FR end -------------------

        'component.validation.gameRestarted': 'La partie a été redémarrée.',
        'component.game.playerLeft': 'Vous aviez quitter le jeux!',
        'component.game.playerLeft.desc': 'Vous allez être redirigé vers l\'accueil.',
        'component.header.about.dps': 'À propos du protocole DPS',

        // DPS How to play fr --------------------
        'component.dps.howToPlayTitle': 'Comment jouer à DPS',
        'component.dps.howToPlayDescription': 'Le protocole DPS implique' +
            ' deux acteurs principaux : Alice et Bob, qui jouent des rôles' +
            ' différents. Vous pouvez ici explorer l\'ensemble des étapes' +
            ' que chacun d\'eux doit suivre pour mener à bien le protocole.',
        'component.dps.howToPlay.Alice.step1.part0': 'Pour chaque photon à envoyer, générez une séquence aléatoire de 3 bits',
        'component.dps.howToPlay.Alice.step1.part1': ' (b₀, b₁, b₂). Ces bits serviront à encoder l\'information sous forme de phase dans le train d\'impulsions associé à ce photon.',
        'component.dps.howToPlay.Alice.step2.part0': 'Générez un train d’impulsions',
        'component.dps.howToPlay.Alice.step2.part1': ' en faisant circuler le photon dans un dispositif à 3 trajets.',
        'component.dps.howToPlay.Alice.step3.part0': 'Appliquer un déphasage de π',
        'component.dps.howToPlay.Alice.step3.part1': ' dont le bit correspondant est 1.',
        'component.dps.howToPlay.Alice.step4.part0': 'Attendez la réponse de Bob',
        'component.dps.howToPlay.Alice.step4.part1': ' : il vous communique le temps de détection pour chaque photon (T0, T1, T2 ou T3).',
        'component.dps.howToPlay.Alice.step5.part0': 'Construisez votre clé',
        'component.dps.howToPlay.Alice.step5.part1': ' : Ignorez les photons détectés à T0 et T3. Pour T1 : si b₀ = b₁, le bit de clé est 0 ; sinon, le bit est 1. Pour T2 : si b₁ = b₂, le bit de clé est 0 ; sinon, le bit est 1.',
        'component.dps.howToPlay.Alice.step6.part0': 'Chiffrez et envoyez votre message',
        'component.dps.howToPlay.Alice.step6.part1': ' à Bob en utilisant la clé obtenue.',
        'component.dps.howToPlay.Bob.step1.part0': 'Recevez chaque photon',
        'component.dps.howToPlay.Bob.step1.part1': ' et mesurez-le avec votre interféromètre.',
        'component.dps.howToPlay.Bob.step2.part0': 'Notez le temps de détection',
        'component.dps.howToPlay.Bob.step2.part1': ' (T0, T1, T2 ou T3) et quel détecteur (DET0 ou DET1) a été activé.',
        'component.dps.howToPlay.Bob.step3.part0': 'Communiquez publiquement',
        'component.dps.howToPlay.Bob.step3.part1': ' à Alice les temps de détection pour chaque photon (mais gardez secrets les résultats des détecteurs).',
        'component.dps.howToPlay.Bob.step4.part0': 'Construisez votre clé de chiffrement en utilisant uniquement les mesures des temps T1 et T2',
        'component.dps.howToPlay.Bob.step4.part1': ' : DET0 activé = bit 0, DET1 activé = bit 1.',
        'component.dps.howToPlay.Bob.step5.part0': 'Déchiffrez le message d\'Alice',
        'component.dps.howToPlay.Bob.step5.part1': ' en utilisant votre clé.',

        // DPS about FR --------------------
        'component.dps.about.part1.0': 'Le protocole à déphasage différentiel ',
        'component.dps.about.part1.1': 'ou DPS pour ',
        'component.dps.about.part1.2': 'Differential phase shift',
        'component.dps.about.part1.3': 'est un protocole quantique permettant l\'établissement de <link1>clés de chiffrement</link1>.',
        'component.dps.about.part2': 'Contrairement aux protocoles BB84 et E91 qui encodent l\'information dans la <link2>polarisation</link2> des <link3>photons</link3>, le protocole DPS encode l\'information dans les <link4>phases</link4> d\'un <link5>train d\'impulsions</link5>.',
        'component.dps.about.part3': 'Le protocole débute avec Alice qui envoie des photons uniques dans un dispositif comprenant trois trajets: <b>A</b>, <b>B</b> et <b>C</b>.',
        'component.dps.about.part4': 'Dans ce montage, il y a la même différence de longueur entre les trajets ',
        'component.dps.about.and': ' et ',
        'component.dps.about.part5': ' qu\'entre les trajets ',
        'component.dps.about.part6': ' Ainsi, une <link6>impulsion</link6> passant par ',
        'component.dps.about.part7': ' acquiert un retard T par rapport à une impulsion passant par ',
        'component.dps.about.part8': 'Des <link7>miroirs semi-réfléchissants</link7> font en sorte que le photon a la même probabilité de passer par chacun des trois trajets. Une fois les trois trajets recombinés, le photon est dans un <link8>état de superposition</link8> ',
        'component.dps.about.part9': ' ou, de façon équivalente ',
        'component.dps.about.with': 'avec ',
        'component.dps.about.part10': ' qui correspond à la 1ere impulsion, ',
        'component.dps.about.part11': ' à la seconde impulsion, et ',
        'component.dps.about.part12': ' à la dernière impulsion du train. Pour chaque photon envoyé, Alice choisit 3 bits de façon aléatoire. Si le bit est 1, elle applique un <link9>déphasage</link9> de π à l\'impulsion correspondante et elle ne fait rien si le bit est 0.' +
            ' Pour les trois impulsions il y a 8 situations possibles, voyons quatre exemples  ',
        'component.dps.about.part13': 'On remarque que ',
        'component.dps.about.part14': ' on peut donc écrire l\'état du photon à l\'aide des bits ',
        'component.dps.about.part15': ' de la manière suivante ',
        'component.dps.about.part16': 'Le train d\'impulsions est ensuite envoyé à Bob dont le dispositif (un <link10>interféromètre</link10>) est le suivant  ',
        'component.dps.about.part17': 'Ici encore, la différence de longueur entre les trajets ',
        'component.dps.about.part18': ' est telle que le train d\'impulsions passant par le trajet ',
        'component.dps.about.part19': ' est retardé d\'un temps T par rapport au train passant par  ',
        'component.dps.about.part20': 'On peut donc représenter les états des trains d\'impulsions en entrée du dernier miroir semi-réfléchissant par les états ',
        'component.dps.about.part21': 'Prenons un exemple avec les bits ',
        'component.dps.about.part22': 'On aura alors les états suivants',
        'component.dps.about.route': 'Trajet',
        'component.dps.about.part23': 'Pour deux rayons incidents ',
        'component.dps.about.part24': ' comme illustré sur la figure suivante,',
        'component.dps.about.part25': 'on peut décrire l\'<link11>opérateur unitaire</link11> ',
        'component.dps.about.part26': ' associé au miroir semi-réfléchissant par la transformation',
        'component.dps.about.where': 'où ',
        'component.dps.about.part27': ' sont les amplitudes de probabilité associées aux états ',
        'component.dps.about.part28': ' respectivement.',
        'component.dps.about.part29': ' On obtient donc ',
        'component.dps.about.part30': 'En prenant les états ',
        'component.dps.about.part31': ' décrits précédemment, on peut donc calculer les états ' +
            'qui résultent de l\'interférence des impulsions pour chaque temps ',
        'component.dps.about.part32': 'On remarque donc que si un photon est mesuré aux temps ',
        'component.dps.about.or': ' ou ',
        'component.dps.about.part33': 'il peut être détecté par le détecteur 0 ou le détecteur 1 avec ',
        'component.dps.about.part34': 'une probabilité de 50%',
        'component.dps.about.part35': ' puisque',
        'component.dps.about.part36': ' Si le photon est mesuré aux temps ',
        'component.dps.about.part37': ' les valeurs de ',
        'component.dps.about.part38': ' déterminent le détecteur qui sera activé. Dans le protocole DPS, seuls les photons mesurés aux temps ',
        'component.dps.about.part39': ' sont utilisés pour établir la clé, les photons mesurés aux temps',
        'component.dps.about.part40': ' sont rejetés',
        'component.dps.about.part41': 'Reprenons notre exemple où ',
        'component.dps.about.part42': ' On a alors les amplitudes de probabilité suivantes ',
        'component.dps.about.part43': 'De façon générale si ',
        'component.dps.about.part44': '(différence de phase de 0) et que le photon est détecté au temps ',
        'component.dps.about.part45': 'le détecteur 0 est activé et Bob enregistre le bit 0 pour sa clé. À l\'inverse, si ',
        'component.dps.about.part46': '(différence de phase de ',
        'component.dps.about.part47': ') et que le photon est détecté au temps ',
        'component.dps.about.part48': 'le détecteur 1 est activé et Bob enregistre le bit 1 pour sa clé.',
        'component.dps.about.part49': 'Si le photon est plutôt détecté au temps ',
        'component.dps.about.part50': 'alors Bob enregistre le bit 0 si ',
        'component.dps.about.part51': ' et le bit 1 dans le cas contraire.',
        'component.dps.about.part52': 'Maintenant qu\'on sait comment Bob peut établir la clé de chiffrement, il lui reste à communiquer à Alice de l\'information qui permettra à cette dernière d\'obtenir la même clé, sans toutefois que l\'information révélée permette à une personne externe de déduire cette clé.',
        'component.dps.about.part53': 'Tout ce que Bob a à faire, c\'est de transmettre à Alice les temps de détection de chacun des photons. Comme on vient de le voir, en connaissant le temps de détection et la valeur des bits ',
        'component.dps.about.part54': ' (Alice connait ces valeurs puisque c\'est elle qui les a générées), Alice peut savoir quel détecteur a mesuré le photon et donc, la clé de Bob!',
        'component.dps.about.part55': 'Voyons un exemple dans lequel Alice a reçu les temps de détection de 6 photons :',
        'component.dps.about.photon': 'Photon',
        'component.dps.about.detectionTime': 'Temps de détection',
        'component.dps.about.keyBit': 'Bit de la clé',
        'component.dps.about.part56': 'Les photons 1 et 5 (en gris) sont simplement rejetés car ils ont été détectés aux temps ',
        'component.dps.about.part57': 'respectivement. Le photon 2 a été détecté au temps ',
        'component.dps.about.part58': 'ce sont donc les impulsions modulées par les bits',
        'component.dps.about.part59': ' qui ont interférées. Puisque la différence de phase est de π entre ces 2 impulsions, Alice enregistre le bit 1 pour sa clé. Pour le photon 3, Bob a annoncé le temps ',
        'component.dps.about.part60': 'ce sont donc les impulsions modulées par les bits ',
        'component.dps.about.part61': ' qui ont interférées. Puisqu\'aucun déphasage a été appliqué à ces impulsions, Alice enregistre le bit 0 pour sa clé. Vous pouvez faire l\'exercice avec les photons 4 et 6.',
    },
    {
        // ... (Spanish translations)
        'component.main.name': 'Juan',
        'component.header.howToPlay': 'Cómo jugar',
        'component.header.about': 'Acerca de',
        'component.header.about.bb84': 'Acerca de BB84',
        'component.sidebar.play': 'Jugar',
        'component.main.game': 'Un juego de cifrado cuántico',
        'component.main.nameRequired': 'Se requiere un nombre',
        'component.main.nameMin': 'Tu nombre debe tener al menos 2 caracteres',
        'component.main.nameMax': 'Tu nombre no puede tener más de 10' +
            ' caracteres',
        'component.main.pinRequired': 'Se requiere un código',
        'component.main.pinLength': 'El código debe tener 5 caracteres',
        'component.main.nameDescription': 'Así es como te verán los otros' +
            ' jugadores',
        'component.main.nameLabel': 'Nombre',
        'component.main.pinLabel': 'Código de la sala',
        'component.main.createGame': 'Crear juego',
        'component.main.createGame.description': 'Elige el número de' +
            ' fotones y si quieres que Eve esté presente en tu juego',
        'component.main.createGame.descriptionNoEve': 'Elige el número de fotones',
        'component.main.join': 'Unirse',
        'component.main.invalidCodeTitle': 'Error al unirse a la sala.',
        'component.main.invalidCodeMessage': 'Verifica el código de la sala',
        'component.waitingRoom.players': 'Jugadores',
        'component.waitingRoom.joinAt': 'Únete en',
        'component.waitingRoom.start': 'Comenzar',
        'component.waitingRoom.exit': 'Salir',
        'component.waitingRoom.in': '¡Estás dentro,',
        'component.waitingRoom.wait': 'Espera a que el anfitrión inicie el' +
            ' juego',
        'component.main.takenNameTitle': 'Nombre en uso',
        'component.main.takenNameDescription': 'Ese nombre ya está en uso.' +
            ' Por favor, elige otro.',
        'component.waitingRoom.gameEndedTitle': 'Juego terminado',
        'component.waitingRoom.gameEndedDescription': 'El anfitrión ha' +
            ' terminado el juego',
        'component.waitingRoom.atLeastOnePlayer': 'Necesitas al menos un' +
            ' jugador',
        'component.createGame.keyLength': 'Número de photons',
        'component.createGame.eve': '¿Está presente Eve?',
        'component.createGame.keyError': 'Solo se permiten números entre 10' +
            ' y 30',
        'component.createGame.keyMin': 'El número mínimo de fotones es 16' +
            ' si Eve está presente y 10 en caso contrario',
        'component.createGame.keyMax': 'El número máximo de fotones es 30',
        'component.createGame.ready': '¡Listo!',
        'component.waitingRoom.connectionLostTitle': 'Conexión perdida',
        'component.waitingRoom.connectionLostDescription': 'Se perdió la' +
            ' conexión al servidor. Intenta volver a unirte a la sala',
        'component.waitingRoom.copied': '¡Copiado!',
        'component.main.gameStarted': 'Partida iniciada',
        'component.main.gameStartedDescription': 'La partida a la que estás' +
            ' intentando conectarte ya ha comenzado.',
        'component.createGame.numbersOnly': 'Solo se permiten números',
        'component.createGame.validationLength': 'Los bits de validación' +
            ' deben ser menores o iguales a la mitad de la longitud de la' +
            ' clave',
        'component.createGame.validationDescription': 'Bits de validación',
        'component.main.errorCreating': 'Error al crear el juego',
        'component.createGame.evePercentage.invalidType': 'Solo se permiten' +
            ' números entre 0.1 y 1',
        'component.createGame.evePercentage.positive': 'Debe ser positivo',
        'component.createGame.evePercentage.greaterThan': 'Debe ser 0.1 o más',
        'component.createGame.evePercentage.lessThan': 'Debe ser 1 o menos',
        'component.createGame.evePercentage.label': 'Probabilidad de Eve',
        'component.bb84.gameFound': '¡Partida encontrada!',
        'component.bb84.gameFound.desc': 'Parece que abandonaste un juego' +
            ' mientras aún estaba activo. ¿Quieres volver a unirte?',
        'component.bb84.gameFound.action': 'Volver a unirse',
        'general.close': 'Cerrar',
        'component.bb84.play.sorry': 'Lo siento, no pudimos encontrar un' +
            ' compañero para ti :(',
        'component.homePage.protocolsSection.bb84.description': 'Un' +
            ' protocolo para compartir de forma segura claves' +
            ' criptográficas entre dos partes a través de un canal de' +
            ' comunicación inseguro.',
        'component.homePage.protocolsSection.e91.description': 'El protocolo E91 utiliza el entrelazamiento cuántico para garantizar la seguridad de las comunicaciones al permitir que las partes intercambien claves criptográficas inviolables.',
        'component.homePage.protocolsSection.dps.description': 'El protocolo DPS utiliza los principios de superposición e interferencia para establecer una clave de cifrado compartida entre Alice y Bob.',
        'component.homePage.title.description': 'Aprende y practica' +
            ' protocolos de criptografía cuántica',
        'component.homePage.aboutSection': 'QuantumCrypto es una plataforma' +
            ' web para la educación en criptografía cuántica. Ofrece un' +
            ' número creciente de experiencias interactivas para jugar con' +
            ' diferentes protocolos. QuantumCrypto tiene como objetivo' +
            ' cerrar la brecha entre los conceptos cuánticos teóricos y la' +
            ' comprensión práctica al permitir a los usuarios participar en' +
            ' simulaciones en tiempo real de protocolos de criptografía' +
            ' cuántica. Las principales características de nuestra' +
            ' plataforma son',
        'component.homePage.userFriendly': 'Disfruta de una interfaz de' +
            ' usuario intuitiva diseñada para una mejor experiencia de' +
            ' aprendizaje.',
        'component.homePage.multiplayer': 'Crea y únete a juegos con tus' +
            ' amigos para poner en práctica tus conocimientos en' +
            ' criptografía cuántica.',
        'component.homePage.extensible': 'Un diseño modular permite a los' +
            ' contribuyentes ampliar nuestra aplicación con nuevas' +
            ' características, incluidos nuevos protocolos.',
        'component.homePage.openSource': 'Todo nuestro código está' +
            ' disponible en GitHub. Puedes encontrar los enlaces al final' +
            ' de la página.',
        'component.bb84.about.part1': 'El protocolo BB84 fue propuesto en 1984 por Charles Bennett de IBM y Gilles Brassard de la Universidad de Montreal',
        'component.bb84.about.part2': '. Implica a dos partes distintas, Alice y Bob, que buscan establecer una <link2>clave de cifrado</link2> para comunicarse de manera segura a través de un <link3>canal público</link3>. El protocolo comienza con Alice creando una secuencia aleatoria de bits y <link5>codificando cada bit</link5> usando un <link1>fotón</link1>. ' +
            'Específicamente, el valor del bit se codifica en uno de los dos <link6>estados de polarización mutuamente ortogonales</link6> del fotón. ' +
            'Además, para cada fotón, la base utilizada para describir la polarización de la luz se elige aleatoriamente entre dos bases posibles. Alice luego envía estos fotones a Bob a través de un <link4>canal cuántico público</link4> . ' +
            'Cuando Bob recibe los fotones, los mide utilizando una de las dos bases, también elegida al azar. Posteriormente, Alice y Bob anuncian públicamente las bases que usaron para codificar y medir cada fotón. ' +
            'Una clave se forma al conservar solo los bits para los cuales las bases de Alice y Bob coinciden. ' +
            'Finalmente, al comparar un subconjunto de los bits de su clave, Alice y Bob pueden detectar la <link8>presencia de un espía</link8>, típicamente referido como Eve, y así garantizar la seguridad de su canal de comunicación cuántica. ' +
            'Esto se debe a que, según los principios fundamentales de la mecánica cuántica, cualquier intento de Eve por interceptar y medir estos fotones <link7>perturbará su estado</link7>, introduciendo inconsistencias que Alice y Bob pueden detectar. ' +
            'Si concluyen que el canal cuántico no ha sido comprometido, pueden usar la clave generada para enviar un mensaje de manera segura. De lo contrario, deben repetir el procedimiento.',
        'component.bb84.about.encryptionKey.title': 'Clave de cifrado ',
        'component.bb84.about.encryptionKey.part1': 'Una clave de cifrado es un código secreto (en bits) que protege la información transformándola a un formato ilegible. Solo las personas que poseen la clave de descifrado pueden restaurar el mensaje original. La clave de descifrado puede ser la misma (claves simétricas) o diferente (claves asimétricas). Por ejemplo, en un escenario de cifrado con clave simétrica, Alice y Bob comparten la clave de cifrado: 010010. Si Alice quiere enviar un mensaje confidencial a Bob, realiza una operación XOR bit a bit entre la clave y su mensaje. Así funciona la operación XOR para diferentes valores de bits: ',
        'component.bb84.about.encryptionKey.part2': 'Supongamos que el mensaje que Alice quiere enviar es 111000. La operación de cifrado genera la secuencia 101010, como se muestra en la siguiente tabla: ',
        'component.bb84.about.encryptionKey.part3': 'Esta secuencia se envía a Bob, quien, como la única otra persona que posee la clave, puede descifrar el mensaje realizando una operación XOR bit a bit entre el mensaje cifrado y la clave. ',
        'component.bb84.about.encryptionKey.message': 'Mensaje',
        'component.bb84.about.encryptionKey.key': 'Clave',
        'component.bb84.about.encryptionKey.cypher': 'Mensaje cifrado',
        'component.bb84.about.photon.title': 'Fotón ',
        'component.bb84.about.photon': 'A menudo se dice que todo en el universo está compuesto de partículas, incluida la luz. De hecho, las partículas que componen la luz se llaman fotones, y son responsables de transportar la energía luminosa. El protocolo BB84 utiliza la polarización de los fotones para transmitir información en forma de bits (0 o 1). Esta propiedad cuántica esencial de las partículas de luz nos aporta un protocolo seguro. ',
        'component.bb84.about.publicPrivate.title': 'Canal público vs. Canal privado ',
        'component.bb84.about.publicPrivate': 'Un canal público es un medio de comunicación en el que cualquiera puede potencialmente escuchar los mensajes intercambiados, como si hablaras en voz alta en una habitación llena de gente. Un canal privado, en cambio, garantiza que la comunicación se realice solo entre las partes interesadas sin posibilidad de interceptación, como una conversación en voz baja entre dos interlocutores donde nadie más puede escuchar. Como garantizar la privacidad de un canal de comunicación puede ser un desafío, se utiliza la criptografía para hacer que los mensajes sean incomprensibles en un canal público, protegiendo así la confidencialidad de los datos. ',
        'component.bb84.about.classicalQuantum.title': 'Canal clásico vs canal cuántico ',
        'component.bb84.about.classicalQuantum': 'Un canal clásico está diseñado para transmitir información clásica, como mensajes binarios o textuales. Transmitir información cuántica a través de un canal clásico presenta grandes desafíos de rendimiento debido al ruido introducido por la información clásica. Por otro lado, un canal cuántico está diseñado para transmitir información cuántica, como el estado de un fotón. Este canal preserva las propiedades cuánticas de la información, asegurando una alta probabilidad de que la información correcta se reciba intacta al otro lado. ',
        'component.bb84.about.encoding.title': 'Codificación de un bit en un fotón',
        'component.bb84.about.encoding': 'La codificación de un bit en un fotón se refiere a cómo se utiliza la polarización de los fotones para representar bits (0 o 1). La polarización es una propiedad de los fotones que describe la dirección en la que oscila su campo eléctrico. En el protocolo BB84, esta polarización se usa para codificar bits eligiendo entre dos bases: la base + y la base x. En la base +, un fotón polarizado horizontalmente (↔) representa el bit 0, mientras que un fotón polarizado verticalmente (↕) representa el bit 1. En la base x, un fotón polarizado diagonalmente (⤢) representa el bit 0, y un fotón polarizado en la dirección diagonal opuesta (⤡) representa el bit 1. Alice codifica cada bit de esta manera antes de enviarlo a Bob. ',
        'component.bb84.about.orthogonal.title': 'Base ortogonal ',
        'component.bb84.about.orthogonal': 'En un plano cartesiano bidimensional, una base es un conjunto de dos vectores, v0 ​y v1​, que pueden representar cualquier vector en el plano como una combinación lineal de v0​ y v1​. Cuando v0​ y v1​ forman un ángulo de 90°, son ortogonales y crean una base ortogonal. Una base natural consiste en un vector alineado con el eje x y otro alineado con el eje y, conocida como la base + en el protocolo BB84. Al rotar los vectores de la base + a 45°, se obtiene la base x. Asociando los bits 0 y 1 con los vectores ortogonales de una base, Bob siempre mide el valor codificado por Alice cuando usan la misma base. Esto es una consecuencia del uso de una base ortogonal y de la regla de Born, que establece que la probabilidad de un resultado de medición corresponde al cuadrado de la componente del vector de polarización en esa base. Si las bases de Alice y Bob no coinciden, el vector de polarización del fotón enviado por Alice se expresa como una combinación lineal de los vectores de la base de medición de Bob. El resultado de la medición será entonces aleatorio.',
        'component.bb84.about.disturbance.title': 'Perturbación del estado por la medición',
        'component.bb84.about.disturbance': 'A menudo se dice que un sistema cuántico puede estar "en dos estados a la vez", es decir, en una superposición de estados. Esto significa que al medir el sistema, no se puede predecir cuál será el resultado, pero se conoce la probabilidad de cada posible resultado. Una vez que se realiza una medición, la superposición se destruye y el sistema colapsa al estado medido. Una nueva medición dará el mismo resultado. ',
        'component.bb84.about.eve.title': 'Detección de la presencia de Eve ',
        'component.bb84.about.eve': 'Consideremos solo los fotones para los que Alice y Bob usaron la misma base, ya que estos fotones se utilizan para establecer la clave. Para obtener información sobre la clave, Eve debe elegir una base para medir los fotones que intercepta. Para un fotón dado, supongamos que Alice y Bob usan la base +. Si Eve, por casualidad, también elige la base +, medirá el valor correcto y retransmitirá el bit en un fotón con la misma polarización. En este caso, la presencia de Eve no se puede detectar. Sin embargo, si Eve mide en la base x, lo cual tiene un 50% de probabilidad de ocurrir, Eve transmitirá a Bob un fotón polarizado en una superposición de estados con respecto a la base +. El resultado de la medición de Bob será entonces probabilístico, introduciendo errores que Alice y Bob pueden usar para detectar la presencia de Eve. ',
        'component.homePage.userFriendlyTitle': 'Amigable para el usuario',
        'component.homePage.multiplayerTitle': 'Experiencia multijugador',
        'component.homePage.extensibleTitle': 'Altamente extensible',
        'component.bb84.aboutTitle': 'Acerca del protocolo',
        'component.header.protocols': 'Protocolos',
        'component.header.guide': 'Guía',
        'component.header.guide.howToPlay': 'Cómo jugar',
        'component.header.guide.terminology': 'Terminología',
        'component.header.guide.context': 'Contexto',
        'component.header.guide.comingSoon': 'Próximamente',
        'component.header.guide.comingSoonDesc': '¡Esta sección está en construcción. ¡Vuelve pronto!',
        'component.header.guide.howToPlayDesc': 'Aprende a jugar cada protocolo de criptografía cuántica.',
        'component.header.guide.terminologyDesc': 'Definiciones clave utilizadas en todos los protocolos de criptografía cuántica.',
        'component.bb84.howToPlayTitle': 'Cómo jugar BB84',
        'component.bb84.howToPlayDescription': 'El protocolo BB84 tiene dos' +
            ' actores principales: Alice y Bob, que desempeñan roles' +
            ' diferentes. Aquí puedes explorar el set de pasos que' +
            ' cada uno de ellos debe seguir para completar el protocolo con éxito.',
        'component.bb84.steps.step1Alice': ' de 0s y 1s. Esta cadena se' +
            ' utilizará para construir la clave de cifrado.',
        'component.bb84.steps.step2Alice': ' para codificar cada uno de los' +
            ' bits. Puede elegir entre las bases + y x.',
        'component.bb84.steps.step3Alice': ' en la' +
            ' polarización de sus fotones.',
        'component.bb84.steps.step4Alice': 'con Bob y esperar a que él' +
            ' termine de recibirlos y medirlos.',
        'component.bb84.steps.step5Alice': 'y descarta los bits donde las' +
            ' bases no coincidan.',
        'component.bb84.steps.step6Alice': ' verificando que los' +
            ' bits seleccionados aleatoriamente de tu clave sin procesar' +
            ' coincidan con los de Bob. Si coinciden, puedes suponer que la' +
            ' probabilidad de que haya un espía es muy baja y' +
            ' puedes usar la clave con seguridad. De lo contrario, has' +
            ' detectado la presencia de un espía y debes reiniciar el protocolo.',
        'component.bb84.steps.step7Alice': ' a Bob',
        'component.bb84.highlights.highlight1Alice': 'Crea una cadena de' +
            ' bits aleatoria',
        'component.bb84.highlights.highlight2Alice': 'Selecciona' +
            ' aleatoriamente un conjunto de bases',
        'component.bb84.highlights.highlight3Alice': 'Codifica tus bits',
        'component.bb84.highlights.highlight4Alice': 'Comparte tus fotones',
        'component.bb84.highlights.highlight5Alice': 'Compara tus bases con las de Bob',
        'component.bb84.highlights.highlight6Alice': 'Valida tu clave',
        'component.bb84.highlights.highlight7Alice': 'Encripta y envía tu mensaje',
        'component.bb84.additionalStep': 'En QuantumCrypto, no todos los' +
            ' juegos BB84 tienen un espía. Este próximo paso solo se aplica' +
            ' si hay uno en tu juego. ¡Lo descubrirás al final!',
        'component.bb84.rawKeyInfo': 'En este punto, usted posee la "clave' +
            ' bruta", que se utilizará para detectar la presencia de un' +
            ' espía.',
        'component.bb84.steps.step1Bob': ' para medir cada uno de los' +
            ' fotones de Alice. Puedes elegir entre las bases + y x.',
        'component.bb84.steps.step2Bob': ' y toma nota de sus resultados.',
        'component.bb84.steps.step3Bob': ' con Alice.',
        'component.bb84.steps.step4Bob': ' y descartar los bits donde las bases no coincidan.',
        'component.bb84.steps.step5Bob': ' verificando que los bits' +
            ' seleccionados aleatoriamente de su clave sin procesar' +
            ' coincidan con los de Bob. Si coinciden, puede suponer que la' +
            ' probabilidad de que haya un espía presente es muy baja y' +
            ' puede usar la clave con seguridad. De lo contrario, ha' +
            ' detectado la presencia de un espía y debe reiniciar el protocolo.',
        'component.bb84.steps.step6Bob': ' usando su clave.',
        'component.bb84.highlights.highlight1Bob': 'Selecciona' +
            ' aleatoriamente un conjunto de bases',
        'component.bb84.highlights.highlight2Bob': 'Mide los fotones',
        'component.bb84.highlights.highlight3Bob': 'Comparte tus bases',
        'component.bb84.highlights.highlight4Bob': 'Compara tus bases con las de Alice',
        'component.bb84.highlights.highlight5Bob': 'Valida tu clave',
        'component.bb84.highlights.highlight6Bob': 'Descifra el mensaje de Alice',
        'component.bb84.playSolo': 'Jugar solo',
        'component.bb84.startSolo': 'Comenzar juego en solitario',
        'component.bb84.soloRoleSelect': 'Selecciona tu rol',
        'component.e91.playSolo': 'Jugar solo',
        'component.e91.startSolo': 'Comenzar juego en solitario',
        'component.e91.soloRoleSelect': 'Selecciona tu rol',
        'component.quantumCrypto.gamesPlayed': 'Total games played: ',
        'component.header.about.e91': 'Acerca de E91',
        'component.e91.howToPlayTitle': 'Cómo jugar E91',
        'component.e91.howToPlayDescription': 'El protocolo E91 tiene dos' +
            ' actores principales: Alice y Bob, que desempeñan roles' +
            ' diferentes. Aquí puedes explorar el set de pasos que' +
            ' cada uno de ellos debe seguir para completar el protocolo con éxito.',
        'component.e91.results.room': 'Sala',
        'component.e91.results.evePresent': 'Eve presente',
        'component.e91.results.eveDetected': 'Eve detectada',
        'component.e91.results.time': 'Tiempo',
        'component.e91.results.score': 'Puntuación',
        'component.e91.highlights.highlight1': 'Elige al azar una base de medida para los fotones incidentes.',
        'component.e91.steps.step1': ' Cada fotón que recibes está entrelazado en un par de Bell con un fotón compañero que recibe Bob.',
        'component.e91.highlights.highlight2': 'Comparte tus bases de medición',
        'component.e91.steps.step2Alice': ' con Bob.',
        'component.e91.steps.step2Bob': ' con Alice.',
        'component.e91.highlights.highlight3': 'Extrae tu clave de cifrado',
        'component.e91.steps.step3': ' a partir de los resultados de medición obtenidos para pares de bases idénticas.',
        'component.e91.highlights.highlight4': 'Valida tu clave',
        'component.e91.steps.step4': ' probando la desigualdad CHSH con las mediciones tomadas con las otras' +
            ' combinaciones de bases.',
        'component.e91.highlights.highlight5Alice': 'Cifra y envía tu mensaje',
        'component.e91.steps.step5Alice': ' a Bob.',
        'component.e91.highlights.highlight5Bob': 'Descifra el mensaje de Alice',
        'component.e91.steps.step5Bob': ' usando tu clave.',
        'component.e91.createGame.keyMin': 'El número mínimo de pares de fotones es {minWithEve} cuando Eve está presente y {minWithoutEve} en caso contrario.',
        'component.e91.about.part1.0': 'El protocolo fue propuesto en 1991 por Artur Ekert',
        'component.e91.about.part1.1': '. Implica a dos personas, Alice y Bob, que buscan establecer <link2>una clave de cifrado</link2> para comunicarse de manera segura a través de <link3>un canal público</link3>. En este protocolo, Alice y Bob reciben cada uno <link1>un fotón</link1> de una fuente que emite pares de fotones con <link4>polarizaciones</link4> <link5>máximamente entrelazadas</link5>: estos fotones forman lo que se conoce como <link6>pares de Bell</link6>. Para cada par, la polarización de un fotón es medida por Alice y la del otro por Bob. Alice realiza cada medición eligiendo al azar <link7>una base</link7> del conjunto de tres bases {a, b, a′}. Bob hace lo mismo eligiendo entre las bases {b, a′, b′}. Entre estas bases, Alice y Bob comparten dos en común, b y a′.',
        'component.e91.about.part2': 'Bob hace lo mismo eligiendo entre las bases',
        'component.e91.about.part3': '. Entre estas bases, Alice y Bob comparten dos en común: ',
        'component.e91.about.figures.title': 'Figura de las Bases',
        'component.e91.about.figures.part1': 'Para cada medición, Alice y Bob registran el resultado: +1 o -1. Una vez completada la transmisión de los pares de fotones y realizadas las mediciones, Alice y Bob divulgan las bases de medición que utilizaron para cada fotón. Los resultados de las mediciones realizadas en la misma base se conservan para formar la clave de cifrado. Esto ocurre, en promedio, 2 de cada 9 veces: cuando Alice y Bob ambos miden en la base b o en la base a\'. Los resultados de las mediciones realizadas en bases diferentes se revelan y se usan para validar la seguridad de la fuente y del canal cuántico. Para esto, el protocolo E91 se basa en uno de los experimentos más destacados de la mecánica cuántica: la prueba de las desigualdades de Bell. Existen varias formulaciones de estas desigualdades, y el protocolo E91 utiliza específicamente la desigualdad CHSH. Alice y Bob trabajan únicamente con los resultados de las mediciones realizadas en las siguientes bases:',
        'component.e91.about.figures.part2': 'En promedio, 4 de cada 9 pares de fotones se utilizan para verificar la desigualdad de CHSH. Para cada par de resultados derivados de las combinaciones de bases en la tabla anterior, Alice y Bob calculan el producto mA × mB, donde mA y mB son los resultados de la medición obtenidos por Alice y Bob, respectivamente. Luego, se calcula el promedio de los productos para cada combinación de bases. ',
        'component.e91.about.figures.part3': 'Como ejemplo, supongamos que Alice y Bob han realizado las siguientes mediciones: ',
        'component.e91.about.figures.part4': 'El cálculo de promedios (correlación E(a,b)) da:',
        'component.e91.about.figures.part5': 'La desigualdad CHSH se verifica comprobando que ',
        'component.e91.about.figures.chsh.classical': 'Límite clásico: S ≤ 2 (desigualdad de Bell)',
        'component.e91.about.figures.chsh.quantum': 'Máximo cuántico: S = 2√2 ≈ 2.83 (límite de Tsirelson)',
        'component.e91.about.figures.chsh.example': 'Nuestro ejemplo: S = |0.33 + 0 + 1 - 0| = 1.33 ≤ 2 ✓',
        'component.e91.about.figures.noMeasurements': 'sin mediciones en este ejemplo',
        'component.e91.about.figures.part6': 'Cuando S se calcula a partir de fotones entrelazados, esta desigualdad no se cumple. De hecho, se puede demostrar que 𝑆 = 2√2 ≈ 2.83 para fotones máximamente entrelazados. Por lo tanto, si el emisor de pares de fotones es confiable y el canal de comunicación no produce ruido ni es espiado, Alice y Bob deberían observar que el valor de S tiende hacia 2√2 a medida que aumentan el número de pares de fotones considerados en sus cálculos. Luego podrán usar la clave obtenida para cifrar sus mensajes. Por el contrario, si este valor permanece por debajo de 2, no pueden confiar en la clave y deberían abstenerse de usarla. Tenga en cuenta que los valores promedio son cantidades estadísticas que requieren una gran muestra para ser significativos. Con un número limitado de muestras, pueden ocurrir anomalías estadísticas que dificulten sacar conclusiones confiables. ',
        'component.e91.about.figures.part7.1': 'Finalmente, observe que hay tres combinaciones de bases de medición que no se utilizan en el protocolo E91: ',
        'component.e91.about.figures.part7.2': 'Las mediciones realizadas con estas combinaciones de bases simplemente se descartan. ',

        // E91 definitions ES
        'component.e91.about.photon.title': 'Fotón',
        'component.e91.about.photon': 'A menudo se dice que todo en el universo está hecho de partículas, incluso la luz. Las partículas que componen la luz se llaman fotones: son los "granos" fundamentales de energía luminosa. En los protocolos de criptografía cuántica (como BB84, E91, etc.), los fotones se utilizan para transportar información entre dos partes. Su propiedad de polarización permite codificar bits (0 o 1), mientras que su naturaleza cuántica garantiza la seguridad de la transmisión: cualquier intento de intercepción altera el estado del fotón y puede ser detectado.',

        'component.e91.about.encryptionKey.title': 'Clave de cifrado',
        'component.e91.about.encryptionKey': 'Una clave de cifrado es una información secreta, normalmente una secuencia de bits (0 y 1), compartida solo entre dos partes (como Alicia y Bob). Permite, mediante un algoritmo criptográfico, transformar un mensaje legible (texto plano) en un mensaje cifrado (ilegible para otros), y luego descifrarlo. A diferencia de una contraseña, la clave no está destinada a ser memorizada por una persona, sino a ser utilizada por un programa informático. El objetivo de protocolos como BB84, E91 o DPS es generar y compartir esta clave de forma perfectamente segura, para que solo Alicia y Bob puedan usarla para proteger sus comunicaciones.',

        'component.e91.about.publicPrivate.title': 'Canal público (y privado)',
        'component.e91.about.publicPrivate': 'Un canal público es un medio de comunicación (como Internet, una fibra óptica o una línea telefónica) donde cualquiera puede potencialmente interceptar o escuchar los mensajes intercambiados—como hablar en voz alta en una sala llena de gente. Por el contrario, un canal privado garantiza que solo las partes previstas puedan acceder a la comunicación, como una conversación en voz baja aparte. En la práctica, es difícil garantizar la confidencialidad de un canal: por eso se utiliza la criptografía para hacer incomprensibles los mensajes en un canal público. En los protocolos de criptografía cuántica (BB84, E91, DPS, etc.), la seguridad se basa en la física cuántica, no en la confidencialidad del canal.',

        'component.e91.about.polarization.title': 'Polarizaciones',
        'component.e91.about.polarization': 'La polarización describe la orientación en la que oscila una onda de luz (como un fotón). Imaginen una cuerda que vibra: puede vibrar verticalmente (↕), horizontalmente (↔), o diagonalmente (⤢). Para un fotón, la polarización es una propiedad cuántica fundamental que se mide para obtener resultados de +1 o -1.',

        'component.e91.about.maximallyEntangled.title': 'Máximamente entrelazadas',
        'component.e91.about.maximallyEntangled.part1': 'Se dice que dos partículas (o qubits) están "entrelazadas" cuando comparten un estado cuántico común: los resultados de sus mediciones están correlacionados de tal manera que es imposible describirlas por separado, incluso a distancia. El "entrelazamiento máximo" se refiere a la correlación más fuerte posible entre los resultados de las mediciones, lo que significa que los resultados están perfectamente correlacionados o anti-correlacionados según la base elegida (medir una revela inmediatamente el resultado de la otra).',
        'component.e91.about.maximallyEntangled.part2': 'Matemáticamente, un estado entrelazado máximo se escribe como una superposición donde cada resultado posible tiene la misma probabilidad: por ejemplo, para dos qubits, el estado',
        'component.e91.about.maximallyEntangled.equation1': '$$\\left|\\Phi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle + |11\\rangle)$$',
        'component.e91.about.maximallyEntangled.part3': 'significa que las dos partículas son siempre idénticas (00 o 11), cada una con una probabilidad de 1/2. La "amplitud" 1/√2 asegura esta probabilidad igual.',
        'component.e91.about.maximallyEntangled.part4': 'También existen estados entrelazados no máximos, donde las amplitudes no son iguales (por ejemplo, \\(\\alpha \\lvert 00 \\rangle + \\beta \\lvert 11 \\rangle\\) con \\(\\lvert\\alpha\\rvert^{2} \\neq \\lvert\\beta\\rvert^{2}\\)). En este caso, las correlaciones son más débiles y el estado es menos útil para la criptografía cuántica.',
        'component.e91.about.maximallyEntangled.part5': 'El entrelazamiento máximo es esencial para garantizar la seguridad de los protocolos cuánticos: cualquier intento de interceptación altera estas correlaciones perfectas y puede ser detectado.',

        'component.e91.about.bellPairs.title': 'Pares de Bell',
        'component.e91.about.bellPairs.part1': 'Los pares de Bell son pares de qubits (partículas cuánticas, como fotones) preparados en uno de los cuatro estados de entrelazamiento cuántico máximo, llamados estados de Bell. Estos estados muestran correlaciones perfectas, imposibles de reproducir con la física clásica, y son fundamentales para muchos protocolos de criptografía cuántica. Los cuatro estados de Bell son:',
        'component.e91.about.bellPairs.equation1': '$$\\left|\\Phi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle + |11\\rangle)$$',
        'component.e91.about.bellPairs.equation2': '$$\\left|\\Phi^-\\right\\rangle = \\frac{1}{\\sqrt{2}} (|00\\rangle - |11\\rangle)$$',
        'component.e91.about.bellPairs.equation3': '$$\\left|\\Psi^+\\right\\rangle = \\frac{1}{\\sqrt{2}} (|01\\rangle + |10\\rangle)$$',
        'component.e91.about.bellPairs.equation4': '$$\\left|\\Psi^-\\right\\rangle = \\frac{1}{\\sqrt{2}} (|01\\rangle - |10\\rangle)$$',
        'component.e91.about.bellPairs.part2': 'Llevan el nombre del físico John Stewart Bell. En protocolos como E91, estos pares aseguran la seguridad mediante el entrelazamiento máximo: cualquier intento de interceptación altera las correlaciones y puede ser detectado.',

        'component.e91.about.measurementBasis.title': 'Base de medición',
        'component.e91.about.measurementBasis': 'Una base de medición es un conjunto de orientaciones de referencia utilizadas para medir una propiedad cuántica, como la polarización de un fotón o el estado de un qubit. Es como elegir el ángulo de tu "filtro polarizador". El resultado de la medición (por ejemplo, +1 o -1, o 0 o 1) depende de la base elegida. En protocolos como BB84 o E91, Alicia y Bob eligen aleatoriamente sus bases (denotadas a, b, a′, b′, etc.).',

        'component.e91.about.bellInequalities.title': 'Desigualdades de Bell',
        'component.e91.about.bellInequalities': 'Las desigualdades de Bell son un conjunto de relaciones matemáticas que siempre deben cumplirse si la naturaleza obedece las leyes de la física clásica y la idea de variables ocultas locales (es decir, los resultados de las mediciones están predeterminados y ninguna información viaja más rápido que la luz). Sin embargo, la mecánica cuántica predice—y los experimentos confirman—que ciertos sistemas entrelazados, como los pares de Bell, pueden violar estas desigualdades: muestran correlaciones imposibles de explicar por una teoría clásica. Probar la violación de las desigualdades de Bell demuestra así la existencia del entrelazamiento cuántico y descarta cualquier explicación por variables ocultas locales.',

        'component.e91.about.chshInequality.title': 'La Desigualdad CHSH',
        'component.e91.about.chshInequality': 'La desigualdad CHSH (Clauser, Horne, Shimony, Holt) es una versión específica y experimentalmente comprobable de las desigualdades de Bell. Se aplica a mediciones sobre dos qubits entrelazados, cada uno medido en dos bases diferentes. Según la física clásica, el valor del parámetro S calculado a partir de las correlaciones medidas no puede superar 2. Sin embargo, la mecánica cuántica permite un valor máximo de 2√2, demostrando así la presencia de entrelazamiento y la ausencia de variables ocultas locales. En el protocolo E91, verificar esta desigualdad garantiza la seguridad de la clave generada.',

        // E91 Solo Game Keys ES
        'component.e91.backToHome': 'Volver al inicio',
        'component.e91.measurement.bit': 'Bit',
        'component.e91.autoClassify': 'Auto-Clasificar',
        'component.e91.classify.error': 'Por favor clasifique todos los fotones correctamente',
        'component.e91.shortKey': 'No hay suficientes bits de clave',
        'component.e91.continue': 'Continuar',
        'component.e91.continueAnyway': 'Continuar de todos modos',

        // CHSH Step ES
        'component.e91.chsh.title': 'Prueba de desigualdad CHSH',
        'component.e91.chsh.description': 'La desigualdad CHSH ayuda a detectar espías. Si S ≤ 2, Eva puede estar presente.',
        'component.e91.chsh.eveWarning': '⚠️ Advertencia: ¡Posible espía detectado!',
        'component.e91.chsh.noEve': '✅ El canal parece seguro',
        'component.e91.chsh.calculate': 'Calcular valor CHSH',
        'component.e91.chsh.below2': 'El valor S calculado es ≤ 2, indicando la presencia de un espía.',
        'component.e91.chsh.above2': 'El valor S calculado es > 2, confirmando las correlaciones cuánticas.',

        // Solo Results Page ES
        'component.e91.results.title': 'Resultados E91 Modo Solo',
        'component.e91.results.keyLength': 'Longitud de Clave',
        'component.e91.results.yes': 'Sí',
        'component.e91.results.no': 'No',
        'component.e91.results.success': '🎉 ¡Felicidades! ¡Juego completado con éxito!',
        'component.e91.results.failure': '❌ Juego terminado.',
        'component.e91.results.replay': 'Jugar de Nuevo',
        'component.e91.results.home': 'Menú Principal',

        // Multiplayer Results Page ES
        'component.results.title': 'Resultados del juego',
        'component.results.waiting': '⏳ Esperando a que los jugadores terminen sus partidas...',
        'component.results.gamesFinished': '¡Algunas partidas han terminado!',

        // Messaging Step ES
        'component.messaging.send': 'Enviar mensaje',
        'component.messaging.decrypt': 'Descifrar mensaje',
        'component.messaging.inputPlaceholder': 'Ingrese su mensaje (0 o 1)',
        'component.messaging.decryptPlaceholder': 'Ingrese el bit descifrado',
        'component.messaging.cipherError': 'Cifrado inválido',
        'component.messaging.decryptError': 'Descifrado inválido',
        'component.messaging.yourKey': 'Tu clave',
        'component.messaging.yourMessage': 'Tu mensaje',
        'component.messaging.aliceEncrypted': 'Mensaje cifrado de Alice',
        'component.messaging.yourEncrypted': 'Tu mensaje cifrado',
        'component.messaging.aliceDecrypt': 'Mensaje descifrado',
        'component.messaging.validateAndSend': 'Validar y enviar',

        // DPS ---------------------

        // DPS UI translations ES
        'component.header.about.dps': 'Acerca del protocolo DPS',

        // DPS definitions ES (cards reference for technical terms)
        'component.dps.about.cles-chiffrement.title': 'Clave de cifrado',
        'component.dps.about.cles-chiffrement': 'Una clave de cifrado es una información secreta, normalmente una secuencia de bits (0 y 1), compartida solo entre dos partes (como Alicia y Bob). Permite, mediante un algoritmo criptográfico, transformar un mensaje legible (texto plano) en un mensaje cifrado (ilegible para otros), y luego descifrarlo.',

        'component.dps.about.polarisation.title': 'Polarizaciones',
        'component.dps.about.polarisation': 'La polarización describe la orientación en la que oscila una onda de luz (como un fotón). Imaginen una cuerda que vibra: puede vibrar verticalmente (↕), horizontalmente (↔), o diagonalmente (⤢). Para un fotón, la polarización es una propiedad cuántica fundamental que se mide para obtener resultados de +1 o -1.',

        'component.dps.about.photons.title': 'Fotón',
        'component.dps.about.photons': 'A menudo se dice que todo en el universo está hecho de partículas, incluso la luz. Las partículas que componen la luz se llaman fotones: son los "granos" fundamentales de energía luminosa. En los protocolos de criptografía cuántica (como BB84, E91, etc.), los fotones se utilizan para transportar información entre dos partes.',

        'component.dps.about.phases.title': 'Fase',
        'component.dps.about.phases.part1': 'La fase de una onda cuántica o clásica es una magnitud que describe la posición relativa de un punto en el ciclo de una oscilación periódica. Matemáticamente, para una onda compleja',
        'component.dps.about.phases.equation': '$$\\psi = A e^{i\\phi}$$',
        'component.dps.about.phases.part2': 'la fase φ es el argumento del exponente. Las diferencias de fase entre dos ondas o impulsos determinan los fenómenos de interferencia. En los protocolos de criptografía cuántica, la información puede codificarse en la diferencia de fase entre impulsos sucesivos.',

        'component.dps.about.train-impulsions.title': 'Tren de pulsos',
        'component.dps.about.train-impulsions': 'Un tren de pulsos es una secuencia de pulsos de luz (u otras señales) emitidos a intervalos de tiempo regulares. En criptografía cuántica, un fotón puede prepararse en un estado de superposición de varios pulsos temporales, formando así un tren donde la información se codifica en la fase relativa entre pulsos.',

        'component.dps.about.impulsion_word': 'Pulso',
        'component.dps.about.impulsion_definition.title': 'Pulso',
        'component.dps.about.impulsion_definition.content': 'Un pulso es una breve emisión de energía, a menudo lumínica, caracterizada por su duración, amplitud y fase. En óptica cuántica, un pulso corresponde a un paquete de ondas de luz, utilizado para transmitir información o interactuar con dispositivos ópticos.',

        'component.dps.about.miroirs-semi-reflechissants.title': 'Espejo semi-reflectante',
        'component.dps.about.miroirs-semi-reflechissants': 'Un espejo semi-reflectante (o divisor de haz) es un componente óptico que divide un haz de luz en dos: una parte se refleja, la otra se transmite. Para un fotón único, el espejo crea una superposición cuántica de los dos caminos posibles, lo cual es esencial para experimentos de interferencia.',

        'component.dps.about.etat-superposition.title': 'Estado de superposición',
        'component.dps.about.etat-superposition': 'La superposición cuántica es un principio fundamental de la mecánica cuántica por el cual un sistema puede describirse mediante una combinación lineal de varios estados propios. Esto significa que el sistema no está en varios estados a la vez, sino en un estado único que es una combinación matemática de los estados posibles.',

        'component.dps.about.dephasage.title': 'Desfase',
        'component.dps.about.dephasage': 'Un desfase es una modificación de la fase de una onda o pulso. En óptica cuántica, un desfase de π (180°) corresponde a una inversión del signo de la amplitud. En el protocolo DPS, el desfase se utiliza para codificar información en la fase relativa de los pulsos.',

        'component.dps.about.interferometre.title': 'Interferómetro',
        'component.dps.about.interferometre': 'Un interferómetro es un dispositivo óptico que separa un haz de luz en varios caminos, luego los recombina para producir interferencia. La diferencia de fase acumulada entre los caminos permite medir cantidades físicas con alta precisión.',

        'component.dps.about.operateur-unitaire.title': 'Operador unitario',
        'component.dps.about.operateur-unitaire': 'Un operador unitario es una transformación lineal que conserva la norma de los vectores de estado en el espacio de Hilbert. En mecánica cuántica, la evolución de un sistema cerrado se describe mediante un operador unitario, garantizando la conservación de la probabilidad total.',

        // DPS How to play Es --------------------
        'component.dps.howToPlayTitle': 'Cómo jugar a DPS',
        'component.dps.howToPlayDescription': 'El protocolo DPS implica dos actores principales: Alice y Bob, que desempeñan roles diferentes. Aquí puedes explorar los pasos que cada uno debe seguir para llevar a cabo el protocolo correctamente.',
        'component.dps.howToPlay.Alice.step1.part0': 'Para cada fotón que vas a enviar, genera una secuencia aleatoria de 3 bits',
        'component.dps.howToPlay.Alice.step1.part1': ' (b₀, b₁, b₂). Estos bits se usarán para codificar la información como una fase en el tren de pulsos asociado a ese fotón.',
        'component.dps.howToPlay.Alice.step2.part0': 'Genera un tren de pulsos',
        'component.dps.howToPlay.Alice.step2.part1': ' haciendo circular el fotón en un dispositivo de 3 trayectorias.',
        'component.dps.howToPlay.Alice.step3.part0': 'Aplica un desfase de π',
        'component.dps.howToPlay.Alice.step3.part1': ' cuyo bit correspondiente es 1.',
        'component.dps.howToPlay.Alice.step4.part0': 'Espera la respuesta de Bob',
        'component.dps.howToPlay.Alice.step4.part1': ': él te comunicará el tiempo de detección de cada fotón (T0, T1, T2 o T3).',
        'component.dps.howToPlay.Alice.step5.part0': 'Construye tu clave',
        'component.dps.howToPlay.Alice.step5.part1': ': Ignora los fotones detectados en T0 y T3. Para T1: si b₀ = b₁, el bit de la clave es 0; si no, el bit es 1. Para T2: si b₁ = b₂, el bit de la clave es 0; si no, el bit es 1.',
        'component.dps.howToPlay.Alice.step6.part0': 'Cifra y envía tu mensaje',
        'component.dps.howToPlay.Alice.step6.part1': ' a Bob usando la clave obtenida.',
        'component.dps.howToPlay.Bob.step1.part0': 'Recibe cada fotón',
        'component.dps.howToPlay.Bob.step1.part1': ' y mídelo con tu interferómetro.',
        'component.dps.howToPlay.Bob.step2.part0': 'Anota el tiempo de detección',
        'component.dps.howToPlay.Bob.step2.part1': ' (T0, T1, T2 o T3) y qué detector (DET0 o DET1) fue activado.',
        'component.dps.howToPlay.Bob.step3.part0': 'Comunica públicamente',
        'component.dps.howToPlay.Bob.step3.part1': ' a Alice los tiempos de detección de cada fotón (pero mantén en secreto los resultados de los detectores).',
        'component.dps.howToPlay.Bob.step4.part0': 'Construye tu clave de cifrado usando únicamente las mediciones en los tiempos T1 y T2',
        'component.dps.howToPlay.Bob.step4.part1': ': DET0 activado = bit 0, DET1 activado = bit 1.',
        'component.dps.howToPlay.Bob.step5.part0': 'Descifra el mensaje de Alice',
        'component.dps.howToPlay.Bob.step5.part1': ' usando tu clave.',

        // DPS about (content) in ES
        'component.dps.about.part1.0': 'El protocolo de desplazamiento de fase diferencial ',
        'component.dps.about.part1.1': 'o DPS para ',
        'component.dps.about.part1.2': 'Differential phase shift',
        'component.dps.about.part1.3': 'es un protocolo cuántico para establecer <link1>claves de cifrado</link1>.',
        'component.dps.about.part2': 'A diferencia de los protocolos BB84 y E91 que codifican la información en la <link2>polarización</link2> de los <link3>fotones</link3>, el protocolo DPS codifica la información en las <link4>fases</link4> de un <link5>tren de impulsos</link5>.',
        'component.dps.about.part3': 'El protocolo comienza con Alice enviando fotones individuales a un dispositivo que comprende tres caminos: <b>A</b>, <b>B</b> y <b>C</b>.',
        'component.dps.about.part4': 'En esta configuración, existe la misma diferencia de longitud entre los caminos ',
        'component.dps.about.and': ' y ',
        'component.dps.about.part5': ' que entre los caminos ',
        'component.dps.about.part6': ' Así, un <link6>impulso</link6> que pasa por ',
        'component.dps.about.part7': ' adquiere un retraso T respecto a un impulso que pasa por ',
        'component.dps.about.part8': 'Los <link7>espejos semirreflectantes</link7> aseguran que el fotón tenga la misma probabilidad de tomar cualquiera de los tres caminos. Una vez que los tres caminos se recombinan, el fotón está en un <link8>estado de superposición</link8> ',
        'component.dps.about.part9': ' o, equivalentemente ',
        'component.dps.about.with': 'con ',
        'component.dps.about.part10': ' correspondiente al 1er pulso, ',
        'component.dps.about.part11': ' al segundo pulso, y ',
        'component.dps.about.part12': ' al último pulso del tren. Para cada fotón enviado, Alice elige 3 bits de forma aleatoria. Si el bit es 1, aplica un <link9>desfase</link9> de π al impulso correspondiente y no hace nada si el bit es 0. Para los tres pulsos hay 8 situaciones posibles, veamos cuatro ejemplos  ',
        'component.dps.about.part13': 'Observamos que ',
        'component.dps.about.part14': ' por lo que podemos escribir el estado del fotón usando los bits ',
        'component.dps.about.part15': ' de la siguiente manera ',
        'component.dps.about.part16': 'El tren de pulsos se envía a Bob, cuyo dispositivo (un <link10>interferómetro</link10>) es el siguiente  ',
        'component.dps.about.part17': 'Aquí también, la diferencia de longitud entre los caminos ',
        'component.dps.about.part18': ' es tal que el tren de pulsos que pasa por el camino ',
        'component.dps.about.part19': ' se retrasa un tiempo T respecto al tren que pasa por  ',
        'component.dps.about.part20': 'Por lo tanto, podemos representar los estados de los trenes de pulsos a la entrada del último espejo semirreflectante por los estados ',
        'component.dps.about.part21': 'Tomemos un ejemplo con los bits ',
        'component.dps.about.part22': 'Entonces tendremos los siguientes estados',
        'component.dps.about.route': 'Camino',
        'component.dps.about.part23': 'Para dos rayos incidentes ',
        'component.dps.about.part24': ' como se ilustra en la siguiente figura,',
        'component.dps.about.part25': 'podemos describir el <link11>operador unitario</link11> ',
        'component.dps.about.part26': ' asociado al espejo semirreflectante mediante la transformación',
        'component.dps.about.where': 'donde ',
        'component.dps.about.part27': ' representan las amplitudes de los estados ',
        'component.dps.about.part28': ' respectivamente.',
        'component.dps.about.part29': 'Aplicando esta transformación, obtenemos: ',
        'component.dps.about.part30': 'Tomando los estados ',
        'component.dps.about.part31': ' descritos anteriormente, podemos calcular los estados que resultan de la interferencia de los pulsos para cada tiempo. Obtenemos la siguiente tabla de amplitudes de probabilidad:',
        'component.dps.about.part32': 'Notamos que si un fotón se mide en los tiempos ',
        'component.dps.about.or': ' o ',
        'component.dps.about.part33': 'puede ser detectado por el detector 0 o el detector 1 con ',
        'component.dps.about.part34': 'una probabilidad del 50%',
        'component.dps.about.part35': ', ya que:',
        'component.dps.about.part36': 'Si el fotón se mide en los tiempos ',
        'component.dps.about.part37': ', los valores de ',
        'component.dps.about.part38': ' determinan el detector que se activará. En el protocolo DPS, solo los fotones medidos en los tiempos ',
        'component.dps.about.part39': ' se utilizan para establecer la clave; los fotones medidos en los tiempos',
        'component.dps.about.part40': ' se descartan.',
        'component.dps.about.part41': 'Retomemos nuestro ejemplo con ',
        'component.dps.about.part42': '. Tenemos entonces las siguientes amplitudes de probabilidad:',
        'component.dps.about.part43': 'De forma general, si ',
        'component.dps.about.part44': ' (diferencia de fase de 0) y el fotón se detecta en el tiempo ',
        'component.dps.about.part45': ', el detector 0 se activa y Bob registra el bit 0 para su clave. A la inversa, si ',
        'component.dps.about.part46': ' (diferencia de fase de ',
        'component.dps.about.part47': ') y el fotón se detecta en el tiempo ',
        'component.dps.about.part48': ', el detector 1 se activa y Bob registra el bit 1 para su clave.',
        'component.dps.about.part49': 'Si el fotón se detecta en el tiempo ',
        'component.dps.about.part50': ', entonces Bob registra el bit 0 si ',
        'component.dps.about.part51': ' y el bit 1 en caso contrario.',
        'component.dps.about.part52': 'Ahora que sabemos cómo Bob puede establecer la clave de cifrado, le queda comunicar a Alice información que le permitirá obtener la misma clave, sin que la información revelada permita a una persona externa deducir esta clave.',
        'component.dps.about.part53': 'Todo lo que Bob tiene que hacer es transmitir a Alice los tiempos de detección de cada fotón. Como acabamos de ver, conociendo el tiempo de detección y el valor de los bits ',
        'component.dps.about.part54': ' (Alice conoce estos valores ya que es ella quien los ha generado), Alice puede saber qué detector midió el fotón y por tanto, ¡la clave de Bob!',
        'component.dps.about.part55': 'Veamos un ejemplo en el que Alice ha recibido los tiempos de detección de 6 fotones:',
        'component.dps.about.photon': 'Fotón',
        'component.dps.about.detectionTime': 'Tiempo de detección',
        'component.dps.about.keyBit': 'Bit de la clave',
        'component.dps.about.part56': 'Los fotones 1 y 5 (en gris) simplemente se rechazan porque han sido detectados en los tiempos ',
        'component.dps.about.part57': 'respectivamente. El fotón 2 ha sido detectado en el tiempo ',
        'component.dps.about.part58': 'por lo que son los pulsos modulados por los bits',
        'component.dps.about.part59': ' los que han interferido. Como la diferencia de fase es de π entre estos 2 pulsos, Alice registra el bit 1 para su clave. Para el fotón 3, Bob anunció el tiempo ',
        'component.dps.about.part60': 'por lo que son los pulsos modulados por los bits ',
        'component.dps.about.part61': ' los que han interferido. Como no se aplicó ningún desfase a estos pulsos, Alice registra el bit 0 para su clave. Pueden hacer el ejercicio con los fotones 4 y 6.',
    },
];