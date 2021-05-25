/*
* Titel: En recommenderbaseret, relationsskabende webapplikation for ensomme unge
* Software - 2. semester (01/02/2021 - 27/05/2021)
* Aalborg universitet CPH
* 
* Gruppe: SW-K2201
* - Oscar Maxwell, Jonathan Benzon
* - Frederik Skontorp, Karl-Emil Hertz
* - Tommy Grenaae
*/

//Modules needed in program
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const functions = require('./functions')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
const Strategy = require('passport-local').Strategy
const app = express()
const bodyParser = require('body-parser')

//Gives access to a server which can communicate with socket.io
const server = require('http').Server(app)

//Create server at port "server"
const io = require('socket.io')(server)

//chat rooms array
const rooms = []

let cFilePath
/* Process platform finds operating system on a computer. We use ./a.out as default,
or knn.exe if windows */
if(process.platform == 'darwin' || process.platform == 'linux'){
    cFilePath = "./a.out"
} else if (process.platform == 'win32'){
    cFilePath = "knn.exe"
}

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const filePath = path.join(__dirname, '../public/')

//setup view engine as hbs
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static public folder
app.use(express.static(publicDirectoryPath))

//express session exstension
app.use(session({
    //set from environment variable
    //secret: process.env.SESSION_SECRET,
    secret: "hemmelighed",

    //since we dont change the environment variables, resave are set to false
    resave: false,

    //since we dont want to save an empty variable for the session, this is set to true
    saveUninitialized: true
}))

//used to overwrite, for instance with "delete"
app.use(methodOverride('_method'))

//Middleware are run between req and res. Sets locals to be authenticated
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})

//URL endcoded; saves URL-info on site so that it's not visible by user
app.use(bodyParser.urlencoded({ extended: true }))

//passport local configure:
app.use(passport.initialize())
app.use(passport.session())

/* The stragegy requires a 'verify' function, which receives 'username' and 'password' from user
The function must verify that password is correct and returns cb (call back) with a user object,
which are available in 'req.user' route handlers after authentication. */
passport.use(new Strategy(
    function (username, password, cb) {
        functions.findByUsername(username, function (err, user) {
            if (err) { return cb(err) }
            if (!user) { return cb(null, false) }
            if (user.password != password) { return cb(null, false) }
            return cb(null, user)
        });
    }));

    //responsible for inserting user id into session
    passport.serializeUser(function (user, cb) {
        cb(null, user.id)
    })

    //responsible for deleting user from session based on id
    passport.deserializeUser(function (id, cb) {
        functions.findById(id, function (err, user) {
            if (err) { return cb(err); }
                cb(null, user);
    });
});

//----- CRUD (create, update, delete) --------

//register
app.get('/register', functions.checkNotAuthenticated, (req, res) => {
    //Sender hbs view "register" til brugeren
    res.render('register', {
        title: 'Register'
    })
})

//creates a user when 'submit' are pushed in web application
app.post('/register', functions.checkNotAuthenticated, (req, res) => {
    try {
        let userId = functions.getLastUserId() + 1
        let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music,
                              req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate]

        functions.addUser(userId, req.body.username, req.body.email, req.body.password)
        functions.createAccInfo(userId,parameterarray)

        //when the profile is created, the user will be redirected to 'matchfound'-view
        res.redirect('/')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/register')
    }

})

//gives user the option to change its information
app.get('/editUser', functions.checkAuthenticated, (req, res) => {
    //Creates an object with user data and sends it to 'editUser.hbs' view
    let usrTxt = functions.accountInfoCheck(req.user.id)
    res.render('editUser', {
        title: 'Edit User',
        userobj: usrTxt
    })
})

//saves user data when user pushes 'submit' 
app.post('/saveUser',functions.checkAuthenticated,(req, res) => {

    let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music, req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate, req.body.password,req.body.username,req.body.email]
    //overwrites the old user data
    functions.SaveAccInfo(req.user.id,parameterarray)

    res.redirect('/matchfound')
})

//redirects to 'editUser'
app.post('/editUser', functions.checkAuthenticated, (req, res) => {
    try {
        res.redirect('/editUser')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/editUser')
    }

})

//main page where users can log in/out
app.get('/', functions.checkNotAuthenticated, (req, res) => {
    res.render('loginpage', {
        title: 'Login'
    })
})

//if the user is created, it's redirected to 'matchfound'-view, else back to login page
app.post('/loginpage', functions.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/matchfound',
    failureRedirect: '/'
}))

app.delete('/logout', functions.checkAuthenticated, (req, res) => {
    //clears session when logout happens
    req.logOut()

    //sets knn to 3 so that the correct matches are shown when user log in again
    req.session.knn = 3
    res.redirect('/')
})

