import socketio from "socket.io-client";
let io = socketio(window.location.host, {reconnection: false, autoConnect: false});

io.on("connect", () => {
    console.log("Connected to server");
});

io.connect();