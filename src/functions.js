const cp = require('child_process');
const { stdout } = require('process');
const fs = require('fs')

const usersAccountPath = 'users_account.json'
const usersInterestsPath = 'users.txt'

//gir command og får string output ud.
function sendConsoleCommand(programPath, parameters){
    try{
        let par = parameters.split(" ");
        const {stdout, stderr} = cp.spawnSync(programPath, [par[0], par[1]]);
        return stdout.toString()
    }catch(e){
        console.log('C kommunikations fejl errorcode:' + e)
    }
}

//function der tager string output og laver til json
function textToJSON(text){
    let data = JSON.parse(text)
    return data
}

function createuser(programPath, createuser, name, age, gender, dog, triangle, football, red, yellow, green, blue, spaghetti, pizza){
    try{
        cp.exec(`${programPath} ${createuser} ${name} ${age} ${gender} ${dog} ${triangle} ${football} ${red} ${yellow} ${green} ${blue} ${spaghetti} ${pizza}`, (err, stdout, stderr) => {
            
        })
        
    }catch(e){
        console.log('C kommunikations fejl errorcode:' + e)
        return false
    }
    return true
}

//tjekker om en bruger er authenticated
function checkAuthenticated(req, res, next) { 
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/matchfound')
    }
    next()
}

function getUserCheck(id) {

    let user = getUser(id, null)
    if(user && userInterestCheck(id)) {
        //console.log(username)
        return user
    }
    return false
}

function getUser(id, username){
    try {
        const data = getData(usersAccountPath)
        //users indeholder alle brugeren
        let users = textToJSON(data.toString())
    
        //finde ud af om der endten eksistere et id der matcher eller et navn der matcher.
        for(let i = 0; i < users.length; i++) {
            if(id != null){
                if(users[i].id == id){
                    return users[i]
                }
            }else if( username != null) {
                if(users[i].username == username){
                    return users[i]
                }
            }
            
        }
    }catch (e) {
        console.error(e)
    }
    return false
}


function userInterestCheck(id){
    //tjek på users_interests.(id)
    try {
        const data = getData(usersInterestsPath)
        let lines = data.split("\n");
        for(let i = 0; i < lines.length; i++){
            let useridWord = lines[i].split(" ")[0]
            if(useridWord == id){
                return true
            }
        }
    }catch (e) {
        console.error(e)
    }
    return false
}

function getData(path){
    const data = fs.readFileSync(path, 'utf8')
    return data;
}




//add Users to files 
//Dette er ikke en asynkron funktion, hvilket gør det svære at tilføje to brugere med samme ID
function addUser(u_id, u_username, u_email, u_password){

    try{
        let userobj = {
            id: u_id,
            name: u_username,
            email: u_email,
            password: u_password,
        }

        let jsonUsers = fs.readFileSync(usersAccountPath, "utf-8")
        let users = JSON.parse(jsonUsers)

        users.push(userobj)
        //stringify tager value, replacer og spacer. (replacer er null)
        jsonUsers = JSON.stringify(users, null, 2)

        fs.writeFileSync(usersAccountPath, jsonUsers, "utf-8")
        return true
    } catch(e){
        console.log('Der skete en fejl ved tilføjelse af bruger til json_fil')
        return false
    }
}

function findById(id, cb){
    process.nextTick(function () {
        let user = getUser(id, null)
        if(user) {
            cb(null, user)
        }else{
            cb(new Error('User ' + id + ' does not exist'));
        }
    })
  }

function findByUsername(username, cb){
    process.nextTick(function () {
        let user = getUser(null, username)
        if(user){
            return cb(null, user)
        }
    
        return cb(null, null)
    })
}

//tjekker om en bruger er authenticated
function checkAuthenticated(req, res, next) { 
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/matchfound')
    }
    next()
}


//console.log(getUser(3, null))
//console.log(getUser(null, "Pelle"))

module.exports = {
    sendConsoleCommand,
    textToJSON,
    createuser,
    checkAuthenticated,
    checkNotAuthenticated,
    getUser,
    getUserCheck,
    userInterestCheck,
    addUser,
    getData,
    findById,
    findByUsername  
}

