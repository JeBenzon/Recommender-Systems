const cp = require('child_process')
const fs = require('fs')

const usersAccountPath = 'generated_users/usersAccount.json'
const usersInterestsPath = 'generated_users/users.txt'


//=====BASIC FUNCTIONS=====//

//sends a command to console and returns out as string from standard output
function sendConsoleCommand(programPath, parameters) {
    try {
        let par = parameters.split(" ")
        //Udpakker object ind i stdout, spawnSync sender path og parametre til terminalen.
        const { stdout } = cp.spawnSync(programPath, [par[0], par[1], par[2]])
        return stdout.toString()
    } catch (e) {
        console.log('C kommunikations fejl errorcode:' + e)
        return false
    }
}

//converts text to JSON-format
function textToJSON(text) {
    try {
        let data = JSON.parse(text)
        return data
    } catch (e) {
        console.log('String was not JSON formatted ' + e)
    }
    return false
}

//reads file 'path' and returns string as output
function getData(path) {
    const data = fs.readFileSync(path, 'utf8')
    return data
}

//calls getData and textToJSON to make data into an object
function getDataTextToJSON(path) {
    let data = fs.readFileSync(path)
    return textToJSON(data)
}

//=====CHAT FUNCTIONS=====//

function getChat(roomID) {
    return getDataTextToJSON(`rooms/room${roomID}.json`)
}

//returns a roomConnection object with id, userID1 and userID2
function getRoomConnection(roomID) {
    let roomConnectionObject = getDataTextToJSON('rooms/roomConnections.json')

    for (let i = 0; i < roomConnectionObject.length; i++) {
        if (roomID == roomConnectionObject[i].id) {
            return roomConnectionObject[i]
        }
    }
    return false
}

//finds all the chats a user have with other users, and returns an array of objects {name, id}
function getPersonalUserChats(userID) {
    let roomConnectionObject = getDataTextToJSON('rooms/roomConnections.json')

    let personalUserChats = []
    for (let i = 0; i < roomConnectionObject.length; i++) {
        
        //userID1
        if (roomConnectionObject[i].userID1 == userID) {
            let userObj = {
                name: getUserAccounts(roomConnectionObject[i].userID2).username,
                id: roomConnectionObject[i].userID2
            }
            personalUserChats.push(userObj)
            
            //userID2
        } else if (roomConnectionObject[i].userID2 == userID) {
            let userObj = {
                name: getUserAccounts(roomConnectionObject[i].userID1).username,
                id: roomConnectionObject[i].userID1
            }
            personalUserChats.push(userObj)
        }
    }
    return personalUserChats
}

//gets chat history
function getChatHistory(roomid) {
    return (getChat(roomid).chat)
}

//checks if the two users have a chat room, and returns roomID if it exists
function checkChat(userID1, userID2) {
    let roomConnectionObject = getDataTextToJSON('rooms/roomConnections.json')

    for (let i = 0; i < roomConnectionObject.length; i++) {
        if (userID1 == roomConnectionObject[i].userID1 && userID2 == roomConnectionObject[i].userID2 ||
            userID1 == roomConnectionObject[i].userID2 && userID2 == roomConnectionObject[i].userID1) {
            return roomConnectionObject[i].id
        }
    }
    return false
}

//creates chat in roomConnection as well as a room with the correct room id and info
function makeFirstChat(uID1, uID2) {
    let roomConnectionObject = getDataTextToJSON('rooms/roomConnections.json')

    //check if users already have a chat
    let room = {
        id: parseInt(Date.now() + Math.random()),
        userID1: uID1,
        userID2: uID2,
    }
    roomConnectionObject.push(room)
    let jsonUsers = JSON.stringify(roomConnectionObject, null, 2)
    fs.writeFileSync('rooms/roomConnections.json', jsonUsers, "utf-8")
    saveChat(room.id, uID1, uID2)
}

