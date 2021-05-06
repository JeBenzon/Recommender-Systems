const cp = require('child_process')
const fs = require('fs')

const usersAccountPath = 'generated_users/acc_100k.json'
const usersInterestsPath = 'generated_users/users_100k.txt'


//=====BASIC FUNCTIONS=====//

// Sender en komando til konsollen og returnere output som string format.
function sendConsoleCommand(programPath, parameters) {
    try {
        let par = parameters.split(" ")
        const { stdout, stderr } = cp.spawnSync(programPath, [par[0], par[1], par[2]])
        return stdout.toString()
    } catch (e) {
        console.log('C kommunikations fejl errorcode:' + e)
        return false
    }
}

// Omdanner tekst til JSON format
function textToJSON(text) {
    try {
        let data = JSON.parse(text)
        return data
    } catch (e) {
        console.log('String was not JSON formatted ' + e)
    }
    return false
}

//læser fil og giver string output
function getData(path) {
    const data = fs.readFileSync(path, 'utf8')
    return data
}






//=====CHAT FUNCTIONS=====//

function getChat(id) {
    let data = fs.readFileSync(`rooms/room${id}.json`)
    let chats = textToJSON(data)

    return chats
}
//returnere en room connection 
function getRoomConnection(id) {
    let roomConnection = getData('rooms/roomConnections.json')
    let roomConnectionObject = textToJSON(roomConnection)

    for (let i = 0; i < roomConnectionObject.length; i++) {
        //console.log(roomConnectionObject)
        if (id == roomConnectionObject[i].id) {
            let roomConnection = {
                id: roomConnectionObject[i].id,
                userID1: roomConnectionObject[i].userID1,
                userID2: roomConnectionObject[i].userID2
            }
            return roomConnection
        }
    }
    return false
}

//finder alle de chats en bruger har med andre brugere, og returnere dem i et array.
function getPersonalUserChats(userid) {
    let roomConnection = getData('rooms/roomConnections.json')
    let roomConnectionObject = textToJSON(roomConnection)

    let personalUserChats = []
    for (let i = 0; i < roomConnectionObject.length; i++) {
        //userID1
        if (roomConnectionObject[i].userID1 == userid) {
            let userObj = {
                name: getUserAccounts(roomConnectionObject[i].userID2).username,
                id: roomConnectionObject[i].userID2
            }
            personalUserChats.push(userObj)
            //userID2
        } else if (roomConnectionObject[i].userID2 == userid) {
            let userObj = {
                name: getUserAccounts(roomConnectionObject[i].userID1).username,
                id: roomConnectionObject[i].userID1
            }
            personalUserChats.push(userObj)
        }
    }
    return personalUserChats
}
//Henter chat historien
function getChatHistory(roomid) {
    return (getChat(roomid).chat)
}

//Funktion der tjekker om 2 brugere har et chatroom, og hvis de er returnere den room id
function checkChat(userID1, userID2) {
    let roomConnection = getData('rooms/roomConnections.json')
    let roomConnectionObject = textToJSON(roomConnection)

    for (let i = 0; i < roomConnectionObject.length; i++) {
        if (userID1 == roomConnectionObject[i].userID1 && userID2 == roomConnectionObject[i].userID2 ||
            userID1 == roomConnectionObject[i].userID2 && userID2 == roomConnectionObject[i].userID1) {
            return roomConnectionObject[i].id
        }
    }
    return false
}

//skal både oprette chat i RoomConnection og oprette et room med det rigtige room id og info
function makeFirstChat(uID1, uID2) {
    //Check om brugere allerede har en chat.
    let room = {
        id: parseInt(Date.now() + Math.random()),
        userID1: uID1,
        userID2: uID2,
    }

    let roomConnection = getData('rooms/roomConnections.json')
    let roomConnectionObject = textToJSON(roomConnection)
    roomConnectionObject.push(room)
    jsonUsers = JSON.stringify(roomConnectionObject, null, 2)
    fs.writeFileSync('rooms/roomConnections.json', jsonUsers, "utf-8")
    saveChat(room.id, uID1, uID2)
}

//Gemmer en chat til et bestemt room imellem 2 brugere
function saveChat(id, uID1, uID2, uName, uMessage) {
    let chat
    //Så her forsøger vi at finde rummet med brugernes chats.
    //Brugerne har måske et rum, hvis det er oprettet en "connection" imellem dem.
    //Hvis de findes, så går vi i try, ellers i catch.
    try {
        //prøver at hente room filen
        let data = fs.readFileSync(`rooms/room${id}.json`)
        chatObj = textToJSON(data)

        chatToAppend = {
            name: uName,
            message: uMessage
        }

        chatObj.chat.push(chatToAppend)
        jsonChat = JSON.stringify(chatObj, null, 2)
        fs.writeFileSync(`rooms/room${id}.json`, jsonChat, "utf-8")
    } catch (e) {
        let id = checkChat(uID1, uID2)
        if (id) {
            chat = {
                id: id,
                userID1: uID1,
                userID2: uID2,
                username1: getUserAccounts(uID1, null).username,
                username2: getUserAccounts(uID2, null).username,
                chat: [ 
                ]
            }
            //opretter hvis filen ikke eksistere
            jsonChat = JSON.stringify(chat, null, 2)
            fs.writeFileSync(`rooms/room${id}.json`, jsonChat, "utf-8")
        } else {
            console.log("Der skete en fejl!, Der fandtes ikke 2 brugere med et room")
        }
    }
}

