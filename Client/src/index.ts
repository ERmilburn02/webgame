declare global {
  interface Window {
    io: any;
  }
}

//#region Imports
import socketio from "socket.io-client";

import Vec2 from "./Vec2";
import Utils from "./Utils";
import Player from "./Player";
import drawAssetDownloadScreen from "./drawables/drawAssetDownloadScreen";
import drawErrorScreen from "./drawables/drawErrorScreen";
//#endregion

//#region Create Socket.io
let io = socketio(window.location.host, {
  reconnection: false,
  autoConnect: false,
});
window.io = io;
//#endregion

//#region HTML elements
// canvas.width = 640;
// canvas.height = 480;
const canvas: HTMLCanvasElement = document.getElementById(
  "game"
) as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");
const chatForm: HTMLFormElement = document.getElementById(
  "chatForm"
) as HTMLFormElement;
const chatInput: HTMLInputElement = document.getElementById(
  "chatInput"
) as HTMLInputElement;
//#endregion

//#region Global Data
let CLIENT_OPTS = {
  debug: false,
};

let CLIENT_DATA = {
  mousePos: Vec2.zero(),
  lastUpdate: 0,
  errorMsg: "",
  hasError: false,
  errorAllowReconnection: false,
};

let IMAGES = {
  levels: {
    fields: {
      background: new Image(),
      foreground: new Image(),
      walkmesh: new Image(),
    },
  },
  player: new Image(),
};

let PLAYER_LIST: Player[] = [];
//#endregion

//#region Event listeners
canvas.addEventListener("mousemove", (e: MouseEvent) => {
  CLIENT_DATA.mousePos = Utils.getRelativeMousePosition(e, canvas);
});

canvas.addEventListener("click", (e: MouseEvent) => {
  io.emit("posUpdate", CLIENT_DATA.mousePos);
});

chatForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  io.emit("chat", chatInput.value);
  chatInput.value = "";
});

// Update packet is sent to the client 60 times a second.
io.on("update", (data: any) => {
  PLAYER_LIST = data.pos as Player[];
});

io.on("disconnect", (disconnectReason) => {
  if (disconnectReason === "io client disconnect") {
    CLIENT_DATA.hasError = true;
    CLIENT_DATA.errorMsg = "Disconnected";
  } else {
    CLIENT_DATA.hasError = true;
    CLIENT_DATA.errorMsg = "Connection lost";
  }
});
//#endregion

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
  // Draw the players
  PLAYER_LIST.forEach((player) => {
    context.drawImage(
      IMAGES.player,
      player.pos.x - IMAGES.player.width / 2,
      player.pos.y - IMAGES.player.height / 2
    );
    // Write the player name
    context.font = "12px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(player.name, player.pos.x, player.pos.y + 50);
    // Write the chat message
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(player.currentMessage, player.pos.x, player.pos.y - 40);
  });
  // Draw the foreground
  context.drawImage(IMAGES.levels.fields.foreground, 0, 0);

  if (CLIENT_DATA.hasError) {
    drawErrorScreen(
      canvas,
      context,
      CLIENT_DATA.errorMsg,
      CLIENT_DATA.errorAllowReconnection
    );
  }
  //#endregion

  // Call requestAnimationFrame to queue the next update.
  requestAnimationFrame(update);
}

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
  let assetJson: any = await (await fetch("/assets/assets.json")).json();

  let totalCount = 4;
  let count = totalCount;
  // Load images
  drawAssetDownloadScreen(canvas, context, count, totalCount);
  Utils.loadImage(assetJson.images.default_player).then(
    (img: HTMLImageElement) => {
      IMAGES.player = img;
      count--;
      finishLoadImages(count, totalCount);
    }
  );
  Utils.loadImage(assetJson.images.levels_fields_background).then(
    (img: HTMLImageElement) => {
      IMAGES.levels.fields.background = img;
      count--;
      finishLoadImages(count, totalCount);
    }
  );
  Utils.loadImage(assetJson.images.levels_fields_foreground).then(
    (img: HTMLImageElement) => {
      IMAGES.levels.fields.foreground = img;
      count--;
      finishLoadImages(count, totalCount);
    }
  );
  Utils.loadImage(assetJson.images.levels_fields_walkmesh).then(
    (img: HTMLImageElement) => {
      IMAGES.levels.fields.walkmesh = img;
      count--;
      finishLoadImages(count, totalCount);
    }
  );
  //#endregion
}

function finishLoadImages(count: number, totalCount: number): void {
  if (count > 0) {
    drawAssetDownloadScreen(canvas, context, count, totalCount);
    return;
  }

  // Connect to the server
  io.connect();
  io.emit("posUpdate", new Vec2(canvas.width / 2, canvas.height / 2));

  // Start the update loop.
  requestAnimationFrame(update);
}

start();
