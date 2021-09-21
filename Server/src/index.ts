import express from "express";
import socketio from "socket.io";
import http from "http";

let app = express();
let serv = http.createServer(app);
let io = new socketio.Server(serv, {});

app.use("/", express.static(__dirname + "/client"));

serv.listen(process.env.PORT || 2000);
console.log(`Server started`);