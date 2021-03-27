//Loader procces variables ind og sætter dem i process.env (enviroment variabler som f.eks vores salt/secret)
/*if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}*/

const path = require('path')
const express = require('express')
const hbs = require('hbs')
const functions = require('./functions')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

let users = []

const initializePassport = require('./passport-config')

initializePassport.initialize(
    passport, 
    email  => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)


//makes express app
const app = express()
const c_fil_sti = "alfa.exe"

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const filePath = path.join(__dirname, '../public/')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//APP.USE EXSTENTIONS

// parse application/x-www-form-urlencoded
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
    //Vi vil ikke gemme en tom variable for denne session; false
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
//bruges til at overskrive f.eks. Delete 
app.use(methodOverride('_method'))

app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
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
    try{
        //hasher password med bcrypt
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        //Communikation til Userfile/C 
        users.push({
            id: Date.now().toString() + '' + Math.floor(Math.random() * 10000).toString(),
            name: req.body.username,
            email: req.body.email,
            password: hashedPass
        })
        res.redirect('/')
    }catch{
        res.redirect('/register')
    }
    console.log(users)

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

app.post('/loginpage', 
    functions.checkNotAuthenticated, 
    passport.authenticate('local', {
        successRedirect: '/matchfound',
        failureRedirect: '/',
        failureFlash: true
}))

app.delete('/logout', functions.checkAuthenticated, (req, res) => {
    //Logger ud (en function fra passport der rydder op i session)
    req.logOut()
    res.redirect('/')
})

//Find match
app.get('/findmatch', (req, res) => {
    res.render('findmatch', {
        title: 'Find a match'
    })
})

app.get('/matchfound',functions.checkAuthenticated, (req, res) => {
    let user = functions.usercheck(req.user.id)
    
    

    if(user) {
        
        
        let matches = (functions.sendConsoleCommand(c_fil_sti, `getmatch2 1237`))
        console.log(matches)
        let match = matches.split(" ")
        console.log(req.user.name)

        let match1 = functions.usercheck(match[0])
        let match2 = functions.usercheck(match[1])
        let match3 = functions.usercheck(match[2])
        
        res.render('matchfound', {
            title: 'Match found',
            username: req.user.name,
            matchname1: match1,
            matchname2: match2,
            matchname3: match3,
        })
        
    } else {
        res.send("FEJL")
    }


})

// 404
app.get('*',(req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Could not find page'
    })
})

// Make the server on port 3000
app.listen(3000, () => {
    console.log("Server startet on port 3000");
})

