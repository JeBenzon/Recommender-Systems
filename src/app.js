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
const morgan = require('morgan')
const bodyParser = require('body-parser')
const io = require('socket.io')(4000)



//Windows: "alfa.exe", Linux: "./a.out"
const c_fil_sti = "./a.out"


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

//app.use(require('morgan')('combined'))

//Strategien kræver en 'verify' funktion som modtager ('username' og 'password')
//fra brugeren. Funktionen skal verificere at password er korrekt, og returnere cb (call back) med et userobject
// som bliver sat in ved 'req.user' route handlers efter authentication.
passport.use(new Strategy(
    function (username, password, cb) {
        functions.findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
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


//Chat
app.get('/chat', (req, res) => {
    res.render('chat', {
        title: 'Chat'
    })
})

app.post('/createuser', (req, res) => {

    console.log("Chat123")

})

//CRUD (create, update, delete)
//Register
app.get('/register', functions.checkNotAuthenticated, (req, res) => {

    res.render('register', {
        title: 'Register'
    })
})

app.post('/register', functions.checkNotAuthenticated, async (req, res) => {
    //https://github.com/WebDevSimplified/Nodejs-Passport-Login
    try {
        //hasher password med bcrypt
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        //Communikation til Userfile/C 
        functions.addUser(parseInt(Date.now().toString() + '' + Math.floor(Math.random() * 10000).toString()), req.body.username, req.body.email, hashedPass)
        /*
        users.push({
            id: parseInt(Date.now().toString() + '' + Math.floor(Math.random() * 10000).toString()),
            name: req.body.username,
            email: req.body.email,
            password: hashedPass
        })*/
        res.redirect('/')
    } catch {
        res.redirect('/register')
    }
    //console.log(users)

})

//Create User
app.get('/createuser', (req, res) => {
    res.render('createuser', {
        title: 'Create User'
    })
})

app.post('/createuser', (req, res) => {

    console.log(req.body)

    functions.createuser(c_fil_sti, "createuser", req.body.name.toString(), parseInt(req.body.age), req.body.gender.toString(), parseInt(req.body.dog), parseInt(req.body.tri), parseInt(req.body.foot), parseInt(req.body.red), parseInt(req.body.yellow), parseInt(req.body.green), parseInt(req.body.blue), parseInt(req.body.spag), parseInt(req.body.pizza))
    //redirect
})

//Login / Logout
app.get('/', functions.checkNotAuthenticated, (req, res) => {
    res.render('loginpage', {
        title: 'Login',
    })
})


app.post('/loginpage', functions.checkNotAuthenticated,
    passport.authenticate('local', {
        successRedirect: '/matchfound',
        failureRedirect: '/',
    }))

app.delete('/logout', functions.checkAuthenticated, (req, res) => {
    //Logger ud (en function fra passport der rydder op i session)
    req.logOut()
    res.redirect('/')
})

//Find match
app.get('/findmatch', functions.checkAuthenticated, (req, res) => {
    res.render('findmatch', {
        title: 'Find a match'
    })
})

app.get('/matchfound', functions.checkAuthenticated, (req, res) => {
    let user = functions.getUserCheck(req.user.id)
    if (user) {


        let matches = (functions.sendConsoleCommand(c_fil_sti, `getmatch2 1237`))
        console.log(matches)
        let match = matches.split(" ")
        console.log(req.user.username)

        let match1 = functions.getUserCheck(match[0], null)
        let match2 = functions.getUserCheck(match[1], null)
        let match3 = functions.getUserCheck(match[2], null)


        res.render('matchfound', {
            title: 'Match found',
            username: req.user.username,
            matchname1: match1.username,
            matchname2: match2.username,
            matchname3: match3.username,
        })

    } else {
        res.send("FEJL, kunne ikke finde bruger")
        //res.redirect('/createuser')
    }

})

// 404
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Could not find page'
    })
})

// Make the server on port 3000
app.listen(3000, () => {
    console.log("Server startet on port 3000")
})

io.on('connection', socket => {
    socket.emit('chat-message', 'Hello World')
})

