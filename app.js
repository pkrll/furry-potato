'use strict'
const fs = require('fs');

function printUsage() {
	console.log("Usage: node " + process.argv[1] + " [markdown file]");
	process.exit(0);
}

function processFile(input) {
	const data  = fs.readFileSync(input, 'utf8');
	const lines = data.split("\n").filter( (el) => el != '');

	return {title: lines[0].slice(2), summary: lines[2]};
}

function start(indexFile) {
	const argc = process.argv.length;
	if (argc < 3) printUsage();

	const inputFile = process.argv[2];
	const metadata  = processFile(inputFile);

	const date = new Date();
	metadata.date = date.toJSON();

	fs.readFile(indexFile, (err, data) => {
		if (err) throw err;

		let content = JSON.parse(data);
		content.posts.unshift(metadata);

		fs.writeFile(indexFile, JSON.stringify(content, null, 2), function(err) {
			if(err) throw err;
		});
	});
}

start("index.json");