//saves a chat to the specific room between the two users
function saveChat(roomID, uID1, uID2, uName, uMessage) {
    /*try to get the chat room between users if it exists
    users may have a room if there is created a "connection" between them
    if it exists the 'try' executes, else in 'catch' */
    try {
        //tries to get room file
        let chatObj = getDataTextToJSON(`rooms/room${roomID}.json`)

        let chatToAppend = {
            name: uName,
            message: uMessage
        }

        chatObj.chat.push(chatToAppend)
        let jsonChat = JSON.stringify(chatObj, null, 2)
        fs.writeFileSync(`rooms/room${roomID}.json`, jsonChat, "utf-8")
    } catch (e) {

        //if no chat room exists, creates chat room file
        let id = checkChat(uID1, uID2)
        if (id) {
            let chat = {
                id: id,
                userID1: uID1,
                userID2: uID2,
                username1: getUserAccounts(uID1, null).username,
                username2: getUserAccounts(uID2, null).username,
                chat: [
                ]
            }
            let jsonChat = JSON.stringify(chat, null, 2)
            fs.writeFileSync(`rooms/room${id}.json`, jsonChat, "utf-8")
        } else {
            console.log("Der skete en fejl!, Der fandtes ikke 2 brugere med et room")
        }
    }
}

//calculates which interest two users have most in common
function calcUserParameters(roomID) {

    //get roomConnection based on roomID
    let roomConnect = getRoomConnection(roomID)

    //gets user1 and user2 based on roomConnect
    let user1para = accountInfoCheck(roomConnect.userID1)
    let user2para = accountInfoCheck(roomConnect.userID2)

    //calculates sum of users' parameters
    let user1sum = (+user1para.art + +user1para.climate + +user1para.food + +user1para.movies + 
                    +user1para.outdoors + +user1para.sports + +user1para.music + +user1para.science + 
                    +user1para.travel)
    let user2sum = (+user2para.art + +user2para.climate + +user2para.food + +user2para.movies + 
                    +user2para.outdoors + +user2para.sports + +user2para.music + +user2para.science + 
                    +user2para.travel)
    
    //finds most common interest
    let artComp = (user1para.art / user1sum) * (user2para.art / user2sum)
    let climateComp = (user1para.climate / user1sum) * (user2para.climate / user2sum)
    let foodComp = (user1para.food / user1sum) * (user2para.food / user2sum)
    let moviesComp = (user1para.movies / user1sum) * (user2para.movies / user2sum)
    let outdoorsComp = (user1para.outdoors / user1sum) * (user2para.outdoors / user2sum)
    let sportComp = (user1para.sports / user1sum) * (user2para.sports / user2sum)
    let musicComp = (user1para.music / user1sum) * (user2para.music / user2sum)
    let scienceComp = (user1para.science / user1sum) * (user2para.science / user2sum)
    let travelComp = (user1para.travel / user1sum) * (user2para.travel / user2sum)

    //creates array with interest-values
    let arrayComp = [sportComp, foodComp, musicComp, moviesComp, artComp, outdoorsComp, scienceComp, travelComp, climateComp]

    let max = arrayComp[0]
    let maxIndex = 0

    //finds the largest value in interest-array
    for (let i = 0; i < arrayComp.length; i++) {
        if (arrayComp[i] > max) {
            maxIndex = i
            max = arrayComp[i]
        }
    }
    return chatMessage(maxIndex)
}

//returns the correct message, corresponding to interest found in calcUsersParameters
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
            paraMessage = "I har begge vist interesse for kunst - Hvem er jeres yndlings kunstner";
            break;
        case 3:
            paraMessage = "I har begge vist interesse for film - Hvad er jeres yndlings film?";
            break;
        case 4:
            paraMessage = "I har begge vist interesse for musik - Hvad er jeres yndlings musik genré?";
            break;
        case 5:
            paraMessage = "I har begge vist interesse for udendørs aktiviteter - Hvad er jeres yndlings udendørs aktivitet?";
            break;
        case 6:
            paraMessage = "I har begge vist interesse for videnskab - Hvad er jeres yndlings grundstof?";
            break;
        case 7:
            paraMessage = "I har begge vist interesse for rejse - Hvad er jeres drømme rejsemål?";
            break;
        case 8:
            paraMessage = "I har begge vist interesse for klimaet - Hvorfor er klimaet vigtigt for jer?";
            break;
    }
    return paraMessage
}

