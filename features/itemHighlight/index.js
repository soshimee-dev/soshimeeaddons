import Settings from "../../config";
import RenderLib from "../../../RenderLib";
import Dungeon from "../../../BloomCore/dungeons/Dungeon";

const EntityItem = Java.type("net.minecraft.entity.item.EntityItem");

const items = ["Health Potion VIII Splash Potion", "Healing  8 Splash Potion", "Healing VIII Splash Potion", "Decoy", "Inflatable Jerry", "Spirit Leap", "Trap", "Training Weights", "Defuse Kit", "Dungeon Chest Key", "Treasure Talisman", "Revive Stone", "Architect's First Draft"];
let renderTriggerRegistered = false;

const helperTrigger = register("step", () => { // make sure to register render trigger only when needed
	if (Dungeon.inDungeon) {
		if (renderTriggerRegistered) return;
		renderTrigger.register();
		renderTriggerRegistered = true;
	} else {
		if (!renderTriggerRegistered) return;
		renderTrigger.unregister();
		renderTriggerRegistered = false;
	}
}).setFps(1).unregister();

const renderTrigger = register("renderEntity", (entity, _, partialTicks, event) => {
	if (entity.isDead()) return;
	if (!items.includes(ChatLib.removeFormatting(entity.entity.func_92059_d().func_82833_r()))) return;
	const distance = entity.distanceTo(Player.getPlayer());
	const x = interpolate(entity.getLastX(), entity.getX(), partialTicks);
	const y = interpolate(entity.getLastY(), entity.getY(), partialTicks);
	const z = interpolate(entity.getLastZ(), entity.getZ(), partialTicks);
	Tessellator.disableLighting();
	if (distance < 3.5) {
		if (entity.getTicksExisted() < 11) {
			RenderLib.drawInnerEspBox(x, y, z, 0.3, 0.3, Settings.itemHighlightColor2.getRed() / 255, Settings.itemHighlightColor2.getGreen() / 255, Settings.itemHighlightColor2.getBlue() / 255, Settings.itemHighlightColor2.getAlpha() / 255, true);
		} else {
			RenderLib.drawInnerEspBox(x, y, z, 0.3, 0.3, Settings.itemHighlightColor1.getRed() / 255, Settings.itemHighlightColor1.getGreen() / 255, Settings.itemHighlightColor1.getBlue() / 255, Settings.itemHighlightColor1.getAlpha() / 255, true);
		}
	} else {
		RenderLib.drawInnerEspBox(x, y, z, 0.3, 0.3, Settings.itemHighlightColor3.getRed() / 255, Settings.itemHighlightColor3.getGreen() / 255, Settings.itemHighlightColor3.getBlue() / 255, Settings.itemHighlightColor3.getAlpha() / 255, true);
	}
	Tessellator.enableLighting();
	if (Settings.itemHighlightPreventRendering) cancel(event);
}).setFilteredClass(EntityItem).unregister();

function interpolate(n1, n2, p) {
	return n1 + (n2 - n1) * p;
}

export function enable() {
	helperTrigger.register();
}

export function disable() {
	helperTrigger.unregister();
	if (renderTriggerRegistered) {
		renderTrigger.unregister();
		renderTriggerRegistered = false;
	}
}

export default { enable, disable };
