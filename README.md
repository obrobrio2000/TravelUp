<h1 align="center">TravelUp</h1>

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/173881903-6421bb46-f17c-4309-aa37-1e2d01ce5205.png" alt="TravelUp: logo">
</p>

<p align="center">TravelUp è un'utile applicazione web per organizzare il tuo itinerario di viaggio.<br><br>Progetto per i Corsi di "Linguaggi e Tecnologie per il Web" e "Reti di Calcolatori", tenuti rispettivamente dai Proff. Riccardo Rosati ed Andrea Vitaletti nel 2° semestre del 3° anno del CdL in Ingegneria Informatica e Automatica (A.A. 2021/2022) presso Sapienza Università di Roma.</p>

<p align="center">
  <a href="https://github.com/TUEngineers/TravelUp/actions/workflows/docker-node.yml">
    <img alt="Docker Compose & Node" src="https://github.com/TUEngineers/TravelUp/actions/workflows/docker-node.yml/badge.svg">
  </a>
  <a href="https://github.com/TUEngineers/TravelUp/actions/workflows/codeql.yml">
    <img alt="CodeQL" src="https://github.com/TUEngineers/TravelUp/actions/workflows/codeql.yml/badge.svg">
  </a>
  <a href="https://github.com/TUEngineers/TravelUp/actions/workflows/super-linter.yml">
    <img alt="Lint Code Base" src="https://github.com/TUEngineers/TravelUp/actions/workflows/super-linter.yml/badge.svg">
  </a>
  <a href="https://github.com/TUEngineers/TravelUp/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

<h2 align="center">Soddisfacimento dei requisiti</h2>

- LTW:
  - Il progetto lato client utilizza HTML, CSS, JS, Bootstrap, JQuery, AOS;
  - Il progetto lato server utilizza Node.js per lo scripting server-side, CouchDB come database relazionale;
- RC:
  - Il progetto offre a terze parti le proprie API REST grazie ad Express.js e la documentazione è stata generata con ApiDoc;
  - Il progetto si interfaccia con i servizi REST esterni Google Maps, Google Calendar, OpenTripMap ed OpenWeatherMap;
  - I servizi commerciali con cui TravelUp si interfaccia sono Google Maps e Google Calendar, nonché i processi di autenticazione OAuth2 di Google e di Facebook.
  - Il servizio richiedente OAuth2 con cui TravelUp si interfaccia è Google Calendar;
  - Il progetto prevede l'uso di protocolli asincroni grazie alla libreria Socket.IO, utilizzati per comunicare con le OpenTripMap ed OpenWeatherMap e per comunicare con un mail server Nodemailer per l'invio tramite Gmail SMTP di email di vario tipo agli utenti;
  - Il progetto deve prevedere l'uso di Docker e l'automazione del processo di lancio, configurazione e test;
  - Il progetto è containerizzato con Docker ed i vari container vengono orchestrati con Docker Compose. Il processo di lancio è automatizzato con lo script "start" che ci permette di avviare i container in ambiente di sviluppo, di testing o di produzione (utilizzo: ./start development|test|production).
  - Per il progetto è stato utilizzato Git ed è hostato su GitHub. Di quest'ultimo è stato fatto pieno uso (Actions, Codespaces, Projects, Milestones, Issues ecc.);
  - Il progetto prevede 3 workflows CI/CD con GitHub Actions.

<h2 align="center">Scopo del progetto</h2>

Quante volte abbiamo deciso di farci una bella vacanza e, una volta giunti a destinazione, ci siamo ritrovati a dover prendere il telefono in mano, aprire l'app di Google Maps e cercare attrazioni da visitare o ristoranti in cui mangiare? Ed ogni volta si perdono dai 10 minuti fino ad addirittura mezz'ora, specialmente se siamo in comitiva e parte un dibattito su quali posti visitare e/o in quale ordine. Bene, TravelUp nasce per ovviare a questo problema, permettendoti di creare il tuo itinerario di viaggio prima di partire e portarlo con te (in versione digitale o stampata su carta), condividerlo con gli amici (ad esempio sui social grazie ad un permalink), vedere la mappa Google Maps, aggiungerlo al tuo calendario Google Calendar e molto altro ancora!

