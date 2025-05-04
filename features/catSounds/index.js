import * as packetChat from "../../events/packetChat";

function listener(message) {
	if (message.toLowerCase().split(":").splice(1).join(":").includes("meow")) World.playSound("mob.cat.meow", 1, 1);
}

export function enable() {
	packetChat.addListener(listener);
}

export function disable() {
	packetChat.removeListener(listener);
}

export default { enable, disable };
