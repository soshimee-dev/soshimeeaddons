/// <reference types="../../CTAutocomplete" />

const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow");

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.closeWindow ??= {};

const listeners = global.soshimee.events.closeWindow.listeners ??= [];

const trigger1 = global.soshimee.events.closeWindow.trigger1 ??= register("packetReceived", () => {
	for (let listener of listeners) {
		listener();
	}
}).setFilteredClass(S2EPacketCloseWindow).unregister();

const trigger2 = global.soshimee.events.closeWindow.trigger2 ??= register("packetSent", () => {
	for (let listener of listeners) {
		listener();
	}
}).setFilteredClass(C0DPacketCloseWindow).unregister();

export function addListener(listener) {
	if (listeners.length === 0) {
		trigger1.register();
		trigger2.register();
	}
	listeners.push(listener);
}

export function removeListener(listener) {
	const index = listeners.indexOf(listener);
	if (index === -1) return false;
	listeners.splice(index, 1);
	if (listeners.length === 0) {
		trigger1.unregister();
		trigger2.unregister();
	}
	return true;
}

export default { addListener, removeListener };
