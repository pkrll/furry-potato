'use strict'
const fs = require('fs');
const color = require('./.support/color.js')();

const paths = {
	DRAFTS: "drafts/",
	STATIC: "static/",
	IMAGES: "static/images/"
};

class Publisher {

	static start(indexFile, option) {
		const publisher = new Publisher(indexFile);
		publisher.run();
	}

	constructor(indexFile) {
		this.indexFile = indexFile;
	}

	run(option) {
		const draft = this.selectDraft();
		const image = this.selectImage();
		const summary = this.readLine("\nWrite a short summary: ");

		const filePath  = paths.DRAFTS + draft;
		const imagePath = paths.IMAGES + image;

		const date = new Date();

		const metadata = this.processFile(this.filePath);
		metadata.date  = date.toJSON();
		metadata.path  = paths.STATIC;
		metadata.name  = filePath.substr(filePath.lastIndexOf('/') + 1);
		metadata.image = imagePath;
		metadata.summary = summary;

		this.publish(metadata);
	}

	selectDraft() {
		const files = this.listDirectory(paths.DRAFTS, ".md");

		if (files.length == 0) this.printError("No unpublished files found");

		this.printFiles(files);
		const question = "\nSelect a file to publish (or 'a' to abort): ";
		const index = this.readLine(question);

		if (index == 'a') process.exit(-1);
		if (index > files.length) this.printError("Invalid selection!");

		return files[index - 1];
	}

	selectImage() {
		const files = this.listDirectory(paths.IMAGES, "");

		if (files.length == 0) this.printError("No images found");

		color.print("0. None", color.colors.green);

		this.printFiles(files);
		const question = "\nSelect a cover image (or 'a' to abort): ";
		const index = this.readLine(question);

		if (index == 'a') process.exit(-1);
		if (index > files.length) this.printError("Invalid selection!");

		return files[index - 1];
	}

	publish(metadata) {
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

	listDirectory(path, fileExtension) {
		let files = fs.readdirSync(path);
		files = files.filter(file => file.endsWith(fileExtension));

		return files;
	}

	printFiles(files) {
		for (let index in files) {
			const fileNum  = parseInt(index) + 1;
			const fileName = files[index];
			color.print(fileNum + ". " + fileName, color.colors.green);
		}
	}

	readLine(question) {
		const stdin = require('readline-sync');
		const input = stdin.question(question);

		return input;
	}

	processFile(input) {
		const data  = fs.readFileSync(input, 'utf8');
		const lines = data.split("\n").filter( (element) => element != '');
		const meta  = {
			title: (lines.length > 1) ? lines[0].slice(2) : 'N/A',
		};

		return meta;
	}

	move(oldPath, newPath) {
		fs.rename(oldPath, newPath, (err) => { if (err) throw err; });
	}

	printError(error) {
		color.print(error, color.colors.red);
		process.exit(-1);
	}

}

const option = (process.argv.length > 2) ? process.argv[2] : null;

Publisher.start("index.json", option);
