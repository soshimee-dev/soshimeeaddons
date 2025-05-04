const Toolkit = Java.type("java.awt.Toolkit");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");

export function copy(text) {
	ChatLib.command("ct copy " + text, true);
}

export function paste() {
	return Toolkit.getDefaultToolkit().getSystemClipboard().getData(DataFlavor.stringFlavor);
}

export default { copy, paste };
