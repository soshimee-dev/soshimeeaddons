import { @Vigilant, @NumberProperty, @TextProperty, @ButtonProperty, @SwitchProperty, @ColorProperty, @DecimalSliderProperty, Color, @SelectorProperty } from "../Vigilance";

@Vigilant("soshimeeaddons", "Shadow Assassin", {
	getCategoryComparator: () => (a, b) => {
		const categories = ["General", "SkyBlock", "Terminals", "Party Commands"];
		return categories.indexOf(a.name) - categories.indexOf(b.name);
	}
})
class Settings {
	@SwitchProperty({
		name: "Toggle",
		description: "Toggle soshimee addons",
		category: "General"
	})
	enabled = true;

	@SwitchProperty({
		name: "Hide lobby join messages",
		description: "Hide join messages that spam your chat in lobby",
		category: "General",
		subcategory: "Hide lobby join messages"
	})
	hideLobbyJoinMessagesEnabled = false;

	@SwitchProperty({
		name: "Party invite notification",
		description: "Meows when you get a party invite",
		category: "General",
		subcategory: "Party invite notification"
	})
	partyInviteNotificationEnabled = false;

	@SwitchProperty({
		name: "Cat sounds",
		description: "Meows when someone says meow in chat",
		category: "General",
		subcategory: "Cat sounds"
	})
	catSoundsEnabled = false;

	@SwitchProperty({
		name: "Mute",
		description: "Mutes specific sounds",
		category: "SkyBlock",
		subcategory: "Mute"
	})
	muteEnabled = false;

	@SwitchProperty({
		name: "Mute Wither Shield",
		description: "Mutes the Wither Shield sound effect",
		category: "SkyBlock",
		subcategory: "Mute"
	})
	muteWitherShield = false;

	@SwitchProperty({
		name: "Mute Bonzo Staff",
		description: "Mutes the Bonzo Staff sound effect",
		category: "SkyBlock",
		subcategory: "Mute"
	})
	muteBonzoStaff = false;

	@SwitchProperty({
		name: "Melody Alert",
		description: "Alerts your party that you got the melody terminal",
		category: "SkyBlock",
		subcategory: "Melody Alert"
	})
	melodyAlertEnabled = false;

	@TextProperty({
		name: "Message",
		category: "SkyBlock",
		subcategory: "Melody Alert"
	})
	melodyAlertMessage = "Melancholy!";

	@SwitchProperty({
		name: "Death Alert",
		description: "Alerts your party when someone dies",
		category: "SkyBlock",
		subcategory: "Death Alert"
	})
	deathAlertEnabled = false;

	@TextProperty({
		name: "Message",
		category: "SkyBlock",
		subcategory: "Death Alert"
	})
	deathAlertMessage = "";

	@SwitchProperty({
		name: "Mimic Relay",
		description: "Relays all party messages containing mimic to the Skytils format",
		category: "SkyBlock",
		subcategory: "Mimic Relay"
	})
	mimicRelayEnabled = false;

	@SwitchProperty({
		name: "SBE Blood Fix",
		description: "Fixes SBE having a stroke when the blood door is skipped",
		category: "SkyBlock",
		subcategory: "SBE Blood Fix"
	})
	sbeBloodFixEnabled = false;

	@SwitchProperty({
		name: "P3 Start Timer",
		description: "Displays a timer until P3 starts",
		category: "SkyBlock",
		subcategory: "P3 Start Timer"
	})
	p3StartTimerEnabled = false;

	@SwitchProperty({
		name: "i4 Helper",
		description: "i4 > pre4 <3",
		category: "SkyBlock",
		subcategory: "i4 Helper"
	})
	i4HelperEnabled = false;

	@SwitchProperty({
		name: "Shadow Assassin Alert",
		description: "Alerts you when a soshimee addons is about to teleport to you",
		category: "SkyBlock",
		subcategory: "Shadow Assassin Alert"
	})
	shadowAssassinAlertEnabled = false;

