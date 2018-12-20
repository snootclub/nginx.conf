let path = require("path")

module.exports = directory => (file, ...files) => {
  let filepath = path.resolve(directory, file)

  if (files.length) {
    return path.resolve(filepath, ...files)
  }

  return filepath
}