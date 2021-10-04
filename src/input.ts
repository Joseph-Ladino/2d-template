import type Display from './display.js';
import Vec from './vec.js';
import { screenPointToWorldPoint } from './tools.js';

class Mouse extends Vec {
    delta: Vec;
    can: HTMLCanvasElement;
    buf: CanvasRenderingContext2D;
    dsp: Display;

    dragStart: Vec;
    dragMin: number;

    lDown: boolean;
    lDrag: boolean;

    rDown: boolean;
    rDrag: boolean;

    lClick: boolean;
    rClick: boolean;

	constructor(display: Display) {
		super(0, 0);

		this.delta = new Vec();
		this.can = display.can;
		this.buf = display.buf;
		this.dsp = display;

		this.dragStart = new Vec();
		this.dragMin = 10 ** 2;

		this.lDown = false;
		this.lDrag = false;

		this.rDown = false;
		this.rDrag = false;

        this.lClick = false;
        this.rClick = false;

		this.init();
	}

	updatePos(e: MouseEvent) {
		let pos = screenPointToWorldPoint(this.dsp, e);
		this.delta = pos.sub(this);
		this.set(pos);
	}

	mousedown(e: MouseEvent) {
		this.updatePos(e);
		this.dragStart.set(this);

		this.lDown = this.lClick = e.button == 0;
		this.rDown = this.rClick = e.button == 2;
	}

	mousemove(e: MouseEvent) {
		this.updatePos(e);

		let deltaSq = this.dragStart.sub(this).magSq;

		this.lDrag = this.lDown && (this.lDrag || deltaSq > this.dragMin);
		this.rDrag = this.rDown && (this.rDrag || deltaSq > this.dragMin);
	}

	mouseup(e: MouseEvent) {
		this.updatePos(e);

        if(e.button == 0)
            this.lDown = this.lClick = false;
        else if(e.button == 2)
            this.rDown = this.rClick = false;
        
	}

    clearClicked() {
        this.lClick = false;
        this.rClick = false;
    }

	init() {
		document.onmousedown = (e) => this.mousedown(e);
		document.onmousemove = (e) => this.mousemove(e);
		document.onmouseup = (e) => this.mouseup(e);
	}
}

class Key {

    down: boolean;
    up: boolean;
    pressed: boolean;
    held: boolean;
    isPlaceholder: boolean;

	constructor() {
		this.down = false;
		this.up = true;
		this.pressed = false;
		this.held = false;
        this.isPlaceholder = false;
	}

	set(down: boolean) {
		this.down = down;
		this.pressed = down && this.up;
		this.held = down && !this.pressed;
		this.up = !down;
	}
}

class Keyboard {
    keys: { [key: string]: Key };
    blankKey: Key;
	constructor() {
		this.keys = {};
		this.blankKey = new Key();
		this.blankKey.isPlaceholder = true;

		this.init();
	}

	keyUpDown(e: KeyboardEvent) {
		if (!this.keys[e.key]) this.keys[e.key] = new Key();

		let key = this.keys[e.key];
		let down = e.type == "keydown";

		key.set(down);
	}

	key(k: string) {
		return this.keys[k] || this.blankKey;
	}

	down(k: string) {
		return this.key(k).down;
	}

	up(k: string) {
		return this.key(k).up;
	}

	pressed(k: string) {
		return this.key(k).pressed;
	}

	held(k: string) {
		return this.key(k).held;
	}

	clearPressed() {
		for (let k in this.keys) this.keys[k].pressed = false;
	}

	init() {
		document.onkeydown = (e) => this.keyUpDown(e);
		document.onkeyup = (e) => this.keyUpDown(e);
	}
}

export { Mouse, Key, Keyboard };
