import request from "../../requestV2";
import Promise from "../../PromiseV2";

export function generateCat() {
	return new Promise(resolve => {
		request({ url: "https://api.imgur.com/3/image", method: "POST", headers: { Authorization: "Client-ID d30c6dc9941b52b" }, body: { image: "https://cataas.com/cat" }, json: true }).then(({ data: { link } }) => resolve(link));
	});
}

export default generateCat;