//=====LOGIN FUCNTIONS=====//

//taken from WebDevSimplified Node passport login projekt  
//all credit: https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/server.js
//checks if a user is authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        //calls the next middleware function
        return next()
    }
    res.redirect('/')
}

//checks if a user is NOT authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/matchfound')
    }
    next()
}

//=====USER FUNCTIONS=====//

//checks if a user exists in usersAccount.json
function getUserAccounts(id, username) {
    try {
        const data = getData(usersAccountPath)

        //get all user info as string
        let users = textToJSON(data.toString())
        
        //finds out if an id or a name matches
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

//checks if user exists in both 'usersAccount.json' and 'users.txt'
function getUserCheck(id) {
    let userAcc = getUserAccounts(id, null)
    let userInfo = accountInfoCheck(id)

    if (userAcc && userInfo) {
        return userAcc
    }
    return false
}

//returns last id from 'userAccountPath'
function getLastUserId() {
    let users = getDataTextToJSON(usersAccountPath)
    return users[users.length - 1].id
}

//writes user-info from user to text file
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
        let register = `\n${id} ${parameters[0]} ${parameters[1]} ${parameters[2]} ${parameters[3]} 
                          ${parameters[4]} ${parameters[5]} ${parameters[6]} ${parameters[7]} 
                          ${parameters[8]} ${parameters[9]} ${parameters[10]} ${parameters[11]}`
        
        fs.appendFile(usersInterestsPath, register, function (err) {
            if (err) throw err;
        })
        return true
    } catch (e) {
        console.log('Der skete en fejl ved tilføjelse af bruger til fil')
        return false
    }
}

//saves a user in both 'usersInterestsPath' and 'usersAccountPath' when user is created
function SaveAccInfo(id, parameters) {
    let txtFile = getData(usersInterestsPath)
    if (!(parameters[0].length < 50 && parameters[1] >= 0 && 
          parameters[1] <= 125 && parameters[2].length == 1)) {
        return false
    }
    for (let i = 3; i <= 11; i++) {
        if (!(parameters[i] <= 11 && parameters[i] >= 0)) {
            return false
        }
    }
    try {
        let register = `${id} ${parameters[0]} ${parameters[1]} ${parameters[2]} ${parameters[3]} 
                        ${parameters[4]} ${parameters[5]} ${parameters[6]} ${parameters[7]} 
                        ${parameters[8]} ${parameters[9]} ${parameters[10]} ${parameters[11]}`
        
        //break the textblock into an array of lines
        let lines = txtFile.split('\n')

        //remove one line, starting at the first position
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

//checks if user exists in 'users.txt'
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

//adds user to 'usersAccountPath'
//(asynchronous function to make it harder to add two users with same ID)
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

        //stringify takes value, replacer and spacer as input (replacer is null)
        jsonUsers = JSON.stringify(users, null, 2)

        fs.writeFileSync(usersAccountPath, jsonUsers, "utf-8")
        return true
    } catch (e) {
        console.log('Der skete en fejl ved tilføjelse af bruger til json_fil')
        return false
    }
}

/*this function finds a user based on ID
code based on gitHub example (credit): https://github.com/passport/express-4.x-local-example 
functions from passport, which we have rewritten in order to use them with our own functions */
function findById(id, cb) {
    //runs in next iteration of JS-event loop, nextTick takes function as parameter
    process.nextTick(function () {
        let user = getUserAccounts(id, null)
        if (user) {
            cb(null, user)
        } else {
            cb(new Error('User ' + id + ' does not exist'))
        }
    })
}

//finds a user based on username
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

//used to check if more matches exist
function knnButtonChecker(knn) {
    if (knn <= 3) {
        return false
    }
    return true
}

//returns the correct matches according to which number of matches are needed
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

