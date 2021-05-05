# P2 - Recommender Systems

Implementation of a recommender system in a web application.

## Notes
For testing our code, we have chosen **Jest** for unit test and **Supertest** for server testing.
Furthermore, we use **NodeJS**, **Express** and socket.io for our backend.


### Installation
NodeJS can be installed from their [official website](https://nodejs.org/en/download/). This will be used to install the modules included in our project
Using `npm install` from inside the main directory for this application, the remaining packages will be installed.

### Testing with Jest
Simply run `npm test` to test.

### Running the server
Server is located at http://130.226.98.22:3000/ for testing

### Running the server on a localhost (*Only if the server is not running on http://130.226.98.22:3000/)
1. If not done already: `npm install`, npm install socket.io, npm install express
2. Alfa.c has to be compiled
3. The file path in src/app.js (line 24) has to be changed if using another system ("./a.out" for bash, "a.exe" for windows compiler)
4. node src/server.js from the root
5. Go to your webrowser and enter ://localhost:3000
