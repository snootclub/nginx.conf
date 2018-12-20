let fs = require("fs-extra")
let createResolver = require("./create-path-resolver.js")
let unix = require("./unix.js")
let skeletons = require("./skeletons.js")

let directory = "snoots"
let chrootDirectory = "/snoots"

let resolver = createResolver(directory)
let chrootResolver = createResolver(chrootDirectory)

let applicationResolver = (snoot, ...paths) =>
	resolver(snoot, "application", ...paths)

let websiteResolver = (snoot, ...paths) =>
	resolver(snoot, "application", "website", ...paths)
async function createChrootSshConfiguration (snoot, {authorizedKeys}) {
	let sshDirectoryResolver = resolver(snoot, ".ssh")
	await fs.outputFile(
		sshDirectoryResolver("authorized_keys").path,
		authorizedKeys
	)

	await unix.chmod({
		mode: 755,
		directory: sshDirectoryResolver.path
	})

	await unix.chown({
		directory: sshDirectoryResolver.path,
		user: "root"
	})
}

async function createUnixAccount (snoot) {
	return unix.createUser({
		user: snoot,
		groups: ["common", "undercommon"],
		homeDirectory: chrootResolver("snoot").path
	})
}

async function createBaseApplication (snoot, options = {}) {
	let {
		authorizedKeys = "",
		sshPort = 22222,
		webPort = 22333
	} = options

	skeletons.write(
		resolver(snoot),
		render => render({
			snoot,
			snootRoot: resolver.path,
			authorizedKeys,
			sshPort,
			webPort
		})
	)
}

module.exports = {
	directory,
	chrootDirectory,
	resolver,
	chrootResolver,
	applicationResolver,
	websiteResolver,
	createChrootSshConfiguration,
	createUnixAccount,
	createBaseApplication
}
