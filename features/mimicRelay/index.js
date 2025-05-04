import packetChat from "../../events/packetChat";

function listener(message) {
	const match = message.match(/^Party > (.*?): (.*)$/);
	if (!match) return;
	let [, player, msg] = match;
	player = player.split(" ").pop();
	if (msg === "$SKYTILS-DUNGEON-SCORE-MIMIC$") return;
	if (!/mimic/i.test(msg)) return;
	setTimeout(() => ChatLib.command("party chat $SKYTILS-DUNGEON-SCORE-MIMIC$"), 500);
}

export function enable() {
	packetChat.addListener(listener);
}

export function disable() {
	packetChat.removeListener(listener);
}

export default { enable, disable };
