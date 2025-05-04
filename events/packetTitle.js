const S45PacketTitle = Java.type("net.minecraft.network.play.server.S45PacketTitle");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.packetTitle ??= {};

const listeners = global.soshimee.events.packetTitle.listeners ??= [];

const trigger = global.soshimee.events.packetTitle.trigger ??= register("packetReceived", (packet, event) => {
	const type = packet.func_179807_a().toString();
	const message = ChatLib.removeFormatting(packet.func_179805_b()?.func_150260_c());
	for (let listener of listeners) {
		listener(type, message, packet, event);
	}
}).setFilteredClass(S45PacketTitle).unregister();

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
