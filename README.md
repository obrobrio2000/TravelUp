<h1 align="center">TravelUp</h1>

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/173881903-6421bb46-f17c-4309-aa37-1e2d01ce5205.png" alt="TravelUp: logo">
</p>

<p align="center">TravelUp è un'utile applicazione web per organizzare il tuo itinerario di viaggio.<br><br>Progetto per i Corsi di "Linguaggi e Tecnologie per il Web" e "Reti di Calcolatori", tenuti rispettivamente dai Proff. Riccardo Rosati ed Andrea Vitaletti nel 2° semestre del 3° anno del CdL in Ingegneria Informatica e Automatica (A.A. 2021/2022) presso Sapienza Università di Roma.</p>

<p align="center">
  <a href="https://github.com/TUEngineers/TravelUp/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
  <a href="https://github.com/TUEngineers/TravelUp/actions/workflows/docker-node.yml">
    <img alt="Docker Compose & Node" src="https://github.com/TUEngineers/TravelUp/actions/workflows/docker-node.yml/badge.svg">
  </a>
  <a href="https://github.com/TUEngineers/TravelUp/actions/workflows/codeql.yml">
    <img alt="CodeQL" src="https://github.com/TUEngineers/TravelUp/actions/workflows/codeql.yml/badge.svg">
  </a>
  <a href="https://github.com/TUEngineers/TravelUp/actions/workflows/super-linter.yml">
    <img alt="Lint Code Base" src="https://github.com/TUEngineers/TravelUp/actions/workflows/super-linter.yml/badge.svg">
  </a>
</p>

<h2 align="center">Scopo del progetto</h2>

Quante volte abbiamo deciso di farci una bella vacanza e, una volta giunti a destinazione, ci siamo ritrovati a dover prendere il telefono in mano, aprire l'app di Google Maps e cercare attrazioni da visitare o ristoranti in cui mangiare? Ed ogni volta si perdono dai 10 minuti fino ad addirittura mezz'ora, specialmente se siamo in comitiva e parte un dibattito su quali posti visitare e/o in quale ordine. Bene, TravelUp nasce per ovviare a questo problema, permettendoti di creare il tuo itinerario di viaggio prima di partire e portarlo con te (in versione digitale o stampata su carta), condividerlo con gli amici (per es. sui social grazie ad un permalink), vedere la mappa Google Maps, aggiungerlo al tuo calendario Google Calendar e molto altro ancora!

<h2 align="center">Soddisfacimento dei requisiti</h2>

- Linguaggi e Tecnologie per il Web:
  - Il progetto lato client utilizza HTML, CSS, JS, Bootstrap, JQuery, AOS;
  - Il progetto lato server utilizza Node.js per lo scripting server-side, CouchDB come database relazionale;
- Reti di Calcolatori:
  - Il progetto offre a terze parti le proprie API REST grazie ad Express.js e la documentazione è stata generata con apiDoc;
  - Il progetto si interfaccia con i servizi REST esterni Google Maps, Google Calendar, Google Custom Search ed OpenTripMap;
  - I servizi commerciali con cui il progetto si interfaccia sono Google Maps, Google Calendar e Google Custom Search, nonché i processi di autenticazione OAuth2 di Google e di Facebook.
  - Il servizio richiedente OAuth2 con cui il progetto si interfaccia è Google Calendar;
  - Il progetto prevede l'uso di protocolli asincroni, grazie alla libreria Socket.IO, per comunicare con le API OpenTripMap e Google Custom Search e con un mail server Nodemailer per l'invio tramite Gmail SMTP di e-mail di vario tipo agli utenti;
  - Il progetto deve prevedere l'uso di Docker e l'automazione del processo di lancio, configurazione e test;
  - Il progetto è containerizzato con Docker ed i vari container vengono orchestrati con Docker Compose. Il processo di lancio è automatizzato con uno script che ci permette di avviare i container in ambiente di sviluppo, di testing o di produzione.
  - Per il progetto è stato utilizzato Git ed è hostato su GitHub. Di quest'ultimo è stato fatto pieno uso (Actions, Codespaces, Projects, Milestones, Issues ecc.);
  - Il progetto prevede 3 workflows CI/CD con GitHub Actions.

<h2 align="center">Architetture di riferimento e tecnologie usate</h2>

