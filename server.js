const io = require('socket.io')(3000)

io.on('connection', socket => {
    console.log('new User')
    socket.emit('chat-massage', 'Hello World')
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message)
    })
})