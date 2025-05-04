import Settings from "../../config";
import saCommand from "../../events/saCommand";
import "./help";
import "./termsim";

saCommand.addListener(undefined, () => Settings.openGUI());

// inconsistent structure, but whatever
