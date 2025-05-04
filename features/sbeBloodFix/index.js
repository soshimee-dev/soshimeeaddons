import packetChat from "../../events/packetChat";

function listener(message) {
	["[BOSS] The Watcher: Congratulations, you made it through the Entrance.", "[BOSS] The Watcher: Ah, you've finally arrived.", "[BOSS] The Watcher: Ah, we meet again...", "[BOSS] The Watcher: So you made it this far... interesting.", "[BOSS] The Watcher: You've managed to scratch and claw your way here, eh?", "[BOSS] The Watcher: I'm starting to get tired of seeing you around here...", "[BOSS] The Watcher: Oh.. hello?", "[BOSS] The Watcher: Things feel a little more roomy now, eh?"].includes(message) && ChatLib.simulateChat("§r§cThe §r§c§lBLOOD DOOR§r§c has been opened!");
}

export function enable() {
	packetChat.addListener(listener);
}

export function disable() {
	packetChat.removeListener(listener);
}

export default { enable, disable };
