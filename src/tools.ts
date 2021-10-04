import Vec from "./vec.js";
import type Display from "./display.js";

let buf: CanvasRenderingContext2D;

export function initTools(display: Display) {
    buf = display.buf;

	// for console access
    Object.assign(window, { lerp, lerpv, shortestAngle, lerpRot, rotate, screenPointToWorldPoint, fillCircle, strokeCircle, fillRect, strokeRect, line });
}

export function lerp(n1: number, n2: number, t: number) {
	return (1 - t) * n1 + n2 * t;
}

export function lerpv(v1: Vec, v2: Vec, t: number) {
	return v1.mlts(1 - t).add(v2.mlts(t));
}

// see https://stackoverflow.com/a/14498790
export function shortestAngle(n1: number, n2: number) {
	return ((((n2 - n1) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
}

export function lerpRot(n1: number, n2: number, t: number) {
	n2 = n1 + shortestAngle(n1, n2);
	return lerp(n1, n2, t);
}

export function rotate(v: Vec, deg: number) {
	let sin = Math.sin(deg),
		cos = Math.cos(deg);

	return new Vec(v.x * cos - v.y * sin, v.y * cos + v.x * sin);
}

export function screenPointToWorldPoint(display: Display, v: Vec) {
	// translate by element offset and scale by ratio of buffer size to canvas size
	return new Vec(
		((v.x - display.can.offsetLeft) * display.width) / display.can.offsetWidth,
		((v.y - display.can.offsetTop) * display.height) / display.can.offsetHeight
	);
}

export function fillCircle(pos: Vec, radius: number, color = "white") {
	buf.save();
	buf.beginPath();

	buf.fillStyle = color;
	buf.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
	buf.fill();

	buf.restore();
}

export function strokeCircle(pos: Vec, radius: number, thickness = 2, color = "white") {
	buf.save();
	buf.beginPath();

	buf.lineWidth = thickness;
	buf.strokeStyle = color;
	buf.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
	buf.stroke();

	buf.restore();
}

export function fillRect(pos: Vec, size: Vec, color = "white", offset = new Vec()) {
	pos = pos.sub(offset);

	buf.save();
	buf.beginPath();

	buf.fillStyle = color;
	buf.fillRect(pos.x, pos.y, size.x, size.y);

	buf.restore();
}

export function strokeRect(pos: Vec, size: Vec, thickness = 2, color = "white", offset = new Vec()) {
	pos = pos.sub(offset);

	buf.save();
	buf.beginPath();

	buf.lineWidth = thickness;
	buf.strokeStyle = color;
	buf.strokeRect(pos.x, pos.y, size.x, size.y);

	buf.restore();
}

export function line(s: Vec, e: Vec, width = 10, color = "white") {
	buf.save();
	buf.beginPath();

	buf.strokeStyle = color;
	buf.lineWidth = width;
	buf.moveTo(s.x, s.y);
	buf.lineTo(e.x, e.y);
	buf.stroke();

	buf.restore();
}