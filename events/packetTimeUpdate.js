/// <reference types="../../CTAutocomplete" />

const S03PacketTimeUpdate = Java.type("net.minecraft.network.play.server.S03PacketTimeUpdate");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetTimeUpdate ??= {};

const listeners = global.soshimee.events.packetTimeUpdate.listeners ??= [];

const trigger = global.soshimee.events.packetTimeUpdate.trigger ??= register("packetReceived", (packet, event) => {
	for (let listener of listeners) {
		listener(packet, event);
	}
}).setFilteredClass(S03PacketTimeUpdate).unregister();

export function addListener(listener) {
	if (listeners.length === 0) trigger.unregister();
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
