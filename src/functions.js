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

function usercheck(userid) {
    //Begge variabler bliver sat til false, for at søge filerne igennem korrekt
    let usersAccountTjek = false;
    let usersInterestTjek = false;
    //tjek på users_account (om de har id'et)
    let username
    try {
        const data = fs.readFileSync(usersAccountPath, 'utf8')
        //users indeholder alle brugeren
        let users = textToJSON(data.toString())
    
        //finde ud af om id eksistere
        for(let i = 0; i < users.length; i++) {
            //console.log("I er " + i)
            if(users[i].id == userid){
                username = users[i].name
                usersAccountTjek = true;
                break;
            }
        }
    }catch (e) {
        console.error(e)
    }
    //tjek på users_interests.(id)
    try {
        const data = fs.readFileSync(usersInterestsPath, 'utf8')
        let lines = data.split("\n");
        for(let i = 0; i < lines.length; i++){
            let useridWord = lines[i].split(" ")[0]
            if(useridWord == userid){
                usersInterestTjek = true
            }
        }
    }catch (e) {
        console.error(e)
    }

    //hvis alt dette findes return true else false.
    if(usersInterestTjek && usersAccountTjek) {
        console.log(username)
        return username
    }
    return false
}



module.exports = {
    sendConsoleCommand,
    textToJSON,
    createuser,
    checkAuthenticated,
    checkNotAuthenticated,
    usercheck
}