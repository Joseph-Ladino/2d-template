function lerp(n1, n2, t) {
	t = Math.max(Math.min(1, t), 0);

	return (1 - t) * n1 + n2 * t;
}

function lerpv(v1, v2, t) {
	t = Math.max(Math.min(1, t), 0);

	return v1.mlts(1 - t).add(v2.mlts(t));
}

function screenPointToWorldPoint(display, v) {
	// translate by element offset and scale by ratio of buffer size to canvas size
	return new Vec(
		((v.x - display.can.offsetLeft) / display.can.offsetWidth) * display.width,
		((v.y - display.can.offsetTop) / display.can.offsetHeight) * display.height
	);
}

function rotate(v, deg) {
	let sin = Math.sin(deg),
        cos = Math.cos(deg);
        
	return new Vec(v.x * cos + v.y * sin, v.y * cos - v.x * sin);
}

function fillCircle(pos, radius, color = "white") {
	buf.save();
	buf.beginPath();

	buf.fillStyle = color;
	buf.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
	buf.fill();

	buf.restore();
}

function fillRect(pos, size, color = "white", offset = new Vec()) {
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

Object.assign(window, { lerp, lerpv, screenPointToWorldPoint, fillCircle, fillRect, line })