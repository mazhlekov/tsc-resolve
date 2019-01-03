# tsc-wildcard-resolve
## A tool for resolving typescript modules defined in tsconfig.json

## Installation
```bash
# Local package
$ npm i tsc-wildcard-resolve --save-dev

# Global CLI
$ npm i -g tsc-wildcard-resolve
```

## Usage
### NPM task
```bash
$ npm i tsc-wildcard-resolve --save-dev

"scripts": {
    "compile": "tsc",
    "build": "compile && tsc-wildcard-resolve"
}

$ npm run build
```
### CLI
```bash
$ npm i -g tsc-wildcard-resolve

$ tsc-wildcard-resolve
$ tsc-wildcard-resolve -p tsconfig.prod.json
$ tsc-wildcard-resolve -p ./conf/tsconfig.dev.json
$ tsc-wildcard-resolve -p ./conf/
$ tsc-wildcard-resolve -p ../
```

### TypeScript
```typescript
import { tscResolve } from "tsc-wildcard-resolve"
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
const tscResolver = require("tsc-wildcard-resolve");
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