import express from "express";
import socketio from "socket.io";
import http from "http";
import Player from "./Player";
import Vec2 from "./Vec2";
import HandleCommand from "./Command";

let app = express();
let serv = http.createServer(app);
let io = new socketio.Server(serv, {});

let PORT = process.env.PORT || 2000;
let DEV_PASSWORD = process.env.DEV_PASSWORD || "Pjv7P-Z=gqWG?5X3";

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

  socket.on("urlArgs", (data: { [key: string]: string }) => {
    if (data.hasOwnProperty("nick")) {
      let player = PLAYER_LIST[socket.id] as Player;
      console.log(`${player.name} is now ${data.nick}`);
      player.name = data.nick;
    }
    if (data.hasOwnProperty("dev")) {
      if (decodeURIComponent(data.dev) === DEV_PASSWORD) {
        let player = PLAYER_LIST[socket.id] as Player;
        console.log(`${player.name} is a developer`);
        player.isDeveloper = true;
      }
    }
  });

  socket.on("chat", (data: string) => {
    const player = PLAYER_LIST[socket.id] as Player;
    // TODO: Filter chat
    // TODO: Check room
    if (data.substring(0, 1) === "/") {
      // Command, don't send to other players
      // We use the regex / +/ instead of " " in case of multiple spaces
      let args: string[] = data.substring(1).split(/ +/);
      let cmd = args.shift().toLowerCase();
      console.log(`${socket.id} ran ${cmd} ${args}`);
      HandleCommand(socket, player, cmd, args);
    } else {
      console.log(`${socket.id} said ${data}`);
      player.currentMessage = data;
      player.lastMessageTime = Date.now();
    }
  });
});

setInterval(() => {
  let pack = [];
  for (let i in PLAYER_LIST) {
    pack.push(PLAYER_LIST[i].getUpdatePack());
  }
  for (let i in SOCKET_LIST) {
    SOCKET_LIST[i].emit("update", { pos: pack });
  }
}, 1000 / 60);

serv.listen(PORT);
console.log(`Server started`);
