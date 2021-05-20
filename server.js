const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {
    v4: uuidV4
} = require('uuid')
let room = []
let onHold = []
// let sessions = []

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    })

})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId, ) => {

        // if (sessions.includes(roomId) == true) {
        //     console.log("session exists")
        // } else {
        //     console.log("session doesnt exist")
        //     sessions.push(roomId)
        // }
        console.log(userId + ' joined session ' + roomId)
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        room.push(userId)
        io.in(roomId).emit('update-room', room)
        console.log('Users in session: ' + room)



        socket.on('share-starters', (starters) => {
            console.log('starters: ' + starters)
            io.in(roomId).emit('receive-starters', starters)
        })

        socket.on('send-users', (stayers) => {
            onHold = stayers
        })


        socket.on('recall', () => {

            let newOnHold = []
            for (var i = 0; i < 1; i++) {
                newOnHold.push(onHold.splice(Math.random() * (onHold.length - 1), 1).pop());
            }
            io.in(roomId).emit('newOnHold', newOnHold)
        })

        socket.on('update-notes', (text) => {
            io.in(roomId).emit('receive-notes', text)
        })


        socket.on('disconnect', () => {
            for (var i = 0; i < room.length; i++) {
                if (room[i] === userId) {
                    room.splice(i, 1);
                }
            }
            console.log(userId + ' left session ' + roomId)
            console.log('Users in session: ' + room)
            socket.to(roomId).emit('user-disconnected', userId)
            io.in(roomId).emit('update-room', room)
        })
    })

})

server.listen(3001)