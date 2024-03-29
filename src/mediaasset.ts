class MediaAsset {
    name: string;
    loaded: boolean;

    constructor(name: string) {
        this.name = name;
        this.loaded = false;
    }

    // overload in subclasses
    load() {
        return new Promise<MediaAsset>((resolve): void => resolve(this));
    }

    // overload in subclasses
    clone() {
        return new MediaAsset(this.name);
    }
}

class ImageAsset extends MediaAsset {
    path: string;
    image: HTMLImageElement;

    constructor(name: string, path: string) {
        super(name);
        this.path = path;
        this.image = new Image();
    }

    load() {
        return new Promise<ImageAsset>((resolve) => {
            this.image.onload = _ => { this.loaded = true; resolve(this); };
            this.image.src = this.path;
        });
    }

    clone() {
        return new ImageAsset(this.name, this.path);
    }

    get width() {
        return this.image.width;
    }

    get height() {
        return this.image.height;
    }
}

class AudioAsset extends MediaAsset {
    path: string;
    audio: HTMLAudioElement;

    constructor(name: string, path: string) {
        super(name);
        this.path = path;
        this.audio = new Audio();
    }

    load() {
        return new Promise<AudioAsset>((resolve) => {
            this.audio.oncanplaythrough = _ => { this.loaded = true; resolve(this); };
            this.audio.src = this.path;
        });
    }

    clone() {
        return new AudioAsset(this.name, this.path);
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    get volume() {
        return this.audio.volume;
    }

    set volume(value) {
        this.audio.volume = value;
    }

    get paused() {
        return this.audio.paused;
    }

    get stopped() {
        return this.audio.currentTime === 0 || this.audio.ended;
    }

    get ended() {
        return this.audio.ended;
    }

    get muted() {
        return this.audio.muted;
    }

    set muted(value) {
        this.audio.muted = value;
    }

    get loop() {
        return this.audio.loop;
    }

    set loop(value) {
        this.audio.loop = value;
    }
}

function loadBulkAssets(arr: MediaAsset[]) {
    return Promise.all(arr.map(a => a.load()));
}

export { MediaAsset, ImageAsset, AudioAsset, loadBulkAssets };