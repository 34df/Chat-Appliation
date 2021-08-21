const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/uploads'))

app.get('/', (req, res) => {
    // res.send('hello world')
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        //console.log(msg)
        socket.broadcast.emit('message', msg)
    })

    socket.on("image", (data) => {
        const { user, image } = data;
        const base64Data = image.replace(/^data:image\/png;base64,/, "");
        const name = new Date().getTime() + ".png";
        require("fs").writeFile("uploads/" + name, base64Data, 'base64', function (err,) {

            // console.error(err);
            socket.broadcast.emit('receiveImage', { user: user, image: base64Data });
        });
    })

})