<h2 align="center">Architetture di riferimento e tecnologie usate</h2>

- Architetture e tecnologie (diagramma creato con [diagrams.net](https://www.diagrams.net/)):

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/174328858-710496a4-d086-45d3-964b-5930eb09a90f.png">
</p>

- docker-compose.yml (diagramma creato con [docker-compose-viz](https://github.com/pmsipilot/docker-compose-viz)):

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/174195519-b59ed68a-e8ef-4459-91b1-57a384142622.png" alt="TravelUp: schema docker-compose.yml">
</p>

<h2 align="center">Documentazione delle API</h2>

E' possibile leggere la documentazione delle API visitando https://localhost/api e si può provare a fare qualche richiesta API con cURL o Postman;

<h2 align="center">Forme di CI/CD</h2>

Il progetto prevede 3 workflows CI/CD con GitHub Actions:
- docker-node.yml installa node/npm in locale, esegue una clean install destinata alla produzione, inizializza i containers in ambiente di testing (e dunque esegue i test previsti), ed infine ferma i containers e pulisce tutto;
- codeql.yml esegue semantic code analysis per eventuali vulnerabilità di sicurezza di Javascript;
- super-linter.yml è una semplice combinazione di vari linter, scritti in bash, per aiutare a convalidare il codice sorgente, impedendo che del codice non funzionante venga caricato nel main branch;

<h2 align="center">Sicurezza</h2>

Il progetto prevede un self-signed certificate per la connessione sicura HTTPS, fornito e gestito da Nginx che inoltra qualsiasi tentativo di connessione alla porta HTTP 80 verso la porta HTTPS 443. Inoltre, Nginx cripta in modo sicuro anche la connessione al database e di quest'ultimo mette anche a disposizione la cache, utilizzata per le chiamate API proprietarie. Si prevedono infine opportuni check di autenticazione per ogni pagina che lo richiede, e per le richieste API proprietarie è necessaria un'API key generata ed assegnata ad ogni utente, per tenere traccia di chi utilizza le suddette API nel database di logging dedicato.

<h2 align="center">Istruzioni</h2>

1) Clonare la repository
```bash
git clone https://github.com/TUEngineers/TravelUp.git
```
2) Posizionarsi nella directory principale
```bash
cd TravelUp
```
3) Avviare i container nell'ambiente desiderato
```bash
./start development|test|production
```
4) In caso di avvio in ambiente di sviluppo o di produzione, visitare https://localhost; in caso di avvio in ambiente di testing, i test appariranno sul terminale.

<h2 align="center">Descrizione dei files</h2>

