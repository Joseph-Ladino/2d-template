export default class Vec {
    x: number;
    y: number;

	constructor(x?: number, y?: number) {
		this.x = x || 0;
		this.y = y || 0;

        // just useful to have available
        Object.assign(Math, {
            PI2: Math.PI * 2,
            PIHALF: Math.PI / 2,
            PIQUARTER: Math.PI / 4
        });
    }

	// vector arithmetic
	add(v: Vec) {
		return new Vec(this.x + v.x, this.y + v.y);
	}
	sub(v: Vec) {
		return new Vec(this.x - v.x, this.y - v.y);
	}
	mlt(v: Vec) {
		return new Vec(this.x * v.x, this.y * v.y);
	}
	div(v: Vec) {
		return new Vec(this.x / v.x, this.y / v.y);
	}

	// scalar arithmetic
	adds(n: number) {
		return new Vec(this.x + n, this.y + n);
	}
	subs(n: number) {
		return new Vec(this.x - n, this.y - n);
	}
	mlts(n: number) {
		return new Vec(this.x * n, this.y * n);
	}
	divs(n: number) {
		return new Vec(this.x / n, this.y / n);
	}

	dot(v: Vec) {
		return this.x * v.x + this.y * v.y;
	}

	set(v: Vec) {
		this.x = v.x || 0;
		this.y = v.y || 0;
	}

	project(v: Vec) {
		let dp = this.dot(v);
		let m = v.mag;
		return new Vec(dp, dp).mlts(1 / m);
	}

	// mapped between 0 and 2 PI
	get angle(): number {
		return (Math.atan2(this.y, this.x) + (Math.PI * 2)) % (Math.PI * 2);
	}
	// mapped between -PI and PI
	get angle2(): number {
		return Math.atan2(this.y, this.x);
	}

	set angle(rad: number) {
		this.set(new Vec(Math.cos(rad), Math.sin(rad)).mlts(this.mag));
	}

	get clone() {
		return new Vec(this.x, this.y);
	}
	get abs() {
		return new Vec(Math.abs(this.x), Math.abs(this.y));
	}

	get mag() {
		return Math.hypot(this.x, this.y);
	}
	get magSq() {
		return this.dot(this);
	}
	get unit() {
		return this.divs(this.mag || 1);
	}

	get norml() {
		return new Vec(-this.y, this.x);
	}
	get normr() {
		return new Vec(this.y, -this.x);
	}
	get norm() {
		return this.norml;
	}

	set mag(n) {
		this.set(this.unit.mlts(n));
	}
}

(<any>globalThis).Vec = Vec;