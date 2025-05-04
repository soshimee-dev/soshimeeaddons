import Settings from "../../config";
import saCommand from "../../events/saCommand";
import chat from "../../utils/chat";
import packetOpenWindow from "../../events/packetOpenWindow";
import closeWindow from "../../events/closeWindow";
import packetSetSlot from "../../events/packetSetSlot";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");

let cwid = -1;
let windowSize = 0;
const slots = [];
const players = [];

const clickTrigger = register("guiMouseClick", (x, y, _0, _1, event) => {
	cancel(event);
	const centerX = Renderer.screen.getWidth() / 2;
	const centerY = Renderer.screen.getHeight() / 2;

	let index = -1;
	if (x < centerX && y < centerY) index = 0;
	else if (x > centerX && y < centerY) index = 1;
	else if (x < centerX && y > centerY) index = 2;
	else if (x > centerX && y > centerY) index = 3;
	if (index === -1) return;
	if (!players[index]) return;
	chat.chat("Leaping to " + players[index].formattedName);
	click(players[index].slot, 0);
	Player.getPlayer().func_71053_j();
}).unregister();

const keyTrigger = register("guiKey", (_, keyCode) => {
	if (!Settings.leapHelperKeyboard) return;
	if (keyCode < 2 || keyCode > 5) return;
	const index = keyCode - 2;
	if (!players[index]) return;
	chat.chat("Leaping to " + players[index].formattedName);
	click(players[index].slot, 0);
	Player.getPlayer().func_71053_j();
}).unregister();

const renderTrigger = register(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
	cancel(event);
	const screenWidth = Renderer.screen.getWidth() / Settings.leapHelperScale;
	const screenHeight = Renderer.screen.getHeight() / Settings.leapHelperScale;

	const width = 128 + 32 + 128;
	const height = 64 + 32 + 64;

	const offsetX = screenWidth / 2 - width / 2;
	const offsetY = screenHeight / 2 - height / 2;

	const offsets = [[offsetX, offsetY], [offsetX + 128 + 32, offsetY], [offsetX, offsetY + 64 + 32], [offsetX + 128 + 32, offsetY + 64 + 32]];

	Tessellator.pushMatrix();
	for (let i = 0; i < 4; ++i) {
		if (!players[i]) continue;
		Renderer.scale(Settings.leapHelperScale);
		Renderer.drawRect(Settings.leapHelperBackgroundColor.getRGB(), offsets[i][0], offsets[i][1], 128, 64);
		let nameScale = 112 / Renderer.getStringWidth(players[i].formattedName);
		if (nameScale > 1.5) nameScale = 1.5;
		Renderer.scale(Settings.leapHelperScale * nameScale);
		Renderer.drawStringWithShadow(players[i].formattedName, offsets[i][0] / nameScale + 4, offsets[i][1] / nameScale + 4);
		Renderer.scale(Settings.leapHelperScale);
		Renderer.drawStringWithShadow(colorClass(players[i].class) + players[i].class, offsets[i][0] + 128 - 4 - Renderer.getStringWidth(players[i].class), offsets[i][1] + 64 - 12);
	}
	Tessellator.popMatrix();
}).unregister();

function openWindowListener(title, windowId, _, slotCount) {
	if (title !== "Spirit Leap") return;
	cwid = windowId;
	windowSize = slotCount;
	while (slots.length) slots.pop();
	closeWindow.addListener(closeWindowListener);
	packetSetSlot.addListener(setSlotListener);
	renderTrigger.register();
	clickTrigger.register();
	keyTrigger.register();
}

function closeWindowListener() {
	closeWindow.removeListener(closeWindowListener);
	packetSetSlot.removeListener(setSlotListener);
	renderTrigger.unregister();
	clickTrigger.unregister();
	keyTrigger.unregister();
}

function setSlotListener(itemStack, slot) {
	if (slot < 0) return;
	if (slot >= windowSize) return;
	if (itemStack !== null) {
		const item = new Item(itemStack);
		slots[slot] = {
			slot,
			id: item.getID(),
			meta: item.getMetadata(),
			size: item.getStackSize(),
			name: ChatLib.removeFormatting(item.getName()),
			formattedName: item.getName(),
			enchanted: item.isEnchanted()
		};
	} else {
		slots[slot] = null;
	}
	if (slots.length === windowSize) {
		while (players.length) players.pop();
		slots.forEach(slot => {
			if (!slot) return;
			if (slot.id === 160) return;
			if (Settings.leapHelperSorting === 3) {
				for (let i = 0; i < 4; ++i) {
					if (slot.name.toLowerCase() !== Settings["leapHelperPlayer" + (i + 1)].toLowerCase()) continue;
					players[i] = {
						name: slot.name,
						formattedName: slot.formattedName,
						class: Dungeon.playerClasses[slot.name]?.["class"] || "Unknown",
						slot: slot.slot
					};
				}
			} else {
				players.push({
					name: slot.name,
					formattedName: slot.formattedName,
					class: Dungeon.playerClasses[slot.name]?.["class"] || "Unknown",
					slot: slot.slot
				});
				if (Settings.leapHelperSorting === 0 || Settings.leapHelperSorting === 2) {
					players.sort((a, b) => a.name.localeCompare(b.name));
				}
				if (Settings.leapHelperSorting === 1 || Settings.leapHelperSorting === 2) {
					players.sort((a, b) => a.class.localeCompare(b.class));
				}
			}
		});
	}
}

function commandListener(...args) {
	if (!args) args = [];
	if (args[0] === "get") {
		chat.chat("Current Leap Helper sorting:");
		if (Settings.leapHelperSorting < 3) {
			ChatLib.chat("/sa leap " + (Settings.leapHelperSorting + 1));
		} else {
			ChatLib.chat("/sa leap " + Settings.leapHelperPlayer1 + " " + Settings.leapHelperPlayer2 + " " + Settings.leapHelperPlayer3 + " " + Settings.leapHelperPlayer4);
		}
	} else if (args.length < 4) {
		const value = args[0] - 1;
		if (value === 0) {
			Settings.leapHelperSorting = 0;
			chat.chat("Leap Helper sorting set to Name");
		} else if (value === 1) {
			Settings.leapHelperSorting = 1;
			chat.chat("Leap Helper sorting set to Class");
		} else if (value === 2) {
			Settings.leapHelperSorting = 2;
			chat.chat("Leap Helper sorting set to Name+Class");
		} else {
			chat.chat("Unknown sorting");
		}
	} else {
		Settings.leapHelperSorting = 3;
		chat.chat("Leap Helper sorting set to Custom");
		for (let i = 0; i < 4; ++i) {
			chat.chat("Player " + (i + 1) + ": " + args[i]);
			Settings["leapHelperPlayer" + (i + 1)] = args[i];
		}
	}
}

function colorClass(className) {
	className = className.toLowerCase();
	if (className === "archer") return "§4";
	else if (className === "berserk") return "§6";
	else if (className === "healer") return "§d";
	else if (className === "mage") return "§b";
	else if (className === "tank") return "§2";
	else return "§7";
}

function click(slot, button) {
	if (slot === undefined || button === undefined) return;
	Client.sendPacket(new C0EPacketClickWindow(cwid, slot, button, 0, null, 0));
}

export function enable() {
	saCommand.addListener("leap", commandListener);
	packetOpenWindow.addListener(openWindowListener);
}

export function disable() {
	saCommand.removeListener("leap");
	packetOpenWindow.removeListener(openWindowListener);
}

export default { enable, disable };
