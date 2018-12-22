#!/usr/bin/env sudo node
let yargs = require("yargs")
let createSnoot = require("./commands/create-snoot.js")
let enterSnoot = require("./commands/enter-snoot.js")
let get = require("./commands/get.js")

let arguments = yargs
	.command(["new", "create"], "create a new snoot", () => {}, createSnoot)
	.command("enter <snoot>", "enter a snoot's docker container", yargs => {
		yargs.positional("snoot", {
			describe: "the name of the snoot you'd like to enter"
		})
	}, enterSnoot)
	.command("get <snoot> <key>", "get snoot data", yargs => {
		yargs
			.positional("name", {
				describe: "the name of the snoot you want data on"
			})
			.positional("key", {
				describe: "the key for the data you'd like to see"
			})
			.help()
	}, get)
	.argv
