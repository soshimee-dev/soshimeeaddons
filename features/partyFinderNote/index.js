import chat from "../../utils/chat";
import saCommand from "../../events/saCommand";
import packetOpenWindow from "../../events/packetOpenWindow";

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");

let inAnvil = false;
let note = "";

const trigger = register("packetSent", packet => {
	if (!inAnvil) return;
	const item = new Item(packet.func_149546_g());
	if (packet.func_149544_d() !== 2 || item.getID() !== 339) return;
	item.setName(note);
}).setFilteredClass(C0EPacketClickWindow).unregister();

function anvilListener(_0, _1, _2, _3, guiId) {
	inAnvil = guiId === "minecraft:anvil";
}

function commandListener(...args) {
	if (!args) args = [];
	const input = args.join(" ");
	note = input.replaceAll("&", "§").replaceAll("§§", "&").replaceAll(/§([0123456789abcdefklmnor])/g, "§§$1$1");
	chat.chat("Party Finder note will be set to " + input.replaceAll("&", "§") + "§r.");
}

export function enable() {
	packetOpenWindow.addListener(anvilListener);
	saCommand.addListener("pfnote", commandListener);
	trigger.register();
}

export function disable() {
	packetOpenWindow.removeListener(anvilListener);
	saCommand.removeListener("pfnote");
	trigger.unregister();
}

export default { enable, disable };
