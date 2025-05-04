/// <reference types="../../CTAutocomplete" />

import Dungeon from "../../BloomCore/dungeons/Dungeon";

global.soshimee ??= {};
global.soshimee.events ??= {};
global.soshimee.events.dungeonRoom ??= {};

const listeners = global.soshimee.events.dungeonRoom.listeners ??= [];

let roomX = -1;
let roomZ = -1;
let notified = false;

const trigger = global.soshimee.events.dungeonRoom.trigger ??= register("tick", () => {
	if (!Dungeon.inDungeon) {
		if (!notified) {
			for (let listener of listeners) {
				listener(0);
			}
			roomX = -1;
			roomZ = -1;
			notified = true;
		}
		return;
	}

	const prevRoomX = roomX;
	const prevRoomZ = roomZ;
	const x = Player.getX();
	const z = Player.getZ();
	if (x < -200 || z < -200 || x > 0 || z > 0) {
		if (!notified) {
			for (let listener of listeners) {
				listener(0);
			}
			roomX = -1;
			roomZ = -1;
			notified = true;
		}
		return;
	}
	roomX = Math.floor((x + 200) / 32);
	roomZ = Math.floor((z + 200) / 32);

	if (prevRoomX != roomX || prevRoomZ != roomZ) {
		const cx = -185 + roomX * 32;
		const cz = -185 + roomZ * 32;

		const roofHeight = getHighestBlock(cx, cz);

		for (let listener of listeners) {
			listener(getCore(cx, cz), getRotation(cx, roofHeight, cz));
		}

		notified = false;
	}
}).unregister();

const offsets = [[-15, -15], [15, -15], [15, 15], [-15, 15]];
const blacklisted = [5, 54];
function hashCode(s) {
	return s.split("").reduce((a, b) => {
		a = ((a << 5) - a) + b.charCodeAt(0);
		return a & a;
	}, 0);
}
function getCore(x, z) {
	let blockIds = ""
	for (let y = 140; y >= 12; --y) {
		let block = World.getBlockAt(x, y, z);
		if (blacklisted.includes(block.type.getID())) continue;
		blockIds += block.type.getID();
	}
	return hashCode(blockIds);
};
function getHighestBlock(x, z) {
	for (let y = 255; y > 0; --y) {
		let id = World.getBlockAt(x, y, z)?.type?.getID();
		if (id == 0 || id == 41) continue;
		return y;
	}
	return null;
}
function getRotation(x, y, z) {
	if (!y) return;

	for (let i = 0; i < offsets.length; ++i) {
		let [dx, dz] = offsets[i];
		let [nx, nz] = [x + dx, z + dz];
		let block = World.getBlockAt(nx, y, nz);
		if (block.type.getID() !== 159 || block.getMetadata() !== 11) continue;
		return i;
	}
}

export function addListener(listener) {
	if (listeners.length === 0) trigger.register();
	listeners.push(listener);
}

export function removeListener(listener) {
	const index = listeners.indexOf(listener);
	if (index === -1) return false;
	listeners.splice(index, 1);
	if (listeners.length === 0) trigger.unregister();
	return true;
}

export default { addListener, removeListener };
