import request from "../../requestV2";
import Promise from "../../PromiseV2";

export function generateFox() {
	return new Promise(resolve => {
		request({ url: "https://randomfox.ca/floof", json: true, headers: { "User-Agent": "Mozilla/5.0" } }).then(({ image: rawLink }) => {
			request({ url: "https://api.imgur.com/3/image", method: "POST", headers: { Authorization: "Client-ID d30c6dc9941b52b" }, body: { image: rawLink }, json: true }).then(({ data: { link } }) => resolve(link));
		});
	});
}

export default generateFox;
