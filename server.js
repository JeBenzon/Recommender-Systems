const express = require('express')
const app = express()
const server = require('http').Server(app) //Giver us en "Server der kan kommunikere med socket.io"
const io = require('socket.io')(server) //Laver server på port "server"

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public')) //Laver public til brug af js
app.use(express.urlencoded({ extended: true })) //giver server adgang til at bruge url encoded i body

const rooms = { } //Vores rooms

app.get('/', (req, res) => { //Index patch
  res.render('index', { rooms: rooms })
})


app.post('/room', (req, res) => { 
  if (rooms[req.body.room] != null) {
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
    socket.join(room)
    rooms[room].users[socket.id] = name //Sammensætter navn på bruger med socket id
    socket.to(room).broadcast.emit('user-connected', name) //Sender event 'user-connected' med besked "name" -> broadcast gør så brugeren ikke selv får det
  })
  socket.on('send-chat-message', (room, message) => { //Aktivere når eventen sker "Send-chat-message" med data "room" "message"
    socket.to(room).broadcast.emit('chat-message', { //Sender beskeden til alle undtagen brugeren som sender den selv "broadcast" gør så brugeren ikke selv modtager
      message: message, //Laver et objekt til at holde dataen på beskeden
      name: rooms[room].users[socket.id] //Tilføjer navnet til objeket via socket.id
    })
  })
  socket.on('disconnect', () => { //Aktivere når en disconnecter -> socket funktion
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]) //Sender ud at brugeren er disconnected
      delete rooms[room].users[socket.id] //Sletter brugeren && bruger id 
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}