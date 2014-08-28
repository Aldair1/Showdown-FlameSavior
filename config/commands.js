/**
 * Commands
 * Pokemon Showdown - https://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois
 *
 * But to actually define a command, it's a function:
 *
 *   allowchallenges: function (target, room, user) {
 *     user.blockChallenges = false;
 *     this.sendReply("You are available for challenges from now on.");
 *   }
 *
 * Commands are actually passed five parameters:
 *   function (target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will add the message to
 *   the room, and turn on the flag this.broadcasting, so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canBroadcast(suppressMessage)
 *   Functionally the same as this.canBroadcast(). However, it
 *   will look as if the user had written the text suppressMessage.
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message, room)
 *   Checks to see if the user can say the message in the room.
 *   If a room is not specified, it will default to the current one.
 *   If it has a falsy value, the check won't be attached to any room.
 *   In addition to running the checks from this.canTalk(), it also
 *   checks to see if the message has any banned words, is too long,
 *   or was just sent by the user. Returns the filtered message, or a
 *   falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target, exactName)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 * this.getLastIdOf(user)
 *   Returns the last userid of an specified user.
 *
 * this.splitTarget(target, exactName)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var tierspoll = 'randombattle, randommono, cc1v1, 1v1, gen51v1, uu, gen5uu, nu, ru, lc, gen5lc, cap, ou, gen5ou, ou monotype, gen5mono, balanced hackmons, hackmons, ubers, doubles, gen5doubles, triples, challenge cup, perseverance, seasonal, inverse, alphabet cup, ou theorymon, sky battles, stabmons, pu, middle cup';

var commands = exports.commands = {

	ip: 'whois',
	rooms: 'whois',
	alt: 'whois',
	alts: 'whois',
	whois: function (target, room, user) {
		var targetUser = this.targetUserOrSelf(target, user.group === ' ');
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}

		this.sendReply("User: " + targetUser.name);
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts(true);
			var output = Object.keys(targetUser.prevNames).join(", ");
			if (output) this.sendReply("Previous names: " + output);

			for (var j = 0; j < alts.length; ++j) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				this.sendReply("Alt: " + targetAlt.name);
				output = Object.keys(targetAlt.prevNames).join(", ");
				if (output) this.sendReply("Previous names: " + output);
			}
			if (targetUser.locked) {
				this.sendReply("Locked under the username: "+targetUser.locked);
			}
		}
		if (Config.groups[targetUser.group] && Config.groups[targetUser.group].name) {
			this.sendReply("Group: " + Config.groups[targetUser.group].name + " (" + targetUser.group + ")");
		}
		if (targetUser.isSysop) {
			this.sendReply("(Pok\xE9mon Showdown System Operator)");
		}
		if (targetUser.frostDev) {
			this.sendReply('(Frost Development Staff)');
		}
		if (targetUser.vip) {
			this.sendReply('|raw|(<font color="#6390F0"><b>VIP</font> User</b>)');
		}
		if (targetUser.monoType != '') {
			var type = targetUser.monoType.toLowerCase();
			var hex = '';
			switch (type) {
				case 'normal':
				hex = 'A8A77A';
				break;
				case 'fire':
				hex = 'FF0000';
				break;
				case 'water':
				hex = '6390F0';
				break;
				case 'electric':
				hex = 'F7D02C';
				break;
				case 'grass':
				hex = '7AC74C';
				break;
				case 'ice':
				hex = '96D9D6';
				break;
				case 'fighting':
				hex = 'C22E28';
				break;
				case 'poison':
				hex = 'A33EA1';
				break;
				case 'ground':
				hex = 'E2BF65';
				break;
				case 'flying':
				hex = 'A98FF3';
				break;
				case 'psychic':
				hex = 'F95587';
				break;
				case 'bug':
				hex = 'A6B91A';
				break;
				case 'rock':
				hex = 'B6A136';
				break;
				case 'ghost':
				hex = '735797';
				break;
				case 'dragon':
				hex = '6F35FC';
				break;
				case 'dark':
				hex = '705746';
				break;
				case 'steel':
				hex = 'B7B7CE';
				break;
				case 'fairy':
				hex = 'EE99AC';
				break;
				default:
				hex = '000000';
				break;
			}
			this.sendReply('|raw|<b><font color="#'+hex+'">'+targetUser.monoType+'</font></b> type');
		}
		if (targetUser.customClient) {
			this.sendReply('|raw|' + targetUser.name + ' is using the <a href="http://frost-server.no-ip.org"><i>custom client!</i></a>');
		}
		if (!targetUser.authenticated) {
			this.sendReply("(Unregistered)");
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply("IP" + ((ips.length > 1) ? "s" : "") + ": " + ips.join(", ") +
					(user.group !== ' ' && targetUser.latestHost ? "\nHost: " + targetUser.latestHost : ""));
		}
		var output = "In rooms: ";
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += " | ";
			first = false;

			output += '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
		}
		this.sendReply('|raw|'+output);
		if (!targetUser.connected || targetUser.isAway) {
			this.sendReply('|raw|This user is ' + ((!targetUser.connected) ? '<font color = "red">offline</font>.' : '<font color = "orange">away</font>.'));
		}
		if (targetUser.canCustomSymbol || targetUser.canCustomAvatar || targetUser.canAnimatedAvatar || targetUser.canChatRoom || targetUser.canTrainerCard || targetUser.canFixItem || targetUser.canDecAdvertise) {
			var i = '';
			if (targetUser.canCustomSymbol) i += ' Custom Symbol';
			if (targetUser.canCustomAvatar) i += ' Custom Avatar';
			if (targetUser.canAnimatedAvatar) i += ' Animated Avatar';
			if (targetUser.canChatRoom) i += ' Chat Room';
			if (targetUser.canTrainerCard) i += ' Trainer Card';
			if (targetUser.canPOTD) i += ' Alter card/avatar';
			if (targetUser.canDecAdvertise) i += ' Declare Advertise.';
			this.sendReply('Eligible for: ' + i);
		}
	},

	ipsearch: function (target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP " + target + ":");
		for (var userid in Users.users) {
			var curUser = Users.users[userid];
			if (curUser.latestIp === target) {
				this.sendReply((curUser.connected ? " + " : "-") + " " + curUser.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},

	/*********************************************************
	 * Additional Commands
	 *********************************************************/

	getrandom: 'pickrandom',
	pickrandom: function (target, room, user) {
		if (!target) return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast()) return;
		var targets;
		if (target.toLowerCase() === 'type') {
			var type = [];
			for (var i in Tools.data.TypeChart) {
				type.push(i);
			}
			var result = Math.floor(Math.random() * type.length);
			return this.sendReplyBox(type[result].trim());
		}
		if (target.indexOf(',') === -1) {
			targets = target.split(' ');
		} else {
			targets = target.split(',');
		};
		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},

	poke: function (target, room, user) {
		if (!target) return this.sendReply('/poke needs a target.');
		return this.parse('/me pokes ' + target + ' on the shoulder with a backrubber.');
	},

	slap: function (target, room, user) {
		if (!target) return this.sendReply('/slap needs a target.');
		return this.parse('/me slaps ' + target + ' in the face with a slipper!');
	},

	s: 'spank',
	spank: function (target, room, user) {
		if (!target) return this.sendReply('/spank needs a target.');
		return this.parse('/me spanks ' + target + '!');
	},

	tierpoll: 'tiervote',
	tiervote: function (target, room, user) {
		return this.parse('/poll Tournament Tier?, ' + tierspoll);
	},

	tierpopt: 'tpo',
	tpoptions: 'tpo',
	tpo: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox('Current options for tier poll are: "' + tierspoll + '".');
	},

	hallowme: function (target, room, user) {
		var halloween = false;
		if (user.hasCustomSymbol) return this.sendReply('You currently have a custom symbol, use /resetsymbol if you would like to use this command again.');
		if (!halloween) return this.sendReply('Its not Halloween anymore!');
		var symbol = '';
		var symbols = ['☢','☠ ','☣'];
		var pick = Math.floor(Math.random()*3);
		symbol = symbols[pick];
		this.sendReply('You have been hallow\'d with a custom symbol!');
		user.getIdentity = function(){
			if (this.muted)	return '!' + this.name;
			if (this.locked) return '‽' + this.name;
			return symbol + this.name;
		};
		user.updateIdentity();
		user.hasCustomSymbol = true;
	},

	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol!');
		user.getIdentity = function() {
			if (this.muted) return '!' + this.name;
			if (this.locked) return '‽' + this.name;
			return this.group + this.name;
		};
		user.hasCustomSymbol = false;
		user.updateIdentity();
		this.sendReply('Your symbol has been reset.');
	},

	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function (target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		var roomid = (target || room.id);
		if (!Rooms.get(roomid)) {
			return this.sendReply("Room " + roomid + " not found.");
		}
		return this.parse('/msg ' + this.targetUsername + ', /invite ' + roomid);
	},


	/*********************************************************
	 * Informational commands
	 *********************************************************/

	pstats: 'data',
	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	details: 'data',
	dt: 'data',
	data: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;

		var buffer = '';
		var targetId = toId(target);
		if (targetId === '' + parseInt(targetId)) {
			for (var p in Tools.data.Pokedex) {
				var pokemon = Tools.getTemplate(p);
				if (pokemon.num == parseInt(target)) {
					target = pokemon.species;
					targetId = pokemon.id;
					break;
				}
			}
		}
		var newTargets = Tools.dataSearch(target);
		var showDetails = (cmd === 'dt' || cmd === 'details');
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; ++i) {
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					buffer = "No Pokemon, item, move, ability or nature named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				if (newTargets[i].searchType === 'nature') {
					buffer += "" + newTargets[i].name + " nature: ";
					if (newTargets[i].plus) {
						var statNames = {'atk': "Attack", 'def': "Defense", 'spa': "Special Attack", 'spd': "Special Defense", 'spe': "Speed"};
						buffer += "+10% " + statNames[newTargets[i].plus] + ", -10% " + statNames[newTargets[i].minus] + ".";
					} else {
						buffer += "No effect.";
					}
					return this.sendReply(buffer);
				} else {
					buffer += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
				}
			}
		} else {
			return this.sendReply("No Pokemon, item, move, ability or nature named '" + target + "' was found. (Check your spelling?)");
		}

		if (showDetails) {
			var details;
			if (newTargets[0].searchType === 'pokemon') {
				var pokemon = Tools.getTemplate(newTargets[0].name);
				var weighthit = 20;
				if (pokemon.weightkg >= 200) {
					weighthit = 120;
				} else if (pokemon.weightkg >= 100) {
					weighthit = 100;
				} else if (pokemon.weightkg >= 50) {
					weighthit = 80;
				} else if (pokemon.weightkg >= 25) {
					weighthit = 60;
				} else if (pokemon.weightkg >= 10) {
					weighthit = 40;
				}
				details = {
					"Dex#": pokemon.num,
					"Height": pokemon.heightm + " m",
					"Weight": pokemon.weightkg + " kg <em>(" + weighthit + " BP)</em>",
					"Dex Colour": pokemon.color,
					"Egg Group(s)": pokemon.eggGroups.join(", ")
				};
				if (!pokemon.evos.length) {
					details["<font color=#585858>Does Not Evolve</font>"] = "";
				} else {
					details["Evolution"] = pokemon.evos.map(function (evo) {
						evo = Tools.getTemplate(evo);
						return evo.name + " (" + evo.evoLevel + ")";
					}).join(", ");
				}

			} else if (newTargets[0].searchType === 'move') {
				var move = Tools.getMove(newTargets[0].name);
				details = {
					"Priority": move.priority,
				};

				if (move.secondary || move.secondaries) details["<font color=black>&#10003; Secondary Effect</font>"] = "";
				if (move.isContact) details["<font color=black>&#10003; Contact</font>"] = "";
				if (move.isSoundBased) details["<font color=black>&#10003; Sound</font>"] = "";
				if (move.isBullet) details["<font color=black>&#10003; Bullet</font>"] = "";
				if (move.isPulseMove) details["<font color=black>&#10003; Pulse</font>"] = "";

				details["Target"] = {
					'normal': "Adjacent Pokemon",
					'self': "Self",
					'adjacentAlly': "Single Ally",
					'allAdjacentFoes': "Adjacent Foes",
					'foeSide': "All Foes",
					'allySide': "All Allies",
					'allAdjacent': "All Adjacent Pokemon",
					'any': "Any Pokemon",
					'all': "All Pokemon"
				}[move.target] || "Unknown";

			} else if (newTargets[0].searchType === 'item') {
				var item = Tools.getItem(newTargets[0].name);
				details = {};
				if (item.fling) {
					details["Fling Base Power"] = item.fling.basePower;
					if (item.fling.status) details["Fling Effect"] = item.fling.status;
					if (item.fling.volatileStatus) details["Fling Effect"] = item.fling.volatileStatus;
					if (item.isBerry) details["Fling Effect"] = "Activates effect of berry on target.";
					if (item.id === 'whiteherb') details["Fling Effect"] = "Removes all negative stat levels on the target.";
					if (item.id === 'mentalherb') details["Fling Effect"] = "Removes the effects of infatuation, Taunt, Encore, Torment, Disable, and Cursed Body on the target.";
				}
				if (!item.fling) details["Fling"] = "This item cannot be used with Fling";
				if (item.naturalGift) {
					details["Natural Gift Type"] = item.naturalGift.type;
					details["Natural Gift BP"] = item.naturalGift.basePower;
				}

			} else {
				details = {};
			}

			buffer += '|raw|<font size="1">' + Object.keys(details).map(function (detail) {
				return '<font color=#585858>' + detail + (details[detail] !== '' ? ':</font> ' + details[detail] : '</font>');
			}).join("&nbsp;|&ThickSpace;") + '</font>';
		}
		this.sendReply(buffer);
	},

	ds: 'dexsearch',
	dsearch: 'dexsearch',
	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var searches = {};
		var allTiers = {'uber':1, 'ou':1, 'uu':1, 'lc':1, 'cap':1, 'bl':1, 'bl2':1, 'ru':1, 'bl3':1, 'nu':1};
		var allColours = {'green':1, 'red':1, 'blue':1, 'white':1, 'brown':1, 'yellow':1, 'purple':1, 'pink':1, 'gray':1, 'black':1};
		var showAll = false;
		var megaSearch = null;
		var feSearch = null; // search for fully evolved pokemon only
		var output = 10;

		for (var i in targets) {
			var isNotSearch = false;
			target = targets[i].trim().toLowerCase();
			if (target.slice(0, 1) === '!') {
				isNotSearch = true;
				target = target.slice(1);
			}

			var targetAbility = Tools.getAbility(targets[i]);
			if (targetAbility.exists) {
				if (!searches['ability']) searches['ability'] = {};
				if (Object.count(searches['ability'], true) === 1 && !isNotSearch) return this.sendReplyBox("Specify only one ability.");
				if ((searches['ability'][targetAbility.name] && isNotSearch) || (searches['ability'][targetAbility.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include an ability.");
				searches['ability'][targetAbility.name] = !isNotSearch;
				continue;
			}

			if (target in allTiers) {
				if (!searches['tier']) searches['tier'] = {};
				if ((searches['tier'][target] && isNotSearch) || (searches['tier'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a tier.');
				searches['tier'][target] = !isNotSearch;
				continue;
			}

			if (target in allColours) {
				if (!searches['color']) searches['color'] = {};
				if ((searches['color'][target] && isNotSearch) || (searches['color'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a color.');
				searches['color'][target] = !isNotSearch;
				continue;
			}

			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 7) {
				if (!searches['gen']) searches['gen'] = {};
				if ((searches['gen'][target] && isNotSearch) || (searches['gen'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a generation.');
				searches['gen'][target] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
				}
				showAll = true;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				if ((megaSearch && isNotSearch) || (megaSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include Mega Evolutions.');
				megaSearch = !isNotSearch;
				continue;
			}

			if (target === 'fe' || target === 'fullyevolved' || target === 'nfe' || target === 'notfullyevolved') {
				if (target === 'nfe' || target === 'notfullyevolved') isNotSearch = !isNotSearch;
				if ((feSearch && isNotSearch) || (feSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include fully evolved Pokémon.');
				feSearch = !isNotSearch;
				continue;
			}

			var targetMove = Tools.getMove(target);
			if (targetMove.exists) {
				if (!searches['moves']) searches['moves'] = {};
				if (Object.count(searches['moves'], true) === 4 && !isNotSearch) return this.sendReplyBox("Specify a maximum of 4 moves.");
				if ((searches['moves'][targetMove.name] && isNotSearch) || (searches['moves'][targetMove.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a move.");
				searches['moves'][targetMove.name] = !isNotSearch;
				continue;
			}

			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!searches['types']) searches['types'] = {};
					if (Object.count(searches['types'], true) === 2 && !isNotSearch) return this.sendReplyBox("Specify a maximum of two types.");
					if ((searches['types'][target] && isNotSearch) || (searches['types'][target] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a type.");
					searches['types'][target] = !isNotSearch;
					continue;
				}
			}
			return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' could not be found in any of the search categories.");
		}

		if (showAll && Object.size(searches) === 0 && megaSearch === null && feSearch === null) return this.sendReplyBox("No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command.");

		var dex = {};
		for (var pokemon in Tools.data.Pokedex) {
			var template = Tools.getTemplate(pokemon);
			var megaSearchResult = (megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega));
			var feSearchResult = (feSearch === null || (feSearch === true && !template.evos.length) || (feSearch === false && template.evos.length));
			if (template.tier !== 'Unreleased' && template.tier !== 'Illegal' && (template.tier !== 'CAP' || (searches['tier'] && searches['tier']['cap'])) &&
				megaSearchResult && feSearchResult) {
				dex[pokemon] = template;
			}
		}

		for (var search in {'moves':1, 'types':1, 'ability':1, 'tier':1, 'gen':1, 'color':1}) {
			if (!searches[search]) continue;
			switch (search) {
				case 'types':
					for (var mon in dex) {
						if (Object.count(searches[search], true) === 2) {
							if (!(searches[search][dex[mon].types[0]]) || !(searches[search][dex[mon].types[1]])) delete dex[mon];
						} else {
							if (searches[search][dex[mon].types[0]] === false || searches[search][dex[mon].types[1]] === false || (Object.count(searches[search], true) > 0 &&
								(!(searches[search][dex[mon].types[0]]) && !(searches[search][dex[mon].types[1]])))) delete dex[mon];
						}
					}
					break;

				case 'tier':
					for (var mon in dex) {
						if ('lc' in searches[search]) {
							// some LC legal Pokemon are stored in other tiers (Ferroseed/Murkrow etc)
							// this checks for LC legality using the going criteria, instead of dex[mon].tier
							var isLC = (dex[mon].evos && dex[mon].evos.length > 0) && !dex[mon].prevo && Tools.data.Formats['lc'].banlist.indexOf(dex[mon].species) === -1;
							if ((searches[search]['lc'] && !isLC) || (!searches[search]['lc'] && isLC)) {
								delete dex[mon];
								continue;
							}
						}
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
					}
					break;

				case 'gen':
				case 'color':
					for (var mon in dex) {
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];					}
					break;

				case 'ability':
					for (var mon in dex) {
						for (var ability in searches[search]) {
							var needsAbility = searches[search][ability];
							var hasAbility = Object.count(dex[mon].abilities, ability) > 0;
							if (hasAbility !== needsAbility) {
								delete dex[mon];
								break;
							}
						}
					}
					break;

				case 'moves':
					for (var mon in dex) {
						var template = Tools.getTemplate(dex[mon].id);
						if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
						if (!template.learnset) continue;
						for (var i in searches[search]) {
							var move = Tools.getMove(i);
							if (!move.exists) return this.sendReplyBox("'" + move + "' is not a known move.");
							var prevoTemp = Tools.getTemplate(template.id);
							while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[move.id])) {
								prevoTemp = Tools.getTemplate(prevoTemp.prevo);
							}
							var canLearn = (prevoTemp.learnset.sketch && !(move.id in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1})) || prevoTemp.learnset[move.id];
							if ((!canLearn && searches[search][i]) || (searches[search][i] === false && canLearn)) delete dex[mon];
						}
					}
					break;

				default:
					return this.sendReplyBox("Something broke! PM TalkTakesTime here or on the Smogon forums with the command you tried.");
			}
		}

		var results = Object.keys(dex).map(function (speciesid) {return dex[speciesid].species;});
		results = results.filter(function (species) {
			var template = Tools.getTemplate(species);
			return !(species !== template.baseSpecies && results.indexOf(template.baseSpecies) > -1);
		});
		var resultsStr = "";
		if (results.length > 0) {
			if (showAll || results.length <= output) {
				results.sort();
				resultsStr = results.join(", ");
			} else {
				results.randomize();
				resultsStr = results.slice(0, 10).join(", ") + ", and " + string(results.length - output) + " more. Redo the search with 'all' as a search parameter to show all results.";
			}
		} else {
			resultsStr = "No Pokémon found.";
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply("Pokemon '" + template.id + "' not found.");
		}

		if (targets.length < 2) {
			return this.sendReply("You must specify at least one move.");
		}

		for (var i = 1, len = targets.length; i < len; ++i) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply("Move '" + move.id + "' not found.");
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = template.name + (problem ? " <span class=\"message-learn-cannotlearn\">can't</span> learn " : " <span class=\"message-learn-canlearn\">can</span> learn ") + (targets.length > 2 ? "these moves" : move.name);
		if (!problem) {
			var sourceNames = {E:"egg", S:"event", D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				var prevSourceCount = 0;
				for (var i = 0, len = sources.length; i < len; ++i) {
					var source = sources[i];
					if (source.substr(0, 2) === prevSourceType) {
						if (prevSourceCount < 0) {
							buffer += ": " + source.substr(2);
						} else if (all || prevSourceCount < 3) {
							buffer += ", " + source.substr(2);
						} else if (prevSourceCount === 3) {
							buffer += ", ...";
						}
						++prevSourceCount;
						continue;
					}
					prevSourceType = source.substr(0, 2);
					prevSourceCount = source.substr(2) ? 0 : -1;
					buffer += "<li>gen " + source.substr(0, 1) + " " + sourceNames[source.substr(1, 1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": " + source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before " + (lsetData.sourcesBefore + 1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	resist: 'weakness',
	weakness: function (target, room, user){
		if (!this.canBroadcast()) return;
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox("" + Tools.escapeHTML(target) + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		var resistances = [];
		var immunities = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				switch (typeMod) {
				case 1:
					weaknesses.push(type);
					break;
				case 2:
					weaknesses.push("<b>" + type + "</b>");
					break;
				case -1:
					resistances.push(type);
					break;
				case -2:
					resistances.push("<b>" + type + "</b>");
					break;
				}
			} else {
				immunities.push(type);
			}
		});

		var buffer = [];
		buffer.push(pokemon.exists ? "" + target + ' (ignoring abilities):' : '' + target + ':');
		buffer.push('<span class=\"message-effect-weak\">Weaknesses</span>: ' + (weaknesses.join(', ') || 'None'));
		buffer.push('<span class=\"message-effect-resist\">Resistances</span>: ' + (resistances.join(', ') || 'None'));
		buffer.push('<span class=\"message-effect-immune\">Immunities</span>: ' + (immunities.join(', ') || 'None'));
		this.sendReplyBox(buffer.join('<br>'));
	},

	eff: 'effectiveness',
	type: 'effectiveness',
	matchup: 'effectiveness',
	effectiveness: function (target, room, user) {
		var targets = target.split(/[,/]/).slice(0, 2);
		if (targets.length !== 2) return this.sendReply("Attacker and defender must be separated with a comma.");

		var searchMethods = {'getType':1, 'getMove':1, 'getTemplate':1};
		var sourceMethods = {'getType':1, 'getMove':1};
		var targetMethods = {'getType':1, 'getTemplate':1};
		var source;
		var defender;
		var foundData;
		var atkName;
		var defName;
		for (var i = 0; i < 2; ++i) {
			var method;
			for (method in searchMethods) {
				foundData = Tools[method](targets[i]);
				if (foundData.exists) break;
			}
			if (!foundData.exists) return this.parse('/help effectiveness');
			if (!source && method in sourceMethods) {
				if (foundData.type) {
					source = foundData;
					atkName = foundData.name;
				} else {
					source = foundData.id;
					atkName = foundData.id;
				}
				searchMethods = targetMethods;
			} else if (!defender && method in targetMethods) {
				if (foundData.types) {
					defender = foundData;
					defName = foundData.species + " (not counting abilities)";
				} else {
					defender = {types: [foundData.id]};
					defName = foundData.id;
				}
				searchMethods = sourceMethods;
			}
		}

		if (!this.canBroadcast()) return;

		var factor = 0;
		if (Tools.getImmunity(source.type || source, defender)) {
			if (source.effectType !== 'Move' || source.basePower || source.basePowerCallback) {
				factor = Math.pow(2, Tools.getEffectiveness(source, defender));
			} else {
				factor = 1;
			}
		}

		this.sendReplyBox("" + atkName + " is " + factor + "x effective against " + defName + ".");
	},

	uptime: (function(){
		function formatUptime(uptime) {
			if (uptime > 24*60*60) {
				var uptimeText = "";
				var uptimeDays = Math.floor(uptime/(24*60*60));
				uptimeText = uptimeDays + " " + (uptimeDays == 1 ? "day" : "days");
				var uptimeHours = Math.floor(uptime/(60*60)) - uptimeDays*24;
				if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours == 1 ? "hour" : "hours");
				return uptimeText;
			} else {
				return uptime.seconds().duration();
			}
		}

		return function(target, room, user) {
			if (!this.canBroadcast()) return;
			var uptime = process.uptime();
			this.sendReplyBox("Uptime: <b>" + formatUptime(uptime) + "</b>" +
				(global.uptimeRecord ? "<br /><font color=\"green\">Record: <b>" + formatUptime(global.uptimeRecord) + "</b></font>" : ""));
		};
	})(),

	groups: function (target, room, user) {
		if (!this.canBroadcast()) return;

		this.sendReplyBox(
			"+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />" +
			"% <b>Driver</b> - The above, and they can mute. Global % can also lock users and check for alts<br />" +
			"@ <b>Moderator</b> - The above, and they can ban users<br />" +
			"&amp; <b>Leader</b> - They can do almost anything, such as create rooms and manage bucks<br />" +
			"# <b>Room Owner</b> - They are leaders of the room and can almost totally control it<br />" +
			"~ <b>Administrator</b> - They can do anything, like change what this message says"
		);
	},

	git: 'opensource',
	opensource: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown is open source:<br />" +
			"- Language: JavaScript (Node.js)<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/commits/master\">What's new?</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown\">Server source code</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown-Client\">Client source code</a>"
		);
	},

	staff: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("<a href=\"https://www.smogon.com/sim/staff_list\">Pokemon Showdown Staff List</a>");
	},

	avatars: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You can <button name="avatars">change your avatar</button> by clicking on it in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right. Custom avatars are only obtainable by staff.');
	},

	showtan: function (target, room, user) {
		if (room.id !== 'showderp') return this.sendReply("The command '/showtan' was unrecognized. To send a message starting with '/showtan', type '//showtan'.");
		if (!this.can('modchat', null, room)) return;
		target = this.splitTarget(target);
		if (!this.targetUser) return this.sendReply('user not found');
		if (!room.users[this.targetUser.userid]) return this.sendReply('not a showderper');
		this.targetUser.avatar = '#showtan';
		room.add(user.name+' applied showtan to affected area of '+this.targetUser.name);
	},

	introduction: 'intro',
	intro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"New to competitive pokemon?<br />" +
			"- <a href=\"https://www.smogon.com/sim/ps_guide\">Beginner's Guide to Pokémon Showdown</a><br />" +
			"- <a href=\"https://www.smogon.com/dp/articles/intro_comp_pokemon\">An introduction to competitive Pokémon</a><br />" +
			"- <a href=\"https://www.smogon.com/bw/articles/bw_tiers\">What do 'OU', 'UU', etc mean?</a><br />" +
			"- <a href=\"https://www.smogon.com/xyhub/tiers\">What are the rules for each format? What is 'Sleep Clause'?</a>"
		);
	},

	mentoring: 'smogintro',
	smogonintro: 'smogintro',
	smogintro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Welcome to Smogon's official simulator! Here are some useful links to <a href=\"https://www.smogon.com/mentorship/\">Smogon\'s Mentorship Program</a> to help you get integrated into the community:<br />" +
			"- <a href=\"https://www.smogon.com/mentorship/primer\">Smogon Primer: A brief introduction to Smogon's subcommunities</a><br />" +
			"- <a href=\"https://www.smogon.com/mentorship/introductions\">Introduce yourself to Smogon!</a><br />" +
			"- <a href=\"https://www.smogon.com/mentorship/profiles\">Profiles of current Smogon Mentors</a><br />" +
			"- <a href=\"http://mibbit.com/#mentor@irc.synirc.net\">#mentor: the Smogon Mentorship IRC channel</a>"
		);
	},

	calculator: 'calc',
	calc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />" +
			"- <a href=\"https://pokemonshowdown.com/damagecalc/\">Damage Calculator</a>"
		);
	},

	cap: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"An introduction to the Create-A-Pokemon project:<br />" +
			"- <a href=\"https://www.smogon.com/cap/\">CAP project website and description</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/showthread.php?t=48782\">What Pokemon have been made?</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/showthread.php?t=3464513\">Talk about the metagame here</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/showthread.php?t=3466826\">Practice BW CAP teams</a>"
		);
	},

	gennext: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md\">README: overview of NEXT</a><br />" +
			"Example replays:<br />" +
			"- <a href=\"https://replay.pokemonshowdown.com/gennextou-120689854\">Zergo vs Mr Weegle Snarf</a><br />" +
			"- <a href=\"https://replay.pokemonshowdown.com/gennextou-130756055\">NickMP vs Khalogie</a>"
		);
	},

	om: 'othermetas',
	othermetas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/forums/206/\">Other Metagames Forum</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3505031/\">Other Metagames Index</a><br />";
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3507466/\">Sample teams for entering Other Metagames</a><br />";
			}
		}
		if (target === 'omofthemonth' || target === 'omotm' || target === 'month') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3481155/\">OM of the Month</a><br />";
		}
		if (target === 'pokemonthrowback' || target === 'throwback') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3510401/\">Pokémon Throwback</a><br />";
		}
		if (target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3499973/\">Balanced Hackmons Mentoring Program</a><br />";
			}
		}
		if (target === '1v1') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496773/\">1v1</a><br />";
		}
		if (target === 'oumonotype' || target === 'monotype') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493087/\">OU Monotype</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3507565/\">OU Monotype Viability Rankings</a><br />";
			}
		}
		if (target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508369/\">Tier Shift</a><br />";
		}
		if (target === 'almostanyability' || target === 'aaa') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3495737/\">Almost Any Ability</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508794/\">Almost Any Ability Viability Rankings</a><br />";
			}
		}
		if (target === 'stabmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493081/\">STABmons</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512215/\">STABmons Viability Rankings</a><br />";
			}
		}
		if (target === 'skybattles' || target === 'skybattle') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493601/\">Sky Battles</a><br />";
		}
		if (target === 'inversebattle' || target === 'inverse') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3492433/\">Inverse Battle</a><br />";
		}
		if (target === 'smogontriples' || target === 'triples') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3511522/\">Smogon Triples</a><br />";
		}
		if (target === 'alphabetcup') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3498167/\">Alphabet Cup</a><br />";
		}
		if (target === 'averagemons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3495527/\">Averagemons</a><br />";
		}
		if (target === 'hackmons' || target === 'purehackmons' || target === 'classichackmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3500418/\">Hackmons</a><br />";
		}
		if (target === 'middlecup' || target === 'mc') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3494887/\">Middle Cup</a><br />";
		}
		if (target === 'glitchmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3467120/\">Glitchmons</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Other Metas entry '" + target + "' was not found. Try /othermetas or /om for general help.");
		}
		if (target === 'all' || target === 'rebalancedmono') {
			matched = true;
			buffer += '- <a href="http://pastebin.com/tqqJT4MG">Rebalanced Monotype</a>';
		}
		this.sendReplyBox(buffer);
	},

	/*formats: 'formathelp',
	formatshelp: 'formathelp',
	formathelp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (this.broadcasting && (room.id === 'lobby' || room.battle)) return this.sendReply("This command is too spammy to broadcast in lobby/battles");
		var buf = [];
		var showAll = (target === 'all');
		for (var id in Tools.data.Formats) {
			var format = Tools.data.Formats[id];
			if (!format) continue;
			if (format.effectType !== 'Format') continue;
			if (!format.challengeShow) continue;
			if (!showAll && !format.searchShow) continue;
			buf.push({
				name: format.name,
				gameType: format.gameType || 'singles',
				mod: format.mod,
				searchShow: format.searchShow,
				desc: format.desc || 'No description.'
			});
		}
		this.sendReplyBox(
			"Available Formats: (<strong>Bold</strong> formats are on ladder.)<br />" +
			buf.map(function (data) {
				var str = "";
				// Bold = Ladderable.
				str += (data.searchShow ? "<strong>" + data.name + "</strong>" : data.name) + ": ";
				str += "(" + (!data.mod || data.mod === 'base' ? "" : data.mod + " ") + data.gameType + " format) ";
				str += data.desc;
				return str;
			}).join("<br />")
		);
	},*/

	roomhelp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.');
		this.sendReplyBox('Room drivers (%) can use:<br />' +
			'- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />' +
			'- /mute OR /m <em>username</em>: 7 minute mute<br />' +
			'- /hourmute OR /hm <em>username</em>: 60 minute mute<br />' +
			'- /unmute <em>username</em>: unmute<br />' +
			'- /announce OR /wall <em>message</em>: make an announcement<br />' +
			'- /modlog <em>username</em>: search the moderator log of the room<br />' +
			'- /modnote <em>message</em>: Adds a moderator note that can be read through modlog<br />' +
			'- /notes [view] OR /notes [add], [message] OR /notes [delete/del], [number]: views/adds/deletes a note<br />' +
			'<br />' +
			'Room moderators (@) can also use:<br />' +
			'- /rkick <em>username</em>: kicks the user from the room<br />' +
			'- /roomban OR /rb <em>username</em>: bans user from the room<br />' +
			'- /roomunban <em>username</em>: unbans user from the room<br />' +
			'- /roomvoice <em>username</em>: appoint a room voice<br />' +
			'- /roomdevoice <em>username</em>: remove a room voice<br />' +
			'- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />' +
			'<br />' +
			'Room owners (#) can also use:<br />' +
			'- /roomdesc <em>description</em>: set the room description on the room join page<br />' +
			'- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />' +
			'- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />' +
			'- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />' +
			'- /declare <em>message</em>: make a declaration in the room<br />' +
			'- /lockroom: locks the room preventing users from joining<br />' +
			'- /unlockroom: unlocks the room allowing users to join<br />' +
			'- /openleague: sets the league as open to challengers<br />' +
			'- /closeleague: sets the league as closed to challengers<br />' +
			'- /setwelcomemessage <em>message</em>: sets the message people will see when they join the room. Can contain html and must be bought from the store first<br />' +
			'- /modchat <em>[%/@/#]</em>: set modchat level<br />' +
			'- /toggleglobaldeclares: disables/enables global declares in your room<br />' +
			'<br />' +
			'The room founder can also use:<br />' +
			'- /roomowner <em>username</em>: appoint a room owner<br />' +
			'- /roomdeowner <em>username</em>: remove a room owner<br />' +
			'</div>');
	},

	restarthelp: function (target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"The server is restarting. Things to know:<br />" +
			"- We wait a few minutes before restarting so people can finish up their battles<br />" +
			"- The restart itself will take around 0.6 seconds<br />" +
			"- Your ladder ranking and teams will not change<br />" +
			"- We are restarting to update Pokémon Showdown to a newer version"
		);
	},

	rule: 'rules',
	rules: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox("Please follow the rules:<br />" +
				(room.rulesLink ? "- <a href=\"" + Tools.escapeHTML(room.rulesLink) + "\">" + Tools.escapeHTML(room.title) + " room rules</a><br />" : "") +
				"- <a href=\"http://frostserver.net/forums/showthread.php?tid=534\">" + (room.rulesLink ? "Global rules" : "Rules") + "</a>");
			return;
		}
		if (!this.can('roommod', null, room)) return;
		if (target.length > 80) {
			return this.sendReply("Error: Room rules link is too long (must be under 80 characters). You can use a URL shortener to shorten the link.");
		}

		room.rulesLink = target.trim();
		this.sendReply("(The room rules link is now: " + target + ")");

		if (room.chatRoomData) {
			room.chatRoomData.rulesLink = room.rulesLink;
			Rooms.global.writeChatRoomData();
		}
	},

	faq: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq\">Frequently Asked Questions</a><br />";
		}
		if (target === 'deviation') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#deviation\">Why did this user gain or lose so many points?</a><br />";
		}
		if (target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#doubles\">Can I play doubles/triples/rotation battles here?</a><br />";
		}
		if (target === 'randomcap') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#randomcap\">What is this fakemon and what is it doing in my random battle?</a><br />";
		}
		if (target === 'restarts') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#restarts\">Why is the server restarting?</a><br />";
		}
		if (target === 'all' || target === 'star' || target === 'player') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#star">Why is there this star (&starf;) behind my username?</a><br />';
		}
		if (target === 'staff') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/staff_faq\">Staff FAQ</a><br />";
		}
		if (target === 'autoconfirmed' || target === 'ac') {
			matched = true;
			buffer += "A user is autoconfirmed when they have won at least one rated battle and have been registered for a week or longer.<br />";
		}
		if (!matched) {
			return this.sendReply("The FAQ entry '" + target + "' was not found. Try /faq for general help.");
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/tiers/\">Smogon Tiers</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/tiering-faq.3498332/\">Tiering FAQ</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/xyhub/tiers\">The banlists for each tier</a><br />";
		}
		if (target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496305/\">Ubers Viability Rankings</a><br />";
		}
		if (target === 'overused' || target === 'ou') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3511596/\">np: OU Stage 5</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3491371/\">OU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3502428/\">OU Viability Rankings</a><br />";
		}
		if (target === 'underused' || target === 'uu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508311/\">np: UU Stage 2</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3502698/#post-5323505\">UU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3500340/\">UU Viability Rankings</a><br />";
		}
		if (target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3515615/\">np: RU Stage 4</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3506500/\">RU Viability Rankings</a><br />";
		}
		if (target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3514299/\">np: NU Stage 1</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3509494/\">NU Viability Rankings</a><br />";
		}
		if (target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496013/\">LC Viability Rankings</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3490462/\">Official LC Banlist</a><br />";
		}
		if (target === 'doubles') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3509279/\">np: Doubles Stage 3.5</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3498688/\">Doubles Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496306/\">Doubles Viability Rankings</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Tiers entry '" + target + "' was not found. Try /tiers for general help.");
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function (target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox("<a href=\"https://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/\">Generation 6 Analyses Index</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || 'xy').trim().toLowerCase();
		var genNumber = 6;
		// var doublesFormats = {'vgc2012':1, 'vgc2013':1, 'vgc2014':1, 'doubles':1};
		var doublesFormats = {};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === 'xy' || generation === 'xy' || generation === '6' || generation === 'six') {
			generation = 'xy';
		} else if (generation === 'bw' || generation === 'bw2' || generation === '5' || generation === 'five') {
			generation = 'bw';
			genNumber = 5;
		} else if (generation === 'dp' || generation === 'dpp' || generation === '4' || generation === 'four') {
			generation = 'dp';
			genNumber = 4;
		} else if (generation === 'adv' || generation === 'rse' || generation === 'rs' || generation === '3' || generation === 'three') {
			generation = 'rs';
			genNumber = 3;
		} else if (generation === 'gsc' || generation === 'gs' || generation === '2' || generation === 'two') {
			generation = 'gs';
			genNumber = 2;
		} else if(generation === 'rby' || generation === 'rb' || generation === '1' || generation === 'one') {
			generation = 'rb';
			genNumber = 1;
		} else {
			generation = 'xy';
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1, 'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':"VGC 2012", 'vgc2013':"VGC 2013", 'vgc2014':"VGC 2014", 'doubles':"Doubles"}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox("" + pokemon.name + " did not exist in " + generation.toUpperCase() + "!");
			}
			// if (pokemon.tier === 'CAP') generation = 'cap';
			if (pokemon.tier === 'CAP') return this.sendReply("CAP is not currently supported by Smogon Strategic Pokedex.");

			var illegalStartNums = {'351':1, '421':1, '487':1, '493':1, '555':1, '647':1, '648':1, '649':1, '681':1};
			if (pokemon.isMega || pokemon.num in illegalStartNums) pokemon = Tools.getTemplate(pokemon.baseSpecies);
			var poke = pokemon.name.toLowerCase().replace(/\ /g, '_').replace(/[^a-z0-9\-\_]+/g, '');

			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/pokemon/" + poke + doublesFormat + "\">" + generation.toUpperCase() + " " + doublesText + " " + pokemon.name + " analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/items/" + itemName + "\">" + generation.toUpperCase() + " " + item.name + " item analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/abilities/" + abilityName + "\">" + generation.toUpperCase() + " " + ability.name + " ability analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/moves/" + moveName + "\">" + generation.toUpperCase() + " " + move.name + " move analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		if (!atLeastOne) {
			return this.sendReplyBox("Pokemon, item, move, or ability not found for generation " + generation.toUpperCase() + ".");
		}
	},

	// Formats

	pointscore: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Point Score is a custom rule set which uses points to adjust how you make a team:<br />' +
			'- <a href="https://github.com/BrittleWind/Pokemon-Showdown/blob/master/data/README%20-%20Point%20Score.md#the-points">README: overview of Point Score</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/phoenixleague-pointscore-3822">Elite Fou® Cats vs Elite Fou® dvetts</a>'
		);
	},

	perseverance: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Perseverance is a format which encourages smart play, and loser is first to lose a Pokemon:<br />' +
			'- <a href="https://github.com/LynnHikaru/Perseverance-/blob/master/README.md">README: overview of Perseverance</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/phoenixleague-perseverance-3900">Cosy vs Champion® Lynn</a>'
		);
	},

	/***************************************
	* Music Boxes                          *
	***************************************/

	farneobox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="blue"><u>FarNeo 2\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=btPJPFnesV4">Eye Of The Tiger</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=9jK-NcRmVcw">The Final Countdown</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=vx2u5uUu3DE">It\'s My Life</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=68ugkg9RePc">Blue</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	pandorasbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="28DC04"><u>Pandora\'s Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=sQ-RweA1p7w">Touhou: Kyouko\'s Theme</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=OyUJnV2R-5g">Night of Nights</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=HGmn9m0RDAI">Karakuri Pierrot</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=4skCwu0IlxU">Ren\'ai philosophia</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	kjubox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="black"><u>King Jong-Un\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=_cG7ZVBXQII">Kim Jong Style</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=7pKrVB5f2W0">Alors on danse</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=oiKj0Z_Xnjc">Papaoutai</a><br>' +
			'<cetner><b><a href="https://www.youtube.com/watch?v=ublchJYzhao">Te Fete</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	jdbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="darkblue"><u>jd\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=e8X3ACToii0">Savior</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=6nQCxwneUwA">Satellite</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=pH20zsVxxV0">State of the Union</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=_DboMAghWcA">Hero Of War</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="skyblue"><u>Hope\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=zK268TLKCK4">Night of the Hunter</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=zMmQSEaS-w0">The Kill</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=hMAVLXk9QWA">This is War</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=gXF7pUlXDyE">City of Angels</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox2: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="lightgreen"><u>Hope\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=jVJZ5MbJDzU">What I\'m Made Of</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=rM85TNMnUkA">Live and Learn</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=uEzXFuYN89k">Open Your Heart</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=75yPcHplI64">Chemical Plant Zone</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox3: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="red"><u>Hope\'s Kirby Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=40DEipGcoXg">Dirty and Beauty</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=eTeT6t9sdjc">Magolor\'s Medley</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=AFZHQZFd1Bw">Zero Two</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=nNmoqC9ndBg">Drawcia Soul</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox4: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="darkorange"><u>Hope\'s Kingdom Hearts Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=LoZabebGiDo">Enter the Darkness</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=wTLXGqkD4Zc">Forze Del Male</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=JyaWwq4CfTk">Lord of the Castle</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=YtAFN2LFBpQ">L\'Impeto Oscuro</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox5: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="gray"><u>Hope\'s Final Boss Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=-cHBCD6c8LA">Zeromus</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=3YNfX1oU2XA">Kefka</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=Si3C1EtGo4c">Trance Kuja</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=ukxB2TqljzQ">Caius Ballad</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox6: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="gold"><u>Hope\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=rJxt-WBVYyc">Endless Possibilities</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=ey-oB-qw45c">With Me</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=dc_a2eWp9t4">Reach for the Stars</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=_kTBbTSjZpI">I am all of me</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox7: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="tael"><u>Hope\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=-fDcvxzgCBE">Crisis City Modern</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=yHm2b2jd1Ts">City Escape Classic</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=9nw7usYYTaU">Rooftop Run Classic</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=3OmmxC6FutA">Shadow For True Story</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	hopebox69: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="darkblue"><u>Hope\'s Chrono Cross Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=ponx7VYSrh4">The Brink of Death</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=H-IJV93FQZc">Dragon God</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=Hj4FnVABiN8">Scars of Time</a><br />' +
			'<center><b><a href="https://www.youtube.com/watch?v=CuG4Mst-DS8">Gale</a><br /></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	highbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="red">P</font><font color="orange">r</font><font color="ccd815">i</font><font color="green">n</font><font color="blue">c</font><font color="purple">e</font><font color="red">s</font><font color="orange">s</font><font color="ccd815">H</font><font color="green">i</font><font color="blue">g</font><font color="purple">h</font><font color="red">\'</font><font color="orange">s</font> <font color="ccd815">L</font><font color="green">i</font><font color="blue">f</font><font color="purple">e</font></u></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=A3jzMyYgPQs">Do What U Want</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=pZ12_E5R3qc">Partition</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=O-zpOMYRi0w">Fancy</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=pco91kroVgQ">Applause</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	isawabox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="5CE4FF"><u>Isawa\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=gY16msUgCYM">Universal</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=-J7J_IWUhls">The Only Exception</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=EYW7-hNXZlM">Opening Sonic Boom</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=X9fLbfzCqWw">Ocean Avenue</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	handreliefbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="yellow"><u>Hand Relief\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=EbKvBT9F0Vo">Dream On</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=sxdmw4tJJ1Y">Rock You Like A Hurricane</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=CHUqE5p15C0">Last Child</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=WLE7hcSgxlM">Fade To Black</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	adipravarbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="blue"><u>Adipravar\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=Rm42xAvWdvQ">Lingashtakam</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=Z2kBfiItjgs">Pokemon Advanced</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=Ly9BBdCcjLE">Ethir Neechal</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=cXIeUJE2YHo">Pokemon Destiny Deoxys</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	kdrewbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="blue"><u>Kdrew\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=JDcbvWkmOcw">Lost</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=obeXPTAV4wU">Kiss The Devil</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=47MbajGiZBg">Legend Of Thunder Theme song</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=Eb3Dr3Vgee0">Chasing Ghosts</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	figgybox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="#00AF33"><u>Figgy\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=0IA3ZvCkRkQ">Hero</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=-LOgMWbDGPA">Eleanor Rigby</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=aynclw6TXeE">The Biology Song</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=moSFlvxnbgk">Let It Go</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	sethbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="purple"><u>Seth\'s MP3</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=uOEu5ulb9zE">Endless Despair II</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=phz7jf0HUPs">In Da Buns</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=5ckDg2hZPq4">My Pride</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=fY_Nawg1R-4">Skull Man Stage</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	thugbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="blue"><u>Thug\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=njJ7NZMH70M">Not Gonna Die</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=fQIfBJVFTWE">Lift</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=oNtcP6EXm3s">This Will Be The Day</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=l0T0orZR5D4">Pokemon Unbeatable</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	lucybox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="pink"><u>Lucy\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=OpQFFLBMEPI">Just Give Me A Reason</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=moSFlvxnbgk">Let It Go</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=o_v9MY_FMcw">Best Song Ever</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=KRaWnd3LJfs">Payphone</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	dolphbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="green"><u>Dolph\'s Sexy Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=CS9OO0S5w2k">YMCA</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=l5aZJBLAu1E">It\'s Raining Men</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=btPJPFnesV4">Eye Of The Tiger</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=vq6Q9wu3F6w">Miami Dolphins Fight Song</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	taelbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="#01DF01"><u>Tael\'s Jukebox</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=zZL_psFiZu4">Stickerbrush Unwind</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=u9zZus_1_ag">Live And Learn</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=THwwagCSqag">Hold Yuh Riddim</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=VT6LFOIofRE">Libera Me From Hell</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	kcbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="purple"><u>Kc\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=hwsXo6fsmso">Ease My Mind</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=EGQhenjZ84w">Babylon</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=RSvuv3k4N8c">Days In The East</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=sX9DgavXiN4">High For This</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	faithbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="blue"><u>Faith\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=YnP92_fZhQY">Moving Forward</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=miFhwa1_fwE">Get Out Alive</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=NBDAE2g4gXo">Last Spell</a><br>' +
			'<center><b><a href="http://www.youtube.com/watch?v=L_vsutSlyJs">Rebellion</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	primmbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="blue"><u>Primm\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=RbtPXFlZlHg">Talk Dirty</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=518WB1IcjPI">All Of Me</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=KpS-9OcYyqk">Not a Bad Thing</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=ZRf_8YFPe1g">Body Bag</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	cosybox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="red"><u>Cosy\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=moSFlvxnbgk">Let It Go</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=P2mQaAT51Kw">Operation Ground and Pound</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=XbGs_qK2PQA">Rap God</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=sENM2wA_FTg">It\'s Time</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	tailzbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="maroon"><u>Tailz\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=F7mMBSKYUFc">I\'ve Got All This Ringing In My Ears And None On My Fingers</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=21YJcWdiNfI">If It Means A Lot To You</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=Cvnk_DSUq3E">The High Road</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=xZ2yP7iUDeg">Millenia</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	sayshibox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="red"><u>SaysHi Music Galore</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=0KSOMA3QBU0">Dark Horse</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=XjwZAa2EjKA">Unconditionally</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=1-pUaogoX5o">Waking Up In Vegas</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=CevxZvSJLk8">Roar</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	czimbox: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right">' +
			'<center><h1><font color="red"><u>Czim\'s Music Box</u></color></h1></center>' +
			'<center><b><a href="https://www.youtube.com/watch?v=ghb6eDopW8I">Little Talks</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=r8OipmKFDeM">Don\'t Look Back In Anger</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=32GZ3suxRn4">Slow Dancing In A Burning Room</a><br>' +
			'<center><b><a href="https://www.youtube.com/watch?v=MmZexg8sxyk">Electric Feel</a><br></center>' +
			'<img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="left"><img src="http://i.imgur.com/Df5hZ9S.png" width="30" height="30" align="right"><br><br>'
		);
	},

	/***************************************
	* League Cards                         *
	***************************************/

	mercilessleague: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/4AEkWrg.png" width="480"><br />' +
			'<img src="http://i.imgur.com/FILf3Um.png" width="280">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/charizard-megax.gif"><br />' +
			'<font color="blue">Champion: </font>StunfiskThe Great<br />' +
			'<b>We are Merciless and We Mean Business! Come challenge us or join today!</b><br />' +
			'Click <a href="http://mercilessleague.weebly.com/">here</a> to see our website<br />' +
			'Click <a href="https://docs.google.com/document/d/1OTP9JDz2Q6z6oFnvy2-jRH5o9XdFwZaJBU-ndRWpgIM/edit"> here </a>for rules and registering'
		);
	},

	/***************************************
	* Trainer Cards                        *
	***************************************/

	kb: 'kafkablack',
	kafka: 'kafkablack',
	kafkablack: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('<center><img src="http://i.imgur.com/bvCvPmd.gif"><br />' +
			'<font size="3" color="#00CC33"><b><i>Kafka</i></font></b></font><br />' +
			'<b><blink>Ace: Shimmy </blink></b><br />' +
			'<b>Now I have a tc on two servers, topkek</b></center>'
		);
	},

	ima: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><b><font size="3">gg</b></font><br /><img src="http://i.imgur.com/0j2NKtN.png" height="200">' +
			'<img src="http://i.imgur.com/jZM4Yau.gif" width="250">' +
			'<img src="http://i.imgur.com/pGTsgtC.png" height="200"><br />' +
			'<img src="http://i.imgur.com/RlysR4t.gif"><br />' +
			'<b>Ace:</b> Tyler<br />' +
			'I\'m a fuckin\' walking paradox.</center>'
		);
	},

	felicette: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://24.media.tumblr.com/f004d4e770655d1e188f2bbba28cd915/tumblr_n1hkstkhtp1qdlh1io1_400.gif"><br />' +
			'<font size="3" color="03A1B0"><b><i>Félicette</font></i></b><br />' +
			'<b>nyoooooom gotta go fast to get dat jd boo-tay nyoooooooom</b></center>'
		);
	},

	garde: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gardevoir-mega.gif">' +
			'<img src="http://i.imgur.com/VxNCwRt.png" width="320">' +
			'<img src="http://fc07.deviantart.net/fs71/i/2013/351/e/9/mega_gardevoir_by_nganlamsong-d6y9ygy.png" height="100"><br />' +
			'<b>Ace:</b> Mega Gardevoir<br />' +
			'I\'m sexy.</center>'
		);
	},

	/***************************************
	* Trainer Cards                        *
	***************************************/

	kah: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/KH3GVna.gif" height="130">' +
    		'<img src="http://i.imgur.com/9k24Lr4.gif">' +
    		'<img src="http://i.imgur.com/tsELV3Q.gif" height="130"><br />' +
    		'<b>Ace:</b> This fine Gentleman<br />' +
			'<img src="http://i.imgur.com/1yPTdH8.gif" width="227" height="163"><br />' +
    		'Kah521 gets naked often.<br />' +
			'<button name="send" value="/transferbucks Kah521,1"> Donate a buck otherwise I can\'t teach the scrubs to quickscope. </button></center>');
    },

	ferro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/IIb5Xtb.png"><br />' +
			'<img src="http://i.imgur.com/dKslWgS.png">' +
			'<img src="http://i.imgur.com/OQp5diX.png">' +
			'<img src="http://i.imgur.com/7knXKo7.png"><br />' +
			'<b>Aces:</b> Metagross, Breloom, Drapion<br /> ' +
			'With power like this on my side, how could I possibly fail?</center>');
	},

	cale: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://i.imgur.com/Igqnu79.gif"><br />' +
        	'<font size="3" color="#66CCCC"><b><i>Cale</b></i></font><br />' +
        	'<b><blink>Ace: Cunnalingus</blink></b><br />' +
        	'<b>I wonder what it\'s like to be black</b></center>');
    },

	redrikeo: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/pbKumB3.png">' +
    		'<img src="http://i.imgur.com/UI7iJRh.gif">' +
    		'<img src="http://i.imgur.com/yQbeCwg.jpg"><br />' +
			'<img src="http://sprites.pokecheck.org/i/454f.gif"><br />' +
    		'<b>Ace:</b> Toxicroak &lt; Giratina<br />' +
    		'"Anyone not willing to die for something isn\'t fit to live at all."</center>');
    },

	runy: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://imgur.com/UKCRMA8.gif" height="100">' +
    		'<img src="http://i.imgur.com/CbAJ86A.gif" width="320">' +
    		'<img src="http://imgur.com/y0mp28m.gif" height="120"><br />' +
    		'<b>Ace:</b> Honchkrow<br />' +
    		'Do I wanna know, if this feeling flows both ways.</center>');
    },

	gray: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://38.media.tumblr.com/tumblr_m6qap24Pt61rs7un3o1_500.gif" width="200">' +
    		'<img src="http://i.imgur.com/EyUEr9f.gif">' +
    		'<img src="http://fc06.deviantart.net/fs70/f/2011/360/a/c/breloom_by_all0412-d4k9tfo.jpg" height="130"><br />' +
    		'<b>Ace:</b> Breloom<br />' +
    		'It is not enough that we do our best; sometimes we must do what is required.</center>');
    },

	colons: 'chakra',
	chakra: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/4Qb8b0e.gif"><br />' +
    		'<img src="http://i.imgur.com/fIiqiBh.gif">' +
    		'<img src="http://i.imgur.com/GfwnBN7.gif">' +
    		'<img src="http://i.imgur.com/fIiqiBh.gif"><br />' +
    		'<b>Ace: </b>Sord<br />' +
			'"hi how r u :s"<br />' +
			'<button name="send" value="/transferbucks Chakra, 1">Donate if you have swag.</button> </center>');
    },

	arifeen: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="https://38.media.tumblr.com/tumblr_mb1dgpivmF1rcwf0xo2_500.gif" height="100" width="100">' +
    		'<img src="http://i.imgur.com/foDX5P5.png">' +
    		'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/meloetta.gif"><br />' +
    		'<b>Ace:</b> Tempesta &lt; SmallBootyHoe<br />' +
    		'<font face="Comic Sans MS">FUCK NIGGAS GET HIGH M8</font></center>');
    },

	kafka: function(target, room, user) {
        if (!this.canBroadcast()) return ;
        this.sendReplyBox('<center><img src="http://i.imgur.com/bvCvPmd.gif"><br />' +
        	'<font size="3" color="#00CC33"><b><i>Kafka</i></font></b></font><br />' +
        	'<b><blink>Ace: Shimmy </blink></b><br />' +
        	'<b>Now I have a tc on two servers, topkek</b></center>');
    },

	ima: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><b><font size="3">gg</b></font><br /><img src="http://i.imgur.com/0j2NKtN.png" height="200">' +
    		'<img src="http://i.imgur.com/jZM4Yau.gif" width="250">' +
    		'<img src="http://i.imgur.com/pGTsgtC.png" height="200"><br />' +
			'<img src="http://i.imgur.com/RlysR4t.gif"><br />' +
    		'<b>Ace:</b> Tyler<br />' +
    		'I\'m a fuckin\' walking paradox.</center>');
    },

	felicette: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://24.media.tumblr.com/f004d4e770655d1e188f2bbba28cd915/tumblr_n1hkstkhtp1qdlh1io1_400.gif"><br />' +
    		'<font size="3" color="03A1B0"><b><i>Félicette</font></i></b><br />' +
    		'<b>nyoooooom gotta go fast to get dat jd boo-tay nyoooooooom</b></center>');
    },

	garde: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/gardevoir-mega.gif">' +
    		'<img src="http://i.imgur.com/VxNCwRt.png" width="320">' +
    		'<img src="http://fc07.deviantart.net/fs71/i/2013/351/e/9/mega_gardevoir_by_nganlamsong-d6y9ygy.png" height="100"><br />' +
    		'<b>Ace:</b> Mega Gardevoir<br />' +
    		'I\'m sexy.</center>');
    },

	lightning: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/iJ0FAiT.gif">' +
    		'<img src="http://i.imgur.com/kiEAFGi.png" width="360">' +
    		'<img src="http://i.imgur.com/TCxGhn4.jpg" height="140"><br />' +
    		'<b>Ace:</b> Dragonite<br />' +
    		'My birds are stronger than Bruce Lee.</center>');
    },

	jyph: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/vPbnacz.gif">' +
    		'<img src="http://i.imgur.com/m9GCS8r.gif">' +
    		'<img src="http://i.imgur.com/iMhAVon.png" height="140"><br />' +
    		'<b>Ace:</b> Scolipede<br />' +
    		'It\'s more important to master the cards you are holding than to complain about the ones your opponents were dealt.</center>');
    },

	crthree: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://24.media.tumblr.com/3ca27ada2b921325d28a15d493380232/tumblr_mxnelanYmB1t4drgdo1_500.gif" width="150">' +
    		'<img src="http://i.imgur.com/bi7CmzJ.png" width="250">' +
    		'<img src="http://oi33.tinypic.com/14vsayg.jpg" width="140"><br />' +
    		'<b>Ace:</b> MLG Pro Strats<br />' +
    		'"From drab to fab, with nothin\' but mustard!"</center>');
    },

	youtubers: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/udBmLSc.jpg" width="150">' +
			'<img src="http://i.imgur.com/sOz21Ea.gif">' +
			'<img src="http://i.imgur.com/8H2TKXi.png" width="125" height="100"><br />' +
			'<b>Ace: </b>Youtubers<br />' +
			'If Youtubers aren\'t your life you suck!</center>'
		);
	},

	reck: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://i.imgur.com/dua8WEl.png" width="150">' +
			'<img src="http://i.imgur.com/msQpOCM.png" width="200">' +
			'<img src="http://i.imgur.com/f90Z3RI.jpg?1?3249" width="150"><br />' +
			'<b>Ace: </b>Mega Gardevoir & Bisharp<br>' +
			'Truth is you don\'t know what\'s going to happen tomorrow. Life is a crazy ride and nothing is guaranteed.</center>'
		);
	},

	dawnmidst: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/xFZjcWt.gif">' +
			'<img src="http://i.imgur.com/U6aIk3B.png" width="370">' +
			'<img src="http://i.imgur.com/lv7MXaB.gif"><br />' +
			'<b>Ace:</b> Kingdra<br />' +
			'When the prison doors are opened, the real dragon will fly out.</center>'
		);
	},

	thmo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/eyds52S.gif">' +
			'<img src="http://i.imgur.com/uAu5J7C.gif">' +
			'<img src="http://i.imgur.com/nfmlXu9.gif"><br />' +
			'<b>Ace:</b> The Eternal Floette<br />' +
			'My cookies are very tasty, so please buy one! :).<br />' +
			'<button name="send" value="/transferbucks Thimo, 1">Buy a cookie! (Donates a Buck)</button></center>'
		);
	},

	puzzle: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/QzVD08J.gif" width="230">' +
			'<img src="http://i.imgur.com/rFc6m8m.png">' +
			'<img src="http://i.imgur.com/uWwGbNs.gif" width="180"><br />' +
			'<b>Ace:</b> My Wits<br />' +
			'A Gentleman Leaves No Puzzle Unsolved.</center>'
		);
	},

	crow: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://media.pldh.net/pokemon/gen6/xy-animated/198.gif">' +
			'<img src="http://i.imgur.com/6Fju81D.png">' +
			'<img src="http://media.pldh.net/pokemon/gen6/xy-animated/198.gif"><br />' +
			'<img src="http://i.imgur.com/uschk29.png"><br />' +
			'<font color="black"><b>Ace: </font>My Powers</b><br />' +
			'<font color="black"><center>"These eyes see the darkness clearly."</font><br />' +
			'<center><button name="send" value="/transferbucks Crow\'s Bank, 1" >Donate to Crow!</button>'
		);
	},

	urri: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/ui6zHcv.png">' +
			'<img src="http://i.imgur.com/VPVLsOQ.png">' +
			'<img src="http://i.imgur.com/3ZouoHO.png" height="200"><br />' +
			'<b>Ace:</b> Alomomola<br />' +
			'Don\'t hate my Azian bros.</center>'
		);
	},

	swage: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://cdn.makeagif.com/media/8-08-2014/mtIROz.gif" width="130">' +
			'<img src="http://i.imgur.com/FpYSDU7.png" width="270">' +
			'<img src="http://cdn.makeagif.com/media/8-08-2014/pnwAQy.gif" width="140"><br />' +
			'<b>Ace:</b> Swag<br />' +
			'Nobody can handle my SWAGE.</center>'
		);
	},

	farneo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/rowLuS0.png" width="140">' +
			'<img src="http://i.imgur.com/tz2UjZH.png" width="260">' +
			'<img src="http://i.imgur.com/kAara1x.jpg" width="140"><br />' +
			'<b>Ace:</b> Flygon<br />' +
			'Dejavu.</center>'
		);
	},

	ventom: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://stream1.gifsoup.com/view/174454/sokka-and-suki-2-o.gif" height="130">' +
			'<img src="http://i.imgur.com/r0Kymre.gif">' +
			'<img src="http://38.media.tumblr.com/tumblr_m3ucyt9QXC1r1gjtbo1_500.gif" height="130"><br />' +
			'<b>Ace:</b> Our LOVE!<br />' +
			'We love and care for each other! We will do anything to make each other as happy as can be! ~phantom+ Venom/crona/sokka</center>'
		);
	},

	greek: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/oBGI3sP.gif" width="130" height="140">' +
			'<img src="http://i.imgur.com/9e5RUk9.png" width="280">' +
			'<img src="http://i.imgur.com/CXTVySG.gif" width="130" height="140"><br />' +
			'<b>Ace:</b> Mega Mawile and Heatran<br />' +
			'Welcome to the shitty restaurant. Today\'s special: Steel</center>'
		);
	},

	ins: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/jlShiXW.png" width="500"><br />' +
			'<img src="http://i.imgur.com/Zd3y6Fu.jpg" height="200"><br />' +
			'<b>Ace:</b> Thundurus-Therian<br />' +
			'<font color="blue"><b>"The sky is infinite, our lives are not. So live every day as if it were your last!"</b></font></center>'
		);
	},

	receptic: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/j4QpMfl.png">' +
			'<button name="send" value="/transferbucks M & R\'s Bank, 1">Donate a Buck for our Love :D</button><br />' +
			'<img src="http://i.imgur.com/HLMqigz.gif" width="130">' +
			'<img src="http://i.imgur.com/Gls3Tt6.png" width="270">' +
			'<img src="http://i.imgur.com/gVTBdwD.gif" width="130"><br />' +
			'<b>Ace: </b>Our Love<br />' +
			'Love is like Quicksand<br />' +
			'The deeper you fall in, the harder it is to get out'
		);
	},

	frosty: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/EF57HEV.gif">' +
			'<img src="http://i.imgur.com/eOxXXjo.gif">' +
			'<img src="http://i.imgur.com/a3Zf8MI.gif"><br />' +
			'<b>Ace:</b> Kyurem-Black<br />' +
			'"Ice is cool and all (Pun Intended) but I\'m supa HAWT in so many ways... So Come at me Brah".</center>'
		);
	},

	laurelin: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/XwEIGsZ.gif" width="180">' +
			'<img src="http://i.imgur.com/PAZgOQw.png">' +
			'<img src="http://i.imgur.com/liVSPw9.gif" width="185"><br />' +
			'<b>Ace:</b> Slipper<br />' +
			'"Fish are food, not friends :3"</center>'
		);
	},

	bethany: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/yaC7CV2.jpg" height="150">' +
			'<img src="http://i.imgur.com/QtvsQt7.gif">' +
			'<img src="http://i.imgur.com/ltoHyHJ.jpg" height="140"><br />' +
			'<b>Ace:</b> Cameron Dallas<br />' +
			'Me and Cam are against you so Good Luck!</center>'
		);
	},

	yahir: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/mF8cwGN.jpg" width="150">' +
			'<img src="http://i.imgur.com/RSjZLaF.png">' +
			'<img src="http://i.imgur.com/FSdhBGu.jpg" width="140"><br />' +
			'<b>Ace:</b> Greninja<br />' +
			'"You know how people say nothing can walk on water? Well guess again :3"</center>'
		);
	},

	dk: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/9ytPhX3.gif" width="120">' +
			'<img src="http://i.imgur.com/UeQliy2.gif">' +
			'<img src="http://i.imgur.com/RwpOW91.jpg" width="125"><br />' +
			'<b>Ace:</b> Final Gambit and Hax<br />' +
			'Forcing ragequits since 05.</center>'
		);
	},

	goose: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://puu.sh/aDU8T/d65f5c123c.png" height="216" width="300"><br />' +
			'<font size="3"> <font color="FF8000"> <b> <i>Goose</font></i><br />' +
			'<font size="2"> <i> Artist: jd</font></i><br />' +
			'<b>I PRESENT TO YOU; THE GOOSIEST GOOSE YOU\'VE EVER LAID EYES ON</b></center>'
		);
	},

	raichu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/ErxWrec.gif" height="100">' +
			'<img src="http://i.imgur.com/SX7CvKg.gif">' +
			'<img src="http://i.imgur.com/Wk9xsAR.jpg" width="150"><br />' +
			'<b>Ace:</b> Raichu<br />' +
			'Its not a party without Raichu.</center>'
		);
	},

	booticky: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://31.media.tumblr.com/tumblr_lyl0124nll1qd87hlo1_500.gif" height="80">' +
			'<img src="http://i.imgur.com/RAmL4b9.png" width="310">' +
			'<img src="http://play.pokemonshowdown.com/sprites/afd/slowbro.png"><br />' +
			'<b>Ace:</b> Lotad and Gallade<br />' +
			'Time changes everything except something within us which is always surprised by change.</center>'
		);
	},

	thimo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/onwJ0We.png" height="140">' +
			'<img src="http://i.imgur.com/ZFsEIwT.gif">' +
			'<img src="http://imgur.com/VBMqWQk.png" height="140"><br />' +
			'<b>Ace:</b> Arcanine<br />' +
			'You\'re a genius if u can stop the Fire Spin.</center>'
		);
	},

	link: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/Sgv8N08.gif" width="170">' +
			'<img src="http://i.imgur.com/Ni7Q3dS.gif">' +
			'<img src="http://i.imgur.com/7QUztES.gif" height="160"><br />' +
			'<b>Ace:</b> Chandelure<br />' +
			'If at first you don\'t succeed, find out if the loser gets anything.</center>'
		);
	},

	kamiko: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/fJvcdib.png" height="140">' +
			'<img src="http://i.imgur.com/ogUeVsJ.gif" width="340">' +
			'<img src="http://i.imgur.com/lP5oreI.jpg" height="140"><br />' +
			'<b>Ace: </b>Lesbian Love<br />' +
			'Let\'s go play Naked Twister</center>'
		);
	},

	jets: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://25.media.tumblr.com/ac8464fb8dbe13d71d2ae6fedc8c8ab7/tumblr_mnjfywfFS01ssbq4vo1_500.gif" width="160">' +
			'<img src="http://i.imgur.com/W1nJEDq.png">' +
			'<img src="http://i179.photobucket.com/albums/w293/raixal_the_wrath/POKEMON/4100755c.jpg" width="140"><br />' +
			'<b>Ace:</b> Scarfpoleon<br />' +
			'If you cry because the sun has gone out of your life, your tears will prevent you from seeing the stars.</center>'
		);
	},

	brobro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://26.media.tumblr.com/tumblr_lzmbam385J1qczibyo1_r1_500.gif" width="140">' +
			'<img src="http://i.imgur.com/rrnCu7w.png">' +
			'<img src="http://24.media.tumblr.com/tumblr_lmfbi3vkev1qd87hlo1_500.gif" width="150"><br />' +
			'<b>Ace:</b> Regenerator<br />' +
			'DUR DUR DUR.</center>'
		);
	},

	bryden38: 'bryden',
	bryden: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/onlJKI8.png" height=150>' +
			'<img src="http://i.imgur.com/c7EjKB8.png" height=150>' +
			'<img src="http://imgur.com/XZ0841t.png" height=150><br />' +
			'<b>Ace: </b>Gyarados<br />' +
			'<b>Quote: </b>Unitato</center>'
		);
	},

	andy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/9WOAyGQ.png">' +
			'<img src="http://i.imgur.com/d9UuYnc.gif" width="250">' +
			'<img src="http://i.imgur.com/Ioi3U1N.png" width="140"><br />' +
			'<b>Ace:</b> Palkia and Absol<br />' +
			'Ready, Steady, GO!</center>'
		);
	},

	mistic: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/haQViF5.gif" width="140">' +
			'<img src="http://i.imgur.com/LDQS4LO.gif">' +
			'<img src="http://i.imgur.com/ofVvw0x.gif" width="130"><br />' +
			'<b>Ace:</b> Butters<br />' +
			'Putting the Laughter back into Manslaughter</center>'
		);
	},

	worldsstrongestman: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/3YbbvmB.gif" width="120">' +
			'<img src="http://i.imgur.com/GZ0cQCI.png" width="300">' +
			'<img src="http://i.imgur.com/YzQoBs5.gif" width="120"><br />' +
			'<b>Ace:</b> The Worlds Strongest Man<br />' +
			'Because I can, and that\'s just what I do.</center>'
		);
	},

	phanturtl: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://4.bp.blogspot.com/-QATUyoHimHk/UXuMrCGh0eI/AAAAAAAALcU/m02mVZNIumY/s1600/shuckle.gif " height=130>' +
			'<img src="http://i.imgur.com/ioaEcCC.gif">' +
			'<img src="http://i.imgur.com/Sn9m5vY.jpg" height=130><br />' +
			'<b>Ace: </b>Team Shuckle<br />' +
			'<b>Quote: </b>“mmmmmmm…… What? Sorry, Turtl was too busy thinking about Phantom\'s Legs…. Legs for daaaaaayzzzz….”</center>'
		);
	},

	turing: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/b0BaTye.jpg">' +
			'<img src="http://i.imgur.com/KC3Zqfs.jpg">' +
			'<img src="http://i.imgur.com/F3meaJl.jpg"><br />' +
			'<b>Ace:</b> Running From Trainer Battles<br />' +
			'My Level. Get on it.</center>'
		);
	},

	certified: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://howto.wired.com/mediawiki/images/Broken-image-netscape.png" width="130">' +
			'<img src="http://i.imgur.com/PbKvz9v.gif" width="250">' +
			'<img src="http://elitedaily.com/wp-content/uploads/2013/04/BG9mlvuCAAEm7nn.jpeg" width="160"><br />' +
			'<b>Ace:</b> Lost Niggas<br />' +
			'If you are reading this you are possibly a <b>CERTIFIED</b> Lost Nigga.</center>'
		);
	},

	kaisersthotties: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://gossip-juice.com/wp-content/uploads/2010/04/Nicole%20coco_3.jpg" height="180">' +
			'<img src="http://i.imgur.com/WRYenVd.png">' +
			'<img src="http://www.fuse.tv/image/535e65213729896301000008/560/292/social/ariana-grande-problem-single-cover-homepage.jpg" width="160"><br />' +
			'<b>Ace:</b> V Card<br />' +
			'Kaiser\'s thotties, all around the block.</center>'
		);
	},

	aceking: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/FGXGdYp.png" width="110">' +
			'<img src="http://i.imgur.com/TsdglO3.gif" width="330">' +
			'<img src="http://i.imgur.com/2O4E2ct.jpg" width="100"><br />' +
			'<b>Ace:</b> Tyranitar<br />' +
			'I am a King who Fears Nothing and a King who Desires Nothing! I am the One and Only 01AceKing!</center>'
		);
	},

	sarkany: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/n5mL3p8.jpg" width="180">' +
			'<img src="http://i.imgur.com/wKbQGZn.png" width="180">' +
			'<img src="http://i.imgur.com/cSYaNBu.jpg" width="180"><br />' +
			'<b>Ace:</b> Zen Mode Darmanitan | Dark Monotype<br />' +
			'"You know I always wanted to be the best<br />' +
			'You know I always wanted to be God"</center>'
		);
	},

	caillou: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://popdose.com/wp-content/uploads/caillou21.jpg" width="120">' +
			'<img src="http://i.imgur.com/cxVaXLq.png">' +
			'<img src="http://img2.wikia.nocookie.net/__cb20121117102851/caillou/images/1/19/Caillou-xl-pictures-03.jpg" width="140"><br />' +
			'<b>Ace:</b> Swag<br />' +
			'Swag Swag like Caillou.</center>'
		);
	},

	kaiserslegacy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ9VPKmltlIFDmc8hpeIYKOfRw5j1SD1dBafq1U_aamjMcFZfA45A" width="130">' +
			'<img src="http://i.imgur.com/pG8f4hz.png">' +
			'<img src="http://pldh.net/media/dreamworld/475.png" width="120"><br />' +
			'<b>Ace:</b> Logic<br />' +
			'What makes a good player is dedication, but what makes a champion is skill.</center>'
		);
	},

	firnen: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/hippowdon.gif">' +
			'<img src="http://i.imgur.com/72GZ2c0.png">' +
			'<img src="http://i.imgur.com/5aeCLV7.png" width="160"><br />' +
			'<b>Ace:</b> Hippowdon advertiser sandstorms<br />' +
			'The Belgian user of Frost... Beer, chocolate, waffles and french fries is my motto!</center>'
		);
	},

	sae: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/suicune.gif">' +
			'<img src="http://i.imgur.com/CeTVoJg.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lanturn.gif"><br />' +
			'<b>Ace:</b> Suicune<br />' +
			'Battles are like the waves, you never know which way the tides will turn.</center>'
		);
	},

	tygastro: 'tyga',
	tyga: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados-shiny/gyarados.gif">' +
			'<img src="http://i.imgur.com/CwwYtMD.png">' +
			'<img src="http://images6.fanpop.com/image/photos/34000000/Steven-Stone-pokemon-steven-stone-34077948-302-400.jpg" width="120"><br />' +
			'<b>Ace:</b> <font color="purple">Gyarados</font><br />' +
			'<font color="orange">Fix that attitude around me.</font></center>'
		);
	},

	pix: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://static.tumblr.com/1b17af80ded13382d32e38945bf14ff8/bpdkmvt/h8Vmqbz32/tumblr_static_1212_-_gif_mark_henry_wwe.gif" width="180">' +
			'<img src="http://i.imgur.com/cAoSjXd.png">' +
			'<img src="http://www.somegif.com/gifs/1363711542831138275.GIF" width="180"><br />' +
			'<b>Ace:</b> Smash and Pass<br />' +
			'Feels Good Man.</center>'
		);
	},

	shag: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://33.media.tumblr.com/cc4b9cafb6acc9a964a544cc220cf969/tumblr_mqn39b5Ev71s6hco9o3_500.gif" width="120">' +
			'<img src="http://i.imgur.com/U0Rf51C.png" width="300">' +
			'<img src="http://31.media.tumblr.com/tumblr_m2rbujGAHZ1r6e21po1_500.gif" width="120"><br />' +
			'<b>Ace:</b> Aggron<br />' +
			'Men are like steel. When they lose their temper, they lose their worth.</center>'
		);
	},

	mo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/EJIaMWR.jpg" width="220">' +
			'<img src="http://i.imgur.com/scFn6uM.gif">' +
			'<img src="http://i.imgur.com/N2jg8gJ.jpg" height="180"><br />' +
			'<b>Ace:</b> Pinky &lt;3<br />' +
			'GET A MOON OR DIE!</center>'
		);
	},

	tylan: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/scizor-mega.gif">' +
			'<img src="http://i.imgur.com/iUvVWk7.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/lucario-mega.gif"><br />' +
			'<b>Ace:</b> Mega Lucario And Sciz<br />' +
			'The Steel Dominators.</center>'
		);
	},

	stunfisk: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i629.photobucket.com/albums/uu15/psnmoonlight/stunfisk.gif" width="165">' +
			'<img src="http://i.imgur.com/rcKBBEe.png">' +
			'<img src="http://media.tumblr.com/tumblr_m6dp60bRXy1r33a1p.gif" width="165"><br />' +
			'<b>Ace:</b> Stunfisk<br />' +
			'All your base have belong to us.</center>'
		);
	},

	whores: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://static.fjcdn.com/gifs/Vine_596aed_395011.gif" width="130">' +
			'<img src="http://i.imgur.com/HF11y72.png" width="300">' +
			'<img src="http://24.media.tumblr.com/tumblr_lyb5bfPNdT1qd8t4mo1_500.gif" width="110"><br />' +
			'<b>Ace:</b> Onix & Cloyster<br />' +
			'Hoes b4 Bros</center>'
		);
	},

	vapo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://media.tumblr.com/860c2b0219bcfb6afe40355dbbaf06a2/tumblr_inline_n7yctdq0pA1rl3wbk.jpg" width="100">' +
			'<img src="http://i.imgur.com/NjTTPWo.png" width="340">' +
			'<img src="http://i.imgur.com/fPaOhi2.jpg" width="100"><br />' +
			'<b>Ace:</b> Vaporeon<br />' +
			'<font size=10> <font color=salmon> :^)</center>'
		);
	},

	cfrios: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/UuoXqPn.gif"><br />' +
			'<img src="http://img.4plebs.org/boards/tg/image/1398/65/1398650987364.gif" width="250"><br />' +
			'<button name="send" value="/transferbucks Cfrios13, 1" target="_blank">Muffin Button (Donates A Buck)</button><br />' +
			'<b>Ace:</b> Muffin<br />' +
			'Muffin is love, Muffin is life.</center>'
		);
	},

	ciaran: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/bogEbbB.jpg" width="130">' +
			'<img src="http://i.imgur.com/ComsY8I.gif" width="300">' +
			'<img src="http://i.imgur.com/SFOqjKU.jpg" width="110"><br />' +
			'<b><font color="red">Ace:</b> Any and all lolis</font><br />' +
			'It seems that my penis got bit by a snake, mind if I use your mouth as an antidote?</center>'
		);
	},

	hailz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/6yYefUg.png" width="190">' +
			'<img src="http://i.imgur.com/V3OTef3.png">' +
			'<img src="http://i.imgur.com/cw1vy36.jpg" width="160"><br />' +
			'<b>Ace:</b> Medical Science<br />' +
			'You want to kiss me, don\'t you? I always want to kiss you</center>'
		);
	},

	inwhale: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/bwani/scizor-mega.gif">' +
			'<img src="http://i.imgur.com/34vV7nU.png" width="350">' +
			'<img src="http://play.pokemonshowdown.com/sprites/bwani-shiny/volcarona.gif"><br />' +
			'<b>Ace:</b> Scizor<br />' +
			'A pestilence upon you, nerds!</center>'
		);
	},

	jeli: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src=http://i.imgur.com/iRbumTr.jpg>' +
			'<img src=http://i.imgur.com/kQbWDUE.png>' +
			'<img height=150 src=https://cookingplanit.com/public/uploads/inventory/bratwurst_1338322491.jpg><br />' +
			'<b> Ace:</b> The taste of our cookies and sausage<br />' +
			'You jeli, bro?</center>'
		);
	},

	theneovoid: 'tnv',
	tnv: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><font face="Comic Sans MS" size=15>Sample Text</font><br />' +
			'<img src="http://i.imgur.com/lx7C4gu.gif" width=250><br /><b><font face="Comic Sans MS" size=' +
			'<font color="#52CC52">Ace:</font><img src="http://blog.mobileroadie.com/wp-content/uploads/2012/' +
			'04/CaseStudy_042312_MLG-450x340.jpg" width=50><font face="Comic Sans MS" size=3>The Neo Void</b>' +
			'<img src="http://i435.photobucket.com/albums/qq72/L0N6H0RN/mdewTAR.png" width=60"><br><b>Quote: ' +
			'</b>"<b>I</b><b>L</b><b>L</b> fucking rek <b>U</b> <b>M</b>8, <b>I</b> swear on me <b>N</b><b>A' +
			'</b>n, ill shoo<b>T</b> u wif me qu<b>I</b>ckscope."</center<p><center><img src="http://25.media.' +
			'tumblr.com/tumblr_mc351hVQPQ1qf021po1_500.gif" width=40><button name="send" type="button " value="' +
			'/transferbucks The Neo Void, 1" target="_blank">DONATE 2 ME OR IL REPOT U M8. IF U DON HAV MUNNY, ' +
			'GIT GUD SCRUB</button><img src="http://25.media.tumblr.com/tumblr_mc351hVQPQ1qf021po1_500.gif" width=40></center>'
		);
	},

	roxas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://stream1.gifsoup.com/view/1029429/axel-roxas-last-goodbye-o.gif" width="150">' +
			'<img src="http://i.imgur.com/6rNedsW.png" width="240">' +
			'<img src="http://stream1.gifsoup.com/view2/2254189/roxas-vs-sora-gif-1-o.gif" width="150"><br />' +
			'<b>Ace:</b> X-Blade<br />' +
			'"You\'re lucky Sora... cause it looks like summer vacation is over."</center>'
		);
	},

	illumanise: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/ObJo7Hr.png" width="100">' +
			'<img src="http://i.imgur.com/1Oa3z9T.png" width="320">' +
			'<img src="http://i.imgur.com/1S0trTw.jpg" width="120"><br />' +
			'<b>Ace:</b> Kammi<br />' +
			'I &lt;3 HB</center>'
		);
	},

	latios: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://cdn.idigitaltimes.com/data/images/full/2013/08/13/10916.png" width="130">' +
			'<img src="http://i.imgur.com/BB1bObq.gif">' +
			'<img src="http://fc00.deviantart.net/fs46/f/2009/195/8/2/Latios_by_aocom.jpg" width="150"><br />' +
			'<b>Ace:</b> Latios<br />' +
			'Act as if it were impossible to fail, then you are sure to succeed.</center>'
		);
	},

	bariankaiser: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img.pokemondb.net/artwork/aegislash-blade.jpg" width="140">' +
			'<img src="http://i.imgur.com/hLz1bUh.png">' +
			'<img src="http://img1.wikia.nocookie.net/__cb20130104181204/yugiohzexalencyclopedia/images/0/01/Barian_Emblem.jpg" width="150"><br />' +
			'<b>Ace:</b> Aegislash<br />' +
			'My dark side cannot be contained, I\'m the true demon of this game.</center>'
		);
	},

	castformz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/i8hk0uK.jpg" width="100">' +
			'<img src="http://i.imgur.com/a9Ewgyr.png" width="340">' +
			'<img src="http://i.imgur.com/JybM3dn.jpg" width="100"><br />' +
			'<b>Ace:</b> 1.8 Pounds of hot air<br />' +
			'"I should buy a tc for no reason" ~Castformz</center>'
		);
	},

	kittyhope: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/h3kX1jc.png" width="120">' +
			'<img src="http://i.imgur.com/vEbDcla.gif" width="300">' +
			'<img src="http://i.imgur.com/LjLmSbB.png" width="120"><br />' +
			'<b>Ace:</b> The Bearers Of Light ~ Hope And Kitty<br />' +
			'The Light Shines on Everyone and when it Shines on you there is Greatness, Happiness, and Love~</center>'
		);
	},

	perseus: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/o13YADZ.png" width="120">' +
			'<img src="http://i.imgur.com/qWgacoN.png">' +
			'<img src="http://i.imgur.com/mbCr8LV.jpg" width="170"><br />' +
			'<b>Ace:</b> Scizor<br />' +
			'The first step to wisdom is admitting you know nothing, and that Perseus knows everything.</center>'
		);
	},

	tchin: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://oi59.tinypic.com/2a0fext.jpg">' +
			'<img src="http://i.imgur.com/PBkltgX.png">' +
			'<img src="http://pkparaiso.com/imagenes/xy/sprites/animados/sableye.gif"><br />' +
			'<b>Ace:</b> Confuse Hax<br />' +
			'Sableye is love, Sableye is Life.</center>'
		);
	},

	swag: 'wontuns',
	wontuns: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/qusAikh.gif">' +
			'<img src="http://i.imgur.com/xroBlIR.png">' +
			'<img src="http://i.imgur.com/qusAikh.gif">' +
			'<center><img src="http://i.imgur.com/CErHwhW.gif" height=89 width=100>' +
			'<img src="http://i.imgur.com/CErHwhW.gif" height=89 width=100>' +
			'<img src="http://i.imgur.com/CErHwhW.gif" height=89 width=100>' +
			'<img src="http://i.imgur.com/CErHwhW.gif" height=89 width=100>' +
			'<img src="http://i.imgur.com/CErHwhW.gif" height=89 width=100>' +
			'<center><font face="arial" font size="2" color=1A2389> <b><i>Because sometimes, when you close your eyes, you just can\'t see a thing.</i></b></font>'
		);
	},

	admincyrull: 'cyrull',
	cyrull: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img2.wikia.nocookie.net/__cb20140131082810/pokemon/images/8/87/Cyndaquil_XY.gif">' +
			'<img src="http://i.imgur.com/zqWLMri.gif">' +
			'<img height=100 src="http://i579.photobucket.com/albums/ss239/megosb/GIFs/54zhb1.gif"><br />' +
			'<b>Ace:</b> COOKIE!!!!!!!!!!!!!<br />' +
			'<b>Quote: </b>GIVE ME THE COOKIE and LOOK AT THE CYNDAQUIL</center>'
		);
	},

	wf: 'worldsfinest',
	bitg: 'worldsfinest',
	bestinthegame: 'worldsfinest',
	worldsfinest: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=130 src="http://i.imgur.com/I9jP2Qg.png">' +
			'<img src="http://i.imgur.com/CiVVDgI.gif">' +
			'<img src="http://i.imgur.com/D3i6TeI.png"><br />' +
			'<b>Quote:</b> Best In The Game</b></center>'
		);
	},

	inferno: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/bZTyuwj.gif" width="125">' +
			'<img src="http://i.imgur.com/MAwiieK.gif">' +
			'<img src="http://i.imgur.com/Ortq3vp.gif" width="125"><br />' +
			'<b>Ace:</b> Honchkrow<br />' +
			'Fear is not evil, fear is what helps us find out our weaknesses, and once we figure out our weaknesses we become stronger and gentler people.</center>'
		);
	},

	ccty: 'crazytyga',
	crazytyga: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/jNWfZYB.png" width="100">' +
			'<img src="http://i.imgur.com/EU34lFA.png" width="340">' +
			'<img src="http://i.imgur.com/D9ZIMbV.png" width="100"><br />' +
			'<b>Ace:</b> Latios + Latias<br />' +
			'1 thing 2 do 3 words 4 you "I love you"</center>'
		);
	},

	mag: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/xyani-shiny/zangoose.gif">' +
			'<img src="http://i.imgur.com/uQ4P665.png" width="370">' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani/magmortar.gif"><br />' +
			'<b>Ace:</b> Zangoose<br />' +
			'Get Rekt!</center><br />' +
			'<b>Style: </b>Semistall<br />' +
			'<b>Favorite Tier: </b>Gen5NU<br />' +
			'<b>League: </b>Elitist'
		);
	},

	dragoncrusher: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img2.wikia.nocookie.net/__cb20140120185954/pokemonfanon/images/8/88/Mega-Charizard-X-031.jpg" width="110">' +
			'<img src="http://i.imgur.com/5dLVId1.png" width="320">' +
			'<img src="http://i.imgur.com/3ctHPyc.jpg" width="110"><br />' +
			'<b>Ace:</b> Mega Charzard-X<br />' +
			'Don\'t get your underwear in a knot.</center>'
		);
	},

	updatedkanto: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/a23GKfX.png" width="110">' +
			'<img src="http://i.imgur.com/RhBTKXV.gif" width="320">' +
			'<img src="http://i.imgur.com/vmWF8Zi.png" width="110"><br />' +
			'<b>Ace:</b> Hand Relief<br />' +
			'Twerking is a sport.</center>'
		);
	},

	turtl: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://stream1.gifsoup.com/view8/4905727/krieg-o.gif" width="145">' +
			'<img src="http://i.imgur.com/iCYjNaf.png?1?9582" width="245">' +
			'<img src="http://stream1.gifsoup.com/view5/1963978/torterra-o.gif" width="145"><br />' +
			'<b>Ace:</b>Krieg<br>' +
			'<b>Quote:</b>"If I silence the Voices then Everything would be a lot less fun."</center>'
		);
	},

	toad: 'lapras',
	lapras: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/30zBvPA.png" width="120">' +
			'<img src="http://i.gyazo.com/a2fcd18f88cee0464e3610eeea91f1ee.png" width="300">' +
			'<img src="http://i.imgur.com/OUFJyu7.jpg" width="120"><br />' +
			'<b>Ace:</b> What ever the F*#@ I want<br />' +
			' Never back down and Never give up!</center>'
		);
	},

	gorve: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/DdisyPH.gif" width="130">' +
			'<img src="http://i.imgur.com/IKfpMJJ.gif" width="270">' +
			'<img src="http://media.giphy.com/media/tI3Z87IstMxG0/giphy.gif" width="140"><br />' +
			'<b>Ace:</b> <font color="orange">Charizard</font> & <font color="pink">Mew</font><br />' +
			'<font color="red">Heard you had to sell your soul to beat me in Pokemon.</font></center>'
		);
	},

	darkrida: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/charizard-megax.gif">' +
			'<img src="http://i.imgur.com/FosZbmV.gif">' +
			'<img src="http://i.imgur.com/7TMTTD7.jpg" width="140"><br />' +
			'<b>Ace:</b> Darkjak x Barida<br />' +
			'The thirstiest users of Frost, we know they had to be together.</center>'
		);
	},

	chris: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://th01.deviantart.net/fs71/PRE/i/2011/046/9/8/venusaur_painting_by_purplekecleon-d39n2zz.png" width="160">' +
			'<img src="http://i.imgur.com/lCDihoi.gif">' +
			'<img src="http://fc09.deviantart.net/fs71/f/2012/133/6/f/pokemon_trainer_red_by_hana_mi-d4j77xx.png" width="100"><br />' +
			'<b>Ace:</b> Mega Venusaur<br />' +
			'A real warrior doesnt dash off in pursuit of the next victory nor throw a fit when experiencing a loss. A real warrior ponders the next battle.</center>'
		);
	},

	zardif: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://pldh.net/media/pokemon/gen6/xy-animated/392.gif">' +
			'<img src="http://i.imgur.com/P9uPxqg.gif">' +
			'<img src="http://pldh.net/media/pokemon/gen6/xy-animated/006.gif"><br />' +
			'<b>Ace:</b> Gay love<br />' +
			'When we get together shit gets hot!</center>'
		);
	},

	gonny: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://images.forwallpaper.com/files/thumbs/preview/59/598146__evil-absol_p.jpg" height="80">' +
			'<img src="http://i.imgur.com/gniJvmV.gif" width="300">' +
			'<img src="http://fc09.deviantart.net/fs70/f/2013/082/0/f/milotic_by_lunasnightmare-d5yynfy.jpg" height="90"><br />' +
			'<b>Ace:</b> Absol<br />' +
			'Work until your idols become your rivals.</center>'
		);
	},

	kjflame013: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i7.photobucket.com/albums/y251/ProphetZA/Pokemon/445.jpg" width="100">' +
			'<img src="http://i.imgur.com/zmHW2Kf.gif" width="330">' +
			'<img src="http://th03.deviantart.net/fs71/PRE/i/2012/348/1/c/venusaur_by_nar447-d5o0dq8.jpg" width="110"><br />' +
			'<b>Ace:</b> Garchomp & Venusaur<br />' +
			'Don\’t give up! There\’s no shame in falling down! True shame is to not stand up again!</center>'
		);
	},

	dating: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i254.photobucket.com/albums/hh108/naten2006/oie_17447500rCQ2IUY_zps9bdc16b7.gif" width="100">' +
			'<font size=5>Dating: Dolph and Mating</font>' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/blastoise-mega.gif" width="100"><br />' +
			'<img src="https://i.chzbgr.com/maxW500/5616725504/hC9CC4D55/" width="200"><br />' +
			'<font color="blue"> What happens in Dolph\'s car, stays in Dolph\'s car</center>'
		);
	},

	phantom: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/rd18bxe.jpg" width="90">' +
			'<img src="http://i.imgur.com/Aj8pOcC.png" width="350">' +
			'<img src="http://i.imgur.com/yvRIWI4.jpg" width="100"><br />' +
			'<b>Ace:</b> Gliscor<br />' +
			'Nyanpassu~</center>'
		);
	},

	xbane: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/YX5NfOz.jpg" width="160">' +
			'<img src="http://i.imgur.com/Me5jPPo.png">' +
			'<img src="http://www.hollywoodreporter.com/sites/default/files/imagecache/blog_post_349_width/2013/09/robocop_poster_p_2013.jpg" width="130"><br />' +
			'<b>Ace:</b> X-Behemoth<br />' +
			'Analyze, Adapt, Assimilate. I am <i><b>X-Bane.</b></i></center>'
		);
	},

	wrath: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/Juhmirh.gif" width="150">' +
			'<img src="http://i.imgur.com/uQClQ0R.gif">' +
			'<img src="http://i.imgur.com/LiMJIzg.gif" width="160"><br />' +
			'<b>Ace:</b> Tyrantrum<br />' +
			'I can clearly see your weakness with my Ultimate Eye.</center>'
		);
	},

	rhydon: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img1.wikia.nocookie.net/__cb20130108174955/pokemontowerdefense/images/5/52/Infernape-infernape-23393713-629-354.png" width="100">' +
			'<img src="http://i.imgur.com/gWvojqo.png" width="350">' +
			'<img src="http://1.bp.blogspot.com/-jSWkq15P1es/UllXd4KeuqI/AAAAAAAAEDk/Y4qUdehPZY0/s320/MegaCharizardXYSkyBattle.jpg" width="90"><br />' +
			'<b>Ace:</b> Infernape<br />' +
			'My blue flames are stronger than my red flames.</center>'
		);
	},

	zyns: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://oi57.tinypic.com/zl3yae.jpg" width="80">' +
			'<img src="http://i.imgur.com/qubm9ul.png" width="360">' +
			'<img src="http://cdn.bulbagarden.net/upload/thumb/2/21/Cher_Roserade.png/250px-Cher_Roserade.png" width="100"><br />' +
			'<b>Ace:</b> Roserade<br />' +
			'Don\'t be fooled by the natural beauty of grass it can be dangerous.</center>'
		);
	},

	volky: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc06.deviantart.net/fs71/i/2013/074/d/5/kabutops_pokedoll_art_by_methuselah_alchemist-d5y5ssk.png" width="85">' +
			'<img src="http://i.imgur.com/WaIV1TW.gif" width="370">' +
			'<img src="http://fc01.deviantart.net/fs70/f/2011/340/e/3/pokeddex_challenge___kabutops_by_phantos-d4ie1ip.png" width="85"><br />' +
			'<b>Ace:</b> Pretzelz<br />' +
			'I didn\'t choose the thung life, the thug life chose me.</center>'
		);
	},

	jolts: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/excadrill.gif">' +
			'<img src="http://i.imgur.com/0LvU4dS.gif" width="330">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/empoleon.gif"><br />' +
			'<b>Ace:</b> Drill.I.Am<br />' +
			'THE GLORIOUS EVOLUTION!</center>'
		);
	},

	fer: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/meloetta.gif">' +
			'<img src="http://i.imgur.com/tnclC26.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/slowbro.gif"><br />' +
			'<b>Ace:</b> Mega Medicham<br />' +
			'People Need Hard Times, and Oppression To Build Psychic Muscles.</center>'
		);
	},

	zamuil: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/CoCAmqW.jpg" width="160">' +
			'<img src="http://i.imgur.com/83MwZKE.png">' +
			'<img src="http://i.imgur.com/WIQDYoS.jpg" width="160"><br />' +
			'<b>Ace:</b> Verne the Scarfed Jolteon<br />' +
			'An eye for an eye leaves the whole world blind, a tooth for a tooth and no one will smile.</center>'
		);
	},

	corroc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/k63VSUP.jpg" width="160">' +
			'<img src="http://i.imgur.com/z5b8zp8.gif">' +
			'<img src="http://i.imgur.com/syCjHHW.png" width="160"><br />' +
			'<b>Ace:</b> Bisharp<br />' +
			'Paramore is love. Paramore is life. Hayley Williams is an angel.</center>'
		);
	},

	kreme: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/JNtuRyG.png" width="150">' +
			'<img src="http://i.imgur.com/peLCM5N.gif">' +
			'<img src="http://i.imgur.com/3DMahw6.jpg" width="150"><br />' +
			'<b>Ace:</b> Dugtrio<br />' +
			'These hoes ain\'t loyal :I</center>'
		);
	},

	chansey: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/TVlZQlp.jpg" width="100"><br />' +
			'<img src="http://i.imgur.com/4D7p44f.gif" width="400"><br />' +
			'<img src="http://i.imgur.com/dYeGVCZ.png" width="250"><br />' +
			'<b>Ace:</b> Chansey<br />' +
			'The Lord and Mascot for the 3rd Chaos League Master.</center>'
		);
	},

	cam: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/skarmory.gif">' +
			'<img src="http://i.imgur.com/YQCPBYU.gif">' +
			'<img src="http://fc02.deviantart.net/fs70/f/2012/192/e/0/cheren_by_otakuron-d56rf8z.png" width="100"><br />' +
			'<b>Ace:</b> Skarmory<br />' +
			'Stop Wishing, Start Doing.</center>'
		);
	},

	psyzen: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://th07.deviantart.net/fs70/PRE/i/2013/299/0/6/trainer_sparky_and_gallade_by_sparkytangerine-d6rvqeq.png" width="120">' +
			'<img src="http://i.imgur.com/ZBWaYKM.png" width="300">' +
			'<img src="http://th00.deviantart.net/fs71/PRE/i/2013/099/9/d/475___gallade___art_v_2_by_tails19950-d60zw22.png" width="120"><br />' +
			'<b>Ace:</b> Gallade<br />' +
			'Always Aim To Break Their Will.</center>'
		);
	},

	greeling: 'titan',
	titan: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img2.wikia.nocookie.net/__cb20130602145854/fma/images/thumb/8/82/Greedling-profile.png/300px-Greedling-profile.png" width="140">' +
			'<img src="http://i.imgur.com/nw76seS.gif" width="260">' +
			'<img src="http://i.imgur.com/mWUrtx5.gif" width="140"><br />' +
			'<b>Ace:</b> Mega-Blastoise<br />' +
			'Only those who will risk going too far can possibly find out how far one can go.</center>'
		);
	},

	croven: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/GTFlmkW.gif">' +
			'<img src="http://i.imgur.com/qt3XRrN.png">' +
			'<img src="http://i.imgur.com/sLxyTLg.gif"><br />' +
			'<b>Ace:</b> Togekiss<br />' +
			'You Humans think Greed is just for money and power! But everyone wants something they don\'t have. ~Greed</center>'
		);
	},

	crashy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/0lyplU7.png" height="100">' +
			'<img src="http://i.imgur.com/1MpUyqF.gif">' +
			'<img src="http://i.imgur.com/oO5g9NB.png" height="120"><br />' +
			'<b>Ace:</b> Shuckle<br />' +
			'"I typed gg but I actually meant fuck you"</center>'
		);
	},

	boreas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://24.media.tumblr.com/39fc7c50c9341c27c02ac1f909a03941/tumblr_mikoaxPZ5j1rtatqpo1_500.gif" width="160">' +
			'<img src="http://i.imgur.com/4I6VAQ5.png">' +
			'<img src="http://fc05.deviantart.net/fs71/f/2014/017/6/3/tumblr_mz5bj3hlf71qf8rnjo1_500_by_ryanthescooterguy-d72m8ce.gif" width="160"><br />' +
			'<b>Ace:</b> Weavile<br />' +
			'I only face steel. -_-</center>'
		);
	},

	voltaic: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/FEEZ0vf.gif">' +
			'<img src="http://i.imgur.com/MvsfTwg.gif">' +
			'<img src="http://i.imgur.com/Zx8UR5m.gif" width="120"><br />' +
			'<b>Type:</b> <font color="#FDD315">Electric</font><br />' +
			'Please explain why your silence makes more noise than thunder.</center>'
		);
	},

	happy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://i.imgur.com/CDVPctR.jpg" width="170">' +
			'<img src="http://i.imgur.com/X84XGIY.png">' +
			'<img src="https://i.imgur.com/7SNMJza.jpg" width="135"><br />' +
			'<b>Ace:</b> Chansey<br />' +
			'You are never too old for a Disney movie.</center>'
		);
	},

	bis: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.wallchan.com/images/mediums/48275.jpg" width="180">' +
			'<img src="http://i.imgur.com/tuJXsEd.png">' +
			'<img src="http://i.imgur.com/v9re2RR.jpg" width="100"><br />' +
			'<b>Ace:</b> Legendary Beasts<br />' +
			'I\'m the Apex Predator.</center>'
		);
	},

	blake: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://31.media.tumblr.com/7339b6afdb94b275f142ebae26668b75/tumblr_mlgw28eK1o1rj8nzio1_400.gif" width="130">' +
			'<img src="http://i.imgur.com/YkCmgpI.gif" width="340">' +
			'<img src="http://24.media.tumblr.com/6366ef75eb549cc676338027a7004937/tumblr_mk3d8giUNw1qg1v6ho3_250.gif" width="70"><br />' +
			'<b>Ace:</b> Espeon<br />' +
			'It\'s lovely! Almost as lovely as this book... That I will continue to read... As soon as you leave...</center>'
		);
	},

	taiyoinferno: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/i5aDCqo.jpg" width="100">' +
			'<img src="http://i.imgur.com/jKhJZ15.png" width="320">' +
			'<img src="http://i.imgur.com/a9eyoRx.jpg" width="110"><br />' +
			'<b>Ace:</b> Charizard<br />' +
			'Be Like Fire No Stances Keep Moving, There Is No Opponent I Fight To Overcome my Weaknesses Like Fire Can Evaporate Or Burn Earth, Water Etc Be Like The Sun My Friend...And Then You Can Beat...Chuck Norris\' A** ..Maybe<br />' +
			'<img src="http://i.imgur.com/Em93ycY.gif" height="80"></center>'
		);
	},

	razxr: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc08.deviantart.net/fs71/f/2014/080/9/8/avalugg_gif_2_by_gloomymyth-d7b51o2.gif">' +
			'<img src="http://i.imgur.com/g7p6FDN.png">' +
			'<img src="http://i.imgur.com/xvXmCYL.png"><br />' +
			'<b>Ace:</b> Avalugg<br />' +
			'Nothing burns like the cold.</center>'
		);
	},

	kimiko: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/2QMVuIq.jpg" height="180">' +
			'<img src="http://i.imgur.com/IzQgU16.gif"><br />' +
			'<b>Ace:</b> Cinccino<br />' +
			'Sweet as sugar, Cold as ice, Hurt me once, I\'ll break you twice.</center>'
		);
	},

	queen: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/charizard-megay.gif" width="140">' +
			'<img src="http://i.imgur.com/8IJzTz5.png" width="300">' +
			'<img src="http://i.imgur.com/nTP9Yjw.jpg" width="100"><br />' +
			'<b>Ace:</b> Every Pokemon<br />' +
			'If the sky is your limit, then your flight has just ended!</center>'
		);
	},

	rzl: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/R4dJvQf.gif" width="100">' +
			'<img src="http://i.imgur.com/dmtcGof.png" width="340">' +
			'<img src="http://i.imgur.com/Ihw2Avb.gif" width="100"><br />' +
			'<b>Ace:</b> Sun Glasses Bischeon<br />' +
			'H2O means two of me one of you.</center>'
		);
	},

	ghost: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/vK3Zkf3.gif" height="140">' +
			'<img src="http://i.imgur.com/7WjRvDa.png">' +
			'<img src="http://i.imgur.com/6cJI4DV.gif" height="140"><br />' +
			'<b>Ace:</b> Lucario<br />' +
			'Someone who can\'t sacrifice anything, can never change anything. - Armin Arlert</center>'
		);
	},

	kingslowking: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/FXbPyoJ.gif" width="130">' +
			'<img src="http://i.imgur.com/Nbda726.png" width="280">' +
			'<img src="http://i.imgur.com/O1p29AI.gif" width="130"><br />' +
			'<b>Ace:</b> Slowking<br />' +
			'You...Slowbro?</center>'
		);
	},

	rawk: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/OfUuEL7.png" width="120">' +
			'<img src="http://i.imgur.com/EoUCfNO.png" width="300">' +
			'<img src="http://i.imgur.com/MsqvSoA.png" width="110"><br />' +
			'<b>Ace:</b> Unpredictability<br />' +
			'Prediction will get you nowhere against the unpredictable.</center>'
		);
	},

	orange: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>I\'ll be on showdown. See you all later. Screw you</center>'
		);
	},

	scarf: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/kt0BaT7.gif">' +
			'<img src="http://i.imgur.com/MXPbbVK.png">' +
			'<img src="http://i.imgur.com/NNKTX8I.gif"><br />' +
			'<b>Ace:</b> <font color=blue>Excadrill</font><br />' +
			'<font color=blue>Master the cards you have been given than to complain about the cards your oppenent has been dealt, become stronger, believe in yourself young panda.</font></center>'
		);
	},

	cat: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/breloom.gif">' +
			'<img src="http://i.imgur.com/Lzp2Tqc.png" width="380">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/excadrill.gif"><br />' +
			'<b>Ace:</b> Breloom<br />' +
			'Sometimes hax and stall annoy the hell out of me, but not when I\'m using it.</center>'
		);
	},

	zard: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/ogH3V0k.gif">' +
			'<img src="http://i.imgur.com/OVPO6rt.png">' +
			'<img src="http://www.dcmetropolicecollector.com/dc_detective.jpg" height="180"><br />' +
			'<b>Ace:</b> Charizard<br />' +
			'Three things are infinite: Magicrap\'s will for revenge, my smartassness, and the hot chicks on showdown.</center>'
		);
	},

	adipravar: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/xrsKJDk.png" width="100">' +
			'<img src="http://i.imgur.com/yZxwkDq.png">' +
			'<img src="http://i.imgur.com/Ulo2OfQ.png" width="100"><br />' +
			'<b>Ace:</b> Rayquaza<br />' +
			'Never joke be as awesome as Rayquaza.</center>'
		);
	},

	bloodz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/OXnvOrf.png" width="80">' +
			'<img src="http://i.imgur.com/svehUu0.gif">' +
			'<img src="http://i.imgur.com/mgokdZJ.gif" width="100"><br />' +
			'<b>Ace:</b> Potato<br />' +
			'They see me haxin\' .. They rage quittin.</center>'
		);
	},

	ossified: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/UwxGUH3.png" width="130">' +
			'<img src="http://i.imgur.com/3RY1HWg.gif" width="280">' +
			'<img src="http://i.imgur.com/KHapq25.png" width="130"><br />' +
			'<b>Ace:</b> Sableye<br />' +
			'I can\'t resist a good prankster.</center>'
		);
	},

	acast: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/cUWyfi4.gif">' +
			'<img src="http://i.imgur.com/ctYX8ai.gif">' +
			'<img src="http://i.imgur.com/47KZLj4.gif"><br />' +
			'<b>Ace:</b> Experience<br />' +
			'<i>Pokémon get stronger through evolution. I get stronger through experience.</i></center>'
		);
	},

	amaan: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/tgNOgxv.png"><br />' +
			'<img src="http://i.imgur.com/PZevDPT.png" height="120">' +
			'<font size="5">Rock On</font>' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/cloyster.gif"><br />' +
			'<b>Ace:</b> <blink><font color="red">Amaan\'s Crib</font></blink><br />' +
			'<font color="purple">Remind yourself that you and your life is not always perfect</font></center>'
		);
	},

	lucy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img2.wikia.nocookie.net/__cb20100408190407/fairytail/images/archive/b/b8/20111117185218!Lucy_using_her_sexappeal.jpg" height="140">' +
			'<img src="http://i.imgur.com/S3ibOy9.png" width="350">' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani/klefki.gif"><br />' +
			'<b>Ace:</b><blink> Klefki</blink><br />' +
			'<blink>Don\'t you find me... distracting?</blink></center>'
		);
	},

	emelio: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/2NpH7pp.jpg?1" width="140">' +
			'<img src="http://i.imgur.com/8XI7o7S.png">' +
			'<img src="http://i.imgur.com/kysoJOc.jpg?1" width="140"><br />' +
			'<b>Ace:</b> Lucario, Zoroark, Infernape and Lugia<br />' +
			':D</center>'
		);
	},

	chaosred: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/xyani/dragonite.gif">' +
			'<img src="http://i.imgur.com/5AMGowt.gif" width="320">' +
			'<img src="http://play.pokemonshowdown.com/sprites/xyani/charizard-mega-x.gif" width="140"><br />' +
			'<b>Ace:</b> Lady Killa<br />' +
			'Ain\'t nothing wrong with going down. It\'s STAYING DOWN that\'s WRONG.</center>'
		);
	},

	ehsanul: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img1.ak.crunchyroll.com/i/spire2/fec754941ee9bccdb7dd160800fb30131236494917_full.gif" width="140">' +
			'<img src="http://i.imgur.com/iy8diTO.png" width="260">' +
			'<img src="http://www.mytinyphone.com/uploads/users/nightwolve777/320252.gif" width="140"><br />' +
			'<b>Ace:</b> Gogeta<br />' +
			'Power is Everything in Life!</center>'
		);
	},

	roy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i1148.photobucket.com/albums/o579/catfight09/Katekyo-Hitman-Reborn-image-katekyo-hitman-reborn-36253653-1024-768_zpsc394eb95.jpg" width="160">' +
			'<img src="http://i.imgur.com/wOPNjVd.gif">' +
			'<img src="http://i1148.photobucket.com/albums/o579/catfight09/Katekyo-Hitman-Reborn-image-katekyo-hitman-reborn-36253670-1680-1050_zps0e8f54a6.jpg" width="160"><br />' +
			'<b>Ace:</b> Victini<br />' +
			'A boss is someone who puts his life on the line for his subordinates.</center>'
		);
	},

	pichu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/NLto7aD.gif" width="160">' +
			'<img src="http://i.imgur.com/fTPamOT.png">' +
			'<img src="http://i.imgur.com/MO1uOld.gif" width="160"><br />' +
			'<b>Ace:</b> Pichu<br />' +
			'Why don\'t I get a Mega Stone?</center>'
		);
	},

	kju: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>King Jong-un doesn\'t really like Trainer Cards.<br />' +
			'<b>Ace:</b> <a href="https://www.youtube.com/watch?v=JUgEmezpS_E">KJU IRL</a>'
		);
	},

	hopgod: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/8G2GuGT.jpg" width="110">' +
			'<img src="http://i.imgur.com/TDpeD6Z.gif" width="310">' +
			'<img src="http://i.imgur.com/Tu112Os.jpg" width="110"><br />' +
			'<b>Ace:</b> Diggersby<br />' +
			'<i>I\'m beginning to feel like a Hopgod, Hopgod</i>.</center>'
		);
	},

	objection: 'ucn',
	n: 'ucn',
	unovachampionn: 'ucn',
	ucn: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src=http://www.court-records.net/rips/bubble-(ani)objection.gif><br>' +
			'<img src=http://www.court-records.net/animation/phoenix-zoom(b).gif width=170>' +
			'<img src=http://i.imgur.com/6TR2XrL.gif>' +
			'<img src=http://www.court-records.net/animation/godot-zoom(b).gif width=170>' +
			'<br><b><font color=black>Ace: </font><font color=red><blink>Objection! </blink><br><font color=darkblue><i>Objection!...that was Objectionable!'
		);
	},

	zerp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/spewpa-2.gif" height="150" width="150">' +
			'<img src="http://i.imgur.com/JsCCQVP.gif">' +
			'<img src="http://i.imgur.com/qA69m9M.png" width="150"><br />' +
			'<b>Ace:</b> Misspells<br />' +
			'Why don\'t you go back to kindergarten and learn how to spell.</center>'
		);
	},

	qube: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/tsn7dg3.jpg" width="180">' +
			'<img src="http://i.imgur.com/MRfFBvZ.jpg">' +
			'<img src="http://i.imgur.com/aVdJIgw.jpg" width="160"><br />' +
			'<b>Ace:</b> Donald/2Chainz<br />' +
			'Get rekt scrub.</center>'
		);
	},

	kyo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://pldh.net/media/pokemon/gen6/xy-animated-shiny/226.gif">' +
			'<img src="http://i.imgur.com/JZUTPTk.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/alomomola-3.gif"><br />' +
			'<b>Ace:</b> Kyogre\'s Son &lt; Hannah<br />' +
			'"If you aren\'t hated on then who the hell are you" ~IFC Yipes</center>'
		);
	},

	thunder: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/i4G2Dog.jpg?1" width="160">' +
			'<img src="http://i.imgur.com/j9x28oY.gif">' +
			'<img src="http://i.imgur.com/SblN25x.jpg?1" width="150"><br />' +
			'<b>Ace:</b> Conkeldurr<br />' +
			'I didn\'t choose the thug life, the thug life said "I choose you."</center>'
		);
	},

	leon: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://24.media.tumblr.com/7f9e08d14b2281a4a0798ae2a8a65c58/tumblr_mn219wXLJt1rw2d66o1_500.gif" width="160">' +
			'<img src="http://i.imgur.com/3be35l0.png">' +
			'<img src="http://www.mundoimagenz.com/wp-content/uploads/2014/03/iDbZUsa.jpg" width="160"><br />' +
			'<b>Ace:</b> Hydrigeon<br />' +
			'Winning battles is about making 2 steps forward for each step backwards.</center>'
		);
	},

	randorosu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><marquee behavior="slide" direction="down" scrollamount="10" height="100"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/landorus.gif">' +
			'<img src="http://i.imgur.com/I1qLAtu.png" width="310">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/greninja.gif"></marquee><br />' +
			'<marquee behavior="slide" scrollamount="20" direction="up" height="220"><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/hydreigon.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/tyranitar-mega.gif"><br />' +
			'<font color="red"><b>Ace: </font>My Dark Squadron</b>' +
			'<center><font color="purple"><b>Master of Nightmare</b></font><br />' +
			'<font color="red">"If you\'re going through hell, keep going"</font><br />' +
			'<button name="send" value="/transferbucks Randorosu Bank, 1" >Feeling Generous? Donate Now! :]</button></center>'
		);
	},

	kc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/heatran.gif" width="110">' +
			'<img src="http://i.imgur.com/zUqUdMD.gif" width="320">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados-shiny/charizard.gif" width="110"><br />' +
			'<b>Ace:</b> Charizard<br />' +
			'Apply cold water to burn.</center>'
		);
	},

	oim8: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/avalugg.gif">' +
			'<img src="http://i.imgur.com/Re5zoVx.png">' +
			'<img src="http://lh6.ggpht.com/_lqdCHczppdg/TPeXs21DbgI/AAAAAAAAAGU/rPUp6UsfSsk/shinra2.jpg" height="160"><br />' +
			'<b>Ace:</b> Don\'t forget to hit up the 1v1 room tho. .-.<br />' +
			'Haters will watch you walk on water and say it\'s because he can\'t swim.</center>'
		);
	},

	wolfwood: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc09.deviantart.net/fs70/f/2011/328/c/a/hippowdon_sig_by_supersleuth10-d4h5gl9.png" width="130">' +
			'<img src="http://i.imgur.com/rOEdRQq.png" width="320">' +
			'<img src="http://i981.photobucket.com/albums/ae294/Sora-XIII/Pokemon%20Artwork/450.jpg" width="90" height="90"><br />' +
			'<b>Ace:</b> Hippowdon<br />' +
			'There comes a moment where you realize I don\'t care.</center>'
		);
	},

	laxus: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/ssSyTaB.gif" width="180">' +
			'<img src="http://i.imgur.com/EkIMtJ9.gif">' +
			'<img src="http://pldh.net/media/pokemon/gen6/xy-animated-shiny/282-mega.gif"><br />' +
			'<b>Ace:</b> Mega Waifu & Sord<br />' +
			'You lost because sord is sord.</center>'
		);
	},

	zer0: 'zero',
	zero: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://tinyurl.com/lhjnvro" height="80" width="66">' +
			'<img src="http://i.imgur.com/cgQkJrV.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/latios.gif"><br />' +
			'<b>Ace:</b> Latios<br />' +
			'I\'m glad I have your blessing to make children with your sister.</center>'
		);
	},

	faith: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img1.wikia.nocookie.net/__cb20101013074316/fireemblem/images/5/52/Eirika_Great_Lord.gif">' +
			'<img src="http://i.imgur.com/TszHs6X.png">' +
			'<img src="http://i.imgur.com/eGn35WC.png" width="180"><br />' +
			'<b>Ace:</b> Keldeo<br />' +
			'Why do we start pointless fights and wars? The more death and destruction that we bring to this world, the less we can take enjoying our time in it.</center>'
		);
	},

	gard: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://pldh.net/media/pokemon/gen6/xy-animated/282.gif">' +
			'<img src="http://i.imgur.com/cKDD2PX.gif" width="350">' +
			'<img src="http://pldh.net/media/pokemon/gen6/xy-animated/245.gif"><br />' +
			'<b>Ace:</b> Suicune<br />' +
			'Having a negative approach to life just means less disappointments.</center>'
		);
	},

	calculu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/xmKhK6S.gif">' +
			'<img src="http://i.imgur.com/7tMA4Pa.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/landorus.gif"><br />' +
			'<b>Ace:</b> Garchomp<br />' +
			'Losing is a part of life. You just need to get back up and try again.</center>'
		);
	},

	stfu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/rE7QRKe.png" width="100">' +
			'<img src="http://i.imgur.com/MDYyJ9Y.png?1" width="300">' +
			'<img src="http://i.imgur.com/cQ9fXks.png" width="100"><br />' +
			'Stop! Just stop talking and leave.</center>'
		);
	},

	zenith: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/cagJbsh.png"><br />' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/entei.gif"><br />' +
			'<b>Ace:</b> Entei<br />' +
			'Prometheus gave fire to man, I mastered it.</center>'
		);
	},

	thugking25: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/z1aGOWt.png">' +
			'<img src="http://i.imgur.com/UcmY8VC.gif">' +
			'<img src="http://i.imgur.com/4tiVnXB.png"><br />' +
			'<b>Ace:</b> BLAZIKEN<br />' +
			'You\'d do well to remember this, Frosties. The only time a Lawyer can cry ... is when it\'s all over.</center>'
		);
	},

	okguy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://31.media.tumblr.com/1dc6e9b9576bfd48c4b26bf3658e8c57/tumblr_mqxim5QkxB1r0b2hgo4_400.gif" width="140">' +
			'<img src="http://i.imgur.com/5leebH9.png" width="240">' +
			'<img src="http://37.media.tumblr.com/tumblr_mchhjxVCsE1r8wykko1_500.gif" width="140"><br />' +
			'<b>Ace:</b> Power to the people<br />' +
			'I\'m the spark that makes your idea bright, The same spark that lights the dark, So that you can know your left from your right.</center>'
		);
	},

	walt: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://25.media.tumblr.com/cb6be2715a6c8520705f1759158f2725/tumblr_mtup02q9Mz1qhd8sao1_500.gif" width="160">' +
			'<img src="http://i.imgur.com/ernBvLL.png">' +
			'<img src="http://fc04.deviantart.net/fs71/f/2014/066/7/8/cam_s_pokesona__porygon2_by_perplexedcam-d79bhgi.png" width="140"><br />' +
			'<b><font color="#990000">Ace:</font></b> <font color="#009900">Bulk</font><br />' +
			'The greatest things come to those who wait. Stop whining and fight.</center>'
		);
	},

	formula: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://sprites.pokecheck.org/i/485.gif">' +
			'<img src="http://i.imgur.com/9N1zT8M.gif?1" width="390">' +
			'<img src="http://sprites.pokecheck.org/i/423.gif"><br />' +
			'<b>Ace:</b> Heatran<br />' +
			'Math + Pokemon = Quad. Formula.</center>'
		);
	},

	championnyan: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/YmKDecc.png" width="90">' +
			'<img src="http://i.imgur.com/tGfXtQC.gif" width="340">' +
			'<img src="http://i.imgur.com/iZo6RVm.jpg" width="90"><br />' +
			'<b>Ace:</b> Salamence<br />' +
			'We live to make the impossible possible! That is our focus!</center>'
		);
	},

	scourage: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/vtlcgj3.gif">' +
			'<img src="http://i.imgur.com/vOiCAz1.gif" width="380">' +
			'<img src="http://i.imgur.com/RKG5tKC.gif"><br />' +
			'<b>Ace:</b> Anything that will cause a slow death<br />' +
			'If you didn\'t want me to stall you to death, you should have said something... I guess it\'s too late now, sit back and enjoy the show.</center>'
		);
	},

	alpha: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://oi61.tinypic.com/2dc75dy.jpg" width="100">' +
			'<img src="http://i.imgur.com/50APYJL.gif" width="340">' +
			'<img src="http://oi61.tinypic.com/vyqqdy.jpg" width="100"><br />' +
			'<b>Ace:</b> Darmanitan<br />' +
			'50$ down the drain. Happy now?</center>'
		);
	},

	kaiba: 'mindcrush',
	mindcrush: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;

		var name = "http://i.imgur.com/GAIxZwB.gif"
		if (cmd == 'mindcrush') name = "http://i.imgur.com/o260t0n.png";

		this.sendReplyBox('<center><img src="http://www.sherv.net/cm/emoticons/rage/steamboat-troll-rage-smiley-emoticon.gif" height="110">' +
			'<img src="' + name + '" width="280">' +
			'<img src="http://i991.photobucket.com/albums/af32/DoubleEdd_3/TrollGun.gif" height="110"><br />' +
			'<b>Ace:</b> Forcing Rage Quits<br />' +
			'I\'d like to see things from your point of view, but I can\'t get my head that far up my ass.</center>'
		);
	},

	minatokyuubi: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/pEldH.png" width="130">' +
			'<img src="http://i.imgur.com/HkdptoW.png" width="280">' +
			'<img src="http://i.imgur.com/2kqFODU.jpg" width="130"><br />' +
			'<b>Ace:</b> The Yellow Flash<br />' +
			'Quick as Lightning.</center>'
		);
	},

	ultimate: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/RqtZbc1.gif" width="100">' +
			'<img src="http://i.imgur.com/VtPbIqY.gif" width="310">' +
			'<img src="http://i.imgur.com/HpH5G0T.gif" width="120"><br />' +
			'<b>Ace:</b> Pikachu<br />' +
			'A real warrior doesn\'t dash off in pursuit of the next victory, nor throw a fit when experiencing a loss. A real warrior ponders the next battle.</center>'
		);
	},

	dusk: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/BvlUF7p.png">' +
			'<img src="http://i.imgur.com/H13dKHl.png">' +
			'<img src="http://i.imgur.com/f4swUOf.gif"><br />' +
			'<b>Ace:</b> Mandibuzz<br />' +
			'I\'m the guy who started the Mandibuzz hate!</center>'
		);
	},

	nnk: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/5O3tHkV.jpg">' +
			'<img src="http://i.imgur.com/zCMe6ig.png">' +
			'<img src="http://i.imgur.com/QeLlI2I.png"><br />' +
			'<b>Ace:</b> Lucario<br />' +
			'Don\'t give up, the beginning is always the hardest, so let\'s keep on going till the very end.</center>'
		);
	},

	sol: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/breloom.gif">' +
			'<img src="http://i.imgur.com/qtfKdoF.gif">' +
			'<img src="http://i.imgur.com/u6fgcbx.gif"><br />' +
			'<b>Ace:</b> <font color=blue>Diggersby</font><br />' +
			'Don\'t fking touch my Chicken and Ben\'s Bacon :I</center>'
		);
	},

	ghast: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/aegislash.gif">' +
			'<img src="http://i.imgur.com/Hia14zw.png" width="350">' +
			'<img src="http://i.imgur.com/h3GJIh4.gif" width="120"><br />' +
			'<b>Ace:</b> Gengar<br />' +
			'I am darkness itself. I am your nightmares, your shadows, & everything you fear.</center>'
		);
	},

	czim: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc01.deviantart.net/fs70/f/2011/018/3/d/bath_time___aipom_and_porygon2_by_valichan-d37ihw6.png" width="160">' +
			'<img src="http://i.imgur.com/SyQmcOA.png">' +
			'<img src="http://th07.deviantart.net/fs71/PRE/f/2013/055/3/7/donald_duck_lol_by_new_born_magnezone-d5w259t.png" width="160"><br />' +
			'<b>Ace:</b> do /Donald and see for yourself :P<br />' +
			'Ducks rule!</center>'
		);
	},

	stun: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://37.media.tumblr.com/e890b0bb20d7630e48fad7e067b32a30/tumblr_mtj1fbaHlL1rj4z3ho1_1280.png" height="150"><br />' +
			'<img src="http://i.imgur.com/aa34uv5.gif" width="450">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/stunfisk.gif"><br />' +
			'<b>Ace:</b> Stunfisk<br />' +
			'It\'s so evil, it\'s genius!</center>'
		);
	},

	kozman: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/blastoise-mega.gif" width="80">' +
			'<img src="http://i.imgur.com/J000dbx.png" width="430">' +
			'<img src="http://www.pokestadium.com/pokemon/sprites/img/trainers/5/blackwhite2/126.gif"><br />' +
			'<b>Ace:</b> Blastoise<br />' +
			'If somethings important to you, you\'ll find a way. If not, you\'ll find an excuse.</center>'
		);
	},

	ghettoghetsis: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/2S9mgmt.png" width="130">' +
			'<img src="http://i.imgur.com/4X5KNXZ.png" width="280">' +
			'<img src="http://i.imgur.com/Vgmaw34.png" width="130"><br />' +
			'<b>Ace:</b> Shuckle<br />' +
			'2ghetto4u.</center>'
		);
	},

	traven: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/U8LOY74.jpg" width="150">' +
			'<img src="http://i.imgur.com/e8k5FnK.png" width="250">' +
			'<img src="http://i.imgur.com/7CPcZHZ.jpg" width="150"><br />' +
			'<b>Ace:</b> :D<br />' +
			'Introduce a little anarchy, upset the established order, and everything becomes chaos, I\’m an agent of chaos.</center>'
		);
	},

	cc: 'crazyclown94',
	crazyclown94: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://play.pokemonshowdown.com/sprites/bwani-shiny/medicham.gif">' +
			'<img src="http://i.imgur.com/dceDBHE.gif" width="380">' +
			'<img src="http://i.imgur.com/8BQzKRv.jpg" width="120"><br />' +
			'<b>Ace:</b> Medicham<br />' +
			'Puppies eat waffles for breakfast!</center>'
		);
	},

	seahutch: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/0hrEwBy.png" height="180">' +
			'<img src="http://i.imgur.com/LYhz5WX.gif">' +
			'<img src="http://i.imgur.com/GcoaLu2.png"><br />' +
			'<b>Ace:</b> Greninja<br />' +
			'A lesson without pain is meaningless. For you cannot gain anything without sacrificing something else in return, but once you have overcome it and made it your own...you will gain an irreplaceable fullmetal heart.</center>'
		);
	},

	thunderstruck: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/AXS5k3k.jpg" height="80"><br />' +
			'<img src="http://i.imgur.com/YYFLqNU.jpg" width="250" height="80"><br />' +
			'<img src="http://i.imgur.com/NF8AQpA.jpg" width="180" height="80"><br />' +
			'<b>Ace:</b> Stall Scor<br />' +
			'<marquee bgcolor=green scrollamount="5">I wonder how long... How long will I remain anchored at this harbor known as battle? And Then i said COME ON IIIN!!!</marquee></center>'
		);
	},

	mating: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i254.photobucket.com/albums/hh108/naten2006/oie_1944237QcDokLVq_zps0977c0b9.gif">' +
			'<img src="http://i254.photobucket.com/albums/hh108/naten2006/cooltext1482514275_zps4e7ca2e6.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kecleon.gif"><br />' +
			'<b>Aces:</b> Uxie and Kecleon<br />' +
			'<font color=purple>Maten (pronounced Mating): Now and Forever.</font></center>'
		);
	},

	crypt: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/B0NESFk.jpg?1" width="150">' +
			'<img src="http://i.imgur.com/mCe3Nja.gif" width="240">' +
			'<img src="http://i.imgur.com/TKHoBN7.jpg?1" width="150"><br />' +
			'<font color=blue><i>I have a disease called awesome, you wouldn\'t understand since you don\'t have it.</i></font><br />' +
			'<font color=red><blink><b>Ace:</font></blink></b> <font color=black><blink>Awesomeness</font></blink></center>'
		);
	},

	boo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/S8ly3.gif" width="150">' +
			'<img src="http://i.imgur.com/EyMReMo.gif" width="250">' +
			'<img src="http://i.imgur.com/nPsQa20.gif" width="150"><br />' +
			'<b>Ace:</b> GIMMICK<br />' +
			'If you aren\'t playing pokemon, then you aren\'t having any fun.</center>'
		);
	},

	rangermike: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/PIdZxWs.jpg weigh="190" height="133">' +
			'<img src="http://i.imgur.com/gRqlPCX.gif">' +
			'<img src="http://25.media.tumblr.com/4a60d16096f9d8f68c64ee71562308b1/tumblr_my110cdEsw1rfejkno1_500.gif" weigh="170" height="115"><br />' +
			'<b>Ace:</b> Chatot<br />' +
			'Let me serenade you.</center>'
		);
	},

	eevee: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://th08.deviantart.net/fs70/200H/i/2011/135/6/4/eevee_by_akuvix-d3gdtc4.png" width="170">' +
			'<img src="http://i.imgur.com/lMqGTh2.gif" width="200">' +
			'<img src="http://i.imgur.com/B1T2oZ2.jpg" width="150" height="170"><br />' +
			'<b>Ace:</b> Eevee<br />' +
			'I will not evolve.</center>'
		);
	},

	sayshi: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/jgilGmU.gif" width="130">' +
			'<img src="http://i.imgur.com/5a5ag8l.gif" width="300">' +
			'<img src="http://i.imgur.com/4Nvwiuc.gif" width="120"><br />' +
			'<b>Ace:</b> Galvantula<br />' +
			'Lead us not into Hell. Just tell us where it is, we\'ll find it quite easily.</center>'
		);
	},

	falls: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://38.media.tumblr.com/e6327810e958a61388d1ff544cf66742/tumblr_n7lpsrvnQc1rt1sw0o1_400.gif" width="190">' +
			'<img src="http://i.imgur.com/jEDyYDV.gif">' +
			'<img src="http://i.imgur.com/RQyArHI.png" width="150"><br />' +
			'<b>Ace:</b> Raikou<br />' +
			'First thing\'s first, I\'m the realest.</center>'
		);
	},

	logicaldomination: 'crowt',
	pan: 'crowt',
	panpawn: 'crowt',
	crowt: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><div class="infobox"><img src="http://i.imgur.com/BYTR6Fj.gif"  width="80" height="80" align="left">' +
			'<img src="http://i.imgur.com/czMd1X5.gif" border="6" align="center">' +
			'<img src="http://50.62.73.114:8000/avatars/crowt.png" align="right"><br clear="all" /></div>' +
			'<blink><font color="red">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</font></blink><br />' +
			'<div class="infobox"><b><font color="#4F86F7" size="3">Ace:</font></b> <font color="blue" size="3">G</font><font color="black" size="3">r</font><font color="blue" size="3">e</font><font color="black" size="3">n</font><font color="blue" size="3">i</font><font color="black" size="3">n</font><font color="blue" size="3">j</font><font color="black" size="3">a</font><br />' +
			'<font color="black">"It takes a great deal of <b>bravery</b> to <b>stand up to</b> our <b>enemies</b>, but just as much to stand up to our <b>friends</b>." - Dumbledore</font></center></div>'
		);
	},

	tael: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/sFNNKmw.gif" width="100">' +
			'<img src="http://i.imgur.com/VEXXmGI.gif" width="200">' +
			'<img src="http://i.imgur.com/jc9lM8G.gif" width="100"><br />' +
			'<img src="http://i.imgur.com/quaTcsq.gif"><br />' +
			'<img src="http://i.imgur.com/yla7jyY.gif"></center>'
		);
	},

	ticken: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/B0gfhrg.png" width="144" height="100">' +
			'<img src="http://i.imgur.com/kyrJhIC.gif?1?8517" width="280">' +
			'<img src="http://25.media.tumblr.com/b4f01fca213952c519a54358e651992f/tumblr_mibltiuCaA1rtatqpo1_500.gif" width="120"><br />' +
			'<b>Ace:</b> Lotad<br />' +
			'Lost time is never found again...</center>'
		);
	},

	cnorth: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/scrafty.gif">' +
			'<img src="http://i.imgur.com/MhZBJDV.png">' +
			'<img src="http://i.imgur.com/QF55Hcl.gif?1 width=150"><br />' +
			'<b>Ace:</b> Scrafty<br />' +
			'<a href="http://replay.pokemonshowdown.com/frost-oumonotype-29810">FUCKING HITMONLEE.</a></center>'
		);
	},

	spec: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://livedoor.blogimg.jp/pokelog2ch/imgs/4/6/46668e86.png" width="300" height="200"><br />' +
			'<img src="http://i.imgur.com/Y88oEBG.gif"><br />' +
			'<b>Ace:</b> FlameBird<br />' +
			'Faith is the bird that feels the light when the dawn is still dark.</center>'
		);
	},

	primm: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/SLsamNo.png?1">' +
			'<img src="http://i.imgur.com/ziTxZ58.gif">' +
			'<img src="http://i.imgur.com/356yMIq.gif" width="150" height="150"><br />' +
			'<b>Ace:</b> Volcarona<br />' +
			'Chicken?! Where?!</center>'
		);
	},

	slim: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/Y8u3RAN.png"><br />' +
			'<b>Ace:</b> Scolipede<br />' +
			'Why be a King When you can be a God.</center>'
		);
	},

	mac: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/1jVxQY2.png" width="140">' +
			'<img src="http://i.imgur.com/LLFGr9y.png">' +
			'<img src="http://i.imgur.com/7vTltT9.png" width="140"><br />' +
			'<b>Ace:</b> <font color="green">Kecleon</font><br />' +
			'<font color=#ff0000">Y</font><font color=#ff2100">o</font><font color=#ff4200">u</font><font color=#ff6300">\'</font><font color=#ff8500">l</font><font color=#ffa600">l</font> ' +
			'<font color=#ffe800">N</font><font color=#f3ff00">e</font><font color=#d2ff00">v</font><font color=#b1ff00">e</font><font color=#90ff00">r</font> ' +
			'<font color=#4dff00">F</font><font color=#2cff00">i</font><font color=#0bff00">n</font><font color=#00ff16">d</font> ' +
			'<font color=#00ff58">A</font><font color=#00ff79">n</font><font color=#00ff9b">y</font><font color=#00ffbc">o</font><font color=#00ffdd">n</font><font color=#00feff">e</font> ' +
			'<font color=#00bcff">M</font><font color=#009bff">o</font><font color=#0079ff">r</font><font color=#0058ff">e</font> ' +
			'<font color=#0016ff">F</font><font color=#0b00ff">a</font><font color=#2c00ff">b</font><font color=#4d00ff">u</font><font color=#6e00ff">l</font><font color=#9000ff">o</font><font color=#b100ff">u</font><font color=#d200ff">s</font> ' +
			'<font color=#ff00e8">T</font><font color=#ff00c7">h</font><font color=#ff00a6">a</font><font color=#ff0085">n</font> ' +
			'<font color=#ff0042">M</font><font color=#ff0021">e</font></center>'
		);
	},

	princesshigh: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://31.media.tumblr.com/tumblr_ltuo9yFLI81r5wm28o1_250.gif">' +
			'<img src="http://i.imgur.com/0xsg2uK.gif" width="370">' +
			'<img src="http://31.media.tumblr.com/tumblr_ltuo9yFLI81r5wm28o1_250.gif" ><br />' +
			'<b>Ace:</b> <font color=#d63265><blink>Gardevior</blink></font><br />' +
			'<b><font color=#ff0000">L</font><font color=#ff2300">i</font><font color=#ff4700">v</font><font color=#ff6a00">e</font>' +
			'<font color=#ff8e00"> </font><font color=#ffb100">f</font><font color=#ffb100">a</font><font color=#ffd500">s</font>' +
			'<font color=#ffd500">t</font><font color=#bdff00">,</font><font color=#9aff00"> </font><font color=#76ff00">D</font>' +
			'<font color=#53ff00">i</font><font color=#2fff00">e</font><font color=#0bff00"> </font><font color=#00ff17">y</font>' +
			'<font color=#00ff3b">o</font><font color=#00ff5e">u</font><font color=#00ff82">n</font><font color=#00ffa6">g</font>' +
			'<font color=#00ffc9">,</font><font color=#00ffed"> </font><font color=#00edff">b</font><font color=#00c9ff">a</font>' +
			'<font color=#00a6ff">d</font><font color=#0082ff"> </font><font color=#005eff">g</font><font color=#003bff">i</font>' +
			'<font color=#0017ff">r</font><font color=#0b00ff">l</font><font color=#2f00ff">s</font><font color=#5300ff"> </font>' +
			'<font color=#7600ff">d</font><font color=#9a00ff">o</font><font color=#bd00ff"> </font><font color=#e100ff">i</font>' +
			'<font color=#ff00f9">t</font><font color=#ff00d5"> </font><font color=#ff00b1">w</font><font color=#ff008e">e</font>' +
			'<font color=#ff006a">l</font><font color=#ff0047">l</font><font color=#ff0023">.</font></b></center>'
		);
	},

	silverkill: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=150 src="http://fc00.deviantart.net/fs70/f/2013/320/9/3/mega_scizor_by_silentgpanda-d6ujsmg.jpg">' +
			'<img src="http://frostserver.no-ip.org:8000/images/silverkill-tc.png">' +
			'<img height=150 src="https://1-media-cdn.foolz.us/ffuuka/board/vp/image/1367/35/1367354021540.jpg"><br />' +
			'<b>Ace: </b>Mo\' Fuckin\' Common Sense!<br />' +
			'<b>Quote: </b>Would you like some fresh cut nanis? No? Well your mom bought some. She LOVED it ;D</center>'
		);
	},

	autumn: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/qeUBqDy.jpg">' +
			'<img src="http://i.imgur.com/0Pjp4AP.gif width="380">' +
			'<img src="http://i.imgur.com/NC2Mspy.jpg"><br />' +
			'<b>Ace:</b> Smeargle<br />' +
			'Painting you up and making you fall get it cause Autumn...</center>'
		);
	},

	ncrypt: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=110 src="http://i.imgur.com/rdSrtBA.png">' +
			'<img src="http://i.imgur.com/74K5o1L.gif">' +
			'<img src="http://i.imgur.com/VFeaIXd.gif"><br />' +
			'<blink><b><font color=red>Ace: </font>Terrakion</b></blink><br />' +
			'<b>Fighting is my passion and the only thing I trust is strength!</b></center>'
		);
	},

	donald: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQpaW7cxyFCEUxPkYHxnkZWXqE-AEHvZfMhxU-QdPfcghuAF69Gg" width="144" height="146">' +
			'<img src="http://i.imgur.com/EBq4NMP.png">' +
			'<img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR7aKN8bYWVMCGRNZQJNr5gMqG71aXzzfdPcJONfwFVvcjKyxYzRA" width="147" height="140"><br />' +
			'<b>Ace:</b> Bulk<br />' +
			'If it moves, I kill it.</center>'
		);
	},

	messiah: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/y08yCwd.png" width="120" height="136">' +
			'<img src="http://i.imgur.com/xA1Dqgw.png">' +
			'<img src="http://i.imgur.com/ha756pn.png" width="120" height="136"><br />' +
			'<b>Ace:</b> Kabutops<br />' +
			'Sit back, relax, and let the undertow drown out your worries forever...</center>'
		);
	},

	demon: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/pinsir.gif">' +
			'<img src="http://i.imgur.com/66NKKkD.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/pinsir-mega.gif"><br />' +
			'<b>Ace:</b> Pinsir<br />' +
			'In order to succeed, your desire to succeed must be greater than your fear of failure.</center>'
		);
	},

	rors: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i979.photobucket.com/albums/ae277/bjoyea/T-cardButchery_zps8f48bc75.gif" width="140" height="120">' +
			'<img src="http://i.imgur.com/VhjJEp0.png" width="260">' +
			'<img src="http://stream1.gifsoup.com/view4/1069409/rorschach-o.gif" width="160" hiehgt="120"><br />' +
			'<b>Ace:</b> Your Mom<br />' +
			'Sorry But Losing Isn\'t Really My Thing.</center>'
		);
	},

	akkie: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/17XVxNt.png" height="160" width="180">' +
			'<img src="http://i.imgur.com/5AKQ0L3.gif">' +
			'<img src="http://i.imgur.com/PgXqSU1.png" height="190" width="170""><br />' +
			'<b>Ace:</b> Umbreon<br />' +
			'Are you prepared to face the infamous dream team knows as the team team?</center>'
		);
	},

	scorpion: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/plIiPCv.jpg?1" width="160" height="130">' +
			'<img src="http://i.imgur.com/TS0fQ70.png" width="230">' +
			'<img src="http://i.imgur.com/NxEA6yl.jpg?1" height="130" width="150"><br />' +
			'<b>Ace:</b> Moltres<br />' +
			'If you can\'t handle the heat gtfo.</center>'
		);
	},

	tailz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/Ijfoz4n.png?1" width="180">' +
			'<img src="http://i.imgur.com/UQJceOG.png">' +
			'<img src="http://i.imgur.com/uv1baKZ.png?1" width="180"><br />' +
			'<b>Ace:</b> Failz<br />' +
			'I\'m Pretty Shit.</center>'
		);
	},

	orihime: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/zKKoyFJ.gif" width="150">' +
			'<img src="http://i.imgur.com/oV29Ffb.png">' +
			'<img src="http://i.imgur.com/PLhgZxL.gif" width="125" height="125"><br />' +
			'<b>Ace:</b> Leek Spin<br />' +
			'Sadistic? I don\'t mind you calling me that.</center>'
		);
	},

	kammi: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/fJvcdib.png" height="125" width="76" />' +
			'<img src="http://i.imgur.com/WhZ1aKc.gif" />' +
			'<img src="http://i.imgur.com/NUyIu76.png?1" height="125" width="76" /><br /><br />' +
			'<b>Ace: </b>Stupidity.<br />' +
			'<b>Quote: </b>What.</center></div>'
		);
	},

	giegue: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/IKVXSTv.png"> '+
			'<img src="http://i.imgur.com/YjVNB4q.png">' +
			'<img src="http://i.imgur.com/ppZSj34.png" height="150"><br />' +
			'<b>Ace: </b>Malamar<br />' +
			'Zubats, Zubats everywhere!!!</center>'
		);
	},

	ssjoku: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/M9wnVcP.gif">' +
			'<img src="http://i.imgur.com/2jkjcvx.png">' +
			'<img src="http://i.imgur.com/zCuD2IQ.gif" height="150"><br />' +
			'<b>Ace: </b>Mega-Venusaur-Power Whip Yo Gurl<br />' +
			'<b>Quote: </b>I am Super Swaggy Coolio!!!</center>'
		);
	},

	caster: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=180 width=200 src="http://31.media.tumblr.com/717db8c2843b1b007c25c5fc6e1f3537/tumblr_mreje8lECf1s3kgaso5_500.gif">' +
			'<img src="http://i.imgur.com/S6BRoI7.png">' +
			'<img height=180 width=200 src="http://1.bp.blogspot.com/-Huv46xIgEH4/UWwP8pGG3cI/AAAAAAAANUU/XqZhML6bvLk/s1600/tumblr_m3pxpkBCSP1rv6iido2_500.gif"><br />' +
			'<b>Ace:</b> Terrakion<br />' +
			'It doesn\'t matter how far away a leader is from his group, a leader will always be a leader.</center>'
		);
	},

	archer: 'archerclw',
	archerclw: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/0LstYf5.jpg" width="120">' +
			'<img src="http://i.imgur.com/xOefMyM.png" width="300">' +
			'<img src="http://i.imgur.com/JTA2HuM.gif" width="120"><br />' +
			'<b>Ace:</b> Hippowdon (Big Momma)<br />' +
			'The South Shall Rise Again!</center>'
		);
	},

	flare: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://pldh.net/media/pokemon/gen6/xy-animated-shiny/282-mega.gif">' +
			'<img src="http://i.imgur.com/dTxMRgu.gif">' +
			'<img src="http://blog-imgs-66.fc2.com/s/o/l/solo002/2charizard-megax.gif"><br />' +
			'<b>Ace:</b><font color="blue"> Mega Gardevior/Mega Charizard X</font><br />' +
			'You\'ve got enemies? Good.That means you actually stood up for something in your life.</center>'
		);
	},

	klutzymanaphy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/manaphy.gif">' +
			'<img src="http://i.imgur.com/m2PAZco.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/mew.gif"><br />' +
			'<b>Ace:</b> Mew and Manaphy<br />' +
			'It\'s more important to master the cards you\'re holding than complaining about the ones your opponent was dealt. pls.</center>'
		);
	},

	unknownsremnant: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i701.photobucket.com/albums/ww16/jacoby746/Kingdom%20Hearts%20Sprites/roxas2.gif" height="150">' +
			'<img src="http://i926.photobucket.com/albums/ad103/reddas97/previewphp_zps559297e6.jpg" width="450">' +
			'<img src="http://i701.photobucket.com/albums/ww16/jacoby746/Kingdom%20Hearts%20Sprites/Demyx2.gif" height="150"><br />' +
			'<b>Ace: </b>The Darkness <br />' +
			'A person is very strong when he seeks to protect something. I\'ll expect a good fight.'
		);
	},

	mattz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/8Wq1oDL.gif" width="100" height="100">' +
			'<img src="http://i.imgur.com/Tu1kJ2C.gif" width="350" height="80">' +
			'<img src="http://i.imgur.com/sYoY67U.gif" width="100" height="100"><br />' +
			'<b>Ace:</b> The Whole Swarm...Run!<br />' +
			'Fight me? Go to sleep and dont let the bedbugs bite, kid...or burn you to a crisp.</center>'
		);
	},

	zarif: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(' <center><img src="http://i.imgur.com/lC0aRUH.gif">' +
			'<img src="http://i.imgur.com/EA90SwL.png">' +
			'<img src="http://i.imgur.com/3EIY2d9.png"><br />' +
			'<b> <blink> Ace: </b>Infernape</blink><br />' +
			'Three things are infinite: magikarp\'s power, human stupidity and the fucking amount of zubats in a cave; and I\'m not sure about the universe.'
		);
	},

	cark: 'amglcark',
	amglcark: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://25.media.tumblr.com/5899b0681d32d509995e6d1d9ae5299a/tumblr_mskxhqL9Yc1s035gko1_500.gif" height="120" width="180">' +
			'<img src="http://i.imgur.com/ZGyaxDn.png">' +
			'<img src="https://31.media.tumblr.com/45e356815fc9fbe44d71998555dc36e4/tumblr_mzr89tROK41srpic3o1_500.gif" height="120" width="180"><br />' +
			'<b>Ace: </b>Tsunami<br />' +
			'Life\'s hard.'
		);
	},

	derp: 'derpjr',
	derpjr: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/BTmcOiH.gif" height="150">' +
			'<img src="http://i.imgur.com/K6t01Ra.png">' +
			'<img src="http://i.imgur.com/k3YCEr0.png" height="150"><br />' +
			'<b>Ace: </b>Crobat<br />' +
			'I liek cookies'
		);
	},

	eclipse: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/9jjxo0c.gif" weight="141" height="92">' +
			'<img src="http://i.imgur.com/BQ9mXi1.gif">' +
			'<img src="http://i.imgur.com/9ZjN89N.gif" weigh="151" height="98"><br />' +
			'<b>Ace:</b> Charizard X & Mew<br />' +
			'Having decent skills doesn\'t give you the right to act cocky.</center>'
		);
	},

	handrelief: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/jniR0EF.jpg" height="120">' +
			'<img src="http://i.imgur.com/fWqMdpZ.png">' +
			'<img src="http://i.imgur.com/KCCaxo2.jpg" height="120"><br />' +
			'<b>Ace: </b>Scizor<br />' +
			'<b>Catchphrase: </b>The inner machinations of my mind are an enigma</center>'
		);
	},

	elitefouroshy: 'oshy',
	oshy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=60 src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/oshawott.gif">' +
			'<img width=580 src="http://frostserver.no-ip.org:8000/images/oshy.png">' +
			'<img height=60 src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/oshawott.gif"><br />' +
			'<b>Ace:</b> Fluffy Oshawotts<br />' +
			'As long as your pokemon spirit keeps burning, your pokemon will keep fighting</center>'
		);
	},

	gryph: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=150 src="http://pokebot.everyboty.net/pix/822.gif">' +
			'<b><font color=#c2701e><font size=100><i>Gryph</i></font></font></b>' +
			'<img height=150 src="http://pokebot.everyboty.net/pix/822.gif"><br/>' +
			'<b>Ace:</b> High or Low?<br/>' +
			'We all move to the beat of just one Blastoise</center>'
		);
	},

	piscean: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/spheal.gif">' +
			'<img src="http://i.imgur.com/iR3xhAH.gif">' +
			'<img src="http://th01.deviantart.net/fs70/200H/f/2011/010/a/b/derp_spheal_by_keijimatsu-d36um8a.png" width="110" height="100"><br />' +
			'<b>Ace:</b> Derp<br />' +
			'<b>Catchphrase:</b> What am I supposed to do with this shit?</center>'
		);
	},

	adam: 'adamkillszombies',
	adamkillszombies: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://pldh.net/media/pokemon/conquest/sprite/212.png" height="100">' +
			'<img src="http://frostserver.no-ip.org:8000/images/adamkillszombies.png" height="100">' +
			'<img src="http://pldh.net/media/pokemon/gen2/crystal/212.gif" height="100"><br />' +
			'<b>Ace:</b> Scizor <br />' +
			'My destination is close, but it\'s very far...'
		);
	},

	wiggly: 'wigglytuff',
	wigglytuff: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/D30ksbl.gif" height="80 width=80">' +
			'<img src="http://i.imgur.com/Iqexc1A.gif" width="340" height="80">' +
			'<img src="http://i.imgur.com/8oUvNAt.gif" height="80" width="80"><br />' +
			'<b>Ace:</b> Chatot<br />' +
			'Don\'t shirk work! Run away and pay! Smiles go for miles!</center>'
		);
	},

	aerys: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://imgur.com/BAKX8Wk.jpg" height="100">' +
			'<img src="http://i.imgur.com/2NhfpP2.gif" height="100">' +
			'<img src="http://i.imgur.com/ImtN9kV.jpg" width="180" height="100"><br />' +
			'<b>Ace: </b>Smeargle<br />' +
			'<b>Catchphrase: </b>I\'m not a monster; I\'m just ahead of the curve</center>'
		);
	},

	dbz: 'dragonballsz',
	dragonballsz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/m9gPc4J.gif" width="140" height="100">' +
			'<img src="http://i.imgur.com/rwzs91Z.gif" width="280" height="100">' +
			'<img src="http://i.imgur.com/J4HlhUR.gif" width="140" height="100"><br />' +
			'<font color=red><blink> Ace: Princess Celestia </blink></font><br />' +
			'*sends out ninjask* Gotta go fast.</center>'
		);
	},

	bigblackhoe: 'lenora',
	oprah: 'lenora',
	sass: 'lenora',
	lenora: function (target, room, user) {
		if (!this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Lenora<br />' +
			'Ace: Lenora<br />' +
			'Catchphrase: Sass me and see what happens.<br />' +
			'<img src="http://hydra-images.cursecdn.com/pokemon.gamepedia.com/3/3e/LenoraBWsprite.gif">'
		);
	},

	thefrontierbeast: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.explodingdog.com/drawing/awesome.jpg" height="100">' +
			'<img src="http://i.imgur.com/3eN4nV3.gif" height="100">' +
			'<img src="http://fc09.deviantart.net/fs70/f/2011/089/a/1/hydreigon_the_dark_dragon_poke_by_kingofanime_koa-d3cslir.png" height="100"><br />' +
			'<b>Ace: </b>Hydreigon<br />' +
			'<b>Catchphrase: </b>You wanna hax with me huh WELL YOU DIE<br /></center>'
		);
	},

	elitefourlight: 'light',
	light: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/eetjLuv.png" height="100">' +
			'<img src="http://i.imgur.com/v4h0TvD.png" height="100" width="450">' +
			'<img src="http://i.imgur.com/21NYnjz.gif" height="100"><br />' +
			'<b>Ace: </b>Mega Lucario<br />' +
			'<b>Catchphrase: </b>Choose your battles wisely. After all, life isn\'t measured by how many times you stood up to fight.</center>'
		);
	},

	zezetel: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/wpYk97G.png" height="100" width="130">' +
			'<img src="http://i.imgur.com/ix6LGcX.png"><img src="http://i.imgur.com/WIPr3Jl.jpg" width="130" height="90"><br />' +
			'<b>Ace: </b>Predictions</center><br /><center><b>Catchphrase: </b>' +
			'In matters of style, swim with the current, in matters of principle, stand like a rock.</center>'
		);
	},

	anttya: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://25.media.tumblr.com/tumblr_lljnf6TzP61qd87hlo1_500.gif" width="142" height="82">' +
			'<img src="http://i.imgur.com/E4Ui1ih.gif">' +
			'<img src="http://25.media.tumblr.com/5bbfc020661a1e1eab025d847474cf30/tumblr_mn1uizhc441s2e0ufo1_500.gif" width="142" height="82">' +
			'Ace: Staraptor' +
			'If you want to fly, then you\'ve got to give up the shit that weighs you down.</center>'
		);
	},

	jak: 'darkjak',
	darkjak: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/kyurem-white.gif" width="110">' +
			'<img src="http://i.imgur.com/MO83uFa.png" width="270">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/charizard-megay.gif" width="130"><br />' +
			'<b>Ace:</b> Mega charizard Y and Kyurem White<br />' +
			'Success isn\'t a result of spontaneous combustion. You must set yourself on fire.</center>'
		);
	},

	brittlewind: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/3tCl8az.gif>" height="100"><br />' +
			'<img src="http://i.imgur.com/kxaNPFf.gif" height="100">' +
			'<img src="http://i.imgur.com/qACUYrg.gif" height="100">' +
			'<img src="http://i.imgur.com/0otHf5v.gif" height="100"><br />' +
			'Ace: Mr. Kitty<br />' +
			'Gurl please. I can beat you with mah eyes closed.'
		);
	},

	kaiser: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/aegislash-blade.gif">' +
			'<img src="http://i.imgur.com/7P2ifdc.png?1" width="340">' +
			'<img src="http://i.imgur.com/zWfqzKL.gif" width="125"><br />' +
			'<b>Ace:</b> Gallade<br />' +
			'Challenges are what make life interesting and overcoming them is what makes life meaningful.</center>'
		);
	},

	gemini: 'prfessorgemini',
	prfessorgemini: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/volbeat.gif">' +
			'<img src="http://i.imgur.com/HrHfI4e.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/joltik.gif"><br />' +
			'<b>Ace: </b>Hotaru<br />' +
			'<b>Catchphrase: </b>I am Professor Gemini. The best professor there is because I\'m not named after a f**king tree</center>'
		);
	},

	sagethesausage: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/mc7oWrv.gif" height="100">' +
			'<img src="http://i.imgur.com/vaCeYTQ.gif">' +
			'<img src="http://fc00.deviantart.net/fs23/f/2007/320/d/4/COUNTER_by_petheadclipon_by_wobbuffet.png" height="100"><br />' +
			'<b>Ace: </b>Wobbuffet<br />' +
			'<b>Catchphrase: </b>Woah! Buffet! Wynaut eat when no one is looking?</center>'
		);
	},

	moogle: 'kupo',
	kupo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/RnBPR99.png" height="100"><br />' +
			'<img src="http://oyster.ignimgs.com/wordpress/write.ign.com/74314/2012/01/Moogle.jpg" height="100">' +
			'<img src="http://i.imgur.com/6UawAhH.gif" height="100">' +
			'<img src="http://images2.wikia.nocookie.net/__cb20120910220204/gfaqsff/images/b/bb/Kupo1705.jpg" height="100"><br />' +
			'<b>Ace: </b>Moogle<br />' +
			'<b>Catchphrase: </b>Kupo!<br /></center>'
		);
	},

	creaturephil: 'phil',
	phil: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height="150" src="http://fc01.deviantart.net/fs70/f/2013/167/a/7/pancham_by_haychel-d64z92n.jpg">' +
			'<img src="http://i.imgur.com/3jS3bPY.png">' +
			'<img src="http://i.imgur.com/DKHdhf0.png" height="150"><br />' +
			'<b>Ace: </b>Pancham<br />' +
			'<b>Catchphrase: </b><a href="http://creatureleague.weebly.com">http://creatureleague.weebly.com</a></center>'
		);
	},

	blinx: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://24.media.tumblr.com/6366ef75eb549cc676338027a7004937/tumblr_mk3d8giUNw1qg1v6ho3_250.gif"width="100"height="100">' +
			'<img src="http://i.imgur.com/AHs4FS5.png"width="225">' +
			'<img src="http://fc00.deviantart.net/fs70/f/2013/297/1/7/rwby_nora_valkyrie_gif_by_dustiniz117-d6rmph4.gif"width="150"><br />' +
			'<b>Ace:</b> Black Heart<br />' +
			'We\'ll break his legs together.</center>'
		);
	},

	apples: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc03.deviantart.net/fs71/f/2010/147/a/7/Meowth_VS_Seviper___Infernape_by_KokinhoKokeiro.gif"  width="150">' +
			'<img src="http://i.imgur.com/NvU4TIQ.gif"  width="260">' +
			'<img src="http://i.imgur.com/Z1XOqL9.gif" width="140"><br />' +
			'<b>Ace:</b> Brute Force<br />' +
			'If you stall, I hate you.</center>'
		);
	},

	elitefourbalto: 'balto',
	balto: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height="90" src="http://fc08.deviantart.net/fs71/f/2012/035/e/f/snorlax_by_all0412-d4omc96.jpg">' +
			'<img src="http://i.imgur.com/gcbLD9A.png">' +
			'<img src="http://fc04.deviantart.net/fs71/f/2013/223/3/b/mega_kangaskhan_by_peegeray-d6hnnmk.png" height="100"><br />' +
			'<b>Ace: </b>Snorlax<br />' +
			'<b>Catchphrase: </b>To be a championship player,you need a championship team.</center>'
		);
	},

	championxman: 'xman',
	xman: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados-shiny/victini.gif">' +
			'<img src="http://i.imgur.com/9bKjjcM.gif" width="350">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados-shiny/infernape.gif" width="80"><br />' +
			'<b><font color=black>Ace:</font></b><font color=red> Infernape</font><br />' +
			'<font color=red>Never give up and give it your all. If you give up, you have not lost once but twice.</font></center>'
		);
	},

	piers: 'isawa',
	isawa: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/hwqR2b8.jpg" width="160" height="140">' +
			'<img src="http://i.imgur.com/qZvvpNG.png?1" width="220">' +
			'<img src="http://farm3.static.flickr.com/2755/4122651974_353e4287e8.jpg" width="160" height="130"><br />' +
			'<b>Ace:</b> Piers Nivans<br />' +
			'Rub-a-dub-dub, Isawa be in your tub</center>'
		);
	},

	valisawa: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/fKplh4l.png" width="140">' +
			'<img src="http://i.imgur.com/4PdzHja.png">' +
			'<img src="http://i.imgur.com/LoI6bZv.jpg" width="120"><br />' +
			'<b>Ace:</b> Britannia Lovin\'<br />' +
			'You are the Barney to my Robin and I am the Robin to your Barney. Let\'s sex.</center>'
		);
	},

	pikadagreat: 'pika',
	pika: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://sprites.pokecheck.org/i/025.gif" height="100">' +
			'<img src="http://i.imgur.com/LwD0s9p.gif" height="100">' +
			'<img src="http://media0.giphy.com/media/DCp4s7Z1FizZe/200.gif" height="100"><br />' +
			'<b>Ace:</b> Pikachu<br />' +
			'<b>Catchphrase:</b> Its not a party without Pikachu</center>'
		);
	},

	kidshiftry: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc01.deviantart.net/fs71/f/2011/261/0/c/shiftry_by_rapidashking-d4a9pc4.png" height="100">' +
			'<img src="http://i.imgur.com/HHlDOu0.gif" height="100">' +
			'<img src="http://25.media.tumblr.com/tumblr_m1kzfuWYgE1qd4zl8o1_500.png" height="100"><br />' +
			'<b>Ace:</b> Shiftry<br />' +
			'<b>Catchphrase: </b> Kicking your ass will be my pleasure!</center>'
		);
	},

	pikabluswag: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/hwiX34o.gif">' +
			'<img src="http://i.imgur.com/6v22j6r.gif" height="60" width="310">' +
			'<img src="http://i.imgur.com/QXiZE1a.gif:><br /><br />' +
			'<b>Ace:</b> Azumarill<br />' +
			'The important thing is not how long you live. It\'s what you accomplish with your life.</center>'
		);
	},

	scizorknight: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/zwCcimH.gif">' +
			'<img src="http://i.imgur.com/S0o6O52.gif">' +
			'<img src="http://i.imgur.com/zwCcimH.gif"><br />' +
			'<b><font color="black">Ace:</font></b> <font color="red">A</font><font color="black">l</font><font color="red">l</font> <font color="black">O</font><font color="red">f</font> <font color="black">O</font><font color="red">u</font><br />' +
			'<b>~<font color=red>O</font><font color=green>n</font><font color=blue>e</font> ' +
			'<font color=green>g</font><font color=purple>o</font><font color=teal>o</font><font color=orange>d</font> ' +
			'<font color=red>t</font><font color=aqua>h</font><font color=blue>i</font><font color=green>n</font><font color=purple>g</font> ' +
			'<font color=orange>a</font><font color=red>b</font><font color=aqua>o</font><font color=blue>u</font><font color=red>t</font> ' +
			'<font color=teal>m</font><font color=orange>u</font><font color=red>s</font><font color=aqua>i</font><font color=blue>c</font><font color=green>,</font> ' +
			'<font color=purple>w</font><font color=orange>h</font><font color=teal>e</font><font color=orange>n</font> ' +
			'<font color=aqua>i</font><font color=blue>t</font> ' +
			'<font color=red>h</font><font color=blue>i</font><font color=violet>t</font><font color=teal>s</font> ' +
			'<font color=red>y</font><font color=aqua>o</font><font color=>u</font><font color=purple>,</font> ' +
			'<font color=green>y</font><font color=purple>o</font><font color=teal>u</font> ' +
			'<font color=red>f</font><font color=aqua>e</font><font color=red>e</font><font color=green>l</font> ' +
			'<font color=teal>n</font><font color=orange>o</font> ' +
			'<font color=red>p</font><font color=green>a</font><font color=black>i</font><font color=aqua>n</font><font color=lime>.</font><font color=black>~</font></b></center>'
		);
	},

	jitlittle: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://24.media.tumblr.com/8183478ad03360a7c1d02650c53b4b35/tumblr_msfcxcMyuV1qdk3r4o1_500.gif" height="100" width="140">' +
			'<img src="http://i.imgur.com/Vxjzq2x.gif" height="85" width="250">' +
			'<img src="http://25.media.tumblr.com/b2af3f147263f1ef10252a31f0796184/tumblr_mkvyqqnhh51snwqgwo1_500.gif" height="100" width="140"><br />' +
			'<b>Ace:</b> Jirachi<br />' +
			'<b>Cuteness will always prevail over darkness</b></center>'
		);
	},

	professoralice: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/absol-2.gif">' +
			'<img src="http://i.imgur.com/9I7FGYi.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/victini.gif"><br />' +
			'<b>Ace: </b>Absol<br />' +
			'<b>Quote: </b>If the egg is broken by outside force, life ends. If the egg is broken from inside force, life begins. Great things always begin on the inside.</center>'
		);
	},

	bibliaskael: 'kael',
	kael: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i1141.photobucket.com/albums/n587/diebenacht/Persona/Arena%20gif/yukiko_hair_flip_final_50_80.gif">' +
			'<img src="http://i1141.photobucket.com/albums/n587/diebenacht/teaddy_final_trans-1.gif" height="180">' +
			'<img src="http://i1141.photobucket.com/albums/n587/diebenacht/Persona/Arena%20gif/naoto_left_final_50_80.gif"><br />' +
			'<b>Ace:</b> Latios' +
			'<b>Catchphrase:</b> My tofu...</center>'
		);
	},

	runzy: 'championrunzy',
	championrunzy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/BSqLNeB.gif">' +
			'<font size="6" color="#FA5882"><i>Champion Runzy</i>' +
			'<img src="http://i.imgur.com/itnjFmx.gif"></font></color><br />' +
			'Ace: Whimsicott<br>Want some Leech Seed?</center>'
		);
	},

	glisteringaeon: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>Trainer: Glistering Aeon<br />' +
			'Ace: Really? Duh.<br />' +
			'Catchphrase: Grab your sombreros and glow sticks and lets rave!<br />' +
			'<img height="150" src="http://www.animeyume.com/ludicolo.jpg"></center>'
		);
	},

	wickedweavile: 'champwickedweavile',
	champwickedweavile: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: ChampWickedWeavile<br />' +
			'Ace: Scyther<br />' +
			'Catchphrase: I suck at this game.<br />' +
			'<img src="http://play.pokemonshowdown.com/sprites/trainers/80.png">'
		);
	},

	championdarkrai: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://pokecharms.com/data/trainercardmaker/characters/custom/Cosplayers/p491-1.png">' +
			'<img src="http://imgur.com/JmqGNKI.gif">' +
			'<img src="http://pokecharms.com/data/trainercardmaker/characters/custom/Cosplayers/p491.png"><br />' +
			'<b>Ace:</b> Darkrai<br />' +
			'<b>Catchphrase:</b> I got so many ghost hoes I lost count</center>'
		);
	},

	priest: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/pHVCLC5.png" width="140" height="100">' +
			'<img src="http://i.imgur.com/BkVihDY.png">' +
			'<img src="http://i.imgur.com/f39NE2W.gif"><br />' +
			'<font color="red"><blink>Ace: Heatran</blink></font><br />' +
			'Are you ready to face holyness itself? Will you open the door to my temple? Let your chakras make the decision for you.</center>'
		);
	},

	smooth: 'smoothmoves',
	smoothmoves: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/E019Jgg.png">' +
			'<img src="http://i.imgur.com/6vNVvk3.png">' +
			'<img src="http://i.imgur.com/aOzSZr8.jpg"><br />' +
			'<b>Ace: <font color="#FE2E2E"><blink>My Banana Hammer</blink></font><br />' +
			'<b><font color="#D7DF01">My potassium level is over 9000000000!!!!!!!!</center></font>'
		);
	},

	trainerbofish: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Trainer Bofish<br />' +
			'Ace: Electivire<br />' +
			'Catchphrase: I love to shock you.<br />' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/466.gif"></center>'
		);
	},

	snooki: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/1U1MFAg.png">' +
			'<img src="http://i.imgur.com/R9asfxu.gif">' +
			'<img src="http://i.imgur.com/vqxQ6zq.png">' +
			'<font color="red"><blink>Ace: Jynx</blink></font><br />' +
			'I came in like a wrecking ball</center>'
		);
	},

	teafany: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/lwL5Pce.png">' +
			'<img src="http://i.imgur.com/D9M6VGi.gif">' +
			'<img src="http://i.imgur.com/hZ0mB0U.png"><br />' +
			'<b>Ace: <font color="#58ACFA"><blink>Ace: Farfetch\'d</blink></font><br />' +
			'<b><font color="#00BFFF">Where can I find a leek in Pokemon Y?</font></b></center>'
		);
	},

	maskun: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/HCH2b.gif" width="167">' +
			'<img src="http://i.imgur.com/mB1nFy7.gif" width="285">' +
			'<img src="http://i.imgur.com/COZvOnD.gif"><br />' +
			'<b>Ace:</b> Stall<br />' +
			'I\'m sorry friend but stall is all part of the game.</center>'
		);
	},

	kiirochu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://th04.deviantart.net/fs70/PRE/i/2013/196/7/3/one_piece_chopper_png_by_bloomsama-d6dkl5d.png" width="80" height="100">' +
			'<img src="http://i.imgur.com/6E4jm4o.gif">' +
			'<img src="http://i.imgur.com/uezK5X4.gif"><br />' +
			'<b>Ace:</b> Fanciness<br />' +
			'Scuse me, I can\'t seem to find my dick. Mind if I look in your mother\'s mouth?</center>'
		);
	},

	brittany: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/castform-sunny.gif">' +
			'<img src="http://i.imgur.com/natglfA.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/cherrim-sunshine.gif"><br />' +
			'<b>Ace:</b> Cherrim&lt;3<br />' +
			'l-lewd.</center>'
		);
	},

	donut: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/excadrill.gif">' +
			'<img src="http://i.imgur.com/aYamsDZ.png?1">' +
			'<img src="http://www.dailyfork.com/Donut.gif" width="120" height="120"><br />' +
			'<b>Ace:</b> Excadrill<br />' +
			'A true champion is someone who gets up, even when he can\'t.</center>'
		);
	},

	video: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/victini.gif">' +
			'<img src="http://i.imgur.com/JL7MokA.png">' +
			'<img src="http://i.imgur.com/Q9XU12a.gif"><br />' +
			'<b>Ace:</b> Victini<br />' +
			'The only way you can learn is from failure to achieve success.</center>'
		);
	},

	notorangejuice: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/2WNeV9p.gif">' +
			'<img src="http://i.imgur.com/ghwiaaV.gif">' +
			'<img src="http://i.imgur.com/Vi2j2OG.gif"><br /><br />' +
			'<b>"Banana Bread."</b><br />' +
			'<b>www.youtube.com/notorangejuice</b></center>'
		);
	},

	soggey: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/w9po1tP.gif?1">' +
			'<img src="http://i.imgur.com/N48X8Vf.png">' +
			'<img src="http://i.imgur.com/YTl10Yi.png"><br />' +
			'<b>Ace: </b>Sandslash<br />' +
			'<b>Quote: </b>It was all fun and games... but then you had to hax me >:(</center>'
		);
	},

	miller: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/cc5BTsj.gif" height="110" width="260">' +
			'<img src="http://25.media.tumblr.com/tumblr_m456ambdnz1qd87hlo1_500.gif" height="150" width="220"><br />' +
			'<b>Ace: </b>Wobbuffet<br />' +
			'<b>Catchphrase: </b>I\'ll get the job done.</center>'
		);
	},

	belle: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/garchomp.gif">' +
			'<img src="http://i.imgur.com/SAhOexv.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados-shiny/aegislash-blade.gif"> <br />' +
			'<b>Ace: </b>Garchomp<br />' +
			'Did you set it to wumbo?</center>'
		);
	},

	mav: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/m6NrTvP.png" width="100" height="100">' +
			'<img src="http://i.imgur.com/VlEM9Vb.gif" width="240" height="100"><right>' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/zapdos.gif"><br />' +
			'<img src="http://pkparaiso.com/imagenes/xy/sprites/animados/ampharos-mega.gif"><br />' +
			'<center><blink><font color="#FF0000"><br><b>Ace: </b>Ampharos <br />' +
			'<b>Quote: </b>A low possibility means it\'s not zero.</center>'
		);
	},

	vlahd: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.quickmeme.com/img/59/59735e50728008fe7477f8292ec025aafb7c38ab86c39d1a4f198c3379c92669.jpg" Width="100" Height="75">' +
			'<img src="http://i.imgur.com/TAU7XiN.gif" Width="350">' +
			'<img src="http://24.media.tumblr.com/dae120759bc68c85e828d3ee631b9c3e/tumblr_mpstfxXqhg1s5utbmo1_500.gif" Width="100" Height="75"><br />' +
			'<b>Most Badass Pokemon Alive:</b> Froslass<br />' +
			'<font color=Blue><b>I want to be there when Karma butt-fucks you with a cactus.</b></font></center>'
		);
	},

	egyptian: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc09.deviantart.net/fs70/f/2011/358/e/5/cobalion_the_just_musketeer_by_xous54-d4k42lh.png" height="100" width="100">' +
			'<img src="http://fc01.deviantart.net/fs71/f/2014/038/7/4/6vnvvk3_by_yousefnafiseh-d75gny6.png">' +
			'<img src="http://i.imgur.com/aRmqB2R.png" height="100" width="100" ><br />' +
			'<b>Ace: </b><font color="#FE2E2E"><blink>Yanmega</blink></font><br />' +
			'<b><font color="#D7DF01">Never give up , There\'s still Hope</b></font>'
		);
	},

	dolph: 'amgldolph',
	amgldolph: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/bidoof.gif">' +
			'<img src="http://i.imgur.com/zUj8TpH.gif" width="350">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/magikarp-2.gif" width="175"><br />' +
			'<b>Ace: </b>Bidoofs and Magikarps<br />' +
			'<b>Catchphrase: </b>Shit My Biscuits Are Burning!</center>'
		);
	},

	failatbattling: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://img.pokemondb.net/sprites/black-white/anim/normal/jirachi.gif">' +
			'<img src="http://i.imgur.com/ynkJkpH.gif" width="300" >' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/sigilyph.gif"><br />' +
			'<b>Ace: Anything that gets haxed</b><br />' +
			'<b>Catchphrase: The name says it all.</b></center>'
		);
	},

	darknessreigns: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src"=http://i.imgur.com/GCIT4Cv.gif" height="90" width="500">' +
			'<img src="http://th05.deviantart.net/fs70/PRE/i/2013/220/5/a/pokemon___megalucario_by_sa_dui-d6h8tdh.jpg" height="80" width="120">' +
			'<img src="http://th08.deviantart.net/fs70/PRE/f/2010/169/c/5/Gengar_Wallpaper_by_Phase_One.jpg" height="80" width="120"><br />' +
			'<b>Ace: </b>The Darkness' +
			'<b>Catchphrase: </b>When the night falls, The Darkness Reigns</center>'
		);
	},

	naten: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/uxie.gif">' +
			'<img src="http://i254.photobucket.com/albums/hh108/naten2006/cooltext1400784365_zps7b67e8c9.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/mew.gif"><br />' +
			'Ace: Uxie, Our Lord and Saviour<br />' +
			'<font color="purple">The moment you\'ve stopped planning ahead is the moment you\'ve given up.</font></center>'
		);
	},

	bossbitch: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/kUSfLgd.jpg" width="100" height="100">' +
			'<img src="http://i.imgur.com/UCxedBg.gif" width="350" height="80">' +
			'<img src="http://i.imgur.com/I7eayeo.jpg" width="100" height="100"><br />' +
			'<b>Ace:</b> Cinccino<br />' +
			'<b>Quote: Don\'t bet me or you will weep later</b></center>'
		);
	},

	barida: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/honchkrow.gif" width="150">' +
			'<img src="http://i.imgur.com/0bkdErK.png" width="280">' +
			'<img src="http://31.media.tumblr.com/tumblr_lybvxn6UYi1qgj2rto1_1280.png?.jpg" width="110"><br />' +
			'<b>Ace:</b> Pimp Lord Honchkrow<br />' +
			'Life is about challenges, Theres no point in living if there\'s no one strong to play. Its better if i cant win..</center>'
		);
	},

	epin: 'epinicion',
	epinicion: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/crustle.gif">' +
			'<img src="http://i.imgur.com/5aLcrWN.png">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/mew.gif"><br />' +
			'<b>Ace: </b>Crustle<br />' +
			'<b>Quote: </b>Si Vis Pacem, Para Bellum</center>'
		);
	},

	badass: 'thatonebadass',
	thatonebadass: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=150 src=http://i.imgur.com/SsxwslQ.gif>' +
			'<img src=http://i.imgur.com/rvUDGg2.gif>' +
			'<img height=150 src=http://www.pkparaiso.com/imagenes/xy/sprites/animados/greninja-4.gif><br />' +
			'<b>Ace:</b> My Hands<br />' +
			'<b>Catchphrase: </b>I\'m bout to get #WristDeep</center>'
		);
	},

	kanghirule : 'kanghiman',
	kanghiman: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://fc07.deviantart.net/fs23/f/2007/350/e/c/Kyubi_Naruto__Ransengan_by_madrox123.gif">' +
			'<img src="http://i.imgur.com/QkBsIz5.gif">' +
			'<img src="http://static4.wikia.nocookie.net/__cb20120628005905/pokemon/images/4/40/Kangaskhan_BW.gif"><br />' +
			'<b>Ace</b>: Kangaskhan<br />' +
			'<b>Catchphrase:</b> Got milk?</center>'
		);
	},

	gamercat: 'rivalgamercat',
	rivalgamercat: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://pkparaiso.com/imagenes/xy/sprites/animados/lickilicky.gif">' +
			'<img src="http://i.imgur.com/K8qyXPj.gif" width="350" height="70">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/chandelure.gif"><br />' +
			'<b>Ace: </b>Lickilicky<br />' +
			'<b>Catchphrase: </b>Come in we\'ll do this fast ;)</center>'
		);
	},

	elite4synth: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Elite4^Synth<br />' +
			'Ace: Crobat<br />' +
			'Catchphrase: Only pussies get poisoned.<br />' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/169.gif">'
		);
	},

	elite4quality: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Elite4^Quality<br />' +
			'Ace: Dragonite<br />' +
			'Catchphrase: You wanna fly, you got to give up the shit that weighs you down.<br />' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/149.gif">'
		);
	},

	quality: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/3pAo1EN.png">' +
			'<img src="http://i.imgur.com/sLnYpa8.gif">' +
			'<img src="http://i.imgur.com/tdNg5lE.png"><br />' +
			'Ace: Pikachu<br />' +
			'I\'m Quality, you\'re not.</center>'
		);
	},

	hotfuzzball: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/rk5tZji.png"><br />' +
			'<img src="http://i.imgur.com/pBBrxgo.gif"><br />' +
			'<font color="red"><blink><b>Ace: Clamperl</blink></font><br />' +
			'<b>How do you like me now, (insert naughty word)!</b></center>'
		);
	},

	elitefoursalty: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Elite Four Salty<br />' +
			'Ace: Keldeo<br />' +
			'Catchphrase: I will wash away your sin.<br />' +
			'<img src="http://images3.wikia.nocookie.net/__cb20120629095010/pokemon/images/9/98/BrycenBWsprite.gif">'
		);
	},

	jiraqua: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Jiraqua<br />' +
			'Ace: Jirachi<br />' +
			'Catchphrase: Go Jirachi!<br />' +
			'<img src="http://cdn.bulbagarden.net/upload/4/48/Spr_B2W2_Rich_Boy.png">'
		);
	},

	richguy: 'gymldrrichguy',
	gymldrrhichguy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Gym Ldr RhichGuy<br />' +
			'Ace: Thundurus-T<br />' +
			'Catchphrase: Prepare to discover the true power of the thunder!<br />' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/642-therian.gif">'
		);
	},

	murana: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Murana<br />' +
			'Ace: Espeon<br />' +
			'Catchphrase: Clutching victory from the jaws of defeat.<br />' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/196.gif">'
		);
	},

	ifazeoptical: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: ♫iFaZeOpTiCal♫<br />' +
			'Ace: Latios<br />' +
			'Catchphrase: Its All Shits And Giggles Until Someone Giggles And Shits.<br />' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/381.gif">'
		);
	},

	superjeenius: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/vemKgq4.png"><br />' +
			'<img src="http://i.imgur.com/7SmpvXY.gif"><br />' +
			'Ace: Honchkrow<br />' +
			'Cya later mashed potato.</center>'
		);
	},

	electricapples: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/jolteon.gif">' +
			'<img src="http://i.imgur.com/usL5WQx.png">' +
			'<img src="http://i.imgur.com/dCZ6E7k.jpg" width="130"><br />' +
			'<b>Ace: </a> Jolteon<br />' +
			'Let\'s play a little game, it\'s called Apples to Apples!'
		);
	},

	nochansey: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: NoChansey<br />' +
			'Ace: Miltank<br />' +
			'Catchphrase: Moo, moo muthafuckas.<br />' +
			'<img src="http://media.pldh.net/pokemon/gen5/blackwhite_animated_front/241.gif">'
		);
	},

	championtinkler: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/ymI1Ncv.png"><br />' +
			'<img src="http://i.imgur.com/ytgnp0k.gif"><br />' +
			'<font color="red"><blink><b>Ace: Volcarona</blink></font><br />' +
			'<b>Aye there be a storm comin\' laddie</b></center>'
		);
	},

	killerjays: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<center><img src="http://i.imgur.com/hcfggvP.png" height="150">' +
			'<img src="http://i.imgur.com/uLoVXAs.gif">' +
			'<img src="http://i.imgur.com/RkpJbD1.png"><br />' +
			'<font size="2"><b>Ace:</b> Articuno</font><br />' +
			'<font size="2"><b>Catchphrase: </b>Birds Sing, Birds Fly, Birds kill people.</font></center>'
		);
	},

	ryuuga: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7ALXaVt.png">' +
			'<img src="http://i.imgur.com/6OFRYal.gif">' +
			'<img src="http://i.imgur.com/gevm8Hh.png"><br />' +
			'Ace: Jirachi<br />' +
			'I\'ve never been cool - and I don\'t care.</center>'
		);
	},

	coolasian: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Cool Asian<br />' +
			'Ace: Politoed<br />' +
			'Catchphrase: I\'m feeling the flow. Prepare for battle!<br />' +
			'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/186.gif">'
		);
	},

	typhozzz: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://th08.deviantart.net/fs70/PRE/i/2011/111/e/5/typhlosion_by_sharkjaw-d3ehtqh.jpg" height="100" width="100">' +
			'<img src="http://i.imgur.com/eDS32pU.gif">' +
			'<img src="http://i.imgur.com/UTfUkBW.png"><br />' +
			'<b>Ace: <font color="red"> Typhlosion</font></b><br />' +
			'There ain\'t a soul or a person or thing that can stop me :]</center>'
		);
	},

	roseybear: 'roserade26',
	roserade: 'roserade26',
	roserade26: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://firechao.com/Images/PokemonGuide/bidoof_sprite.png" width="90" height="90">' +
			'<img src="http://i.imgur.com/f7YIx7s.gif">' +
			'<img src="http://2.images.gametrailers.com/image_root/vid_thumbs/2013/06_jun_2013/gt_massive_thumb_AVGN_640x360_07-01-13.jpg" width="120" height="110"><br />' +
			'<b>Quote: If you win, I hate you</b><br />' +
			'Ace: Roserade</center>'
		);
	},

	spike: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc06.deviantart.net/fs70/f/2014/073/b/6/goomy_by_creepyjellyfish-d7a49ke.gif">' +
			'<img src="http://i.imgur.com/L4M0q0l.gif">' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/aron.gif"><br />' +
			'<b>Ace:</b> Goomy and Aron<br />' +
			'Sometimes the world is tough, but with my Pokemon, its a walk in the park..</center>'
		);
	},

	nine: 'leadernine',
	leadernine: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<center><img src="http://i.imgur.com/9BjQ1Vc.gif"><br />' +
			'<img src="http://i.imgur.com/fTcILVT.gif">' +
			'<img src="http://i.imgur.com/D58V1My.gif">' +
			'<img src="http://i.imgur.com/dqJ08as.gif"><br />' +
			'Ace: Fairies!<br />' +
			'<img src="http://i.imgur.com/hNB4ib0.png"><br />' +
			'<img src="http://i.imgur.com/38evGGC.png"><br />' +
			'<b>-Grimsley</b></center>'
		);
	},

	wyvern: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://media.giphy.com/media/tifCTtoW05XwY/giphy.gif" height="80" width="125">' +
			'<img src="http://i.imgur.com/C7x8Fxe.gif" height="90" width="300">' +
			'<img src="http://brony.cscdn.us/pic/photo/2013/07/e00cb1f5fa33b5be7ad9127e7f7c390d_1024.gif" height="80" width="125"><br />' +
			'<b>Ace:</b> Noivern<br />' +
			'<b>My armor is like tenfold shields, my teeth are swords, my claws spears, the shock of my tail a thunderbolt, my wings a hurricane, and my breath death!</b></center>'
		);
	},

	jordanmooo: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/iy2hGg1.png" height="150" width="90">' +
			'<img src="http://i.imgur.com/0Tz3gUZ.gif">' +
			'<img src="http://fc09.deviantart.net/fs71/f/2010/310/c/9/genosect_by_pokedex_himori-d32apkw.png" height="150" width="90"><br />' +
			'<b>Ace: <font color="purple"><blink>Genesect</blink></font><br />' +
			'<b><font color="green">TIME FOR TUBBY BYE BYE</font></center>'
		);
	},

	alee: 'sweetie',
	sweetie: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7eTzRcI.gif" height="122" width="112">' +
			'<img src="http://i.imgur.com/ouRmuYO.png?1">' +
			'<img src="http://i.imgur.com/4SJ47LZ.gif" height="128" width="100"><br />' +
			'<font color="red"><blink>Ace: Shiny Gardevoir-Mega</blink></font><br />' +
			'<font color="purple">Y yo que estoy ciega por el sol, guiada por la luna.... escapándome. ♪</font></center>'
		);
	},

	jesserawr: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/J6AZqhx.png" width="96" height="96">' +
			'<img src="http://i.imgur.com/3corYWy.png" width="315" height="70">' +
			'<img src="http://i.imgur.com/J6AZqhx.png" width="96" height="96"><br />' +
			'<font color="lightblue"> Ace: Wynaut </font><br />' +
			'Wynaut play with me ?</center>'
		);
	},

	ryoko: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/J8yIzfP.jpg" width="96" height="96">' +
			'<img src="http://i.imgur.com/igi2peI.png" width="315" height="70">' +
			'<img src="http://i150.photobucket.com/albums/s81/HeroDelTiempo/1192080205639.jpg" width="96" height="96"><br />' +
			'<font color="red"> Ace: Bidoof </font><br />' +
			'You done doofed now.</center>'
		);
	},

	meatyman: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/UjmM3HD.png">' +
			'<font size="6" color="#298A08"><i>Meaty_Man</i></font></color>' +
			'<img src="http://i.imgur.com/jdZVUOT.png"><br />' +
			'Ace: Reshiram<br />' +
			'This is not the beginning... this is the end. Follow the Buzzards.</center>'
		);
	},

	jd: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.snag.gy/QWGOz.jpg"><br />' +
			'<font size=3><i><font color=blue><b>JD</b></font></i></font><br />' +
			'<b><blink>Ace: Sexual Tension</blink></b><br />'
		);
	},

	jd2: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img width=100% height=260 src="http://i.imgur.com/6gkSSam.jpg">');
	},

	familyman: 'familymantpsn',
	familymantpsn: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/UHptfOM.gif">' +
			'<img src="http://i.imgur.com/PVu7RGX.png">' +
			'<img src="http://i.imgur.com/XVhKJ77.gif"><br />' +
			'Ace: Audino<br />' +
			'Luck.</center>'
		);
	},

	psyscorschach: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://i.imgur.com/YbY4840.png">' +
			'<img src="http://s15.postimg.org/9mcf6lj4n/screenshot_118.png" width="110">' +
			'<img src="http://i266.photobucket.com/albums/ii265/sony1270/Scorpion.jpg" width="100">' +
			'<img src="http://i.imgur.com/VLDEcVs.png" width="100"><br />' +
			'<center><b>Ace:</b> Gallade, Heliolisk, Landorus<br />' +
			'Scorpion\'s sting would make a bee of a black mambo<br />' +
			'Zen will end your life faster than Chicago, Get 6-0\'d By Rors for thinking that ya macho<br />' +
			'Anybody can get bodybagged by the PsyScorSchach Combo</center>'
		);
	},

	salemance: 'elite4salemance',
	elite4salemance: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/jrW9zfw.gif">' +
			'<font size="6" color="#FE2E9A"><i>Elite4Salemance</i></font></color>' +
			'<img src="http://i.imgur.com/VYdDj7y.gif"><br />' +
			'Ace: Haxoceratops<br />' +
			'Yeah!!!</center>'
		);
	},

	colonialmustang: 'mustang',
	mustang: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/REAZaJu.gif"><br />' +
			'<img src="http://fc01.deviantart.net/fs70/f/2011/039/8/1/roy_mustang_firestorm_by_silverwind91-d394lp5.gif">' +
			'<font size="5" color="#FF0040"><i>Colonial Mustang</i></font></color>' +
			'<img src="http://i.imgur.com/VRZ9qY5.gif"><br />' +
			'What am I trying to accomplish, you ask...? I want to change the dress code so that all women in the Frost... ...must wear mini-skirts!!.</center>'
		);
	},

	logic: 'psychological',
	psychological: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/c4j9EdJ.png?1">' +
			'<img src="http://i.imgur.com/UtdtdiO.png" width="200"></a>' +
			'<img src="http://i.imgur.com/TwpGsh3.png?1"><br />' +
			'<img src="http://i.imgur.com/1MH0mJM.png" height="90">' +
			'<img src="http://i.imgur.com/TSEXdOm.gif" width="300">' +
			'<img src="http://i.imgur.com/4XlnMPZ.png" height="90"><br />' +
			'If it isn\'t logical, it\'s probably Psychological.</center>'
		);
	},

	siem: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/CwhY2Bq.png">' +
			'<font size="7" color="#01DF01"><i>Siem</i></font></color>' +
			'<img src="http://i.imgur.com/lePMJe5.png"><br />' +
			'Ace: Froslass<br />' +
			'Keep your head up, nothing lasts forever.</center>'
		);
	},

	grumpigthepiggy: 'grumpig',
	grumpig: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/k71ePDv.png"><br />' +
			'<img src="http://i.imgur.com/bydKNe9.gif"><br />' +
			'Ace: Mamoswine<br />' +
			'Meh I\'ll Oink you till you rage.</center>'
		);
	},

	figgy: 'figufgyu',
	figufgyu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/n0Avtwh.png">' +
			'<img src="http://i.imgur.com/0UB0M2x.png">' +
			'<img src="http://i.imgur.com/fkTouXK.png"><br />' +
			'Ace: Charizard<br />' +
			'Get ready to be roasted!</center>'
		);
	},

	stein: 'frank',
	frankenstein: 'frank',
	frank: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<center><img src="http://media20.giphy.com/media/TNW1OpTRqXkhG/giphy.gif" height="110">' +
			'<b><font color="blue" size="6">Professor Stein</font></b>' +
			'<img src="http://www.pkparaiso.com/imagenes/xy/sprites/animados/keldeo.gif"><br />' +
			'<b>Ace:</b> Keldeo<br />' +
			'<b>Catcphrase:</b> Are you ready to fight against fear itself? Will you cross beyond that door? Let your souls make the decision for you.</center>'
		);
	},

	shadowninjask: 'ninjask',
	ninjask: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7DKOZLx.png"><br />' +
			'<img src="http://i.imgur.com/YznYjmS.gif"><br />' +
			'Ace: Mega Charizard X<br />' +
			'Finn, being an enormous crotch-kicking foot is a gift. Don\'t scorn a gift.</center>'
		);
	},

	recep: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/4xzLvzV.gif">' +
			'<img src="http://i.imgur.com/48CvnKv.gif" height="80" width="290">' +
			'<img src=http://i.imgur.com/4xzLvzV.gif><br />' +
			'<b>Ace:</b> Patrick<br />' +
			'<b>Catchphrase:</b> I may be stupid, but I\'m also dumb.<center>'
		);
	},

	tesla: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://oi57.tinypic.com/t54ow6.jpg" width="140">' +
			'<img src="http://oi60.tinypic.com/2898nc0.jpg" width="260">' +
			'<img src="http://oi62.tinypic.com/zkiqyw.jpg" width="140"><br />' +
			'Type: <font color="CCCC00">Electric</font><br />' +
			'If you believe in your dreams, I will prove to you, that you can achieve your dreams just by working hard.</center>'
		);
	},

	nocilol: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/e3Y9KTl.gif" height="100" width="80">' +
			'<img src="http://i.imgur.com/8aJpTwD.gif">' +
			'<img src="http://i.imgur.com/WUtGk1c.jpg" height="120" width="100"><br />' +
			'<font face="arial" color="red"><b>Ace: </b>Gallade</font><br />' +
			'<b>Catchphrase: </b>I hope you enjoy fan service – I can provide you some. ;)</center>'
		);
	},

	tacosaur: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src=http://i.imgur.com/kLizkSj.png height="100" width="100">' +
			'<img src=http://i.imgur.com/AZMkadt.gif>' +
			'<img src=http://i.imgur.com/csLKG5O.png height="100" width="100"><br />' +
			'<b>Ace:</b> Swampert<br />' +
			'<b>Catchphrase:</b> So I herd u liek Swampertz</center>'
		);
	},

	prez: 'cosy',
	cosy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<marquee direction="right"><img src="http://i.imgur.com/Cy88GTo.gif">' +
			'<img src="http://i.imgur.com/Cy88GTo.gif">' +
			'<img src="http://i.imgur.com/Cy88GTo.gif">' +
			'<img src="http://i.imgur.com/Cy88GTo.gif">' +
			'<img src="http://i.imgur.com/Cy88GTo.gif"></marquee>' +
			'<img src="http://i.imgur.com/NyBEx2S.png" width="100%"><marquee direction="left">' +
			'<img src="http://i.imgur.com/gnG81Af.gif">' +
			'<img src="http://i.imgur.com/gnG81Af.gif">' +
			'<img src="http://i.imgur.com/gnG81Af.gif">' +
			'<img src="http://i.imgur.com/gnG81Af.gif">' +
			'<img src="http://i.imgur.com/gnG81Af.gif"></marquee>'
		);
	},

	hulasaur: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/8owuies.gif" width="110" height="70">' +
			'<img src="http://i.imgur.com/qHnpJfN.png">' +
			'<img src="http://24.media.tumblr.com/tumblr_me7s9cLpWv1qkvue8o3_500.gif" width="110" height="70"><br />' +
			'<b>Ace: </b>Jolteon<br />' +
			'I believe in what I think is right, even when what I think is wrong</center>'
		);
	},

	pedophile: 'hope',
	hope: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://i.imgur.com/wA3QG58.gif">' +
			'<img src="http://i.imgur.com/SlN7Yla.gif">' +
			'<img src="https://i.imgur.com/OkqMkB8.png" width="160"><br />' +
			'<b>Ace:</b> Lolis<br />' +
			'I like my women like i like my wine, 12 years old and in the basement</center>'
		);
	},

	shm: 'swedishmafia',
	swedishmafia: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/12ekq6t.jpg">' +
			'<img src="http://i.imgur.com/D01llqs.png" height="80" width="370">' +
			'<img src="http://blowingupfast.com/wp-content/uploads/2011/05/Machine-Gun-Kelly.jpg"><br />' +
			'Ace: The Power of Music<br />' +
			'They say that love is forever... Your forever is all that I need~ Please staaay as long as you need~</center>'
		);
	},

	piled: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/fnRdooU.png">' +
			'<img src="http://i.imgur.com/hbo7FGZ.gif">' +
			'<img src="http://i.imgur.com/KV9HmIk.png"><br />' +
			'Ace: Ditto<br />' +
			'PILED&PURPTIMUS PRIME!!! MHM..YEAH!!!</center>'
		);
	},

	twistedfate: 'auraburst',
	auraburst: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/vrXy1Hy.png"><br />' +
			'<img src="http://i.imgur.com/FP2uMdp.gif"><br />' +
			'<blink><font color="red">Ace: Heatran</blink></font><br />' +
			'You may hate me, but don\'t worry, I hate you too.</center>'
		);
	},

	aerodactylol: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/KTiZXe7.jpg">' +
			'<font size="7" color="#00733C"><i>Aerodactylol</i></font></color>' +
			'<img src="http://pldh.net/media/pokemon/gen3/rusa_action/142.gif"><br/ >' +
			'Ace: Aerodactyl<br />' +
			'I only battle... DANCING!</center>'
		);
	},

	robin6539: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc09.deviantart.net/fs4/i/2004/196/9/b/Ludidolo.gif">' +
			'<img src="http://i.imgur.com/CSfl1OU.gif">' +
			'<img src="http://z5.ifrm.com/30155/88/0/a3555782/avatar-3555782.jpg"><br />' +
			'Ace: Ludicolo<br />' +
			'TRAINS AND COLOS</center>'
		);
	},

	thekirito: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/rUyvCbl.jpg"><br />' +
			'<button name="send" value="/transferbucks TheKirito, 1" target="_blank">Charity is good for your heart and good for my wallet (Donates A Buck)</button></center>'
		);
	},

	killertiger: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://sprites.pokecheck.org/s/500.gif"><br />' +
			'<img src="http://i.imgur.com/diRkf6z.png">' +
			'<font size="7" color="#0489B1"><i>Killer Tiger</i></font></color>' +
			'<img src="http://i.imgur.com/4FMzRl5.png"><br />' +
			'Ace: Salamence<br />' +
			'One for all and all for one</center>'
		);
	},

	twizzy: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/SGcRSab.png">' +
			'<img src="http://i.imgur.com/dkwp4cu.gif">' +
			'<img src="http://i.imgur.com/E04MrCc.png"><br />' +
			'<font color="red"><blink>Ace: Keldeo-Resolute</blink></font><br />' +
			'Have you ever feel scared and there is nothing you can do about it? Challenge me and i will show you what fear is!</center>'
		);
	},

	ag: 'arcainiagaming',
	arcainiagaming: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/tFikucg.png"><br />' +
			'<img src="http://i.imgur.com/wSs98Iy.gif"><br />' +
			'<font color="red"><blink>Ace: Weavile</blink></font><br />' +
			'I\'m not even on drugs. I\'m just weird.</center>'
		);
	},

	lights: 'scarftini',
	scarftini: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/HbuF0aR.png" width="550"><br />' +
			'<b>Ace:</b> Victini <br />' +
			'Owner of Trinity and former head of Biblia. Aggression is an art form. I am simply an artist.<br />' +
			'<img src="http://img-cache.cdn.gaiaonline.com/1a962e841da3af2acaced68853cd194d/http://i1070.photobucket.com/albums/u485/nitehawkXD/victini.gif"></center>'
		);
	},

	piiiikachuuu: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src="http://frostserver.net:8000/avatars/piiiikachuuu.png"><br />' +
			'zzzzzzzzzzzzzzzzz'
		);
	},


	/*********************************
	 * Frost Contest Winner Commands *
	 *********************************/

	iamforty: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/oKhQNX2.jpg"><br />' +
			'<img src="http://i.imgur.com/dqsqOKZ.gif"><br />' +
			'6-0 or 1-0, either way it\'s a win :)</center>'
		);
	},

	involved: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/3wcET7B.gif" width="200"><br />' +
			'<img src="http://i.imgur.com/eAtWgY6.gif"><br />' +
			'A true gentleman keeps his calm cool.</center>'
		);
	},

	funniest: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://i.imgflip.com/9jmbk.jpg" height="160"><br />' +
			'<img src="http://i.imgur.com/iG5uv3h.png"><br />' +
			'Just a little african using humor to make it in to the USA while obtaining bad bitches and a fine collection of ramen noodles.</center>'
		);
	},

	popular: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://a4.ec-images.myspacecdn.com/images02/19/41b06a9ea0824af081d89de237c011d9/l.jpg" height="160"><br />' +
			'<img src="http://i.imgur.com/tuQtMyf.gif" height="100"><br />' +
			'I am so fab, I mean I wouldn\'t be known as frost\'s most popular user ;).</center>'
		);
	},

	smartest: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://25.media.tumblr.com/855789c7dfd76c65d425bffb0311fc62/tumblr_mid2ub92ad1rg8h5ro1_500.jpg" height="150"><br />' +
			'<img src="http://i.imgur.com/J6eVqfI.gif"><br />' +
			'<i>Intelligence without ambition is a weapon without reason. Like using a Dagger, sharpen your senses and strike through your weakness.</i></center>'
		);
	},

	couple: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://1-media-cdn.foolz.us/ffuuka/board/vp/image/1389/99/1389993289798.png" width="130">' +
			'<img src="http://i.imgur.com/7vNiKOM.gif">' +
			'<img src="http://i.imgur.com/lRlU8KQ.gif" width="130"><br />' +
			'You know it\'s true love when you give each other nicknames such as, Bitch, Slut and Whore.</center>'
		);
	},

	thirst: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7TMTTD7.jpg" height="150"><br />' +
			'<img src="http://i.imgur.com/Y4IehdG.gif"><br />' +
			'There is not enough water on this earth to quench my thirst for women.</center>'
		);
	},

	hax: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://imgur.com/RT7NRWm.png" height="140"><br />' +
			'<img src="http://imgur.com/vwp9x7c.png" height="100"><br />' +
			'It\’s impossible to predict where a lightning bolt will land. Some may call it random chance. I call it fate.</center>'
		);
	},

	bestou: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/dLsxG5b.jpg" height="170"><br />' +
			'<img src="http://i.imgur.com/FMMzlI8.gif"><br />' +
			'Me best OU player? Think again! I\'m the best OU Staller! Let\'s start the stall!</center>'
		);
	},

	nicest: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc02.deviantart.net/fs71/f/2011/006/3/0/195___quagsire_by_winter_freak-d36k65s.jpg" height="140"><br />' +
			'<img src="http://i.imgur.com/34stjSR.gif"><br />' +
			'Please say gg before you rage quit C:</center>'
		);
	},

	bestbattler: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/80oFzua.jpg" height="130"><br />' +
			'<img src="http://i.imgur.com/Z37cY6F.png" height="100"><br />' +
			'<b>Me being the best is a regular statistic, but you being better then me? Let\'s be more realistic</b></center>'
		);
	},

	/**********************************
	 * Masters of the Colors commands *
	 **********************************/

	mastersofthecolorhelp: 'motc',
	motc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<h2>Masters of the Colors</h2><hr /><br />In this tournament, you will construct a team based on the color of your name. ' +
			'You are not allowed to <em>choose</em> the color of your name. Follow these steps if you wish to participate:<ol><li>Look at the color ' +
			'of your name and determine if your name color is: <b>Red, Blue, Green, Pink/Purple, Yellow/Brown</b></li><li>Once you have found out your' +
			' name color, type that color in the main chat to bring up a list of pokemon with that color. Ex]BrittleWind is Blue so he would type /blue' +
			' in the main chat, jd is Blue so he would type /blue in the main chat. (If your name color is Yellow/Brown you are allowed to use both yellow ' +
			'<em>and</em> brown Pokemon. The same goes for Pink/Purple)</li><li>Now using list of pokemon you see on your screen, make a <b>Gen 6 OU</b>' +
			' team using only the pokemon on the list. Some pokemon on the list won\'t be in the OU category so ignore them. As long as you\'re able to do a' +
			' Gen 6 OU battle with only your pokemon, your good to go!</li><li>Now all you have to do is wait for the declare to come up telling you that' +
			' Masters of the Colors has started! If you happen to come accross any trouble during the event, feel free to PM the room owner of your designated room.</li>'
		);
	},

	blue: 'red',
	brown: 'red',
	green: 'red',
	pink: 'red',
	purple: 'red',
	yellow: 'red',
	black: 'red',
	red: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		if (this.broadcasting && room.id !== cmd) return false;
		var output = '|raw|<table class="motc-' + cmd + '" border="3" cellspacing ="0" cellpadding="2"><tr class="motc' + cmd + '-tr">';
		var count = 0;
		for (var u in Tools.data.Pokedex) {
			var pokemon = Tools.getTemplate(u);
			if (pokemon.tier == 'Uber' || pokemon.tier == 'Unreleased' || pokemon.tier == 'CAP') continue;
			if (pokemon.color.toLowerCase() !== cmd) continue;
			if (pokemon.forme == '') output += '<td><img title="' + Tools.escapeHTML(pokemon.name) + '" src="http://play.pokemonshowdown.com/sprites/bw/'+pokemon.id+'.png" width="40" height="40"></td><td>'+Tools.escapeHTML(pokemon.name)+'</td>';
			if (pokemon.forme !== '' && pokemon.id !== 'basculinbluestriped' && pokemon.id !== 'pichuspikyeared') output += '<td><img title="'+Tools.escapeHTML(pokemon.name)+'" src="http://play.pokemonshowdown.com/sprites/bw/'+pokemon.baseSpecies.toLowerCase()+'-'+pokemon.forme.toLowerCase()+'.png" width="40" height="40"></td><td>'+Tools.escapeHTML(pokemon.name)+'</td>';
			if (pokemon.id == 'basculinbluestriped') output += '<td><img title="' + Tools.escapeHTML(pokemon.name) + '" src="http://play.pokemonshowdown.com/sprites/bw/basculin-bluestriped.png" width="40" height="40"></td><td>'+Tools.escapeHTML(pokemon.name)+'</td>';
			if (pokemon.id == 'pichuspikyeared') output += '<td><img title="' + Tools.escapeHTML(pokemon.name) + '" src="http://play.pokemonshowdown.com/sprites/bw/pichu-spikyeared.png" width="40" height="40"></td><td>'+Tools.escapeHTML(pokemon.name)+'</td>';
			count++;
			if (count > 5) {
				output += '</tr><tr class="motc-tr">';
				count = 0;
			}
		}

		while (count < 6) {
			output += '<td></td><td></td>';
			count++;
		}

		output += '</tr></tbody></table>';
		this.sendReply(output);
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	vip: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>Information regarding what a VIP user is can be found <a href="http://frostserver.net/forums/showthread.php?tid=693">here.</a>'
		);
	},

	frostradio: 'radio',
	radio: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('Come visit the Frost Plug Radio <a href="http://plug.dj/frost-ps/">here</a>!'
		);
	},

	events: 'currentevents',
	currentevents: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Check out information on the weekly events <a href="http://frostserver.net/forums/showthread.php?tid=539">here</a>!'
		);
	},

	forums: 'forum',
	forum: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You can find the official Frost forum <a href="http://frostserver.net/forums/index.php">here</a>.'
		);
	},

	potd: function (target, room, user) {
		if (!this.can('potd')) return false;

		Config.potd = target;
		Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day is now " + target + "!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was changed to " + target + " by " + user.name + ".");
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was removed by " + user.name + ".");
		}
	},

	roll: 'dice',
	dice: function (target, room, user) {
		if (!target) return this.parse('/help dice');
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d != -1) {
			var num = parseInt(target.substring(0, d));
			var faces;
			if (target.length > d) faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = [];
			var total = 0;
			for (var i = 0; i < num; ++i) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox("Random number " + num + "x(1 - " + faces + "): " + rolls.join(", ") + "<br />Total: " + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply("The max roll must be a number under 21 digits.");
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox("Random number (1 - " + maxRoll + "): " + rand);
	},

	pr: 'pickrandom',
	pick: 'pickrandom',
	pickrandom: function (target, room, user) {
		var options = target.split(',');
		if (options.length < 2) return this.parse('/help pick');
		if (!this.canBroadcast()) return false;
		return this.sendReplyBox('<em>We randomly picked:</em> ' + Tools.escapeHTML(options.sample().trim()));
	},

	register: function () {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You will be prompted to register upon winning a rated battle. Alternatively, there is a register button in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right.');
	},

	lobbychat: function (target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply("You are now blocking lobby chat.");
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply("You are now receiving lobby chat.");
		}
	},

	showimage: function (target, room, user) {
		if (!target) return this.parse('/help showimage');
		if (!this.can('declare', null, room)) return false;
		if (!this.canBroadcast()) return;

		targets = target.split(',');
		/*if (targets.length != 3) {
			return this.parse('/help showimage');
		}*/

		this.sendReply('|raw|<img src="' + Tools.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '" height="' + toId(targets[2]) + '" />');
	},

	pmbox: 'custompm',
	declarepm: 'custompm',
	buttonpm: 'custompm',
	pmbutton: 'custompm',
	custompm: function (target, room, user) {
		if (!target) return this.parse('/help custompm');
		if (!this.can('declare', null, room)) return false;
		if (!this.canBroadcast()) return;

		targets = target.split(',');
		if (targets.length != 2) {
			return this.parse('/help custompm');
		}

		this.sendReplyBox('<button name="send" value="/pm ' + targets[0] + ', ' + targets[1] + '">Custom PM Box</button>');
	},

	hangmanhelp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'<font size = 2>A brief introduction to </font><font size = 3>Hangman:</font><br />' +
			'The classic game, the basic idea of hangman is to guess the word that someone is thinking of before the man is "hanged." Players are given 8 guesses before this happens.<br />' +
			'Games can be started by any of the rank Voice or higher, including Room Voice, Room Mod, and Room Owner.<br />' +
			'The commands are:<br />' +
			'<ul><li>/hangman [word], [description] - Starts the game of hangman, with a specified word and a general category. Requires: + % @ & ~</li>' +
			'<li>/guess [letter] - Guesses a letter.</li>' +
			'<li>/guessword [word] - Guesses a word.</li>' +
			'<li>/viewhangman - Shows the current status of hangman. Can be broadcasted.</li>' +
			'<li>/word - Allows the person running hangman to view the word.</li>' +
			'<li>/category [description] OR /topic [description] - Allows the person running hangman to changed the topic.</li>' +
			'<li>/endhangman - Ends the game of hangman in the room. Requires: + % @ & ~</li></ul>' +
			'Due to some recent changes, hangman can now be played in multiple rooms at once (excluding lobby, it\'s a little spammy).<br />' +
			'Have fun, and feel free to PM me if you find any bugs! - piiiikachuuu'
		);
	},

	giveavatar: 'customavatar',
	customavatars: 'customavatar',
	customavatar: (function () {
		const script = (function () {/*
			FILENAME=`mktemp`
			function cleanup {
				rm -f $FILENAME
			}
			trap cleanup EXIT

			set -xe

			timeout 10 wget "$1" -nv -O $FILENAME

			FRAMES=`identify $FILENAME | wc -l`
			if [ $FRAMES -gt 1 ]; then
				EXT=".gif"
			else
				EXT=".png"
			fi

			timeout 10 convert $FILENAME -layers TrimBounds -coalesce -adaptive-resize 80x80\> -background transparent -gravity center -extent 80x80 "$2$EXT"
		*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

		var pendingAdds = {};
		return function (target, room, user) {
			var parts = target.split(',');
			var cmd = parts[0].trim().toLowerCase();

			if (cmd in {'':1, show:1, view:1, display:1}) {
				var message = "";
				for (var a in Config.customavatars)
					message += "<strong>" + Tools.escapeHTML(a) + ":</strong> " + Tools.escapeHTML(Config.customavatars[a]) + "<br />";
				return this.sendReplyBox(message);
			}

			if (!this.can('customavatar') && !user.vip) return false;

			switch (cmd) {
				case 'add':
				case 'set':
					var userid = toId(parts[1]);
					if (!this.can('customavatar') && user.vip && userid !== user.userid) return false;
					var targetUser = Users.getExact(userid);
					var avatar = parts.slice(2).join(',').trim();

					if (!userid) return this.sendReply("You didn't specify a user.");
					if (Config.customavatars[userid]) return this.sendReply(userid + " already has a custom avatar.");

					var hash = require('crypto').createHash('sha512').update(userid + '\u0000' + avatar).digest('hex').slice(0, 8);
					pendingAdds[hash] = {userid: userid, avatar: avatar};
					parts[1] = hash;

					if (!targetUser) {
						this.sendReply("Warning: " + userid + " is not online.");
						this.sendReply("If you want to continue, use: /customavatar forceset, " + hash);
						return;
					}
					// Fallthrough

				case 'forceset':
					var hash = parts[1].trim();
					if (!pendingAdds[hash]) return this.sendReply("Invalid hash.");

					var userid = pendingAdds[hash].userid;
					var avatar = pendingAdds[hash].avatar;
					delete pendingAdds[hash];

					require('child_process').execFile('bash', ['-c', script, '-', avatar, './config/avatars/' + userid], (function (e, out, err) {
						if (e) {
							this.sendReply(userid + "'s custom avatar failed to be set. Script output:");
							(out + err).split('\n').forEach(this.sendReply.bind(this));
							return;
						}

						reloadCustomAvatars();
						this.sendReply(userid + "'s custom avatar has been set.");
						Users.messageSeniorStaff(userid+' has received a custom avatar from '+user.name);
					}).bind(this));
					break;
				case 'rem':
				case 'remove':
				case 'del':
				case 'delete':
					var userid = toId(parts[1]);
					if (!this.can('customavatar') && user.vip && userid !== user.userid) return false;
					if (!Config.customavatars[userid]) return this.sendReply(userid + " does not have a custom avatar.");

					if (Config.customavatars[userid].toString().split('.').slice(0, -1).join('.') !== userid)
						return this.sendReply(userid + "'s custom avatar (" + Config.customavatars[userid] + ") cannot be removed with this script.");
					require('fs').unlink('./config/avatars/' + Config.customavatars[userid], (function (e) {
						if (e) return this.sendReply(userid + "'s custom avatar (" + Config.customavatars[userid] + ") could not be removed: " + e.toString());

						delete Config.customavatars[userid];
						this.sendReply(userid + "'s custom avatar removed successfully");
					}).bind(this));
					break;

				default:
					return this.sendReply("Invalid command. Valid commands are `/customavatar set, user, avatar` and `/customavatar delete, user`.");
			}
		};
	})(),

	/*********************************************************
	 * Help commands
	 *********************************************************/
	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function (target, room, user) {
		target = target.toLowerCase();
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply("/msg OR /whisper OR /w [username], [message] - Send a private message.");
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply("/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.");
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply("/rating - Get your own rating.");
			this.sendReply("/rating [username] - Get user's rating.");
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			this.sendReply("/nick [new username] - Change your username.");
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			this.sendReply("/avatar [new avatar number] - Change your trainer sprite.");
		}
		if (target === 'all' || target === 'whois' || target === 'alts' || target === 'ip' || target === 'rooms') {
			matched = true;
			this.sendReply("/whois - Get details on yourself: alts, group, IP address, and rooms.");
			this.sendReply("/whois [username] - Get details on a username: alts (Requires: % @ & ~), group, IP address (Requires: @ & ~), and rooms.");
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			this.sendReply("/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability/nature.");
			this.sendReply("!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'details' || target === 'dt') {
			matched = true;
			this.sendReply("/details [pokemon] - Get additional details on this pokemon/item/move/ability/nature.");
			this.sendReply("!details [pokemon] - Show everyone these details. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'analysis') {
			matched = true;
			this.sendReply("/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.");
			this.sendReply("!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			this.sendReply("/groups - Explains what the + % @ & next to people's names mean.");
			this.sendReply("!groups - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			this.sendReply("/opensource - Links to PS's source code repository.");
			this.sendReply("!opensource - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			this.sendReply("/avatars - Explains how to change avatars.");
			this.sendReply("!avatars - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			this.sendReply("/intro - Provides an introduction to competitive pokemon.");
			this.sendReply("!intro - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			this.sendReply("/cap - Provides an introduction to the Create-A-Pokemon project.");
			this.sendReply("!cap - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			this.sendReply("/om - Provides links to information on the Other Metagames.");
			this.sendReply("!om - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply("/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.");
			this.sendReply("!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'calc' || target === 'calculator') {
			matched = true;
			this.sendReply("/calc - Provides a link to a damage calculator");
			this.sendReply("!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~");
		}
		/*if (target === 'all' || target === 'blockchallenges' || target === 'idle') {
			matched = true;
			this.sendReply("/away - Blocks challenges so no one can challenge you. Deactivate it with /back.");
		}
		if (target === 'all' || target === 'allowchallenges') {
			matched = true;
			this.sendReply('/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.');
		}*/
		if (target === 'all' || target === 'away') {
			matched = true;
			this.sendReply('/away - Set yourself as away which will also change your name.');
		}
		if (target === 'all' || target === 'back') {
			matched = true;
			this.sendReply('/back - Marks yourself as back and reverts name back.');
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			this.sendReply("/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.");
			this.sendReply("!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~");
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			this.sendReply("Set up highlights:");
			this.sendReply("/highlight add, word - add a new word to the highlight list.");
			this.sendReply("/highlight list - list all words that currently highlight you.");
			this.sendReply("/highlight delete, word - delete a word from the highlight list.");
			this.sendReply("/highlight delete - clear the highlight list");
		}
		if (target === 'all' || target === 'timestamps') {
			matched = true;
			this.sendReply("Set your timestamps preference:");
			this.sendReply("/timestamps [all|lobby|pms], [minutes|seconds|off]");
			this.sendReply("all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences");
			this.sendReply("off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]");
		}
		if (target === 'all' || target === 'effectiveness' || target === 'matchup' || target === 'eff' || target === 'type') {
			matched = true;
			this.sendReply("/effectiveness OR /matchup OR /eff OR /type [attack], [defender] - Provides the effectiveness of a move or type on another type or a Pokémon.");
			this.sendReply("!effectiveness OR /matchup OR !eff OR !type [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a Pokémon.");
		}
		if (target === 'all' || target === 'dexsearch' || target === 'dsearch' || target === 'ds') {
			matched = true;
			this.sendReply("/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.");
			this.sendReply("Search categories are: type, tier, color, moves, ability, gen.");
			this.sendReply("Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.");
			this.sendReply("Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/LC/CAP.");
			this.sendReply("Types must be followed by ' type', e.g., 'dragon type'.");
			this.sendReply("Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.");
			this.sendReply("The parameter 'mega' can be added to search for Mega Evolutions only, and the parameters 'FE' or 'NFE' can be added to search fully or not-fully evolved Pokemon only.");
			this.sendReply("The order of the parameters does not matter.");
		}
		if (target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply("/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.");
			this.sendReply("/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.");
		}
		if (target === 'all' || target === 'complaint' || target === 'complain' || target === 'cry') {
			matched = true;
			this.sendReply('/complain OR /complaint [message] - Adds a complaint to the list of complaints which will be reviewed by server staff.');
		}
		if (target === 'all' || target === 'vote') {
			matched = true;
			this.sendReply('/vote [option] - votes for the specified option in the poll');
		}
		if (target === 'all' || target === 'tell') {
			matched = true;
			this.sendReply('/tell [username], [message] - Sends a message to the user which they see when they next speak');
		}
		if (target === 'all' || target === 'tourstats' || target === 'ts') {
			matched = true;
			this.sendReply('/tourstats [username], [tier] - Shows the target users tournament stats. Tier may be replaced with \"all\" to view the targets ranking in every tier.');
		}
		if (target === 'all' || target === 'buy') {
			matched = true;
			this.sendReply('/buy [item] - buys the specified item, assuming you have enough money.');
			this.sendReply('If the item you are buying is an avatar, you must specify the image. ex: /buy [custom/animated],[image]');
		}
		if (target === 'all' || target === 'friends') {
			matched = true;
			this.sendReply('/friends - Shows all of the users on your friends list. Only works on the custom client.');
		}
		if (target === 'all' || target === 'addfriend') {
			matched = true;
			this.sendReply('/addfriend [user] - adds the specified user to your friends list. Only works on the custom client.');
		}
		if (target === 'all' || target === 'removefriend') {
			matched = true;
			this.sendReply('/removefriend [user] - removes the specified user from your friends list. Only works on the custom client.');
		}
		if (target === 'join') {
			matched = true;
			this.sendReply("/join [roomname] - Attempts to join the room [roomname].");
		}
		if (target === 'ignore') {
			matched = true;
			this.sendReply("/ignore [user] - Ignores all messages from the user [user].");
			this.sendReply("Note that staff messages cannot be ignored.");
		}
		if (target === 'invite') {
			matched = true;
			this.sendReply("/invite [username], [roomname] - Invites the player [username] to join the room [roomname].");
		}
		if (target === 'all' || target === 'resetsymbol') {
			matched = true;
			this.sendReply('/resetsymbol - Resets your symbol back to default, only works if you have a custom symbol.');
		}
		if (target === 'all' || target === 'atm' || target === 'wallet' || target === 'satchel' || target === 'fannypack' || target === 'purse' || target === 'bag') {
			matched = true;
			this.sendReply('/wallet [username] - Shows you how many bucks and coins [username] has.');
		}
		if (target === 'all' || target === 'stafflist') {
			matched = true;
			this.sendReply('/stafflist - Shows you the list of staff members.');
		}
		if (target === 'all' || target === 'poof' || target == 'd') {
			matched = true;
			this.sendReply('/poof OR /d - Disconnects you from the server, leaving a random "poof" message behind.');
		}
		if (target === 'seen' || target === 'all') {
			matched = true;
			this.sendReply('/seen [username] - Shows you when a user was last seen online.');
		}
		if (target === 'all' || target === 'roomauth') {
			matched = true;
			this.sendReply('/roomauth - Shows you a list of the staff list in the room.');
		}
		if (target === 'all' || target === 'maxusers' || target === 'recordusers') {
			matched = true;
			this.sendReply('/maxusers - Shows the record user count.');
		}
		if (target === 'all' || target === 'regdate') {
			matched = true;
			this.sendReply('/regdate [username] - Shows you the date [username] was registered on.');
		}
		if (target === 'all' || target === 'time' || target === 'servertime') {
			matched = true;
			this.sendReply('/time OR /servertime - Displays the current server time.');
		}
		if (target === 'all' || target === 'leaguestatus') {
			matched = true;
			this.sendReply('/leaguestatus - View whether the league you are in is open or closed to challengers.');
		}
		if (target === 'all' || target === 'ud' || target === 'u') {
			matched = true;
			this.sendReply('/ud <phrase> - Looks up a word on urbandictionary.com');
		}
		if (target === 'all' || target === 'define' || target === 'def') {
			matched = true;
			this.sendReply('/define <word> - Displays the definition of the specified word.');
		}
		// Driver commands
		if (target === '%' || target === 'unlink') {
				matched = true;
				this.sendReply('/unlink [username] - Prevents users from clicking on any links [username] has posted. Requires: % @ & ~')
		}
		if (target === '%' || target === 'lock' || target === 'l') {
			matched = true;
			this.sendReply('/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ & ~');
		}
		if (target === '%' || target === 'unlock') {
			matched = true;
			this.sendReply('/unlock [username] - Unlocks the user. Requires: % @ & ~');
		}
		if (target === '%' || target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply('/redirect OR /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~');
		}
		if (target === '%' || target === 'modnote' || target === 'note' || target === 'mn') {
			matched = true;
			this.sendReply('/note OR /mn OR /modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~');
		}
		if (target === '%' || target === 'altcheck' || target === 'alt' || target === 'alts' || target === 'getalts') {
			matched = true;
			this.sendReply('/alts OR /altcheck OR /alt OR /getalts [username] - Get a user\'s alts. Requires: % @ & ~');
		}
		if (target === '%' || target === 'redir' || target === 'redirect') {
			matched = true;
			this.sendReply('/redirect OR /redir [username], [room] - Forcibly move a user from the current room to [room]. Requires: % @ & ~');
		}
		if (target === 'unban') {
			matched = true;
			this.sendReply("/unban [username] - Unban a user. Requires: @ & ~");
		}

		// RO commands
		if (target === 'showimage') {
			matched = true;
			this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: # & ~");
		}
		if (target === "%" || target === 'warn') {
			matched = true;
			this.sendReply('/warn [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~');
		}
		if (target === "%" || target === 'kick' || target === 'k') {
			matched = true;
			this.sendReply('/kick OR /k [username] - Kicks a user from the room they are currently in. Requires: % @ & ~');
		}
		if (target === 'roomdemote') {
			matched = true;
			this.sendReply("/roomdemote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: @ # & ~");
		}

		// leader commands
		if (target === 'banip') {
			matched = true;
			this.sendReply("/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
		}
		if (target === '%' || target === 'daymute') {
			matched = true;
			this.sendReply('/daymute [username], [reason] - Mute user with reason for one day / 24 hours. Requires: % @ & ~');
		}
		if (target === '%' || target === 'cmute' || target === 'cm') {
			matched = true;
			this.sendReply('/cmute [username], [time in hours] - Mute a user for the amount of hours. Requires: % @ & ~');
		}
		if (target === '%' || target === 'unmute' || target === 'um') {
			matched = true;
			this.sendReply("/unbanip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~");
		}
		if (target === '%' || target === 'showuserid' || target === 'getid') {
			matched = true;
			this.sendReply('/showuserid [username] - To get the raw id of the user. Requires: % @ & ~');
		}
		if (target === '%' || target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply('/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~');
		}
		// Moderator commands
		if (target === '@' || target === 'shadowban' || target === 'sban') {
			matched = true;
			this.sendReply("/shadowban OR /sban [username], [secondary command], [reason] - Sends all the user\'s messages to the shadow ban room. Requires: @ & ~");
		}
		if (target === '@' || target === 'unshadowban' || target === 'unsban') {
			matched = true;
			this.sendReply("/unshadowban OR /unsban [username] - Undoes /shadowban (except the secondary command). Requires: @ & ~");
		}
		if (target === '@' || target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply('/forcerename OR /fr [username], [reason] - Forcibly change a user\'s name and shows them the [reason]. Requires: @ & ~');
		}
		if (target === '@' || target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply('/ban OR /b [username], [reason] - Kick user from all rooms and ban user\'s IP address with reason. Requires: @ & ~');
		}
		if (target === '@' || target === 'unban') {
			matched = true;
			this.sendReply('/unban [username] - Unban a user. Requires: @ & ~');
		}
		if (target === '@' || target === 'unbanall') {
			matched = true;
			this.sendReply('/unbanall - Unban all IP addresses. Requires: @ & ~');
		}
		if (target === '@' || target === 'modchat') {
			matched = true;
			this.sendReply('/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options');
		}
		if (target === 'roomban') {
			matched = true;
			this.sendReply('/roomban OR /rb [username] - bans user from the room. Requires: @ & ~');
		}
		if (target === 'roomunban') {
			matched = true;
			this.sendReply('/roomunban [username] - unbans user from the room');
		}
		if (target === 'roompromote') {
			matched = true;
			this.sendReply('/roompromote [username] OR /roompromote [username], [rank] - Promotes [username] to the specified rank. If rank is left blank, promotes to the next rank up.');
		}
		// Leader commands
		if (target === '&' || target === 'banip') {
			matched = true;
			this.sendReply('/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~');
		}
		if (target === '&' || target === 'permaban' || target === 'permban' || target === 'pban') {
			matched = true;
			this.sendReply('/permaban [username] - Permanently bans the user from the server. Bans placed by this command do not reset on server restarts. Requires: & ~');
		}
		if (target === '&' || target === 'unpermaban') {
			matched = true;
			this.sendReply('/unpermaban [IP] - Removes an IP address from the permanent ban list.');
		}
		if (target === '&' || target === 'promote') {
			matched = true;
			this.sendReply("/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~");
		}
		if (target === 'demote') {
			matched = true;
			this.sendReply("/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~");
		}
		if (target === 'forcetie') {
			matched = true;
			this.sendReply("/forcetie - Forces the current match to tie. Requires: & ~");
		}
		if (target === '&' || target === 'showimage') {
			matched = true;
			this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: & ~");
		}
		if (target === '&' || target === 'custompm') {
			matched = true;
			this.sendReply("/custompm [target], [message] - Makes a button that PMs the target a message if clicked. Requires: & ~");
		}
		if (target === '&' || target === 'declare') {
			matched = true;
			this.sendReply("/declare [message] - Anonymously announces a message. Requires: & ~");
		}
		if (target === '&' || target === 'potd' ) {
			matched = true;
			this.sendReply('/potd [pokemon] - Sets the Random Battle Pokemon of the Day. Requires: & ~');
		}
		if (target === '&' || target === 'inactiverooms') {
			matched = true;
			this.sendReply('/inactiverooms - Lists all of the inactive rooms on the server. Requires: & ~');
		}
		if (target === '&' || target === 'roomlist') {
			matched = true;
			this.sendReply('/roomlist - Lists all of the rooms on the server, including inactive and private rooms. Requires: & ~');
		}
		if (target === '&' || target === 'takebucks' || target === 'removebucks' || target === 'tb' || target === 'rb') {
			matched = true;
			this.sendReply('/takebucks [username], [amount], [reason] - Removes amount from username. Reason optional. Requires: & ~');
		}
		if (target === '&' || target === 'givebucks' || target === 'gb' || target === 'awardbucks') {
			matched = true;
			this.sendReply('/givebucks [username], [amount], [reason] - Gives amount to username. Reason is optional. Requires: & ~');
		}
		if (target === '&' || target === 'gdeclare' || target === 'gdeclarered' || target === 'gdeclaregreen') {
			matched = true;
			if (target === 'gdeclare') this.sendReply('/gdeclare [message] - Anonymously announces a message to all rooms. Requires: & ~');
			if (target === 'gdeclarered') this.sendReply('/gdeclarered [message] - Anonymously announces a message to all rooms with a red background. Requires: & ~');
			else if (target === 'gdeclaregreen') this.sendReply('/gdeclaregreen [message] - Anonymously announces a message to all rooms with a green background. Requires: & ~');
		}
		if (target === '&' || target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply('/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: & ~');
		}
		if (target === '&' || target === 'customavatar') {
			matched = true;
			this.sendReply('/customavatar [username], [image] - Gives [username] the image as their avatar. Requires: & ~');
		}
		if (target === '&' || target === 'makechatroom') {
			matched = true;
			this.sendReply('/makechatroom [roomname] - Creates a new room named [roomname]. Requires: & ~');
		}
		if (target === '&' || target === 'deregisterchatroom') {
			matched = true;
			this.sendReply('/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: & ~');
		}
		if (target === '&' || target === 'roomowner') {
			matched = true;
			this.sendReply('/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: & ~');
		}
		if (target === '&' || target === 'roomdeowner') {
			matched = true;
			this.sendReply('/roomdeowner [username] - Removes [username]\'s status as a room owner. Requires: & ~');
		}
		if (target === '&' || target === 'privateroom') {
			matched = true;
			this.sendReply('/privateroom [on/off] - Makes or unmakes a room private. Requires: & ~');
		}
		if (target === '&' || target === 'roomfounder') {
			matched = true;
			this.sendReply('/roomfounder [username] - Sets [username] as the room founder. Requires: & ~');
		}
		if (target === '&' || target === 'giveavatar') {
			matched = true;
			this.sendReply('/giveavatar [username], [image] - Gives [username] the specified as an avatar. Image must be either a GIF or PNG. Requires: & ~');
		}
		//Admin commands
		if (target === '~' || target === 'sendpopup' || target === 'spop') {
			matched = true;
			this.sendReply('/sendpopup [username], [message] - Sends a popup to [username] displaying [message].')
		}
		if (target === '~' || target === 'forcerenameto' || target === 'frt') {
			matched = true;
			this.sendReply('/forcerenameto OR /frt [username], [new name] - Forcibly change a user\'s name to [new name]. Requires: ~');
		}
		if (target === '~' || target === 'awarditem') {
			matched = true;
			this.sendReply('/awarditem [username], [shop item] - Gives the user the item from the shop, for free! Requires: ~');
		}
		if (target === '~' || target === 'removeitem') {
			matched = true;
			this.sendReply('/removeitem [username], [shop item] - Removes the item from the user. Requires: ~');
		}
		if (target === 'hotpatch') {
			matched = true;
			this.sendReply("Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~");
			this.sendReply("Hot-patching has greater memory requirements than restarting.");
			this.sendReply("/hotpatch chat - reload chat-commands.js");
			this.sendReply("/hotpatch battles - spawn new simulator processes");
			this.sendReply("/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes");
		}
		if (target === 'lockdown') {
			matched = true;
			this.sendReply("/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~");
		}
		if (target === 'kill') {
			matched = true;
			this.sendReply("/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: ~");
		}
		if (target === 'loadbanlist') {
			matched = true;
			this.sendReply("/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~");
		}
		if (target === '~' || target === 'givevip' || target === 'addvip') {
			matched = true;
			this.sendReply('/givevip [username] OR /addvip [username] - Gives [username] VIP status. Requires: ~');
		}
		if (target === '~' || target === 'takevip' || target === 'remvip' || target === 'removevip') {
			matched = true;
			this.sendReply('/takevip OR /remvip OR /removevip [username] - Removes VIP status from [username]. Requires: ~');
		}
		// VIP Commands
		if (target === 'VIP' || target === '/customavatar') {
			matched = true;
			this.sendReply('/customavatar [image] - Sets the specified image as your avatar. Image must be a GIF or PNG. Requires: VIP');
		}

		// overall
		if (target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply("/help OR /h OR /? - Gives you help.");
		}
		if (!target) {
			this.sendReply('COMMANDS: /msg, /reply, /ignore, /ip, /rating, /nick, /avatar, /rooms, /whois, /help, /away, /back, /timestamps, /highlight, /poof');
			this.sendReply('INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /time, /recordusers, /tourstats, /calc, /ud, /define (replace / with ! to broadcast. (Requires: + % @ & ~))');
			this.sendReply('For details on all room commands, use /roomhelp');
			this.sendReply('For details on all commands, use /help all');
			if (user.vip) {
				this.sendReply('VIP COMMANDS: /customavatar');
			}
			if (user.group !== Config.groupsranking[0]) {
				this.sendReply('DRIVER COMMANDS: /mute, /unmute, /announce, /modlog, /forcerename, /alts')
				this.sendReply('MODERATOR COMMANDS: /ban, /unban, /unbanall, /ip, /redirect, /kick');
				this.sendReply('LEADER COMMANDS: /promote, /demote, /forcewin, /forcetie, /declare, /permaban, /unpermaban, /makechatroom, /leagueroom, /privateroom, /roomfounder');
				this.sendReply('For details on all moderator commands, use /help @');
			}
			this.sendReply("For an overview of room commands, use /roomhelp");
			this.sendReply("For details of a specific command, use something like: /help data");
		} else if (!matched) {
			this.sendReply("Help for the command '" + target + "' was not found. Try /help for general help");
		}
	},
};
