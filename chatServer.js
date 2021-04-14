
const server = require('http').Server(app) //Giver us en "Server der kan kommunikere med socket.io"
const io = require('socket.io')(server) //Laver server på port "server"


app.get('/:room', (req, res) => { //Gør så alt der er et room name, bliver lavet om til et room
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room }) //Siger den skal render room med "roomName" der passer til vores room
})


server.listen(4000) //Få server til at lytte til den rigtige port

io.on('connection', socket => { //Første gang bruger loader hjemmeside -> kalder funktion og giver dem et socket
  socket.on('new-user', (room, name) => { //Funktion bliver kaldt i "scripts.js"
    try{
      socket.join(room)
      rooms[room].users[socket.id] = name //Sammensætter navn på bruger med socket id
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




