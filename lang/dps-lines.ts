// Order derived from Language enum defined in the LanguageProvider
// 0: English
// 1: French
// 2: Spanish

import {LanguageItem} from '@/types';

export const dpsLines: LanguageItem[] = [       
    {
        'component.game.playerHeader': 'You are playing as',

        'component.dps.exchange.welcome': 'Welcome to DPS!',
        'component.dps.pulseTrain': 'Pulses train',
        'component.dps.phase' : 'Phase',
        'component.dps.phaseDesc' : '(0 ou π)',
        'component.dps.modulatedPulseTrain' : 'Modulated Pulse Train',
        'component.dps.aliceExchange.send': 'Send to Bob!',
        'component.dps.aliceExchange.sent': 'Your photons are sent! Waiting for' +
            ' Bob\'s photon reception times...',        
        
        'component.game.tabs1': 'Exchange quantum information',
        'component.game.tabs2': 'Inference',
        'component.game.tabs3': 'Encrypted messaging',
        'component.game.step1': 'Step 1: ',
        'component.game.step2': 'Step 2: ',
        'component.game.step3': 'Step 3: ',
        'component.game.step4': 'Step 4: ',
        'component.aliceGame.random': 'Random',
        'component.game.gameProgressionTitle': 'Game Progression',
        'component.aliceExchange.start': 'Pick random phases and' +
            ' determine the pulses\' polarization.',
        'component.bobGame.photons': 'Photons',
        'component.bobExchange.waiting': 'Waiting for Alice\'s photons...',
        'component.bobExchange.arrivalTime': 'arrival time',
        'component.bobExchange.arrivalTimeDesc' : 'From t0 to t3',
        'component.bobExchange.measure': 'Mesurer Arrival time',
        'component.bobExchange.Measurement' : 'Measure the arrival times of Alice\'s photons.' +
            ' Then delete times t0 and t3 by clicking on them and confirm',
        'component.bobExchange.photonsArrived': 'Alice\'s photons just' +
            ' arrived!',
        'component.dps.validateBtn': 'Validate',
        'component.bobExchange.shareWithAlice': 'Perfect ! ' +
            'Share the arrival times with Alice to continue.',
        'component.bobExchange.sendArrivalTimes' : 'Send to Alice!',
        'component.bobExchange.timesSent': 'The arrival times have been successfully transmitted.',
        'component.bobExchange.sentTimes': 'Arrival times are sent to Alice.',
        'component.basis.verify': 'Verify arrival times',
        'component.basis.correct': 'Correct!',


        'component.bobMessaging.encryptedMessage' : 'Your encrypted message (0 or 1)',
        'component.bobMessaging.message' : 'Your message',
        'component.bobMessaging.detector' : 'Detector (your key)',
        'component.bobMessaging.arrivalTime' : 'Arrival time',
        'component.bobMessaging.phase' : 'phase',
        'component.bobExchange.secretKey': 'Your secret key is obtained from the clicks of the two detectors,' +
            'by tracking the photon arrival times.' +
            'DET1 generates a "0" bit and DET2 a "1" bit, depending on the measured phase difference.',

        'component.messaging.bob.last': 'Enter a message and' +
            ' encrypt it using your secret key. Then send' +
            ' the message to Alice!', 
        'component.messaging.cipherError': 'Verify your message and' +
            ' encrypted bits',
        'component.messaging.validateAndSend': 'Validate and send',    
        'component.messaging.cipherSent': 'Sent!',
        'component.messaging.congratulations': 'Congratulations ',
        'component.messaging.bob.sent': 'Your message has been sent! Now,' +
            ' let\'s wait for Alice\'s decryption...',
        'component.messaging.alice.arrived': 'Bob\'s encrypted message is' +
            ' here!',
        'component.messaging.alice.decrypt': 'After inference, use the the obtained secret key to decrypt' +
            ' the message.',
        'component.messaging.alice.end': 'You decrypted Bob\'s message!',
        'component.messaging.bob.end': 'Alice was able to decrypt your' +
            ' message!',
        'component.messaging.alice.reveal': 'Your Bob was ',
        'component.messaging.bob.reveal': 'Your Alice was ',

        'component.aliceInference.timesArrived': 'The photon arrival times at Bob\'s are here!!',
        'component.aliceInference.arrivalTime': 'Arrival times',
        'component.aliceInference.correspondence': 'Correspondance',
        'component.aliceInference.phaseDifference': 'Phase difference',
        'component.aliceInference.success': 'Inference correct !',
        'component.aliceInference.error': 'Inference incorrect!',
        'component.aliceInference.inferPhaseDifference': 'Click the "Phase difference" buttons to infer the phase difference based on the phases used and arrival times,\n' + 
            ' or based on the correspondence of the Pulse Trains to the arrival times.\n' + 
            ' Your inferences form the secret key: 0 → 0, π → 1. It will be used to decipher Bob\'s message.\n' +
            ' Once finished, confirm your choice.', 

        
        'component.messaging.alice.start': 'Great job! Now let\'s wait for Bob\'s encrypted message...',
        'component.messaging.yourKey': 'Your key',
        'component.messaging.bobEncrypted': 'Bob encrypted message',
        'component.messaging.bobDecrypt': 'Bob\'s decrypted message (0' +
            ' or 1)',
        'component.messaging.decryptError': 'Verify your decryption bits',
        'component.results.seeResults': 'See Results',

        


            
            

    },
    {
        // ... (French translations)
        'component.game.playerHeader': 'Vous jouez en tant que',

        'component.dps.exchange.welcome': 'Bienvenue dans DPS!',
        'component.dps.pulseTrain': 'Train d\'impulsions',
        'component.dps.phase' : 'Phase',
        'component.dps.phaseDesc' : '(0 ou π)',
        'component.dps.modulatedPulseTrain' : 'Train d\'impulsions modulé',
        'component.dps.aliceExchange.send': 'Envoyer à Bob !',
        'component.dps.aliceExchange.sent': 'Vos photons sont envoyés ! En' +
            ' attente des temps de reception des photons chez Bob...',
        'component.game.tabs1': 'Échange d\'information quantique',
        'component.game.tabs2': 'Inférence',
        'component.game.tabs3': 'Messagerie chiffrée',
        'component.game.step1': 'Étape 1: ',
        'component.game.step2': 'Étape 2: ',
        'component.game.step3': 'Étape 3: ',
        'component.game.step4': 'Étape 4: ',
        'component.aliceGame.random': 'Aléatoire',
        'component.game.gameProgressionTitle': 'Déroulement du jeu',
        'component.aliceExchange.start': 'Choisissez les phases' +
            ' aléatoires et déterminez la polarisation des pulses.',
        'component.bobGame.photons': 'Photons',
        'component.bobExchange.waiting': 'En attente des photons d\'Alice...',
        'component.bobExchange.arrivalTime': 'temps d\'arrivé',
        'component.bobExchange.arrivalTimeDesc' : 'de t0 à t3',
        'component.bobExchange.measure': 'Mesurez les Temps d\'arrivée',
        'component.bobExchange.Measurement' : 'Mesurez les temps d\'arrivée des photons d\'Alice.' +
            ' Ensuite supprimez les temps t0 et t3 en cliquant dessus et validez',
        'component.bobExchange.photonsArrived': 'Les photons d\'Alice' +
            ' viennent d\'arriver !',
        'component.dps.validateBtn': 'Valider',
        'component.bobExchange.shareWithAlice': 'parfait ! ' +
            ' Partagez les temps d\'arrivées avec Alice pour continuer.',
        'component.bobExchange.sendArrivalTimes' : 'Envoyer à Alice !',
        'component.bobExchange.sentTimes': 'Les temps d\'arrivées sont envoyés à Alice.',
        'component.bobExchange.timesSent': 'Les temps d\'arrivées ont été transmis avec succès.',
        'component.basis.verify': 'Vérifiez les temps d\'arrivées',
        'component.basis.correct': 'Correct !',

        'component.bobMessaging.encryptedMessage' : 'Votre message chiffré (0 ou 1)',
        'component.bobMessaging.message' : 'Votre message',
        'component.bobMessaging.detector' : 'Detecteur (votre clé)',
        'component.bobMessaging.arrivalTime' : 'temps d\'arrivées',
        'component.bobMessaging.phase' : 'phase',
        'component.bobExchange.secretKey': ' Votre clé secrète est obtenue à partir des clics des 02 détecteurs,' +
            ' en suivant les temps d’arrivée des photons.' +
            ' DET1 génère un bit "0" et DET2 un bit "1", selon la différence de phase mesurée.',
        
        'component.messaging.bob.last': 'Saisissez un message et' +
            ' chiffrez-le en utilisant votre clé secrète. Ensuite, envoyez' +
            ' le message à Alice !', 
        'component.messaging.cipherError': 'Vérifiez votre message et vos' +
            ' bits chiffrés',
        'component.messaging.validateAndSend': 'Valider et envoyer',
        'component.messaging.cipherSent': 'Envoyé !',
        'component.messaging.congratulations': 'Félicitations ',
        'component.messaging.bob.sent': 'Votre message a été envoyé !' +
            ' Maintenant, attendons le déchiffrement de Alice...',
        'component.messaging.alice.arrived': 'Le message chiffré de Bob est' +
            ' arrivé !',
        'component.messaging.alice.decrypt': 'Après l\'inférence, utilisez la clé secrète obtenu pour' +
            ' déchiffrer le message.',
        'component.messaging.alice.end': 'Vous avez déchiffré le message' +
            ' de Bob !',
        'component.messaging.bob.end': 'Alice a réussi à déchiffrer votre' +
            ' message !',
        'component.messaging.alice.reveal': 'Votre Bob était ',
        'component.messaging.bob.reveal': 'Votre Alice était ',

        'component.aliceInference.timesArrived': 'Les temps d\'arrivées des photons chez Bob sont là!!',
        'component.aliceInference.arrivalTime': 'Temps d\'arrivés',
        'component.aliceInference.correspondence': 'Correspondance',
        'component.aliceInference.phaseDifference': 'Difference de phase',
        'component.aliceInference.success': 'Inférence correcte !',
        'component.aliceInference.error': 'Inférence incorrecte !',
        'component.aliceInference.inferPhaseDifference': 'Cliquez sur les boutons "Difference de phase" pour inférer la différence de phase' + 
            ' en fonction des phases utilisées et des temps d’arrivés,\n'+
            ' ou selon la correspondance des Pulse Trains par rapport aux temps d’arrivés.\n' +
            ' Vos inférences forment la clé secrète : 0 → 0, π → 1. Elle servira à déchiffrer le message de Bob. \n' +
            ' Une fois terminé, validez votre choix.',
        
        'component.messaging.alice.start': 'Super travail ! Maintenant, attendons le message chiffré de Bob...',
        'component.messaging.yourKey': 'Votre clé',
        'component.messaging.bobEncrypted': 'Message chiffré de Bob',
        'component.messaging.bobDecrypt': 'Message de Bob déchiffré (0 ou 1)',
        'component.messaging.decryptError': 'Vérifiez vos bits de' +
            ' déchiffrement',
        'component.results.seeResults': 'voir les résultats',
        
     
        
    },
    {
        // ... (Spanish translations)
        'component.game.playerHeader': 'Estás jugando como',
        'component.dps.pulseTrain': 'Tren de pulsos',
        'component.dps.phase' : 'Fase',
        'component.dps.phaseDesc' : '(0 o π)',
        'component.dps.modulatedPulseTrain' : 'Tren de pulsos modulado',
        'component.game.tabs1': 'Intercambio de información cuántica',
        'component.game.tabs2': 'Inferencia',
        'component.game.tabs3': 'Mensajería cifrada',
        'component.game.step1': 'Paso 1: ',
        'component.game.step2': 'Paso 2: ',
        'component.game.step3': 'Paso 3: ',
        'component.game.step4': 'Paso 4: ',
        'component.aliceGame.random': 'Aleatorio',
        'component.game.gameProgressionTitle': 'Progresión del juego',
        'component.aliceExchange.start': 'Elegir fases' + 
            'aleatorio y determina la polarización de los pulsos.',
        'component.dps.aliceExchange.sent': '¡Tus fotones han sido enviados! En' +
            'esperando los tiempos de recepción de fotones en casa de Bob...',
        'component.bobGame.photons': 'Fotones',
        'component.bobExchange.waiting': 'Esperando los fotones de Alice...',
        'component.bobExchange.arrivalTime': 'Hora de llegada',
        'component.bobExchange.arrivalTimeDesc' : 'De t0 a t3',
        'component.bobExchange.measure' : 'Medir Hora de llegada',
        'component.bobExchange.Measurement' : 'Mide los tiempos de llegada de los fotones de Alicia.' +
            ' A continuación borre los tiempos t0 y t3 haciendo clic sobre ellos y confirme',
        'component.bobExchange.photonsArrived': '¡Los fotones de Alice' +
            ' acaban de llegar!',
        'component.dps.validateBtn': 'Validar',
        'component.bobExchange.shareWithAlice': 'Perfecto !' +
            ' Comparte los horarios de llegada con Alice para continuar.',
        'component.bobExchange.sendArrivalTimes' : '¡Envíale a Alice!',
        'component.dps.aliceExchange.send': '¡Envíale a Bob!',
        'component.bobExchange.timesSent': 'Los tiempos de llegada han sido transmitidos con éxito.',
        'component.bobExchange.sentTimes': 'Los tiempos de llegada se envían a Alice.',
        'component.basis.verify': 'Verifica horarios de llegada',
        'component.basis.correct': '¡Correcto!',

        'component.bobMessaging.encryptedMessage' : 'Tu mensaje cifrado (0 o 1)',
        'component.bobMessaging.message' : 'Tu mensaje',
        'component.bobMessaging.detector' : 'Detector (Tu clave)',
        'component.bobMessaging.arrivalTime' : 'Hora de llegada',
        'component.bobMessaging.phase' : 'face',
        'component.bobExchange.secretKey': 'Su clave secreta se obtiene de los clics de los detectores O2' +
            'mediante el seguimiento de los tiempos de llegada de los fotones.' +
            'DET1 genera un bit "0" y DET2 un bit "1", dependiendo de la diferencia de fase medida.',


        'component.messaging.bob.last': 'Ingresa un mensaje y' +
            ' encriptelo usando su clave secreta. Luego envía' +
            '¡El mensaje para Alicia!',    
        'component.messaging.cipherError': 'Verifica tu mensaje y tus bits' +
            ' cifrados',
        'component.messaging.validateAndSend': 'Validar y enviar',
        'component.messaging.cipherSent': '¡Enviado!',
        'component.messaging.congratulations': 'Felicidades ',
        'component.messaging.bob.sent': '¡Tu mensaje ha sido enviado!' +
            ' Ahora, esperemos el descifrado de Alice...',
        'component.messaging.alice.arrived': '¡El mensaje cifrado de Bob' +
            ' está aquí!',
        'component.messaging.alice.decrypt': 'Después de la inferencia, usa la clave secreta obtenida para' +
            ' descifrar el mensaje.',
        'component.messaging.alice.end': '¡Has descifrado el mensaje de Bob!',
        'component.messaging.bob.end': '¡Alice pudo descifrar tu mensaje!',
        'component.messaging.alice.reveal': 'Tu Bob era ',
        'component.messaging.bob.reveal': 'Tu Alice era ',
        
        'component.aliceInference.timesArrived': '¡¡Los tiempos de llegada de los fotones a Bob ya están aquí!!',
        'component.aliceInference.arrivalTime': 'Horas de llegada',
        'component.aliceInference.correspondence': 'Correspondancia',
        'component.aliceInference.phaseDifference': 'Diferencia de fase',
        'component.aliceInference.success': '¡Inferencia correcta!',
        'component.aliceInference.error': '¡Inferencia incorrecta!',
        'component.aliceInference.inferPhaseDifference': 'Haga clic en los botones "Diferencia de fase" para inferir la diferencia de fase' +
            ' dependiendo de las fases utilizadas y los tiempos de llegada,\n'+
            ' o según la correspondencia de Pulse Trains con respecto a los horarios de llegada.\n' +
            ' Tus inferencias forman la clave secreta: 0 → 0, π → 1. Se utilizará para descifrar el mensaje de Bob. \n' +
            'Una vez terminado, confirma tu elección.',

        'component.messaging.alice.start': '¡Buen trabajo! Ahora, esperemos el mensaje cifrado de Bob...',
        'component.messaging.yourKey': 'Tu clave',
        'component.messaging.bobEncrypted': 'Mensaje cifrado de Bob',
        'component.messaging.bobDecrypt': 'Mensaje descifrado de Bob (0 o 1)',
        'component.messaging.decryptError': 'Verifica tus bits de descifrado',
        'component.results.seeResults': 'Ver resultados',






       
        
        






        




        


    }
];