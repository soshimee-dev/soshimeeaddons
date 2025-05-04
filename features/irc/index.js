import WebSocket from "../../../WebSocket";
import request from "../../../requestV2";
import Async from "../../../Async";

const UUID = Java.type("java.util.UUID");
const C01PacketChatMessage = Java.type("net.minecraft.network.play.client.C01PacketChatMessage");
const ChatComponentText = Java.type("net.minecraft.util.ChatComponentText");

let enabled = false;
let reconnecting = false;
let ws;

const trigger = register("packetSent", (packet, event) => {
	const message = packet.func_149439_c();
	if (!message.startsWith("#")) return;
	try {
		ws.send(message.substring(1).replaceAll(/&([0-9a-fk-o])/g, "§$1"));
	} catch (error) {
		ChatLib.chat("§8[§bIRC§8] §7Failed to send message.");
	}
	cancel(event);
}).setFilteredClass(C01PacketChatMessage).unregister();

const unloadTrigger = register("gameUnload", () => {
	enabled = false;
	ws?.close();
}).unregister();

function reset() {
	ws = new WebSocket("wss://sa-irc.p-e.kr/ws");

	ws.onOpen = () => {
		reconnecting = false;
		ChatLib.chat("§8[§bIRC§8] §7Connected.");
		auth();
	};

	ws.onClose = () => {
		if (!reconnecting) ChatLib.chat("§8[§bIRC§8] §7Disconnected.");
		if (enabled) {
			if (reconnecting) Async.schedule(reset, 10000);
			else reset();
			reconnecting = true;
		}
	};

	ws.onMessage = message => {
		Client.getMinecraft().field_71439_g.func_145747_a(new ChatComponentText("§8[§bIRC§8] §f" + message));
	};

	ws.connect();
}

function keepAlive() {
	if (!enabled) return;
	try {
		ws?.send("/");
	} catch (error) {}
	Async.schedule(keepAlive, 10000);
}

function auth() {
	ChatLib.chat("§8[§bIRC§8] §7Authenticating...");
	const token = Client.getMinecraft().func_110432_I().func_148254_d();
	const uuid = Player.getUUID().replaceAll("-", "");
	const svid = UUID.randomUUID().toString().replaceAll("-", "");
	request({
		url: "https://sessionserver.mojang.com/session/minecraft/join",
		method: "POST",
		body: {
			accessToken: token,
			selectedProfile: uuid,
			serverId: svid
		},
		resolveWithFullResponse: true
	}).then(response => {
		if (response.statusCode === 204) ws.send("/auth " + Player.getName() + " " + svid);
		else ChatLib.chat("§8[§bIRC§8] §7Failed to authenticate.");
	}).catch(() => {
		ChatLib.chat("§8[§bIRC§8] §7Failed to authenticate.");
	});
}

export function enable() {
	enabled = true;
	trigger.register();
	unloadTrigger.register();
	reset();
	keepAlive();
	ChatLib.chat("§8[§bIRC§8] §7Connecting...");
}

export function disable() {
	enabled = false;
	trigger.unregister();
	unloadTrigger.unregister();
	ws.close();
}

export default { enable, disable };
