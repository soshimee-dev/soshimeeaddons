/// <reference types="../../CTAutocomplete" />

const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetSoundEffect ??= {};

const listeners = global.soshimee.events.packetSoundEffect.listeners ??= [];

const trigger = global.soshimee.events.packetSoundEffect.trigger ??= register("packetReceived", (packet, event) => {
	const name = packet.func_149212_c();
	const volume = packet.func_149208_g();
	const pitch = packet.func_149209_h();
	const x = packet.func_149207_d();
	const y = packet.func_149211_e();
	const z = packet.func_149210_f();
	for (let listener of listeners) {
		listener(name, volume, pitch, x, y, z, packet, event);
	}
}).setFilteredClass(S29PacketSoundEffect).unregister();

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
