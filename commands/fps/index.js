import chat from "../../utils/chat";

export default register("command", () => {
	const fps = Client.getFPS();

	const color = "§a"; // TODO: make proper colors depending on max fps
	chat.chat("FPS: " + color + fps);
}).setName("fps").unregister();
