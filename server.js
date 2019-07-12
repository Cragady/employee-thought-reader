const express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    exApp = express(),
    app = require('http').Server(exApp),
    // app = express(),
    path = require('path'),
    io = require('socket.io')(app),
    PORT = process.env.PORT || 3001;

exApp.use(bodyParser.urlencoded({ extended: true }));
exApp.use(bodyParser.json());

if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'));
};

exApp.use(routes);

io.on('connection', (socket) =>{
    console.log('--> Socket live');

    socket.on('change color', (color) =>{
        console.log('Color Changed to:', color);
        io.sockets.emit('change color', color);
    });
});

exApp.get("*", (req, res) =>{
    res.sendfile(path.join(__dirname, './client/build/index.html'));
});

app.listen(PORT, ()=>{
    console.log(`==> Server now listening to you on port ${PORT}.`);
});