- Architetture e tecnologie (diagramma creato con [diagrams.net](https://www.diagrams.net/)):

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/176517368-a97dc82f-a86d-48f2-99d8-b6ce8c24ac25.png" alt="TravelUp: diagramma architetture e tecnologie">
</p>

- docker-compose.yml (diagramma creato con [docker-compose-viz](https://github.com/pmsipilot/docker-compose-viz)):

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/174195519-b59ed68a-e8ef-4459-91b1-57a384142622.png" alt="TravelUp: diagramma docker-compose.yml">
</p>

<h2 align="center">Documentazione delle API</h2>

E' possibile leggere la documentazione delle API visitando <https://localhost/api> e si può provare a fare qualche richiesta API con cURL o Postman.

<h2 align="center">Forme di CI/CD</h2>

Il progetto prevede 3 workflows CI/CD con GitHub Actions:

- docker-node.yml installa node/npm in locale, esegue una clean install destinata alla produzione, inizializza i containers in ambiente di testing (e dunque esegue i test previsti), ed infine ferma i containers e pulisce tutto;
- codeql.yml esegue semantic code analysis per eventuali vulnerabilità di sicurezza di Javascript;
- super-linter.yml è una semplice combinazione di vari linter, scritti in bash, per aiutare a convalidare il codice sorgente, impedendo che del codice non funzionante venga caricato nel main branch;

<h2 align="center">Sicurezza</h2>

- Nginx mette a disposizione una connessione sicura HTTPS con un self-signed certificate (creato con OpenSSL).
- E' previsto un 301 Permanent Redirect per qualsiasi tentativo di connessione alla porta HTTP 80 verso la porta sicura HTTPS 443, il che assicura che i nuovi visitatori vengano inoltrati ad una connessione TLS1.3.
- E' prevista la HTTP Strict Transport Security, il che fa in modo che i browser non provino nemmeno a connettersi tramite HTTP, e ciò aumenta leggermente le prestazioni del sito e riduce leggermente il carico del server.
- E' previsto anche un forte gruppo Diffie-Hellman, utilizzato nella negoziazione della Perfect Forward Secrecy con i client.
- Il summenzionato certificato self-signed viene utilizzato anche da CouchDB per rendere sicura la connessione al database.
- Nginx, inoltre, mette a disposizione la cache del database, utilizzata per le chiamate API interne, anch'essa resa sicura dal medesimo certificato.
- Per le richieste API interne è necessaria un'API key generata ed assegnata ad ogni utente, e ciò permette di tenere traccia dell'utilizzo delle suddette API nel database di logging dedicato.
- Sono eseguiti opportuni check di autenticazione per ogni pagina che lo richiede.
- Sono state utilizzate variabili d'ambiente (conservate in un file .env) per ogni variabile sensibile.

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

4) In caso di avvio in ambiente di sviluppo o di produzione, visitare <https://localhost>; in caso di avvio in ambiente di testing, i test appariranno sul terminale.

<h2 align="center">Descrizione dei file</h2>

Nella root directory si trova il file *docker-compose.yml* che contiene la configurazione dei vari container Docker che simulano i vari server. Precisamente, il progetto prevede:

- un server Node.js principale (directory <u>main</u>), il cui codice richiama il tipico design pattern del model-view-controller. Il file *server.js* inizializza il server e tutti gli elementi necessari (sessione cookie, autenticazione OAuth2 ecc.), ed in seguito carica tutti i file nelle varie cartelle, che richiamano il modello del Model View Controller.
  - Nel percorso <u>main/routes</u> è possibile trovare tutti i file deputati al routing delle pagine:
    - *main-routes.js*, che fornisce il routing per la homepage, il login, il logout, il check dell’autenticazione (ovvero se si è già loggati o meno) e l’handling delle pagine inesistenti con una pagina di errore.
    - *public-routes.js*, che fornisce il routing per gli assets contenuti in <u>main/node_modules</u>, ovvero Bootstrap, JQuery, AOS, FontAwesome ecc.
    - *auth-routes.js*, che gestisce i callback di autenticazione OAuth2 ed il routing alla dashboard una volta loggati (con opportuni checks).
    - *itinerari-routes.js*, che gestisce il routing e la logica di funzionamento della dashboard e degli itinerari (compresa l’aggiunta dell’itinerario a Google Calendar tramite le API ufficiali).
    - *utente-routes.js*, che gestisce il routing e la logica di funzionamento delle azioni legate all’utente, ovvero l’eliminazione volontaria dell’account (e di tutti i dati, nel rispetto del Diritto all’oblio del GDPR) e la gestione dell’iscrizione alla newsletter.
    - *api-routes.js*, che gestisce le chiamate API interne (di TravelUp) e fornisce i dati appropriati. La documentazione di quest’ultime è consultabile visitando <https://localhost/api>.
  - Nel percorso <u>main/views</u> è possibile trovare tutti i file del frontend delle varie pagine (estensione *.ejs*), ovvero il codice HTML (con integrazioni JS server-side grazie ad Express.js). Nello specifico:
    - *index.ejs* è la homepage.
    - *itinerari.ejs* è la dashboard personale dell’utente dove può gestire i suoi itinerari, crearne di nuovi e gestire vari aspetti del proprio account.
    - *nuovo-itinerario.ejs* è la pagina di creazione di un nuovo itinerario.
    - *visualizza-itinerario.ejs* è la pagina di visualizzazione di un itinerario, dove si può anche stampare/scaricare, condividere sui social ed aggiungere a Google Calendar.
    - *api.js* contiene la documentazione delle APIs interne (di TravelUp) per poter essere utilizzate ed integrate dagli sviluppatori.
    - *login.ejs* è una pagina di login secondaria (la principale pagina di login è l’homepage stessa) usata solo in caso di redirect (per es. se si prova a visitare il link della dashboard senza prima aver effettuato il login).
    - *errore.ejs* è una generica pagina di errore usata come redirect in caso di errore nel backend oppure in caso si provi a visitare una pagina non esistente (404).
  - Nel percorso <u>main/public</u> si trovano gli assets necessari allo styling CSS, allo scripting client-side JS e le varie immagini utilizzate.
  - Nel percorso <u>main/config</u> si trova *passport-setup.js* che è il file che gestisce, grazie al modulo Passport di Node.js, i login OAuth2 di Google e Facebook e l’aggiunta/aggiornamento degli utenti nel database.
  - Nel percorso <u>main/models</u> si trovano *utenti-model.js*, *itinerari-model.js* e *logging_api-model.js*, che esportano rispettivamente i database CouchDB “utenti”, “itinerari” e "logging_api" per poter essere utilizzati negli altri file *.js*. Inoltre, vi si trovano *utenti-model-cache.js* ed *itinerari-model-cache.js*, che puntano alla cache del db per rispondere alle chiamate API interne (di TravelUp).
- un server Nginx (directory <u>nginx</u>), il quale fornisce una connessione sicura HTTPS TLS1.3 con un certificato self-signed creato con OpenSSL e reindirizza qualsiasi tentativo di connessione HTTP alla porta 80 alla porta sicura 443. Inoltre, funge da reverse-proxy per il suddetto server Node.js principale, permettendoci di raggiungerlo quando ci si connette ad <https://localhost>.
- un server Node.js Socket.IO (directory <u>ws</u>), che gestisce tutte le richieste con protocolli asincroni del server API esterne e del mail server.
- un server Node.js API (directory <u>api</u>), che dialoga con il server Socket.IO per quanto riguarda le richieste API ad OpenTripMap e Google Custom Search.
- un server Node.js Nodemailer (directory <u>mail</u>), mail server che dialoga con il server Socket.IO per quanto riguarda l’invio di e-mail agli utenti (e-mail di benvenuto ai nuovi utenti, e-mail di notifica di un nuovo accesso, newsletter ecc.).
- un server CouchDB (directory <u>couchdb</u>) che ospita i vari database per l’accesso e la manipolazione dei dati contenuti in essi. Esso dispone anche di cache (per mezzo di Nginx) e di connessione sicura HTTPS (sia per il db diretto che per la cache).

Nella directory *main* è anche presente un file *server.test.js*, il quale prevede 22 test (raggiungibilità dei vari server, corretto funzionamento delle richieste API esterne per il server API, corretto funzionamento dell’invio delle e-mail per il server Nodemailer, corretto funzionamento di Socket.IO, scrittura/lettura del database ecc.).

Sono stati esclusi da git (attraverso l'apposito file *.gitignore*) il file del database "utenti" ed il file *.env*, contenenti dati sensibili, ed il file <u>nginx/ssl/</u>*travelup_key.pem*, chiave del certificato self-signed.
