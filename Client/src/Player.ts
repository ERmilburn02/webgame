import Vec2 from "./Vec2";

export default class Player {
    "id": string;
    "pos": Vec2;
    "name": string;

    constructor(id: string, pos: Vec2, name: string) {
        this.id = id;
        this.pos = pos;
        this.name = name;
    }
}