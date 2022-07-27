<h1 align="center">TravelUp</h1>

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/173881903-6421bb46-f17c-4309-aa37-1e2d01ce5205.png" alt="TravelUp: logo">
</p>

<p align="center">TravelUp is a useful web application to organize your travel itinerary.<br><br>Project for the Courses of "Web Languages and Technologies" and "Computer Networks", held respectively by Profs. Riccardo Rosati and Andrea Vitaletti in the 2nd semester of the 3rd year of the Bachelor's Degree Course in Computer and System Engineering (A.Y. 2021/2022) at Sapienza University of Rome.</p>

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
</p>

<h2 align="center">Purpose of the project</h2>

How many times have we decided to have a nice vacation and, once we reached our destination, we found ourselves having to pick up the phone, open the Google Maps app and look for attractions to visit or restaurants to eat? And every time we lose from 10 minutes up to even half an hour, especially if we are in a group and a debate on which places to visit and/or in what order starts. Well, TravelUp was created to overcome this problem, allowing you to create your travel itinerary before leaving and take it with you (in digital or printed version), share it with friends (e.g. on social networks thanks to a permalink), see the Google Maps map, add it to your Google Calendar and much more!

<h2 align="center">Meeting the requirements</h2>

- Web Languages and Technologies:
  - Client side project uses HTML, CSS, JS, Bootstrap, JQuery, AOS;
  - Server side project uses Node.js for server-side scripting, CouchDB as relational database;
- Computer Networks:
  - The project offers its REST APIs to third parties thanks to Express.js and the documentation was generated with apiDoc;
  - The project interfaces with the external REST services Google Maps, Google Calendar, Google Custom Search and OpenTripMap;
  - The commercial services with which the project interfaces are Google Maps, Google Calendar and Google Custom Search, as well as the OAuth2 authentication processes of Google and Facebook.
  - The OAuth2 requesting service with which the project interfaces is Google Calendar;
  - The project involves the use of asynchronous protocols, thanks to the Socket.IO library, to communicate with the OpenTripMap and Google Custom Search APIs and with a Nodemailer mail server for sending various types of e-mails to users via Gmail SMTP ;
  - The project must include the use of Docker and the automation of the launch, configuration and test process;
  - The project is containerized with Docker and the various containers are orchestrated with Docker Compose. The launch process is automated with a script that allows us to launch the containers in a development, testing or production environment.
  - Git was used for the project and it is hosted on GitHub. Full use of the latter has been made (Actions, Codespaces, Projects, Milestones, Issues etc.);
  - The project includes 2 CI/CD workflows with GitHub Actions.

<h2 align="center">Reference architectures and technologies used</h2>

- Architectures and technologies (diagram created with [diagrams.net](https://www.diagrams.net/)):

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/176517368-a97dc82f-a86d-48f2-99d8-b6ce8c24ac25.png" alt="TravelUp: diagramma architetture e tecnologie">
</p>

- docker-compose.yml (diagram created with [docker-compose-viz](https://github.com/pmsipilot/docker-compose-viz)):

<p align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/62136803/174195519-b59ed68a-e8ef-4459-91b1-57a384142622.png" alt="TravelUp: diagramma docker-compose.yml">
</p>

<h2 align="center">API documentation</h2>

You can read the API documentation by visiting <https://localhost/api> and you can try making some API requests with cURL or Postman.

<h2 align="center">Forms of CI/CD</h2>

The project includes 2 CI/CD workflows with GitHub Actions:

- docker-node.yml installs node/npm locally, performs a clean install intended for production, initializes the containers in the test environment (and therefore runs the required tests), and finally stops the containers and cleans everything;
- codeql.yml performs semantic code analysis for any Javascript security vulnerabilities.

<h2 align="center">Security</h2>

- Nginx provides a secure HTTPS connection with a self-signed certificate (created with OpenSSL).
- A 301 Permanent Redirect is provided for any attempt to connect to the HTTP port 80 to the secure HTTPS port 443, which ensures that new visitors are forwarded to a TLS1.3 connection.
- HTTP Strict Transport Security is provided, which makes browsers not even try to connect via HTTP, which slightly increases site performance and slightly reduces server load.
- A strong Diffie-Hellman group is also expected, used in negotiating Perfect Forward Secrecy with clients.
- The aforementioned self-signed certificate is also used by CouchDB to secure the connection to the database.
- Nginx also provides the database cache, used for internal API calls, which is also secured by the same certificate.
- For internal API requests, an API key generated and assigned to each user is required, and this allows you to keep track of the use of the aforementioned API in the dedicated logging database.
- Appropriate authentication checks are performed for each page that requests it.
- Environment variables (stored in an .env file) have been used for each sensitive variable.

<h2 align="center">Instructions</h2>

1) Clone the repository

```bash
git clone https://github.com/TUEngineers/TravelUp.git
```

2) Change to the root directory

```bash
cd TravelUp
```

3) Start the containers in the desired environment

```bash
./start development|test|production
```

4) If you are booting into a development or production environment, visit <https://localhost>; in case of boot in test environment, the tests will appear on the terminal.

