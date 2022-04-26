import { sdl2 } from './deps.ts';

const SIZE = 100;
const SCALE = 10;

// Initialize Screen
let screen = new Array(SIZE).fill(null).map((_) => new Array(SIZE).fill(false));

// Make screen buffer
const screen_buffer = screen;

// Generate random playfield
for (let i = 0; i < SIZE; i++) {
	for (let j = 0; j < SIZE; j++) {
		if (Math.floor(Math.random() * 15) === 1) {
			screen[i][j] = true;
		}
	}
}

// Initialize window
const window = new sdl2.WindowBuilder('Game of Life', SIZE * SCALE, SIZE * SCALE).build();
const canvas = window.canvas();

// Game event handler
for (const event of window.events()) {
	// Quit game
	if (event.type === sdl2.EventType.Quit) {
    break;
	} else if (event.type === sdl2.EventType.Draw) {
		// Clear the screen
		canvas.setDrawColor(255, 255, 255, 255);
		canvas.clear();

		// Generate next frame
		nextFrame();
		screen = screen_buffer;

		// Draw frame to screen
		canvas.setDrawColor(0, 0, 0, 255);
		for (let i = 0; i < SIZE; i++) {
			for (let j = 0; j < SIZE; j++) {
				if (screen[i][j]) {
					canvas.fillRect(i * SCALE, j * SCALE, SCALE, SCALE);
				}
			}
		}
		canvas.present();
		await new Promise(res => setTimeout(res, (1000 / 10)));
	}
}

// Generate next frame
function nextFrame() {
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			let neighbours = 0;

			if (i - 1 !== -1 && j - 1 !== -1 && screen[i - 1][j - 1]) neighbours++;
			if (j - 1 !== -1 && screen[i][j - 1]) neighbours++;
			if (i + 1 !== SIZE && j - 1 !== -1 && screen[i + 1][j - 1]) neighbours++;

			if (i - 1 !== -1 && screen[i - 1][j]) neighbours++;
			if (i + 1 !== SIZE && screen[i + 1][j]) neighbours++;

			if (i - 1 !== -1 && j + 1 !== SIZE && screen[i - 1][j + 1]) neighbours++;
			if (j + 1 !== SIZE && screen[i][j + 1]) neighbours++;
			if (i + 1 !== SIZE && j + 1 !== SIZE && screen[i + 1][j + 1]) neighbours++;

			if (screen[i][j] && (neighbours === 2 || neighbours === 3)) {
				screen_buffer[i][j] = true;
			} else if (!screen[i][j] && neighbours === 3) {
				screen_buffer[i][j] = true;
			} else {
				screen_buffer[i][j] = false;
			}
		}
	}
}