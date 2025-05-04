const keyTrigger = register("guiKey", (_0, keyCode, _1, event) => {
	const container = Player.getContainer();
	if (!container) return;
	if (!/^Wardrobe \(\d\/\d\)$/.test(container.getName())) return;
	let keyInfo = -1;
	if (keyCode > 1 && keyCode < 11) {
		keyInfo = keyCode - 2;
	} else if ([30, 203].includes(keyCode)) {
		keyInfo = 9;
	} else if ([32, 205].includes(keyCode)) {
		keyInfo = 10;
	}
	if (keyInfo === -1) return;
	if (keyInfo < 9) {
		container.click(keyInfo + 36);
	} else if (keyInfo === 9) {
		container.click(45);
	} else if (keyInfo === 10) {
		container.click(53);
	}
	cancel(event);
}).unregister();

export function enable() {
	keyTrigger.register();
}

export function disable() {
	keyTrigger.unregister();
}

export default { enable, disable };
