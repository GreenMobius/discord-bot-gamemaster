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
        var user = message.author.id;

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;

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
                    'owner' : message.author.id,
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
                //check permissions for game viewing
                //display list of games

            // !join <id>
            case 'join':
                //check permissions to join game
                //check if game is full
                //display success/fail message
            
            // !leave <id>
            case 'leave':
                //check if in game
                //display success/fail message

            // !remove <id>
            case 'remove':
                //check permissions for admin / game owner
                //remove game from list
                //display success/fail message

            // !start <id>
            case 'start':
                //check permissions for admin / game owner
                //remove game from list
                //notify all players game is beginning
                //display success/fail message

            // !help
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