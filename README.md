# tsc-resolve
[![Build Status](https://travis-ci.org/mazhlekov/tsc-resolve.svg?branch=master)](https://travis-ci.org/mazhlekov/tsc-resolve)

A tool for resolving typescript modules defined in tsconfig.json.

## Why tsc-resolve?


## Installation
```bash
# Local package
$ npm i tsc-resolve --save-dev

# Global CLI
$ npm i -g tsc-resolve 
```

## Usage
### NPM task
```bash
$ npm i tsc-resolve --save-dev

"scripts": {
    "compile": "tsc",
    "build": "compile && tsc-resolve"
}

$ npm run build
```

### CLI
```bash
$ npm i -g tsc-resolve

$ tsc-resolve
$ tsc-resolve -p tsconfig.prod.json
$ tsc-resolve -p ./conf/tsconfig.dev.json
$ tsc-resolve -p ./conf/
$ tsc-resolve -p ../
```
    
### TypeScript
```typescript
import { tscResolve } from "tsc-resolve"
import * as path from "path"

// Simple ./tsconfig.json
const configPath = process.cwd();
tscResolve(configPath)
    .then(() => { /*DONE*/ });

// Specific tsconfig.json
const configPath = path.join(process.cwd(), "tsconfig.prod.json");
tscResolve(configPath)
    .then(() => { /*DONE*/ });

// Specific tsconfig.json in different folder
const configPath = path.resolve(process.cwd(), "../conf/tsconfig.dev.json");
tscResolve(configPath)
    .then(() => { /*DONE*/ });

// Async/Await
const configPath = process.cwd();
await tscResolve(configPath);
```

### JavaScript
```javascript
const tscResolver = require("tsc-resolve");
const path = require("path");

// Simple ./tsconfig.json
const configPath = process.cwd();
tscResolve(configPath)
    .then(() => { /*DONE*/ });

// Specific tsconfig.json
const configPath = path.join(process.cwd(), "tsconfig.prod.json");
tscResolve(configPath)
    .then(() => { /*DONE*/ });

// Specific tsconfig.json in different folder
const configPath = path.resolve(process.cwd(), "../conf/tsconfig.dev.json");
tscResolve(configPath)
    .then(() => { /*DONE*/ });

// Async/Await
const configPath = process.cwd();
await tscResolve(configPath);
```