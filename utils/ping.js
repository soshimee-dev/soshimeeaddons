import Promise from "../../PromiseV2";
import * as packetChat from "../events/packetChat";

export function getPing(timeout = 5000) {
	const id = "saping:" + Math.random().toFixed(8).substring(2);
	const initial = new Date().getTime();
	let done = false;

	ChatLib.command(id);

	return new Promise((resolve, reject) => {
		const listener = (message, _, event) => {
			if (message !== "Unknown command. Type \"/help\" for help. ('" + id + "')" && message !== "Unknown command. Type \"help\" for help. ('" + id + "')") return;
			packetChat.removeListener(listener);
			resolve(new Date().getTime() - initial);
			done = true;
			cancel(event);
		};
		packetChat.addListener(listener);

		setTimeout(() => {
			if (!done) {
				packetChat.removeListener(listener);
				reject();
				done = true;
			}
		}, timeout);
	});
}

export default getPing;