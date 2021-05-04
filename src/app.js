const path = require('path')
const express = require('express')
const hbs = require('hbs')
const functions = require('./functions')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
let Strategy = require('passport-local').Strategy
const app = express()
const ensureLogin = require('connect-ensure-login')
const bodyParser = require('body-parser')
const {SaveAccInfo} = require("./functions");
const {getUserAccounts} = require("./functions");
const {accountInfoCheck} = require("./functions");
const { emit } = require('process')
const server = require('http').Server(app) //Giver us en "Server der kan kommunikere med socket.io"
const io = require('socket.io')(server) //Laver server på port "server"

const rooms = {} //Vores rooms

//Windows: "alfa.exe", Linux: "./a.out"
const c_fil_sti = "alfa.exe"

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const filePath = path.join(__dirname, '../public/')

// Middleware
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(bodyParser.urlencoded({ extended: false }));
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
//express flash exstension, der kan håndtere beskeder /:messages
app.use(flash())
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
app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})
app.use(express.json())
//app.use(require('morgan')('combined'));
app.use(bodyParser.urlencoded({ extended: true }))

//passport local configure:

app.use(passport.initialize())
app.use(passport.session())

//Strategien kræver en 'verify' funktion som modtager ('username' og 'password')
//fra brugeren. Funktionen skal verificere at password er korrekt, og returnere cb (call back) med et userobject
// som bliver sat in ved 'req.user' route handlers efter authentication.
passport.use(new Strategy(
    function (username, password, cb) {
        functions.findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            //let hashedPass = functions.passwordConverter(password)
            //console.log(password + '' + username + '' + hashedPass)
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));

//sørger for at indsætte users ind i session (sætte id ind i session)
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
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
        //hasher password
        //const hashedPass = await bcrypt.hash(req.body.password, 10)
        let userId = functions.getLastUserId() + 1
        let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music, req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate]

        functions.addUser(userId, req.body.username, req.body.email, req.body.password)
        functions.createAccInfo(userId,parameterarray)

        res.redirect('/matchfound')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/register')
    }
    //console.log(users)

})
//TODO Vi nåede her til:
app.get('/editUser', functions.checkAuthenticated, (req, res) => {
    let usrTxt = accountInfoCheck(req.user.id)
    //let usrAcc = getUserAccounts(req.user.id, null)

    res.render('editUser', {
        title: 'Edit User',
        userobj: usrTxt
    })
})
app.post('/matchfound',functions.checkAuthenticated,(req, res) => {

    let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music, req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate, req.body.password,req.body.username,req.body.email]
    functions.SaveAccInfo(req.user.id,parameterarray)

    res.redirect('/matchfound')
})

app.post('/editUser', functions.checkAuthenticated, (req, res) => {
    try {
        //hasher password
        //const hashedPass = await bcrypt.hash(req.body.password, 10)
        //TODO updateuser and accInfo
        //functions.addUser(userId, req.body.username, req.body.email, req.body.password)
        //functions.createAccInfo(userId,parameterarray)

        res.redirect('/editUser')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/editUser')
    }
    //console.log(users)

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
    //knn = 3
})

