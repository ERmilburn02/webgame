export default function drawAssetDownloadScreen(canvas: HTMLCanvasElement,context: CanvasRenderingContext2D, remainingAssets: number, totalAssets: number): void {
    // canvas.width = 640;
    // canvas.height = 480;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.strokeStyle = '#000000';

    // Create a box for the progress bar
    context.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 50, 400, 100);

    // Fill the progress bar
    context.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 50, 400 * ((totalAssets - remainingAssets) / totalAssets), 100);

    // Draw the text
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillStyle = '#00ff00'
    // Align the text to the center of the progress bar
    // context.fillText('Downloading assets...', canvas.width / 2 - 200, canvas.height / 2 - 25);
    // context.fillText('(' + (totalAssets - remainingAssets) + '/' + totalAssets + ')', canvas.width / 2 - 200, canvas.height / 2 + 25);
    context.fillText('Downloading assets...', canvas.width / 2, canvas.height / 2 - 15);
    context.fillText('(' + (totalAssets - remainingAssets) + '/' + totalAssets + ')', canvas.width / 2, canvas.height / 2 + 35);
}