/// <reference types="../../../../CTAutocomplete" />

import chat from "../../../utils/chat";
import saCommand from "../../../events/saCommand";
import numbers from "./numbers";
import maze from "./maze";

const terminals = { numbers, maze };

saCommand.addListener("termsim", (terminalName, ping) => {
	ping = parseInt(ping);
	if (Number.isNaN(ping)) ping = 0;
	if (!terminals[terminalName]) {
		chat.chat("Invalid Terminal!");
		return;
	}
	terminals[terminalName].open(ping);
});
