import Vec2 from "./Vec2";

export default class Player {
  "id": string;
  "pos": Vec2;
  "name": string;
  "currentMessage": string;
  "isDeveloper": boolean;

  constructor(id: string, pos: Vec2, name: string) {
    this.id = id;
    this.pos = pos;
    this.name = name;
    this.currentMessage = "";
    this.isDeveloper = false;
  }
}
