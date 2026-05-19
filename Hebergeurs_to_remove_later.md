# Hébergeurs pour le frontend

## Vercel (international, très utilisé pour Next.js)

https://vercel.com/

--> Vercel est une entreprise américaine fondée par Guillermo Rauch.
C’est la société derrière le framework Next.js.

 
- Gratuit jusqu’à un certain usage.
- Push git : Import your repo, deploy in seconds.

- Hobby (Free forever) : The perfect starting place for your web app or personal project.
- Pro ($20/mo + additional usage) : Everything you need to build and scale your app.


D’après les retours d’expérience de la communauté, le plan gratuit de Vercel est largement suffisant tant que le trafic reste modéré — il peut même supporter 10 000+ visites par mois si l’usage des fonctions serverless reste raisonnable.

Dans notre cas, avec 200 à 1000 utilisateurs par mois, nous sommes très loin des limites du plan gratuit.

Petite clarification importante :
**Serverless ne veut pas dire “sans serveur”.**
Cela signifie simplement que nous ne gérons pas le serveur nous-mêmes (infrastructure, maintenance, scaling, etc.).

Si notre site est principalement du frontend statique (React / Next.js statique), cela consomme presque zéro serverless.
L’usage serverless concerne surtout le backend (routes API, logique serveur, calculs, base de données, authentification, etc.).

Conclusion : pour notre volume actuel et notre architecture, le plan gratuit est largement suffisant. Nous pourrons toujours passer à un plan supérieur ou migrer vers une autre solution si le projet grandit.

--> Où sont les serveurs ?

Vercel ne possède pas directement tous ses data centers.
Ils s’appuient principalement sur :

    - Amazon Web Services (AWS)
    - Google Cloud
    - Leur propre réseau Edge distribué mondialement


---

## Netlify (international, simple et populaire)

