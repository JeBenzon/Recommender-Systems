const path = require('path')
const express = require('express')
const hbs = require('hbs')
const functions = require('./functions')



class User {
    constructor(id, name, gender){
        this.id = id
        this.name = name
        this.gender = gender
    }
}

let Users = [];
Users[0] = new User(1, "Jonathan", "m");
Users[1] = new User(2, "Pelle", "m");
Users[2] = new User(3, "Frederik", "m");

function UserExsist(id){
    for(let i = 0; i < Users.length; i++){
        if(id == Users[i].id){
            return true;
        }
    }
    return false;
}

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const filePath = path.join(__dirname, '../public/')


// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//GET; SET; PUT; DELETE
app.get('/getmatch', (req,res) => {

    
    if(!req.query.matchid) {
        let match = 'Null'
    }
    else if(req.query.matchid){
        match = (functions.textToJSON(functions.sendConsoleCommand('alfainport.exe', `getmatch ${req.query.matchid}`))[0].Username)
    }

    let match = (functions.textToJSON(functions.sendConsoleCommand('alfainport.exe', 'getmatch 2'))[0].Username)
    res.render('getmatch', {
        title: 'Get Match',
        matchname: match
    })
})


app.get('', (req, res) => {
    res.render('loginpage', {
        title: 'login',
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
        title: 'find a match'
    })
})

app.get('/createuser', (req, res) => {
    res.render('createuser', {
        title: 'Create User'
    })
})

app.get('/test', (req, res) => {
    res.render('test', {
        title: 'Test page',
    })
})

app.get('/test/*', (req, res) => {
    res.send('No test result found');
})

app.get('/search', (req, res) => {
    
    if (!req.query.id) {
        return res.send('You must provide a search word')
    }
    console.log(req.query.id)
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

