// Order derived from Language enum defined in the LanguageProvider
// 0: English
// 1: French
// 2: Spanish
// 3: German

import {LanguageItem} from '@/types';

export const bb84Lines: LanguageItem[] = [
    {
        'component.main.name': 'John',
        'component.header.howToPlay': 'How to play',
        'component.header.about': 'About QuantumCrypto',
        'component.header.about.bb84': 'About BB84',
        'component.main.game': 'A Quantum Encryption Game',
        'component.main.nameRequired': 'A name is required',
        'component.main.nameMin': 'Your name should be at least 2 characters',
        'component.main.nameMax': 'Your name cannot be longer than 10' +
            ' characters',
        'component.main.pinRequired': 'A waiting-room PIN is required',
        'component.main.pinLength': 'The waiting-room PIN must be 5' +
            ' characters long',
        'component.main.nameDescription': 'This will be your public display' +
            ' name',
        'component.main.nameLabel': 'Name',
        'component.main.pinLabel': 'Game PIN',
        'component.main.createGame': 'Create Game',
        'component.main.createGame.description': 'Pick the number of' +
            ' photons and whether you want Eve to be present in your game',
        'component.main.join': 'Join',
        'component.main.invalidCodeTitle': 'Error joining waiting-room.',
        'component.main.invalidCodeMessage': 'Verify the waiting-room PIN',
        'component.waitingRoom.players': 'Players',
        'component.waitingRoom.joinAt': 'Join at',
        'component.waitingRoom.start': 'Start',
        'component.waitingRoom.exit': 'Exit',
        'component.waitingRoom.in': 'You\'re in,',
        'component.waitingRoom.wait': 'Wait for the host to start the' +
            ' waiting-room',
        'component.main.takenNameTitle': 'Name taken',
        'component.main.takenNameDescription': 'That name is taken. Please' +
            ' pick a different one.',
        'component.waitingRoom.gameEndedTitle': 'Game ended',
        'component.waitingRoom.gameEndedDescription': 'The host has ended' +
            ' the waiting-room',
        'component.waitingRoom.atLeastOnePlayer': 'You need at least one' +
            ' player',
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
        'component.game.playerHeader': 'you are playing as',
        'component.game.gameProgressionTitle': 'Game Progression',
        'component.aliceGame.bits': 'Bits ',
        'component.aliceGame.bitsDesc': '(0 or 1)',
        'component.aliceGame.basis': 'Basis',
        'component.aliceGame.basisDesc': ' (+ or x)',
        'component.aliceGame.polarization': 'Polarization',
        'component.aliceGame.random': 'Random',
        'component.aliceGame.send': 'Send to Bob',
        'component.bobGame.photons': 'Photons',
        'component.aliceExchange.send': 'Send to Bob!',
        'component.exchange.welcome': 'Welcome to BB84!',
        'component.bobExchange.measurements': 'Measurements',
        'component.bobExchange.shareBases': 'Share bases!',
        'component.bobExchange.waiting': 'Waiting for Alice\'s photons...',
        'component.aliceExchange.sent': 'Your photons are sent! Waiting for' +
            ' Bob\'s basis...',
        'component.game.step1': 'Step 1: ',
        'component.game.step2': 'Step 2: ',
        'component.aliceExchange.start': 'Pick random bits and bases and' +
            ' determine the photons\' polarization.',
        'component.bobExchange.photonsArrived': 'Alice\'s photons just' +
            ' arrived!',
        'component.bobExchange.choose': 'Choose random bases and measure' +
            ' the photons.',
        'component.bobExchange.shareWithAlice': 'Measurements performed!' +
            ' Share your basis with Alice to continue.',
        'component.aliceExchange.basesArrived': 'Bob\'s bases just arrived!',
        'component.bobExchange.measure': 'Measure',
        'component.bobExchange.basesArrived': 'Alice\'s bases just arrived!',
        'component.game.tabs1': 'Exchange quantum information',
        'component.game.tabs2': 'Basis reconciliation',
        'component.game.tabs3': 'Encrypted messaging',
        'component.game.step3': 'Step 3: ',
        'component.game.step4': 'Step 4: ',
        'component.basis.validate': 'Discard the bits where the bases' +
            ' don\'t match by clicking on them. After discarding them, you' +
            ' will have the secret key.',
        'component.messaging.bob.start': 'Great job! Now, let\'s wait for' +
            ' Alice\'s encrypted message...',
        'component.messaging.alice.start': 'Great job!',
        'component.messaging.alice.last': 'Enter a message and encrypt it' +
            ' using your secret key. Then, send the message to Bob!',
        'component.messaging.alice.sent': 'Your message has been sent! Now,' +
            ' let\'s wait for Bob\'s decryption...',
        'component.messaging.bob.arrived': 'Alice\'s encrypted message is' +
            ' here!',
        'component.messaging.bob.decrypt': 'Use the secret key to decrypt' +
            ' the message.',
        'component.messaging.congratulations': 'Congratulations ',
        'component.messaging.bob.end': 'You decrypted Alice\'s message!',
        'component.messaging.alice.end': 'Bob was able to decrypt your' +
            ' message!',
        'component.messaging.alice.reveal': 'Your Bob was ',
        'component.messaging.bob.reveal': 'Your Alice was ',
        'component.basis.validateBtn': 'Validate',
        'component.messaging.yourKey': 'Your key',
        'component.messaging.yourMessage': 'Your message',
        'component.messaging.yourEncrypted': 'Your encrypted message (0 or 1)',
        'component.messaging.aliceEncrypted': 'Alice\'s encrypted message',
        'component.messaging.aliceDecrypt': 'Alice\'s decrypted message (0' +
            ' or 1)',
        'component.basis.yourBases': 'Your bases',
        'component.basis.bobBases': 'Bob\'s bases',
        'component.basis.aliceBases': 'Alice\'s bases',
        'component.basis.verify': 'Verify your bits',
        'component.basis.correct': 'Correct!',
        'component.messaging.validateAndSend': 'Validate and send',
        'component.messaging.cipherError': 'Verify your message and' +
            ' encrypted bits',
        'component.messaging.cipherSent': 'Sent!',
        'component.messaging.decryptError': 'Verify your decryption bits',
        'component.waitingRoom.copied': 'Copied!',
        'component.main.gameStarted': 'Game started',
        'component.main.gameStartedDescription': 'The game you are trying' +
            ' to connect to has already started.',
        'component.createGame.numbersOnly': 'Only numbers are allowed',
        'component.createGame.validationLength': 'The validation bits must' +
            ' be less than or equal to half of the key length',
        'component.createGame.validationDescription': 'Validation bits',
        'component.main.errorCreating': 'Error creating game',
        'component.game.tabValidation': 'Validation',
        'component.validationTab.yourKey': 'Your bits',
        'component.validationTab.bobsKey': 'Bob\'s bits',
        'component.validationTab.alicesKey': 'Alice\'s bits',
        'component.validationTab.valid': 'Valid',
        'component.validationTab.invalid': 'Invalid',
        'component.createGame.evePercentage.invalidType': 'Only numbers' +
            ' between 0.1 and 1',
        'component.createGame.evePercentage.positive': 'Must be positive',
        'component.createGame.evePercentage.greaterThan': 'Must be 0.1 or' +
            ' more',
        'component.createGame.evePercentage.lessThan': 'Must be 1 or less',
        'component.createGame.evePercentage.label': 'Eve probability',
        'component.gameRestart.restart': 'Restart',
        'component.gameRestart.playAgain': 'Play again',
        'component.return.returnToMain': 'Return to main menu',
        'component.results.seeResults': 'See Results',
        'component.basisTab.alertTitle': 'Not enough bits!',
        'component.basisTab.alertDescription': 'The key that you obtained' +
            ' does not have enough bits to verify that there is no' +
            ' eavesdropper. You must start again.',
        'component.validationTab.title': 'Validation Step',
        'component.validationTab.start': 'The bits selected for validation' +
            ' are',
        'component.validationTab.arrived': 'The bits have arrived!',
        'component.validationTab.select': 'Select valid or invalid',
        'component.validationTab.areYouSure': 'Are you sure? Check the keys' +
            ' again.',
        'component.validationTab.validKey': 'Communication channel validated' +
            ' successfully!',
        'component.validationTab.found': 'You have detected the eavesdropper!',
        'component.validationTab.waiting': 'Waiting for the other bits...',
        'component.validationTab.validated': 'Validated!',
        'component.validationTab.bobValid': 'Bob has determined that the' +
            ' communication channel is valid',
        'component.validationTab.bobInvalid': 'Bob has determined that the' +
            ' communication channel is invalid',
        'component.validationTab.aliceValid': 'Alice has determined that' +
            ' the communication channel is valid',
        'component.validationTab.aliceInvalid': 'Alice has determined that' +
            ' the communication channel is invalid',
        'component.bb84.gameFound': 'Game Found!',
        'component.bb84.gameFound.desc': 'It looks like you left a game' +
            ' while it was still active. Would you like to rejoin?',
        'component.bb84.gameFound.action': 'Rejoin',
            'general.close': 'Close',
        'component.bb84.play.sorry': 'Sorry, we could not find a partner' +
            ' for you :(',
        'component.validation.gameRestarted': 'You or your partner' +
            ' restarted the game after discovering the eavesdropper.',
        'component.validation.indices': 'The random key indices selected' +
            ' for validation are: ',
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
            ' friends to put into practice your quantum cryptography' +
            ' knowledge.',
        'component.homePage.extensible': 'A modular design allows' +
            ' contributors to extend our app with new features, including' +
            ' new protocols.',
        'component.homePage.openSource': 'All our code is available on' +
            ' GitHub. You can find the links at the bottom of the page.',
        'component.bb84.about': 'The BB84 protocol was proposed in 1984 by Charles Bennett of IBM and Gilles Brassard from the Université de Montréal. ' +
            'It involves two distinct parties, Alice and Bob, who aim to establish an <link2>encryption key</link2> to communicate securely over a <link3>public channel</link3>. ' +
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
        'component.bb84.about.encryptionKey.part2': 'Let’s say the message Alice wants to send is 111000. The encryption operation generates the sequence 101010, as shown in this table: ',
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
        'component.bb84.about.orthogonal': 'In a two-dimensional Cartesian plane, a basis is a set of two vectors, v₀ ​and v₁​, that can represent any vector in the plane as a linear combination of v₀​ and v₁​. When v₀​ and v₁​ form a 90° angle, they are orthogonal and create an orthogonal basis. A natural basis consists of one vector aligned with the x-axis and another aligned with the y-axis, known as the + basis in the BB84 protocol. By rotating the + basis vectors by 45°, the x basis is obtained. By associating bits 0 and 1 with the orthogonal vectors of a basis, Bob always measures the value encoded by Alice when they use the same basis. This is a consequence of using an orthogonal basis and Born\'s rule, which states that the probability of a measurement outcome corresponds to the square of the polarization vector\'s component in that basis. If Alice\'s and Bob\'s bases do not match, the polarization vector of the photon sent by Alice is expressed as a linear combination of the measurement basis vectors chosen by Bob. The measurement result is then random. ',
        'component.bb84.about.disturbance.title': 'State Disturbance by Measurement ',
        'component.bb84.about.disturbance': 'It is often said that a quantum system can be "in two states at once," meaning it is in a superposition of states. This implies that upon measurement, the system\'s outcome cannot be predicted, but the probability of each result is known. Once a measurement is made, the superposition state is destroyed, and the system collapses into the measured state. Any subsequent measurement will yield the same result. ',
        'component.bb84.about.eve.title': 'Detecting Eve\'s Presence ',
        'component.bb84.about.eve': 'Consider only the photons for which Alice and Bob used the same basis, as these photons are used to establish the key. To obtain information about the key, Eve must choose a basis to measure the photons she intercepts. For a given photon, suppose Alice and Bob use the + basis. If Eve, by chance, also chooses the + basis, she will measure the correct value and retransmit the bit in a photon with the same polarization. In this case, Eve’s presence cannot be detected. However, if Eve measures in the x basis, which has a 50% chance of occurring, she will transmit to Bob a photon polarized in a superposition of states relative to the + basis. Bob’s measurement result will then be probabilistic, introducing errors that Alice and Bob can use to detect Eve\'s presence. ',
        'component.homePage.userFriendlyTitle': 'User-friendly',
        'component.homePage.multiplayerTitle': 'Multiplayer Experience',
        'component.homePage.extensibleTitle': 'Highly Extensible',
        'component.bb84.aboutTitle': 'About the protocol',
        'component.header.protocols': 'Protocols',
        'component.bb84.howToPlayTitle': 'How to play BB84',
        'component.bb84.howToPlayDescription': 'The BB84 protocol has two' +
            ' main actors: Alice and Bob, who play different roles. Here' +
            ' you can explore the set of steps that each one of them must' +
            ' take in order to complete the protocol successfully.',
        'component.bb84.steps.step1Alice': ' of 0s and 1s. This string will' +
            ' be' +
            ' used to build your encryption key.',
        'component.bb84.steps.step2Alice': ' to encode each of the bits. You' +
            ' can choose between the + and x bases.',
        'component.bb84.steps.step3Alice': ' in the polarization of your' +
            ' photons.',
        'component.bb84.steps.step4Alice': ' with Bob and wait for him to' +
            ' finish receiving and measuring them.',
        'component.bb84.steps.step5Alice': ' and discard the bits where the' +
            ' bases don\'t match.',
        'component.bb84.steps.step6Alice': ' by verifying that the randomly' +
            ' selected bits from your raw key match with Bob\'s. If they' +
            ' match, you can assume that the probability of an eavesdropper' +
            ' being present is very low and you can safely use the key.' +
            ' Otherwise, you have detected the presence of an eavesdropper' +
            ' and must restart the protocol.',
        'component.bb84.steps.step7Alice': ' to Bob.',
        'component.bb84.highlights.highlight1Alice': 'Create a random bit' +
            ' string',
        'component.bb84.highlights.highlight2Alice': 'Randomly select a set' +
            ' of' +
            ' bases',
        'component.bb84.highlights.highlight3Alice': 'Encode your bits',
        'component.bb84.highlights.highlight4Alice': 'Share your photons',
        'component.bb84.highlights.highlight5Alice': 'Compare your bases to' +
            ' Bob\'s',
        'component.bb84.highlights.highlight6Alice': 'Validate your key',
        'component.bb84.highlights.highlight7Alice': 'Encrypt and send your' +
            ' message',
        'component.bb84.additionalStep': 'In QuantumCrypto, not all BB84' +
            ' games have an eavesdropper. This next step only applies if' +
            ' there is one in your game. You\'ll find out at the end!',
        'component.bb84.rawKeyInfo': 'At this point, you possess the "raw' +
            ' key", which will be used to detect the presence of an' +
            ' eavesdropper.',
        'component.bb84.steps.step1Bob': ' to' +
            ' measure each of Alice\'s photons. You can choose between the' +
            ' + and x bases.',
        'component.bb84.steps.step2Bob': ' and make note' +
            ' of your outcomes.',
        'component.bb84.steps.step3Bob': ' with Alice.',
        'component.bb84.steps.step4Bob': ' and discard the bits where the bases don\'t match.',
        'component.bb84.steps.step5Bob': ' by verifying' +
            ' that the randomly selected bits from your raw key match with' +
            ' Bob\'s. If they match, you can assume that the probability of' +
            ' an eavesdropper being present is very low, and you can safely' +
            ' use the key. Otherwise, you have detected the presence of an' +
            ' eavesdropper and must restart the protocol.',
        'component.bb84.steps.step6Bob': ' using' +
            ' your key.',
        'component.bb84.highlights.highlight1Bob': 'Randomly select a set' +
            ' of bases',
        'component.bb84.highlights.highlight2Bob': 'Measure the photons',
        'component.bb84.highlights.highlight3Bob': 'Share your bases',
        'component.bb84.highlights.highlight4Bob': 'Compare your bases to' +
            ' Alice\'s',
        'component.bb84.highlights.highlight5Bob': 'Validate your key',
        'component.bb84.highlights.highlight6Bob': 'Decrypt Alice\'s message',
        'component.quantumCrypto.gamesPlayed': 'Total games played: ',
        'component.bb84.playSolo': 'Play solo',
        'component.bb84.startSolo': 'Start solo game',
        'component.bb84.soloRoleSelect': 'Select your role',
        'component.header.about.e91': 'About E91',
        'component.e91.howToPlayTitle': 'How to play E91',
        'component.e91.howToPlayDescription': 'The E91 protocol has two' +
            ' main actors: Alice and Bob, who play different roles. Here' +
            ' you can explore the set of steps that each one of them must' +
            ' take in order to complete the protocol successfully.',
        'component.e91.measurement.welcome': 'Welcome to E91!',
        'component.e91.measurement.start': 'Choose a measurement basis for each photon.',
        'component.e91.measurement.tab': 'Photon measurements',
        'component.e91.photons': 'Photons',
        'component.e91.measure': 'Measure',
        'component.e91.shareBases': 'Share my bases',
        'component.e91.shareBases.alice': 'Now share your bases with Bob',
        'component.e91.shareBases.bob': 'Now share your bases with Alice',
        'component.e91.classifyBases': 'Categorize measurement base pairs according to their usefulness in the' +
            ' protocol.',
        'component.e91.shortKey.restart': 'The length of your key is too short, you can restart the game now.',
        'component.e91.restart': 'Restart',
        'component.e91.moveToMessaging': 'Exchange a message',
        'component.e91.evePresent': 'Eve was present!',
        'component.e91.evePresent.stats': ' Eve has successfully read this number of bits: ',
        'component.e91.decsion.unsecured': 'The channel was deemed unsafe by ',
        'component.e91.decsion.secured': 'The channel was deemed safe by ',
        'component.e91.restart.unsecured': 'Channel compromised',
        'component.e91.restart.unsecured.description': ' Eve has been found out',
        'component.e91.gameLoss.title': 'You lose!',
        'component.e91.gameLoss': ' Eve did not interfere on this channel',
        'component.e91.highlights.highlight1': 'Randomly pick a measurement basis',
        'component.e91.steps.step1': ' for incoming photons, the measurement outcomes will' +
            ' be used to establish your encryption key and detect the presence of Eve.',
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
        'component.e91.validation.invalid.start': 'Drag the correct value (+1 or -1) to the appropriate container' +
            ' for each photon pair. Reminder: multiply Alice\'s and Bob\'s measurement outcomes to' +
            ' determine this value.',
        'component.e91.basisDesc': ' (a, b, a\', b\')',
        'component.e91.button.secure': 'Secure',
        'component.e91.button.unsecure': 'Not secure',
        'component.e91.button.showGraph': 'Show graph',
        'component.e91.text.values': 'Values',
        'component.e91.text.seeResults': 'See Results',
        'component.e91.createGame.keyMin': 'The minimum number of photon pairs is 20 when Eve is present, and 10 otherwise.',
        'component.tooltip.bobBase': 'Bob\'s Base',
        'component.tooltip.aliceBase': 'Alice\'s Base',
        'component.tooltip.category': "Category",
        'component.tooltip.description': "Description",
        'component.tooltip.key': "Key",
        'component.tooltip.discard': "Discard",
        'component.tooltip.bell': "Bell",
        'component.e91.dropHere': 'Drop here',
        'component.e91.results.room': 'Room',
        'component.e91.results.evePresent': 'Eve present',
        'component.e91.results.eveDetected': 'Eve detected',
        'component.e91.results.time': 'Time',
        'component.e91.results.score': 'Score',
        'component.e91.basis.waitingOn.bob': 'Waiting for Bob\'s bases.',
        'component.e91.basis.waitingOn.alice': 'Waiting for Alice\'s bases.',
        'component.e91.basis.arrivedFrom.bob': 'Bob\'s bases have arrived!',
        'component.e91.basis.arrivedFrom.alice': 'Alice\'s bases have arrived!',
        'component.e91.about.part1': 'The protocol was proposed in 1991 by Artur Ekert. It involves two distinct parties, Alice and Bob, who aim to establish an encryption key to securely communicate over a public channel. In this protocol, Alice and Bob each receive a photon from a source that emits pairs of photons with maximally entangled polarizations: these photons form what is known as Bell pairs. For each pair, the polarization of one photon is measured by Alice and the other by Bob. Alice performs each measurement by randomly choosing a basis from the set of three bases ',
        'component.e91.about.part2': 'Bob does the same, choosing from the bases',
        'component.e91.about.part3': '. Among these bases, Alice and Bob share two common bases, ',
        'component.e91.about.figures.title': 'Figure of the Bases',
        'component.e91.about.figures.part1': 'For each measurement, Alice and Bob record the result: +1 or -1. Once the transmission of photon pairs is complete and the measurements are made, Alice and Bob disclose the measurement bases they used for each photon. The results of measurements performed in the same basis are kept to form the encryption key. This occurs, on average, 2 out of 9 times: when Alice and Bob both measure in the b basis or in the a\' basis. The results of measurements performed in different bases are disclosed and used to validate the security of the source and the quantum channel. To do this, the E91 protocol relies on one of the most remarkable experiments in quantum mechanics: testing Bell inequalities. There are several formulations of these inequalities, and the E91 protocol specifically uses the CHSH inequality. Alice and Bob work only with the results of measurements made in the following bases: ',
        'component.e91.about.figures.part2': 'Thus, on average, 4 out of 9 photon pairs are used to verify the CHSH inequality. For each pair of results derived from the combinations of bases in the above table, Alice and Bob compute the product mA × mB, where mA and mB are the measurement results obtained by Alice and Bob, respectively. The average of the products is then calculated for each basis combination. ',
        'component.e91.about.figures.part3': 'Suppose Alice and Bob have made the following measurements:',
        'component.e91.about.figures.part4': 'The averages are calculated as follows:',
        'component.e91.about.figures.part5': 'The CHSH inequality is checked by verifying that ',
        'component.e91.about.figures.part6': 'It turns out that when S is calculated from entangled photons, this inequality is violated. In fact, it can be shown that S = 2√2 ≈ 2.83 for maximally entangled photons. Thus, if the photon pair emitter is reliable and the communication channel is neither noisy nor eavesdropped upon, Alice and Bob should observe that the value of S approaches 2√2 as they increase the number of photon pairs considered in their calculations. They can then use the key obtained to encrypt their messages. Conversely, if this value remains below 2, they cannot trust the key and should refrain from using it. Be aware that average values are statistical quantities that require many samples to be significant. For a limited number of samples, statistical anomalies may occur, making it difficult to draw conclusions. ',
        'component.e91.about.figures.part7.1': 'Finally, note that three combinations of measurement bases are not used in the E91 protocol: ',
        'component.e91.about.figures.part7.2': 'The measurements made with these base pairs are simply discarded. ',

    },
    {
        // ... (French translations)
        'component.main.name': 'Charlie',
        'component.header.howToPlay': 'Comment jouer',
        'component.header.about': 'À propos de QuantumCrypto',
        'component.header.about.bb84': 'À propos de BB84',
        'component.main.game': 'Un jeu de chiffrement quantique',
        'component.main.nameRequired': 'Un nom est requis',
        'component.main.nameMin': 'Votre nom doit comporter au moins 2' +
            ' caractères',
        'component.main.nameMax': 'Votre nom ne peut pas dépasser 10' +
            ' caractères',
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
        'component.main.join': 'Rejoindre',
        'component.main.invalidCodeTitle': 'Erreur lors de la connexion au' +
            ' jeu.',
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
        'component.waitingRoom.gameEndedDescription': 'L\'hôte a mis fin au' +
            ' jeu',
        'component.waitingRoom.atLeastOnePlayer': 'Vous avez besoin d\'au' +
            ' moins un joueur',
        'component.createGame.keyLength': 'Nombre de photons',
        'component.createGame.eve': 'Ève est-elle présente ?',
        'component.createGame.keyError': 'Seuls les chiffres entre 10 et 30' +
            ' sont autorisés',
        'component.createGame.keyMin': 'Le nombre minimum de photons est' +
            ' 16 si Ève est présente et 10 sinon',
        'component.createGame.keyMax': 'La longueur maximale de la clé est 30',
        'component.createGame.ready': 'Prêt !',
        'component.waitingRoom.connectionLostTitle': 'Connexion perdue',
        'component.waitingRoom.connectionLostDescription': 'Vous avez perdu' +
            ' la connexion au serveur. Essayez de rejoindre le jeu à nouveau',
        'component.game.playerHeader': 'vous jouez en tant que',
        'component.game.gameProgressionTitle': 'Déroulement du jeu',
        'component.aliceGame.bits': 'Bits ',
        'component.aliceGame.bitsDesc': '(0 ou 1)',
        'component.aliceGame.basis': 'Base',
        'component.aliceGame.basisDesc': ' (+ ou x)',
        'component.aliceGame.polarization': 'Polarisation',
        'component.aliceGame.random': 'Aléatoire',
        'component.aliceGame.send': 'Envoyer à Bob',
        'component.bobGame.photons': 'Photons',
        'component.aliceExchange.send': 'Envoyer à Bob !',
        'component.exchange.welcome': 'Bienvenue dans BB84 !',
        'component.bobExchange.measurements': 'Mesures',
        'component.bobExchange.shareBases': 'Partagez les bases !',
        'component.bobExchange.waiting': 'En attente des photons d\'Alice...',
        'component.aliceExchange.sent': 'Vos photons sont envoyés ! En' +
            ' attente des bases de Bob...',
        'component.game.step1': 'Étape 1: ',
        'component.game.step2': 'Étape 2: ',
        'component.aliceExchange.start': 'Choisissez des bits et des bases' +
            ' aléatoires et déterminez la polarisation des photons.',
        'component.bobExchange.shareWithAlice': 'Mesures effectuées !' +
            ' Partagez vos bases avec Alice pour continuer.',
        'component.bobExchange.photonsArrived': 'Les photons d\'Alice' +
            ' viennent d\'arriver !',
        'component.bobExchange.choose': 'Choisissez des bases aléatoires et' +
            ' mesurez les photons.',
        'component.aliceExchange.basesArrived': 'Les bases de Bob viennent' +
            ' d\'arriver !',
        'component.bobExchange.measure': 'Mesurer',
        'component.bobExchange.basesArrived': 'Les bases d\'Alice viennent' +
            ' d\'arriver !',
        'component.game.tabs1': 'Échange d\'information quantique',
        'component.game.tabs2': 'Réconciliation des bases',
        'component.game.tabs3': 'Messagerie chiffrée',
        'component.game.step3': 'Étape 3: ',
        'component.game.step4': 'Étape 4: ',
        'component.basis.validate': 'Supprimez les bits dont les bases ne' +
            ' correspondent pas en cliquant dessus. Après les avoir' +
            ' supprimés, vous aurez la clé secrète.',
        'component.messaging.bob.start': 'Super travail ! Maintenant,' +
            ' attendons le message chiffré d\'Alice...',
        'component.messaging.alice.start': 'Super travail !',
        'component.messaging.alice.last': 'Saisissez un message et' +
            ' chiffrez-le en utilisant votre clé secrète. Ensuite, envoyez' +
            ' le message à Bob !',
        'component.messaging.alice.sent': 'Votre message a été envoyé !' +
            ' Maintenant, attendons le déchiffrement de Bob...',
        'component.messaging.bob.arrived': 'Le message chiffré d\'Alice est' +
            ' arrivé !',
        'component.messaging.bob.decrypt': 'Utilisez la clé secrète pour' +
            ' déchiffrer le message.',
        'component.messaging.congratulations': 'Félicitations ',
        'component.messaging.bob.end': 'Vous avez déchiffré le message' +
            ' d\'Alice !',
        'component.messaging.alice.end': 'Bob a réussi à déchiffrer votre' +
            ' message !',
        'component.messaging.alice.reveal': 'Votre Bob était ',
        'component.messaging.bob.reveal': 'Votre Alice était ',
        'component.basis.validateBtn': 'Valider',
        'component.messaging.yourKey': 'Votre clé',
        'component.messaging.yourMessage': 'Votre message',
        'component.messaging.yourEncrypted': 'Votre message chiffré (0 ou 1)',
        'component.messaging.aliceEncrypted': 'Message chiffré d\'Alice',
        'component.messaging.aliceDecrypt': 'Message d\'Alice déchiffré',
        'component.basis.yourBases': 'Vos bases',
        'component.basis.bobBases': 'Les bases de Bob',
        'component.basis.aliceBases': 'Les bases d\'Alice',
        'component.basis.verify': 'Vérifiez vos bits',
        'component.basis.correct': 'Correct !',
        'component.messaging.validateAndSend': 'Valider et envoyer',
        'component.messaging.cipherError': 'Vérifiez votre message et vos' +
            ' bits chiffrés',
        'component.messaging.cipherSent': 'Envoyé !',
        'component.messaging.decryptError': 'Vérifiez vos bits de' +
            ' déchiffrement',
        'component.waitingRoom.copied': 'Copié !',
        'component.main.gameStarted': 'Jeu commencé',
        'component.main.gameStartedDescription': 'Le jeu auquel vous' +
            ' essayez de vous connecter a déjà commencé.',
        'component.createGame.numbersOnly': 'Seuls les chiffres sont' +
            ' autorisés',
        'component.createGame.validationLength': 'Le nombre de bits de' +
            ' validation doit être inférieur ou égal à la moitié' +
            ' de la longueur de la clé',
        'component.createGame.validationDescription': 'Bits de validation',
        'component.main.errorCreating': 'Erreur lors de la création du jeu',
        'component.game.tabValidation': 'Validation',
        'component.validationTab.yourKey': 'Vos bits',
        'component.validationTab.bobsKey': 'Les bits de Bob',
        'component.validationTab.alicesKey': 'La clé d\'Alice',
        'component.validationTab.valid': 'Valide',
        'component.validationTab.invalid': 'Invalide',
        'component.createGame.evePercentage.invalidType': 'Doit être entre' +
            ' 0.1 et 1',
        'component.createGame.evePercentage.positive': 'Doit être positif',
        'component.createGame.evePercentage.greaterThan': 'Doit être' +
            ' supérieur ou égal à 0.1',
        'component.createGame.evePercentage.lessThan': 'Doit être inférieur' +
            ' ou égal à 1',
        'component.createGame.evePercentage.label': 'Probabilité d\'Ève',
        'component.gameRestart.restart': 'Redémarrer',
        'component.gameRestart.playAgain': 'Rejouer',
        'component.return.returnToMain': 'Retour au menu principal',
        'component.results.seeResults': 'voir les résultats',
        'component.basisTab.alertTitle': 'Pas assez de bits !',
        'component.basisTab.alertDescription': 'La clé que vous avez' +
            ' obtenue n\'a pas assez de bits pour vérifier qu\'il n\'y a pas' +
            ' d\'espion. Vous devez recommencer.',
        'component.validationTab.title': 'Étape de validation',
        'component.validationTab.start': 'Les bits sélectionnés pour la' +
            ' validation sont',
        'component.validationTab.select': 'Sélectionnez valide ou invalide',
        'component.validationTab.areYouSure': 'Êtes-vous sûr ? Vérifiez à' +
            ' nouveau les clés.',
        'component.validationTab.validKey': 'Canal de communication validé' +
            ' avec succès !',
        'component.validationTab.arrived': 'Les bits sont arrivés !',
        'component.validationTab.found': 'Vous avez détecté l\'espion !',
        'component.validationTab.waiting': 'En attente des autres bits...',
        'component.validationTab.validated': 'Validé !',
        'component.validationTab.bobValid': 'Bob a déterminé que le canal' +
            ' de communication est valide',
        'component.validationTab.bobInvalid': 'Bob a déterminé que le canal' +
            ' de communication est invalide',
        'component.validationTab.aliceValid': 'Alice a déterminé que le' +
            ' canal de communication est valide',
        'component.validationTab.aliceInvalid': 'Alice a déterminé que le' +
            ' canal de communication est invalide',
        'component.bb84.gameFound': 'Partie trouvée !',
        'component.bb84.gameFound.desc': 'Il semble que vous avez quitté' +
            ' une partie alors qu\'elle était encore active. Souhaitez-vous' +
            ' rejoindre ?',
        'component.bb84.gameFound.action': 'Rejoindre',
            'general.close': 'Fermer',
        'component.bb84.play.sorry': 'Désolé, nous n\'avons pas pu trouver' +
            ' de partenaire pour vous :(',
        'component.validation.gameRestarted': 'Vous ou votre partenaire' +
            ' avez redémarré le jeu après avoir découvert l\'espion.',
        'component.validation.indices': 'Les bits de la clé sélectionnés' +
            ' de façon aléatoire pour la validation sont: ',
        'component.homePage.protocolsSection.bb84.description': 'Un' +
            ' protocole pour établir de manière sécurisée des clés' +
            ' cryptographiques entre deux parties sur un canal de' +
            ' communication non sécurisé.',
        'component.homePage.protocolsSection.e91.description': 'Le protocole E91 utilise l\'intrication quantique pour garantir la sécurité des communications en permettant aux parties d\'échanger des clés cryptographiques inviolables.',
        'component.homePage.title.description': 'Apprenez et pratiquez les' +
            ' protocoles de cryptographie quantique',
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
            ' utilisateur intuitive conçue pour une meilleure expérience' +
            ' d\'apprentissage.',
        'component.homePage.multiplayer': 'Créez et rejoignez des jeux avec' +
            ' vos amis pour mettre en pratique vos connaissances en' +
            ' cryptographie quantique.',
        'component.homePage.extensible': 'Une conception modulaire permet' +
            ' aux contributeurs d\'étendre notre application avec de' +
            ' nouvelles fonctionnalités, y compris de nouveaux protocoles.',
        'component.homePage.openSource': 'Tout notre code est disponible' +
            ' sur GitHub. Vous trouverez les liens au bas de la page.',
        'component.bb84.about': 'Le protocole BB84 a été proposé en 1984 par Charles Bennett d\'IBM et Gilles Brassard de l\'Université de Montréal. Il implique deux parties distinctes, Alice et Bob, qui souhaitent établir une <link2>clé de chiffrement</link2> afin de communiquer de manière sécurisée via un <link3>canal public</link3>. Le protocole commence avec Alice qui crée une séquence aléatoire de bits et qui <link5>encode chaque bit</link5> à l\’aide d\’un <link1>photon</link1>. Plus précisément, la valeur du bit est encodée dans un des deux <link6>états mutuellement orthogonaux</link6> de la polarisation du photon. Aussi, à chaque photon, la base pour décrire la polarisation de la lumière est choisie au hasard entre deux bases. Alice envoie ensuite ces photons à Bob via un <link4>canal quantique</link4> public. Lorsque Bob reçoit les photons, il les mesure en utilisant une des deux bases également choisies au hasard. Ensuite, Alice et Bob annoncent publiquement les bases qu\'ils ont utilisées pour encoder et mesurer chaque photon. Une clé est formée en conservant seulement les bits pour lesquels les bases utilisées par Alice et Bob correspondent. Enfin, en comparant un sous-ensemble des bits de leur clé, Alice et Bob peuvent détecter la <link8>présence d\'un espion</link8>, généralement appelé Ève, et s\'assurent ainsi de la sécurité de leur canal de communication quantique. En effet, en raison des principes fondamentaux de la mécanique quantique, toute tentative par Ève d\'intercepter et de mesurer ces photons <link7>perturbera leur état</link7>, introduisant ainsi des incohérences qu\'Alice et Bob peuvent détecter. S\'ils concluent que le canal quantique n\'a pas été compromis, ils peuvent utiliser la clé de chiffrement générée pour envoyer un message en toute sécurité. Sinon, ils doivent recommencer la procédure.', 
        'component.bb84.about.encryptionKey.title': 'Clé de chiffrement ',
        'component.bb84.about.encryptionKey.part1': 'Une clé de chiffrement est un code secret (en bits) qui permet de protéger des informations en les transformant en un format illisible. Seules les personnes possédant la clé de déchiffrement pourront restaurer le message original. La clé de déchiffrement peut être la même clé (on parle alors de clés symétriques), ou une clé différente (clés asymétriques). Prenons un exemple de chiffrement avec clés symétriques utilisant l\'opération XOR (OU-exclusif). Alice et Bob partagent une clé de chiffrement commune : 010010. Pour transmettre un message de manière confidentielle à Bob, Alice applique l\'opération XOR bit par bit entre la clé et son message. Voici comment fonctionne l’opération XOR pour les différentes valeurs possibles des bits b0 et b1: ',
        'component.bb84.about.encryptionKey.part2': 'Supposons que le message qu’elle veuille envoyer à Bob est 111000. L’opération de chiffrement génère la séquence 101010 comme on peut le voir dans ce tableau',
        'component.bb84.about.encryptionKey.part3': 'Cette séquence est transmise à Bob qui, puisqu’il est la seule autre personne possédant la clé, peut déchiffrer le message en appliquant à son tour l’opération XOR bit par bit entre le message chiffré et la clé.',
        'component.bb84.about.encryptionKey.message': 'Message',
        'component.bb84.about.encryptionKey.key': 'Clé',
        'component.bb84.about.encryptionKey.cypher': 'Message encrypté',
        'component.bb84.about.photon.title': 'Photon',
        'component.bb84.about.photon': 'On dit bien souvent que tout dans l’univers est composé de particules, même la lumière. En effet, les particules qui composent la lumière sont appelées photons, et ils sont responsables de transporter l’énergie lumineuse. Le protocole BB84 utilise la polarisation des photons pour envoyer l’information des bits (0 ou 1). En effet, cette propriété quantique essentielle des particules de lumière assure la sécurité du protocole.',
        'component.bb84.about.publicPrivate.title': 'Canal public vs privé ',
        'component.bb84.about.publicPrivate': 'Un canal public est un moyen de communication où tout le monde peut potentiellement écouter les messages échangés, comme si vous parliez à voix haute dans une pièce pleine de gens. Un canal privé, en revanche, garantit que la communication se fait seulement entre les personnes concernées sans possibilité d’interception, un peu comme une conversation à voix basse entre deux interlocuteurs où personne d’autre ne peut entendre. Comme il peut être difficile de garantir le caractère privé d’un canal de communication, la cryptographie est utilisée pour rendre les messages incompréhensibles sur un canal public et ainsi protéger la confidentialité des données. ',
        'component.bb84.about.classicalQuantum.title': 'Canal classique vs quantique',
        'component.bb84.about.classicalQuantum': 'Un canal classique est un moyen de communication conçu pour transmettre de l’information classique, comme des messages binaires ou textuels. L’envoie d’information quantique à travers un canal classique pose de grands défis de performance étant donné le bruit induit par l’information classique qui y circule. En revanche, un canal quantique est conçu pour transmettre de l’information quantique, comme l’état d’un photon. Ce canal permet de conserver les propriétés quantiques de l’information, garantissant ainsi une grande probabilité que la bonne information soit reçue de l’autre côté, intacte. ',
        'component.bb84.about.encoding.title': 'Encodage d’un bit dans un photon ',
        'component.bb84.about.encoding': 'L’encodage d’un bit dans un photon fait référence à la façon dont on utilise la polarisation des photons pour représenter des bits (0 ou 1). La polarisation est une propriété des photons qui décrit la direction dans laquelle leur champ électrique oscille. Dans le protocole BB84, cette polarisation est utilisée pour encoder des bits en choisissant entre deux bases : la base + et la base x. Dans la base +, un photon polarisé horizontalement (↔) représente le bit 0, tandis qu’un photon polarisé verticalement (↕) représente le bit 1. Dans la base x, un photon polarisé en diagonale (⤢) représente le bit 0, et un photon polarisé en diagonale opposée (⤡) représente le bit 1. Alice encode alors chaque bit de cette manière avant de l’envoyer à Bob.',
        'component.bb84.about.orthogonal.title': 'Base orthogonale ',
        'component.bb84.about.orthogonal': 'Si on considère le plan cartésien à 2 dimensions, une base est un ensemble de deux vecteurs, v₀ et v₁, qui permet de représenter n’importe quel vecteur du plan par une combinaison linéaire de v₀ et v₁. Lorsque v₀ et v₁ forment un angle de 90°, ils sont orthogonaux et ils forment une base orthogonale. Une base naturelle consiste à prendre un vecteur aligné avec l’axe des x et un autre aligné avec l’axe des y, ce qu’on appelle la base + dans le protocole BB84. En effectuant une rotation de 45° des deux vecteurs de la base +, on obtient la base x. En associant les bits 0 et 1 aux vecteurs orthogonaux d’une base, on s’assure que Bob mesure toujours la valeur qui avait été encodée par Alice lorsque la même base est utilisée. Il s’agit d’une conséquence de l’utilisation d’une base orthogonale et de la règle de Born, qui stipule que la probabilité d’un résultat de mesure correspond au carré de la composante du vecteur de polarisation, exprimé dans cette base. Si les bases d’Alice et de Bob ne concordent pas, le vecteur de polarisation du photon envoyé par Alice s’exprime alors comme une combinaison linéaire des vecteurs de la base de mesure de Bob. Le résultat de la mesure est alors aléatoire.',
        'component.bb84.about.disturbance.title': 'Perturbation de l’état par la mesure',
        'component.bb84.about.disturbance': 'On entend souvent qu’un système quantique peut être « dans deux états en même temps », c’est-à-dire en superposition d’états. Cela signifie que si on mesure le système, on ne peut pas prédire quel sera le résultat de la mesure, mais on connaît avec quelle probabilité chacun des résultats peut être observé. Une fois la mesure effectuée, l’état de superposition est détruit et le système est dans l’état qui a été mesuré. Une nouvelle mesure donnerait le même résultat. ',
        'component.bb84.about.eve.title': 'Détection de la présence d’Ève',
        'component.bb84.about.eve': 'Considérons seulement les photons pour lesquels Alice et Bob ont utilisé la même base puisque ce sont ces photons qui servent à établir la clé. Pour détenir de l’information sur la clé, Ève doit choisir dans quelle base elle mesure les photons qu’elle intercepte. Pour un de ces photons, supposons qu’Alice et Bob utilisent la base +. Si, par chance, Ève choisit également la base +, elle mesurera à coup sûr la bonne valeur puis pourra retransmettre le bit dans un nouveau photon de même polarisation. La présence d’Eve ne peut pas être détectée dans ce cas-ci. Si elle fait plutôt sa mesure dans la base x, ce qui a une chance sur deux de se produire, Ève transmettra à Bob un nouveau photon dont la polarisation est en superposition d’états par rapport à la base +. Le résultat de la mesure de Bob est donc probabiliste et la présence d’Ève peut être détectée.',
        'component.homePage.userFriendlyTitle': 'Convivial',
        'component.homePage.multiplayerTitle': 'Expérience multijoueur',
        'component.homePage.extensibleTitle': 'Hautement extensible',
        'component.bb84.aboutTitle': 'À propos du protocole',
        'component.header.protocols': 'Protocoles',
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
            ' aléatoirement',
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
        'component.quantumCrypto.gamesPlayed': 'Nombre de parties jouées:',
        'component.header.about.e91': 'À propos de E91',
        'component.e91.howToPlayTitle': 'Comment jouer E91',
        'component.e91.howToPlayDescription': 'Le protocole E91 implique' +
            ' deux acteurs principaux : Alice et Bob, qui jouent des rôles' +
            ' différents. Vous pouvez ici explorer l\'ensemble des étapes' +
            ' que chacun d\'eux doit suivre pour mener à bien le protocole.',
        'component.e91.measurement.welcome': 'Bienvenue dans E91!',
        'component.e91.measurement.start': 'Choisissez une base de mesure pour chaque photon.',
        'component.e91.measurement.tab': 'Mesure des photons',
        'component.e91.photons': 'Photons',
        'component.e91.measure': 'Mesure',
        'component.e91.shareBases': 'Partager les bases',
        'component.e91.shareBases.alice': 'Maintenant, partagez vos bases avec Bob.',
        'component.e91.shareBases.bob': 'Maintenant, partagez vos bases avec Alice.',
        'component.e91.classifyBases': 'Catégorisez les paires de bases de mesure en fonction de leur utilité dans' +
            ' le protocole.',
        'component.e91.shortKey.restart': 'La longueur de votre clé est trop courte, vous pouvez redémarrer le jeu' +
            ' maintenant.',
        'component.e91.restart': 'Redémarrer',
        'component.e91.moveToMessaging': 'Échanger un message',
        'component.e91.evePresent': 'Ève était présente!',
        'component.e91.evePresent.stats': ' Ève a réussi à lire ce nombre de bits: ',
        'component.e91.decsion.unsecured': 'Le canal a été jugé non sécure par ',
        'component.e91.decsion.secured': 'Le canal a été jugé sécure par ',
        'component.e91.restart.unsecured': 'Canal compromis',
        'component.e91.restart.unsecured.description': ' Ève a été démasquée',
        'component.e91.gameLoss.title': 'Vous avez perdu!',
        'component.e91.gameLoss': ' Ève n\'a pas interféré sur ce canal',
        'component.e91.highlights.highlight1': 'Choisissez de façon aléatoire une base de mesure ',
        'component.e91.steps.step1': ' pour les photons incidents, les résultats de mesure' +
            ' seront utilisés pour établir votre clé de chiffrement et détecter la présence d\'Ève.',
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
        'component.e91.validation.invalid.start': 'Glissez la bonne valeur (+1 or -1) vers le contenant approprié' +
            ' pour chaque paire de photons. Rappel: multipliez les résultats des mesures d\'Alice et de' +
            ' Bob pour obtenir cette valeur.',
        'component.e91.basisDesc': ' (a, b, a\', b\')',
        'component.e91.button.secure': 'Sécuritaire',
        'component.e91.button.unsecure': 'Non sécuritaire',
        'component.e91.button.showGraph': 'Monter le graphique',
        'component.e91.graph.title': 'CHSH',
        'component.e91.text.seeResults': 'Voir les résultats',
        'component.e91.createGame.keyMin': 'Le nombre minimal de paires de photons est de 20 lorsqu\'Ève est présente et de 10 dans le cas contraire.',
        'component.tooltip.bobBase': 'Base de Bob',
        'component.tooltip.aliceBase': 'Base d\'Alice',
        'component.tooltip.category': "Catégorie",
        'component.tooltip.description': "Description",
        'component.tooltip.key': "Clé",
        'component.tooltip.discard': "Jeter",
        'component.tooltip.bell': "Bell",
        'component.e91.dropHere': 'Déposez ici',
        'component.e91.results.room': 'Salle',
        'component.e91.results.evePresent': 'Ève présente',
        'component.e91.results.eveDetected': 'Ève détectée',
        'component.e91.results.time': 'Temps',
        'component.e91.about.part1': 'Le protocole a été proposé en 1991 par Artur Ekert. Il implique deux parties distinctes, Alice et Bob, qui souhaitent établir une clé de chiffrement afin de communiquer de manière sécurisée via un canal public. Dans ce protocole, Alice et Bob reçoivent tous les deux un photon provenant d’une source qui émet des paires de photons dont les polarisations sont maximalement intriquées : les photons forment ce qu’on appelle des paires de Bell. Pour chaque paire, la polarisation d’un photon sera mesurée par Alice et l’autre par Bob. Alice effectue chaque mesure en choisissant de façon aléatoire une base parmi l’ensemble de trois bases ',
        'component.e91.about.part2': 'Bob fait de même en choisissant parmi les bases',
        'component.e91.about.part3': '. Parmi les bases de mesure à leur disposition, Alice et Bob en ont donc 2 qu’ils partagent, ',
        'component.e91.about.figures.title': 'Figure des bases ',
        'component.e91.about.figures.part1': 'Pour chaque mesure, Alice et Bob enregistrent le résultat : +1 ou -1. Une fois la transmission des paires de photons terminée et les mesures effectuées, Alice et Bob divulguent les bases de mesure qu’ils ont utilisées pour chaque photon. Les résultats des mesures effectuées dans la même base sont conservés pour former la clé de chiffrement. Cette situation survient en moyenne 2 fois sur 9 : lorsqu’Alice et Bob mesurent tous les deux dans la base b ou encore dans la base a’. Les résultats des mesures effectuées dans des bases différentes sont révélés et utilisés pour valider la sécurité de la source et du canal quantique qui ont été utilisés. Pour ce faire, le protocole E91 s’appuie une des expériences les plus spectaculaires de la mécanique quantique : la vérification des inégalités de Bell. Il existe plusieurs formulations de ces inégalités et le protocole E91 s’appuie spécifiquement sur l’inégalité de CHSH. Alice et Bob travailleront seulement avec les résultats des mesures effectuées dans les bases suivantes ',
        'component.e91.about.figures.part2': 'Ce sont donc, en moyenne, 4 paires de photons sur 9 qui sont utilisées pour vérifier l’inégalité de CHSH. Pour chaque paire de résultats issus des combinaisons de bases du tableau précédent, Alice et Bob calculent le produit mA × mB où mA et mB sont les résultats de la mesure effectuée par Alice et Bob respectivement. La moyenne des produits est ensuite calculée pour chacune des combinaisons de base. ',
        'component.e91.about.figures.part3': 'En guise d’exemple, supposons qu’Alice et Bob ont effectué les mesures suivantes:',
        'component.e91.about.figures.part4': 'Le calcul des moyennes donne:',
        'component.e91.about.figures.part5': 'L’inégalité de CHSH consiste à vérifier que',
        'component.e91.about.figures.part6': 'Il s’avère que lorsque S est calculé à partir de photons intriqués, cette inégalité n’est pas vérifiée. En fait, on peut montrer que 𝑆 = 2√2 ≈ 2.83 pour des photons maximalement intriqués. Ainsi, si l’émetteur de paires de photons est fiable et que le canal de communication n’est pas bruité – ou pire espionné ! – Alice et Bob devraient observer que la valeur de S tend vers 2√2 au fur et à mesure qu’ils augmentent le nombre de paires de photons considérées dans leur calcul. Ils pourront alors utiliser la clé qu’ils ont obtenue pour chiffrer leur message. À l’inverse, si cette valeur demeure sous 2 ils ne peuvent avoir confiance en la clé obtenue et devraient s’abstenir de l’utiliser. Attention, les valeurs moyennes sont des quantités statistiques qui nécessitent un grand échantillon pour être significatives. Pour un nombre limité d’échantillons des anomalies statistiques peuvent survenir et il peut être difficile de tirer des conclusions. ',
        'component.e91.about.figures.part7.1': 'Notez qu’il reste 3 combinaisons de bases de mesure qui ne sont pas utilisées dans le protocole E91 : ',
        'component.e91.about.figures.part7.2': 'Les mesures effectuées avec ces paires de bases sont simplement jetées. ',
        'component.e91.results.score': 'Points',
        'component.e91.basis.waitingOn.bob': 'En attente des bases de Bob.',
        'component.e91.basis.waitingOn.alice': 'En attente des bases d\'Alice.',
        'component.e91.basis.arrivedFrom.bob': 'Les bases de Bob sont arrivées!',
        'component.e91.basis.arrivedFrom.alice': 'Les bases d\'Alice sont arrivées!',
    },
    {
        // ... (Spanish translations)
        'component.main.name': 'Juan',
        'component.header.howToPlay': 'Cómo jugar',
        'component.header.about': 'Acerca de QuantumCrypto',
        'component.header.about.bb84': 'Acerca de BB84',
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
        'component.createGame.keyLength': 'Número de fotones',
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
        'component.game.playerHeader': 'estás jugando como',
        'component.game.gameProgressionTitle': 'Progresión del juego',
        'component.aliceGame.bits': 'Bits ',
        'component.aliceGame.bitsDesc': '(0 o 1)',
        'component.aliceGame.basis': 'Base',
        'component.aliceGame.basisDesc': ' (+ o x)',
        'component.aliceGame.polarization': 'Polarización',
        'component.aliceGame.random': 'Aleatorio',
        'component.aliceGame.send': 'Enviar a Bob',
        'component.bobGame.photons': 'Fotones',
        'component.aliceExchange.send': '¡Enviar a Bob!',
        'component.exchange.welcome': '¡Bienvenido a BB84!',
        'component.bobExchange.measurements': 'Mediciones',
        'component.bobExchange.shareBases': '¡Comparte las bases!',
        'component.bobExchange.waiting': 'Esperando los fotones de Alice...',
        'component.aliceExchange.sent': '¡Tus fotones fueron enviados!' +
            ' Esperando la base de Bob...',
        'component.game.step1': 'Paso 1: ',
        'component.game.step2': 'Paso 2: ',
        'component.aliceExchange.start': 'Elige bits y bases al azar y' +
            ' determina la polarización de los fotones.',
        'component.bobExchange.shareWithAlice': '¡Mediciones realizadas!' +
            ' Comparte tu base con Alice para continuar.',
        'component.bobExchange.photonsArrived': '¡Los fotones de Alice' +
            ' acaban de llegar!',
        'component.bobExchange.choose': 'Elige bases al azar y mide los' +
            ' fotones.',
        'component.aliceExchange.basesArrived': '¡Las bases de Bob acaban' +
            ' de llegar!',
        'component.bobExchange.measure': 'Medir',
        'component.bobExchange.basesArrived': '¡Acaban de llegar las bases' +
            ' de Alice!',
        'component.game.tabs1': 'Intercambio de información cuántica',
        'component.game.tabs2': 'Reconciliación de bases',
        'component.game.tabs3': 'Mensajería cifrada',
        'component.game.step3': 'Paso 3: ',
        'component.game.step4': 'Paso 4: ',
        'component.basis.validate': 'Descarta los bits donde las bases no' +
            ' coinciden haciendo clic en ellos. Después de descartarlos,' +
            ' tendrás la clave secreta.',
        'component.messaging.bob.start': '¡Buen trabajo! Ahora, esperemos' +
            ' el mensaje cifrado de Alice...',
        'component.messaging.alice.start': '¡Buen trabajo!',
        'component.messaging.alice.last': 'Ingresa un mensaje y encríptalo' +
            ' usando tu clave secreta. ¡Luego, envía el mensaje a Bob!',
        'component.messaging.alice.sent': '¡Tu mensaje ha sido enviado!' +
            ' Ahora, esperemos el descifrado de Bob...',
        'component.messaging.bob.arrived': '¡El mensaje cifrado de Alice' +
            ' está aquí!',
        'component.messaging.bob.decrypt': 'Usa la clave secreta para' +
            ' descifrar el mensaje.',
        'component.messaging.congratulations': 'Felicidades ',
        'component.messaging.bob.end': '¡Has descifrado el mensaje de Alice!',
        'component.messaging.alice.end': '¡Bob pudo descifrar tu mensaje!',
        'component.messaging.alice.reveal': 'Tu Bob era ',
        'component.messaging.bob.reveal': 'Tu Alice era ',
        'component.basis.validateBtn': 'Validar',
        'component.messaging.yourKey': 'Tu clave',
        'component.messaging.yourMessage': 'Tu mensaje',
        'component.messaging.yourEncrypted': 'Tu mensaje cifrado (0 o 1)',
        'component.messaging.aliceEncrypted': 'Mensaje cifrado de Alice',
        'component.messaging.aliceDecrypt': 'Mensaje descifrado de Alice',
        'component.basis.yourBases': 'Tus bases',
        'component.basis.bobBases': 'Bases de Bob',
        'component.basis.aliceBases': 'Bases de Alice',
        'component.basis.verify': 'Verifica tus bits',
        'component.basis.correct': '¡Correcto!',
        'component.messaging.validateAndSend': 'Validar y enviar',
        'component.messaging.cipherError': 'Verifica tu mensaje y tus bits' +
            ' cifrados',
        'component.messaging.cipherSent': '¡Enviado!',
        'component.messaging.decryptError': 'Verifica tus bits de descifrado',
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
        'component.game.tabValidation': 'Validación',
        'component.validationTab.yourKey': 'Tus bits',
        'component.validationTab.bobsKey': 'Bits de Bob',
        'component.validationTab.alicesKey': 'Bits de Alice',
        'component.validationTab.valid': 'Válida',
        'component.validationTab.invalid': 'Inválida',
        'component.createGame.evePercentage.invalidType': 'Solo se permiten' +
            ' números entre 0.1 y 1',
        'component.createGame.evePercentage.positive': 'Debe ser positivo',
        'component.createGame.evePercentage.greaterThan': 'Debe ser 0.1 o más',
        'component.createGame.evePercentage.lessThan': 'Debe ser 1 o menos',
        'component.createGame.evePercentage.label': 'Probabilidad de Eve',
        'component.gameRestart.restart': 'Reiniciar',
        'component.gameRestart.playAgain': 'Jugar de nuevo',
        'component.return.returnToMain': 'Regresar al menú principal',
        'component.results.seeResults': 'Ver resultados',
        'component.basisTab.alertTitle': '¡No hay suficientes bits!',
        'component.basisTab.alertDescription': 'La clave que obtuviste no' +
            ' tiene suficientes bits para verificar que no hay un espía.' +
            ' Debes empezar de nuevo.',
        'component.validationTab.title': 'Etapa de validación',
        'component.validationTab.start': 'Los bits seleccionados para la' +
            ' validación son',
        'component.validationTab.arrived': '¡Los bits han llegado!',
        'component.validationTab.select': 'Selecciona válido o inválido',
        'component.validationTab.areYouSure': '¿Estás seguro? Verifica las' +
            ' claves nuevamente.',
        'component.validationTab.validKey': '¡Canal de comunicación validado' +
            ' con éxito!',
        'component.validationTab.found': '¡Has detectado al espía!',
        'component.validationTab.waiting': 'Esperando los otros bits...',
        'component.validationTab.validated': '¡Validado!',
        'component.validationTab.bobValid': 'Bob ha determinado que el' +
            ' canal de comunicación es válido',
        'component.validationTab.bobInvalid': 'Bob ha determinado que el' +
            ' canal de comunicación es inválido',
        'component.validationTab.aliceValid': 'Alice ha determinado que el' +
            ' canal de comunicación es válido',
        'component.validationTab.aliceInvalid': 'Alice ha determinado que' +
            ' el canal de comunicación es inválido',
        'component.bb84.gameFound': '¡Partida encontrada!',
        'component.bb84.gameFound.desc': 'Parece que abandonaste un juego' +
            ' mientras aún estaba activo. ¿Quieres volver a unirte?',
        'component.bb84.gameFound.action': 'Volver a unirse',
        'general.close': 'Cerrar',
        'component.bb84.play.sorry': 'Lo siento, no pudimos encontrar un' +
            ' compañero para ti :(',
        'component.validation.gameRestarted': 'Tú o tu pareja reiniciaron' +
            ' el juego tras descubrir al espía.',
        'component.validation.indices': 'Los índices de la clave' +
            ' seleccionados aleatoriamente para la validación son: ',
        'component.homePage.protocolsSection.bb84.description': 'Un' +
            ' protocolo para compartir de forma segura claves' +
            ' criptográficas entre dos partes a través de un canal de' +
            ' comunicación inseguro.',
        'component.homePage.protocolsSection.e91.description': 'El protocolo E91 utiliza el entrelazamiento cuántico para garantizar la seguridad de las comunicaciones al permitir que las partes intercambien claves criptográficas inviolables.',
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
        'component.bb84.about': 'El protocolo BB84 fue propuesto en 1984 por Charles Bennett de IBM y Gilles Brassard de la Universidad de Montreal. Implica a dos partes distintas, Alice y Bob, que buscan establecer una <link2>clave de cifrado</link2> para comunicarse de manera segura a través de un <link3>canal público</link3>. El protocolo comienza con Alice creando una secuencia aleatoria de bits y <link5>codificando cada bit</link5> usando un <link1>fotón</link1>. Específicamente, el valor del bit se codifica en uno de los dos <link6>estados de polarización mutuamente ortogonales</link6> del fotón. Además, para cada fotón, la base utilizada para describir la polarización de la luz se elige aleatoriamente entre dos posibles bases. Alice luego envía estos fotones a Bob a través de un <link4>canal cuántico público</link4> . Cuando Bob recibe los fotones, los mide utilizando una de las dos bases, también elegida al azar. Posteriormente, Alice y Bob anuncian públicamente las bases que usaron para codificar y medir cada fotón. Se forma una clave conservando solo los bits para los cuales las bases de Alice y Bob coinciden. Finalmente, comparando un subconjunto de los bits de su clave, Alice y Bob pueden detectar la <link8>presencia de un espía</link8>, generalmente llamado Eve, y así garantizar la seguridad de su canal de comunicación cuántica. Esto se debe a que, según los principios fundamentales de la mecánica cuántica, cualquier intento de Eve por interceptar y medir estos fotones <link7>alterará su estado</link7>, introduciendo inconsistencias que Alice y Bob pueden detectar. Si concluyen que el canal cuántico no ha sido comprometido, pueden usar la clave generada para enviar un mensaje de manera segura. De lo contrario, deben repetir el procedimiento.',
        'component.bb84.about.encryptionKey.title': 'Clave de cifrado ',
        'component.bb84.about.encryptionKey.part1': 'Una clave de cifrado es un código secreto (en bits) que protege la información transformándola a un formato ilegible. Solo las personas que poseen la clave de descifrado pueden restaurar el mensaje original. La clave de descifrado puede ser la misma (claves simétricas) o diferente (claves asimétricas). Por ejemplo, en un escenario de cifrado con clave simétrica, Alice y Bob comparten la clave de cifrado: 010010. Si Alice quiere enviar un mensaje confidencial a Bob, realiza una operación XOR bit a bit entre la clave y su mensaje. Así funciona la operación XOR para diferentes valores de bits: ',
        'component.bb84.about.encryptionKey.part2': 'Supongamos que el mensaje que Alice quiere enviar es 111000. La operación de cifrado genera la secuencia 101010, como se muestra en la siguiente tabla: ',
        'component.bb84.about.encryptionKey.part3': 'Esta secuencia se envía a Bob, quien, como la única otra persona que posee la clave, puede descifrar el mensaje realizando una operación XOR bit a bit entre el mensaje cifrado y la clave. ',
        'component.bb84.about.encryptionKey.message': 'Mensaje',
        'component.bb84.about.encryptionKey.key': 'Clave',
        'component.bb84.about.encryptionKey.cypher': 'Message cifrado',
        'component.bb84.about.photon.title': 'Fotón ',
        'component.bb84.about.photon': 'A menudo se dice que todo en el universo está compuesto de partículas, incluida la luz. De hecho, las partículas que componen la luz se llaman fotones, y son responsables de transportar la energía luminosa. El protocolo BB84 utiliza la polarización de los fotones para transmitir información en forma de bits (0 o 1). Esta propiedad cuántica esencial de las partículas de luz nos aporta un protocolo seguro. ',
        'component.bb84.about.publicPrivate.title': 'Canal público vs. Canal privado ',
        'component.bb84.about.publicPrivate': 'Un canal público es un medio de comunicación en el que cualquiera puede potencialmente escuchar los mensajes intercambiados, como si hablaras en voz alta en una habitación llena de gente. Un canal privado, en cambio, garantiza que la comunicación se realice solo entre las partes interesadas sin posibilidad de interceptación, como una conversación en voz baja entre dos interlocutores donde nadie más puede escuchar. Como puede ser difícil garantizar la privacidad de un canal de comunicación, se utiliza la criptografía para hacer que los mensajes sean incomprensibles en un canal público, protegiendo así la confidencialidad de los datos.',
        'component.bb84.about.classicalQuantum.title': 'Canal clásico vs canal cuántico ',
        'component.bb84.about.classicalQuantum': 'Un canal clásico está diseñado para transmitir información clásica, como mensajes binarios o textuales. Transmitir información cuántica a través de un canal clásico presenta grandes desafíos de rendimiento debido al ruido introducido por la información clásica. En cambio, un canal cuántico está diseñado para transmitir información cuántica, como el estado de un fotón. Este canal conserva las propiedades cuánticas de la información, asegurando una alta probabilidad de que la información correcta se reciba intacta al otro lado. ',
        'component.bb84.about.encoding.title': 'Codificación de un bit en un fotón',
        'component.bb84.about.encoding': 'La codificación de un bit en un fotón se refiere a cómo se utiliza la polarización de los fotones para representar bits (0 o 1). La polarización es una propiedad de los fotones que describe la dirección en la que oscila su campo eléctrico. En el protocolo BB84, esta polarización se usa para codificar bits eligiendo entre dos bases: la base + y la base x. En la base +, un fotón polarizado horizontalmente (↔) representa el bit 0, mientras que un fotón polarizado verticalmente (↕) representa el bit 1. En la base x, un fotón polarizado diagonalmente (⤢) representa el bit 0, y un fotón polarizado en la dirección diagonal opuesta (⤡) representa el bit 1. Alice codifica cada bit de esta manera antes de enviarlo a Bob. ',
        'component.bb84.about.orthogonal.title': 'Base orthogonal ',
        'component.bb84.about.orthogonal': 'En un plano cartesiano bidimensional, una base es un conjunto de dos vectores, v₀ y v₁​, que pueden representar cualquier vector en el plano como una combinación lineal de v₀​ y v₁​. Cuando v₀​ y v₁​ forman un ángulo de 90°, son ortogonales y crean una base ortogonal. Una base natural consiste en un vector alineado con el eje x y otro alineado con el eje y, conocida como la base + en el protocolo BB84. Al rotar los vectores de la base + a 45°, se obtiene la base x. Asociando los bits 0 y 1 con los vectores ortogonales de una base, Bob siempre mide el valor codificado por Alice cuando usan la misma base. Esto es una consecuencia del uso de una base ortogonal y de la regla de Born, que establece que la probabilidad de un resultado de medición corresponde al cuadrado de la componente del vector de polarización en esa base. Si las bases de Alice y Bob no coinciden, el vector de polarización del fotón enviado por Alice se expresa como una combinación lineal de los vectores de la base de medición de Bob. El resultado de la medición será entonces aleatorio. ',
        'component.bb84.about.disturbance.title': 'Perturbación del estado por la medición',
        'component.bb84.about.disturbance': 'A menudo se dice que un sistema cuántico puede estar "en dos estados a la vez", es decir, en una superposición de estados. Esto significa que al medir el sistema, no se puede predecir cuál será el resultado, pero se conoce la probabilidad de cada posible resultado. Una vez que se realiza una medición, la superposición se destruye y el sistema colapsa al estado medido. Una nueva medición dará el mismo resultado. ',
        'component.bb84.about.eve.title': 'Detección de la presencia de Eve ',
        'component.bb84.about.eve': 'Consideremos solo los fotones para los que Alice y Bob usaron la misma base, ya que estos fotones se utilizan para establecer la clave. Para obtener información sobre la clave, Eve debe elegir una base para medir los fotones que intercepta. Para un fotón dado, supongamos que Alice y Bob usan la base +. Si Eve, por casualidad, también elige la base +, medirá el valor correcto y retransmitirá el bit en un fotón con la misma polarización. En este caso, la presencia de Eve no se puede detectar. Sin embargo, si Eve mide en la base x, lo cual tiene un 50% de probabilidad de ocurrir, Eve transmitirá a Bob un fotón polarizado en una superposición de estados con respecto a la base +. El resultado de la medición de Bob será entonces probabilístico, introduciendo errores que Alice y Bob pueden usar para detectar la presencia de Eve. ',
        'component.homePage.userFriendlyTitle': 'Amigable para el usuario',
        'component.homePage.multiplayerTitle': 'Experiencia multijugador',
        'component.homePage.extensibleTitle': 'Altamente extensible',
        'component.bb84.aboutTitle': 'Acerca del protocolo',
        'component.header.protocols': 'Protocolos',
        'component.bb84.howToPlayTitle': 'Cómo jugar BB84',
        'component.bb84.howToPlayDescription': 'El protocolo BB84 tiene dos' +
            ' actores principales: Alice y Bob, que desempeñan roles' +
            ' diferentes. Aquí puedes explorar el conjunto de pasos que' +
            ' cada uno de ellos debe seguir para completar el protocolo con' +
            ' éxito.',
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
        'component.bb84.steps.step6Alice': ' verificando que' +
            ' los' +
            ' bits seleccionados aleatoriamente de tu clave sin procesar' +
            ' coincidan con los de Bob. Si coinciden, puedes suponer que la' +
            ' probabilidad de que haya un espía es muy baja y' +
            ' puedes usar la clave con seguridad. De lo contrario, has' +
            ' detectado la presencia de un espía y debes reiniciar el' +
            ' protocolo.',
        'component.bb84.steps.step7Alice': ' a Bob',
        'component.bb84.highlights.highlight1Alice': 'Crea una cadena de' +
            ' bits aleatoria',
        'component.bb84.highlights.highlight2Alice': 'Selecciona' +
            ' aleatoriamente un conjunto de bases',
        'component.bb84.highlights.highlight3Alice': 'Codifica tus bits',
        'component.bb84.highlights.highlight4Alice': 'Comparte tus fotones',
        'component.bb84.highlights.highlight5Alice': 'Compara tus bases con' +
            ' las de Bob',
        'component.bb84.highlights.highlight6Alice': 'Valida tu clave',
        'component.bb84.highlights.highlight7Alice': 'Encripta y envía tu' +
            ' mensaje',
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
        'component.bb84.steps.step4Bob': ' y descarte los bits donde las' +
            ' bases no coincidan.',
        'component.bb84.steps.step5Bob': ' verificando que los bits' +
            ' seleccionados aleatoriamente de su clave sin procesar' +
            ' coincidan con los de Bob. Si coinciden, puede suponer que la' +
            ' probabilidad de que haya un espía presente es muy baja y' +
            ' puede usar la clave con seguridad. De lo contrario, ha' +
            ' detectado la presencia de un espía y debe reiniciar el' +
            ' protocolo.',
        'component.bb84.steps.step6Bob': ' usando su clave.',
        'component.bb84.highlights.highlight1Bob': 'Selecciona' +
            ' aleatoriamente un conjunto de bases',
        'component.bb84.highlights.highlight2Bob': 'Mide los fotones',
        'component.bb84.highlights.highlight3Bob': 'Comparte tus bases',
        'component.bb84.highlights.highlight4Bob': 'Compara tus bases con' +
            ' las de Alice',
        'component.bb84.highlights.highlight5Bob': 'Valida tu clave',
        'component.bb84.highlights.highlight6Bob': 'Descifra el mensaje de' +
            ' Alice',
        'component.quantumCrypto.gamesPlayed': 'Total games played: ',
        'component.bb84.playSolo': 'Jugar solo',
        'component.bb84.startSolo': 'Comenzar juego en solitario',
        'component.bb84.soloRoleSelect': 'Selecciona tu rol',
        'component.header.about.e91': 'Acerca de E91',
        'component.e91.about.part1': 'El protocolo fue propuesto en 1991 por Artur Ekert. Implica a dos personas, Alice y Bob, que buscan establecer una clave de cifrado para comunicarse de manera segura a través de un canal público. En este protocolo, Alice y Bob reciben cada uno un fotón de una fuente que emite pares de fotones con polarizaciones máximamente entrelazadas: estos fotones forman lo que se conoce como pares de Bell. Para cada par, Alice mide la polarización de un fotón y Bob mide la del otro. Alice realiza cada medición eligiendo aleatoriamente una base del conjunto de tres bases ',
        'component.e91.about.part2': 'Bob hace lo mismo eligiendo entre las bases',
        'component.e91.about.part3': '. Entre estas bases, Alice y Bob comparten dos en común: ',
        'component.e91.about.figures.title': 'Figura de las Bases ',
        'component.e91.about.figures.part1': 'Para cada medición, Alice y Bob registran el resultado: +1 o -1. Una vez completada la transmisión de los pares de fotones y realizadas las mediciones, Alice y Bob publican las bases de medición que utilizaron para cada fotón. Los resultados de las mediciones realizadas en la misma base se conservan para formar la clave de cifrado. Esto ocurre, en promedio, 2 de cada 9 veces: cuando Alice y Bob miden ambos en la base b o en la base a\'. Los resultados de las mediciones realizadas en bases diferentes se revelan y se usan para validar la seguridad de la fuente y del canal cuántico. Para esto, el protocolo E91 se basa en uno de los experimentos más destacados de la mecánica cuántica: la prueba de las desigualdades de Bell. Existen varias formulaciones de estas desigualdades, y el protocolo E91 utiliza específicamente la desigualdad CHSH. Alice y Bob trabajan únicamente con los resultados de las mediciones realizadas en las siguientes bases:',
        'component.e91.about.figures.part2': 'En promedio, 4 de cada 9 pares de fotones se utilizan para verificar la desigualdad de CHSH. Para cada par de resultados derivados de las combinaciones de bases en la tabla anterior, Alice y Bob calculan el producto mA × mB, donde mA y mB son los resultados de la medición obtenidos por Alice y Bob, respectivamente. Luego, se calcula el promedio de los productos para cada combinación de bases. ',
        'component.e91.about.figures.part3': 'Como ejemplo, supongamos que Alice y Bob han realizado las siguientes mediciones: ',
        'component.e91.about.figures.part4': 'Los promedios se calculan como sigue: ',
        'component.e91.about.figures.part5': 'La desigualdad CHSH se verifica comprobando que ',
        'component.e91.about.figures.part6': 'Cuando S se calcula a partir de fotones entrelazados, esta desigualdad no se cumple. De hecho, se puede demostrar que 𝑆 = 2√2 ≈ 2.83 para fotones máximamente entrelazados. Por lo tanto, si el emisor de pares de fotones es confiable y el canal de comunicación no produce ruido ni es espiado, Alice y Bob deberían observar que el valor de S tiende hacia 2√2 a medida que aumentan el número de pares de fotones considerados en sus cálculos. Luego podrán usar la clave obtenida para cifrar sus mensajes. Por el contrario, si este valor permanece por debajo de 2, no pueden confiar en la clave y deberían abstenerse de usarla. Tenga en cuenta que los valores promedio son cantidades estadísticas que requieren una gran muestra para ser significativos. Con un número limitado de muestras, pueden ocurrir anomalías estadísticas que dificulten sacar conclusiones confiables. ',
        'component.e91.about.figures.part7.1': 'Finalmente, observe que hay tres combinaciones de bases de medición que no se utilizan en el protocolo E91: ',
        'component.e91.about.figures.part7.2': 'Las mediciones realizadas con estas combinaciones de bases simplemente se descartan. ',
        'component.e91.howToPlayTitle': 'Cómo jugar E91',
        'component.e91.howToPlayDescription': 'El protocolo E91 tiene dos' +
            ' actores principales: Alice y Bob, que desempeñan roles' +
            ' diferentes. Aquí puedes explorar el conjunto de pasos que' +
            ' cada uno de ellos debe seguir para completar el protocolo con' +
            ' éxito.',
        'component.e91.measurement.welcome': '¡Bienvenido a E91!',
        'component.e91.measurement.start': 'Elige una base de medición para cada fotón.',
        'component.e91.measurement.tab': 'Mediciones de fotones',
        'component.e91.photons': 'Fotones',
        'component.e91.measure': 'Medida',
        'component.e91.shareBases': 'Compartir mis bases',
        'component.e91.shareBases.alice': 'Ahora comparte tus bases con Bob',
        'component.e91.shareBases.bob': 'Ahora comparte tus bases con Alice',
        'component.e91.classifyBases': 'Categoriza los pares de bases de medición según su utilidad en el protocolo.',
        'component.e91.shortKey.restart': 'La longitud de tu clave es demasiado corta, puedes reiniciar el juego ahora.',
        'component.e91.restart': 'Reiniciar',
        'component.e91.moveToMessaging': 'Intercambiar un mensaje',
        'component.e91.evePresent': '¡Eve estuvo presente!',
        'component.e91.evePresent.stats': ' Eve ha leído con éxito este número de bits: ',
        'component.e91.decsion.unsecured': 'El canal fue considerado inseguro por ',
        'component.e91.decsion.secured': 'El canal fue considerado seguro por ',
        'component.e91.restart.unsecured': 'Canal comprometido',
        'component.e91.restart.unsecured.description': ' Eve ha sido descubierta',
        'component.e91.gameLoss.title': '¡Perdiste!',
        'component.e91.gameLoss': ' Eve no interfirió en este canal',
        'component.e91.highlights.highlight1': 'Elige al azar una base de medición',
        'component.e91.steps.step1': ' para los fotones entrantes, los resultados de la medición se usarán para establecer' +
            ' tu clave de cifrado y detectar la presencia de Eve.',
        'component.e91.highlights.highlight2': 'Comparte tus bases de medición',
        'component.e91.steps.step2Alice': ' con Bob.',
        'component.e91.steps.step2Bob': ' con Alice.',
        'component.e91.highlights.highlight3': 'Extrae tu clave de cifrado',
        'component.e91.steps.step3': ' a partir de los resultados de medición obtenidos para pares de bases idénticas.',
        'component.e91.highlights.highlight4': 'Valida tu clave',
        'component.e91.steps.step4': ' probando la desigualdad CHSH con las mediciones tomadas con las otras combinaciones ' +
            'de bases.',
        'component.e91.highlights.highlight5Alice': 'Cifra y envía tu mensaje',
        'component.e91.steps.step5Alice': ' a Bob.',
        'component.e91.highlights.highlight5Bob': 'Descifra el mensaje de Alice',
        'component.e91.steps.step5Bob': ' usando tu clave.',
        'component.e91.validation.invalid.start': 'Arrastra el valor correcto (+1 o -1) al contenedor' +
            ' correspondiente para cada par de fotones. Recordatorio: multiplica los resultados de' +
            ' medición de Alice y Bob para determinar este valor.',
        'component.e91.basisDesc': ' (a, b, a\', b\')',
        'component.e91.button.secure': 'Seguro',
        'component.e91.button.unsecure': 'No seguro',
        'component.e91.button.showGraph': 'Mostrar gráfico',
        'component.e91.text.values': 'Valores',
        'component.e91.text.seeResults': 'Ver resultados',
        'component.e91.createGame.keyMin': 'El número mínimo de pares de fotones es 20 cuando Eve está presente, y 10 en' +
            ' caso contrario.',
        'component.tooltip.bobBase': 'Base de Bob',
        'component.tooltip.aliceBase': 'Base de Alice',
        'component.tooltip.category': "Categoría",
        'component.tooltip.description': "Descripción",
        'component.tooltip.key': "Clave",
        'component.tooltip.discard': "Descartar",
        'component.tooltip.bell': "Bell",
        'component.e91.dropHere': 'Caer aquí',
        'component.e91.results.room': 'Sala',
        'component.e91.results.evePresent': 'Eve presente',
        'component.e91.results.eveDetected': 'Eve detectada',
        'component.e91.results.time': 'Tiempo',
        'component.e91.results.score': 'Puntuación',
        'component.e91.basis.waitingOn.bob': 'Esperando las bases de Bob.',
        'component.e91.basis.waitingOn.alice': 'Esperando las bases de Alice.',
        'component.e91.basis.arrivedFrom.bob': 'Las bases de Bob han llegado!',
        'component.e91.basis.arrivedFrom.alice': 'Las bases de Alice han llegado!',
    },
    {
        // ... (German translations)
        'component.main.name': 'Jonas',
        'component.header.howToPlay': 'Spielanleitung',
        'component.header.about': 'Über QuantumCrypto',
        'component.header.about.bb84': 'Über BB84',
        'component.main.game': 'Ein Quantenverschlüsselungsspiel',
        'component.main.nameRequired': 'Ein Name ist erforderlich',
        'component.main.nameMin': 'Ihr Name sollte mindestens 2 Zeichen' +
            ' lang sein',
        'component.main.nameMax': 'Ihr Name darf nicht länger als 10' +
            ' Zeichen sein',
        'component.main.pinRequired': 'Ein Spiel-PIN ist erforderlich',
        'component.main.pinLength': 'Der Spiel-PIN muss 5 Zeichen lang sein',
        'component.main.nameDescription': 'So sehen dich andere Spieler',
        'component.main.nameLabel': 'Name',
        'component.main.pinLabel': 'Spiel-PIN',
        'component.main.createGame': 'Spiel erstellen',
        'component.main.createGame.description': 'Wähle die Anzahl der' +
            ' Photonen und ob du möchtest, dass Eve in deinem Spiel vorhanden ist',
        'component.main.join': 'Beitreten',
        'component.main.invalidCodeTitle': 'Fehler beim Beitritt zum Spiel.',
        'component.main.invalidCodeMessage': 'Überprüfe den Spiel-PIN',
        'component.waitingRoom.players': 'Spieler',
        'component.waitingRoom.joinAt': 'Beitreten unter',
        'component.waitingRoom.start': 'Start',
        'component.waitingRoom.exit': 'Verlassen',
        'component.waitingRoom.in': 'Du bist drin,',
        'component.waitingRoom.wait': 'Warte, bis der Gastgeber das Spiel' +
            ' startet',
        'component.main.takenNameTitle': 'Name vergeben',
        'component.main.takenNameDescription': 'Dieser Name ist bereits vergeben.' +
            ' Bitte wähle einen anderen.',
        'component.waitingRoom.gameEndedTitle': 'Spiel beendet',
        'component.waitingRoom.gameEndedDescription': 'Der Gastgeber hat' +
            ' das Spiel beendet',
        'component.waitingRoom.atLeastOnePlayer': 'Du brauchst mindestens' +
            ' einen Spieler',
        'component.createGame.keyLength': 'Anzahl der Photonen',
        'component.createGame.eve': 'Ist Eve vorhanden?',
        'component.createGame.keyError': 'Nur Zahlen zwischen 10 und 30' +
            ' erlaubt',
        'component.createGame.keyMin': 'Die minimale Anzahl von Photonen' +
            ' beträgt 16, wenn Eve vorhanden ist, und 10 sonst',
        'component.createGame.keyMax': 'Die maximale Anzahl von Photonen' +
            ' beträgt 30',
        'component.createGame.ready': 'Bereit!',
        'component.waitingRoom.connectionLostTitle': 'Verbindung verloren',
        'component.waitingRoom.connectionLostDescription': 'Sie haben die' +
            ' Verbindung zum Server verloren. Versuchen Sie, dem Spiel' +
            ' erneut beizutreten',
        'component.game.playerHeader': 'du spielst als',
        'component.game.gameProgressionTitle': 'Spielverlauf',
        'component.aliceGame.bits': 'Bits ',
        'component.aliceGame.bitsDesc': '(0 oder 1)',
        'component.aliceGame.basis': 'Basis',
        'component.aliceGame.basisDesc': ' (+ oder x)',
        'component.aliceGame.polarization': 'Polarisation',
        'component.aliceGame.random': 'Zufällig',
        'component.aliceGame.send': 'An Bob senden',
        'component.bobGame.photons': 'Photonen',
        'component.aliceExchange.send': 'An Bob senden!',
        'component.exchange.welcome': 'Willkommen bei BB84!',
        'component.bobExchange.measurements': 'Messungen',
        'component.bobExchange.shareBases': 'Basis teilen!',
        'component.bobExchange.waiting': 'Warten auf Alice\'s Photonen...',
        'component.aliceExchange.sent': 'Ihre Photonen wurden gesendet!' +
            ' Warten auf Bob\'s Basis...',
        'component.game.step1': 'Schritt 1: ',
        'component.game.step2': 'Schritt 2: ',
        'component.aliceExchange.start': 'Wähle zufällige Bits und Basen' +
            ' und bestimme die Polarisation der Photonen.',
        'component.bobExchange.shareWithAlice': 'Messungen durchgeführt!' +
            ' Teile deine Basis mit Alice, um fortzufahren.',
        'component.bobExchange.photonsArrived': 'Alice\'s Photonen sind' +
            ' gerade angekommen!',
        'component.bobExchange.choose': 'Wähle zufällige Basen und messe' +
            ' die Photonen.',
        'component.aliceExchange.basesArrived': 'Bob\'s Basen sind gerade' +
            ' angekommen!',
        'component.bobExchange.measure': 'Messen',
        'component.bobExchange.basesArrived': 'Alice\'s Basen sind gerade' +
            ' angekommen!',
        'component.game.tabs1': 'Austausch quantenmechanischer Informationen',
        'component.game.tabs2': 'Basisabgleich',
        'component.game.tabs3': 'Verschlüsselte Kommunikation',
        'component.game.step3': 'Schritt 3: ',
        'component.basis.validate': 'Entsorgen Sie die Bits, bei denen die' +
            ' Basen nicht übereinstimmen, indem Sie darauf klicken. Nachdem' +
            ' Sie sie entsorgt haben, haben Sie den geheimen Schlüssel.',
        'component.messaging.bob.start': 'Gute Arbeit! Jetzt warten wir auf' +
            ' Alice\'s verschlüsselte Nachricht...',
        'component.messaging.alice.start': 'Gute Arbeit!',
        'component.messaging.alice.last': 'Geben Sie eine Nachricht ein und' +
            ' verschlüsseln Sie sie mit Ihrem geheimen Schlüssel. Dann' +
            ' senden Sie die Nachricht an Bob!',
        'component.messaging.alice.sent': 'Ihre Nachricht wurde gesendet!' +
            ' Jetzt warten wir auf die Entschlüsselung durch Bob...',
        'component.messaging.bob.arrived': 'Alice\'s verschlüsselte' +
            ' Nachricht ist hier!',
        'component.messaging.bob.decrypt': 'Verwenden Sie den geheimen' +
            ' Schlüssel, um die Nachricht zu entschlüsseln.',
        'component.messaging.congratulations': 'Herzlichen Glückwunsch ',
        'component.messaging.bob.end': 'Sie haben Alice\'s Nachricht' +
            ' entschlüsselt!',
        'component.messaging.alice.end': 'Bob konnte Ihre Nachricht' +
            ' entschlüsseln!',
        'component.messaging.alice.reveal': 'Ihr Bob war ',
        'component.messaging.bob.reveal': 'Ihre Alice war ',
        'component.basis.validateBtn': 'Validieren',
        'component.messaging.yourKey': 'Dein Schlüssel',
        'component.messaging.yourMessage': 'Deine Nachricht',
        'component.messaging.yourEncrypted': 'Deine verschlüsselte' +
            ' Nachricht (0 oder 1)',
        'component.messaging.aliceEncrypted': 'Alice\'s verschlüsselte' +
            ' Nachricht',
        'component.messaging.aliceDecrypt': 'Alice\'s entschlüsselte' +
            ' Nachricht',
        'component.basis.yourBases': 'Deine Basen',
        'component.basis.bobBases': 'Bobs Basen',
        'component.basis.aliceBases': 'Alices Basen',
        'component.basis.verify': 'Überprüfe deine Bits',
        'component.basis.correct': 'Richtig!',
        'component.messaging.validateAndSend': 'Überprüfen und senden',
        'component.messaging.cipherError': 'Überprüfen Sie Ihre Nachricht' +
            ' und verschlüsselten Bits',
        'component.messaging.cipherSent': 'Gesendet!',
        'component.messaging.decryptError': 'Überprüfen Sie Ihre' +
            ' Entschlüsselungsbits',
        'component.waitingRoom.copied': 'Kopiert!',
        'component.main.gameStarted': 'Spiel gestartet',
        'component.main.gameStartedDescription': 'Das Spiel, zu dem Sie' +
            ' eine Verbindung herstellen möchten, hat bereits begonnen.',
        'component.createGame.numbersOnly': 'Nur Zahlen sind erlaubt',
        'component.createGame.validationLength': 'Die Validierungsbits' +
            ' müssen kleiner oder gleich der Hälfte der Schlüssellänge sein',
        'component.createGame.validationDescription': 'Validierungsbits',
        'component.main.errorCreating': 'Fehler beim Erstellen des Spiels',
        'component.game.tabValidation': 'Validierung',
        'component.validationTab.yourKey': 'Dein Bits',
        'component.validationTab.bobsKey': 'Bobs Bits',
        'component.validationTab.alicesKey': 'Alices Bits',
        'component.validationTab.valid': 'Gültig',
        'component.validationTab.invalid': 'Ungültig',
        'component.createGame.evePercentage.invalidType': 'Nur Zahlen' +
            ' zwischen 0,1 und 1 erlaubt',
        'component.createGame.evePercentage.positive': 'Muss positiv sein',
        'component.createGame.evePercentage.greaterThan': 'Muss 0,1 oder' +
            ' mehr sein',
        'component.createGame.evePercentage.lessThan': 'Muss 1 oder weniger' +
            ' sein',
        'component.createGame.evePercentage.label': 'Eva-Wahrscheinlichkeit',
        'component.gameRestart.restart': 'Neustart',
        'component.gameRestart.playAgain': 'Erneut abspielen',
        'component.return.returnToMain': 'Zurück zum Hauptmenü',
        'component.results.seeResults': 'Ergebnisse anzeigen',
        'component.basisTab.alertTitle': 'Nicht genug Bits!',
        'component.basisTab.alertDescription': 'Der von Ihnen erhaltenen' +
            ' Schlüssel hat nicht genug Bits, um zu überprüfen, dass kein' +
            ' Lauscher vorhanden ist. Sie müssen von vorne beginnen.',
        'component.validationTab.title': 'Validierungsschritt',
        'component.validationTab.start': 'Die für die Validierung' +
            ' ausgewählten Bits sind',
        'component.validationTab.arrived': 'Die Bits sind angekommen!',
        'component.validationTab.select': 'Wählen Sie gültig oder ungültig',
        'component.validationTab.areYouSure': 'Sind Sie sicher? Überprüfen' +
            ' Sie die Schlüssel erneut.',
        'component.validationTab.validKey': 'Kommunikationskanal erfolgreich' +
            ' validiert!',
        'component.validationTab.found': 'Sie haben den Lauscher entdeckt!',
        'component.validationTab.waiting': 'Warten auf die anderen Bits...',
        'component.validationTab.validated': 'Validiert!',
        'component.validationTab.bobValid': 'Bob hat festgestellt, dass der' +
            ' Kommunikationskanal gültig ist',
        'component.validationTab.bobInvalid': 'Bob hat festgestellt, dass' +
            ' der Kommunikationskanal ungültig ist',
        'component.validationTab.aliceValid': 'Alice hat festgestellt, dass' +
            ' der Kommunikationskanal gültig ist',
        'component.validationTab.aliceInvalid': 'Alice hat festgestellt,' +
            ' dass der Kommunikationskanal ungültig ist',
        'component.bb84.gameFound': 'Spiel gefunden!',
        'component.bb84.gameFound.desc': 'Es sieht so aus, als hättest du' +
            ' ein Spiel verlassen, während es noch aktiv war. Möchtest du' +
            ' wieder beitreten?',
        'component.bb84.gameFound.action': 'Erneut beitreten',
            'general.close': 'Schließen',
        'component.bb84.play.sorry': 'Entschuldigung, wir konnten keinen' +
            ' Partner für dich finden :(',
        'component.validation.gameRestarted': 'Sie oder Ihr Partner haben' +
            ' das Spiel neu gestartet, nachdem der Lauscher entdeckt wurde.',
        'component.validation.indices': 'Die zufällig ausgewählten' +
            ' Schlüsselindizes für die Validierung lauten: ',
        'component.homePage.protocolsSection.bb84.description': 'Ein' +
            ' Protokoll zum sicheren Austausch kryptografischer Schlüssel' +
            ' zwischen zwei Parteien über einen unsicheren' +
            ' Kommunikationskanal.',
        'component.homePage.protocolsSection.e91.description': 'Das E91-Protokoll nutzt Quantenverschränkung, um die Sicherheit der Kommunikation zu gewährleisten, indem es den Parteien ermöglicht, unknackbare kryptografische Schlüssel auszutauschen.',
        'component.homePage.title.description': 'Lernen und Üben von' +
            ' Quantenkryptographieprotokollen',
        'component.homePage.aboutSection': 'QuantumCrypto ist eine' +
            ' Webplattform für die Ausbildung in Quantenkryptografie. Sie' +
            ' bietet eine wachsende Anzahl interaktiver Erfahrungen, um mit' +
            ' verschiedenen Protokollen zu spielen. QuantumCrypto zielt' +
            ' darauf ab, die Kluft zwischen theoretischen' +
            ' quantenmechanischen Konzepten und praktischem Verständnis zu' +
            ' überbrücken, indem es den Benutzern ermöglicht, sich in' +
            ' Echtzeit-Simulationen von Quantenkryptografieprotokollen zu' +
            ' engagieren. Die Hauptmerkmale unserer Plattform sind',
        'component.homePage.userFriendly': 'Genießen Sie eine intuitive' +
            ' Benutzeroberfläche, die für ein besseres Lernerlebnis' +
            ' entwickelt wurde.',
        'component.homePage.multiplayer': 'Erstellen und betreten Sie' +
            ' Spiele mit Ihren Freunden, um Ihr Wissen über' +
            ' Quantenkryptografie in die Praxis umzusetzen.',
        'component.homePage.extensible': 'Ein modulares Design ermöglicht' +
            ' es Beitragenden, unsere App um neue Funktionen zu erweitern,' +
            ' einschließlich neuer Protokolle.',
        'component.homePage.openSource': 'Unser gesamter Code ist auf' +
            ' GitHub verfügbar. Sie finden die Links unten auf der Seite.',
        'component.bb84.about': 'Das Protokoll wurde 1984 von Charles' +
            ' Bennett von IBM und Gilles Brassard von der Université de' +
            ' Montréal eingeführt. Es beinhaltet zwei getrennte Parteien,' +
            ' Alice und Bob, die sicher über einen öffentlichen Kanal' +
            ' kommunizieren möchten. Das Protokoll beginnt damit, dass' +
            ' Alice eine zufällige Bitfolge erstellt und diese auf einzelne' +
            ' Photonen in einer von zwei zufällig ausgewählten orthogonalen' +
            ' Basen codiert. Sie sendet dann diese Photonen über einen' +
            ' öffentlichen Quantenkanal an Bob. Aufgrund der fundamentalen' +
            ' Prinzipien der Quantenmechanik wird jedoch jeder Versuch' +
            ' eines Lauschers, typischerweise als Eva bezeichnet, diese' +
            ' Photonen abzufangen und zu messen, zwangsläufig ihre Zustände' +
            ' stören und Fehler einführen, die Alice und Bob erkennen' +
            ' können. Wenn Bob die Photonen empfängt, misst er sie mit' +
            ' zufällig gewählten Basen, und sowohl Alice als auch Bob geben' +
            ' öffentlich bekannt, welche Basen sie jeweils zum Codieren' +
            ' oder Messen jedes Photons verwendet haben. Um den Schlüssel' +
            ' zu bilden, behalten Alice und Bob nur die Bits, für die die' +
            ' von ihnen jeweils verwendeten Basen übereinstimmen.' +
            ' Schließlich können Alice und Bob durch den Vergleich eines' +
            ' Teils ihrer Schlüsselbits die Anwesenheit von Eva feststellen' +
            ' und somit die Sicherheit ihres Quantenkommunikationskanals' +
            ' gewährleisten. Wenn sie zum Schluss kommen, dass der' +
            ' Quantenkanal nicht kompromittiert wurde, können sie den' +
            ' generierten Verschlüsselungsschlüssel verwenden, um eine' +
            ' Nachricht sicher über einen klassischen Kommunikationskanal' +
            ' zu senden. Andernfalls müssen sie das Verfahren erneut starten.',
        'component.homePage.userFriendlyTitle': 'Benutzerfreundlich',
        'component.homePage.multiplayerTitle': 'Mehrspieler-Erfahrung',
        'component.homePage.extensibleTitle': 'Hoch erweiterbar',
        'component.bb84.aboutTitle': 'Über das Protokoll',
        'component.header.protocols': 'Protokolle',
        'component.bb84.howToPlayTitle': 'Wie man BB84 spielt',
        'component.bb84.howToPlayDescription': 'Das BB84-Protokoll hat zwei' +
            ' Hauptdarsteller: Alice und Bob, die verschiedene Rollen' +
            ' spielen. Hier kannst du die Reihe von Schritten erkunden, die' +
            ' jeder von ihnen unternehmen muss, um das Protokoll' +
            ' erfolgreich abzuschließen.',
        'component.bb84.steps.step1Alice': ' aus 0en und 1en. Diese Folge wird verwendet, um' +
            ' Ihren Verschlüsselungsschlüssel zu erstellen.',
        'component.bb84.steps.step2Alice': ' aus, um jeden der Bits zu kodieren. Sie können zwischen' +
            ' den Basen + und x wählen.',
        'component.bb84.steps.step3Alice': ' in der' +
            ' Polarisation Ihrer Photonen.',
        'component.bb84.steps.step4Alice': 'mit Bob und warten, bis er sie' +
            ' empfangen und gemessen hat.',
        'component.bb84.steps.step5Alice': ' mit' +
            ' denen' +
            ' von Bob und verwerfen Sie die Bits, bei denen die Basen nicht' +
            ' übereinstimmen.',
        'component.bb84.steps.step6Alice': ',' +
            ' indem Sie überprüfen, ob die zufällig ausgewählten Bits aus' +
            ' Ihrem Rohschlüssel mit denen von Bob übereinstimmen. Wenn sie' +
            ' übereinstimmen, können Sie davon ausgehen, dass die' +
            ' Wahrscheinlichkeit eines Lauschangriffs sehr gering ist und' +
            ' Sie den Schlüssel sicher verwenden können. Andernfalls haben' +
            ' Sie die Anwesenheit eines Lauschers festgestellt und müssen' +
            ' das Protokoll neu starten.',
        'component.bb84.steps.step7Alice': ' an Bob.',
        'component.bb84.highlights.highlight1Alice': 'Erstellen Sie eine' +
            ' zufällige Bitfolge',
        'component.bb84.highlights.highlight2Alice': 'Wählen Sie zufällig' +
            ' einen Satz von Basen',
        'component.bb84.highlights.highlight3Alice': 'Kodieren Sie Ihre Bits',
        'component.bb84.highlights.highlight4Alice': 'Teilen Sie Ihre' +
            ' Photonen',
        'component.bb84.highlights.highlight5Alice': 'Vergleichen Sie Ihre' +
            ' Basen',
        'component.bb84.highlights.highlight6Alice': 'Validieren Sie Ihren' +
            ' Schlüssel',
        'component.bb84.highlights.highlight7Alice': 'Verschlüsseln und' +
            ' senden Sie Ihre Nachricht',
        'component.bb84.steps.step1Bob': ', um jedes der Photonen von Alice' +
            ' zu messen. Sie können zwischen den Basen + und x wählen.',
        'component.bb84.steps.step2Bob': ' und' +
            ' notieren Sie Ihre Ergebnisse.',
        'component.bb84.steps.step3Bob': ' mit Alice.',
        'component.bb84.steps.step4Bob': ' und verwerfen Sie die Bits, bei' +
            ' denen die Basen nicht übereinstimmen.',
        'component.bb84.steps.step5Bob': ', indem Sie überprüfen, ob die' +
            ' zufällig ausgewählten Bits aus' +
            ' Ihrem Rohschlüssel mit denen von Bob übereinstimmen. Wenn sie' +
            ' übereinstimmen, können Sie davon ausgehen, dass die' +
            ' Wahrscheinlichkeit eines Lauschangriffs sehr gering ist, und' +
            ' Sie können den Schlüssel sicher verwenden. Andernfalls haben' +
            ' Sie die Anwesenheit eines Lauschers festgestellt und müssen' +
            ' das Protokoll neu starten.',
        'component.bb84.steps.step6Bob': ' mit Ihrem Schlüssel.',
        'component.bb84.highlights.highlight1Bob': 'Wählen Sie zufällig' +
            ' einen Satz von Basen aus',
        'component.bb84.highlights.highlight2Bob': 'Messen Sie die Photonen',
        'component.bb84.highlights.highlight3Bob': 'Teilen Sie Ihre Basen',
        'component.bb84.highlights.highlight4Bob': 'Vergleichen Sie Ihre' +
            ' Basen mit denen von Alice',
        'component.bb84.highlights.highlight5Bob': 'Validieren Sie Ihren' +
            ' Schlüssel',
        'component.bb84.highlights.highlight6Bob': 'Entschlüsseln Sie die' +
            ' Nachricht von Alice',
        'component.bb84.additionalStep': 'In QuantumCrypto haben nicht alle' +
            ' BB84-Spiele einen Lauscher. Dieser nächste Schritt gilt nur,' +
            ' wenn einer in Ihrem Spiel vorhanden ist. Das erfährst du am' +
            ' Ende!',
        'component.bb84.rawKeyInfo': 'An diesem Punkt besitzen Sie den' +
            ' "rohen Schlüssel", der verwendet wird, um die Anwesenheit' +
            ' eines Lauschers zu erkennen.',
        'component.header.about.e91': 'Über E91',
        'component.e91.about': 'Das Protokoll wurde 1991 von' +
            ' Artur Ekert eingeführt. Es beinhaltet zwei separate Parteien,' +
            ' Alice und Bob, die sicher über einen öffentlichen Kanal kommunizieren möchten.' +
            ' Das Protokoll nutzt Quantenverschränkung zur Sicherstellung der Sicherheit.' +
            ' Alice und Bob messen verschränkte Teilchenpaare und vergleichen ihre Ergebnisse,' +
            ' um einen geheimen kryptografischen Schlüssel zu erstellen. Jeder Versuch eines' +
            ' Abhörers, normalerweise Eve genannt, diese Messungen zu stören, wird' +
            ' Unregelmäßigkeiten einführen, die Alice und Bob entdecken können.' +
            ' Wenn kein Abhörer erkannt wird, können sie den Schlüssel verwenden,' +
            ' um ihre Kommunikation über einen klassischen Kanal zu verschlüsseln.' +
            ' Andernfalls müssen sie den Prozess erneut starten.',
        'component.e91.howToPlayTitle': 'Wie man E91 spielt',
        'component.e91.howToPlayDescription': 'Das E91-Protokoll hat zwei' +
            ' Hauptdarsteller: Alice und Bob, die verschiedene Rollen' +
            ' spielen. Hier kannst du die Reihe von Schritten erkunden, die' +
            ' jeder von ihnen unternehmen muss, um das Protokoll' +
            ' erfolgreich abzuschließen.',
        'component.bb84.playSolo': 'Alleine spielen',
        'component.bb84.startSolo': 'Einzelspiel starten',
        'component.bb84.soloRoleSelect': 'Wähle deine Rolle',
    },
];
