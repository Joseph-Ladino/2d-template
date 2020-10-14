const display = new Display(draw, document.getElementById("can"), 1600, 900);
const engine = new Engine(loop, display, 2);
const buf = display.buf;

var v0 = new Vec(800, 450)
var v1 = new Vec(300, 0);
var rot = 0;
var lastRot = 0;

function draw(alpha) {
    let pos = v0.add(rotate(v1, lerp(lastRot, rot, alpha), true));

    circle(v0, 5);
    circle(pos, 25, "red");
}

function loop() {
    lastRot = rot;
    rot = (rot + 0.05) % (2 * Math.PI);
}

engine.start();