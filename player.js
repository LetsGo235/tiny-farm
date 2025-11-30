// player.js
import { TILE_SIZE } from './config.js';
import { isKeyDown } from './input.js';

export class Player {
    constructor(x, y) {
        this.x = x; // pixel world coords
        this.y = y;
        this.speed = 150; // pixels per second
        this.radius = TILE_SIZE * 0.3;
    }

    get tileX() {
        return Math.floor(this.x / TILE_SIZE);
    }

    get tileY() {
        return Math.floor(this.y / TILE_SIZE);
    }

    update(dt, world) {
        let dx = 0;
        let dy = 0;

        if (isKeyDown('ArrowUp') || isKeyDown('KeyW')) dy -= 1;
        if (isKeyDown('ArrowDown') || isKeyDown('KeyS')) dy += 1;
        if (isKeyDown('ArrowLeft') || isKeyDown('KeyA')) dx -= 1;
        if (isKeyDown('ArrowRight') || isKeyDown('KeyD')) dx += 1;

        // Normalize so diagonal isn’t faster
        const len = Math.hypot(dx, dy);
        if (len > 0) {
            dx /= len;
            dy /= len;
        }

        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;

        // Clamp to world bounds
        this.x = Math.max(0, Math.min(this.x, world.pixelWidth - 1));
        this.y = Math.max(0, Math.min(this.y, world.pixelHeight - 1));
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.fillStyle = '#ffd966'; // simple yellow-ish player
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Simple outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
