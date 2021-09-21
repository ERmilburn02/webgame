import socketio from "socket.io";
import Vec2 from "./Vec2";

export default class Player {
    "socket": socketio.Socket;
    "pos": Vec2;
    "name": string;

    constructor(_socket: socketio.Socket, _pos: Vec2, _name: string) {
        this.socket = _socket;
        this.pos = _pos;
        this.name = _name;
    }
}