<div align="center">
<img src="./assets/icon.svg" height="200px" width="200px" />
<h1>a11yscore</h1>
</div>

> In active development, will not be ready to use till this message disappears.

A script to score websites as per their accessibility. 3 tools are being used and averaged so that we don't miss out on any features. If i see that long term something is getting too redundant, I'll get rid of it.

Powered by
|Company| Tool|
|---|---|
|Deque Systems| Axe|
|IBM| Karma|
|Independent | Pa11y|

Later we will not use `Google Lighthouse` since under the hood it basically uses `axe-core`, but right now thats basically what we are doing.

## Usage
```bash
$ node ./run.js
$ bun ./process.js
```

## Setup
```bash
$ npm install -g accessibility-checker
```

## Usages
### Deque Systems Axe
```bash
$
```

### IBM Accessibility Checker
```bash
$ accessibility-checker https://www.nic.in/ --output-file nic.json
```

### Pa11y
```bash
$
```