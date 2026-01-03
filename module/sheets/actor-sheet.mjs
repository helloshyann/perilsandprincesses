import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class PerilsAndPrincessesActorSheet extends ActorSheet {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["perilsandprincesses", "sheet", "actor"],
			width: 700,
			height: 805,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "features",
				},
			],
		});
	}

	/** @override */
	get template() {
		return `systems/perilsandprincesses/templates/actor/actor-${this.actor.type}-sheet.hbs`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData() {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = super.getData();

		// Use a safe clone of the actor data for further operations.
		const actorData = this.document.toObject(false);

		// Add the actor's data to context.data for easier access, as well as flags.
		context.system = actorData.system;
		context.flags = actorData.flags;

		// Adding a pointer to CONFIG.PERILSANDPRINCESSES
		context.config = CONFIG.PERILSANDPRINCESSES;

		// Prepare character data and items.
		if (actorData.type == "character") {
			this._prepareItems(context);
			this._prepareCharacterData(context);

			context.giftOptions = {
				nothing: "No Gift Selected",
				wildheart: "Wild Heart",
				enchantvoice: "Enchanting Voice",
				spriteag: "Spritely Agility",
				elementcon: "Elemental Connection",
				kitchmag: "Kitchen Magic",
				healtouch: "Healing Touch",
				powfriend: "Powerful Friendship",
				sageint: "Sage Intellect",
				bogwis: "Bog Wisdom",
			};

			context.giftChoice = actorData.system.giftChoice.value;
			console.log("Gift Options:", context.giftOptions);
			console.log("Selected Gift:", context.giftChoice);

			context.giftData = {
				bogwis: {
					title: "Bog Wisdom",
					description:
						"Your Godmother has imbued you with the spirit of the world's sodden wetlands; a perturbing exterior of filth and muck conceals a teeming ecosystem of life. The flora and fauna of these swampy worlds offer a bounty to those wise in the ways of their use.",
					talents: ["Herbalism", "Foraging", "Medicine"],
					innate: [
						{
							name: "Hex",
							text: "The swamp brings misfortune to those who mean it harm. You can spend a Heart Die to manipulate NPCs’ SAVEs. Roll the Heart Die and add it to the NPC’s SAVE, potentially turning their success into a failure. While fighting, this counts as a Reaction.",
						},
						{
							name: "Preservation",
							text: "Things in your possession cannot decay or spoil, and remain perfectly preserved unless you choose otherwise.",
						},
					],
					special: [
						{
							level: 1,
							name: "Poppet",
							text: "Focus on a creature Nearby and break a doll made of sticks and twine. Choose to grant your friends [DICE] extra Armor against that creature’s attacks or reduce that creature’s Armor by [DICE]. Lasts for [SUM] Rounds.",
						},
						{
							level: 2,
							name: "Unsettling Presence",
							text: "Those who don’t understand you find your visage frightening, especially when you take on the dark and terrifying aspect of the bog hag. [SUM] targets Nearby must SAVE or flee from you for [DICE] minutes, or until they are harmed.",
						},
						{
							level: 3,
							name: "Swamp-Dweller’s Touch",
							text: "At your touch, transform other creatures into humble, swampy forms—and vice versa! Unwilling targets must SAVE or be transformed into a frog, toad, newt, bug, or other boggy creature for [SUM] hours. If the target is already such a creature, you transform it into a larger, intelligent humanoid version that may speak to or even follow you for the duration. If the target was cursed to have its form, this ability breaks the curse.",
						},
						{
							level: 4,
							name: "Witch’s Hut",
							text: "Call out a secret incantation to summon a magical hut for 8 hours. The hut’s magic grows depending on how many Gift Dice you spend: <ul><li>1 GD: The hut is intelligent, safe and secure, barring intruders from entry.</li><li>2 GD: As above, but bigger on the inside, rooms stocked with food and useful tools for the situation.</li><li>3 GD: As above, but with legs, allowing it to travel up to 48 miles whilst carrying up to 10 passengers.</li><li>4 GD: As above, and you can use your Action to pilot it in combat. The hut has [SUM] HP, 2 Armor, does d12 damage with its legs, and uses your Virtues, but attacks hit it automatically.</li></ul>",
						},
					],
					mishaps: [
						"Filthy: Spattered with muck, soiling you completely.",
						"Accursed: Volatile magic lashes back; take d4 damage.",
						"Cleaned Out: GD only return on 1–2 until you take a mud bath.",
						"Sodden: Become Weary until you dry out.",
						"Misunderstood: People avoid you until you perform an act of kindness.",
						"Haggard: Permanent aspect of the bog hag (slimy skin, croaking voice).",
					],
				},
				wildheart: {
					title: "Wild Heart",
					description:
						"You have a wild heart. Because of your animalistic nature, you can call upon woodland creatures and summon them to your aid. Sometimes you wonder if, deep down, you're more animal than human.",
					talents: ["Hunting", "Fishing", "Wayfinding"],
					innate: [
						{
							name: "Whisperer",
							text: "You can speak with animals and intuit their feelings.",
						},
						{
							name: "Natural Climber",
							text: "You have advantage on any Virtue tests involving climbing or tricky terrain.",
						},
					],
					special: [
						{
							level: 1,
							name: "Give a Little Whistle",
							text: "You can summon friendly local animals to your aid by whistling a distinct tune. [SUM] small animals (squirrels, rats, frogs) or [DICE] large beasts (deer, mountain lions, alligators) will help you with a single task to the best of their ability. The specific type of animal that shows up depends on your location and surroundings.",
						},
						{
							level: 2,
							name: "Roar",
							text: "You let out a bestial roar. [SUM] creatures that can hear you SAVE or become terrified for [DICE] rounds.",
						},
						{
							level: 3,
							name: "Sniff",
							text: "You can smell even the faintest trace of scents Nearby. If it's a familiar scent you recognize the specific individual and how long ago they were present, up to [SUM] hours ago. If it's a new smell, you know broadly what kind of smell it is—even if it's a ghost or a fairy or something supernatural. Spending two GD increases the range to a Stone's Throw. Spending three lets you smell Over Yonder.",
						},
						{
							level: 4,
							name: "Wild Form",
							text: "You transform into the form of an animal you've seen before for up to [DICE]x10 minutes. You have [SUM] HP while in this form. If you fall to 0 HP or below, you revert back to normal and are Wounded. Being an animal will usually give you a specific advantage. Big animals could be terrifying, predators could have an extra attack and tiny animals can hide easily. Turtles have shells, snakes are poisonous, beavers can gnaw wood, skunks can spray musk. Be creative, work with the GM and use common sense.",
						},
					],
					mishaps: [
						"Pox: You've contracted some kind of animal disease. You're covered in visible itchy pockmarks until you find treatment.",
						"Fleabitten: Take d4 damage.",
						"Lost Your Animal Edge: Gift Dice only return on a 1–2 until you Spend Time playing with and petting an animal. This includes the dice you just rolled.",
						"Animal Appetite: You become Weary until you eat three meals' worth of food.",
						"Animal Odor: You have disadvantage in social situations and automatically fail attempts at stealth until you take a bath with soap.",
						"Animal Appearance: You take on some kind of permanent mutation that makes you look like an animal. Furry ears, cat eyes, a tail, etc.",
					],
				},
				enchantvoice: {
					title: "Enchanting Voice",
					description:
						"You have an enchanting voice. You enrapture those who can hear you, beckoning them closer in awe, lulling them into a peaceful state, or inspiring them to join in. When you really unleash your voice, you feel like it echoes beyond the earthly realm.",
					talents: ["Music", "Acting", "Poetry"],
					innate: [
						{
							name: "Mimic",
							text: "You can mimic voices and sounds with uncanny accuracy.",
						},
						{
							name: "Alluring",
							text: "You gain advantage on Virtue tests to calm, de-escalate, soothe or delight a person or creature through song of verse. When you perform, strangers who overhear you have a tendency to approach after becoming captivated by your voice.",
						},
					],
					special: [
						{
							level: 1,
							name: "Simple Songs",
							text: "You sing a Happy Working Song, and anyone who hears it can modify a Virtue test roll up to [SUM]; or sing a Lullaby and Nearby creatures with HP less than or equal to [SUM] fall asleep. Doesn't affect creatures that can't hear you.",
						},
						{
							level: 2,
							name: "Shatter",
							text: "You hit the perfect resonating high note. All creatures within a Stone's Throw (not you, but your friends if they aren't prepared) take [SUM] damage or half on a successful SAVE. Any glass, crystal or other brittle objects within this area crack and shatter. Doesn't affect creatures that can't hear you or objects that are covered with thick fabric or another dampening material.",
						},
						{
							level: 3,
							name: "Charming Songs",
							text: "You sing a beautiful Ballad dedicated to a single creature; they regard you as a friend for [DICE] hours; or sing a huge Showstopper and [SUM] creatures SAVE or join in singing, dancing, playing instruments or otherwise frolicking for [SUM] rounds. If you or your friends harm or do something mean to an affected creature, the effect ends. Doesn't affect creatures that can't hear you.",
						},
						{
							level: 4,
							name: "I Want Song",
							text: "Once in your life you can roll 4 Gift Dice to compose a deeply heartfelt song where you sing out your deepest desire. Your Fairy Godmother grants this wish for you. This could be something intangible, like the resolution to a conflict, removal of a Curse or Trauma, a special skill or magic ability or something else, with the GM's approval. If you want to use this ability an additional time, your Fairy Godmother may ask for you to earn it through a quest, favor, or some other proof of your worthiness.",
						},
					],
					mishaps: [
						"Birdsong: A swarm of birds, frogs or other nearby animals is attracted to your song and follows you around until you can convince them otherwise.",
						"Strained Voice: Take d4 damage.",
						"Uninspired: Gift Dice only return on a 1–2 until you Spend Time observing something beautiful. This includes the dice you just rolled.",
						"Headache: You become Woozy.",
						"Lost Voice: You can't speak or sing until you drink hot tea or honey.",
						"Earworm: Your song gets stuck in everyone’s head. Everyone within earshot is Befuddled until they can clear their heads by shocking their system in some way, e.g. jumping in cold water, eating spicy food or drinking some potent liquor.",
					],
				},
				spriteag: {
					title: "Spritely Agility",
					description:
						"You have spritely agility. You are fleet-footed, naturally acrobatic, and move nimbly and stealthily. You can leap, dance and run like none other. Sometimes when you dance you feel mysterious ancient magic start to flow through you.",
					talents: ["Athletics", "Dancing", "Horseback Riding"],
					innate: [
						{
							name: "Evasive",
							text: "You're skilled at dodging attacks. When unarmored, you treat your Armor value as 1. At level 4, treat your Armor value as 2 as long as you have no armor on.",
						},
						{
							name: "Catlike",
							text: "You have advantage on Virtue tests that involve acrobatics, climbing or stealth. You can leap twice as far as most people.",
						},
					],
					special: [
						{
							level: 1,
							name: "Nimble",
							text: "Modify a Virtue test by [SUM] to escape a restraint or trap OR to attempt combat Antics like shoving, grappling, tripping or acrobatics.",
						},
						{
							level: 2,
							name: "Pirouette",
							text: "On your turn, in addition to your Action, you can attempt an additional attack in the form of a spinning kick or acrobatic maneuver of your invention. Test GRACE to hit. If you do, the attack deals [SUM] damage.",
						},
						{
							level: 3,
							name: "Frolic",
							text: "Subtract up to [SUM] damage from a single source as you swerve, leap, prance or spin out of the way at the last moment.",
						},
						{
							level: 4,
							name: "The Magic Dance",
							text: "Roll 4 Gift Dice. You and your friends Spend Time passionately dancing and feasting under moonlight. Requires a large bonfire, fresh food and tasty drinks. When you next Rest, your Fairy Godmother visits you in a dream and offers you a boon. She won't cause anyone harm, remove Trauma or grant magic powers. She might: <ul><li>Cast a protective or helpful magic spell</li><li>End a Curse or cure an injury</li><li>Deliver a message</li><li>Repair or renew an item</li><li>Leave you the physical gift of a mundane item you really need</li><li>Give you an answer to an important question</li></ul>",
						},
					],
					mishaps: [
						"Dented: The most fragile item in your inventory is badly damaged. An expert might be able to repair it.",
						"Tweaked Your Hamstring: Take d4 damage.",
						"Overworked: Gift Dice only return on a 1–2 until you stop and Spend Time smelling the flowers. This includes the dice you just rolled.",
						"Sore Joints: You become Weary until you Spend Time soaking in warm water.",
						"Dizzy: You're Woozy until you Spend Time regaining composure and you fall prone if you take any hits in combat. Chewing on peppermint cures this effect.",
						"Accident: You fall and hurt yourself. Roll on the Wounded table.",
					],
				},
				elementcon: {
					title: "Elemental Connection",
					description:
						"You have an elemental connection with nature. A particular element is a friend of yours; it will come to your aid and bend to your imagination. This power is strong and deep and sometimes hard to control. Choose an element that you have a deep relationship with. It could be the classical Fire, Earth, Air or Water, or more whimsical like candy, books or flowers.",
					talents: [
						"Alchemy",
						"Astronomy",
						"One talent of your choice that relates to your chosen element (e.g. Sailing for water, Blacksmithing for fire, etc.)",
					],
					innate: [
						{
							name: "Resistance",
							text: "Any damage or malady caused to you by your chosen element is reduced by half. At level 4, you become completely immune to this type of damage.",
						},
						{
							name: "Affinity",
							text: "You can speak to your element. Elements may communicate via pantomime, spelled messages and symbols or feelings and intuition. The larger and older the element, the more information it can convey; An old volcano will have much more to say than a candle flame, the ocean more than a puddle, etc.",
						},
					],
					special: [
						{
							level: 1,
							name: "Shape",
							text: "You can manipulate an amount of your element that fits within [DICE]x5 cubic feet and form it into specific shapes. This element must be within a range of [DICE] and can be moved anywhere within this range, provided it isn't obstructed.",
						},
						{
							level: 2,
							name: "Blast",
							text: "Fire a 5-foot wide elemental blast in a straight line anywhere within a Stone's Throw. Anyone in its path takes [SUM] damage or half on a successful SAVE.",
						},
						{
							level: 3,
							name: "Storm",
							text: "You call a violent elemental barrage to rain down in a location you can see. [SUM] creatures within a Stone's Throw of each other take [SUM] damage or half on a successful SAVE.",
						},
						{
							level: 4,
							name: "Summon",
							text: "You can summon a small elemental being with [SUM] HP. They are friendly to you and follow your directions. They are amorphous, immune to damage from the element they are made of, and all their Virtues are equal to your WITS score. They dissolve after [DICE] hours or if they are reduced to 0 HP. They can attack within a Stone's Throw for d6 damage.",
						},
					],
					mishaps: [
						"Gaffe: Something you've done has accidentally offended your element. The GM will soon introduce an elemental being to confront you and demand some kind of penance.",
						"Backfire: Take d4 damage.",
						"Exhausted: Gift Dice only return on a 1–2 until you Spend Time connecting with your element. This includes the dice you just rolled.",
						"Elemental Mutation: Something about your appearance changes forever as the elements take hold. You might have a constant odor of smoke, or your skin becomes blue like the ocean.",
						"Explosion: You accidentally set off an uncontrolled explosion centered around you. You and everything Nearby must succeed a GRACE test or take [SUM] damage.",
						"Elemental Heart: Your very essence is becoming more elemental than human and the transition is painful. Roll on the Wounded table.",
					],
				},
				kitchmag: {
					title: "Kitchen Magic",
					description:
						"You know kitchen magic from spending your youth foraging and cooking. You have intimate knowledge of magical flora and can make herbal concoctions, not to mention a mean huckleberry pie. The treats you bake have a reputation for being more than what they seem.",
					talents: ["Cooking", "Baking", "Foraging"],
					innate: [
						{
							name: "Forager",
							text: "You can find fresh food in most terrain, and you know how to identify magical plants. Once per day, you can Spend Time scrounging for ingredients to replace a spent Gift Die.",
						},
						{
							name: "Tea",
							text: "You always have the herbs for making tea in a pocket somewhere. This doesn’t take any inventory space. When you Spend Time and brew a cup you can read the leaves to divine the answer to a single yes-or-no question.",
						},
					],
					special: [
						{
							level: 1,
							name: "Goodies",
							text: "You have up to [DICE] goodies tucked away that cast a spell when consumed. The number rolled determines which spell you cast as well as the [SUM] of the given spell. If you roll multiple Gift Dice for a single goodie, you may choose any one of the rolled spells. You may roll for Goodies in advance to determine their effect, but they lose potency after you Rest. <ol><li><i>Glitter Spray</i></li><li><i>Slip & Slide</i></li><li><i>Animate</i></li><li><i>Bubble</i></li><li><i>Magic Dart</i></li><li><i>Restoration</i></li></ol>",
						},
						{
							level: 2,
							name: "Concoctions",
							text: "You know the recipes for three concoctions and you have them on hand just when you need them. These can be ingested or thrown as an Attack.<ul><li><strong>Tonic:</strong> Ends an Ailment or cures an injury. [DICE] uses.</li><li><strong>Vitriol:</strong> Does [SUM] damage when splashed. Then [DICE] damage each round until washed off. Instantly corrodes metal.</li><li><strong>Anodyne:</strong> Creature falls peacefully asleep with no nightmares. [DICE] uses.</li></ul>",
						},
						{
							level: 3,
							name: "Eat Me, Drink Me",
							text: "You learn two more concoctions: a small cake and a sweet liquor. Eating the cake makes you double in height for [SUM] rounds; your max HP and damage double for the duration as well. The liquor makes you shrink to the size of a mouse for [SUM] minutes.",
						},
						{
							level: 4,
							name: "Porridge",
							text: "You devise a signature porridge recipe with a magical effect of your choice. This uses Gift Dice like a concoction. You can choose a spell from the spells page or work with the GM to invent your own effect.",
						},
					],
					mishaps: [
						"Side Effect: Working with potent ingredients has left a visible impact on you. Your hair might fall out, your fingers might become permanently purple or some other result determined by you and the GM.",
						"Explosive Brew: You and anyone Nearby take d4 damage.",
						"Fumes: Herbal fumes get to you. Gift Dice only return on a 1–2 until you Spend Time cooking and eating some fresh food.",
						"Accidental Curse: You suffer a random Curse indefinitely. You can test your RESOLVE each morning to end this effect.",
						"Unstable Concoction: A random spell happens in addition to your intended effect.",
						"Overcooked: A powerful surge of magic overwhelms you. Roll on the Wounded table.",
					],
				},
				healtouch: {
					title: "Healing Touch",
					description:
						"You have a healing touch. You can restore others with your hands, your hair and your tears. You've never been sick and being around you makes others just feel better in a way they can't explain.",
					talents: ["Healing", "Sewing", "Animal Husbandry", "Herbalism"],
					innate: [
						{
							name: "Lifeblood",
							text: "You’re immune to illness, infection, and poison. However, you’re extra tasty to monsters, vampires and anything carnivorous.",
						},
						{
							name: "Big Heart",
							text: "You start with an extra Heart Die. You can also spend your Heart Dice to heal your friends when you stop for a Picnic.",
						},
					],
					special: [
						{
							level: 1,
							name: "Magic Touch",
							text: "Your very touch offers restorative, healing and calming powers. You're able to: <ul><li><strong>Touch: </strong>Make contact with a creature to restore [SUM] HP.</li><li><strong>Smooch: </strong>Tenderly kiss a hostile creature. If they have [SUM] HP or less they are overcome with tenderness and lose their will to fight. This effect ends after [DICE]x10 minutes or if you or your friends harm the smooched creature.</li></ul>",
						},
						{
							level: 2,
							name: "Tears",
							text: "Spend Time empathizing with someone until you cry [DICE] enchanted tears. Each tear can cure an Ailment, injury or poison. Extra tears can be saved in bottles but their effectiveness fades after you Rest.",
						},
						{
							level: 3,
							name: "Lock of Hair",
							text: "You cut a lock of your hair and create a talisman. If a creature is carrying one of these, they gain [SUM] temporary HP added on top of their normal HP. They can only benefit from one of these at a time, and the talisman's power fades after you Rest.",
						},
						{
							level: 4,
							name: "True Love's Kiss",
							text: "You can roll four Gift Dice and bestow someone with true love's kiss. This kiss can remove one Trauma, awaken them from magical slumber, transform them back from being a frog or end another similar deadly Curse, injury or sickness. This ability only works a single time on any individual.",
						},
					],
					mishaps: [
						"Marked: Channeling your healing magic has left a permanent visible mark on you. A streak of hair turns gray, one eye changes color, purple veins appear on your neck or a similar transformation determined by you and the GM.",
						"Gave Too Much: Take d4 damage.",
						"Burned Out: Gift Dice only return on a 1-2 until you Spend Time brushing your hair, bathing in clean water or doing something nice for yourself. This includes the dice you just rolled.",
						"Spent: You become Weary until you eat something sweet and tasty.",
						"Overflowed: Every creature Nearby heals d6 HP. Every plant around you blooms and grows instantly.",
						"Enervated: Sharing your life's essence is starting to take its toll. Roll on the Wounded table.",
					],
				},
				powfriend: {
					title: "Powerful Friendship",
					description:
						"You have a healing touch. You can restore others with your hands, your hair and your tears. You've never been sick and being around you makes others just feel better in a way they can't explain.",
					talents: ["Healing", "Carousing", "Gardening"],
					innate: [
						{
							name: "Fast Friends",
							text: "You’re naturally friendly and likable. You have advantage on any Virtue tests to make friends, negotiate truces, ask for favors or other friendly endeavors.",
						},
						{
							name: "Burden",
							text: "You can Spend Time in conversation with someone to remove a Curse, Trauma, Ailment or injury from them and take it on yourself.",
						},
					],
					special: [
						{
							level: 1,
							name: "Sidekick",
							text: "Your powers of friendship have given you a special bond with a small animal of your choice. They have 1 HP, but are wily and have advantage on GRACE rolls to avoid being hit. Use your Virtues as their stats. Wounded sidekicks automatically mark one point of Trauma. Should you lose them, you can recruit a new sidekick if you find a suitable animal friend. Your sidekick will help you out the best they can in any situation. In addition, they can use your Gift Dice to either: <ul><li><strong>Aid:</strong> Modify you or your friends' Virtue tests up to [SUM]. They have to reasonably be able to help in the situation at hand and decide they are helping before the roll.</li><li><strong>Fight:</strong> They test RESOLVE. If successful, deal [SUM] damage.</li></ul>",
						},
						{
							level: 2,
							name: "Defend",
							text: "You can React in combat at the last second to prevent up to [SUM] damage to a friend Nearby from a physical attack. You must have something in hand to block the attack, or you take the damage instead.",
						},
						{
							level: 3,
							name: "Circle of Protection",
							text: "Draw a circle of up to 20 feet in diameter on the ground with salt, chalk or a similar material. Name a specific person or a category of creatures, for instance, 'Lord Godfrey' or 'the undead.' This person or type of creature cannot pass in or out of the circle for [SUM] hours.",
						},
						{
							level: 4,
							name: "Protective Rage",
							text: "If a friend of yours is in direct danger, you can go into a protective rage for [SUM] rounds. While in this state, you: <ul><li>Have advantage on attacks against the threatening creature</li><li>Have advantage on Virtue tests to directly help the friend in danger<li>Add [DICE] to your Armor value</li><li>Add [DICE] damage to your attacks</li></ul>",
						},
					],
					mishaps: [
						"Insomnia: You're worried about your friends and it's keeping you up at night. You won't be able to gain the benefits of the next night's rest.",
						"Ouch: Take d4 damage.",
						"Lonely: Gift Dice only return on a 1–2 until you make a new friend. This includes the dice you just rolled.",
						"Stressed Out: You become Weary until you Spend Time in calm leisure.",
						"Socially Exhausted: You become Woozy until you Spend Time alone.",
						"Betrayed: You were too trusting in the past, and a frenemy you once knew has taken advantage of you. The GM will introduce this character in the near future to inflict a Curse, Wound or other setback.",
					],
				},
				sageint: {
					title: "Sage Intellect",
					description:
						"You have a sage intellect and are a fountain of historical knowledge, ancient folklore and practical know-how. Your nose has always been buried in a book, because you feel like something special is in store for you if you can keep unlocking life's mysteries.",
					talents: ["Calligraphy", "Linguistics", "History", "Folklore"],
					innate: [
						{
							name: "Astute",
							text: "You have advantage on Virtue tests to appraise and identify unknown objects, quickly parse out information in written or illustrated works, and search for clues. You’re also really good at chess.",
						},
						{
							name: "Advisor",
							text: "You can give sage advice or recount an inspiring quote to one of your friends; in combat, this counts as an Action. The next time they use their Gift Dice, they may spend any of yours as if they were their own. A maximum of four Gift Dice can be rolled at a time for an ability.",
						},
					],
					special: [
						{
							level: 1,
							name: "Bookworm",
							text: "You recall a specific bit of information that you've read about in the past. As long as it's anything you could have plausibly read in a book at some point, the GM should provide you with the information you need and presume this is something you can act on. The depth of information depends on the number of [DICE] you spend:<ol><li>Recall a bit of history, lore or natural fact</li><li>Remember something highly specific to the task at hand</li><li>Perform a task that requires an esoteric skill</li><li>Recite something arcane or powerfully magical</li></ol>",
						},
						{
							level: 2,
							name: "Tactician",
							text: "You spot a momentary weakness in an enemy. Describe how you're going to cleverly exploit it with your attack and modify your attack roll up to [SUM]. If you hit, add [DICE] to your damage. Alternatively, you can React to yell out instructions to a friend, who can modify their attack and damage rolls as above.",
						},
						{
							level: 3,
							name: "Insightful",
							text: "You can quickly glean some hidden information about a person or creature Nearby. While fighting, this counts as a Reaction. The depth of information depends on the number of [DICE] you spend:<ol><li>Their HP, SAVE, Armor and attacks</li><li>Vulnerabilities, resistances, and hidden items on their person</li><li>Spells known, special abilities and Curses</li><li>A personal secret, hidden motive, or plan of action</li></ol>",
						},
						{
							level: 4,
							name: "Invention",
							text: "You can Spend Time and roll 4 Gift Dice to create a wondrous helpful invention. It could be a mechanical tool like a grappling gun, hang glider, complex trap or clockwork automaton. Alternatively, you can make a device that has the same effect as a magic spell. This device uses your GD to operate. You can only create and maintain a single invention at a time. They're finicky, need constant tweaking and only you can use them. If you want to create a new one, you must first disassemble the old one.",
						},
					],
					mishaps: [
						"Absent-Minded: You realize you’ve forgotten something about someone close to you. You fell through on a promise, missed a birthday, or offended them.",
						"Overthought: Take d4 damage.",
						"Brain Drained: GD only return on a 1–2 until you Spend Time reading. This includes the dice you just rolled.",
						"Puzzled: You become Befuddled until you Spend Time doing something silly.",
						"Manic: You just have so many good ideas. You become Woozy until you Spend Time writing them all down in your journal.",
						"Hidden Knowledge: An incantation you read aloud sometime in the past has come to fruition. You suffer a random Curse.",
					],
				},
			};

			// Find the data for the currently selected gift
			context.activeGift = context.giftData[context.giftChoice];
		}

		// Prepare NPC data and items.
		if (actorData.type == "npc") {
			this._prepareItems(context);
		}

		// Enrich biography info for display
		// Enrichment turns text like `[[/r 1d20]]` into buttons
		context.enrichedBiography = await TextEditor.enrichHTML(
			this.actor.system.biography,
			{
				// Whether to show secret blocks in the finished html
				secrets: this.document.isOwner,
				// Necessary in v11, can be removed in v12
				async: true,
				// Data to fill in for inline rolls
				rollData: this.actor.getRollData(),
				// Relative UUID resolution
				relativeTo: this.actor,
			}
		);

		// Prepare active effects
		context.effects = prepareActiveEffectCategories(
			// A generator that returns all effects stored on the actor
			// as well as any items
			this.actor.allApplicableEffects()
		);

		return context;
	}

	/**
	 * Character-specific context modifications
	 *
	 * @param {object} context The context object to mutate
	 */
	_prepareCharacterData(context) {
		// This is where you can enrich character-specific editor fields
		// or setup anything else that's specific to this type
	}

	/**
	 * Organize and classify Items for Actor sheets.
	 *
	 * @param {object} context The context object to mutate
	 */
	_prepareItems(context) {
		// Initialize containers.
		const gear = [];
		const features = [];
		const spells = {
			0: [],
			1: [],
			2: [],
			3: [],
			4: [],
			5: [],
			6: [],
			7: [],
			8: [],
			9: [],
		};

		// Iterate through items, allocating to containers
		for (let i of context.items) {
			i.img = i.img || Item.DEFAULT_ICON;
			// Append to gear.
			if (i.type === "item") {
				gear.push(i);
			}
			// Append to features.
			else if (i.type === "feature") {
				features.push(i);
			}
			// Append to spells.
			else if (i.type === "spell") {
				if (i.system.spellLevel != undefined) {
					spells[i.system.spellLevel].push(i);
				}
			}
		}

		// Assign and return
		context.gear = gear;
		context.features = features;
		context.spells = spells;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Render the item sheet for viewing/editing prior to the editable check.
		html.on("click", ".item-edit", (ev) => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Add Inventory Item
		html.on("click", ".item-create", this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.on("click", ".item-delete", (ev) => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// Active Effect management
		html.on("click", ".effect-control", (ev) => {
			const row = ev.currentTarget.closest("li");
			const document =
				row.dataset.parentId === this.actor.id
					? this.actor
					: this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});

		// Rollable abilities.
		html.on("click", ".rollable", this._onRoll.bind(this));

		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev);
			html.find("li.item").each((i, li) => {
				if (li.classList.contains("inventory-header")) return;
				li.setAttribute("draggable", true);
				li.addEventListener("dragstart", handler, false);
			});
		}

		// Test Dice Rollers
		// Listen for clicks on our custom roll buttons
		html.find(".pp-roll-btn").click((ev) => {
			const type = ev.currentTarget.dataset.roll;

			if (type === "d20") {
				this._onRollD20Dialog();
			} else {
				this._onRollPoolDialog(type);
			}
		});
	}

	/* d20 Dialog */
	async _onRollD20Dialog() {
		new Dialog({
			title: "Virtue Test: d20 Under Roll",
			content: `<p class="pp-text-center">How do you want to roll the d20?</p>`,
			buttons: {
				adv: {
					label: "Advantage",
					callback: () =>
						new Roll("2d20kl").toMessage({
							flavor:
								"<strong>Rolling with Advantage</strong><br>You take the <em>LOWEST</em> number when you roll with Advantage.",
						}),
				},
				norm: {
					label: "Normal Roll",
					callback: () =>
						new Roll("1d20").toMessage({ flavor: "Normal d20 Roll" }),
				},
				dis: {
					label: "Disadvantage",
					callback: () =>
						new Roll("2d20kh").toMessage({
							flavor:
								"<strong>Rolling with Disadvantage</strong><br>You take the <em>HIGHEST</em> number when you roll with Disadvantage.",
						}),
				},
			},
			default: "norm",
		}).render(true);
	}

	/* d4/d6 Dialog */
	async _onRollPoolDialog(die) {
		const dialogContent = `
    <form class="pp-flex-col pp-text-center">
      <div class="form-group">
        <label>Number of ${die} to roll:</label>
        <input type="number" id="dice-count" name="count" value="1" min="1" max="10" />
      </div>
    </form>`;

		new Dialog({
			title: `Roll ${die} Pool`,
			content: dialogContent,
			buttons: {
				roll: {
					icon: '<i class="fas fa-dice"></i>',
					label: "Roll",
					callback: (html) => {
						const count = html.find("#dice-count").val();
						new Roll(`${count}${die}`).toMessage({
							flavor: `Rolling ${count}${die}`,
						});
					},
				},
			},
			default: "roll",
		}).render(true);
	}

	/**
	 * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
	 * @param {Event} event   The originating click event
	 * @private
	 */
	async _onItemCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;
		// Get the type of item to create.
		const type = header.dataset.type;
		// Grab any data associated with this control.
		const data = duplicate(header.dataset);
		// Initialize a default name.
		const name = `New ${type.capitalize()}`;
		// Prepare the item object.
		const itemData = {
			name: name,
			type: type,
			system: data,
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.system["type"];

		// Finally, create the item!
		return await Item.create(itemData, { parent: this.actor });
	}

	/**
	 * Handle clickable rolls.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		// Handle item rolls.
		if (dataset.rollType) {
			if (dataset.rollType == "item") {
				const itemId = element.closest(".item").dataset.itemId;
				const item = this.actor.items.get(itemId);
				if (item) return item.roll();
			}
		}

		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
			let label = dataset.label ? `[ability] ${dataset.label}` : "";
			let roll = new Roll(dataset.roll, this.actor.getRollData());
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get("core", "rollMode"),
			});
			return roll;
		}
	}
}
