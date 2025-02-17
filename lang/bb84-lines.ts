// Order derived from Language enum defined in the LanguageProvider
// 0: English
// 1: French
// 2: Spanish
// 3: German

import {LanguageItem} from '@/types';

export const bb84Lines: LanguageItem[] = [
    {
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
        'component.game.tabValidation': 'Validation',
        'component.validationTab.yourKey': 'Your bits',
        'component.validationTab.bobsKey': 'Bob\'s bits',
        'component.validationTab.alicesKey': 'Alice\'s bits',
        'component.validationTab.valid': 'Valid',
        'component.validationTab.invalid': 'Invalid',
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
        'component.validation.gameRestarted': 'You or your partner' +
            ' restarted the game after discovering the eavesdropper.',
        'component.validation.indices': 'The random key indices selected' +
            ' for validation are: ',
    },
    {
        // ... (French translations)
        
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
        'component.game.tabValidation': 'Validation',
        'component.validationTab.yourKey': 'Vos bits',
        'component.validationTab.bobsKey': 'Les bits de Bob',
        'component.validationTab.alicesKey': 'La clé d\'Alice',
        'component.validationTab.valid': 'Valide',
        'component.validationTab.invalid': 'Invalide',
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
        'component.validation.gameRestarted': 'Vous ou votre partenaire' +
            ' avez redémarré le jeu après avoir découvert l\'espion.',
        'component.validation.indices': 'Les bits de la clé sélectionnés' +
            ' de façon aléatoire pour la validation sont: ',
        
    },
    {
        // ... (Spanish translations)

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
        'component.game.tabValidation': 'Validación',
        'component.validationTab.yourKey': 'Tus bits',
        'component.validationTab.bobsKey': 'Bits de Bob',
        'component.validationTab.alicesKey': 'Bits de Alice',
        'component.validationTab.valid': 'Válida',
        'component.validationTab.invalid': 'Inválida',
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
        'component.validation.gameRestarted': 'Tú o tu pareja reiniciaron' +
            ' el juego tras descubrir al espía.',
        'component.validation.indices': 'Los índices de la clave' +
            ' seleccionados aleatoriamente para la validación son: ',
    },
   
];

