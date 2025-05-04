import tick from "../../events/tick";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");
const S17PacketEntityLookMove = Java.type("net.minecraft.network.play.server.S14PacketEntity$S17PacketEntityLookMove");

const trigger = register("packetReceived", packet => {
	const mcEntity = packet.func_149065_a(World.getWorld());
	if (!mcEntity) return;
	console.log(mcEntity);
	// const itemStack = packet.func_149390_c();
	// if (!itemStack) return;
	// const item = new Item(itemStack);
	// if (item.getID() !== 397) return;
	// const nbtObject = item.getItemNBT()?.toObject();
	// if (!nbtObject) return;
	// const textures = nbtObject.tag?.SkullOwner?.Properties?.textures?.[0]?.Value;
	// if (!textures) return;
	// ChatLib.chat(textures);
}).setFilteredClass(S17PacketEntityLookMove).unregister();

export function enable() {
	trigger.register();
}

export function disable() {
	trigger.unregister();
}

export default { enable, disable };