//finds matches and display them to user
app.get('/matchfound', functions.checkAuthenticated, (req, res) => {
    let user = functions.getUserCheck(req.user.id, null)
    let knn = 3

    //gets knn from session so that the user are shown the appropriate matches
    if (req.session.knn > 3){
        knn = req.session.knn
    }
    try{
        if(user) {
            let displayMatches = functions.printMatches(cFilePath, req.user.id, knn, knn -3)
            let userChats = functions.getPersonalUserChats(req.user.id)
            let boolean = functions.knnButtonChecker(knn)

            //if there are less than 3 more matches to display they aren't shown
            if(knn >= functions.getLastUserId()-3 || knn < 3){
                res.render('matchfound', {
                    title: 'Match found',
                    loggedIn: true,

                    //removes 'start chat' button from view
                    userShown: false, 
                    buttonCheck: boolean,
                    username: req.user.username,

                    //sends an array with chats already created by user
                    chats: userChats
                })
            }
            //shows matches as long they are available 
            else {
                let usrTxt1 = functions.accountInfoCheck(displayMatches[0].id)
                let usrTxt2 = functions.accountInfoCheck(displayMatches[1].id)
                let usrTxt3 = functions.accountInfoCheck(displayMatches[2].id)
                res.render('matchfound', {
                    title: 'Match found',
                    loggedIn: true,

                    //shows 'start chat' button when matches are available
                    userShown: true, 
                    buttonCheck: boolean,
                    username: req.user.username,
                    userobj1: usrTxt1,
                    userobj2: usrTxt2,
                    userobj3: usrTxt3,
                    matchname1: displayMatches[0].username,
                    matchname2: displayMatches[1].username,
                    matchname3: displayMatches[2].username,
                    match1id: displayMatches[0].id,
                    match2id: displayMatches[1].id,
                    match3id: displayMatches[2].id,

                    //sends an array with chats already created by user
                    chats: userChats
                })
            }    
        } else {
            res.redirect('/createaccinfo')
        }
    } catch (e) {
        console.log('!ERROR! - Har du husket at compilere c-filen?')
        res.render('404', {
            title: '404',
            errorMessage: 'Could not find page'
        })
    }
})

//'show previous matches' button
app.post('/showPreviousMatches', (req, res) => {
    if(req.session.knn > 3){
        req.session.knn -= 3
    }
    res.redirect('/matchfound')
})

//'show more matches' button
app.post('/showMoreMatches', (req, res) => {
    if (req.session.knn === undefined){
        req.session.knn = 3
    }
    if(req.session.knn < functions.getLastUserId()-3){
        req.session.knn += 3
    }
    res.redirect('/matchfound')
    
})

//uses chat room, like URL "/1620380596674"
app.get('/:room', functions.checkAuthenticated, (req, res) => {
    //if chat room doesn't exist, the user are redirected to main page
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }

    //calculates common interests between two users
    let intrestChat = functions.calcUserParameters(req.params.room)
    try{
        //gets old chats between users
        let chatHistory = functions.getChatHistory(req.session.roomid)
        res.render('room', {
            userName: req.user.username,
            roomName: req.params.room,
            usermatch: req.session.username,
            chatData: chatHistory,
            intrestChat : intrestChat,

            //shows 'back to match page' button
            onChatsite: true
        })
    }catch(e){
        let chatHistory = functions.getChatHistory(req.params.room)
        res.render('room', {
            userName: req.user.username,
            roomName: req.params.room,
            usermatch: req.session.username,
            chatData: chatHistory,
            intrestChat : intrestChat,

            //shows 'back to match page' button to view when true
            onChatsite: true
        })
    }
})

//sends a user to a chat room
app.post('/room', functions.checkAuthenticated, (req, res) => {
    //if the chat room doesn't exist, the user are redirected to main page
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    //gets username and saves it to session
    let usermatch = req.body.usermatch
    req.session.username = usermatch.toString()

    //gets room id if chat exists and saves it to session
    let roomId = functions.checkChat(req.user.id, req.body.room)
    req.session.roomid = roomId

    //if chat room doesn't exists
    if (roomId == false) {
        //gets target user and match user id and creates a chat
        let user1 = functions.getUserAccounts(null, req.user.username).id
        let user2 = functions.getUserAccounts(null, usermatch).id
        functions.makeFirstChat(user1, user2)
        roomId = functions.checkChat(req.user.id, req.body.room)
    }

    //gets 'room' data from index in array and keeps data on users
    rooms[roomId] = { users: {} }

    //redirects user to the newly created chat room
    res.redirect(roomId)
    
})

//post, which redirects user from chat to 'matchfound' view via button
app.post('/goToMatchfound', (req, res) => {
    res.redirect('/matchfound')
})

//when users gets into a chat; calls function to give them a socket
io.on('connection', socket => {
    //function being called in "scripts.js"
    socket.on('new-user', (room, name) => {
        try {
            socket.join(room)

            //compose name on user with socket id
            rooms[room].users[socket.id] = name

            /*sends event 'user-connected' with message "name" -> 
            broadcast makes it so that user doesn't get it */
            socket.broadcast.to(room).emit('user-connected', name)
        } catch (e) {
            console.log(e)
        }
    })

    //activates when event 'send-chat-message' happens, with data "room" "message"
    socket.on('send-chat-message', (room, message, username1, username2) => {
        try {
            let userConnection = functions.getRoomConnection(room)
            let user1 = functions.getUserAccounts(null, username1).id
            let user2 = functions.getUserAccounts(null, username2).id
            functions.saveChat(room, user1, user2, username1, message)

            //sends the message to alle but the user itself
            socket.broadcast.to(room).emit('chat-message', {
                //creates an object to keep tracck of message data
                message: message,

                //appends the name to object via socket.id
                name: rooms[room].users[socket.id]
            })
        } catch (e) {
            console.log(e)
        }
    })
})

//404
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Could not find page'
    })
})

//module export
module.exports = server