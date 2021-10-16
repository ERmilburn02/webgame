import socketio from "socket.io";
import Player from "./Player";

export default function HandleCommand(
  socket: socketio.Socket,
  player: Player,
  cmd: string,
  args: string[]
) {
  switch (cmd) {
    case "nick":
      if (args.length > 0) {
        // TODO: Check if name is valid
        player.name = args[0];
        // The player's name will be updated the next time the update packet is sent
      }
      break;
    default:
      console.log(`Unknown command: ${cmd}`);
      break;
  }
}
