import chat from "../../../utils/chat";
import PacketGui from "../../../utils/packetGui";

const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect");
const MCItemStack = Java.type("net.minecraft.item.ItemStack");

let cwid = 0;

const patterns = [
	[49, 40, 39, 38, 37, 28, 19, 20, 21, 22, 23, 24, 25, 16, 7, 6, 5, 4],
	[2, 11, 10, 19, 28, 37, 38, 39, 30, 31, 22, 23, 14, 15, 16, 25, 34, 43, 42, 51],
	[46, 37, 38, 39, 30, 21, 22, 23, 14, 5, 6, 7, 16, 25, 34, 43, 52],
	[9, 10, 11, 12, 13, 14, 15, 16, 25, 34, 43, 42, 41, 32, 31, 30, 39, 38, 37, 28, 27],
	[46, 37, 38, 39, 40, 41, 42, 33, 24, 23, 22, 21, 12, 3]
];

export function open(ping, pattern, clicks = [], time) {
	++cwid;
	if (cwid > 100) cwid = 1;
	const gui = new PacketGui(cwid, "Navigate the maze!", 54);

	if (pattern === undefined) pattern = Math.floor(Math.random() * patterns.length);
	if (time === undefined) time = new Date().getTime();

	const dumb = patterns[pattern];
	const patternLeft = [...dumb];
	patternLeft.shift();
	patternLeft.pop();
	clicks.forEach(slot => {
		if (patternLeft[0] === slot) patternLeft.shift();
	});

	const state = [];

	const applyState = () => {
		state.forEach((item, slot) => {
			gui.setSlot(slot, item);
		});
	};

	for (let i = 0; i < 54; ++i) {
		state[i] = getPane(15);
	}
	patterns[pattern].forEach(slot => {
		state[slot] = getPane(0);
	});
	state[patterns[pattern][0]] = getPane(5);
	state[patterns[pattern][patterns[pattern].length - 1]] = getPane(14);
	clicks.forEach(slot => {
		state[slot] = getPane(5);
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
