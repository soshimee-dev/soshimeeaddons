/// <reference types="../../CTAutocomplete" />

const S30PacketWindowItems = Java.type("net.minecraft.network.play.server.S30PacketWindowItems");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetWindowItems ??= {};

const listeners = global.soshimee.events.packetWindowItems.listeners ??= [];

const trigger = global.soshimee.events.packetWindowItems.trigger ??= register("packetReceived", (packet, event) => {
	const itemStacks = packet.func_148910_d();
	const windowID = packet.func_148911_c();

	for (let listener of listeners) {
		listener(itemStacks, windowID, packet, event);
	}
}).setFilteredClass(S30PacketWindowItems).unregister();

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
