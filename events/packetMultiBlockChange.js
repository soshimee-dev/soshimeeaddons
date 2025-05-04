/// <reference types="../../CTAutocomplete" />

const S22PacketMultiBlockChange = Java.type("net.minecraft.network.play.server.S22PacketMultiBlockChange");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetMultiBlockChange ??= {};

const listeners = global.soshimee.events.packetMultiBlockChange.listeners ??= [];

const trigger = global.soshimee.events.packetMultiBlockChange.trigger ??= register("packetReceived", (packet, event) => {
	const updatedBlocks = packet.func_179844_a();
	const blocks = updatedBlocks.map(updatedBlock => {
		const position = updatedBlock.func_180090_a();
		const positionXYZ = [position.func_177958_n(), position.func_177956_o(), position.func_177952_p()];
		const blockState = updatedBlock.func_180088_c();
		const block = blockState.func_177230_c();
		return [positionXYZ, block, blockState];
	});
	for (let listener of listeners) {
		listener(blocks, packet, event);
	}
}).setFilteredClass(S22PacketMultiBlockChange).unregister();

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
