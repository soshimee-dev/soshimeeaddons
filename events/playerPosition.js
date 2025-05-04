/// <reference types="../../CTAutocomplete" />

const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.playerPosition ??= {};

const listeners = global.soshimee.events.playerPosition.listeners ??= [];

const trigger = global.soshimee.events.playerPosition.trigger ??= register("packetSent", (packet, event) => {
	if (!packet.func_149466_j()) return;
	const x = packet.func_149464_c();
	const y = packet.func_149467_d();
	const z = packet.func_149472_e();
	for (let listener of listeners) {
		listener(x, y, z, packet, event);
	}
}).setFilteredClass(C03PacketPlayer).unregister();

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