Nella directory principale si trova il file docker-compose.yml che contiene la configurazione dei vari container Docker che simulano i vari server. Precisamente, il progetto prevede:
- un server Node.js principale (cartella main), il quale è basato sul tipico design pattern del model-view-controller. Il file server.js inizializza il server e tutti gli elementi necessari (sessione cookie, autenticazione OAuth2 ecc.), ed in seguito carica tutti i file nelle varie cartelle, che richiamano il modello del Model View Controller.
  - Nel percorso main/routes è possibile trovare tutti i file deputati al routing delle pagine:
    - main-routes.js, che fornisce il routing per la homepage, il login, il logout, il check dell’autenticazione (ovvero se si è già loggati o meno) e l’handling delle pagine inesistenti con una pagina di errore.
    - public-routes.js, che fornisce il routing per gli assets contenuti in main/node_modules, ovvero Bootstrap, JQuery, AOS, FontAwesome ecc.
    - auth-routes.js, che gestisce i callback di autenticazione OAuth2 ed il routing alla dashboard una volta loggati (con opportuni checks).
    - itinerari-routes.js, che gestisce il routing e la logica di funzionamento della dashboard e degli itinerari (compresa l’aggiunta dell’itinerario a Google Calendar tramite le API ufficiali).
    - utente-routes.js, che gestisce il routing e la logica di funzionamento delle azioni legate all’utente, ovvero l’eliminazione volontaria dell’account (e di tutti i dati, nel rispetto del Diritto all’oblio del GDPR) e la gestione dell’iscrizione alla newsletter.
    - api-routes.js, che gestisce le chiamate API proprietarie (di TravelUp) e fornisce i dati appropriati. La documentazione di quest’ultime è consultabile visitando https://localhost/api.
  - Nel percorso main/views è possibile trovare tutti i file del frontend delle varie pagine (estensione .ejs), ovvero il codice HTML (con integrazioni JS server-side grazie ad Express.js). Nello specifico:
    - index.ejs è la homepage.
    - itinerari.ejs è la dashboard personale dell’utente dove può gestire i suoi itinerari, crearne di nuovi e gestire vari aspetti del proprio account.
    - nuovo-itinerario.ejs è la pagina di creazione di un nuovo itinerario.
    - visualizza-itinerario.ejs è la pagina di visualizzazione di un itinerario, dove si può anche stampare/scaricare, condividere sui social ed aggiungere a Google Calendar.
    - api.js contiene la documentazione delle APIs proprietarie (di TravelUp) per poter essere utilizzate ed integrate dagli sviluppatori.
    - login.ejs è una pagina di login secondaria (la principale pagina di login è l’homepage stessa) usata solo in caso di redirect (ad esempio se si prova a visitare il link della dashboard senza prima aver effettuato il login).
    - errore.ejs è una generica pagina di errore usata come redirect in caso di errore nel backend oppure in caso si provi a visitare una pagina non esistente (404).
  - Nel percorso main/public si trovano gli assets necessari allo styling CSS, allo scripting client-side JS e le varie immagini utilizzate.
  - Nel percorso main/config si trova passport-setup.js che è il file che gestisce, grazie al modulo Passport di Node.js, i login OAuth2 di Google e Facebook e l’aggiunta/aggiornamento degli utenti nel database.
  - Nel percorso main/models si trovano utenti-model.js ed itinerari-model.js, che esportano rispettivamente i database CouchDB “utenti” ed “itinerari” per poter essere utilizzati negli altri file JS ove necessario. Inoltre, vi si trovano utenti-model-cache.js ed itinerari-model-cache.js, che puntano alla cache del db per rispondere alle chiamate API proprietarie (di TravelUp).
- un server Nginx (cartella nginx), il quale fornisce una connessione sicura HTTPS TLS1.3 con un certificato self-signed creato con OpenSSL e reindirizza qualsiasi tentativo di connessione HTTP alla porta 80 alla porta sicura 443. Inoltre, funge da reverse-proxy per il suddetto server Node.js principale, permettendoci di raggiungerlo quando ci si connette ad https://localhost.
- un server Node.js Socket.IO (cartella ws), che gestisce tutte le richieste con protocolli asincroni del server API e del mail server.
- un server Node.js API (cartella api), che dialoga con il server Websocket per quanto riguarda le richieste/risposte ad OpenTripMap API durante la creazione di un nuovo itinerario.
- un server Node.js Nodemailer (cartella mail), mail server responsabile dell’invio di email agli utenti (email di benvenuto ai nuovi utenti, email di notifica di un nuovo accesso, newsletter ecc.).
- un server CouchDB (cartella couchdb) che ospita i vari database per l’accesso e la manipolazione dei dati contenuti in essi. Esso dispone anche di cache (per mezzo di Nginx) e di connessione sicura HTTPS (sia per il db diretto che per la cache).
In ogni directory di ognuno dei quattro server Node.js è presente anche un file server.test.js, il quale si occupa del testing della raggiungibilità dei vari server e del corretto funzionamento delle loro funzioni (ad esempio le chiamate OpenTripMap API per il server API, l’invio delle email per il server Nodemailer ecc.).
