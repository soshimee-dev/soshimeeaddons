import packetChat from "../../events/packetChat";
import tick from "../../events/tick";

function listener(message) {
	if (message !== "[BOSS] Storm: I should have known that I stood no chance.") return;
	let ticks = 104;

	const listener = () => {
		--ticks;
		Client.showTitle(" ", "§a" + (ticks / 20).toFixed(2), 0, 1000, 0);
		if (ticks <= 0) {
			tick.removeListener(listener);
			Client.showTitle(" ", " ", 0, 0, 0);
		}
	};
	tick.addListener(listener);

	// const time = 5200;
	// const startTime = new Date().getTime();
	// const trigger = register("step", () => {
	// 	const timeLeft = time - (new Date().getTime() - startTime);
	// 	Client.showTitle(" ", "§a" + (timeLeft / 1000).toFixed(2), 0, 1000, 0);
	// 	Client.showTitle(" ", "§a" + (timeLeft / 1000).toFixed(2), 0, 1000, 0);
	// 	if (timeLeft <= 0) {
	// 		trigger.unregister();
	// 		Client.showTitle(" ", " ", 0, 0, 0);
	// 	}
	// });
}

export function enable() {
	packetChat.addListener(listener);
}

export function disable() {
	packetChat.removeListener(listener);
}

export default { enable, disable };
