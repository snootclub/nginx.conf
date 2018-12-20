let shell = require("./shell.js")

exports.checkYourPrivilege = function () {
	return process.getuid() === 0
}

exports.checkUserExists = async function checkUserExists (snoot) {
	return !(await shell.run(`id -u ${snoot}`)).code
}

let createOptionString = options =>
	Object.values(options).reduce((string, name, value) => {
		let key = name.length > 1
			? `--${name}`
			: `-${name}`
		return string.concat(`${key} ${value}`)
	}, "")

	exports.createUser = async function createUser ({
		user,
		homeDirectory,
		groups
	}) {
		let {
			code,
			stdout,
			stderr
		} = await shell.run(
			[
				"useradd -m",
				createOptionString({
					d: homeDirectory,
					g: groups[0],
					G: groups.join(","),
					s: "/bin/no-login"
				}),
				user
			],
			{sudo: true}
		)

	return code
		? Promise.reject(stderr)
		: stdout
}

exports.chown = async function chown ({directory, user, group = user}) {
	return shell.run(
		`chown -R ${user}.${group} ${directory}`,
		{sudo: true}
	)
}

exports.chmod = async function chmod ({mode, directory}) {
	return shell.run(
		`chmod -R ${mode} ${directory}`,
		{sudo: true}
	)
}
