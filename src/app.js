
//Modules vi skal bruge i vores program
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
//Giver os en "Server der kan kommunikere med socket.io"
const server = require('http').Server(app)
//Laver server på port "server"
const io = require('socket.io')(server)
//Vores rooms
const rooms = []

let cFilSti
//Process platform finder styresystemet af en computer. Vi bruger ./a.out, hvis ikke det er windows.
if(process.platform == 'darwin' || process.platform == 'linux'){
    cFilSti = "./a.out"
} else if (process.platform == 'win32'){
    cFilSti = "alfa.exe"
}

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const filePath = path.join(__dirname, '../public/')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
// Setup statisk folder (public folder)
app.use(express.static(publicDirectoryPath))
//express session exstension
app.use(session({
    //bliver sat fra enviroment variable
    //secret: process.env.SESSION_SECRET,
    secret: "hemmelighed",
    //siden vi aldrig ændre på Enviroment variablerne aldrig skal ændre sig
    resave: false,
    //Vi vil ikke gemme en tom variable for denne session; true
    saveUninitialized: true
}))
//bruges til at overskrive f.eks. Delete 
app.use(methodOverride('_method'))
//Middelware bliver kørt imellem req og res. Sætter locals til at være authenticated.
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})
//URL endcoded, gemmer URL info i siden, så det ikke ses af brugeren
app.use(bodyParser.urlencoded({ extended: true }))

//passport local configure:

app.use(passport.initialize())
app.use(passport.session())

//Strategien kræver en 'verify' funktion som modtager ('username' og 'password')
//fra brugeren. Funktionen skal verificere at password er korrekt, og returnere cb (call back) med et userobject
// som bliver sat ind ved 'req.user' route handlers efter authentication.
passport.use(new Strategy(
    function (username, password, cb) {
        functions.findByUsername(username, function (err, user) {
            if (err) { return cb(err) }
            if (!user) { return cb(null, false) }
            if (user.password != password) { return cb(null, false) }
            return cb(null, user)
        });
    }));

//sørger for at indsætte users ind i session (sætte id ind i session)
passport.serializeUser(function (user, cb) {
    cb(null, user.id)
})
//sørger for at fjerne users i session (ud fra id)
passport.deserializeUser(function (id, cb) {
    functions.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

//CRUD (create, update, delete)
//Register
app.get('/register', functions.checkNotAuthenticated, (req, res) => {

    res.render('register', {
        title: 'Register'
    })
})

app.post('/register', functions.checkNotAuthenticated, (req, res) => {
    try {
        let userId = functions.getLastUserId() + 1
        let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music, req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate]

        functions.addUser(userId, req.body.username, req.body.email, req.body.password)
        functions.createAccInfo(userId,parameterarray)

        res.redirect('/matchfound')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/register')
    }

})
app.get('/editUser', functions.checkAuthenticated, (req, res) => {
    let usrTxt = functions.accountInfoCheck(req.user.id)
    //let usrAcc = getUserAccounts(req.user.id, null)

    res.render('editUser', {
        title: 'Edit User',
        userobj: usrTxt
    })
})
app.post('/saveUser',functions.checkAuthenticated,(req, res) => {

    let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music, req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate, req.body.password,req.body.username,req.body.email]
    functions.SaveAccInfo(req.user.id,parameterarray)

    res.redirect('/matchfound')
})

app.post('/editUser', functions.checkAuthenticated, (req, res) => {
    try {
        res.redirect('/editUser')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/editUser')
    }

})

//Login / Logout
app.get('/', functions.checkNotAuthenticated, (req, res) => {
    res.render('loginpage', {
        title: 'Login'
    })
})
//1
app.post('/loginpage', functions.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/matchfound',
    failureRedirect: '/'
}))

app.delete('/logout', functions.checkAuthenticated, (req, res) => {
    //Logger ud (en function fra passport der rydder op i session)
    req.logOut()
    req.session.knn = 3
    res.redirect('/')
})

