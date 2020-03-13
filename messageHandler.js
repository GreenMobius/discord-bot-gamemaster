function receive(message) {
	if(message.author.bot) return
	if(message.content.indexOf(config.prefix) !== 0) return

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()

	return message.reply("received message!")
}