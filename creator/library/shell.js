let sudoSpawn = require("sudo")
let spawn = require("child_process").spawn

exports.run = function run (command, options = {}) {
	let {
		sudoPrompt = "could i get your password for sudo pls?",
		sudo = false,
		cwd,
		env,
	} = options

	let spawnOptions = {
		cwd,
		env
	}

	let sudoSpawnOptions = {
		cachePassword: true,
		prompt: sudoPrompt,
		spawnOptions
	}

	let [name, ...args] = typeof command == "string"
		? command.split(/\s+/)
		: command

	let child = sudo
		? sudoSpawn([name, ...args], sudoSpawnOptions)
		: spawn(name, args, spawnOptions)

	let buffergoo = []
	let badbadbuffergoo = []

	let push = array => data => array.push(data)

	child.stdout.on("data", data => push(buffergoo))
	child.stderr.on("data", data => push(badbadbuffergoo))

	return new Promise((resolve, reject) => {
		child.on("close", code =>
			resolve({
				code,
				stdout: Buffer.concat(buffergoo),
				stderr: Buffer.concat(badbadbuffergoo)
			})
		)
	})
}

exports.handle = ({code, stdout, stderr}) =>
	code
		? Promise.resolve({code, stdout, stderr})
		: Promise.reject({code, stdout, stderr})