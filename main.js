// main.js
import { setupInput, consumeKey } from './input.js';
import { World } from './world.js';
import { Player } from './player.js';
import { Inventory } from './inventory.js';
import { SoundManager } from './sound.js';
import { UI } from './ui.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const world = new World();
const player = new Player(world.pixelWidth / 2, world.pixelHeight / 2);
const inventory = new Inventory();
const sound = new SoundManager();
const ui = new UI(inventory, sound);

setupInput();

// Start background music for the farm area
sound.playMusic('farm');

let lastTime = performance.now();
let cameraX = 0;
let cameraY = 0;

function update(dt) {
    world.update(dt);
    player.update(dt, world);
    ui.update(dt);

    // Camera follows the player, clamped to world bounds
    cameraX = player.x - canvas.width / 2;
    cameraY = player.y - canvas.height / 2;

    cameraX = Math.max(0, Math.min(cameraX, world.pixelWidth - canvas.width));
    cameraY = Math.max(0, Math.min(cameraY, world.pixelHeight - canvas.height));

    // Interact / till / plant / harvest with Spacebar
    if (consumeKey('Space')) {
        const tx = player.tileX;
        const ty = player.tileY;

        // Priority:
        // 1. Harvest grown
        // 2. Plant on tilled if we have seeds
        // 3. Till grass
        const harvestAmount = world.harvest(tx, ty);
        if (harvestAmount > 0) {
            inventory.add('crop', harvestAmount);
            ui.showMessage(`Harvested ${harvestAmount} crop(s)!`);
            sound.playSfx('harvest');
        } else if (world.getTile(tx, ty)?.type === 'tilled' && inventory.has('seed', 1)) {
            if (world.plant(tx, ty)) {
                inventory.remove('seed', 1);
                ui.showMessage('Planted a seed.');
                sound.playSfx('plant');
            }
        } else {
            // Try tilling
            const tilled = world.till(tx, ty);
            if (tilled) {
                ui.showMessage('Tilled the soil.');
                sound.playSfx('plant');
            } else {
                ui.showMessage('Nothing to do here.');
            }
        }
    }

    // Example of switching music depending on "area" (left vs right half):
    // const onLeftSide = player.x < world.pixelWidth / 2;
    // sound.playMusic(onLeftSide ? 'farm' : 'anotherTrack');
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    world.draw(ctx, cameraX, cameraY, canvas.width, canvas.height);
    player.draw(ctx, cameraX, cameraY);
    ui.draw(ctx);
}

function gameLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt);
    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