<h2 align="center">Description of the files</h2>

In the root directory is the *docker-compose.yml* file which contains the configuration of the various Docker containers that simulate the various servers. Specifically, the project includes:

- a main Node.js server (<u>main<u> directory), whose code recalls the typical design pattern of the model-view-controller. The *server.js* file initializes the server and all the necessary elements (cookie session, OAuth2 authentication etc.), and then loads all the files in the various folders, which recall the Model View Controller model.
  - In the <u>main/routes<u> path you can find all the files dedicated to page routing:
    - *main-routes.js*, which provides homepage routing, login, logout, authentication check (i.e. if you are already logged in or not) and handling of non-existent pages with an error page .
    - *public-routes.js*, which provides routing for the assets contained in <u>main/node_modules<u>, i.e. Bootstrap, JQuery, AOS, FontAwesome etc.
    - *auth-routes.js*, which manages the OAuth2 authentication callbacks and the routing to the dashboard once logged in (with appropriate checks).
    - *itineraries-routes.js*, which manages the routing and operating logic of the dashboard and itineraries (including adding the itinerary to Google Calendar via the official API).
    - *user-routes.js*, which manages the routing and operating logic of the actions related to the user, i.e. the voluntary deletion of the account (and all data, in compliance with the Right to be forgotten of the GDPR) and the management of the newsletter subscription.
    - *api-routes.js*, which handles internal (TravelUp's) API calls and provides the appropriate data. The documentation of the latter can be consulted by visiting <https://localhost/api>.
  - In the path <u>main/views<u> it is possible to find all the files of the frontend of the various pages (extension *.ejs*), that is the HTML code (with JS server-side integrations thanks to Express.js). In particular:
    - *index.ejs* is the homepage.
    - *itineraries.ejs* is the user's personal dashboard where he can manage his itineraries, create new ones and manage various aspects of his account.
    - *new-itinerary.ejs* is the page for creating a new itinerary.
    - *view-itinerary.ejs* is the page for viewing an itinerary, where you can also print/download, share on social networks and add to Google Calendar.
    - *api.js* contains the documentation of the internal (TravelUp's) APIs to be used and integrated by developers.
    - *login.ejs* is a secondary login page (the main login page is the homepage itself) used only in case of redirects (e.g. if you try to visit the dashboard link without logging in first).
    - *error.ejs* is a generic error page used as a redirect in case of an error in the backend or if you try to visit a non-existent page (404).
  - In the <u>main/public<u> path you will find the assets necessary for CSS styling, client-side JS scripting and the various images used.
  - In the path <u>main/config<u> there is *passport-setup.js* which is the file that manages, thanks to the Passport module of Node.js, the OAuth2 logins of Google and Facebook and the addition/updating of users in the database.
  - In the path <u>main/models<u> there are *users-model.js*, *itineraries-model.js* and *logging_api-model.js*, which respectively export the CouchDB "users" databases, "itineraries” and "logging_api" to be used in the other *.js* files. Also, there are *users-model-cache.js* and *itineraries-model-cache.js*, which point to the db cache to answer internal API calls (from TravelUp).
- an Nginx server (<u>nginx<u> directory), which provides a secure HTTPS TLS1.3 connection with a self-signed certificate created with OpenSSL and redirects any HTTP connection attempt on port 80 to secure port 443. Furthermore, it acts as a reverse-proxy for the aforementioned main Node.js server, allowing us to reach it when connecting to <https://localhost>.
- a Node.js Socket.IO server (<u>ws<u> directory), which handles all requests with asynchronous protocols from the external API server and the mail server.
- a Node.js API server (<u>api<u> directory), which communicates with the Socket.IO server regarding API requests to OpenTripMap and Google Custom Search.
- a Node.js Nodemailer server (<u>mail<u> directory), a mail server that communicates with the Socket.IO server for sending e-mails to users (welcome e-mails to new users , e-mail notification of a new access, newsletter, etc.).
- a CouchDB server (<u>couchdb<u> directory) which hosts the various databases for accessing and manipulating the data contained in them. It also has a cache (via Nginx) and a secure HTTPS connection (for both direct db and cache).

In the *main* directory there is also a *server.test.js* file, which includes 29 tests (reachability of the various servers, correct functioning of the proprietary/internal API requests, correct functioning of the external API requests for the API server, correct functioning of the sending of e-mails for the Nodemailer server, correct functioning of Socket.IO, writing/reading of the database, etc.).

The *.env* file, containing sensitive data, and the file <u>nginx/ssl/</u>*travelup_key.pem*, self-signed certificate key, have been excluded from git (through the appropriate *.gitignore* file).
