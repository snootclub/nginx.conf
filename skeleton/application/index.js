const serve = require("serve-handler")

const serveOptions = {
	public: "website",
	cleanUrls: true,
	renderSingle: true
}

module.exports = async (request, response) =>
	await serve(request, response, serveOptions)
