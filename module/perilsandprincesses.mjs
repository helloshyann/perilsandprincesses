// Import document classes.
import { PerilsAndPrincessesActor } from "./documents/actor.mjs";
import { PerilsAndPrincessesItem } from "./documents/item.mjs";
// Import sheet classes.
import { PerilsAndPrincessesActorSheet } from "./sheets/actor-sheet.mjs";
import { PerilsAndPrincessesItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { PERILSANDPRINCESSES } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once("init", async function () {
	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	game.perilsandprincesses = {
		PerilsAndPrincessesActor,
		PerilsAndPrincessesItem,
		rollItemMacro,
	};

	// Add custom constants for configuration.
	CONFIG.PERILSANDPRINCESSES = PERILSANDPRINCESSES;

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	// Set an initiative formula for the system
	CONFIG.Combat.initiative = {
		formula: "1d20 + @virtues.wits.value", // Adjust based on your preferred P&P house rule
		decimals: 2,
	};

	// Define custom Document classes
	CONFIG.Actor.documentClass = PerilsAndPrincessesActor;
	CONFIG.Item.documentClass = PerilsAndPrincessesItem;

	// Active Effects are never copied to the Actor,
	// but will still apply to the Actor from within the Item
	// if the transfer property on the Active Effect is true.
	CONFIG.ActiveEffect.legacyTransferral = false;

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("perilsandprincesses", PerilsAndPrincessesActorSheet, {
		makeDefault: true,
		label: "PERILSANDPRINCESSES.SheetLabels.Actor",
	});
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("perilsandprincesses", PerilsAndPrincessesItemSheet, {
		makeDefault: true,
		label: "PERILSANDPRINCESSES.SheetLabels.Item",
	});

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});

// New HTML-specific hook
// Hooks.on("renderChatMessageHTML", (message, html, data) => {
// 	const jhtml = $(html);

// 	jhtml.find(".pp-roll-btn").click(async (ev) => {
// 		console.log("Button Clicked!");
// 		ev.preventDefault();

// 		// Find the actor associated with the message
// 		const actor = game.actors.get(message.speaker.actor);
// 		if (!actor) return;

// 		// Trigger the function you just moved to actor.mjs
// 		await actor._onRollD20Dialog();
// 	});
// });

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper("toLowerCase", function (str) {
	return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", function () {
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
	// First, determine if this is a valid owned item.
	if (data.type !== "Item") return;
	if (!data.uuid.includes("Actor.") && !data.uuid.includes("Token.")) {
		return ui.notifications.warn(
			"You can only create macro buttons for owned Items"
		);
	}
	// If it is, retrieve it based on the uuid.
	const item = await Item.fromDropData(data);

	// Create the macro command using the uuid.
	const command = `game.perilsandprincesses.rollItemMacro("${data.uuid}");`;
	let macro = game.macros.find(
		(m) => m.name === item.name && m.command === command
	);
	if (!macro) {
		macro = await Macro.create({
			name: item.name,
			type: "script",
			img: item.img,
			command: command,
			flags: { "perilsandprincesses.itemMacro": true },
		});
	}
	game.user.assignHotbarMacro(macro, slot);
	return false;
}

/* Use renderChatMessageHTML for V13+ compatibility. 
  Note: 'html' here is a native HTMLElement, not a jQuery object.
*/
Hooks.on("renderChatMessageHTML", (message, html, data) => {
	// html is now a native HTMLElement in v13, not jQuery
	const rollBtn = html.querySelector(".pp-chat-roll-btn");
	if (!rollBtn) return;

	rollBtn.addEventListener("click", async (ev) => {
		ev.preventDefault();

		const card = ev.currentTarget.closest(".pp-chat-card");
		const itemUuid = card.dataset.itemUuid;

		// Fetch the item via UUID
		const item = await fromUuid(itemUuid);
		if (!item) return ui.notifications.error("Item not found!");

		// Use the system data safely
		const rollSystem = item.system.roll;

		// Fix: Ensure we have a valid dice size (e.g., "d6" vs just "6")
		let dSize = rollSystem.diceSize || "d6";
		if (!dSize.startsWith("d")) dSize = `d${dSize}`;

		const formula = `${rollSystem.diceNum || 1}${dSize}${
			rollSystem.diceBonus ? " + " + rollSystem.diceBonus : ""
		}`;

		// Create and execute the roll
		const roll = await new Roll(formula, item.getRollData()).roll();

		return roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: item.actor }),
			flavor: `<span class="pp-font-display">Rolling ${item.name}</span>`,
		});
	});
});

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
	// Reconstruct the drop data so that we can load the item.
	const dropData = {
		type: "Item",
		uuid: itemUuid,
	};
	// Load the item from the uuid.
	Item.fromDropData(dropData).then((item) => {
		// Determine if the item loaded and if it's an owned item.
		if (!item || !item.parent) {
			const itemName = item?.name ?? itemUuid;
			return ui.notifications.warn(
				`Could not find item ${itemName}. You may need to delete and recreate this macro.`
			);
		}

		// Trigger the item roll
		item.roll();
	});
}
