/// <reference types="../CTAutocomplete" />

import "./vgp";
import commands from "./commands";
import features from "./features";

const SettingsGui = Java.type("gg.essential.vigilance.gui.SettingsGui");

update();

register("guiClosed", gui => {
	if (!(gui instanceof SettingsGui)) return;
	update();
});

function update() {
	commands.update();
	features.update();
}
