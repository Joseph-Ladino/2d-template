function lerp(n1, n2, t) {
	return (1 - t) * n1 + n2 * t;
}

function lerpv(v1, v2, t) {
	return v1.mlts(1 - t).add(v2.mlts(t));
}

// see https://stackoverflow.com/a/14498790
function shortestAngle(n1, n2) {
	return ((((n2 - n1) % Math.PI2) + Math.PI * 3) % Math.PI2) - Math.PI;
}

function lerpRot(n1, n2, t) {
	n2 = n1 + shortestAngle(n1, n2);
	return lerp(n1, n2, t);
}

function rotate(v, deg) {
	let sin = Math.sin(deg),
		cos = Math.cos(deg);

	return new Vec(v.x * cos - v.y * sin, v.y * cos + v.x * sin);
}

function screenPointToWorldPoint(display, v) {
	// translate by element offset and scale by ratio of buffer size to canvas size
	return new Vec(
		((v.x - display.can.offsetLeft) * display.width) / display.can.offsetWidth,
		((v.y - display.can.offsetTop) * display.height) / display.can.offsetHeight
	);
}

function fillCircle(pos, radius, color = "white") {
	buf.save();
	buf.beginPath();

	buf.fillStyle = color;
	buf.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
	buf.fill();

	buf.restore();
}

function strokeCircle(pos, radius, thickness = 2, color = "white") {
	buf.save();
	buf.beginPath();

	buf.lineWidth = thickness;
	buf.strokeStyle = color;
	buf.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
	buf.stroke();

	buf.restore();
}

function fillRect(pos, size, color = "white", offset = new Vec()) {
	pos = pos.sub(offset);

	buf.save();
	buf.beginPath();

	buf.fillStyle = color;
	buf.fillRect(pos.x, pos.y, size.x, size.y);

	buf.restore();
}

function strokeRect(pos, size, thickness = 2, color = "white", offset = new Vec()) {
	pos = pos.sub(offset);

	buf.save();
	buf.beginPath();

	buf.lineWidth = thickness;
	buf.strokeStyle = color;
	buf.strokeRect(pos.x, pos.y, size.x, size.y);

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

Object.assign(window, { lerp, lerpv, shortestAngle, lerpRot, rotate, screenPointToWorldPoint, fillCircle, strokeCircle, fillRect, strokeRect, line });
