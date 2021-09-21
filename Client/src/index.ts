import { request } from "express";
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
};

const canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
// canvas.width = 640;
// canvas.height = 480;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.addEventListener("mousemove", (e: MouseEvent) => {
    CLIENT_DATA.mousePos = Utils.getRelativeMousePosition(e, canvas);
});

canvas.addEventListener("click", (e: MouseEvent) => {
    console.log(CLIENT_DATA.mousePos);
});

// Called every frame
function update(timestamp: number): void {
    // delta is the time to render, in ms. Target is 1000 / refresh rate.
    let delta = timestamp - CLIENT_DATA.lastUpdate;
    CLIENT_DATA.lastUpdate = timestamp;

    //#region Draw calls
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //#endregion

    // Call requestAnimationFrame to queue the next update.
    requestAnimationFrame(update);
};

// Call to start the game
function start(): void {
    // Start the update loop.
    requestAnimationFrame(update);
};