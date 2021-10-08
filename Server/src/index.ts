import express from "express";
import socketio from "socket.io";
import http from "http";
import Player from "./Player";
import Vec2 from "./Vec2";

let app = express();
let serv = http.createServer(app);
let io = new socketio.Server(serv, {});

app.use("/", express.static(__dirname + "/client"));

let SOCKET_LIST = {};
let PLAYER_LIST = {};

io.sockets.on("connect", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST[socket.id] = new Player(socket, Vec2.zero(), socket.id);

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        delete PLAYER_LIST[socket.id];
        delete SOCKET_LIST[socket.id];
    });

    socket.on("posUpdate", (data: Vec2) => {
        //TODO: Check level
        //TODO: Check if on walkmesh
        PLAYER_LIST[socket.id].pos = data;
    });
});

setInterval(() => {
    let pack = [];
    for (let i in PLAYER_LIST) {
        pack.push(PLAYER_LIST[i].getUpdatePack());
    }
    for (let i in SOCKET_LIST) {
        SOCKET_LIST[i].emit("update", pack);
    }
}, 1000 / 60);

serv.listen(process.env.PORT || 2000);
console.log(`Server started`);