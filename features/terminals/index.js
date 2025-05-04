import Settings from "../../config";
import numbers from "./numbers";
import colors from "./colors";
import startswith from "./startswith";
import rubix from "./rubix";
import redgreen from "./redgreen";
import melody from "./melody";

function capitalize(string) {
	return string[0].toUpperCase() + string.substring(1);
}

export const features = { numbers, colors, startswith, rubix, redgreen, melody };

const featureState = {};
Object.keys(features).forEach(featureName => featureState[featureName] = false);

export function update() {
	Object.keys(featureState).forEach(featureName => {
		if (Settings["terminals" + capitalize(featureName) + "Enabled"] && Settings.terminalsEnabled) {
			if (featureState[featureName]) return;
			features[featureName]?.enable();
		} else {
			if (!featureState[featureName]) return;
			features[featureName]?.disable();
		}
		features[featureName]?.update();
		featureState[featureName] = Settings["terminals" + capitalize(featureName) + "Enabled"] && Settings.terminalsEnabled;
	});
}

export default { features, update };
