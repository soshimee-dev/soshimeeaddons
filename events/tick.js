/// <reference types="../../CTAutocomplete" />

const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.tick ??= {};

const listeners = global.soshimee.events.tick.listeners ??= [];

const trigger = global.soshimee.events.tick.trigger ??= register("packetReceived", () => {
	for (let listener of listeners) {
		listener();
	}
}).setFilteredClass(S32PacketConfirmTransaction).unregister();

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

export function schedule(ticks, callback) {
	const onTick = () => {
		--ticks;
		if (ticks <= 0) {
			removeListener(onTick);
			callback();
		}
	};
	addListener(onTick);
}

export default { addListener, removeListener, schedule };
