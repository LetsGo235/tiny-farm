// world.js
import { TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, GROWTH_TIME } from './config.js';

class Tile {
    constructor() {
        // grass -> tilled -> planted -> grown
        this.type = 'grass';
        this.growth = 0; // counts up while planted
    }
}

export class World {
    constructor(width = WORLD_WIDTH, height = WORLD_HEIGHT) {
        this.width = width;
        this.height = height;
        this.tiles = [];

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push(new Tile());
            }
            this.tiles.push(row);
        }

        this.pixelWidth = this.width * TILE_SIZE;
        this.pixelHeight = this.height * TILE_SIZE;
    }

    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
        return this.tiles[y][x];
    }

    till(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return false;
        if (tile.type === 'grass') {
            tile.type = 'tilled';
            tile.growth = 0;
            return true;
        }
        return false;
    }

    plant(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return false;
        if (tile.type === 'tilled') {
            tile.type = 'planted';
            tile.growth = 0;
            return true;
        }
        return false;
    }

    harvest(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return 0;
        if (tile.type === 'grown') {
            tile.type = 'tilled'; // back to tilled soil
            tile.growth = 0;
            return 1; // 1 crop gained
        }
        return 0;
    }

    update(dt) {
        // Grow planted tiles over time
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                if (tile.type === 'planted') {
                    tile.growth += dt;
                    if (tile.growth >= GROWTH_TIME) {
                        tile.type = 'grown';
                    }
                }
            }
        }
    }

    draw(ctx, cameraX, cameraY, viewWidth, viewHeight) {
        const startX = Math.floor(cameraX / TILE_SIZE);
        const startY = Math.floor(cameraY / TILE_SIZE);
        const endX = Math.ceil((cameraX + viewWidth) / TILE_SIZE);
        const endY = Math.ceil((cameraY + viewHeight) / TILE_SIZE);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.getTile(x, y);
                if (!tile) continue;

                const screenX = x * TILE_SIZE - cameraX;
                const screenY = y * TILE_SIZE - cameraY;

                // Base color by tile type
                switch (tile.type) {
                    case 'grass':
                        ctx.fillStyle = '#2f8f2f';
                        break;
                    case 'tilled':
                        ctx.fillStyle = '#7b4a23';
                        break;
                    case 'planted':
                        ctx.fillStyle = '#7b4a23';
                        break;
                    case 'grown':
                        ctx.fillStyle = '#45c945';
                        break;
                }
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

                // Small plant indicator for planted vs grown
                if (tile.type === 'planted') {
                    ctx.fillStyle = '#2aa02a';
                    ctx.fillRect(
                        screenX + TILE_SIZE * 0.25,
                        screenY + TILE_SIZE * 0.25,
                        TILE_SIZE * 0.5,
                        TILE_SIZE * 0.5
                    );
                } else if (tile.type === 'grown') {
                    ctx.fillStyle = '#1f5f1f';
                    ctx.fillRect(
                        screenX + TILE_SIZE * 0.2,
                        screenY + TILE_SIZE * 0.1,
                        TILE_SIZE * 0.6,
                        TILE_SIZE * 0.8
                    );
                }

                // Grid lines
                ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
