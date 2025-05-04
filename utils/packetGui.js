const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow");
const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");
const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot");
const C0DPacketCloseWindow = Java.type("net.minecraft.network.play.client.C0DPacketCloseWindow");
const C0EPacketClickWindow = Java.type("net.minecraft.network.play.client.C0EPacketClickWindow");

export default class PacketGui {
	constructor(windowId, title, slots) {
		this.windowId = windowId;

		fireChannelRead(new S2DPacketOpenWindow(this.windowId, "minecraft:chest", new TextComponent(title).chatComponentText, slots));

		this.listeners = {
			close: [],
			click: []
		};

		this.clickTrigger = register("packetSent", (packet, event) => {
			if (packet.func_149548_c() !== this.windowId) return;
			cancel(event);
			// slot, button, mode
			this.listeners.click.forEach(listener => listener(packet.func_149544_d(), packet.func_149543_e(), packet.func_149542_h()));
		}).setFilteredClass(C0EPacketClickWindow);

		this.closeTrigger1 = register("packetSent", (_, event) => {
			cancel(event);
			this.destroy();
		}).setFilteredClass(C0DPacketCloseWindow);

		this.closeTrigger2 = register("packetReceived", () => {
			this.destroy();
		}).setFilteredClass(S2EPacketCloseWindow);
	}

	destroy() {
		if (this.destroyed) return false;
		this.destroyed = true;
		this.clickTrigger.unregister();
		this.closeTrigger1.unregister();
		this.closeTrigger2.unregister();
		this.listeners.close.forEach(listener => listener());
		return true;
	}

	onClose(listener) {
		this.listeners.close.push(listener);
	}

	onClick(listener) {
		this.listeners.click.push(listener);
	}

	close() {
		fireChannelRead(new S2EPacketCloseWindow(this.windowId));
		this.destroy();
	}

	setSlot(slot, item) {
		if (!item) item = null;
		else if (item instanceof Item) item = item.getItemStack();
		fireChannelRead(new S2FPacketSetSlot(this.windowId, slot, item));
	}

	setCursor(item) {
		if (!item) item = null;
		else if (item instanceof Item) item = item.getItemStack();
		fireChannelRead(new S2FPacketSetSlot(-1, 0, item));
	}
}

function fireChannelRead(packet) {
	Client.getConnection().func_147298_b().channel().pipeline().fireChannelRead(packet);
}

function fireChannelWrite(packet) {
	Client.getConnection().func_147298_b().channel().pipeline().write(packet);
}
