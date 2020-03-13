const Discord = require("discord.js");
const client = new Discord.Client();
const messageHandler = require("./messageHandler.js")
const config = require("./config.json");

client.on("ready", () => {
	console.log(`Bot has started.`);
})

client.on("message", async message => {
	messageHandler.receive(message);
})

client.login(config.token);