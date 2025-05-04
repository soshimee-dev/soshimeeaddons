/// <reference types="../../CTAutocomplete" />

const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetSetSlot ??= {};

const listeners = global.soshimee.events.packetSetSlot.listeners ??= [];

const trigger = global.soshimee.events.packetSetSlot.trigger ??= register("packetReceived", (packet, event) => {
	const itemStack = packet.func_149174_e();
	const slot = packet.func_149173_d();
	const windowID = packet.func_149175_c();

	for (let listener of listeners) {
		listener(itemStack, slot, windowID, packet, event);
	}
}).setFilteredClass(S2FPacketSetSlot).unregister();

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
