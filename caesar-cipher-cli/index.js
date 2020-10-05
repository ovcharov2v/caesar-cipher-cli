const path = require('path');
const fs = require('fs');
const {
	pipeline,
	Transform
} = require('stream');

const chalk = require('chalk');
const minimist = require('minimist');

const encryption = require('./encription')


//Args setup
var args = minimist(process.argv.slice(2), {
	string: 'shift',
	string: 'input',
	string: 'output',
	string: 'action',
	alias: {
		"shift": "s",
		"input": "i",
		"output": "o",
		"action": "a"
	}
})

//Check required arguments
if (['encode', 'decode'].indexOf(args.action) == -1) {
	console.error(chalk.red('Valid action required!'));
	console.error(chalk.gray('-a <encode||decode>, --action <encode||decode>'));
	process.exit(0);
}
if (!Number.isInteger(args.shift)) {
	console.error(chalk.red('Valid shift required!'));
	console.error(chalk.gray('-s <positive number>, --shift <positive number>'));
	process.exit(0);
}

//Encode/decode mode
let shift = ((args.action == 'encode') ? args.shift : -args.shift);

//Console input
if (!args.input || !args.output) {
	process.stdin.setEncoding('utf8');
	console.log(chalk.greenBright('Enter text to ', args.action, ':'))

	process.stdin.on('readable', () => {
		var str = process.stdin.read();
		if (str !== null) {
			console.log(chalk.greenBright(encryption(str, shift)))
		}
	});
}

//File input
else {
	//Input file
	const inputFile = path.resolve(__dirname, args.input);
	let inputStream;

	fs.access(inputFile, fs.constants.R_OK, (err) => {
		if (err) {
			console.error(chalk.red('Can\'t read file ', inputFile));
			process.exit(0);
		} else inputStream = fs.createReadStream(inputFile, 'utf-8').on('open', () => {

			//Output file
			const outputFile = path.resolve(__dirname, args.output);
			let outputStream;

			fs.access(outputFile, fs.constants.W_OK, (err) => {
				if (err) {
					console.error(chalk.red('Can\'t write to file ', outputFile));
					process.exit(0);
				} else outputStream = fs.createWriteStream(outputFile, {
					flags: 'a'
				}).on('open', () => {
					const transformStream = new Transform ({
						transform(chunk, encoding, callback) {
							const str = new TextDecoder().decode(chunk);
							this.push(encryption(str, shift));
							callback();
						}
					});

					//Encode/decode process
					pipeline(
						inputStream,
						transformStream,
						outputStream,
						(err) => {
							if (err) {
								console.error(chalk.red('Failed to ', args.action, ': '), err);
							} else {
								console.log(chalk.greenBright('Success ', args.action, ' file ', args.input, ', see result in file ', args.output));
							}
						}
					)
				})
			})
		})
	})
}