import Promise from "../../PromiseV2";
import request from "../../requestV2";

// incomplete api wrapper (todo)

const uuids = {};

export function getUUID(name, cache = true) {
	name = name.toLowerCase();
	return new Promise(resolve => {
		if (cache && name in uuids) resolve(uuids[name]);
		else request({ url: "https://api.mojang.com/users/profiles/minecraft/" + name, json: true, headers: { "User-Agent": "Mozilla/5.0" } }).then(data => {
			uuids[name] = data.id;
			resolve(data.id);
		});
	});
}
