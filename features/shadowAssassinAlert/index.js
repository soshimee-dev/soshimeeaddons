import Dungeon from "../../../BloomCore/dungeons/Dungeon";
import packetWorldBorder from "../../events/packetWorldBorder";
import chat from "../../utils/chat";

function listener(worldborder) {
	if (!Dungeon.inDungeon) return;
	if (worldborder.func_177741_h() !== 1) return;
	Client.showTitle(" ", "§aShadow Assassin!", 0, 30, 0);
	Client.showTitle(" ", "§aShadow Assassin!", 0, 30, 0);
	chat.chat("§aShadow Assassin!");
	World.playSound("mob.blaze.hit", 1, 1);
	World.playSound("mob.blaze.hit", 1, 1);
	World.playSound("mob.blaze.hit", 1, 1);
}

export function enable() {
	packetWorldBorder.addListener(listener);
}

export function disable() {
	packetWorldBorder.removeListener(listener);
}

export default { enable, disable };
