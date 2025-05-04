import Settings from "../../config";
import packetOpenWindow from "../../events/packetOpenWindow";
import packetSetSlot from "../../events/packetSetSlot";
import closeWindow from "../../events/closeWindow";

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");

let inTerminal = false;
let cwid = -1;
let clicked = false;
const slots = [];
let windowSize = 0;
const queue = [];
const solution = [];
let openedAt = 0;

const clickTrigger = register("guiMouseClick", (x, y, button, _0, event) => {
	cancel(event);
	if (openedAt + Settings.terminalsFirstClick > new Date().getTime()) return;

	const screenWidth = Renderer.screen.getWidth();
	const screenHeight = Renderer.screen.getHeight();

	const width = 9 * 18 * Settings.terminalsScale;
	const height = windowSize / 9 * 18 * Settings.terminalsScale;

	const globalOffsetX = Number.isNaN(parseInt(Settings.terminalsOffsetX)) ? 0 : parseInt(Settings.terminalsOffsetX);
	const globalOffsetY = Number.isNaN(parseInt(Settings.terminalsOffsetY)) ? 0 : parseInt(Settings.terminalsOffsetY);

	const offsetX = screenWidth / 2 - width / 2 + globalOffsetX * Settings.terminalsScale;
	const offsetY = screenHeight / 2 - height / 2 + globalOffsetY * Settings.terminalsScale;

	const slotX = Math.floor((x - offsetX) / (18 * Settings.terminalsScale));
	const slotY = Math.floor((y - offsetY) / (18 * Settings.terminalsScale));

	if (slotX < 0 || slotX > 8 || slotY < 0) return;

	const slot = slotX + slotY * 9;

	if (slot >= windowSize) return;

	button = button === 0 ? 0 : 1;
	if ((solution[slot] > 0 && button === 0) || (solution[slot] < 0 && button !== 0)) {
		if (Settings.terminalsHighPingMode || !clicked) predict(slot, button);
		if (Settings.terminalsHighPingMode && clicked) {
			queue.push([slot, button]);
		} else {
			click(slot, button);
		}
	}
}).unregister();

const renderTrigger = register(net.minecraftforge.client.event.GuiScreenEvent.DrawScreenEvent.Pre, event => {
	cancel(event);
	const screenWidth = Renderer.screen.getWidth() / Settings.terminalsScale;
	const screenHeight = Renderer.screen.getHeight() / Settings.terminalsScale;

	const width = 9 * 18;
	const height = windowSize / 9 * 18;

	const globalOffsetX = Number.isNaN(parseInt(Settings.terminalsOffsetX)) ? 0 : parseInt(Settings.terminalsOffsetX);
	const globalOffsetY = Number.isNaN(parseInt(Settings.terminalsOffsetY)) ? 0 : parseInt(Settings.terminalsOffsetY);

	const offsetX = screenWidth / 2 - width / 2 + globalOffsetX + 1;
	const offsetY = screenHeight / 2 - height / 2 + globalOffsetY;

	const title = "§8[§bSA Terminal§8] §aRubix";

	Tessellator.pushMatrix();
	Renderer.scale(Settings.terminalsScale);
	Renderer.drawRect(Settings.terminalsBackgroundColor.getRGB(), offsetX - 2, offsetY - 2, width + 4, height + 4);
	Renderer.scale(Settings.terminalsScale);
	Renderer.drawStringWithShadow(title, offsetX, offsetY);
	for (let i = 0; i < windowSize; ++i) {
		if (solution[i] === undefined) continue;

		let currentOffsetX = i % 9 * 18 + offsetX;
		let currentOffsetY = Math.floor(i / 9) * 18 + offsetY;
		Renderer.scale(Settings.terminalsScale);
		if (solution[i] > 0) {
			Renderer.drawRect(Settings.terminalsRubixColorLeft.getRGB(), currentOffsetX, currentOffsetY, 16, 16);
		} else {
			Renderer.drawRect(Settings.terminalsRubixColorRight.getRGB(), currentOffsetX, currentOffsetY, 16, 16);
		}
		Renderer.scale(Settings.terminalsScale);
		Renderer.drawStringWithShadow(solution[i], currentOffsetX + (16 - Renderer.getStringWidth(solution[i])) / 2, currentOffsetY + 4);
	}
	Tessellator.popMatrix();
}).unregister();

