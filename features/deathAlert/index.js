import Settings from "../../config";
import packetChat from "../../events/packetChat";

function listener(message) {
	const match = message.match(/^ ☠ (\S*) .* and became a ghost.$/);
	if (!match) return;
	if (/^ ☠ .* disconnected and became a ghost.$/.test(message)) return;
	const player = match[1] === "You" ? Player.getName() : match[1];
	const msg = Settings.deathAlertMessage.replaceAll("{player}", player).replaceAll("{message}", message);
	ChatLib.command("party chat " + msg);
}

export function enable() {
	packetChat.addListener(listener);
}

export function disable() {
	packetChat.removeListener(listener);
}

export default { enable, disable };
