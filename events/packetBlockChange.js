/// <reference types="../../CTAutocomplete" />

const S23PacketBlockChange = Java.type("net.minecraft.network.play.server.S23PacketBlockChange");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetBlockChange ??= {};

const listeners = global.soshimee.events.packetBlockChange.listeners ??= [];

const trigger = global.soshimee.events.packetBlockChange.trigger ??= register("packetReceived", (packet, event) => {
	const position = packet.func_179827_b();
	const positionXYZ = [position.func_177958_n(), position.func_177956_o(), position.func_177952_p()];
	const blockState = packet.func_180728_a();
	const block = blockState.func_177230_c();
	for (let listener of listeners) {
		listener(positionXYZ, block, blockState, packet, event);
	}
}).setFilteredClass(S23PacketBlockChange).unregister();

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
