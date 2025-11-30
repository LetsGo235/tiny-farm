// ui.js
export class UI {
    constructor(inventory, soundManager) {
        this.inventory = inventory;
        this.sound = soundManager;
        this.message = '';
        this.messageTime = 0; // seconds remaining
    }

    showMessage(text, duration = 2) {
        this.message = text;
        this.messageTime = duration;
        if (this.sound) {
            this.sound.playSfx('blip'); // text sound byte
        }
    }

    update(dt) {
        if (this.messageTime > 0) {
            this.messageTime -= dt;
            if (this.messageTime <= 0) {
                this.message = '';
            }
        }
    }

    draw(ctx) {
        const { width, height } = ctx.canvas;

        // Inventory list (top-left)
        ctx.save();
        ctx.font = '14px monospace';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(8, 8, 160, 80);

        ctx.fillStyle = '#ffffff';
        ctx.fillText('Inventory', 16, 16);

        const items = this.inventory.getAll();
        let y = 34;
        for (const [name, count] of items) {
            ctx.fillText(`${name}: ${count}`, 16, y);
            y += 16;
        }

        // Simple hint
        ctx.fillText('[WASD / Arrows] Move', 16, height - 50);
        ctx.fillText('[Space] Till / Plant / Harvest', 16, height - 30);

        // Message box (bottom center)
        if (this.message) {
            const msgWidth = ctx.measureText(this.message).width + 40;
            const boxX = (width - msgWidth) / 2;
            const boxY = height - 70;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(boxX, boxY, msgWidth, 50);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.strokeRect(boxX, boxY, msgWidth, 50);

            ctx.fillStyle = '#ffffff';
            ctx.fillText(this.message, boxX + 20, boxY + 18);
        }

        ctx.restore();
    }
}
