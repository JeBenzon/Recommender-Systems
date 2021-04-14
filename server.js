const express = require('express')
const app = express()
const server = require('http').Server(app) //Giver us en "Server der kan kommunikere med socket.io"
const io = require('socket.io')(server) //Laver server på port "server"
const fs = require('fs')
const uuid = require('uuid');

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public')) //Laver public til brug af js
app.use(express.urlencoded({ extended: true })) //giver server adgang til at bruge url encoded i body

const rooms = {} //Vores rooms

app.get('/', (req, res) => { //Index patch
  res.render('index', { rooms: rooms })
})

app.get('/test', (req, res) => {
  makeChat(40, 60)
  console.log(uuid.v1())
  saveChat("390812089-83920183", "Hansbørge", "Hvad så der", 32, 111)
  //getChat()
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    console.log(req.body.room)
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} } //Henter "room" data fra index og holder data på users
  res.redirect(req.body.room) //Redirektor dem til det nye room
  io.emit('room-created', req.body.room) //Sender besked til andre at nyt room var lavet og vise det
})

app.get('/:room', (req, res) => { //Gør så alt der er et room name, bliver lavet om til et room
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room }) //Siger den skal render room med "roomName" der passer til vores room
})

server.listen(3000) //Få server til at lytte til den rigtige port

io.on('connection', socket => { //Første gang bruger loader hjemmeside -> kalder funktion og giver dem et socket
  socket.on('new-user', (room, name) => { //Funktion bliver kaldt i "scripts.js"
    try{
      socket.join(room)
      rooms[room].users[socket.id] = name //Sammensætter navn på bruger med socket id
      socket.broadcast.to(room).emit('user-connected', name) //Sender event 'user-connected' med besked "name" -> broadcast gør så brugeren ikke selv får det
    }catch(e){
      console.log(e)
    }
  })
  socket.on('send-chat-message', (room, message) => { //Aktivere når eventen sker "Send-chat-message" med data "room" "message"
    try{
      socket.broadcast.to(room).emit('chat-message', { //Sender beskeden til alle undtagen brugeren som sender den selv "broadcast" gør så brugeren ikke selv modtager

      //TODO her skal vi gemme ned i vores array/filer
      message: message, //Laver et objekt til at holde dataen på beskeden
      name: rooms[room].users[socket.id] //Tilføjer navnet til objeket via socket.id
    })
    }catch(e){
      console.log(e)
    }
    
  })
  socket.on('disconnect', () => { //Aktivere når en disconnecter -> socket funktion
    getUserRooms(socket).forEach(room => {
      try{
        socket.broadcast.to(room).emit('user-disconnected', rooms[room].users[socket.id]) //Sender ud at brugeren er disconnected
        delete rooms[room].users[socket.id] //Sletter brugeren && bruger id 
      }catch(e){
        console.log(e)
      }
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}



//Funktion der tjekker om 2 brugere har et chatroom, og hvis de er returnere den room id
function checkChat(user_id1, user_id2) {
  let roomConnection = getData('rooms/roomConnections.json')
  let roomConnectionObject = textToJSON(roomConnection)

  for (let i = 0; i < roomConnectionObject.length; i++) {
    if (user_id1 == roomConnectionObject[i].user_id1 && user_id2 == roomConnectionObject[i].user_id2 ||
      user_id1 == roomConnectionObject[i].user_id2 && user_id2 == roomConnectionObject[i].user_id1) {
      return roomConnectionObject[i].id
    }
  }
  return false
}

//TODO Funktion der opretter en chat hvis den er den første.
function makeChat(u_id1, u_id2) {
  //Check om brugere allerede har en chat.
  let room = {
    id: uuid.v1(),
    user_id1: u_id1,
    user_id2: u_id2,
  }

  let roomConnection = getData('rooms/roomConnections.json')
  let roomConnectionObject = textToJSON(roomConnection)
  roomConnectionObject.push(room)

  jsonUsers = JSON.stringify(roomConnectionObject, null, 2)

  fs.writeFileSync('rooms/roomConnections.json', jsonUsers, "utf-8")
}


//TODO en funktion der henter alle tidligere beskeder i en chat
function getChat(id) {
  let data = fs.readFileSync(`rooms/room${id}.json`)
  let chats = textToJSON(data)

  return chats
}

//TODO En funktion der kan gemme en chat (name, message)
function saveChat(id, u_name, u_message, u_id1, u_id2) {
  let chat
  try {


    //prøver at hente room filen
    let data = fs.readFileSync(`rooms/room${id}.json`)
    chatObj = textToJSON(data)

    chatToAppend = {
      name: u_name,
      message: u_message
    }

    chatObj.chat.push(chatToAppend)

    jsonChat = JSON.stringify(chatObj, null, 2)
    fs.writeFileSync(`rooms/room${id}.json`, jsonChat, "utf-8")
  } catch (e) {
    chat = {
      id: uuid.v1(),
      user_id1: u_id1,
      user_id2: u_id2,
      chat: [
        {
          name: u_name,
          message: u_message
        }
      ]
    }
    //opretter hvis filen ikke eksistere
    jsonChat = JSON.stringify(chat, null, 2)
    fs.writeFileSync(`rooms/room${id}.json`, jsonChat, "utf-8")
  }
}



//Funktioner vi allerede har i main

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

//læser fil og giver string output
function getData(path) {
  const data = fs.readFileSync(path, 'utf8')
  return data;
}
