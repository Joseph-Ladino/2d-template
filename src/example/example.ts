import { display, engine, mouse, tools} from "../globals.js";
import Player from "./player.js";

const worldOptions = {
    friction: 0.9,
    drawDebug: false,
};

const player = new Player(800, 350, 130, worldOptions);

// drawloop (runs as many times as possible per second)
function draw(alpha: number) {
    player.draw(alpha);
    tools.fillCircle(mouse, 2)
}

// gameloop (runs engine.fps times per second)
function loop(ms: number) {
    player.update(ms);
}

display.setDrawLoop(draw);
engine.setGameLoop(loop);
engine.start();