[https://www.netlify.com/](https://www.netlify.com/)

--> Netlify est une plateforme américaine spécialisée dans l’hébergement frontend moderne (React, Vue, Next.js statique).

* Gratuit jusqu’à un certain usage.

- Personal: $9/month
- Pro: $20/month

* Déploiement automatique via Git (GitHub, GitLab, Bitbucket).

* Très simple pour sites statiques.

* Free plan : suffisant pour projets personnels ou petits projets.

* Pro plan : pour équipes et projets plus importants.

D’après les retours d’expérience, le plan gratuit est largement suffisant pour des sites statiques à trafic modéré.

Dans notre cas (200 à 1000 utilisateurs/mois), cela reste totalement confortable.

Serverless chez Netlify fonctionne de la même manière : ce sont des fonctions backend exécutées à la demande.

--> Où sont les serveurs ?

Netlify utilise principalement :

* Amazon Web Services
* Un CDN global distribué

Conclusion : Très bonne alternative à Vercel si nous voulons quelque chose de simple et stable.

---

## Cloudflare Pages (ultra performant, edge-first)

[https://pages.cloudflare.com/](https://pages.cloudflare.com/)

--> Service proposé par Cloudflare.

* Plan gratuit très généreux.
* Excellentes performances mondiales (réseau edge très puissant).
* Très bon pour sites statiques et JAMstack.

- Pro: $20/mo billed annually   

Cloudflare est l’un des plus grands réseaux CDN au monde.

Pour 200 à 1000 utilisateurs/mois, on est extrêmement loin des limites.

Serverless chez Cloudflare = Cloudflare Workers (exécutés directement au edge).

--> Où sont les serveurs ?

Cloudflare possède son propre réseau mondial distribué dans des centaines de villes.

Conclusion : Très performant, moderne, excellent pour performance globale.

---


## Firebase Hosting (Google ecosystem)

**No.**

[https://firebase.google.com/](https://firebase.google.com/)

--> Service proposé par Google.

* Plan gratuit disponible.

--> pas adapté pour nous ...


### Limitations par rapport à QuantumCrypto

QuantumCrypto a des besoins spécifiques :

- Frontend Next.js dynamique

- Tu utilises SSR (Server Side Rendering) ou routes API pour les protocoles

- Firebase Hosting ne supporte pas SSR Next.js nativement

- Tu devrais tout exporter en statique, ce qui limite beaucoup la dynamique du site

Backend Django/Channels avec WebSockets

- Firebase Hosting ne gère pas les WebSockets

- Tu aurais besoin de Cloud Functions + Firebase Realtime DB, mais ça ne remplace pas un vrai backend Django/Channels

**Complexe et pas naturel pour notre projet**


## AWS Amplify (solution Amazon complète)

**No.**

[https://aws.amazon.com/amplify/](https://aws.amazon.com/amplify/)

--> Service proposé par Amazon Web Services.

avec github repo, on peut deployer directement sur AWS.

Inconvénient : plus technique, moins simple que Vercel.

On est deja sur AWS, mais ça bloque au niveau du DNS...

---

# Résumé stratégique

Pour notre projet actuel (200–1000 utilisateurs/mois) :

* Vercel → le plus simple pour Next.js
* Netlify → alternative simple et stable
* Cloudflare Pages → performance maximale
* Firebase → bon si on veut l’écosystème Google
* AWS Amplify → logique si on reste full AWS
* GitHub Pages → trop limité pour évoluer

---

Si tu veux, je peux aussi te faire un petit tableau comparatif clair pour présenter ça en réunion.

--------------

# Hébergeurs basés au **Québec / Canada**

## Web Hosting Canada (WHC) – Hébergement web canadien

[https://www.whc.ca/](https://www.whc.ca/) : hébergeur classique

- Tu as accès à un serveur via cPanel / SSH.

- **4.31/month for 2 years --> total 103.50 CAD.**

--> WHC est une entreprise canadienne spécialisée dans l’hébergement web, avec des serveurs localisés au Canada (Montréal, Vancouver).

--> Transfer my domain registration: .app is not accepted for transfer.

Le plan de base est tout à fait suffisant pour des sites frontaux et des petits projets.

Pour un volume de 200 à 1000 utilisateurs/mois, WHC gère sans problème.

--> Où sont les serveurs ?

Les centres de données sont au :

* Montréal
* Vancouver

---

## CrocWeb – Hébergement cloud canadien (Montréal)

[https://crocweb.ca/](https://crocweb.ca/)

--> Société basée à Montréal offrant de l’hébergement cloud rapide.

* Plans très compétitifs (très low cost).
* Infrastructure optimisée pour performance web.
* Support 24/7 via ticket.

- cloudlite plan: $1.02/month
- cloudplus plan: $2.08/month
- cloudpro plan: $8.16/month

- **C’est un hébergement classique** de type VPS / cloud server.
    - Tu installes toi-même Node.js, PM2, Nginx, etc.

Le plan d’entrée reste performant pour un site Next.js statique ou même légerement dynamique.

Pour 200–1000 utilisateurs/mois, c’est très confortable.

--> Où sont les serveurs ?

Hébergement au **Canada (Montréal)** avec bon peering vers NY/Toronto.

Conclusion : Excellente option locale et économique.


## PlanetHoster (Québec + Europe)

[https://www.planethoster.com/](https://www.planethoster.com/)

--> Hébergeur international avec présence locale (Laval, Québec).

--> Hébergement classique (cPanel / serveur mutualisé / VPS)

- Shared hosting (The world): $7.99/month
- Shared hosting (The world pro): $9.99/month
- Dedicated server: $49.99/month

* Offre *The World* : isolation complète des comptes.
* Domaines, SSL, emails inclus.
* Bon support et performances.

Très bon rapport qualité/prix pour sites professionnels.

Supporte confortablement ton trafic prévu initialement.

--> Où sont les serveurs ?

Serveurs au **Québec (Laval)** et **Europe**.

Conclusion : Excellent choix local avec une portée globale.

---

## Funio – Hébergement au Québec

**No.** pas adapté pour nous ... (Ce n’est pas pensé pour des applications web modernes sauf si on veut un VPS)

[https://www.funio.com/](https://www.funio.com/)

--> Hébergeur québécois qui propose plusieurs types d’hébergement.

* hébergement classique: standard cPanel
* 5.50$/month
* VPS: 34.80$/month

--> Où sont les serveurs ?

Infrastructure principalement au **Québec (Verdun / Montréal)**.

Conclusion : Bon choix local, plus flexible si tu veux évoluer vers un VPS plus tard.

---

## RapideNet – Hébergement québécois

[https://www.rapidenet.ca/](https://www.rapidenet.ca/)

--> Hébergeur basé près de Montréal.

--> Hébergement classique (cPanel / serveur mutualisé / VPS)

- Ton frontend est exporté en statique (next build + next export)

* Plans mutualisés avec SSD NVMe.
* SSL gratuit, domaine en option.
* Support en français / anglais.

- 70,00$  par année ou 6,00$ par mois
- 85,00$ par année ou 11,00$ par mois

Pour un site statique ou léger, suffisant.

--> Où sont les serveurs ?

Data Center au **Québec / Montréal**.

Conclusion : Option locale fiable pour sites simples à trafic modeste.

---

## OVHcloud Canada – VPS et Cloud


[https://www.ovhcloud.com/](https://www.ovhcloud.com/)

--> Entreprise internationale mais avec data centers **au Canada** (Montréal / Beauharnois).

* VPS, serveurs dédiés, cloud public.
* Très bon rapport qualité / prix.
* Customisation complète (Docker, Nginx, etc.)

https://www.ovhcloud.com/fr-ca/vps/ 

- VPS 1 : 8.71$/month.  ==> good for us.
- VPS 2 : 13.60$/month

Avec un VPS OVHcloud, tu peux héberger *frontend + backend* ensemble si besoin.

Pour ton trafic, même un petit VPS est plus que suffisant.

Conclusion : Très bon choix si tu veux un peu de contrôle (VPS ou cloud) tout en restant au Canada.


---------


# Resumé 1 — Frontend uniquement

*(Backend hébergé séparément : AWS / OVH / autre VPS)*

### 1) Vercel

Le mieux adapté à Next.js. Déploiement automatique via GitHub, plan gratuit suffisant pour 200–1000 utilisateurs/mois.

### 2) Cloudflare Pages

Très performant (réseau edge mondial). Idéal pour frontend statique avec excellente rapidité.

### 3) Netlify

Alternative simple et stable avec déploiement Git automatique.

### 4) 🇨🇦 RapideNet (Canada)

Option locale (Québec) pour frontend statique, mais déploiement manuel.

---

# Resumé 2 — Frontend + Backend ensemble

### 1) OVHcloud VPS Canada

Meilleur compromis contrôle/prix. Permet d’héberger Next.js + Django + WebSockets sur un seul serveur.

### 2) CrocWeb

VPS local économique à Montréal, configuration entièrement manuelle.

### 3) PlanetHoster (serveur dédié)

Solution plus classique et professionnelle, mais plus coûteuse et technique.

---

Pour notre projet QuantumCrypto, le meilleur compromis aujourd’hui est d’héberger le frontend sur Vercel (gratuit, simple, compatible Next.js) et le backend sur un VPS OVHcloud Canada (contrôle total, support WebSockets), tout en gardant la possibilité de migrer ou d’évoluer selon le trafic futur.