import RenderLib from "../../../RenderLib";
import packetBlockChange from "../../events/packetBlockChange";
import packetMultiBlockChange from "../../events/packetMultiBlockChange";
import packetTitle from "../../events/packetTitle";
import packetChat from "../../events/packetChat";
import chat from "../../utils/chat";

const MCBlock = Java.type("net.minecraft.block.Block");

const blocks = [[68, 130, 50], [66, 130, 50], [64, 130, 50], [68, 128, 50], [66, 128, 50], [64, 128, 50], [68, 126, 50], [66, 126, 50], [64, 126, 50]];

let on4thDevice = false;
const highlighted = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let notified = false;

const trigger1 = register("step", () => {
	on4thDevice = Player.getX() > 63 && Player.getX() < 64 && Player.getY() === 127 && Player.getZ() > 35 && Player.getZ() < 36;
	if (on4thDevice) return;
	notified = false;
	for (let i = 0; i < highlighted.length; ++i) highlighted[i] = 0;
}).setFps(1).unregister();

function onBlock(position, block) {
	if (!on4thDevice) return;
	const index = blocks.findIndex(xyz => position.every((coord, index) => coord === xyz[index]));
	if (index === -1) return;
	const id = MCBlock.func_149682_b(block);
	if (id === 159) {
		highlighted[index] = 1;
	} else if (id === 133) {
		highlighted[index] = 2;
	}
	// if (highlighted.filter(highlight => highlight === 1).length >= 9) notifyDone();
}

function onBlocks(blocks) {
	for (let block of blocks) onBlock(...block);
}

const trigger2 = register("renderWorld", () => {
	if (!on4thDevice) return;
	for (let i = 0; i < highlighted.length; ++i) {
		let rgb = [];
		let position = blocks[i];
		if (highlighted[i] === 0) continue;
		else if (highlighted[i] === 1) rgb = [255, 0, 0];
		else if (highlighted[i] === 2) rgb = [0, 255, 0];
		RenderLib.drawInnerEspBox(position[0] + 0.5, position[1], position[2] + 0.5, 1, 1, ...rgb, 255, true);
	}
}).unregister();

function onChat(message) {
	if (!on4thDevice) return;
	const match = message.match(/^(.*) completed a device! \(\d\/\d\)$/);
	if (match === null) return;
	const [_0, player] = match;
	const match2 = Player.getDisplayName().getText().match(/^.*§a(\S*).*$/) ?? [, Player.getName()]; // for nicked (untested)
	const [_1, name] = match2;
	if (player !== name) return;
	notifyDone();
}

function onTitle(type, message, _, event) {
	if (!on4thDevice) return;
	if (type !== "SUBTITLE") return;
	if (!/^.* completed a device! \(\d\/\d\)$/.test(message) && !/^.* activated a terminal! \(\d\/\d\)$/.test(message) && !/^.* activated a lever! \(\d\/\d\)$/.test(message) && !/^The gate will open in 5 seconds!$/.test(message) && !/^The gate has been destroyed!$/.test(message)) return;
	cancel(event);
}

function notifyDone() {
	if (notified) return;
	notified = true;
	Client.showTitle(" ", "§aDevice Complete!", 0, 30, 0);
	Client.showTitle(" ", "§aDevice Complete!", 0, 30, 0);
	chat.chat("§aDevice Complete!");
	World.playSound("note.pling", 1, 1.414);
	setTimeout(() => World.playSound("note.pling", 1, 1.587), 150);
	setTimeout(() => World.playSound("note.pling", 1, 1.782), 300);
}

export function enable() {
	packetBlockChange.addListener(onBlock);
	packetMultiBlockChange.addListener(onBlocks);
	packetChat.addListener(onChat);
	packetTitle.addListener(onTitle);
	trigger1.register();
	trigger2.register();
}

export function disable() {
	packetBlockChange.removeListener(onBlock);
	packetMultiBlockChange.removeListener(onBlocks);
	packetChat.removeListener(onChat);
	packetTitle.removeListener(onTitle);
	trigger1.unregister();
	trigger2.unregister();
}

export default { enable, disable };

// i love meowing...
