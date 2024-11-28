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
        'component.homePage.protocolsSection.e91.description': 'The E91 protocol uses quantum entanglement to ensure communication security by allowing parties to exchange unbreakable cryptographic keys.',
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
        'component.bb84.about': 'The protocol was introduced in 1984 by' +
            ' Charles Bennett from IBM and Gilles Brassard from the' +
            ' Université de Montréal. It involves two separate parties,' +
            ' Alice and Bob, who wish to communicate securely through a' +
            ' public channel. The protocol begins with Alice creating a' +
            ' random sequence of bits and encoding them onto individual' +
            ' photons in one of two mutually orthogonal bases selected' +
            ' at random. She then sends these' +
            ' photons to Bob over a public quantum channel. However, due to the' +
            ' fundamental principles of quantum mechanics, any attempt by' +
            ' an eavesdropper, typically referred to as Eve, to intercept' +
            ' and measure these photons will inevitably disturb their' +
            ' states, thus introducing errors that Alice and Bob can' +
            ' detect. When Bob receives the photons, he measures them' +
            ' using randomly chosen bases, and both Alice and Bob publicly' +
            ' announce which bases they used to encode or measure each photon.' +
            ' To form the key, Alice and Bob only keep the bits for which' +
            ' the bases they respectively used match. Finally, by comparing a subset' +
            ' of their key bits, Alice and Bob can detect the presence of' +
            ' Eve and therefore ensure the security of their quantum communication' +
            ' channel. If they conclude that the quantum channel was not compromized,' +
            ' they can use the generated encryption key to send a message' +
            ' securely over a classical communication channel.' +
            ' Otherwise, they must start the procedure again.',
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
        'component.bb84.rawKeyInfo': 'At this point, you posses the "raw' +
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
        'component.header.about.e91': 'About E91',
        'component.e91.about': 'The protocol was introduced in 1991 by' +
            ' Artur Ekert. It involves two separate parties,' +
            ' Alice and Bob, who wish to communicate securely through a' +
            ' public channel. The protocol uses quantum entanglement to ensure' +
            ' security. Alice and Bob measure entangled particle pairs and' +
            ' compare their results to establish a secret cryptographic key.' +
            ' Any attempt by an eavesdropper, typically referred to as Eve,' +
            ' will disturb these measurements, allowing Alice and Bob to detect' +
            ' the presence of a threat. If no eavesdropper is detected, they can use the key' +
            ' to encrypt their communication over a classical channel.' +
            ' Otherwise, they must start the process again.',
        'component.e91.howToPlayTitle': 'How to play E91',
        'component.e91.howToPlayDescription': 'The E91 protocol has two' +
            ' main actors: Alice and Bob, who play different roles. Here' +
            ' you can explore the set of steps that each one of them must' +
            ' take in order to complete the protocol successfully.',
        'component.e91.measurement.welcome': 'Welcome to E91!',
        'component.e91.measurement.start': 'Choose a basis of measurement for each photon',
        'component.e91.measurement.tab': 'Photon measurements',
        'component.e91.photons': 'Photons',
        'component.e91.measure': 'Measure',
        'component.e91.measurement.aliceMeasured': 'Alice has measured the photons.',
        'component.e91.measurement.bobMeasured': 'Bob has measured the photons.',
        'component.e91.shareBases': 'Share my bases',
        'component.e91.compareBases': 'Validate bases',
        'component.e91.useValidBits': 'Use valid bits',
        'component.e91.useDiscardedBits': 'Use invalid bits',
        'component.e91.diceRoll': 'Roll the dice',
        'component.e91.dicePurpose': 'You may now roll the dice',
        'component.e91.diceWin': 'Win: ',
        'component.e91.diceLoss': 'Loss: ',
        'component.e91.diceRolled': 'You rolled',
        'component.e91.diceWinner.self': 'You won the dice roll',
        'component.e91.diceLooser.self': 'You lost the dice roll',
        'component.e91.removeIncompatibleBases': 'Remove incompatible bases',
        'component.e91.submit': 'Submit',
        'component.e91.invalidInputRange': 'Number not in valid range',
        'component.e91.shareBases.alice': 'Now share your bases with Bob',
        'component.e91.shareBases.bob': 'Now share your bases with Alice',
        'component.e91.classifyBases': 'Categorize each photon\'s measurement bases with the correct type',
        'component.e91.validate': 'Find the bases that do not match by clicking validate button',
        'component.e91.shortKey.restart': 'Your key length is too short, you may restart the game now',
        'component.e91.validOrInvalid': 'You may now decide to proceed using the valid bits or the throwaway bits to secure the key, beware that using valid bits will shorten your final key',
        'component.e91.reroll': 'Tie! you may reroll the dice now',
        'component.e91.notice': 'Notice: ',
        'component.e91.choose.valid': 'You may now decide how many bits you want to use to secure the key',
        'component.e91.awating.bob.bitPreference': 'Waiting for Bob to confirm the number of bits used to secure the key',
        'component.e91.awating.alice.bitPreference': 'Waiting for Alice to confirm the number of bits used to secure the key',
        'component.e91.validation.start': 'Verify if the bits match',
        'component.e91.messaging.bob.start': 'Wait for Alice to send in her encrypted message',
        'component.e91.messaging.alice.start': 'Encrypt and send your message to Bob',
        'component.e91.restart': 'Restart',
        'component.e91.moveToMessaging': 'Move to messaging tab',
        'component.e91.evePresent': 'Eve has interferred!',
        'component.e91.evePresent.stats': ' Eve has successfully read this many bits: ',
        'component.e91.decsion.unsecured': 'Channel has been declared compromised by ',
        'component.e91.decsion.secured': 'Channel has been declared secure by ',
        'component.e91.restart.unsecured': 'Channel compromised',
        'component.e91.restart.unsecured.description': ' Eve has been found out',
        'component.e91.gameLoss.title': 'You lose!',
        'component.e91.gameLoss': ' Eve did not interfere on this channel',
        'component.e91.steps.step1': ' for all photons, the resulting measurements of 0s and 1s will' +
            ' be' +
            ' used to build your encryption key.',
        'component.e91.steps.step2Alice': ' with Bob, these will be used later on.',
        'component.e91.steps.step2Bob': ' with Alice, these will be used later on.',
        'component.e91.steps.step3Alice': ' using bob\'s bases according to the E91 protocol',
        'component.e91.steps.step3Bob': ' using alice\'s bases according to the E91 protocol',
        'component.e91.steps.step4': ' using valid bits of the key or previously discarded bits',
        'component.e91.steps.step5': ' using the mehod previously chosen. Using valid bits the key can be secured by comparing bit values that should be the same. Using discarded bits the key can be secured using CHSH\'s theorem',
        'component.e91.steps.step6Alice': ' to Bob.',
        'component.e91.highlights.highlight1': 'Pick a measurement base',
        'component.e91.highlights.highlight2': 'Share your bases',
        'component.e91.highlights.highlight3': 'Clean up your key',
        'component.e91.highlights.highlight4': 'Secure the key',
        'component.e91.highlights.highlight5': 'Validate your key',
        'component.e91.highlights.highlight6Alice': 'Encrypt and send your' +
            ' message',
        'component.e91.additionalStep': 'In QuantumCrypto, not all E91' +
            ' games have an eavesdropper. The next 2 steps only apply if' +
            ' there is one in your game. You\'ll find out at the end!',
        'component.e91.highlights.highlight6Bob': 'Decrypt Alice\'s message',
        'component.e91.steps.step6Bob': ' using' +
        ' your key.',
        'component.e91.validation.invalid.start': 'Drag the correct value (+1 or -1) to the corresponding box for each photon\'s measurements',
        'component.e91.basisDesc': ' (a, b, a\', b\')',
        'component.e91.button.secure': 'Secure',
        'component.e91.button.unsecure': 'Not secure',
        'component.e91.button.showGraph': 'Show graph',
        'component.e91.text.values': 'Values',
        'component.e91.graph.values': 'S Values',
        'component.e91.graph.title': 'CHSH Graph',
        'component.e91.text.seeResults': 'See Results',
        'component.quantumCrypto.gamesPlayed': 'Total games played: ',
        'component.e91.createGame.keyMin': 'The minimum number of photons is 20 if Eve is present and 10 otherwise',
        


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
        'component.messaging.aliceDecrypt': 'Message déchiffré d\'Alice (0' +
            ' ou 1)',
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
        'component.bb84.about': 'Le protocole a été proposé en 1984' +
            ' par Charles Bennett d\'IBM et Gilles Brassard de' +
            ' l\'Université de Montréal. Il implique deux parties' +
            ' distinctes, Alice et Bob, qui souhaitent établir une clé' +
            ' de chiffrement afin de communiquer de' +
            ' manière sécurisée via un canal public. Le protocole commence' +
            ' avec Alice qui crée une séquence aléatoire de bits' +
            ' et qui encode chacun des bits sur un photon individuel dans' +
            ' l\'une des deux bases mutuellement orthogonales, choisie' +
            ' au hasard. Elle envoie ensuite ces' +
            ' photons à Bob via un canal quantique public. Cependant, en' +
            ' raison des principes fondamentaux de la mécanique quantique, toute' +
            ' tentative par un espion, généralement appelé Ève,' +
            ' d\'intercepter et de mesurer ces photons perturbera' +
            ' inévitablement leur état, introduisant ainsi des erreurs' +
            ' qu\'Alice et Bob peuvent détecter. Lorsque Bob reçoit les' +
            ' photons, il les mesure en utilisant des bases choisies au' +
            ' hasard. Ensuite, Alice et Bob annoncent publiquement les bases' +
            ' qu\'ils ont utilisées pour encoder et mesurer chaque photon.' +
            ' Une clé est formée en conservant seulement les bits pour lesquels' +
            ' les bases utilisées par Alice et Bob correspondent. Enfin, en' +
            ' comparant un sous-ensemble des bits de leur clé, Alice et Bob' +
            ' peuvent détecter la présence d\'Ève et s\'assurent ainsi de la' +
            ' sécurité de leur canal de communication quantique. S\'ils' +
            ' concluent que le canal quantique n\'a pas été compromis,' +
            ' ils peuvent utiliser la clé de chiffrement générée pour envoyer' +
            ' un message en toute sécurité. Sinon, ils doivent recommencer' +
            ' la procédure.',
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
        'component.header.about.e91': 'À propos de E91',
        'component.e91.about': 'Le protocole a été introduit en 1991 par' +
            ' Artur Ekert. Il implique deux parties distinctes,' +
            ' Alice et Bob, qui souhaitent communiquer de manière sécurisée via un' +
            ' canal public. Le protocole utilise l\'intrication quantique pour garantir' +
            ' la sécurité. Alice et Bob mesurent des paires de particules intriquées' +
            ' et comparent leurs résultats pour établir une clé cryptographique secrète.' +
            ' Toute tentative d\'interception par un espion, généralement appelé Eve,' +
            ' perturbera ces mesures, permettant ainsi à Alice et Bob de détecter la présence' +
            ' d\'une menace. Si aucun espion n\'est détecté, ils peuvent utiliser la clé' +
            ' générée pour chiffrer leurs communications sur un canal classique.' +
            ' Sinon, ils doivent recommencer le processus.',
        'component.e91.howToPlayTitle': 'Comment jouer à E91',
        'component.e91.howToPlayDescription': 'Le protocole E91 implique' +
            ' deux acteurs principaux : Alice et Bob, qui jouent des rôles' +
            ' différents. Vous pouvez ici explorer l\'ensemble des étapes' +
            ' que chacun d\'eux doit suivre pour mener à bien le protocole.',
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
        'component.messaging.aliceDecrypt': 'Mensaje descifrado de Alice (0' +
            ' o 1)',
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
        'component.bb84.about': 'El protocolo fue propuesto en 1984 por' +
            ' Charles Bennett de IBM y Gilles Brassard de la Université de' +
            ' Montréal. Involucra a dos partes separadas, Alice y Bob, que' +
            ' desean comunicarse de manera segura a través de un canal' +
            ' público. El protocolo comienza con Alice creando una' +
            ' secuencia aleatoria de bits y codificándolos en fotones' +
            ' individuales en una de las dos bases ortogonales mutuamente' +
            ' seleccionadas al azar. Luego, envía estos fotones a Bob a' +
            ' través de un canal cuántico público. Sin embargo, debido a' +
            ' los principios fundamentales de la mecánica cuántica,' +
            ' cualquier intento de un espía, típicamente referido como Eva,' +
            ' de interceptar y medir estos fotones inevitablemente' +
            ' perturbará sus estados, introduciendo errores que Alice y Bob' +
            ' pueden detectar. Cuando Bob recibe los fotones, los mide' +
            ' utilizando bases elegidas al azar, y tanto Alice como Bob' +
            ' anuncian públicamente qué bases usaron para codificar o medir' +
            ' cada fotón. Para formar la clave, Alice y Bob solo conservan' +
            ' los bits para los cuales las bases que respectivamente usaron' +
            ' coinciden. Finalmente, al comparar un subconjunto de sus bits' +
            ' clave, Alice y Bob pueden detectar la presencia de Eva y, por' +
            ' lo tanto, asegurar la seguridad de su canal de comunicación' +
            ' cuántica. Si concluyen que el canal cuántico no fue' +
            ' comprometido, pueden usar la clave de cifrado generada para' +
            ' enviar un mensaje de manera segura a través de un canal de' +
            ' comunicación clásico. De lo contrario, deben reiniciar el' +
            ' procedimiento.',
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
        'component.header.about.e91': 'Acerca de E91',
        'component.e91.about': 'El protocolo fue introducido en 1991 por' +
            ' Artur Ekert. Involucra a dos partes separadas,' +
            ' Alice y Bob, que desean comunicarse de manera segura a través de un' +
            ' canal público. El protocolo utiliza el entrelazamiento cuántico para garantizar' +
            ' la seguridad. Alice y Bob miden pares de partículas entrelazadas' +
            ' y comparan sus resultados para establecer una clave criptográfica secreta.' +
            ' Cualquier intento de un espía, generalmente llamado Eve,' +
            ' de interceptar estas medidas perturbará las partículas, lo que permite' +
            ' a Alice y Bob detectar la presencia de una amenaza. Si no se detecta un espía,' +
            ' pueden usar la clave generada para cifrar su comunicación en un canal clásico.' +
            ' De lo contrario, deben comenzar el proceso de nuevo.',
        'component.e91.howToPlayTitle': 'Cómo jugar E91',
        'component.e91.howToPlayDescription': 'El protocolo E91 tiene dos' +
            ' actores principales: Alice y Bob, que desempeñan roles' +
            ' diferentes. Aquí puedes explorar el conjunto de pasos que' +
            ' cada uno de ellos debe seguir para completar el protocolo con' +
            ' éxito.',
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
            ' Nachricht (0 oder 1)',
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
    },
];

