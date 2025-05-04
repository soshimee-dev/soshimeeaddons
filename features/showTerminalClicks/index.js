import RenderLib from "../../../RenderLib";

const C02PacketUseEntity = Java.type("net.minecraft.network.play.client.C02PacketUseEntity");

const highlights = {};
let renderTriggerRegistered = false;

const renderTrigger = register("renderWorld", () => {
	const time = new Date().getTime();
	for (let highlight of Object.values(highlights)) {
		let progress = (time - highlight.start) / (highlight.end - highlight.start);
		let position = highlight.position;
		if (progress > 1) {
			delete highlights[position.join()];
			continue;
		}
		RenderLib.drawInnerEspBox(...position, 0.5, 1.975, 0, 1, 0, 1 - progress, true);
	}
	if (Object.values(highlights).length <= 0) {
		renderTrigger.unregister();
		renderTriggerRegistered = false;
	}
}).unregister();

const trigger = register("packetSent", packet => {
	const mcEntity = packet.func_149564_a(World.getWorld());
	if (!mcEntity) return;
	const entity = new Entity(mcEntity);
	if (entity.getName() !== "§cInactive Terminal") return;
	const time = new Date().getTime();
	const position = [entity.getX(), entity.getY(), entity.getZ()];
	highlights[position.join()] = {
		start: time,
		end: time + 500,
		position
	};
	if (!renderTriggerRegistered) renderTrigger.register();
	renderTriggerRegistered = true;
}).setFilteredClass(C02PacketUseEntity).unregister();

export function enable() {
	trigger.register();
}

export function disable() {
	trigger.unregister();
}

export default { enable, disable };
