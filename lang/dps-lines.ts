// Order derived from Language enum defined in the LanguageProvider
// 0: English
// 1: French
// 2: Spanish

import {LanguageItem} from '@/types';

export const dpsLines: LanguageItem[] = [       
    {
        'component.game.playerHeader': 'you are playing as',

        'component.dps.exchange.welcome': 'Welcome to DPS!',
        'component.dps.pulseTrain': 'Pulses train',
        'component.dps.phase' : 'Phase',
        'component.dps.phaseDesc' : '(0 ou π)',
        'component.dps.modulatedPulseTrain' : 'Modulated Pulse Train',
        'component.dps.aliceExchange.send': 'Send to Bob!',
        'component.dps.aliceExchange.sent': 'Your photons are sent! Waiting for' +
            ' Bob\'s photon reception times...',
        
        
        'component.game.tabs1': 'Exchange quantum information',
        'component.game.tabs2': 'Basis reconciliation',
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
        'component.basis.validateBtn': 'Validate',
        'component.bobExchange.shareWithAlice': 'Perfect ! ' +
            'Share the arrival times with Alice to continue.',
        'component.bobExchange.sendTimes' : 'Send to Alice!',
        'component.bobExchange.timesSent': 'The arrival times have been successfully transmitted.',
        'component.bobExchange.sentTimes': 'Arrival times are sent to Alice.',
        'component.basis.verify': 'Verify arrival times',




        




    },
    {
        // ... (French translations)
        'component.game.playerHeader': 'vous jouez en tant que',

        'component.dps.exchange.welcome': 'Bienvenue dans DPS!',
        'component.dps.pulseTrain': 'Train d\'impulsions',
        'component.dps.phase' : 'Phase',
        'component.dps.phaseDesc' : '(0 ou π)',
        'component.dps.modulatedPulseTrain' : 'Train d\'impulsions modulé',
        'component.dps.aliceExchange.send': 'Envoyer à Bob !',
        'component.dps.aliceExchange.sent': 'Vos photons sont envoyés ! En' +
            ' attente des temps de reception des photons chez Bob...',
        'component.game.tabs1': 'Échange d\'information quantique',
        'component.game.tabs2': 'Réconciliation des bases',
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
        'component.basis.validateBtn': 'Valider',
        'component.bobExchange.shareWithAlice': 'parfait ! ' +
            ' Partagez les temps d\'arrivées avec Alice pour continuer.',
        'component.bobExchange.sendTimes' : 'Envoyer à Alice !',
        'component.bobExchange.sentTimes': 'Les temps d\'arrivées sont envoyés à Alice.',
        'component.bobExchange.timesSent': 'Les temps d\'arrivées ont été transmis avec succès.',
        'component.basis.verify': 'Vérifiez les temps d\'arrivées',


     
        
        
    },
    {
        // ... (Spanish translations)
        'component.game.playerHeader': 'estás jugando como',
        'component.game.tabs1': 'Intercambio de información cuántica',
        'component.game.tabs2': 'Reconciliación de bases',
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
        'component.basis.validateBtn': 'Validar',
        'component.bobExchange.shareWithAlice': 'Perfecto !' +
            ' Comparte los horarios de llegada con Alice para continuar.',
        'component.bobExchange.sendTimes' : '¡Envíale a Alice!',
        'component.dps.aliceExchange.send': '¡Envíale a Bob!',
        'component.bobExchange.timesSent': 'Los tiempos de llegada han sido transmitidos con éxito.',
        'component.bobExchange.sentTimes': 'Los tiempos de llegada se envían a Alice.',
        'component.basis.verify': 'Verifica horarios de llegada',





        


    }
];