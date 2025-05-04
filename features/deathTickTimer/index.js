import Settings from "../../config";
import chat from "../../utils/chat";
import saCommand from "../../events/saCommand";
import packetChat from "../../events/packetChat";
import tick from "../../events/tick";

const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook");

let ticks = 0;

const overlayTrigger = register("renderOverlay", () => {
	const [x, y, scale] = [Settings.deathTickTimerX, Settings.deathTickTimerY, Settings.deathTickTimerScale];
	Renderer.scale(scale);
	Renderer.drawStringWithShadow((ticks > 26.67 ? "§a" : ticks > 13.33 ? "§6" : "§c") + (ticks / 20).toFixed(2) + "s", x * Renderer.screen.getWidth() / scale, y * Renderer.screen.getHeight() / scale);
}).unregister();

const tickListener = () => {
	--ticks;
	if (ticks <= 0) {
		ticks = 40;
	}
};

function commandListener() {
	chat.chat("Waiting for death tick...");
	const trigger = register("packetReceived", () => {
		ticks = 40;
		tick.removeListener(tickListener);
		overlayTrigger.unregister();
		tick.addListener(tickListener);
		overlayTrigger.register();
		chat.chat("Death tick aligned!");
		trigger.unregister();
	}).setFilteredClass(S08PacketPlayerPosLook);
}

function chatListener(message) {
	if (!["[BOSS] Bonzo: Gratz for making it this far, but I’m basically unbeatable.", "[BOSS] Scarf: This is where the journey ends for you, Adventurers.", "[BOSS] The Professor: I was burdened with terrible news recently...", "[BOSS] Thorn: Welcome Adventurers! I am Thorn, the Spirit! And host of the Vegan Trials!", "[BOSS] Livid: Welcome, you arrive right on time. I am Livid, the Master of Shadows.", "[BOSS] Sadan: So you made it all the way here... Now you wish to defy me? Sadan?!", "[BOSS] Maxor: WELL WELL WELL LOOK WHO’S HERE!"].includes(message)) return;
	tick.removeListener(tickListener);
	overlayTrigger.unregister();
}

const unloadTrigger = register("worldUnload", () => {
	tick.removeListener(tickListener);
	overlayTrigger.unregister();
});

export function enable() {
	saCommand.addListener("deathtick", commandListener);
	packetChat.addListener(chatListener);
	unloadTrigger.register();
}

export function disable() {
	saCommand.removeListener("deathtick");
	packetChat.removeListener(chatListener);
	unloadTrigger.unregister();
}

export default { enable, disable };
