import Settings from "../../config";
import packetOpenWindow from "../../events/packetOpenWindow";
import packetSetSlot from "../../events/packetSetSlot";
import closeWindow from "../../events/closeWindow";

const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");

let cwid = -1;
const slots = [];
let windowSize = 0;
const melody = {
	correct: -1,
	button: -1,
	current: -1
};

const clickTrigger = register("guiMouseClick", (x, y, button, _0, event) => {
	cancel(event);
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

	if ([16, 25, 34, 43].includes(slot)) {
		click(slot, 0);
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

	const title = "§8[§bSA Terminal§8] §aMelody";

	Tessellator.pushMatrix();
	Renderer.scale(Settings.terminalsScale);
	Renderer.drawRect(Settings.terminalsBackgroundColor.getRGB(), offsetX - 2, offsetY - 2, width + 4, height + 4);
	Renderer.scale(Settings.terminalsScale);
	Renderer.drawRect(Settings.terminalsMelodyColorColumn.getRGB(), offsetX + (melody.correct + 1) * 18, offsetY + 18, 16, 70);
	Renderer.scale(Settings.terminalsScale);
	Renderer.drawStringWithShadow(title, offsetX, offsetY);
	for (let i = 0; i < windowSize; ++i) {
		let currentOffsetX = i % 9 * 18 + offsetX;
		let currentOffsetY = Math.floor(i / 9) * 18 + offsetY;

		const buttonSlot = melody.button * 9 + 16;
		const currentSlot = melody.button * 9 + 10 + melody.current;
		if (i === buttonSlot) {
			Renderer.scale(Settings.terminalsScale);
			Renderer.drawRect(Settings.terminalsMelodyColorButtonCorrect.getRGB(), currentOffsetX, currentOffsetY, 16, 16);
		} else if ([16, 25, 34, 43].includes(i)) {
			Renderer.scale(Settings.terminalsScale);
			Renderer.drawRect(Settings.terminalsMelodyColorButtonIncorrect.getRGB(), currentOffsetX, currentOffsetY, 16, 16);
		} else if (i === currentSlot) {
			Renderer.scale(Settings.terminalsScale);
			Renderer.drawRect(Settings.terminalsMelodyColorSlot.getRGB(), currentOffsetX, currentOffsetY, 16, 16);
		}
	}
	Tessellator.popMatrix();
}).unregister();

function openWindowListener(title, windowId, _0, slotCount) {
	cwid = windowId;
	const melodyMatch = title.match(/^Click the button on time!$/);
	if (melodyMatch !== null) {
		closeWindow.addListener(closeWindowListener);
		packetSetSlot.addListener(setSlotListener);
		clickTrigger.register();
		renderTrigger.register();
		while (slots.length) slots.pop();
		windowSize = slotCount;
	}
}

function closeWindowListener() {
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
		if (slots[slot].id === 160 && slots[slot].meta === 5) {
			const correct = slots.find(slot => slot && slot.id === 160 && slot.meta === 2)?.slot - 1;
			const button = Math.floor(slot / 9) - 1;
			const current = slot % 9 - 1;
			melody.correct = correct;
			melody.button = button;
			melody.current = current;
		}
	} else {
		slots[slot] = null;
	}
}

function click(slot, button) {
	if (slot === undefined || button === undefined) return;
	Client.sendPacket(new C0EPacketClickWindow(cwid, slot, button, 0, null, 0));
}

export function enable() {
	packetOpenWindow.addListener(openWindowListener);
}

export function disable() {
	packetOpenWindow.removeListener(openWindowListener);
}

export default { enable, disable };
