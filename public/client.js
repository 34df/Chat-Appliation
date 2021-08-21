const socket = io()

let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

do {
    name = prompt('Please enter your name: ')
} while (!name)

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

//image send
const fileInput = document.getElementById('file_input');

fileInput.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        let msg = {
            user: name,
            image: e.target.result
        }
        appendMessage(msg, 'outgoing')
        fileInput.value = ''
        socket.emit("image", msg);
    }
    reader.readAsDataURL(file);
}
// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
});
socket.on("receiveImage", (msg) => {
    const image = `<img src="data:image/png;base64, ${msg.image}" width=100 height=100 />`;
    msg.message = image;
    appendMessage(msg, 'incoming')
    scrollToBottom()
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}
