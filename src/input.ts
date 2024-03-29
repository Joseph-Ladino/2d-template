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
		let pos = screenPointToWorldPoint(this.dsp, <Vec><unknown>e);
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

class InputButton {

    down: boolean;
    up: boolean;
    pressed: boolean;
    held: boolean;
    isPlaceholder: boolean;

	static blank = new InputButton(true);

	constructor(placeholder: boolean = false) {
		this.down = false;
		this.up = true;
		this.pressed = false;
		this.held = false;
        this.isPlaceholder = placeholder;
	}

	// order of setting is important
	set(down: boolean) {
		this.down = down;
		this.pressed = down && this.up;
		this.held = down && !this.pressed;
		this.up = !down;
	}
}

class Keyboard {
    keys: { [key: string]: InputButton };
	constructor() {
		this.keys = {};

		this.init();
	}

	keyUpDown(e: KeyboardEvent) {
		if (!this.keys[e.key]) this.keys[e.key] = new InputButton();

		let key = this.keys[e.key];
		let down = e.type == "keydown";

		key.set(down);
	}

	key(k: string) {
		return this.keys[k] || InputButton.blank;
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


class Gamepad {
	triggers: number[];
	buttons: InputButton[];
	axes: number[];
	stickDeadzone = 0.05;
	triggerDeadzone = 0.05;
	connected = false;

	static buttonMap: {[key: string]: number} = {
		"a": 0,
		"b": 1,
		"x": 2,
		"y": 3,
		"lShoulder": 4,
		"rShoulder": 5,
		"lTrigger": 6,
		"rTrigger": 7,
		"select": 8,
		"start": 9,
		"lStick": 10,
		"rStick": 11,
		"dpadUp": 12,
		"dpadDown": 13,
		"dpadLeft": 14,
		"dpadRight": 15,
		"home": 16
	};

	constructor() {
		this.triggers = [0, 0];
		this.buttons = Array.from({ length: 18 }, () => new InputButton());
		this.axes = [0, 0, 0, 0];
	}

	button(name: string) {
		return this.buttons[Gamepad.buttonMap[name]] || InputButton.blank;
	}

	down(name: string) {
		return this.button(name).down;
	}

	up(name: string) {
		return this.button(name).up;
	}

	pressed(name: string) {
		return this.button(name).pressed;
	}

	reset() {
		this.triggers = [0, 0];
		this.buttons.forEach(b => b.set(false));
		this.axes = [0, 0, 0, 0];
	}

	setButtons(arr: readonly GamepadButton[]) {
		for (let i in arr) 
			this.buttons[i].set(arr[i].pressed);

		this.triggers[0] = arr[6].value > this.triggerDeadzone ? arr[6].value : 0;
		this.triggers[1] = arr[7].value > this.triggerDeadzone ? arr[7].value : 0;
	}

	setAxes(arr: readonly number[]) {
		for (let i in arr) 
			this.axes[i] = Math.abs(arr[i]) > this.stickDeadzone ? arr[i] : 0;
	}

	setFromJSGamepad(gp: globalThis.Gamepad) {
		this.setButtons(gp.buttons);
		this.setAxes(gp.axes);
	}

	clearPressed() {
		this.buttons.forEach(b => b.pressed = false);
	}

	// TODO: decide whether to replace hardcoded index with map

	get lStick() { return new Vec(this.axes[0], this.axes[1]); }
	get rStick() { return new Vec(this.axes[2], this.axes[3]); }

	get a() { return this.buttons[0]; }
	get b() { return this.buttons[1]; }
	get x() { return this.buttons[2]; }
	get y() { return this.buttons[3]; }

	get lShoulder() { return this.buttons[4]; }
	get rShoulder() { return this.buttons[5]; }

	get lTrigger() { return this.triggers[0]; }
	get rTrigger() { return this.triggers[1]; }

	get select() { return this.buttons[8]; }
	get start()  { return this.buttons[9]; }

	get lStickButton() { return this.buttons[10]; }
	get rStickButton() { return this.buttons[11]; }
	
	get dpadUp()    { return this.buttons[12]; }
	get dpadDown()  { return this.buttons[13]; }
	get dpadLeft()  { return this.buttons[14]; }
	get dpadRight() { return this.buttons[15]; }
	get home()      { return this.buttons[16]; }
}

class GamepadManager {
	gamepads: Gamepad[];

	constructor() {
		this.gamepads = Array.from({ length: 4 }, () => new Gamepad());
	}

	getGamepad(index: number) {
		return this.gamepads[index];
	}

	pollGamepads() {
		let gp = navigator.getGamepads() || [];

		for (let g of gp) {
			if (g) this.gamepads[g.index].setFromJSGamepad(g);
		}
	}

	connectHandler(e: GamepadEvent) {
		this.gamepads[e.gamepad.index].connected = true;
		this.pollGamepads();
	}
	disconnectHandler(e: GamepadEvent) {
		this.gamepads[e.gamepad.index].connected = false;
	}

	clearPressed() {
		this.gamepads.forEach(g => g.clearPressed());
	}

	init() {
		window.addEventListener("gamepadconnected", (e) => this.connectHandler(e));
		window.addEventListener("gamepaddisconnected", (e) => this.disconnectHandler(e));
	}
}


export { Mouse, Keyboard, Gamepad, GamepadManager, InputButton };
