import { Circle } from '../shapes.js';
import { ImageAsset } from "../mediaasset.js";
import { lerp, lerpv, strokeCircle } from "../tools.js";
import { buf } from "../globals.js";
import Vec from '../vec.js';

class Buckshot extends Circle {
    origin: Vec;
    old: Vec;
    vel: Vec;
    
    minRadius = 25;
    maxDst = 300;
    cull = false;
    scale = 0.75;
    minScale = 0.5;
    maxScale = 3.5;

    sprite: ImageAsset;

    options: any;

    constructor(pos: Vec, vel: Vec, options: any = {}) {
        super(pos.x, pos.y, 25);

        this.options = options;
        this.origin = pos.clone;
        this.old = pos.clone;
        this.vel = vel;

        this.sprite = new ImageAsset("sprinkles", "assets/projectile.png");
        this.sprite.load();
    }

    get dst() {
        return this.origin.sub(this.pos).mag;
    }

    update(ms: number) {
        this.old.set(this.pos);
        this.pos.set(this.pos.add(this.vel));

        this.scale = lerp(this.minScale, this.maxScale, Math.min(1, this.dst / this.maxDst));
        this.radius = this.scale * this.minRadius;

        this.cull = this.dst >= this.maxDst;
    }

    draw(alpha: number) {
        let interp = lerpv(this.old, this.pos, alpha);

        buf.save();
        buf.translate(interp.x, interp.y);
        buf.rotate(this.vel.angle);
        buf.drawImage(this.sprite.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        buf.restore();

        if(this.options.drawDebug) strokeCircle(interp, this.radius);
    }
}

export { Buckshot };