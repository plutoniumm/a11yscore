# a11yscore
A local piece of code to score websites as per their accessibility. 4 tools are being used and averaged so that we don't miss out on any features. If i see that long terms its getting too redundant, I'll get rid of what I feel is redundant.

> please ignore `/out`, its just a data dump and isn't meant to be human readable.

Powered by
|Company| Tool|
|---|---|
|Google| Lighthouse|
|Deque Systems| Axe|
|IBM| Accessibility Checker|
|Independent | Pa11y|

## Setup
```bash
$ npm install -g lighthouse # Needs Google Chrome
$ npm install -g accessibility-checker
```

## Usages
### Google Lighthouse
```bash
$ lighthouse https://www.nic.in/ --output json --output-path nic.json
```

### Deque Systems Axe

### IBM Accessibility Checker
```bash
$ accessibility-checker https://www.nic.in/ --output-file nic.json
```

### Pa11y

## Technical
General Process
```mermaid
graph LR
A[Fetch HTML] --> A2[Convert to InputFormat]
A2 --> B[Run Checker]
B --> C[Convert to JSON]
C --> D[Score]

CryInFreeTime
```

<!--
https://www.nic.in/
 -->