import "./vec.js";
import Display from "./display.js";
import Engine from "./engine.js";
import { initTools } from "./tools.js";

const display = new Display(() => {}, <HTMLCanvasElement>document.getElementById("can"), 1600, 900);
const engine = new Engine(() => {}, display, 60);
const buf = display.buf;

const mouse = engine.mouse;
const keyboard = engine.keyboard;
const gamepadManager  = engine.gamepadManager;

initTools(display);

export { display, buf, engine, mouse, keyboard, gamepadManager };
export * as tools from "./tools.js";