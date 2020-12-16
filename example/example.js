import "../vec.js";
import "../tools.js";
import Display from "../display.js";
import Engine from "../engine.js";
import Player from "./player.js";

const display = new Display(draw, document.getElementById("can"), 1600, 900);
const engine = new Engine(loop, display, 60);
const player = new Player(800, 450, 30);

window.friction = 0.9;

// drawloop (runs as many times as possible per second)
function draw(alpha) {
    player.draw(alpha);
    fillCircle(mouse, 2)
}

// gameloop (runs engine.fps times per second)
function loop(ms) {
    player.update();
}

engine.start();