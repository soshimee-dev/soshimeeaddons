const f = FileLib.read("Vigilance", "index.js");
const a = "const isIntegerDesired = attributes.type === PropertyType.SLIDER || attributes.type === PropertyType.SELECTOR;\n";
const b = "const isIntegerDesired = [PropertyType.SLIDER, PropertyType.SELECTOR, PropertyType.NUMBER].includes(attributes.type);\n";
if (f.includes(a)) {
	FileLib.write("Vigilance", "index.js", f.replace(a, b));
	const trigger = register("worldLoad", () => {
		trigger.unregister();
		ChatTriggers.reloadCT();
	});
}
