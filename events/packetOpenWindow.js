/// <reference types="../../CTAutocomplete" />

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetOpenWindow ??= {};

const listeners = global.soshimee.events.packetOpenWindow.listeners ??= [];

const trigger = global.soshimee.events.packetOpenWindow.trigger ??= register("packetReceived", (packet, event) => {
	const title = ChatLib.removeFormatting(packet.func_179840_c().func_150254_d());
	const windowId = packet.func_148901_c();
	const hasSlots = packet.func_148900_g();
	const slots = packet.func_148898_f();
	const guiId = packet.func_148902_e();
	const entityId = packet.func_148897_h();
	for (let listener of listeners) {
		listener(title, windowId, hasSlots, slots, guiId, entityId, packet, event);
	}
}).setFilteredClass(S2DPacketOpenWindow).unregister();

export function addListener(listener) {
	if (listeners.length === 0) trigger.register();
	listeners.push(listener);
}

export function removeListener(listener) {
	const index = listeners.indexOf(listener);
	if (index === -1) return false;
	listeners.splice(index, 1);
	if (listeners.length === 0) trigger.unregister();
	return true;
}

export default { addListener, removeListener };
