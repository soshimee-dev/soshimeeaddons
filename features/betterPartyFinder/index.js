import Promise from "../../../PromiseV2";
import request from "../../../requestV2";
// import * as packetSetSlot from "../events/packetSetSlot";
import packetWindowItems from "../../events/packetWindowItems";
import xp from "../../utils/xp";

// packetSetSlot.addListener((itemStack, slot) => {
// 	if (itemStack === null) return;
// 	onItem(new Item(itemStack), slot);
// });

function listener(itemStacks) {
	for (let i = 0; i < itemStacks.length; ++i) {
		if (itemStacks[i] === null) continue;
		onItem(new Item(itemStacks[i]), i);
	}
}

function onItem(item, slot) {
	if (Player.getContainer() === null) return;
	if (Player.getContainer().getName() !== "Party Finder") return;
	if (slot < 10) return;
	if (slot > 16 && slot < 19) return;
	if (slot > 25 && slot < 28) return;
	if (slot > 34) return;
	if (!/^§6.*'s Party$/.test(item.getName())) return;
	const lore = item.getNBT().toObject().tag?.display?.Lore;
	if (lore === undefined) return;
	const memberOffset = lore.indexOf("§f§7Members: ") + 1;
	const dungeon = {"The Catacombs": "catacombs", "Master Mode Catacombs": "master_catacombs"}[lore[0].match(/^§7Dungeon: §b(.*)$/)[1]];
	const floor = {"Entrance": 0, "Floor I": 1, "Floor II": 2, "Floor III": 3, "Floor IV": 4, "Floor V": 5, "Floor VI": 6, "Floor VII": 7}[lore[1].match(/^§7Floor: §b(.*)$/)[1]];
	for (let i = 0; i < 5; ++i) {
		let member = lore[memberOffset + i].match(/^ §.(.*)§f: §e.*§b \(§e\d*§b\)$/)?.[1];
		if (member === undefined) break;
		let loreLeft = lore[memberOffset + i].split(":")[0];
		let badData = lore[memberOffset + i].match(/^ §..*§f: §e(.*)§b \(§e(\d*)§b\)$/);
		lore[memberOffset + i] = loreLeft + " §7[§c" + badData[1].substring(0, 1) + badData[2] + "§7]";
		item.setLore(...lore);
		let ci = i;
		getPlayerData(member).then(data => {
			let newLore = loreLeft;
			newLore += " §7[§cC";
			newLore += xp.getCatacombsLevel(data.dungeons.catacombs.skill.xp).toFixed(2);
			newLore += "§7/§c";
			newLore += badData[1].substring(0, 1);
			newLore += xp.getCatacombsLevel(data.dungeons.classes[badData[1].toLowerCase()].xp).toFixed(2);
			newLore += "§7/§e";
			newLore += data.dungeons.secrets_found;
			newLore += "§7/§a";
			newLore += getCompletions(data, dungeon, floor);
			newLore += "§7/§a";
			if (dungeon === "catacombs") {
				if (floor === 0) newLore += getFormattedFastestTime(data, dungeon, floor);
				else if (floor < 5) newLore += getFormattedFastestTime(data, dungeon, floor, "s");
				else newLore += getFormattedFastestTime(data, dungeon, floor, "s+");
			} else if (dungeon === "master_catacombs") {
				if (floor < 4) newLore += getFormattedFastestTime(data, dungeon, floor, "s");
				else newLore += getFormattedFastestTime(data, dungeon, floor, "s+");
			}
			newLore += "§7]";
			lore[memberOffset + ci] = newLore;
			item.setLore(...lore);
		});
	}
};

const playerDataCache = {};
const playerDataRequests = {};

function getPlayerData(player) {
	return new Promise((resolve, reject) => {
		if (player in playerDataRequests) playerDataRequests[player].then(({ data }) => resolve(data));
		if (player in playerDataCache) resolve(playerDataCache[player]);
		else {
			playerDataRequests[player] = request({ url: "https://api.icarusphantom.dev/v1/sbecommands/cata/" + player + "/selected", json: true, headers: { "User-Agent": "Mozilla/5.0" } }).then(({ data }) => {
				playerDataCache[player] = data;
				delete playerDataRequests[player];
				resolve(data);
			}).catch(rejected => {
				delete playerDataRequests[player];
				reject(rejected)
			});
		}
	});
}

function getCompletions(playerData, dungeon, floor) {
	const mappedDungeon = {"catacombs": "floors", "master_catacombs": "master_mode_floors"}[dungeon];
	const mappedFloor = ["entrance", "floor_1", "floor_2", "floor_3", "floor_4", "floor_5", "floor_6", "floor_7"][floor];
	const floorData = playerData.dungeons.catacombs[mappedDungeon][mappedFloor];
	return floorData.completions;
}

function getFormattedFastestTime(playerData, dungeon, floor, score) {
	const fastestTime = getFastestTime(playerData, dungeon, floor, score);
	if (fastestTime === null) return "N/A";
	else return formatMS(fastestTime);
}

function getFastestTime(playerData, dungeon, floor, score) {
	const mappedDungeon = {"catacombs": "floors", "master_catacombs": "master_mode_floors"}[dungeon];
	const mappedFloor = ["entrance", "floor_1", "floor_2", "floor_3", "floor_4", "floor_5", "floor_6", "floor_7"][floor];
	const floorData = playerData.dungeons.catacombs[mappedDungeon][mappedFloor];
	if (score === undefined) {
		return floorData.fastest;
	} else if (score === "s") {
		if (floorData.fastest_s === null && floorData.fastest_s_plus === null) return null;
		else if (floorData.fastest_s === null && floorData.fastest_s_plus !== null) return floorData.fastest_s_plus;
		else if (floorData.fastest_s !== null && floorData.fastest_s_plus === null) return floorData.fastest_s;
		else if (floorData.fastest_s !== null && floorData.fastest_s_plus !== null) return Math.min(floorData.fastest_s, floorData.fastest_s_plus);
	} else if (score === "s+") {
		return floorData.fastest_s_plus;
	}
}

function formatMS(ms) {
	return new Date(ms).toISOString().slice(14, 19);
}

export function enable() {
	packetWindowItems.addListener(listener);
}

export function disable() {
	packetWindowItems.removeListener(listener);
}

export default { enable, disable };
