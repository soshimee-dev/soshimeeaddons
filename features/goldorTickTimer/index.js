import Settings from "../../config";
import packetChat from "../../events/packetChat";
import tick from "../../events/tick";

let ticks = 0;

const overlayTrigger = register("renderOverlay", () => {
	const [x, y, scale] = [Settings.goldorTickTimerX, Settings.goldorTickTimerY, Settings.goldorTickTimerScale];
	Renderer.scale(scale);
	Renderer.drawStringWithShadow((ticks > 40 ? "§a" : ticks > 20 ? "§6" : "§c") + (ticks / 20).toFixed(2) + "s", x * Renderer.screen.getWidth() / scale, y * Renderer.screen.getHeight() / scale);
}).unregister();

const tickListener = () => {
	--ticks;
	if (ticks <= 0) {
		ticks = 60;
	}
};

function chatListener(message) {
	if (message === "[BOSS] Goldor: Who dares trespass into my domain?") {
		ticks = 60;
		tick.addListener(tickListener);
		overlayTrigger.register();
	} else if (message === "The Core entrance is opening!") {
		tick.removeListener(tickListener);
		overlayTrigger.unregister();
	}
}

const unloadTrigger = register("worldUnload", () => {
	tick.removeListener(tickListener);
	overlayTrigger.unregister();
}).unregister();

export function enable() {
	packetChat.addListener(chatListener);
	unloadTrigger.register();
}

export function disable() {
	packetChat.removeListener(chatListener);
	unloadTrigger.unregister();
}

export default { enable, disable };
