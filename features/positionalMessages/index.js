import PogObject from "../../../PogData";
import chat from "../../utils/chat";
import saCommand from "../../events/saCommand";
import packetPlayer from "../../events/playerPosition";
import clipboard from "../../utils/clipboard";

const data = new PogObject("soshimeeaddons", {
	enabled: true,
	messages: []
}, "./data/positionalMessages.json");

let inIndex = [];

function playerListener(x, y, z) {
	if (!data.enabled) return;
	for (let i = 0; i < data.messages.length; ++i) {
		if (!isPositionInVolume([x, y, z], data.messages[i].volume)) {
			delete inIndex[i];
			continue;
		}
		if (inIndex[i]) continue;
		inIndex[i] = true;
		let i2 = i;
		chat.chat("Positional Messages: " + data.messages[i2].delay + " - " + data.messages[i2].message);
		setTimeout(() => {
			ChatLib.command("party chat " + data.messages[i2].message);
		}, data.messages[i].delay)
	}
}

function commandListener(type, ...args) {
	if (!args) args = [];
	args = args.filter(arg => arg !== null);
	if (type === "toggle") {
		data.enabled = !data.enabled;
		if (data.enabled) chat.chat("Positional Messages enabled");
		else chat.chat("Positional Messages disabled");
	} else if (type === "list" ) {
		chat.chat("Positional messages:")
		for (let i = 0; i < data.messages.length; ++i) {
			let message = data.messages[i];
			chat.chat(i + ": " + message.volume.join() + "+" + message.delay + " -> " + message.message);
		}
	} else if (type === "add") {
		if (args.length < 8) return;
		const x1 = parseFloat(args[0]) < parseFloat(args[3]) ? parseFloat(args[0]) : parseFloat(args[3]);
		const y1 = parseFloat(args[1]) < parseFloat(args[4]) ? parseFloat(args[1]) : parseFloat(args[4]);
		const z1 = parseFloat(args[2]) < parseFloat(args[5]) ? parseFloat(args[2]) : parseFloat(args[5]);
		const x2 = parseFloat(args[0]) > parseFloat(args[3]) ? parseFloat(args[0]) : parseFloat(args[3]);
		const y2 = parseFloat(args[1]) > parseFloat(args[4]) ? parseFloat(args[1]) : parseFloat(args[4]);
		const z2 = parseFloat(args[2]) > parseFloat(args[5]) ? parseFloat(args[2]) : parseFloat(args[5]);
		const delay = parseInt(args[6]);
		const message = args.splice(7).join(" ");
		data.messages.push({ volume: [x1, y1, z1, x2, y2, z2], delay, message });
		chat.chat("Added positional message:")
		chat.chat("Volume: " + [x1, y1, z1, x2, y2, z2].join());
		chat.chat("Delay: " + delay);
		chat.chat("Message: " + message);
	} else if (type === "remove") {
		if (args.length < 1) return;
		data.messages.splice(args[0], 1);
		chat.chat("Removed positional message");
	} else if (type === "import") {
		data.messages = JSON.parse(clipboard.paste());
		ChatLib.command("sa posmsg list", true);
	} else if (type === "export") {
		clipboard.copy(JSON.stringify(data.messages));
		chat.chat("Exported!");
	} else {
		chat.chat("Positional Messages Help:");
		chat.chat("- /sa posmsg toggle: Toggle Positional Messages");
		chat.chat("- /sa posmsg list: List");
		chat.chat("- /sa posmsg add <x1> <y1> <z1> <x2> <y2> <z2> <delay> <message>: Add");
		chat.chat("- /sa posmsg remove <index>: Remove");
		chat.chat("- /sa posmsg import: Import from clipboard");
		chat.chat("- /sa posmsg export: Export to clipboard");
	}
	data.save();
}

function isPositionInVolume(position, volume) {
	return position[0] >= volume[0] && position[1] >= volume[1] && position[2] >= volume[2] && position[0] <= volume[3] && position[1] <= volume[4] && position[2] <= volume[5];
}

export function enable() {
	packetPlayer.addListener(playerListener);
	saCommand.addListener("posmsg", commandListener);
}

export function disable() {
	packetPlayer.removeListener(playerListener);
	saCommand.removeListener("posmsg");
}

export default { enable, disable };
