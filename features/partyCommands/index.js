/// <reference types="../../CTAutocomplete" />

import saCommand from "../../events/saCommand";
import packetChat from "../../events/packetChat";
import chat from "../../utils/chat";

import { stripRank } from "../../../BloomCore/utils/Utils";
import Party from "../../../BloomCore/Party";
import Formula from "../../../fparser";

import Settings from "../../config";

import generateFox from "../../utils/fox";
import generateCat from "../../utils/cat";
import getPing from "../../utils/ping";
import getTPS from "../../utils/tps";

const catacombs = {
	prefix: "catacombs_",
	floors: ["entrance", "floor_one", "floor_two", "floor_three", "floor_four", "floor_five", "floor_six", "floor_seven"]
};
const catacombsMaster = {
	prefix: "master_catacombs_",
	floors: [, "floor_one", "floor_two", "floor_three", "floor_four", "floor_five", "floor_six", "floor_seven"]
};

class Command {
	constructor(name, aliases, execute, args, config, permission) {
		this.name = name;
		this.aliases = aliases;
		this.execute = execute;
		this.args = args;
		this.config = config;
		this.permission = permission;
	}
}

const commands = [];
commands.push(new Command("calc", [], (_0, _1, ...args) => {
	ChatLib.command("party chat " + Formula.calc(args.join(" ")));
}, 1, "partyCommandsCommandCalcEnabled", null));
commands.push(new Command("ping", [], () => {
	getPing().then(ping => {
		ChatLib.command("party chat " + ping + "ms");
	}).catch(() => {
		ChatLib.command("party chat Ping timed out");
	});
}, 0, "partyCommandsCommandPingEnabled", null));
commands.push(new Command("tps", [], () => {
	getTPS().then(tps => {
		ChatLib.command("party chat " + tps.toFixed(2));
	}).catch(() => {
		ChatLib.command("party chat TPS timed out");
	});
}, 0, "partyCommandsCommandTpsEnabled", null));
commands.push(new Command("fps", [], () => {
	ChatLib.command("party chat " + Client.getFPS());
}, 0, "partyCommandsCommandFpsEnabled", null));
commands.push(new Command("transfer", ["pt", "ptme"], (player, _, ...args) => {
	if (!args) args = [];
	ChatLib.command("party transfer " + (args[0] ? Object.keys(Party.members).find(member => member.toLowerCase().startsWith(args[0].toLowerCase())) : player));
}, 0, "partyCommandsCommandTransferEnabled", "leader"));
commands.push(new Command("kick", ["pt", "ptme"], (player, _, ...args) => {
	if (!args) args = [];
	ChatLib.command("party kick " + (args[0] ? Object.keys(Party.members).find(member => member.toLowerCase().startsWith(args[0].toLowerCase())) : player));
}, 0, "partyCommandsCommandKickEnabled", "leader"));
commands.push(new Command("promote", [], (player, _, ...args) => {
	if (!args) args = [];
	ChatLib.command("party promote " + (args[0] ? Object.keys(Party.members).find(member => member.toLowerCase().startsWith(args[0].toLowerCase())) : player));
}, 0, "partyCommandsCommandPromoteEnabled", "leader"));
commands.push(new Command("demote", [], (player, _, ...args) => {
	if (!args) args = [];
	ChatLib.command("party demote " + (args[0] ? Object.keys(Party.members).find(member => member.toLowerCase().startsWith(args[0].toLowerCase())) : player));
}, 0, "partyCommandsCommandDemoteEnabled", "leader"));
commands.push(new Command("allinvite", ["allinv", "ai"], () => {
	ChatLib.command("party setting allinvite");
}, 0, "partyCommandsCommandAllinviteEnabled", "leader"));
commands.push(new Command("warp", [], () => {
	ChatLib.command("party warp");
}, 0, "partyCommandsCommandWarpEnabled", "leader"));
commands.push(new Command("f0", ["f1", "f2", "f3", "f4", "f5", "f6", "f7"], (_, command) => {
	ChatLib.command("joininstance " + catacombs.prefix + catacombs.floors[parseInt(command.substring(1))]);
}, 0, "partyCommandsCommandF0Enabled", "leader"));
commands.push(new Command("m1", ["m2", "m3", "m4", "m5", "m6", "m7"], (_, command) => {
	ChatLib.command("joininstance " + catacombsMaster.prefix + catacombsMaster.floors[parseInt(command.substring(1))]);
}, 0, "partyCommandsCommandM0Enabled", "leader"));
commands.push(new Command("cat", [], () => {
	generateCat().then(link => ChatLib.command("party chat " + link));
}, 0, "partyCommandsCommandCatEnabled", null));
commands.push(new Command("fox", [], () => {
	generateFox().then(link => ChatLib.command("party chat " + link));
}, 0, "partyCommandsCommandFoxEnabled", null));
commands.push(new Command("help", [], () => {
	ChatLib.command("party chat [SA] " + commands.filter(command => Settings[command.config]).map(command => command.name).join(", "));
}, 0, "partyCommandsCommandHelpEnabled", null));

