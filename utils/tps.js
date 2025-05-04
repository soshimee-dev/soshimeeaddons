import Promise from "../../PromiseV2";
import * as tick from "../events/tick";

export function getTPS(ticks = 50) {
	let done = false;
	let lastTime = 0;
	const diffs = [];

	return new Promise((resolve, reject) => {
		const listener = () => {
			diffs.push(new Date().getTime() - lastTime);
			if (diffs.length > ticks) {
				tick.removeListener(listener);
				diffs.shift();
				resolve(1000 / (diffs.reduce((prev, cur) => prev + cur) / ticks));
				done = true;
			}
			lastTime = new Date().getTime();
		};
		tick.addListener(listener);

		setTimeout(() => {
			if (!done) {
				tick.removeListener(listener);
				reject();
				done = true;
			}
		}, ticks * 500);
	});
}

export default getTPS;
