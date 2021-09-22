import { Circle } from "../shapes.js"
import { ImageAsset, AudioAsset, loadBulkAssets } from "../mediaasset.js";
import { Buckshot } from "./projectile.js";

export default class Player extends Circle {
    constructor(x = 0, y = 0, radius = 20) {
        super(x, y, radius);

        this.old = new Vec(x, y);
        this.vel = new Vec(0, 0);
        this.moveSpeed = 5;
        this.hp = 100;

        this.rot = 0;
        this.oldRot = 0;
        this.halfRotMs = 60;

        this.bullets = [];

        this.sprite = new ImageAsset("icecream", 'assets/player.png');
        this.backgroundTrack = new AudioAsset("icecream bg track", 'assets/icecream.mp3');
        this.gunshotSound = new AudioAsset("icecream gun", 'assets/gunshot.mp3');

        this.backgroundTrack.loop = true;
        this.backgroundTrack.muted = true;

        loadBulkAssets([this.sprite, this.backgroundTrack, this.gunshotSound]).then(_ => this.backgroundTrack.audio.play());
    }

    get angle() {
        return (mouse.sub(this.pos)).angle;
    }

    shoot() {
        this.gunshotSound
            .clone()
            .load()
            .then((s) => s.play());
        
        let bulletSpawnPos = new Vec(this.radius + 5, 0);
        bulletSpawnPos.angle = this.rot;

        let bulletSpawnVel = new Vec(5, 0);
        bulletSpawnVel.angle = this.rot;

        let bullet = new Buckshot(this.pos.add(bulletSpawnPos), bulletSpawnVel);
        
        this.bullets.push(bullet);
    }

    update(ms) {
        this.old.set(this.pos);

        if(mouse.lClick) this.shoot();

        let acc = new Vec(0, 0);

        // -1 == left; +1 == right; 0 == no direction
        acc.x = keyboard.down('d') - keyboard.down('a');
        acc.y = keyboard.down('s') - keyboard.down('w');
        acc.mag = this.moveSpeed;

        let vel = this.vel.add(acc).mlts(friction);

        this.vel.set(vel);
        this.pos.set(this.pos.add(vel));

        this.updateRot(ms);

        this.bullets.forEach(b => b.update(ms));
        this.bullets = this.bullets.filter(b => !b.cull);
    }

    updateRot(ms) {
        this.oldRot = this.rot;

        let sAngle = shortestAngle(this.rot, this.angle);
        let scaledTime = this.halfRotMs * Math.abs(sAngle) / Math.PI;
        let lerpAlpha = Math.min(ms / scaledTime, 1);

        this.rot = (lerp(this.rot, this.rot + sAngle, lerpAlpha) + Math.PI2) % Math.PI2;
    }

    draw(alpha) {
		if (!this.sprite.loaded) return;

        let rotOffset = Math.PIHALF;

		let interp = lerpv(this.old, this.pos, alpha);
		let interpRot = lerpRot(this.oldRot + rotOffset, this.rot + rotOffset, alpha); // -90deg to match the sprite

		buf.save();
		buf.translate(interp.x, interp.y);
		buf.rotate(interpRot);
		buf.drawImage(this.sprite.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2, );
		buf.restore();

        strokeCircle(interp, this.radius);

        this.bullets.forEach(b => b.draw(alpha));
	}
}