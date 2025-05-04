import Settings from "../../config";
import ping from "../../utils/ping";

let currentPing = -1;

const overlayTrigger = register("renderOverlay", () => {
	const [x, y, scale] = [Settings.pingDisplayX, Settings.pingDisplayY, Settings.pingDisplayScale];
	Renderer.scale(scale);
	Renderer.drawStringWithShadow(currentPing + "ms", x * Renderer.screen.getWidth() / scale, y * Renderer.screen.getHeight() / scale);
}).unregister();

const updateTrigger = register("step", () => {
	switch (Settings.pingDisplayType) {
		case 0: {
			currentPing = ping.getPingServerList();
			break;
		}
		case 1: {
			ping.getPingInGame().then(ping => currentPing = ping).catch();
			break;
		}
	}
}).setDelay(10).unregister();

export function enable() {
	overlayTrigger.register();
	updateTrigger.register();
}

export function disable() {
	overlayTrigger.unregister();
	updateTrigger.unregister();
}

export default { enable, disable };
