let inquirer = require("inquirer")
let fetch = require("make-fetch-happen").defaults({
	cacheManager: "./.snootclub/fetch-cache"
})
let {log, warn, shout} = require("../library/loggo.js")
let unix = require("../library/unix.js")
let scaffold = require("../library/scaffold.js")

let validSnootRegex = /^[a-z][a-z0-9]{0,30}$/

function getKeysFromGithub (githubUsername) {
	log("gonna get them an authorized_keys file from github")

	return fetch(`https://github.com/${githubUsername}.keys`)
		.then(response => response.text())
}

module.exports = async function createSnoot () {
	let hasPrivilege = unix.checkYourPrivilege()

	if (!hasPrivilege) {
		// shout("oh no: not root")
		// log("this program needs to be run as root, because it does system things as different snoots")
		// log("i'm going to rerun this with sudo xxx")
		// console.log(process.argv.join(" "))
		// shell.run(process.argv.join(" "))
		log("this program needs elevated privileges, so i'll ask you for your password for sudo sometimes")
	}

	let {
		snoot,
		githubUsername
	} = await inquirer.prompt([
		{
			type: "input",
			name: "snoot",
			message: "oh, a new snoot? 💕 \nwhat's their name?",
			validate: snoot => validSnootRegex.test(snoot)
		},
		{
			type: "input",
			name: "githubUsername",
			message: "what is their github username?"
		}
	])

	let githubKeys = githubUsername
		? await getKeysFromGithub(githubUsername)
		: ""
	
	let {
		authorizedKeys,
		createUnixAccount
	} = await inquirer.prompt([
		{
			type: "editor",
			name: "authorizedKeys",
			message: "edit their authorized_keys",
			default: githubKeys
		}
	])

	if (await unix.checkUserExists(snoot)) {
		warn(`there's already a user called "${snoot}"!! i hope that's ok!`)
	} else {
		log("ok! creating them a unix user account on the computer")
		await unix
			.createUser(snoot)
			.catch(error => {
				shout("couldnt create user!")
				shout(error.toString())
				warn("creating them a directory in /snoots")
			})
	}

	log("adding their authorized_keys file so they can log in (:")
	await unix.createSnootSshConfiguration(snoot, authorizedKeys)

	scaffold(snoot)
}