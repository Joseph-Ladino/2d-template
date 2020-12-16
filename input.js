class Mouse extends Vec {
	constructor(display) {
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

		this.init();
	}

	updatePos(e) {
		let pos = screenPointToWorldPoint(this.dsp, e);
		this.delta = pos.sub(this);
		this.set(pos);
	}

	mousedown(e) {
		this.updatePos(e);
		this.dragStart.set(this);

		this.lDown = e.button == 0;
		this.rDown = e.button == 2;
	}

	mousemove(e) {
		this.updatePos(e);

		let deltaSq = this.dragStart.sub(this).magSq;

		this.lDrag = this.lDown && (this.lDrag || deltaSq > this.dragMin);
		this.rDrag = this.rDown && (this.rDrag || deltaSq > this.dragMin);
	}

	mouseup(e) {
		this.updatePos(e);

		this.lDown = !(e.button == 0);
		this.rDown = !(e.button == 2);
	}

	init() {
		document.onmousedown = (e) => this.mousedown(e);
		document.onmousemove = (e) => this.mousemove(e);
		document.onmouseup = (e) => this.mouseup(e);
	}
}

class Key {
	constructor() {
		this.down = false;
		this.up = true;
		this.pressed = false;
		this.held = false;
	}

	set(down) {
		this.down = down;
		this.pressed = down && this.up;
		this.held = down && !this.pressed;
		this.up = !down;
	}
}

class Keyboard {
	constructor() {
		this.keys = {};
		this.blankKey = new Key();
		this.blankKey.isPlaceholder = true;

		this.init();
	}

	keyUpDown(e) {
		if (!this.keys[e.key]) this.keys[e.key] = new Key();

		let key = this.keys[e.key];
		let down = e.type == "keydown";

		key.set(down);
	}

	key(k) {
		return this.keys[k] || this.blankKey;
	}

	down(k) {
		return this.key(k).down;
	}

	up(k) {
		return this.key(k).up;
	}

	pressed(k) {
		return this.key(k).pressed;
	}

	held(k) {
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
