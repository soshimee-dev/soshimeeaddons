const C0APacketAnimation = Java.type("net.minecraft.network.play.client.C0APacketAnimation");

let cc = 0;

const interactTrigger = register("playerInteract", () => {
	if (!shouldAnimate(Player.getHeldItem())) return;

	++cc;
	Player.getPlayer().func_71038_i();
}).unregister();

const animationTrigger = register("packetSent", (_, event) => {
	if (cc < 1) return;
	cancel(event);
	--cc;
}).setFilteredClass(C0APacketAnimation).unregister();

function shouldAnimate(item) {
	return item?.getNBT()?.toObject()?.tag?.display?.Lore?.some(line => line.includes("  §e§lRIGHT CLICK")) ?? false;
}

export function enable() {
	interactTrigger.register();
	animationTrigger.register();
}

export function disable() {
	interactTrigger.unregister();
	animationTrigger.unregister();
}

export default { enable, disable };
