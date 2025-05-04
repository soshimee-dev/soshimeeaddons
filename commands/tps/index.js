/// <reference types="../../../CTAutocomplete" />

import chat from "../../utils/chat";
import getTPS from "../../utils/tps";

export default register("command", (ticks = 50) => {
	ticks = parseInt(ticks);
	if (ticks === NaN) return;
	chat.chat("Calculating TPS over " + ticks + " ticks...");
	getTPS(ticks).then(tps => {
		const color = tps > 19 ? "§a" : tps > 17 ? "§6" : "§c";
		chat.chat("TPS: " + color + tps.toFixed(2));
	}).catch(() => {
		chat.chat("§cTPS timed out");
	});
}).setName("tps").unregister();
