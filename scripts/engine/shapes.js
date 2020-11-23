class Rectangle {
    constructor(x, y, width, height) {
        this.pos = new Vec(x, y);
        this.size = new Vec(width, height);
        this.halfSize = this.size.mlts(0.5);
    }

    pointOverlap(p) {
        let tl = this.tl;
        let br = this.br;

        return p.x <= br.x && p.x >= tl.x && p.y <= br.y && p.y >= tl.y;
    }

    rectOverlap(r) {
        let tl1 = this.tl;
        let br1 = this.br;
        let tl2 = r.tl;
        let br2 = r.br;

        return !(tl1.x >= br2.x || br1.x <= tl2.x || tl1.y >= br2.y || br1.y <= tl2.y);
    }

    get tl() { return this.pos.sub(this.halfSize); }
    get br() { return this.pos.add(this.halfSize); }
    get tr() { return new Vec(this.pos.x + this.size.x, this.pos.y - this.size.y); }
    get bl() { return new Vec(this.pos.x - this.size.x, this.pos.y + this.size.y); }

    get verts() { return [this.tl, this.tr, this.br, this.bl]; }
    get sides() { 
        return [
            this.tr.sub(this.tl),
            this.br.sub(this.tr),
            this.bl.sub(this.br),
            this.tl.sub(this.bl)    
        ]
    }
}

class Circle {
    constructor(x, y, radius) {
        this.pos = new Vec(x, y);
        this.radius = radius;
    }

    pointOverlap(p) {
        return this.pos.sub(p).magSq <= this.radius ** 2;
    }

    circleOverlap(c) {
        return this.pos.sub(c.pos).magSq <= (this.radius + c.radius) ** 2;
    }

    draw() {
        fillCircle(this.pos, this.radius, "red")
    }
}

export { Rectangle, Circle }