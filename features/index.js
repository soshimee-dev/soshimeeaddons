import Settings from "../config";
import bloodHelper from "./bloodHelper";
import hideLobbyJoinMessages from "./hideLobbyJoinMessages";
import partyInviteNotification from "./partyInviteNotification";
import catSounds from "./catSounds";
import mute from "./mute";
import betterPartyFinder from "./betterPartyFinder";
import melodyAlert from "./melodyAlert";
import deathAlert from "./deathAlert";
import mimicRelay from "./mimicRelay";
import sbeBloodFix from "./sbeBloodFix";
import p3StartTimer from "./p3StartTimer";
import i4Helper from "./i4Helper";
import shadowAssassinAlert from "./shadowAssassinAlert";
import partyFinderNote from "./partyFinderNote";
import partyFinderAutoKick from "./partyFinderAutoKick";
import invincibilityTimer from "./invincibilityTimer";
import goldorTickTimer from "./goldorTickTimer";
import deathTickTimer from "./deathTickTimer";
import leapHelper from "./leapHelper";
import positionalMessages from "./positionalMessages";
import rightClickAnimation from "./rightClickAnimation";
import partyCommands from "./partyCommands";
import terminals from "./terminals";
import wardrobeHelper from "./wardrobeHelper";
import itemHighlight from "./itemHighlight";
import padTickTimer from "./padTickTimer";
import showTerminalClicks from "./showTerminalClicks";

export const features = { bloodHelper, hideLobbyJoinMessages, partyInviteNotification, catSounds, mute, betterPartyFinder, melodyAlert, deathAlert, mimicRelay, sbeBloodFix, p3StartTimer, i4Helper, shadowAssassinAlert, partyFinderNote, partyFinderAutoKick, invincibilityTimer, goldorTickTimer, deathTickTimer, leapHelper, positionalMessages, rightClickAnimation, partyCommands, terminals, wardrobeHelper, itemHighlight, padTickTimer, showTerminalClicks };

const featureState = {};
Object.keys(features).forEach(featureName => featureState[featureName] = false);

export function update() {
	Object.keys(featureState).forEach(featureName => {
		features[featureName]?.update();
		if (Settings[featureName + "Enabled"] && Settings.enabled) {
			if (featureState[featureName]) return;
			features[featureName]?.enable();
		} else {
			if (!featureState[featureName]) return;
			features[featureName]?.disable();
		}
		featureState[featureName] = Settings[featureName + "Enabled"] && Settings.enabled;
	});
}
export default { features, update };
