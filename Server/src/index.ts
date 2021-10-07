import express from "express";
import socketio from "socket.io";
import http from "http";
import Player from "./Player";
import Vec2 from "./Vec2";
import bodyParser from "body-parser";
import {spawn} from "child_process";

let app = express();
let serv = http.createServer(app);
let io = new socketio.Server(serv, {});

app.use("/", express.static(__dirname + "/client"));

//#region Auto-Update Webhook
const USE_AUTO_UPDATE: boolean = false;

app.use(bodyParser.json());
app.post("/gitUpdateHook", (req, res) => {
    res.status(200).send("OK");
    console.log("Git Update Hook");
    if (USE_AUTO_UPDATE) {
        console.log("Auto-Update");
        spawn("npm", ["run", "update"], {detached: true, stdio: "ignore"});
        process.exit(0);
    }
});
//#endregion

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
        socket.emit("posUpdate", PLAYER_LIST[socket.id].pos);
    });
});

serv.listen(process.env.PORT || 2000);
console.log(`Server started`);