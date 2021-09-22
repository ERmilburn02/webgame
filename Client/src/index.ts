import socketio from "socket.io-client";
let io = socketio(window.location.host, {reconnection: false, autoConnect: false});

import Vec2 from "./Vec2";
import Utils from "./Utils"

let CLIENT_OPTS = {
    "debug": false,
};

let CLIENT_DATA = {
    "mousePos": Vec2.zero(),
    "lastUpdate": 0,
    "playerPos": Vec2.zero(),
};

let IMAGES = {
    "levels": {
        "fields": {
            "background": new Image(),
            "foreground": new Image(),
            "walkmesh": new Image(),
        }
    },
    "player": new Image(),
};

const canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
// canvas.width = 640;
// canvas.height = 480;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.addEventListener("mousemove", (e: MouseEvent) => {
    CLIENT_DATA.mousePos = Utils.getRelativeMousePosition(e, canvas);
});

canvas.addEventListener("click", (e: MouseEvent) => {
    io.emit("posUpdate", CLIENT_DATA.mousePos);
});

io.on("posUpdate", (data: Vec2) => {
    CLIENT_DATA.playerPos = data;
});

// Called every frame
function update(timestamp: number): void {
    // delta is the time to render, in ms. Target is 1000 / refresh rate.
    let delta = timestamp - CLIENT_DATA.lastUpdate;
    CLIENT_DATA.lastUpdate = timestamp;

    //#region Draw calls
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the background
    context.drawImage(IMAGES.levels.fields.background, 0, 0);
    // Draw the player
    context.drawImage(IMAGES.player, CLIENT_DATA.playerPos.x - IMAGES.player.width / 2, CLIENT_DATA.playerPos.y - IMAGES.player.height / 2);
    // Draw the foreground
    context.drawImage(IMAGES.levels.fields.foreground, 0, 0);
    //#endregion

    // Call requestAnimationFrame to queue the next update.
    requestAnimationFrame(update);
};

// Call to start the game
async function start(): Promise<void> {
    // Display a loading screen
    //#region Loading screen
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "30px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("Loading...", canvas.width / 2, canvas.height / 2);
    //#endregion

    // Load resources
    //#region Load resources
    // Load images
    // TODO: Dynamically load all images
    await Utils.loadImage("/img/player.png").then((img: HTMLImageElement) => {IMAGES.player = img;});
    await Utils.loadImage("/img/fields/background.png").then((img: HTMLImageElement) => {IMAGES.levels.fields.background = img;});
    await Utils.loadImage("/img/fields/foreground.png").then((img: HTMLImageElement) => {IMAGES.levels.fields.foreground = img;});
    await Utils.loadImage("/img/fields/walkmesh.png").then((img: HTMLImageElement) => {IMAGES.levels.fields.walkmesh = img;});
    //#endregion

    // Connect to the server
    io.connect();
    CLIENT_DATA.playerPos = new Vec2(canvas.width / 2, canvas.height / 2);
    io.emit("posUpdate", new Vec2(canvas.width / 2, canvas.height / 2));

    // Start the update loop.
    requestAnimationFrame(update);
};

start();