const io = require('socket.io')(3000)


const users = {}

io.on('connection', socket => {
    console.log('new User')
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('bruger-tilsluttet', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message: message, name:
        users[socket.id]})
    })
    socket.on('disconnected', name => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users(socket.id)
    })
})