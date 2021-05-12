
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
    cFilSti = "knn.exe"
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
    //Sender hbs view "register" til brugeren
    res.render('register', {
        title: 'Register'
    })
})
//Opretter en bruger når "submit" bliver trykket på, i webapplikationen.
app.post('/register', functions.checkNotAuthenticated, (req, res) => {
    try {
        let userId = functions.getLastUserId() + 1
        let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music,
                              req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate]

        functions.addUser(userId, req.body.username, req.body.email, req.body.password)
        functions.createAccInfo(userId,parameterarray)
        //Når profilen er oprettet bliver brugeren sendt til matchfound viewet.
        res.redirect('/matchfound')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/register')
    }

})
//Giver brugren mulighed for at ændre i sine oplysninger.
app.get('/editUser', functions.checkAuthenticated, (req, res) => {
    //Laver object med brugerdata og sender det til editUser.hbs viewet.
    let usrTxt = functions.accountInfoCheck(req.user.id)
    res.render('editUser', {
        title: 'Edit User',
        userobj: usrTxt
    })
})
//Gemmer brugerdataen, når brugeren trykker på submit i html.
app.post('/saveUser',functions.checkAuthenticated,(req, res) => {

    let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sports, req.body.food, req.body.music, req.body.movies, req.body.art, req.body.outdoors, req.body.science, req.body.travel, req.body.climate, req.body.password,req.body.username,req.body.email]
    //Overskriver den gamle brugerdata.
    functions.SaveAccInfo(req.user.id,parameterarray)

    res.redirect('/matchfound')
})
//Redirecter til editUser
app.post('/editUser', functions.checkAuthenticated, (req, res) => {
    try {
        res.redirect('/editUser')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/editUser')
    }

})

//Hovedsiden hvor man kan logge ind og ud.
app.get('/', functions.checkNotAuthenticated, (req, res) => {
    res.render('loginpage', {
        title: 'Login'
    })
})
//Hvis brugeren er oprettet bliver den sendt til matchfound ellers blir de sendt tilbage til loginpage.
app.post('/loginpage', functions.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/matchfound',
    failureRedirect: '/'
}))

app.delete('/logout', functions.checkAuthenticated, (req, res) => {
    //Logger ud (en function fra passport der rydder op i session)
    req.logOut()
    //Sætter knn til 3, så man bliver vist de korrekte matches, når man logger ind igen.
    req.session.knn = 3
    res.redirect('/')
})
//Finder matches og viser dem til brugeren.
app.get('/matchfound', functions.checkAuthenticated, (req, res) => {
    let user = functions.getUserCheck(req.user.id, null)
    let knn = 3
    //Henter knn fra session, så brugeren bliver vist det antal matches som brugeren vil se.
    if (req.session.knn > 3){
        knn = req.session.knn
    }
    try{
        if(user) {
            let displayMatches = functions.printMatches(cFilSti, req.user.id, knn, knn -3)
            let userChats = functions.getPersonalUserChats(req.user.id)
            let boolean = functions.knnButtonChecker(knn)
            //Hvis der ikke er flere matches vises de ikke.
            if(knn >= functions.getLastUserId()-3 || knn < 3){
                res.render('matchfound', {
                    title: 'Match found',
                    loggedIn: true,
                    userShown: false, //fjerner 'start chat'-knappen, fordi der ikke vises en bruger
                    buttonCheck: boolean,
                    username: req.user.username,
                    //Sender et array med chats, hvis du har skrevet med personen før.
                    chats: userChats
                })
            } //Viser matches så længe de eksistere
            else {
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
                    //Sender et array med chats, hvis du har skrevet med personen før.
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
//Knap der lader brugeren scrolle igennem matches
app.post('/showPreviousMatches', (req, res) => {
    if(req.session.knn > 3){
        req.session.knn -= 3
    }
    res.redirect('/matchfound')
})
//Knap der lader brugeren scrolle igennem matches
app.post('/showMoreMatches', (req, res) => {
    if (req.session.knn === undefined){
        req.session.knn = 3
    }
    if(req.session.knn < functions.getLastUserId()-3){
        req.session.knn += 3
    }
    res.redirect('/matchfound')
    
})
//Bruger chat rum f.eks URL "/1620380596674"
app.get('/:room', functions.checkAuthenticated, (req, res) => {
    //Hvis rummet ikke findes bliver brugren redierected til startsiden
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    //Udregner fælles interesser mellem brugere
    let intrestChat = functions.calcUserParameters(req.params.room)
    try{
        //Henter gamle chats mellem brugere.
        let chatHistory = functions.getChatHistory(req.session.roomid)

        res.render('room', {
            userName: req.user.username,
            roomName: req.params.room,
            usermatch: req.session.username,
            chatData: chatHistory,
            intrestChat : intrestChat,
            //Viser tilbage knap i viewet når true
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
            //Viser tilbage knap i viewet når true
            onChatsite: true
        })
    }
})


//Sender bruger til et chat rum
app.post('/room', functions.checkAuthenticated, (req, res) => {
    //Hvis rummet ikke findes bliver brugren redierected til startsiden
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }
    //Henter username og gemmer i session.
    let usermatch = req.body.usermatch
    req.session.username = usermatch.toString()
    //Henter ID, hvis chat eksistere og gemmer i session.
    let roomId = functions.checkChat(req.user.id, req.body.room)
    req.session.roomid = roomId
    //Hvis chat ikke eksistere.
    if (roomId == false) {
        //Henter user og matchuser ID og opretter chat
        let user1 = functions.getUserAccounts(null, req.user.username).id
        let user2 = functions.getUserAccounts(null, usermatch).id

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
//Når bruger går ind i en chat -> kalder funktion og giver dem et socket
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
})

// 404
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Could not find page'
    })
})

//Module export
module.exports = server