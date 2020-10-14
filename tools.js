function lerp(n1, n2, t) {
	t = Math.max(Math.min(1, t), 0);

	return (1 - t) * n1 + n2 * t;
}

function lerpv(v1, v2, t) {
	t = Math.max(Math.min(1, t), 0);

	return v1.mlts(1 - t).add(v2.mlts(t));
}

function screenPointToWorldPoint(v) {
	// translate by element offset and scale by ratio of buffer size to element size
	return new Vec(
		((v.x - display.can.offsetLeft) / display.can.offsetWidth) * display.width,
		((v.y - display.can.offsetTop) / display.can.offsetHeight) * display.height
	);
}

function rotate(v, deg, clockWise = false) {
	let sin = Math.sin(deg),
        cos = Math.cos(deg);
        
	return clockWise ? new Vec(v.x * cos - v.y * sin, v.x * sin + v.y * cos) : new Vec(v.x * cos + v.y * sin, v.y * cos - v.x * sin);
}

function circle(v, radius, color = "white") {
	buf.save();
	buf.beginPath();

	buf.fillStyle = color;
	buf.arc(v.x, v.y, radius, 0, 2 * Math.PI);
	buf.fill();

	buf.restore();
}

function rect(pos, size, color = "white", offset = new Vec()) {
    pos = pos.add(offset);

    buf.save();
    buf.beginPath();

    buf.fillStyle = color;
    buf.fillRect(pos.x, pos.y, size.x, size.y);
    
    buf.restore();
}

function line(s, e, width = 10, color = "white") {
	buf.save();
	buf.beginPath();

	buf.strokeStyle = color;
	buf.lineWidth = width;
	buf.moveTo(s.x, s.e);
	buf.lineTo(e.x, e.y);
	buf.stroke();

	buf.restore();
}
