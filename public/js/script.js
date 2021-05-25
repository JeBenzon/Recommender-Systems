const socket = io('http://localhost:3000') //server hosts socket.io application
const messageContainer = document.getElementById('message-container') //contains the messages sent to each user in "room.hbs"
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container') //receives data from room.hbs "message-container" when 'send' button is clicked
const messageInput = document.getElementById('message-input') //receives data from room.hbs "room-container" when message are to be sent
const user1 = document.getElementById('user1').name
const user2 = document.getElementById('user2').name

if (messageForm != null) {
    appendMessage('Du tilsluttede rummet')

    socket.emit('new-user', roomName, user1) 
    /*activates when "messageContainer" gets changed
    used to send message to user self */
    messageForm.addEventListener('submit', e => {

    //stops client from refreshing site when user clicks 'send' button
    e.preventDefault() 
    
    //gets content from message
    const message = messageInput.value 
    appendMessage(`Dig: ${message}`)

    //sends message content to server
    socket.emit('send-chat-message', roomName, message, user1, user2) 

    //deletes text in message textbox after message is sent to server
    messageInput.value = '' 
    })
}

socket.on('room-created', room => {
    const roomElement = document.createElement('div')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

//receives event 'chat-message' and 'data' (object) -> used to send message to other users
socket.on('chat-message', data => { 
    appendMessage(`${data.name}: ${data.message}`)
})

//receives event 'user-connected' from socket.io lib when user connects to chat, and name of user
socket.on('user-connected', name => { 
    appendMessage(`${name} tilsluttede rummet`)
})

//receives event 'user-disconnected' from socket.io lib when user disconnects, and name of user 
socket.on('user-disconnected', name => { 
    appendMessage(`${name} forlod rummet`)
})

//function used to write messages to chat room
function appendMessage(message) { 
    //creates 'div' element
    const messageElement = document.createElement('div') 

    //div is assigned to input 'message' as string
    messageElement.innerText = message
    messageContainer.append(messageElement)
}