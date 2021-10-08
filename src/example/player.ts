import Vec from "../vec.js";
import { Circle } from "../shapes.js"
import { Buckshot } from "./projectile.js";
import { mouse, keyboard, buf, gamepadManager } from "../globals.js"
import { ImageAsset, AudioAsset, loadBulkAssets } from "../mediaasset.js";
import { lerp, lerpRot, lerpv, shortestAngle, strokeCircle } from "../tools.js";
import type { InputButton, Gamepad as GP } from "../input.js"

export default class Player extends Circle {

    options: any;
	gamepad: GP;

    old: Vec;
    vel: Vec;
    moveSpeed = 5;
    hp = 100;

    rot = 0;
    oldRot = 0;
    halfRotMs = 60;

    bullets: Buckshot[] = [];

    sprite: ImageAsset;
    backgroundTrack: AudioAsset;
    gunshotSound: AudioAsset;

	constructor(x = 0, y = 0, radius = 20, worldOptions = {}) {
		super(x, y, radius);

        this.options = worldOptions;
		this.gamepad = gamepadManager.gamepads[0];

		this.old = new Vec(x, y);
		this.vel = new Vec(0, 0);

		this.sprite = new ImageAsset("icecream", "assets/player.png");
		this.backgroundTrack = new AudioAsset("icecream bg track", "assets/icecream.mp3");
		this.gunshotSound = new AudioAsset("icecream gun", "assets/gunshot.mp3");

		this.backgroundTrack.loop = true;
		this.backgroundTrack.muted = true;
		this.backgroundTrack.volume = 0.35;

		loadBulkAssets([this.sprite, this.backgroundTrack, this.gunshotSound]).then((_) => this.backgroundTrack.audio.play());
	}

	getInput(name: string) : InputButton {
		let gamepad = gamepadManager.getGamepad(0);
		let gpButton = gamepad[this.options.gamepadControls[name]];
		let kbButton = keyboard.key(this.options.keyboardControls[name]);

		if(gamepad.connected && gpButton && gpButton.down) {
			return gpButton;
		} else {
			return kbButton;
		}
	}

	get angle() {
		return mouse.sub(this.pos).angle;
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

		let bullet = new Buckshot(this.pos.add(bulletSpawnPos), bulletSpawnVel, this.options);

		this.bullets.push(bullet);
	}

	update(ms: number) {
		this.old.set(this.pos);

		if (mouse.lClick || this.getInput("shoot").pressed) this.shoot();

		let acc = new Vec(0, 0);

		// typescript workaround
		function subBool(b1: boolean, b2: boolean): number {
			return <number><unknown>b1 - <number><unknown>b2;
		}

		// -1 == left; +1 == right; 0 == no direction
		acc.x = subBool(this.getInput("right").down, this.getInput("left").down);
		acc.y = subBool(this.getInput("down").down, this.getInput("up").down);
		acc.mag = this.moveSpeed;

		let vel = this.vel.add(acc).mlts(this.options.friction);

		this.vel.set(vel);
		this.pos.set(this.pos.add(vel));

		this.updateRot(ms);

		this.bullets.forEach((b) => b.update(ms));
		this.bullets = this.bullets.filter((b) => !b.cull);
	}

	updateRot(ms: number) {
		this.oldRot = this.rot;

		let sAngle = shortestAngle(this.rot, this.angle);
		let scaledTime = (this.halfRotMs * Math.abs(sAngle)) / Math.PI;
		let lerpAlpha = Math.min(ms / scaledTime, 1);

		this.rot = (lerp(this.rot, this.rot + sAngle, lerpAlpha) + (Math.PI * 2)) % (Math.PI * 2);
	}

	draw(alpha: number) {
		if (!this.sprite.loaded) return;

		let rotOffset = Math.PI * 0.5;

		let interp = lerpv(this.old, this.pos, alpha);
		let interpRot = lerpRot(this.oldRot + rotOffset, this.rot + rotOffset, alpha); // -90deg to match the sprite

		buf.save();
		buf.translate(interp.x, interp.y);
		buf.rotate(interpRot);
		buf.drawImage(this.sprite.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
		buf.restore();

		if (this.options.drawDebug) strokeCircle(interp, this.radius);

		this.bullets.forEach((b) => b.draw(alpha));
	}
}