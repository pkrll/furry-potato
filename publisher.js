'use strict'
const fs = require('fs');
const color = require('./.support/color.js')();

const paths = {
	DRAFTS: "./drafts/",
	STATIC: "./static/"
};

class Publisher {

	static start(indexFile, option) {
		const publisher = new Publisher(indexFile);
		publisher.run();
	}

	constructor(indexFile) {
		this.indexFile = indexFile;
	}

	processFile(input) {
		const data  = fs.readFileSync(input, 'utf8');
		const lines = data.split("\n").filter( (element) => element != '');
    const meta  = {
			title: (lines.length > 1) ? lines[0].slice(2) : 'N/A',
			summary: (lines.length > 2) ? lines[2] : 'N/A'
		};

		return meta;
	}

	run(option) {
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		});

		fs.readdir(paths.DRAFTS, (err, data) => {
			const files = data.filter(file => file.endsWith(".md"));

			if (files.length == 0) {
				color.print("No unpublished files found.", color.colors.red);
				process.exit(-1);
			}

			for (let index in files) {
				const fileNum  = parseInt(index) + 1;
				const fileName = files[index];
				color.print(fileNum + ". " + fileName, color.colors.green);
			}

			readline.question("\nSelect a file to publish (or 'a' to abort): ", (index) => {
				readline.close();
				if (index == 'a') process.exit(-1);
				this.selectFile(files, parseInt(index))
			});
		});
	}

	selectFile(files, index) {
		if (index > files.length) {
			color.print("Invalid selection!", color.colors.red);
			process.exit(-1);
		}

		const filePath = paths.DRAFTS + files[index - 1];
		this.publish(filePath);
	}

	publish(filePath) {
		const date = new Date();

		const metadata = this.processFile(filePath);
		metadata.date  = date.toJSON();
		metadata.path  = paths.STATIC;
		metadata.name  = filePath.substr(filePath.lastIndexOf('/') + 1);

		fs.readFile(this.indexFile, (err, data) => {
			if (err) throw err;

			let content = JSON.parse(data);
			content.posts.unshift(metadata);

			fs.writeFile(this.indexFile, JSON.stringify(content, null, 2), (err) => {
				if(err) throw err;

				this.move(filePath, metadata.path + metadata.name);
			});
		});
	}

	move(oldPath, newPath) {
		fs.rename(oldPath, newPath, (err) => { if (err) throw err; });
	}

}

const option = (process.argv.length > 2) ? process.argv[2] : null;

Publisher.start("index.json", option);
