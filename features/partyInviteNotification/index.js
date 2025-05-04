import packetChat from "../../events/packetChat";

function listener(message) {
	if (/^-----------------------------------------------------\n.*? has invited you to join their party!\nYou have 60 seconds to accept. Click here to join!\n-----------------------------------------------------$/.test(message) || /^-----------------------------------------------------\n.*? has invited you to join .*?'s party!\nYou have 60 seconds to accept. Click here to join!\n-----------------------------------------------------$/.test(message)) World.playSound("mob.cat.meow", 1, 1);
}

export function enable() {
	packetChat.addListener(listener);
}

export function disable() {
	packetChat.removeListener(listener);
}

export default { enable, disable };