	@SwitchProperty({
		name: "Better Party Finder",
		description: "Modifies the Party Finder GUI to provide more information",
		category: "SkyBlock",
		subcategory: "Better Party Finder"
	})
	betterPartyFinderEnabled = false;

	@SwitchProperty({
		name: "Party Finder Note",
		description: "Allows you to set Party Finder notes with colors.\nUsage: /sa pfnote <note>",
		category: "SkyBlock",
		subcategory: "Party Finder Note"
	})
	partyFinderNoteEnabled = false;

	@SwitchProperty({
		name: "Party Finder AutoKick",
		description: "Automatically kicks nons from your party.\nUsage: /sa autokick",
		category: "SkyBlock",
		subcategory: "Party Finder AutoKick"
	})
	partyFinderAutoKickEnabled = false;

	@SwitchProperty({
		name: "Invincibility Timer",
		description: "Times Bonzo's Mask and the Phoenix Pet for you (based on server ticks)",
		category: "SkyBlock",
		subcategory: "Invincibility Timer"
	})
	invincibilityTimerEnabled = false;

	@DecimalSliderProperty({
		name: "X",
		category: "SkyBlock",
		subcategory: "Invincibility Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	invincibilityTimerX = 0;

	@DecimalSliderProperty({
		name: "Y",
		category: "SkyBlock",
		subcategory: "Invincibility Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	invincibilityTimerY = 0;

	@DecimalSliderProperty({
		name: "Scale",
		category: "SkyBlock",
		subcategory: "Invincibility Timer",
		minF: 0.25,
		maxF: 4,
		decimalPlaces: 1
	})
	invincibilityTimerScale = 1;

	@SwitchProperty({
		name: "Goldor Tick Timer",
		description: "Times Goldor death ticks (based on server ticks)",
		category: "SkyBlock",
		subcategory: "Goldor Tick Timer"
	})
	goldorTickTimerEnabled = false;

	@DecimalSliderProperty({
		name: "X",
		category: "SkyBlock",
		subcategory: "Goldor Tick Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	goldorTickTimerX = 0;

	@DecimalSliderProperty({
		name: "Y",
		category: "SkyBlock",
		subcategory: "Goldor Tick Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	goldorTickTimerY = 0;

	@DecimalSliderProperty({
		name: "Scale",
		category: "SkyBlock",
		subcategory: "Goldor Tick Timer",
		minF: 0.25,
		maxF: 4,
		decimalPlaces: 1
	})
	goldorTickTimerScale = 1;

	@SwitchProperty({
		name: "Pad Tick Timer",
		description: "Times Storm pad ticks (based on server ticks)",
		category: "SkyBlock",
		subcategory: "Pad Tick Timer"
	})
	padTickTimerEnabled = false;

	@DecimalSliderProperty({
		name: "X",
		category: "SkyBlock",
		subcategory: "Pad Tick Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	padTickTimerX = 0;

	@DecimalSliderProperty({
		name: "Y",
		category: "SkyBlock",
		subcategory: "Pad Tick Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	padTickTimerY = 0;

	@DecimalSliderProperty({
		name: "Scale",
		category: "SkyBlock",
		subcategory: "Pad Tick Timer",
		minF: 0.25,
		maxF: 4,
		decimalPlaces: 1
	})
	padTickTimerScale = 1;

	@SwitchProperty({
		name: "Death Tick Timer",
		description: "Times death ticks (based on server ticks)\nUsage: /sa deathtick",
		category: "SkyBlock",
		subcategory: "Death Tick Timer"
	})
	deathTickTimerEnabled = false;

	@DecimalSliderProperty({
		name: "X",
		category: "SkyBlock",
		subcategory: "Death Tick Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	deathTickTimerX = 0;

	@DecimalSliderProperty({
		name: "Y",
		category: "SkyBlock",
		subcategory: "Death Tick Timer",
		minF: 0,
		maxF: 1,
		decimalPlaces: 2
	})
	deathTickTimerY = 0;

	@DecimalSliderProperty({
		name: "Scale",
		category: "SkyBlock",
		subcategory: "Death Tick Timer",
		minF: 0.25,
		maxF: 4,
		decimalPlaces: 1
	})
	deathTickTimerScale = 1;

	@SwitchProperty({
		name: "Leap Helper",
		category: "SkyBlock",
		subcategory: "Leap Helper"
	})
	leapHelperEnabled = false;

	@SelectorProperty({
		name: "Sorting",
		category: "SkyBlock",
		subcategory: "Leap Helper",
		options: ["Name", "Class", "Name+Class", "Custom"]
	})
	leapHelperSorting = 2;

	@SwitchProperty({
		name: "Keyboard",
		description: "Leap with number keys",
		category: "SkyBlock",
		subcategory: "Leap Helper"
	})
	leapHelperKeyboard = true;

	@DecimalSliderProperty({
		name: "Scale",
		category: "SkyBlock",
		subcategory: "Leap Helper",
		minF: 0.25,
		maxF: 4,
		decimalPlaces: 1
	})
	leapHelperScale = 1;

	@ColorProperty({
		name: "Background Color",
		category: "SkyBlock",
		subcategory: "Leap Helper"
	})
	leapHelperBackgroundColor = new Color(Renderer.color(0, 0, 0, 127), true);

	@TextProperty({
		name: "Player 1",
		category: "SkyBlock",
		subcategory: "Leap Helper"
	})
	leapHelperPlayer1 = "";

	@TextProperty({
		name: "Player 2",
		category: "SkyBlock",
		subcategory: "Leap Helper"
	})
	leapHelperPlayer2 = "";

	@TextProperty({
		name: "Player 3",
		category: "SkyBlock",
		subcategory: "Leap Helper"
	})
	leapHelperPlayer3 = "";

	@TextProperty({
		name: "Player 4",
		category: "SkyBlock",
		subcategory: "Leap Helper"
	})
	leapHelperPlayer4 = "";

	@SwitchProperty({
		name: "Positional Messages",
		description: "Send a message to your party when you are in a specific location",
		category: "SkyBlock",
		subcategory: "Positional Messages"
	})
	positionalMessagesEnabled = false;

	@SwitchProperty({
		name: "Right Click Animation",
		description: "Swings your hand when you right click with an item with a right click ability",
		category: "SkyBlock",
		subcategory: "Right Click Animation"
	})
	rightClickAnimationEnabled = false;

	@SwitchProperty({
		name: "Blood Helper",
		description: "WIP, does not work",
		category: "SkyBlock",
		subcategory: "Blood Helper"
	})
	bloodHelperEnabled = false;

	@SwitchProperty({
		name: "Wardrobe Helper",
		description: "Navigate wardrobe GUI with your keyboard",
		category: "SkyBlock",
		subcategory: "Wardrobe Helper"
	})
	wardrobeHelperEnabled = false;

	@SwitchProperty({
		name: "Item Highlight",
		description: "Highlights items in Dungeons",
		category: "SkyBlock",
		subcategory: "Item Highlight"
	})
	itemHighlightEnabled = false;

	@SwitchProperty({
		name: "Prevent Item Rendering",
		description: "Prevents the actual items from rendering",
		category: "SkyBlock",
		subcategory: "Item Highlight"
	})
	itemHighlightPreventRendering = true;

	@ColorProperty({
		name: "Color 1",
		description: "Color to be shown when the item will be picked up",
		category: "SkyBlock",
		subcategory: "Item Highlight"
	})
	itemHighlightColor1 = new Color(Renderer.color(0, 255, 0, 255), true);

	@ColorProperty({
		name: "Color 2",
		description: "Color to be shown when the item will be picked up after pickup cooldown",
		category: "SkyBlock",
		subcategory: "Item Highlight"
	})
	itemHighlightColor2 = new Color(Renderer.color(255, 255, 0, 255), true);

	@ColorProperty({
		name: "Color 3",
		description: "Color to be shown when the item will not be picked up",
		category: "SkyBlock",
		subcategory: "Item Highlight"
	})
	itemHighlightColor3 = new Color(Renderer.color(255, 0, 0, 255), true);

	@SwitchProperty({
		name: "Show Terminal Clicks",
		description: "Highlights clicked Terminals",
		category: "SkyBlock",
		subcategory: "Show Terminal Clicks"
	})
	showTerminalClicksEnabled = false;

	@SwitchProperty({
		name: "Toggle",
		description: "Enables Termial Features\nMay not be compatible with other mods",
		category: "Terminals"
	})
	terminalsEnabled = false;

	@DecimalSliderProperty({
		name: "Scale",
		description: "Scale custom terminal GUI",
		category: "Terminals",
		minF: 0.25,
		maxF: 4,
		decimalPlaces: 1
	})
	terminalsScale = 1;

	@SwitchProperty({
		name: "High Ping Mode",
		description: "Enables features recommended for high ping users\nNot recommended for low ping users",
		category: "Terminals"
	})
	terminalsHighPingMode = false;

	@NumberProperty({
		name: "Timeout",
		description: "Timeout to resync Terminals",
		category: "Terminals",
		min: 0,
		max: 2147483647,
		increment: 100
	})
	terminalsTimeout = 500;

	@NumberProperty({
		name: "First Click Protection",
		description: "Delay after opening a Terminal to reject clicks",
		category: "Terminals",
		min: 0,
		max: 2147483647,
		increment: 50
	})
	terminalsFirstClick = 0;

	@ColorProperty({
		name: "Color",
		description: "Color used for most terminals",
		category: "Terminals",
	})
	terminalsColor = new Color(Renderer.color(0, 255, 0, 255), true);

	@ColorProperty({
		name: "Background Color",
		category: "Terminals",
	})
	terminalsBackgroundColor = new Color(Renderer.color(0, 0, 0, 127), true);

	@TextProperty({
		name: "X Offset",
		category: "Terminals"
	})
	terminalsOffsetX = "0";

	@TextProperty({
		name: "Y Offset",
		category: "Terminals"
	})
	terminalsOffsetY = "0";

	@SwitchProperty({
		name: "Toggle",
		category: "Terminals",
		subcategory: "Numbers Terminal"
	})
	terminalsNumbersEnabled = true;

	@SwitchProperty({
		name: "Show Numbers",
		category: "Terminals",
		subcategory: "Numbers Terminal"
	})
	terminalsNumbersShowNumbers = true;

	@ColorProperty({
		name: "Color 1",
		category: "Terminals",
		subcategory: "Numbers Terminal"
	})
	terminalsNumbersColor1 = new Color(Renderer.color(0, 255, 0, 255), true);

	@ColorProperty({
		name: "Color 2",
		category: "Terminals",
		subcategory: "Numbers Terminal"
	})
	terminalsNumbersColor2 = new Color(Renderer.color(0, 255, 0, 155), true);

	@ColorProperty({
		name: "Color 3",
		category: "Terminals",
		subcategory: "Numbers Terminal"
	})
	terminalsNumbersColor3 = new Color(Renderer.color(0, 255, 0, 55), true);

	@SwitchProperty({
		name: "Toggle",
		category: "Terminals",
		subcategory: "Colors Terminal"
	})
	terminalsColorsEnabled = true;

	@SwitchProperty({
		name: "Toggle",
		category: "Terminals",
		subcategory: "Starts With Terminal"
	})
	terminalsStartswithEnabled = true;

	@SwitchProperty({
		name: "Toggle",
		category: "Terminals",
		subcategory: "Rubix Terminal"
	})
	terminalsRubixEnabled = true;

	@ColorProperty({
		name: "Left Color",
		category: "Terminals",
		subcategory: "Rubix Terminal"
	})
	terminalsRubixColorLeft = new Color(Renderer.color(0, 255, 0, 255), true);

	@ColorProperty({
		name: "Right Color",
		category: "Terminals",
		subcategory: "Rubix Terminal"
	})
	terminalsRubixColorRight = new Color(Renderer.color(255, 0, 0, 255), true);

	@SwitchProperty({
		name: "Toggle",
		category: "Terminals",
		subcategory: "Red Green Terminal"
	})
	terminalsRedgreenEnabled = true;

	@SwitchProperty({
		name: "Toggle",
		category: "Terminals",
		subcategory: "Melody Terminal"
	})
	terminalsMelodyEnabled = true;

	@ColorProperty({
		name: "Slot Color",
		category: "Terminals",
		subcategory: "Melody Terminal"
	})
	terminalsMelodyColorSlot = new Color(Renderer.color(0, 255, 0, 255), true);

	@ColorProperty({
		name: "Correct Button Color",
		category: "Terminals",
		subcategory: "Melody Terminal"
	})
	terminalsMelodyColorButtonCorrect = new Color(Renderer.color(0, 255, 0, 255), true);

	@ColorProperty({
		name: "Incorrect Button Color",
		category: "Terminals",
		subcategory: "Melody Terminal"
	})
	terminalsMelodyColorButtonIncorrect = new Color(Renderer.color(255, 0, 0, 255), true);

	@ColorProperty({
		name: "Column Color",
		category: "Terminals",
		subcategory: "Melody Terminal"
	})
	terminalsMelodyColorColumn = new Color(Renderer.color(255, 0, 255, 127), true);

	@SwitchProperty({
		name: "Toggle",
		description: "Toggle party commands",
		category: "Party Commands"
	})
	partyCommandsEnabled = false;

	@TextProperty({
		name: "Prefix",
		description: "Change party commands prefix\nUse commas without spaces to specify multiple prefixes",
		category: "Party Commands",
		placeholder: "Enter a prefix"
	})
	partyCommandsPrefix = "`";

	@TextProperty({
		name: "Blacklist",
		description: "/sa pc",
		category: "Party Commands"
	})
	partyCommandsBlacklist = "";

	@TextProperty({
		name: "Whitelist",
		description: "/sa pc",
		category: "Party Commands"
	})
	partyCommandsWhitelist = "";

	@SwitchProperty({
		name: "help",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandHelpEnabled = true;

	@SwitchProperty({
		name: "calc",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandCalcEnabled = true;

	@SwitchProperty({
		name: "ping",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandPingEnabled = true;

	@SwitchProperty({
		name: "tps",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandTpsEnabled = true;

	@SwitchProperty({
		name: "fps",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandFpsEnabled = true;

	@SwitchProperty({
		name: "transfer",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandTransferEnabled = true;

	@SwitchProperty({
		name: "kick",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandKickEnabled = true;

	@SwitchProperty({
		name: "promote",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandPromoteEnabled = true;

	@SwitchProperty({
		name: "demote",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandDemoteEnabled = true;

	@SwitchProperty({
		name: "allinvite",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandAllinviteEnabled = true;

	@SwitchProperty({
		name: "warp",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandWarpEnabled = true;

	@SwitchProperty({
		name: "f0-7",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandF0Enabled = true;

	@SwitchProperty({
		name: "m1-7",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandM0Enabled = true;

	@SwitchProperty({
		name: "cat",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandCatEnabled = true;

	@SwitchProperty({
		name: "fox",
		category: "Party Commands",
		subcategory: "Commands"
	})
	partyCommandsCommandFoxEnabled = true;

	constructor() {
		this.initialize(this);
	}
}

export default new Settings();