app.get('/matchfound', functions.checkAuthenticated, (req, res) => {
    let user = functions.getUserCheck(req.user.id, null)
    let knn = 3
    if (req.session.knn > 3){
        knn = req.session.knn
    }
    //try{
        if(user) {
            let display_matches = functions.printMatches(c_fil_sti, req.user.id, knn, knn -3)
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
                let usrTxt1 = accountInfoCheck(display_matches[0].id)
                let usrTxt2 = accountInfoCheck(display_matches[1].id)
                let usrTxt3 = accountInfoCheck(display_matches[2].id)
                res.render('matchfound', {
                    title: 'Match found',
                    loggedIn: true,
                    userShown: true, //viser 'start chat'-knappen når der er en bruger at vise
                    buttonCheck: boolean,
                    username: req.user.username,
                    userobj1: usrTxt1,
                    userobj2: usrTxt2,
                    userobj3: usrTxt3,
                    matchname1: display_matches[0].username,
                    matchname2: display_matches[1].username,
                    matchname3: display_matches[2].username,
                    match1id: display_matches[0].id,
                    match2id: display_matches[1].id,
                    match3id: display_matches[2].id,
                    chats: userChats
                })
            }
            
        } else {
            //res.send("FEJL, kunne ikke finde bruger")
            res.redirect('/createaccinfo')
        }
    // } catch (e) {
    //     console.log('!ERROR! - Har du husket at compilere alfa.c?')
    //     res.render('404', {
    //         title: '404',
    //         errorMessage: 'Could not find page'
    //     })
    // }
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

app.get('/:room', functions.checkAuthenticated, (req, res) => { //Gør så alt der er et room name, bliver lavet om til et room

    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    functions.calc_user_parameters(req.params.room)
    try{
    let chatHistory = functions.getChatHistory(req.session.roomid)
    
    res.render('room', {
        userName: req.user.username,
        roomName: req.params.room,
        username2: req.session.username,
        chatData: chatHistory
    })
    }catch(e){
        //console.log("No chat history")
        res.render('room', {
            userName: req.user.username,
            roomName: req.params.room,
            username2: req.session.username,
        })
    }
    //console.log(req.session.username)
})

//Rooms
app.post('/room', functions.checkAuthenticated, (req, res) => {
    if (rooms[req.body.room] != null) {
        //console.log(req.body.room)
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
    //console.log(roomId)
    //console.log('Logged ind bruger: ' + req.user.id + 'Chatmed bruger: ' + req.body.room + ' har : chat id:' + roomId)
    //console.log(rooms[roomId])
    rooms[roomId] = { users: {} }
    //rooms[req.body.room] = { users: {} } //Henter "room" data fra index og holder data på users
    res.redirect(roomId) //Redirektor dem til det nye room
    
})



app.get('/testIndex', (req, res) => { //Index patch
    res.render('testindex', { rooms: rooms })
})
/*
app.get('/:room', (req, res) => { //Gør så alt der er et room name, bliver lavet om til et room
    
    res.render('room', { 
        roomName: req.params.room 
    }) //Siger den skal render room med "roomName" der passer til vores room
  })

app.post('/room', (req, res) => {
    
    rooms[req.body.room] = { users: {} } //Henter "room" data fra index og holder data på users
    res.redirect(req.body.room) //Redirektor dem til det nye room
    io.emit('room-created', req.body.room) //Sender besked til andre at nyt room var lavet og vise det
  })*/




io.on('connection', socket => { //Første gang bruger loader hjemmeside -> kalder funktion og giver dem et socket
    socket.on('new-user', (room, name) => { //Funktion bliver kaldt i "scripts.js"
        try {
            socket.join(room)
            rooms[room].users[socket.id] = name //Sammensætter navn på bruger med socket id
            socket.broadcast.to(room).emit('user-connected', name) //Sender event 'user-connected' med besked "name" -> broadcast gør så brugeren ikke selv får det
        } catch (e) {
            console.log(e)
        }
    })
    socket.on('send-chat-message', (room, message, username1, username2) => { //Aktivere når eventen sker "Send-chat-message" med data "room" "message"
        try {
            //TODO her skal vi gemme ned i vores array/filer
            let userConnection = functions.getRoomConnection(room)
            let user1 = functions.getUserAccounts(null, username1).id
            let user2 = functions.getUserAccounts(null, username2).id


            functions.saveChat(room, user1, user2, username1, message)

            socket.broadcast.to(room).emit('chat-message', { //Sender beskeden til alle undtagen brugeren som sender den selv "broadcast" gør så brugeren ikke selv modtager
                message: message, //Laver et objekt til at holde dataen på beskeden
                name: rooms[room].users[socket.id] //Tilføjer navnet til objeket via socket.id
            })
        } catch (e) {
            console.log(e)
        }

    })
    socket.on('disconnect', () => { //Aktivere når en disconnecter -> socket funktion
        getUserRooms(socket).forEach(room => {
            try {
                socket.broadcast.to(room).emit('user-disconnected', rooms[room].users[socket.id]) //Sender ud at brugeren er disconnected
                delete rooms[room].users[socket.id] //Sletter brugeren && bruger id 
            } catch (e) {
                console.log(e)
            }
        })
    })
    /*
    socket.on('load-messages', (room) => { //Aktivere når en disconnecter -> socket funktion
        try {
            console.log("shit")
            let name = "name"
            socket.broadcast.to(room).emit('load-messages', {
                chats: "test"
            }) //Sender event 'user-connected' med besked "name" -> broadcast gør så brugeren ikke selv får det
        } catch (e) {
            console.log(e)
        }
    })*/
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

app.get("/test", (req, res) => {
    try {
        res.status(200).send("Hello World!");
    } catch (e) {
        console.log(e)
    }
});

//Module export
module.exports = server;
