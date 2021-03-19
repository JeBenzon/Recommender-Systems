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



const initializePassport = require('./passport-config')
initializePassport.initialize(
    passport, 
    email  => users.find(user => user.email === email)
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
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse the raw data
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());

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


let users = []

//CRUD (create, update, delete )
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home page',
    })
})

app.get('/register', (req, res) => {

    res.render('register', {
        title: 'Register'
    })
})

app.post('/register', async (req, res) => {
    //https://github.com/WebDevSimplified/Nodejs-Passport-Login
    try{
        //hasher password med bcrypt
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.username,
            email: req.body.email,
            password: hashedPass
        })
        res.redirect('/loginpage')
    }catch{
        res.redirect('/register')
    }
    console.log(users)

})


app.get('/loginpage', (req, res) => {
    res.render('loginpage', {
        title: 'Login',
    })
})


app.post('/loginpage', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginpage',
    failureFlash: true
}))


app.get('/matchfound', (req,res) => {

    let match = 'Null'
    let user = 'defaultusername'

    if(req.query.userid){
        match = (functions.textToJSON(functions.sendConsoleCommand(c_fil_sti, `getmatch ${req.query.userid}`)))
        user = (functions.textToJSON(functions.sendConsoleCommand(c_fil_sti, `getuser ${req.query.userid}`))[0].Username)
    }
    res.render('matchfound', {
        title: 'Match found',
        username: user,
        matchname1: match[0].Username,
        matchname2: match[1].Username,
        matchname3: match[2].Username,
    })
})

app.get('/matchfound', (req, res) => {
    res.render('matchfound', {
        title: 'Match found'
    })
})

app.get('/mypage', (req, res) => {
    res.render('userpage', {
        title: 'Username'+' page'
    })
})

app.get('/findmorematches', (req, res) => {
    res.render('findmorematches', {
        title: 'Find More Matches'
    })
})

app.get('/findmatch', (req, res) => {
    res.render('findmatch', {
        title: 'Find a match'
    })
})

app.get('/createuser', (req, res) => {
    res.render('createuser', {
        title: 'Create User'
    })
})

app.post('/createuser', (req, res) => {

    console.log(req.body)
    
    if(1){
        console.log("det var sandt")
    }
    functions.createuser(c_fil_sti, "createuser", req.body.name.toString(), parseInt(req.body.age), req.body.gender.toString(), parseInt(req.body.dog), parseInt(req.body.tri), parseInt(req.body.foot), parseInt(req.body.red), parseInt(req.body.yellow), parseInt(req.body.green), parseInt(req.body.blue), parseInt(req.body.spag), parseInt(req.body.pizza))
})

app.get('/search', (req, res) => {
    if (!req.query.id) {
        return res.send('You must provide a search word')
    }
    //console.log(req.query.id)
    if(!UserExsist(req.query.id)){
        return res.send('User does not excist')
    } 
    res.send('id ' + req.query.id + ' excists: with name: ' + Users[req.query.id].name);
})

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

