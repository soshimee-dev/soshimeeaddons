import Settings from "../../config";
import packetOpenWindow from "../../events/packetOpenWindow";
import packetSetSlot from "../../events/packetSetSlot";
import closeWindow from "../../events/closeWindow";

function openWindowListener(title) {
	if (title !== "Click the button on time!") return;
	closeWindow.addListener(closeWindowListener);
	packetSetSlot.addListener(setSlotListener);
}

function setSlotListener(itemStack, slot) {
	if (itemStack === null) return;
	const slots = [16, 25, 34, 43];
	const index = slots.indexOf(slot);
	if (index === -1) return;
	const item = new Item(itemStack);
	if (item.getID() !== 159 || item.getMetadata() !== 5) return;
	ChatLib.command("party chat " + Settings.melodyAlertMessage + " " + index + "/4");
}

function closeWindowListener() {
	closeWindow.removeListener(closeWindowListener);
	packetSetSlot.removeListener(setSlotListener);
}

export function enable() {
	packetOpenWindow.addListener(openWindowListener);
}

export function disable() {
	packetOpenWindow.removeListener(openWindowListener);
}

export default { enable, disable };
