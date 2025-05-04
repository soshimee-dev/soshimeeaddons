import packetChat from "../../events/packetChat";

function listener(message, _, event) {
	if (/^.* joined the lobby!$/.test(message)) cancel(event);
	else if (/^ >>> .* joined the lobby! <<<$/.test(message)) cancel(event);
	else if (/^.* slid into the lobby!$/.test(message)) cancel(event);
	else if (/^ >>> .* slid into the lobby! <<<$/.test(message)) cancel(event);
}

export function enable() {
	packetChat.addListener(listener);
}

export function disable() {
	packetChat.removeListener(listener);
}

export default { enable, disable };
