# P2 - Recommender Systems
Implementation of a recommender system in a web application.

## Running the program
The program is available on [this link](http://130.226.98.22:3000/).
If the website is not running/responding, try running the website as a localhost. Read more below.
To run the program, you will need NodeJS installed on your system.

### Installation of Node
NodeJS can be installed from their [official website](https://nodejs.org/en/download/). This will be used to install the modules necessary for our project. You can type `node` in your terminal, to see if NodeJS is installed correctly. If NodeJS, responds with a *"Welcome to Node.js v..."*, NodeJS is installed correctly.

### Running the server on a localhost (If the server is not running on [this link](http://130.226.98.22:3000/))
Open up a terminal, in the root of the `Recommender-Systems`-folder. Agian, make sure you have NodeJS installed correctly.
We prefer to run the program in VisualStudio Code, using an integrated terminal.
1. The C-file, `knn.c`, has to be compiled. 
   If running Windows, make sure to rename the output file to `knn.exe`.  
2. If not done already, type: `npm install` to install necessary modules for the website to run.
   Alternatively, you can install the main modules individually by typing: `npm install express` and `npm install socket.io` in your terminal.  
3. In your terminal, type: `node ./src/server.js` (make sure you are in the root of the file directory).
   The server should respond with message: *"Server started on port 3000"*.  
4. In your webrowser and enter `http://localhost:3000/`.
5. You are now good to go, enjoy!

## Additional Notes
There is testing available for both JavaScript-files and the C-file `knn.c`
For testing our code, we have chosen **Jest** for unit test and **Supertest** for server testing.
For testing the C-code, we have chosen **CuTest** for unit testing.
Furthermore, we use **NodeJS**, **Express** and socket.io for our backend.

### Testing with Jest
Simply run `npm test` to test.

### Test knn.c
Simply run `a.out startTest` for macOS/Linux or `knn.exe startTest` for WindowsOS.
The tests will now run.

### Running the C-program as a standalone program
We do NOT recommend running the C program as a standalone program, but it is optional.
The C-program can take in additonally arguments.
By typing: `knn.exe` (Windows) or `a.out` (macOS/Linux) followed by `getmatch 1 3` in the terminal, the program will output the best 3 matches for the user with ID 1.