function openWindowListener(title, windowId, _0, slotCount) {
	cwid = windowId;
	const rubixMatch = title.match(/^Change all to same color!$/);
	if (rubixMatch !== null) {
		if (!inTerminal) {
			closeWindow.addListener(closeWindowListener);
			packetSetSlot.addListener(setSlotListener);
			clickTrigger.register();
			renderTrigger.register();
		}
		if (!clicked) openedAt = new Date().getTime();
		inTerminal = true;
		clicked = false;
		while (slots.length) slots.pop();
		windowSize = slotCount;
	} else {
		inTerminal = false;
	}
}

function closeWindowListener() {
	inTerminal = false;
	while (queue.length) queue.shift();
	closeWindow.removeListener(closeWindowListener);
	packetSetSlot.removeListener(setSlotListener);
	clickTrigger.unregister();
	renderTrigger.unregister();
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
			enchanted: item.isEnchanted()
		};
	} else {
		slots[slot] = null;
	}
	if (slots.length === windowSize && slot === windowSize - 1) { // rubix is the only terminal that requires right clicks
		solve();
		if (queue.length > 0) {
			if (queue.every(queued => (solution[queued[0]] > 0 && queued[1] === 0) || (solution[queued[0]] < 0 && queued[1] === 1))) {
				queue.forEach(queued => predict(queued[0], queued[1]));
				click(queue[0][0], queue[0][1]);
				queue.shift();
			} else {
				while (queue.length) queue.shift();
			}
		}
	}
}

function solve() {
	while (solution.length) solution.pop();
	const allowedSlots = [12, 13, 14, 21, 22, 23, 30, 31, 32];
	const order = [14, 1, 4, 13, 11];
	const calcIndex = index => (index + order.length) % order.length;
	const clicks = [0, 0, 0, 0, 0];
	for (let i = 0; i < 5; ++i) {
		slots.filter(slot => slot && allowedSlots.includes(slot.slot) && slot.meta !== order[calcIndex(i)]).forEach(slot => {
			if (slot.meta === order[calcIndex(i - 2)]) clicks[i] += 2;
			else if (slot.meta === order[calcIndex(i - 1)]) clicks[i] += 1;
			else if (slot.meta === order[calcIndex(i + 1)]) clicks[i] += 1;
			else if (slot.meta === order[calcIndex(i + 2)]) clicks[i] += 2;
		});
	}
	const origin = clicks.indexOf(Math.min(...clicks));
	slots.filter(slot => slot && allowedSlots.includes(slot.slot) && slot.meta !== order[calcIndex(origin)]).forEach(slot => {
		if (slot.meta === order[calcIndex(origin - 2)]) solution[slot.slot] = 2;
		else if (slot.meta === order[calcIndex(origin - 1)]) solution[slot.slot] = 1;
		else if (slot.meta === order[calcIndex(origin + 1)]) solution[slot.slot] = -1;
		else if (slot.meta === order[calcIndex(origin + 2)]) solution[slot.slot] = -2;
	});
}

function predict(slot, button) {
	if (solution[slot] === undefined) return;
	if (button === 0) --solution[slot];
	else ++solution[slot];
	if (solution[slot] === 0) delete solution[slot];
}

function click(slot, button) {
	if (slot === undefined || button === undefined) return;
	clicked = true;
	Client.sendPacket(new C0EPacketClickWindow(cwid, slot, button, button === 2 ? 3 : 0, null, 0));
	const initialWindowId = cwid;
	setTimeout(() => {
		if (!inTerminal || initialWindowId !== cwid) return;
		while (queue.length) queue.pop();
		solve();
		clicked = false;
	}, Settings.terminalsTimeout);
}

export function enable() {
	packetOpenWindow.addListener(openWindowListener);
}

export function disable() {
	packetOpenWindow.removeListener(openWindowListener);
}

export default { enable, disable };
