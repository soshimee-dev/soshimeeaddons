import Settings from "../../config";
import packetChat from "../../events/packetChat";
import tick from "../../events/tick";

let ticks = 0;

const overlayTrigger = register("renderOverlay", () => {
	const [x, y, scale] = [Settings.padTickTimerX, Settings.padTickTimerY, Settings.padTickTimerScale];
	Renderer.scale(scale);
	Renderer.drawStringWithShadow((ticks > 13 ? "§a" : ticks > 6 ? "§6" : "§c") + (ticks / 20).toFixed(2) + "s", x * Renderer.screen.getWidth() / scale, y * Renderer.screen.getHeight() / scale);
}).unregister();

const tickListener = () => {
	--ticks;
	if (ticks <= 0) {
		ticks = 20;
	}
};

function chatListener(message) {
	if (message === "[BOSS] Storm: Pathetic Maxor, just like expected.") {
		ticks = 20;
		tick.addListener(tickListener);
		overlayTrigger.register();
	} else if (message === "[BOSS] Storm: I should have known that I stood no chance.") {
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
