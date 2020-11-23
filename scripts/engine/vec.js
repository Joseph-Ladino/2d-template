class Vec {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	// vector arithmetic
	add(v) { return new Vec(this.x + v.x, this.y + v.y); }
	sub(v) { return new Vec(this.x - v.x, this.y - v.y); }
	mlt(v) { return new Vec(this.x * v.x, this.y * v.y); }
	div(v) { return new Vec(this.x / v.x, this.y / v.y); }

	// scalar arithmetic
	adds(n) { return new Vec(this.x + n, this.y + n); }
	subs(n) { return new Vec(this.x - n, this.y - n); }
	mlts(n) { return new Vec(this.x * n, this.y * n); }
	divs(n) { return new Vec(this.x / n, this.y / n); }

	dot(v) { return this.x * v.x + this.y * v.y; }

    set(v) {
        this.x = v.x || 0;
        this.y = v.y || 0;
    }

	get clone() { return new Vec(this.x, this.y); }
	get angle() { return Math.atan2(this.y, this.x); }
	get abs()   { return new Vec(Math.abs(this.x), Math.abs(this.y)); }
	
    get mag()   { return Math.hypot(this.x, this.y); }
	get magSq() { return this.dot(this); }
	get unit()  { return this.divs(this.mag || 1); }
    
    get norml() { return new Vec(-this.y, this.x); }
    get normr() { return new Vec(this.y, -this.x); }
    get norm()  { return this.norml; }

    set mag(n) { this.set(this.unit.mlts(n)); }
}

window.Vec = Vec;