function execute(player, commandName, ...args) {
	if (!args) args = [];
	const command = commands.find(command => command.name === commandName || command.aliases.includes(commandName));
	if (command === undefined) return;
	if (!Settings[command.config]) return;
	if (args.length < command.args) {
		ChatLib.command("party chat [SA] Too few arguments");
		return;
	}
	if (command.permission === "leader" && !leader()) return;
	command.execute(player, commandName, ...args);
}

function leader() {
	return Party.leader === Player.getName();
}

class Blacklist {
	constructor() {
		this.blacklist = Settings.partyCommandsBlacklist === "" ? [] : Settings.partyCommandsBlacklist.split(",");
	}

	add(name) {
		this.blacklist.push(name);
		this.update();
	}

	remove(name) {
		if (this.blacklist.includes(name)) {
			this.blacklist.splice(this.blacklist.indexOf(name), 1);
			this.update();
			return true;
		} else return false;
	}

	clear() {
		this.blacklist = [];
		this.update();
	}

	includes(name) {
		return this.blacklist.includes(name);
	}

	isEmpty() {
		return this.blacklist.length === 0;
	}

	update() {
		Settings.partyCommandsBlacklist = this.blacklist.join(",");
	}
}

class Whitelist {
	constructor() {
		this.whitelist = Settings.partyCommandsWhitelist === "" ? [] : Settings.partyCommandsWhitelist.split(",");
	}

	add(name) {
		this.whitelist.push(name);
		this.update();
	}

	remove(name) {
		if (this.whitelist.includes(name)) {
			this.whitelist.splice(this.whitelist.indexOf(name), 1);
			this.update();
			return true;
		} else return false;
	}

	clear() {
		this.whitelist = [];
		this.update();
	}

	includes(name) {
		return this.whitelist.includes(name);
	}

	isEmpty() {
		return this.whitelist.length === 0;
	}

	update() {
		Settings.partyCommandsWhitelist = this.whitelist.join(",");
	}
}

const blacklist = new Blacklist();
const whitelist = new Whitelist();

function commandListener(command, ...args) {
	switch (command) {
		case "blacklist": {
			chat.chat(blacklist.blacklist.join(", "));
			break;
		}
		case "addblacklist": {
			if (!args[0]) break;
			blacklist.add(args[0]);
			chat.chat(args[0] + " added to blacklist");
			break;
		}
		case "removeblacklist": {
			if (!args[0]) break;
			blacklist.remove(args[0]);
			chat.chat(args[0] + " removed from blacklist");
			break;
		}
		case "clearblacklist": {
			blacklist.clear();
			chat.chat("blacklist cleared");
			break;
		}
		case "whitelist": {
			chat.chat(whitelist.whitelist.join(", "));
			break;
		}
		case "addwhitelist": {
			if (!args[0]) break;
			whitelist.add(args[0]);
			chat.chat(args[0] + " added to whitelist");
			break;
		}
		case "removewhitelist": {
			if (!args[0]) break;
			whitelist.remove(args[0]);
			chat.chat(args[0] + " removed from whitelist");
			break;
		}
		case "clearwhitelist": {
			whitelist.clear();
			chat.chat("whitelist cleared");
			break;
		}
		default: {
			chat.chat("Party Commands Help:");
			chat.chat("- /sa pc blacklist: List blacklisted players");
			chat.chat("- /sa pc addblacklist <player>: Add a player to the blacklist");
			chat.chat("- /sa pc removeblacklist <player>: Remove a player from the blacklist");
			chat.chat("- /sa pc clearblacklist: Clear the blacklist");
			chat.chat("- /sa pc whitelist: List whitelisted players");
			chat.chat("- /sa pc addwhitelist <player>: Add a player to the whitelist");
			chat.chat("- /sa pc removewhitelist <player>: Remove a player from the whitelist");
			chat.chat("- /sa pc clearwhitelist: Clear the whitelist");
			break;
		}
	}
}

function chatListener(message) {
	const match = message.match(/^Party > (.*?): (.*)$/);
	if (match === null) return;
	let [, player, message] = match;
	player = stripRank(player);
	const prefixes = Settings.partyCommandsPrefix.split(",");
	const prefix = prefixes.find(prefix => message.startsWith(prefix));
	if (prefix === undefined) return;
	if (blacklist.includes(player)) return;
	if (!whitelist.isEmpty() && !whitelist.includes(player)) return;
	setTimeout(() => execute(player, ...message.substring(prefix.length).split(" ")), 500);
}

export function enable() {
	saCommand.addListener("pc", commandListener);
	packetChat.addListener(chatListener);
}

export function disable() {
	saCommand.removeListener("pc");
	packetChat.removeListener(chatListener);
}

export default { enable, disable };