//Udregner hvilken interesser 2 brugere har tilfælles
function calcUserParameters(id) {
    let roomConnect = getRoomConnection(id)

    let user1para = accountInfoCheck(roomConnect.userID1)
    let user2para = accountInfoCheck(roomConnect.userID2)

    let user1sum = (+user1para.art + +user1para.climate + +user1para.food + +user1para.movies + +user1para.outdoors + +user1para.sports + +user1para.music + +user1para.science + +user1para.travel)
    let user2sum = (+user2para.art + +user2para.climate + +user2para.food + +user2para.movies + +user2para.outdoors + +user2para.sports + +user2para.music + +user2para.science + +user2para.travel)

    let artComp = (user1para.art / user1sum) * (user2para.art / user2sum)
    let climateComp = (user1para.climate / user1sum) * (user2para.climate / user2sum)
    let foodComp = (user1para.food / user1sum) * (user2para.food / user2sum)
    let moviesComp = (user1para.movies / user1sum) * (user2para.movies / user2sum)
    let outdoorsComp = (user1para.outdoors / user1sum) * (user2para.outdoors / user2sum)
    let sportComp = (user1para.sports / user1sum) * (user2para.sports / user2sum)
    let musicComp = (user1para.music / user1sum) * (user2para.music / user2sum)
    let scienceComp = (user1para.science / user1sum) * (user2para.science / user2sum)
    let travelComp = (user1para.travel / user1sum) * (user2para.travel / user2sum)

    let arrayComp = [sportComp, foodComp, musicComp, moviesComp, artComp, outdoorsComp, scienceComp, travelComp, climateComp]

    let max = arrayComp[0]
    let maxIndex = 0

    for (let i = 0; i < arrayComp.length; i++) {
        if (arrayComp[i] > max) {
            maxIndex = i
            max = arrayComp[i]
        }
    }
    let intrestMessage = chatMessage(maxIndex)

    return intrestMessage
}

//Returnere den rette besked, ud fra hvad calc_user_parameters
function chatMessage(index) {
    let paraMessage = ""
    switch (index) {
        case 0:
            paraMessage = "I har begge vist interesse for sport - Hvad er jeres yndlings sport?";
            break;
        case 1:
            paraMessage = "I har begge vist interesse for mad - Hvad er jeres yndlings ret?";
            break;
        case 2:
            paraMessage = "I har begge vist interesse for kunst - Hvad er jeres yndlings kunstner";
            break;
        case 3:
            paraMessage = "I har begge vist interesse for film - Hvad er jeres yndlings film?";
            break;
        case 4:
            paraMessage = "I har begge vist interesse for musik - Hvad er jeres yndlings genre?";
            break;
        case 5:
            paraMessage = "I har begge vist interesse for udendør afktiviteter - Hvad er jeres yndlings udendørs aktivitet?";
            break;
        case 6:
            paraMessage = "I har begge vist interesse for videnskab - Hvad er jeres yndlings grundstof?";
            break;
        case 7:
            paraMessage = "I har begge vist interesse for rejse - Hvad er jeres drømme rejsemål?";
            break;
        case 8:
            paraMessage = "I har begge vist interesse for klimaet - Hvorfor er klimaet vigtigt for dig?";
            break;
    }
    return paraMessage
}






//=====LOGIN FUCNTIONS=====//

//taget fra WebDevSimplified Node passport login projekt. 
//Credit: https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/server.js
//tjekker om en bruger er authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}
//TODO find ud af hvad next() gør
//Tjekker om en bruger IKKE er authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/matchfound')
    }
    next()
}






//=====USER FUNCTIONS=====//

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

// Tjekker om bruger eksistere i både users_account.json og users.text
function getUserCheck(id) {
    let userAcc = getUserAccounts(id, null)
    let userInfo = accountInfoCheck(id)

    if (userAcc && userInfo) {
        return userAcc
    }
    return false
}

//Giver det sidste id i userAccountPath
function getLastUserId() {
    let data = getData(usersAccountPath)
    let users = textToJSON(data)

    return users[users.length - 1].id
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
        })
        return true
    } catch (e) {
        console.log('Der skete en fejl ved tilføjelse af bruger til fil')
        return false
    }
}

