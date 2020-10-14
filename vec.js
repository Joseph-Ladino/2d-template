class Vec {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	// vector arithmetic
	add(v) {
		return new Vec(this.x + v.x, this.y + v.y);
	}
	sub(v) {
		return new Vec(this.x - v.x, this.y - v.y);
	}
	mlt(v) {
		return new Vec(this.x * v.x, this.y * v.y);
	}
	div(v) {
		return new Vec(this.x / v.x, this.y / v.y);
	}

	// scalar arithmetic
	adds(n) {
		return new Vec(this.x + n, this.y + n);
	}
	subs(n) {
		return new Vec(this.x - n, this.y - n);
	}
	mlts(n) {
		return new Vec(this.x * n, this.y * n);
	}
	divs(n) {
		return new Vec(this.x / n, this.y / n);
	}

	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	static clone(v) {
		return new Vec(v.x, v.y);
	}

	get angle() {
		return Math.atan2(this.y, this.x);
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
		return this.divs(this.mag);
	}
}
