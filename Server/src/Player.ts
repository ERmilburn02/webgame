import socketio from "socket.io";
import Vec2 from "./Vec2";

export default class Player {
  "socket": socketio.Socket;
  "pos": Vec2;
  "name": string;
  "currentMessage": string;
  "lastMessageTime": number;

  constructor(_socket: socketio.Socket, _pos: Vec2, _name: string) {
    this.socket = _socket;
    this.pos = _pos;
    this.name = _name;
    this.currentMessage = "";
    this.lastMessageTime = 0;
  }

  public getUpdatePack() {
    if (this.currentMessage != "" && this.lastMessageTime + 5000 < Date.now()) {
      this.currentMessage = "";
    }
    return {
      id: this.socket.id,
      pos: this.pos,
      name: this.name,
      currentMessage: this.currentMessage,
    };
  }
}
