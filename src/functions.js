const cp = require('child_process')
const { stdout } = require('process')
const fs = require('fs')

const usersAccountPath = 'users_account.json'
const usersInterestsPath = 'users.txt'

//gir command og får string output ud.
function sendConsoleCommand(programPath, parameters) {
    try {
        let par = parameters.split(" ")
        const { stdout, stderr } = cp.spawnSync(programPath, [par[0], par[1], par[2]])
        return stdout.toString()
    } catch (e) {
        console.log('C kommunikations fejl errorcode:' + e)
    }
}

//function der tager string output og laver til json
function textToJSON(text) {
    try {
        let data = JSON.parse(text)
        return data
    } catch (e) {
        console.log('String was not JSON formatted ' + e)
    }
    return false
}

// Tjekker om bruger eksistere i både users_account.json og users.text
function getUserCheck(id) {
    let userAcc = getUserAccounts(id, null)
    let userInfo = accountInfoCheck(id)

    if (userAcc && userInfo) {
        return userAcc
    }
    return false
}

// Tjekker om user eksistere i users_account.json
function getUserAccounts(id, username) {
    try {
        const data = getData(usersAccountPath)
        //users indeholder alle brugeren
        let users = textToJSON(data.toString())
        //finde ud af om der endten eksistere et id der matcher eller et navn der matcher.
        for (let i = 0; i < users.length; i++) {
            if (id != null) {
                if (users[i].id == id) {
                    return users[i]
                }
            } else if (username != null) {
                if (users[i].username == username) {
                    return users[i]
                }
            }
        }
    } catch (e) {
        console.error(e)
    }
    return false
}

//Tjekker om user eksistere i users.txt 
function accountInfoCheck(id) {
    try {
        const data = getData(usersInterestsPath)
        let lines = data.split("\n")
        for (let i = 0; i < lines.length; i++) {
            let useridWord = lines[i].split(" ")[0]
            if (useridWord == id) {
                return true
            }
        }
    } catch (e) {
        console.error(e)
    }
    return false
}

//læser fil og giver string output
function getData(path) {
    const data = fs.readFileSync(path, 'utf8')
    return data;
}

//Giver det sidste id i userAccountPath
function getLastUserId() {
    let data = getData(usersAccountPath)
    let users = textToJSON(data)

    return users[users.length - 1].id
}

/*
// Cryptere password
async function passwordConverter(password) {
    return hashedPass = await bcrypt.hash(password, 10)
}*/


//add Users to files 
//Dette er ikke en asynkron funktion, hvilket gør det svære at tilføje to brugere med samme ID
function addUser(u_id, u_username, u_email, u_password) {

    try {
        let userobj = {
            id: u_id,
            username: u_username,
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
    } catch (e) {
        console.log('Der skete en fejl ved tilføjelse af bruger til json_fil')
        return false
    }
}
//Funktionen skriver brugeroplysninger fra brugeren til vores textfil
function createAccInfo(id, parameters) {
    if (!(parameters[0].length < 50 && parameters[1] >= 0 && parameters[1] <= 125 && parameters[2].length == 1)) {
        return false
    }
    for (let i = 3; i <= 11; i++) {
        if (!(parameters[i] <= 11 && parameters[i] >= 0)) {
            return false
        }
    }
    try {
        let register = `\n${id} ${parameters[0]} ${parameters[1]} ${parameters[2]} ${parameters[3]} ${parameters[4]} ${parameters[5]} ${parameters[6]} ${parameters[7]} ${parameters[8]} ${parameters[9]} ${parameters[10]} ${parameters[11]}`

        fs.appendFile(usersInterestsPath, register, function (err) {
            if (err) throw err;
        });
        return true
    } catch (e) {
        console.log('Der skete en fejl ved tilføjelse af bruger til fil')
        return false
    }
}

function printMatches(programPath, target_user, knn, index){
    let matches = sendConsoleCommand(programPath, `getmatch ${target_user} ${knn}`).split(" ")
    let display_matches = []
    let l = 0

    if (knn <= getLastUserId()-3 && knn >= 3){
        for (let i = index; i < index +3; i++){
            display_matches[l] = getUserCheck(matches[i], null)
            l++            
        }
    }

    return display_matches
}

//Vi har gået ud fra dette github eksempel: 
//Credit: https://github.com/passport/express-4.x-local-example 
//Funktioner fra passport, som vi har omskrevet til at benytte nogle af vores egne funktioner
//Denne funktion finder en bruger udfra et ID
function findById(id, cb) {
    //Køres i næste Iteration af js Event Loop, nextTick tager funktion som parameter.
    process.nextTick(function () {
        let user = getUserAccounts(id, null)
        if (user) {
            cb(null, user)
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    })
}

//Finder en bruger ud fra et username
function findByUsername(username, cb) {
    process.nextTick(function () {
        let user = getUserAccounts(null, username)
        if (user) {
            return cb(null, user)
        }
        return cb(null, null)
    })
}
//taget fra WebDevSimplified Node passport login projekt. 
//Credit: https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/server.js
//tjekker om en bruger er authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/')
}
//Tjekker om en bruger IKKE er authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/matchfound')
    }
    next()
}



module.exports = {
    sendConsoleCommand,
    textToJSON,
    createAccInfo,
    checkAuthenticated,
    checkNotAuthenticated,
    getUserAccounts,
    getUserCheck,
    accountInfoCheck,
    addUser,
    getData,
    findById,
    findByUsername,
    getLastUserId,
    printMatches
}

