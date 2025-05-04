import Settings from "../../config";
import packetSoundEffect from "../../events/packetSoundEffect";

const S0EPacketSpawnObject = Java.type("net.minecraft.network.play.server.S0EPacketSpawnObject");

function listener(name, volume, pitch, _0, _1, _2, _3, event) {
	Settings.muteBonzoStaff && name === "mob.ghast.moan" && volume === 1 && [1.3968254327774048, 1.4126983880996704, 1.4285714626312256, 1.4444444179534912, 1.4603174924850464, 1.476190447807312, 1.4920635223388672, 1.5079364776611328, 1.523809552192688, 1.5396825075149536, 1.5555555820465088, 1.5714285373687744, 1.5873016119003296, 1.6031745672225952, 1.6190476417541504, 1.634920597076416, 1.6507936716079712, 1.6666666269302368, 1.682539701461792, 1.6984126567840576, 1.7142857313156128, 1.7301586866378784, 1.7460317611694336, 1.7619047164916992, 1.7777777910232544, 1.79365074634552].includes(pitch) && cancel(event);
	Settings.muteWitherShield && name === "mob.zombie.remedy" && volume === 1 && pitch === 0.6984127163887024 && cancel(event);
}

const trigger = register("packetReceived", (packet, event) => {
	Settings.muteBonzoStaff && packet.func_148993_l() === 76 && cancel(event);
}).setFilteredClass(S0EPacketSpawnObject).unregister();

export function enable() {
	packetSoundEffect.addListener(listener);
	trigger.register();
}

export function disable() {
	packetSoundEffect.removeListener(listener);
	trigger.unregister();
}

export default { enable, disable };
