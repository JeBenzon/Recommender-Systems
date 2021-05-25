# P2 - Recommender Systems
Implementation of a recommender system in a web application.

## Running the program
The program is available on [this link](http://130.226.98.22:3000/).
If the website is not running/responding, try running the website as a localhost. Read more below.
To run the program, you will need NodeJS installed on your system.

### Installation of Node
NodeJS can be installed from their [official website](https://nodejs.org/en/download/). This will be used to install the modules necessary for our project. You can type `node` in your terminal, to see if NodeJS is installed correctly. If NodeJS, responds with a *"Welcome to Node.js v..."*, NodeJS is installed correctly.

### Running the server on a localhost (If the server is not running on [this link](http://130.226.98.22:3000/))
Open up a terminal, in the root of `Recommender-Systems`-folder. Agian, make sure you have NodeJS installed correctly.
We prefer to run the program in VisualStudio Code, with integrated terminal.
1. The C-file, `knn.c` has to be compiled. 
⋅⋅⋅Our program will try to determine what OS you are running, so no need to do anything else.
2. If not done already, type: `npm install` to install necessary modules for the website to run.
⋅⋅⋅Alternatively, you can install main modules induvially by typing: `npm install express` and `npm install socket.io` in your terminal.
3. In your terminal, type: `node ./src/server.js` (make sure you are in the root of the file directory)
4. In your webrowser and enter `http://localhost:3000/`
5. You are now good to go, enjoy!

## Additional Notes
For testing our code, we have chosen **Jest** for unit test and **Supertest** for server testing.
Furthermore, we use **NodeJS**, **Express** and socket.io for our backend.

### Testing with Jest
Simply run `npm test` to test.

### Test knn.c
Simply run `a.out startTest` for macOS or `a.exe startTest` for WindowsOS