app.get('/matchfound', functions.checkAuthenticated, (req, res) => {
    let user = functions.getUserCheck(req.user.id, null)
    let knn = 3
    if (req.session.knn > 3){
        knn = req.session.knn
    }
    try{
        if(user) {
            let displayMatches = functions.printMatches(cFilSti, req.user.id, knn, knn -3)
            let userChats = functions.getPersonalUserChats(req.user.id)
            let boolean = functions.knnButtonChecker(knn)
            if(knn >= functions.getLastUserId()-3 || knn < 3){
                res.render('matchfound', {
                    title: 'Match found',
                    loggedIn: true,
                    userShown: false, //fjerner 'start chat'-knappen, fordi der ikke vises en bruger
                    buttonCheck: boolean,
                    username: req.user.username,
                    chats: userChats
                })
            } else {
                let usrTxt1 = functions.accountInfoCheck(displayMatches[0].id)
                let usrTxt2 = functions.accountInfoCheck(displayMatches[1].id)
                let usrTxt3 = functions.accountInfoCheck(displayMatches[2].id)
                res.render('matchfound', {
                    title: 'Match found',
                    loggedIn: true,
                    userShown: true, //viser 'start chat'-knappen når der er en bruger at vise
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
                    chats: userChats
                })
            }
            
        } else {
            res.redirect('/createaccinfo')
        }
     } catch (e) {
         console.log('!ERROR! - Har du husket at compilere alfa.c?')
         res.render('404', {
             title: '404',
             errorMessage: 'Could not find page'
         })
     }
})

app.post('/showPreviousMatches', (req, res) => {
    if(req.session.knn > 3){
        req.session.knn -= 3
    }
    res.redirect('/matchfound')
})

app.post('/showMoreMatches', (req, res) => {
    if (req.session.knn === undefined){
        req.session.knn = 3
    }
    if(req.session.knn < functions.getLastUserId()-3){
        req.session.knn += 3
    }
    res.redirect('/matchfound')
    
})

app.get('/:room', functions.checkAuthenticated, (req, res) => {

    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    let intrestChat = functions.calcUserParameters(req.params.room)
    try{
        let chatHistory = functions.getChatHistory(req.session.roomid)

        res.render('room', {
            userName: req.user.username,
            roomName: req.params.room,
            username2: req.session.username,
            chatData: chatHistory,
            intrestChat : intrestChat,
            onChatsite: true
        })
    }catch(e){
        let chatHistory = functions.getChatHistory(req.params.room)
        res.render('room', {
            userName: req.user.username,
            roomName: req.params.room,
            username2: req.session.username,
            chatData: chatHistory,
            intrestChat : intrestChat,
            onChatsite: true
        })
    }
})


//Rooms
app.post('/room', functions.checkAuthenticated, (req, res) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }
    let username2 = req.body.username2
    req.session.username = username2.toString()
    let roomId = functions.checkChat(req.user.id, req.body.room)
    req.session.roomid = roomId
    if (roomId == false) {
        let user1 = functions.getUserAccounts(null, req.user.username).id
        let user2 = functions.getUserAccounts(null, username2).id

        functions.makeFirstChat(user1, user2)
        roomId = functions.checkChat(req.user.id, req.body.room)
    }
    //Henter "room" data fra index og holder data på users
    rooms[roomId] = { users: {} }
    //Redirektor dem til det nye room
    res.redirect(roomId)
    
})
//Post der redirecter brugeren fra chat til matchfound via knap
app.post('/goToMatchfound', (req, res) => {
    res.redirect('/matchfound')
})
//Første gang bruger loader hjemmeside -> kalder funktion og giver dem et socket
io.on('connection', socket => {
    //Funktion bliver kaldt i "scripts.js"
    socket.on('new-user', (room, name) => {
        try {
            socket.join(room)
            //Sammensætter navn på bruger med socket id
            rooms[room].users[socket.id] = name
            //Sender event 'user-connected' med besked "name" -> broadcast gør så brugeren ikke selv får det
            socket.broadcast.to(room).emit('user-connected', name)
        } catch (e) {
            console.log(e)
        }
    })
    //Aktivere når eventen sker "Send-chat-message" med data "room" "message"
    socket.on('send-chat-message', (room, message, username1, username2) => {
        try {
            let userConnection = functions.getRoomConnection(room)
            let user1 = functions.getUserAccounts(null, username1).id
            let user2 = functions.getUserAccounts(null, username2).id
            functions.saveChat(room, user1, user2, username1, message)
            //Sender beskeden til alle undtagen brugeren som sender den selv "broadcast" gør så brugeren ikke selv modtager
            socket.broadcast.to(room).emit('chat-message', {
                //Laver et objekt til at holde dataen på beskeden
                message: message,
                //Tilføjer navnet til objeket via socket.id
                name: rooms[room].users[socket.id]
            })
        } catch (e) {
            console.log(e)
        }
    })
    //Aktivere når en disconnecter -> socket funktion
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            try {
                //Sender ud at brugeren er disconnected
                socket.broadcast.to(room).emit('user-disconnected', rooms[room].users[socket.id])
                //Sletter brugeren && bruger id
                delete rooms[room].users[socket.id]
            } catch (e) {
                console.log(e)
            }
        })
    })
})
function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names
    }, [])
}

// 404
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Could not find page'
    })
})

//Module export
module.exports = server