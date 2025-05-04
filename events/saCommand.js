const listeners = [];

register("command", (command, ...args) => {
	const result = listeners.find(listener => listener[0] === command);
	if (!args) args = [];
	if (result) result[1](...args);
}).setName("soshimeeaddons").setAliases("sa");

export function addListener(name, listener) {
	listeners.push([name, listener]);
}

export function removeListener(name) {
	const index = listeners.findIndex(listener => listener[0] === name);
	if (index === -1) return false;
	listeners.splice(index, 1);
	return true;
}

export default { addListener, removeListener };
