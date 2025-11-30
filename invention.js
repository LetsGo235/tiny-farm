// inventory.js
export class Inventory {
    constructor() {
        this.items = new Map();
        // Give the player some seeds to start with
        this.add('seed', 5);
        this.add('crop', 0);
    }

    add(name, amount = 1) {
        const current = this.get(name);
        this.items.set(name, current + amount);
    }

    get(name) {
        return this.items.get(name) || 0;
    }

    has(name, amount = 1) {
        return this.get(name) >= amount;
    }

    remove(name, amount = 1) {
        const current = this.get(name);
        this.items.set(name, Math.max(0, current - amount));
    }

    // For displaying a simple list
    getAll() {
        return Array.from(this.items.entries()); // [ [name, count], ... ]
    }
}
