---
title: "Glossaire des définitions"
description: "Dictionnaire des concepts clés de la cryptographie quantique (BB84, E91, DPS, etc.)"
type: "glossaire"
language: "fr"
version: "1.0"
last_updated: "2025-07-10"
contributors: ["Jean-Fred", "ibra"]
---

# Glossaire des définitions

## Clé de chiffrement
Une clé de chiffrement est une information secrète, généralement une suite de bits (0 et 1), partagée uniquement entre deux parties (comme Alice et Bob). Elle permet, grâce à un algorithme cryptographique, de transformer un message lisible (texte clair) en un message chiffré (illisible pour les autres), puis de le déchiffrer. Contrairement à un mot de passe, la clé n’est pas destinée à être mémorisée par un humain, mais à être utilisée par un programme informatique. L’objectif des protocoles comme E91 ou BB84 est de générer et partager cette clé de façon parfaitement sécurisée, afin que seuls Alice et Bob puissent protéger leurs communications.

## Canal public (et privé)
Un canal public est un moyen de communication (comme Internet, une fibre optique ou une ligne téléphonique) où toute personne peut potentiellement intercepter ou écouter les messages échangés, un peu comme parler à voix haute dans une pièce pleine de monde. À l’inverse, un canal privé garantit que seuls les interlocuteurs concernés peuvent accéder à la communication, comme une conversation à voix basse à l’écart. Dans la pratique, il est difficile d’assurer la confidentialité d’un canal : c’est pourquoi la cryptographie est utilisée pour rendre les messages incompréhensibles sur un canal public. Dans les protocoles de cryptographie quantique (BB84, E91, DPS…), la sécurité repose sur la physique quantique, et non sur la confidentialité du canal.

