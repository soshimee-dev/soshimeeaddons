/// <reference types="../../CTAutocomplete" />

const S44PacketWorldBorder = Java.type("net.minecraft.network.play.server.S44PacketWorldBorder");
const WorldBorder = Java.type("net.minecraft.world.border.WorldBorder");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetWorldBorder ??= {};

const listeners = global.soshimee.events.packetWorldBorder.listeners ??= [];

const trigger = global.soshimee.events.packetWorldBorder.trigger ??= register("packetReceived", (packet, event) => {
	const worldborder = new WorldBorder();
	packet.func_179788_a(worldborder);
	for (let listener of listeners) {
		listener(worldborder, packet, event);
	}
}).setFilteredClass(S44PacketWorldBorder).unregister();

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
