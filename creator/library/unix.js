let {log, warn} = require("./loggo.js")
let shell = require("./shell.js")
let fs = require("fs-extra")
let snoots = require("./snoots.js")
let createResolver = require("./create-path-resolver.js")

let snootGroups = [
	"common",
	"undercommon"
]

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

exports.createUser = async function createUser (snoot) {
	let snootHomeDirectory = snoots.chrootResolve(snoot)

	let {
		code,
		stdout,
		stderr
	} = await shell.run(
		[
			"useradd -m",
			createOptionString({
				d: snootHomeDirectory,
				g: snootGroups[0],
				G: snootGroups.join(","),
				s: "/bin/no-login"
			}),
			snoot
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

exports.createSnootSshConfiguration = async function createUserSshDirectory (snoot, authorizedKeys) {
	let resolve = createResolver(snoot)
	await fs.outputFile(
		resolve(".ssh", "authorized_keys"),
		authorizedKeys
	)

	let sshDirectory = resolve(".ssh")

	await shell.run(
		`chmod -R 755 ${sshDirectory}`,
		{sudo: true}
	)

	await exports.chown({
		directory: sshDirectory,
		user: "root"
	})
}