## Photon
On dit souvent que tout dans l’univers est composé de particules, même la lumière. Les particules qui composent la lumière sont appelées photons : ce sont les “grains” fondamentaux de l’énergie lumineuse. Dans les protocoles de cryptographie quantique (comme BB84, E91…), les photons servent à transporter l’information entre deux parties. Leur propriété de [polarisation](definitions#polarisations) permet de coder les bits (0 ou 1), tandis que leur nature quantique garantit la sécurité de la transmission : toute tentative d’interception modifie l’état du photon et peut être détectée.


## Polarisations
La polarisation décrit l'orientation dans laquelle une onde lumineuse (comme un photon) oscille. Imaginez une corde qui vibre : elle peut le faire verticalement (↔), horizontalement (↔) ou en diagonale (⤢). Pour un photon, la polarisation est une propriété quantique fondamentale qui est mesurée pour obtenir les résultats +1 ou -1.

## Maximalement intriquées
Deux particules (ou qubits) sont dites "intriquées" lorsqu’elles partagent un état quantique commun : leurs résultats de mesure sont corrélés de façon telle qu’il est impossible de les décrire séparément, même à distance. On parle d’ "intrication maximale" lorsque la corrélation entre les résultats de mesure est la plus forte possible, c’est-à-dire que les résultats sont parfaitement corrélés ou anticorrélés selon la base choisie (si l’on mesure l’une, on connaît immédiatement le résultat de la mesure de l’autre).

Mathématiquement, un état d’intrication maximale s’écrit sous la forme d’une superposition où chaque résultat possible a la même probabilité : par exemple, pour deux qubits, l’état $\left|\Phi^+\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$ signifie que les deux particules sont toujours identiques (00 ou 11), chacune avec une probabilité de 1/2. L’« amplitude » $1/\sqrt{2}$ garantit cette égalité de probabilité.

Il existe aussi des états intriqués non maximaux, où les amplitudes ne sont pas égales (par exemple, $\alpha|00\rangle + \beta|11\rangle$ avec $|\alpha|^2 \neq |\beta|^2$). Dans ce cas, les corrélations sont plus faibles et l’état n’est pas aussi utile pour la cryptographie quantique.

L’intrication maximale est essentielle pour garantir la sécurité des protocoles quantiques : toute tentative d’interception modifie ces corrélations parfaites et peut être détectée.

## Base (de mesure)
Une base de mesure est un ensemble d’orientations de référence utilisées pour mesurer une propriété quantique, comme la polarisation d’un photon ou l’état d’un qubit. C’est comme choisir l’angle de son « filtre polarisant ». Le résultat de la mesure (par exemple, $+1$ ou $-1$, ou bien 0 ou 1) dépend de la base choisie. Dans les protocoles comme BB84 ou E91, Alice et Bob choisissent aléatoirement leurs bases (notées $a$, $b$, $a'$, $b'$…).

## Mesures effectuées dans la même base
On parle de mesures effectuées dans la même base lorsque, pour une même paire de particules, Alice et Bob ont choisi par hasard la même orientation pour leur appareil de mesure (par exemple, tous les deux ont utilisé la base $b$). C’est uniquement dans ce cas que leurs résultats sont parfaitement corrélés (ou anticorrélés selon l’état) et peuvent être utilisés pour construire la clé de chiffrement secrète.

## Corrélation $E(a, b)$
La corrélation $E(a, b)$ mesure le lien statistique entre les résultats de mesure de deux qubits intriqués, chacun mesuré selon une base (orientation) différente : $a$ pour le premier, $b$ pour le second. Elle se calcule comme la moyenne des produits des résultats obtenus (par exemple, $+1$ ou $-1$), sur un grand nombre de paires. Une corrélation de $+1$ signifie que les résultats sont toujours identiques, $-1$ qu’ils sont toujours opposés, et $0$ qu’il n’y a pas de lien.

En pratique, on peut aussi la calculer par :
$E(a, b) = \dfrac{N_{00} + N_{11} - N_{01} - N_{10}}{N_{00} + N_{11} + N_{01} + N_{10}}$
où $N_{ij}$ est le nombre de fois où le premier qubit donne $i$ et le second $j$.

## Paires de Bell
Les paires de Bell sont des paires de qubits (particules quantiques, comme les photons) préparées dans l’un des quatre états d’[intrication quantique maximale](#maximalement-intriquées), appelés états de Bell. Ces états présentent des corrélations parfaites, impossibles à reproduire avec la physique classique, et sont fondamentaux pour de nombreux protocoles de cryptographie quantique. Les quatre états de Bell sont :

- $\left|\Phi^+\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle + |11\rangle)$
- $\left|\Phi^-\right\rangle = \frac{1}{\sqrt{2}} (|00\rangle - |11\rangle)$
- $\left|\Psi^+\right\rangle = \frac{1}{\sqrt{2}} (|01\rangle + |10\rangle)$
- $\left|\Psi^-\right\rangle = \frac{1}{\sqrt{2}} (|01\rangle - |10\rangle)$

Leur nom rend hommage au physicien John Stewart Bell. Dans les protocoles comme E91, ces paires permettent de garantir la sécurité grâce à l’intrication maximale : toute tentative d’interception modifie les corrélations et peut être détectée.

## Inégalités de Bell
Les inégalités de Bell sont un ensemble de relations mathématiques qui doivent toujours être respectées si la nature obéit aux lois de la physique classique et à l’idée de variables cachées locales (c’est-à-dire que les résultats des mesures sont prédéterminés et aucune information ne voyage plus vite que la lumière). Or, la mécanique quantique prédit – et l’expérience confirme – que certains systèmes intriqués, comme les [paires de Bell](#paires-de-bell), peuvent violer ces inégalités : ils présentent des corrélations impossibles à expliquer par une théorie classique. Tester la violation des inégalités de Bell permet donc de prouver l’existence de l’intrication quantique et d’écarter toute explication par des variables cachées locales.

## L’inégalité de CHSH
L’inégalité de CHSH (Clauser, Horne, Shimony, Holt) est une version particulière et testable expérimentalement des [inégalités de Bell](#inégalités-de-bell). Elle s’applique à des mesures sur deux qubits intriqués, chacun mesuré selon deux bases différentes. Selon la physique classique, la valeur du paramètre $S$ calculé à partir des corrélations mesurées ne peut pas dépasser 2. Or, la mécanique quantique permet d’atteindre une valeur maximale de $2\sqrt{2}$, prouvant ainsi la présence d’intrication et l’absence de variables cachées locales. Dans le protocole E91, la vérification de cette inégalité garantit la sécurité de la clé générée.

### Interprétation de la valeur de S
Dans le protocole E91, la valeur $S$ calculée à partir des mesures doit dépasser 2 pour prouver l’origine quantique et sécurisée de la clé. Si $S \leq 2$, les résultats sont compatibles avec la physique classique : cela signifie que l’intrication a été rompue, très probablement par une tentative d’espionnage. La clé n’est alors pas sûre et doit être jetée.

#### Importance du nombre d’échantillons
Les résultats du protocole (comme la valeur de S) sont basés sur des probabilités et des moyennes. Pour obtenir une valeur fiable qui reflète la réalité, il faut un très grand nombre de mesures (d’échantillons). Avec peu de mesures, le hasard peut fausser le résultat et mener à une conclusion erronée sur la sécurité de la clé.
