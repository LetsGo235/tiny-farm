// input.js
const keysDown = new Set();

export function setupInput() {
    window.addEventListener('keydown', (e) => {
        // Prevent scrolling for movement / space keys
        if (
            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) ||
            ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)
        ) {
            e.preventDefault();
        }
        keysDown.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
        keysDown.delete(e.code);
    });
}

export function isKeyDown(code) {
    return keysDown.has(code);
}

// Use this when you want a key to trigger once (e.g. Space to interact)
export function consumeKey(code) {
    if (keysDown.has(code)) {
        keysDown.delete(code);
        return true;
    }
    return false;
}
