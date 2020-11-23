import { Circle } from "../engine/shapes.js"

export default class Player extends Circle {
    constructor(x = 0, y = 0, radius = 20) {
        super(x, y, radius);

        this.old = new Vec(x, y);
        this.vel = new Vec(0, 0);
        this.moveSpeed = 5;
        this.hp = 100;

        this.color = "white";
    }

    update() {
        this.old.set(this.pos);

        let acc = new Vec(0, 0);

        // -1 == left; +1 == right; 0 == no direction
        acc.x = keyboard.down('d') - keyboard.down('a');
        acc.y = keyboard.down('s') - keyboard.down('w');
        acc.mag = this.moveSpeed;

        let vel = this.vel.add(acc).mlts(friction);

        this.vel.set(vel);
        this.pos.set(this.pos.add(vel));

        this.color = this.pointOverlap(mouse) ? 'red' : 'white';
    }

    draw(alpha) {
        let interp = lerpv(this.old, this.pos, alpha);
        fillCircle(interp, this.radius, this.color);
    }
}