export default function drawErrorScreen(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, error: string, allowReconnect: boolean): void {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText("Error: " + error, canvas.width / 2, canvas.height / 2 + (allowReconnect ? 0 : -150));
    if (allowReconnect) {
        // Draw the reconnect button
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.strokeRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50);
        context.fillStyle = "white";
        context.font = "30px Arial";
        context.textAlign = "center";
        context.fillText("Reconnect", canvas.width / 2, canvas.height / 2 + 100);
    }
}