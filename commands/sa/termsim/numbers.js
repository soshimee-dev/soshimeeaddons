import chat from "../../../utils/chat";
import PacketGui from "../../../utils/packetGui";

const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect");
const MCItemStack = Java.type("net.minecraft.item.ItemStack");

let cwid = 0;

const allowedSlots = [10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25];

export function open(ping, pattern, clicks = [], time) {
	++cwid;
	if (cwid > 100) cwid = 1;
	const gui = new PacketGui(cwid, "Click in order!", 36);

	if (pattern === undefined) pattern = [...allowedSlots].map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
	if (time === undefined) time = new Date().getTime();

	const patternLeft = [...pattern];
	clicks.forEach(slot => {
		if (patternLeft[0] === slot) patternLeft.shift();
	});

	const state = [];

	const applyState = () => {
		state.forEach((item, slot) => {
			gui.setSlot(slot, item);
		});
	};

	for (let i = 0; i < 36; ++i) {
		state[i] = getPane(15);
	}
	pattern.forEach((slot, index) => {
		state[slot] = getPane(14, index + 1);
	});
	clicks.forEach(slot => {
		state[slot] = getPane(5, pattern.indexOf(slot) + 1);
	});
	applyState();

	playSound("random.click", 0.5, 1);

	gui.onClick((slot, button, mode) => {
		if (patternLeft[0] === slot) {
			gui.destroy();
			setTimeout(() => {
				patternLeft.shift();
				clicks.push(slot);
				playSound("note.pling", 8, 4.047618865966797);
				if (patternLeft.length === 0) {
					gui.close();
					chat.chat("Terminal complete!");
					chat.chat("Time taken: §a" + (new Date().getTime() - time) + "§rms");
					open(ping);
				} else {
					open(ping, pattern, clicks, time);
				}
			}, ping);
		} else {
			setTimeout(() => {
				gui.setCursor();
				applyState();
			}, ping);
		}
	});
}

function getPane(meta, count = 1) {
	if (count === undefined) count = 1;
	return new Item(new MCItemStack(new Item(160).getItem(), count, meta)).setName("");
}

function playSound(soundName, volume, pitch) {
	try {
		new S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), volume, pitch).func_148833_a(Client.getConnection());
	} catch (error) {}
}

export default { open };
