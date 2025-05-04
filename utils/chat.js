const defaultColor = "§7";

export function chat(message) {
	ChatLib.chat("§8[§bSA§8] " + defaultColor + message.toString().replaceAll("§r", defaultColor));
}

export default { chat };
