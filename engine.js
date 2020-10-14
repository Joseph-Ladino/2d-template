class Engine {
    constructor(gameLoop, display, fps = 60) {
        this.gameLoop = gameLoop;
        this.display = display;
        this.fps = fps;
        
        this.hnd = false;
        this.timePrev = false;
        this.timeStep = 1000 / fps;
        this.timeDelta = 0;
        this.elapsedTime = this.timeStep;
        
        this._loop = now => this.loop(now);
    }

    loop(now) {
        this.start();
        this.timeDelta = now - this.timePrev;
        this.elapsedTime += this.timeDelta;
        this.timePrev = now;

        if(this.elapsedTime >= 5 * this.timeStep) this.elapsedTime = 0;

        while(this.elapsedTime >= this.timeStep) {
            this.gameLoop(this.timeStep);
            this.elapsedTime -= this.timeStep;
        }

        this.display.draw(this.elapsedTime / this.timeStep);
    }

    get fps() {
        return 1000 / this.timeStep;
    }
    set fps(_fps) {
        this.timeStep = 1000 / _fps;
    }

    start() {
        this.hnd = window.requestAnimationFrame(this._loop);
    }

    stop() {
        window.cancelAnimationFrame(this.hnd);
    }
}