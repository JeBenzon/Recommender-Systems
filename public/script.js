const socket = io('http://localhost:3000') //Hvor server hoster socket.js application
const messageContainer = document.getElementById('message-container') //Modtager data fra room.ejs "message-container" aka når der bliver trykket på "send" button
const roomContainer = document.getElementById('room-container') 
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input') //Modtager data fra room.ejs "room-container" aka beskeden der skal sendes

if (messageForm != null) {
  const name = prompt('Hvad er dit navn?')
  appendMessage('Du tilsluttede rummet')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => { //Lytter efter hvornår "messageContainer bliver ændret"
    e.preventDefault() //Stopper server fra at poste til server og refresh client
    const message = messageInput.value //Få værdien fra beskeden
    appendMessage(`Dig: ${message}`)
    socket.emit('send-chat-message', roomName, message) //Sender besked værdien til serveren
    messageInput.value = '' //Sletter texten i boxen med beskeden efter beskeden er sendt til server
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

socket.on('chat-message', data => { //modtager fra server.js event og data der følger med event
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} tilsluttede rummet`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} forlod rummet`)
})

function appendMessage(message) { //Bruges til at sende beskeder ud til brugeren
  const messageElement = document.createElement('div') //Laver en besked "div" besked element
  messageElement.innerText = message
  messageContainer.append(messageElement)
}