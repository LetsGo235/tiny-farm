// sound.js
export class SoundManager {
    constructor() {
        // Short sound effects
        this.sfx = {
            blip: new Audio('audio/blip.wav'),
            plant: new Audio('audio/plant.wav'),
            harvest: new Audio('audio/harvest.wav'),
        };

        // Background music per "area"
        this.music = {
            farm: new Audio('audio/farm_theme.mp3'),
        };

        this.currentMusic = null;

        // Loop music
        Object.values(this.music).forEach((a) => {
            a.loop = true;
            a.volume = 0.5;
        });
    }

    playMusic(name) {
        const track = this.music[name];
        if (!track) return;

        if (this.currentMusic && this.currentMusic !== track) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        this.currentMusic = track;
        // Note: some browsers require a user gesture before playback works.
        this.currentMusic.play().catch(() => {
            // Ignore autoplay errors; music will start after first key press if needed.
        });
    }

    playSfx(name) {
        const s = this.sfx[name];
        if (!s) return;
        // Restart from beginning so quick repeated sounds work
        s.currentTime = 0;
        s.play().catch(() => { });
    }
}
