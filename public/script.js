const socket = io('/')
const name = prompt('Enter your name:', 'Name')
let users
socket.emit('join-room', ROOM_ID, name)

socket.on('user-connected', userId => {
    console.log('User connected: ' + userId)
})

socket.on('user-disconnected', userId => {
    console.log('User disconnected: ' + userId)
})
socket.on('update-room', room => {
    users = room
    text = "<h1>";
    for (i = 0; i < room.length; i++) {
        text += "<h1>" + room[i] + "</h1>";
    }
    text += "</h1>";

    document.getElementById("users").innerHTML = text;
})

function start() {
    let starters = []
    for (var i = 0; i < 2; i++) {
        starters.push(users.splice(Math.random() * (users.length - 1), 1).pop());
    }
    socket.emit(ROOM_ID).emit('share-starters', starters)
    socket.emit(ROOM_ID).emit('send-users', users)
}

socket.on('receive-starters', starters => {

    if (starters.includes(name) == true) {
        text = "<h1>";
        for (i = 0; i < starters.length; i++) {
            text += "<h1>" + starters[i] + "</h1>";
        }
        text += "</h1>";
        document.getElementById("users").innerHTML = text;
        document.getElementById("startButton").style.visibility = "hidden";
        document.getElementById("button").style.visibility = "visible";
        document.getElementById("input").style.visibility = "visible";
    } else {
        document.getElementById("overlay").style.visibility = "visible";
    }
})

function recall() {
    console.log('recall local')
    socket.emit(ROOM_ID).emit('recall')
}

socket.on('newOnHold', newOnHold => {
    console.log(newOnHold)
    if (newOnHold.includes(name) == true) {
        document.getElementById("startButton").style.visibility = "hidden";
        document.getElementById("button").style.visibility = "visible";
        document.getElementById("input").style.visibility = "visible";
        document.getElementById("overlay").style.visibility = "hidden";
    }

})

function updateNotes() {
    socket.emit(ROOM_ID).emit('update-notes', document.getElementById("input").value)

}

socket.on('receive-notes', text => {
    document.getElementById("input").value = text

})