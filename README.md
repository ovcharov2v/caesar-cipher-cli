# Caesar cipher CLI tool
## Installation
```
git clone https://github.com/ovcharov2v/caesar-cipher-cli.git
npm i
```
## Usage
#### Console mode
```
node caesar-cipher-cli/index.js -a encode -s 1
node caesar-cipher-cli/index.js --action decode --shift 1
```
#### File mode
```
node caesar-cipher-cli/index.js -a encode -s 1 -i input.txt -o output.txt
node caesar-cipher-cli/index.js --action decode --shift 1 --input input.txt --output output.txt
```
## Params
```
-s, --shift: cipher shift (required)
-a, --action: encode/decode action (required)
-i, --input: input file
-o, --output: output file
```