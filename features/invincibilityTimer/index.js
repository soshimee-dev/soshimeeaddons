import Settings from "../../config";
import packetChat from "../../events/packetChat";
import tick from "../../events/tick";

let ticks = 0;

const overlayTrigger = register("renderOverlay", () => {
	const [x, y, scale] = [Settings.invincibilityTimerX, Settings.invincibilityTimerY, Settings.invincibilityTimerScale];
	Renderer.scale(scale);
	Renderer.drawStringWithShadow("§a" + (ticks / 20).toFixed(2) + "s", x * Renderer.screen.getWidth() / scale, y * Renderer.screen.getHeight() / scale);
}).unregister();

const tickListener = () => {
	--ticks;
	if (ticks <= 0) {
		tick.removeListener(tickListener);
		overlayTrigger.unregister();
	}
};

function chatListener(message) {
	if (message === "Your ⚚ Bonzo's Mask saved your life!" || message === "Your Bonzo's Mask saved your life!") {
		ticks = 60;
		tick.removeListener(tickListener);
		overlayTrigger.unregister();
		tick.addListener(tickListener);
		overlayTrigger.register();
	} else if (message === "Your Phoenix Pet saved you from certain death!") {
		ticks = 80;
		tick.removeListener(tickListener);
		overlayTrigger.unregister();
		tick.addListener(tickListener);
		overlayTrigger.register();
	}
}

export function enable() {
	packetChat.addListener(chatListener);
}

export function disable() {
	packetChat.removeListener(chatListener);
}

export default { enable, disable };
