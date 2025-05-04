import PogObject from "../../../PogData";
import request from "../../../requestV2";
import chat from "../../utils/chat";
import saCommand from "../../events/saCommand";
import packetChat from "../../events/packetChat";

const data = new PogObject("soshimeeaddons", {
	enabled: true,
	pbCriteria: {
		enabled: false,
		time: 270000,
		dungeon: "catacombs",
		floor: 7,
		type: "s+"
	},
	secretsCriteria: {
		enabled: false,
		amount: 50000
	}
}, "./data/partyFinderAutoKick.json");

function chatListener(message) {
	if (!data.enabled) return;
	const match = message.match(/^Party Finder > (.*) joined the dungeon group! \(.* Level .*\)$/);
	if (match === null) return;
	const [_, player] = match;
	request({ url: "https://api.icarusphantom.dev/v1/sbecommands/cata/" + player + "/selected", json: true, headers: { "User-Agent": "Mozilla/5.0" } }).then(({ data: playerData }) => {
		let kicked = false;
		if (data.pbCriteria.enabled && !kicked) {
			const pb = getFastestTime(playerData, data.pbCriteria.dungeon, data.pbCriteria.floor, data.pbCriteria.type);
			if (pb >= data.pbCriteria.time) {
				ChatLib.command("party chat AutoKick: Kicked " + player + " (PB). " + pb + " >= " + data.pbCriteria.time);
				setTimeout(() => ChatLib.command("party kick " + player), 300);
				chat.chat("AutoKick: Kicked " + player + " (PB). " + pb + " >= " + data.pbCriteria.time);
				kicked = true;
			} else {
				chat.chat("AutoKick: " + player + " meets criteria (PB). " + pb + " < " + data.pbCriteria.time);
			}
		}
		if (data.secretsCriteria.enabled && !kicked) {
			const secrets = getSecrets(playerData);
			if (secrets < data.secretsCriteria.amount) {
				ChatLib.command("party chat AutoKick: Kicked " + player + " (Secrets). " + secrets + " < " + data.secretsCriteria.amount);
				setTimeout(() => ChatLib.command("party kick " + player), 300);
				chat.chat("AutoKick: Kicked " + player + " (Secrets). " + secrets + " < " + data.secretsCriteria.amount);
				kicked = true;
			} else {
				chat.chat("AutoKick: " + player + " meets criteria (Secrets). " + secrets + " >= " + data.secretsCriteria.amount);
			}
		}
	}).catch(() => {
		chat.chat("AutoKick: Failed to get stats for " + player + ".");
	});
}

function commandListener(type, ...args) {
	if (!args) args = [];
	args = args.filter(arg => arg !== null); // ??????
	if (type === "disable") {
		data.enabled = false;
		chat.chat("AutoKick: Disabled");
	} else if (type === "pb") {
		if (args.length < 3) {
			data.pbCriteria.enabled = false;
			chat.chat("AutoKick: PB disabled");
			return;
		}
		const mappedDungeon = { f: "catacombs", m: "master_catacombs" };
		const dungeon = mappedDungeon[args[0][0].toLowerCase()];
		const floor = parseInt(args[0][1]);
		const type = args[1].toLowerCase();
		const time = mmssToMillis(args[2]);
		data.enabled = true;
		data.pbCriteria.enabled = true;
		data.pbCriteria.dungeon = dungeon;
		data.pbCriteria.floor = floor;
		data.pbCriteria.type = type;
		data.pbCriteria.time = time;
		chat.chat("AutoKick: PB enabled");
		chat.chat("AutoKick: Dungeon: " + dungeon);
		chat.chat("AutoKick: Floor: " + floor);
		chat.chat("AutoKick: Type: " + type);
		chat.chat("AutoKick: Time: " + time);
	} else if (type === "secrets") {
		if (args.length < 1) {
			data.secretsCriteria.enabled = false;
			chat.chat("AutoKick: Secrets disabled");
			return;
		}
		const amount = parseInt(args[0]);
		data.enabled = true;
		data.secretsCriteria.enabled = true;
		data.secretsCriteria.amount = amount;
		chat.chat("AutoKick: Secrets enabled");
		chat.chat("AutoKick: Amount: " + amount);
	} else {
		chat.chat("AutoKick Help:");
		chat.chat("- /sa autokick disable: Disable AutoKick");
		chat.chat("- /sa autokick pb: Disable PB AutoKick");
		chat.chat("- /sa autokick pb <floor (f0-f7|m1-m7)> <type (any|s|s+)> <pb (mm:ss)>: Set PB AutoKick settings");
		chat.chat("- /sa autokick secrets: Disable Secrets AutoKick");
		chat.chat("- /sa autokick secrets <amount>: Set Secrets AutoKick settings");
	}
	data.save();
}

function getFastestTime(playerData, dungeon, floor, type) {
	const mappedDungeon = { "catacombs": "floors", "master_catacombs": "master_mode_floors" }[dungeon];
	const mappedFloor = ["entrance", "floor_1", "floor_2", "floor_3", "floor_4", "floor_5", "floor_6", "floor_7"][floor];
	const floorData = playerData.dungeons.catacombs[mappedDungeon][mappedFloor];
	if (type === "any") return floorData.fastest ?? Number.MAX_VALUE;
	else if (type === "s") return floorData.fastest_s ?? Number.MAX_VALUE;
	else if (type === "s+") return floorData.fastest_s_plus ?? Number.MAX_VALUE;
}

function getSecrets(playerData) {
	return playerData.dungeons.secrets_found;
}

function mmssToMillis(mmss) {
	const match = mmss.match(/^(\d+):(\d+)$/);
	if (match === null) return;
	const [mm, ss] = match.splice(1).map(t => parseInt(t));
	return (mm * 60 + ss) * 1000;
}

export function enable() {
	packetChat.addListener(chatListener);
	saCommand.addListener("autokick", commandListener);
}

export function disable() {
	packetChat.removeListener(chatListener);
	saCommand.removeListener("autokick");
}

export default { enable, disable };
