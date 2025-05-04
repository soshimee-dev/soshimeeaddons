/// <reference types="../../../CTAutocomplete" />

import chat from "../../utils/chat";
import getPing from "../../utils/ping";

export default register("command", () => {
	getPing().then(ping => {
		const color = ping < 300 ? "§a" : ping < 500 ? "§6" : "§c";
		chat.chat("Ping: " + color + ping + "§rms");
	}).catch(() => {
		chat.chat("§cPing timed out");
	});
}).setName("ping").unregister();