//Gemmer en bruger i både usersInterestsPath og usersAccountPath når efter man har oprettet sig.
function SaveAccInfo(id, parameters) {
    let txtFile = getData(usersInterestsPath)
    if (!(parameters[0].length < 50 && parameters[1] >= 0 && parameters[1] <= 125 && parameters[2].length == 1)) {
        return false
    }
    for (let i = 3; i <= 11; i++) {
        if (!(parameters[i] <= 11 && parameters[i] >= 0)) {
            return false
        }
    }
    try {
        let register = `${id} ${parameters[0]} ${parameters[1]} ${parameters[2]} ${parameters[3]} ${parameters[4]} ${parameters[5]} ${parameters[6]} ${parameters[7]} ${parameters[8]} ${parameters[9]} ${parameters[10]} ${parameters[11]}`
        // break the textblock into an array of lines
        let lines = txtFile.split('\n')
        // remove one line, starting at the first position
        lines.splice(id - 1, 1, register)
        for (let i = 0; i < lines.length - 1; i++) {
            lines[i] += "\n"
        }
        let linestring = lines.join("")
        fs.writeFileSync(usersInterestsPath, linestring, function (err) {
            if (err) throw err;
        })
        let userobj = {
            id: id,
            username: parameters[13],
            email: parameters[14],
            password: parameters[12],
        }
        let jsonUsers = fs.readFileSync(usersAccountPath, "utf-8")
        let users = JSON.parse(jsonUsers)

        users[id - 1] = userobj

        jsonUsers = JSON.stringify(users, null, 2)
        fs.writeFileSync(usersAccountPath, jsonUsers, "utf-8")

        return true

    } catch (e) {
        console.log('Der skete en fejl ved tilføjelse af bruger til fil' + e)
        return false
    }
}

//Tjekker om user eksistere i users.txt 
function accountInfoCheck(id) {
    try {
        const datajson = getData(usersAccountPath)
        let jsonstring = textToJSON(datajson.toString())
        const datatxt = getData(usersInterestsPath)
        let lines = datatxt.split("\n")
        for (let i = 0; i < lines.length; i++) {
            let useridWord = lines[i].split(" ")
            if (useridWord[0] == id) {
                let usertxtObj = {
                    id: useridWord[0],
                    name: useridWord[1],
                    age: useridWord[2],
                    gender: useridWord[3],
                    sports: useridWord[4],
                    food: useridWord[5],
                    music: useridWord[6],
                    movies: useridWord[7],
                    art: useridWord[8],
                    outdoors: useridWord[9],
                    science: useridWord[10],
                    travel: useridWord[11],
                    climate: useridWord[12],
                    email: jsonstring[i].email,
                    username: jsonstring[i].username,
                    password: jsonstring[i].password
                }
                return usertxtObj
            }
        }
    } catch (e) {
        console.error(e)
    }
    return false
}

//Tilføjer bruger til usersAccountPath
//Dette er ikke en asynkron funktion, hvilket gør det svære at tilføje to brugere med samme ID
function addUser(uID, uUsername, uEmail, uPassword) {
    try {
        let userobj = {
            id: uID,
            username: uUsername,
            email: uEmail,
            password: uPassword,
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

//Denne funktion finder en bruger udfra et ID
//Vi har gået ud fra dette github eksempel: 
//Credit: https://github.com/passport/express-4.x-local-example 
//Funktioner fra passport, som vi har omskrevet til at benytte nogle af vores egne funktioner
function findById(id, cb) {
    //Køres i næste Iteration af js Event Loop, nextTick tager funktion som parameter.
    process.nextTick(function () {
        let user = getUserAccounts(id, null)
        if (user) {
            cb(null, user)
        } else {
            cb(new Error('User ' + id + ' does not exist'))
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






//=====MATCH FUNCTIONS=====//

//Bruges til at spørge om knn er mindre end 3
function knnButtonChecker(knn) {
    if (knn <= 3) {
        return false
    }
    return true
}

//Returnere de rigtige matches ud fra hvilken 'side' man skal stå på i matchfound
function printMatches(programPath, targetUser, knn, index) {
    let matches = sendConsoleCommand(programPath, `getmatch ${targetUser} ${knn}`).split(" ")
    let displayMatches = []
    let l = 0

    if (knn <= getLastUserId() - 3 && knn >= 3) {
        for (let i = index; i < index + 3; i++) {
            displayMatches[l] = getUserCheck(matches[i], null)
            l++
        }
    }
    return displayMatches
}






//=====MODULE EXPORTS=====//

module.exports = {
    //BASIC FUNCTIONS
    sendConsoleCommand,
    textToJSON,
    getData,

    //CHAT FUNCTIONS
    getChat,
    getRoomConnection,
    getPersonalUserChats,
    getChatHistory,
    checkChat,
    makeFirstChat,
    saveChat,
    calcUserParameters,
    chatMessage,

    //LOGIN FUNCTIONS
    checkAuthenticated,
    checkNotAuthenticated,

    //USER FUNCTIONS
    getUserAccounts,
    getUserCheck,
    getLastUserId,
    createAccInfo,
    SaveAccInfo,
    accountInfoCheck,
    addUser,
    findById,
    findByUsername,

    //MATCH FUNCTIONS
    knnButtonChecker,
    printMatches

}

