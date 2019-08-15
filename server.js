const express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    exApp = express(),
    app = require('http').Server(exApp),
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
    socket.on('thought read', (tho) =>{
        if(tho !== null && tho !== undefined){
            io.sockets.emit('thought read', tho);
        };
    });

    socket.on('thought req', () =>{
        io.sockets.emit('thought req');
    })
    
    socket.on('api called', (api) =>{
        if(api){
            io.sockets.emit('api called', api);
        };
    });
});

exApp.get("*", (req, res) =>{
    res.sendfile(path.join(__dirname, './client/build/index.html'));
});

app.listen(PORT, ()=>{
    console.log(`==> Server now listening to you on port ${PORT}.`);
});