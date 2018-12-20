let fs = require("fs-extra")
let createResolver = require("./create-path-resolver.js")

let directory = "snoots"
let chrootDirectory = "/snoots"

let resolve = createResolver(directory)
let chrootResolve = createResolver(chrootDirectory)

function createDirectoryFor (snoot) {
  return fs.mkdirp(resolve(snoot))
}

let applicationResolve = (snoot, ...paths) =>
  resolve(snoot, "application", ...paths)

let websiteResolve = (snoot, ...paths) =>
  resolve(snoot, "application", "website", ...paths)

module.exports = {
  directory,
  chrootDirectory,
  createDirectoryFor,
  resolve,
  chrootResolve,
  applicationResolve,
  websiteResolve
}