var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// variables
var games = {};

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // commands execute with a '!' prefix
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var user = message.author;

        args = args.splice(1);
        switch(cmd) {
            // !new <id> <game> <maxplayers> <year> <month> <day> <hours> <minutes> <message>
            case 'new':
                //TODO: check permissions for game creation
                //add game to game dictionary with key=id
                if(games[args[1]] === null) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Error: a game with ' + args[1] + ' already exists. Game was not created.'
                    });
                    break;
                }

                //compile the remaining arguments into a message
                var rest = '';
                var i;
                for(i = 9; i < args.length; i++) {
                    rest += args[i];
                    rest += ' ';
                }
                rest = rest.substring(0, rest.length - 1);

                games[args[1]] = {
                    'game' : args[2],
                    'maxplayers' : args[3],
                    'date' : new Date(args[4], args[5], args[6], args[7], args[8], 0, 0),
                    'owner' : user,
                    'message' : rest,
                    'players' : [user],
                    'started' : false,
                    'finished' : false
                };
                //display success/fail message

                bot.sendMessage({
                    to: channelID,
                    message: 'Game of ' + games[args[1]].game + ': ' + args[1] + ' created by ' + message.author.username + ' for ' + games[args[1]].date
                });
                break;
            
            // !games
            case 'games':
                //TODO: check permissions for game viewing

                //display list of games
                //create embed
                const embeddedMessage = new Discord.RichEmbed()
                    .setTitle("Upcoming games:")
                    .setColor([0, 166, 14]);

                //populate embed with games
                Object.keys(games).foreach(function(key) {
                    //only display games not started
                    if(games[key].started) {
                        continue;
                    }
                    //generate array of usernames from users
                    var playerList = [];
                    games[key].players.foreach(function(user) {
                        playerList.push(user.username);
                    })

                    embeddedMessage.addField(
                        key + ":",
                        "Type : " + games[key].game + "\n" +
                        "# Players / Max : " + games[key].players.length + "/" + games[key].maxplayers + "\n" +
                        "Date : " + games[key].date + "\n" +
                        "Owner : " + games[key].owner.username + "\n" +
                        "Players : " + playerList + "\n"
                    );
                });
                //send message
                message.channel.send({embed});
                break;

            //TODO !join <id>
            case 'join':
                //TODO: check permissions to join game

                var game = games[args[1]];

                //check if game id exists
                if(game === null) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Error: Game ' + args[1] + ' does not exist. No game joined.'
                    });
                    break;
                }

                //check if game is full
                if(game.maxplayers === game.players.length) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Error: Game ' + args[1] + ' is full. No game joined.'
                    });
                    break;
                }

                //add user to game
                game.players.push(message.author);

                //display success message
                bot.sendMessage({
                    to: channelID,
                    message: 'Joined game ' + args[1] + '.'
                });
                break;
            
            // !leave <id>
            case 'leave':
                var game = games[args[1]];

                //check if game id exists
                if(game === null) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Error: Game ' + args[1] + ' does not exist. No game left.'
                    });
                    break;
                }

                //check if in game
                if(game.players.indexOf(message.author) == -1) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Error: You are not a part of game ' + args[1] + '. No game left.'
                    });
                    break;
                }

                //remove from list
                game.players.remove(message.author);

                //display success message
                bot.sendMessage({
                    to: channelID,
                    message: 'Successfully left game ' + args[1] + '.'
                });
                break;

            //TODO !remove <id>
            case 'remove':
                //TODO: check permissions for admin / game owner
                //remove game from list
                //display success/fail message

            //TODO !start <id>
            case 'start':
                //TODO: check permissions for admin / game owner
                //remove game from list
                //notify all players game is beginning
                //display success/fail message

            //TODO !help
            case 'help':
                //display help

            //invalid command
            default:
                //error message
                bot.sendMessage({
                    to: channelID,
                    message: 'Sorry, this isn\'t a valid command. Use !help for a list of all commands.'
                });
         }
     }
});