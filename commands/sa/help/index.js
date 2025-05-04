import saCommand from "../../../events/saCommand";
import chat from "../../../utils/chat";

saCommand.addListener("help", () => {
	chat.chat("SA Help:");
	chat.chat("- /sa: Open settings menu");
	chat.chat("- /sa help: Display this message");
	chat.chat("- /ping: Calculate your ping");
	chat.chat("- /tps: Calculate the server's TPS");
	chat.chat("- /fps: Display your FPS");
});
