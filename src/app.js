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

//Får vist at 
let knn = 3
let index = 0


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

app.post('/register', functions.checkNotAuthenticated, async (req, res) => {
    try {
        //hasher password
        //const hashedPass = await bcrypt.hash(req.body.password, 10)
        let userId = functions.getLastUserId() + 1
        functions.addUser(userId, req.body.username, req.body.email, req.body.password)

        res.redirect('/')
    } catch (e) {
        console.log('Error + ' + e)
        res.redirect('/register')
    }
    //console.log(users)

})

//Create User
app.get('/createaccinfo', functions.checkAuthenticated, (req, res) => {
    //
    if (functions.getUserCheck(req.user.id, null)) {
        res.redirect('/matchfound')
    } else {
        res.render('createaccinfo', {
            title: 'Fill in account information before you can get matches',
            loggedIn: true
        })
    }
})

app.post('/createaccinfo', (req, res) => {
    let parameterarray = [req.body.name, req.body.age, req.body.gender, req.body.sport, req.body.food, req.body.music, req.body.movies, req.body.drinking, req.body.cars, req.body.hiking, req.body.magic, req.body.djing]
    functions.createAccInfo(req.user.id, parameterarray)
    res.redirect('/matchfound')
})

//Login / Logout
app.get('/', functions.checkNotAuthenticated, (req, res) => {
    res.render('loginpage', {
        title: 'Login',
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
    res.redirect('/')
})

app.get('/matchfound', functions.checkAuthenticated, (req, res) => {
    let user = functions.getUserCheck(req.user.id, null)
    if(user) {
        
        display_matches = functions.printMatches(c_fil_sti, req.user.id, knn, index)
        
        res.render('matchfound', {
            title: 'Match found',
            loggedIn: true,
            username: req.user.username,
            matchname1: display_matches[0].username,
            matchname2: display_matches[1].username,
            matchname3: display_matches[2].username,
        })
    } else {
        //res.send("FEJL, kunne ikke finde bruger")
        res.redirect('/createaccinfo')
    }
})

app.post('/matchfound', (req, res) => {
    knn += 3
    index += 3
    res.redirect('/matchfound')
})

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
module.exports = app;
