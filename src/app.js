const path = require('path')
const express = require('express')
const hbs = require('hbs')
const functions = require('./functions')
const bodyParser= require('body-parser')

//makes express app
const app = express()
const c_fil_sti = "alfa.exe"

let Users = []

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const filePath = path.join(__dirname, '../public/')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

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
//


//CRUD (create, update, delete )
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

app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register'
    })
})

app.post('/register', (req, res) => {
    Users[0] = req.body.username
    Users[1] = req.body.email
    Users[2] = req.body.password
    console.log(Users)
})

app.get('', (req, res) => {
    res.render('loginpage', {
        title: 'Login',
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

