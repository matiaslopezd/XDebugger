![XDebugger](https://user-images.githubusercontent.com/23618492/57747590-348ed200-76a4-11e9-8832-ae7b7ed352fb.png)

**A very lightweight library to create a production debugger with custom errors readable for humans. Includes errors in table format, logger and search methods with dynamic filters.**

![size](https://img.shields.io/bundlephobia/min/xdebugger) ![license](https://img.shields.io/github/license/matiaslopezd/XDebugger) ![version](https://img.shields.io/npm/v/xdebugger) ![quality](https://img.shields.io/codacy/grade/a972df046eb545898ade3fd7d1381beb)

This library with zero dependencies was designed for debug/capture errors in development or production environment and obtain errors in background, with a readable format for any developer, also can disable console logs any time.

1. [Demos](#demos)
2. [Installation](#installation)
3. [How to use](#how-to-use)
  - [Basic Initialization](#basic-initialization)
  - [Log](#how-log)
  - [Listen global errors](#how-to-listen-errors)
  - [Get logs](#how-to-search--filter-logs)
  - [Search / Filter logs](#how-to-search--filter-logs)
    - [$eq](#eq-search)
    - [$cnt](#cnt-search)
    - [$lte](#lte-search)
    - [$lt](#lt-search)
    - [$gte](#gte-search)
    - [$gt](#gt-search)
  - [Send logs to API](#how-set-and-send-log-per-log-to-a-api)
  - [Export and download logs](#how-export-and-download-logs)
  - [View logs in console](#how-console-logs-in-readable-format)
  - [Clean logger](#how-to-clean-debugger)
  - [Default data of logs](#how-set-default-data)
  - [Set max logs and size](#how-set-max-records-and-size-of-values-log)

## Demos
- [Simple initialization](https://matiaslopezd.github.io/XDebugger/examples/generate)
- [Custom initialization](https://matiaslopezd.github.io/XDebugger/examples/custom_init)

## Installation
npm installation:
```js
npm i xdebugger
```
Or without npm:
```html
<!-- In development environment -->
<script src="xdebugger.js"></script>

<!-- In production environment -->
<script src="xdebugger.min.js" async></script>

```

## How to use

Use XDebugger is really easy and very flexible, it's possible define `debug`, `log`, `datatypes`, `action`, `default` and `max` variables for different logs requirements.

Can use for debug development or in production website. Also if you want for example can load debug parameters via API, like `{ debug: true, log: false }` and obtain errors or custom logs if you set.

In case use npm:
```js
import XDebugger from 'xdebugger';
```

## Basic initialization

```javascript
// In development environment
const debug = new XDebugger({ debug: true, log: true });

// In production environment
const debug = new XDebugger({ debug: true });

```

Set `{ log: false }` disable completely console. That's mean XDebugger, clean console for not show any log, info, warn, table and error. If try log anything console show:

```javascript
  Console was cleared
> console.log("Try write something like this");
"Developer mode is disabled."
```


## How log

You can log any data you want, also XDebugger add by default `time` as _String_ and `timestamp` format as _Number_.

```javascript
// Obviously you need initialize before!!
// Example log =>

debug.log({
  message: `${value} is not a valid data type`,
  code: 150,
  explanation: `The variable was evaluated and is not valid, typeof ${value}: ${typeof value}.`,
  response: `Change to ${this._datatypes.toString()} data type.`,
  error: `Value expect a ${this._datatypes.toString()} and recieve ${typeof value}`,
})
```

## How to listen errors
```javascript
window.onerror = (message, url, line, col, err) => debug.log(debug.onerror(message, url, line, col, err));
```

## How to get logs

```javascript
debug.logged

// Output =>
> [{..}]
```

## How to search / filter logs

Search was based in MongoDB queries for filter. XDebugger have 6 types of filters:

 - `$eq`: Match value of log key with query value key
 - `$cnt`: Contains value of log key with query value key
 - `$lte`: Less or equal value of log key with query value key
 - `$gte`: More or equal value of log key with query value key
 - `$lt`: Less value of log key with query value key
 - `$gt`: More value of log key with query value key
 
### `$eq` search

```javascript
// Implicit search
debug.search({
  timestamp: 1556528447311,
  code: 105
});

// Explicit search
debug.search({
  timestamp: {
    $eq: 1556528447311
  },
  code: 401
});
```

### `$cnt` search

```javascript
debug.search({
  error: {
    $cnt: "filter"
  },
  internalCode: 9224
});
```

### `$lte` search

```javascript
debug.search({
  timestamp: {
    $lte: 1556528447311
  },
  code: 105
});
```

### `$lt` search

```javascript
debug.search({
  timestamp: {
    $lt: 1556528447311
  },
  browser: "Google Chrome"
});
```

### `$gte` search

```javascript
debug.search({
  timestamp: {
    $gte: 1556528447311
  },
  version: 12.1
});
```

### `$gt` search

```javascript
debug.search({
  timestamp: {
    $gt: 1556528447311
  },
  name: "John Doe",
  idUser: "507f191e810c19729de860ea"
});
```

## How set and send log per log to a API
```javascript
const debug = new Debugger({ debug: true, action: (log) => {
    // Here your code to POST log
  } 
});
```

## How export and download logs

You can export all logs and download in a `JSON` file.

```javascript
debug.export();
```

Also can export filtered logs as follow:

```javascript
debug.export(debug.search({
  code: 105,
  browser: "Brave"
}));
```

## How console logs in readable format

The `view` function accept `Array` or `Object`, that mean one or more logs.

```javascript
debug.view(debug.logged);
```
## How to clean debugger

This clean logger and console.

```javascript
debug.clean();
```
## How set default data

`default` key in object initialization parameter allow set default data like browser, version, internalCode, etc.

```javascript
// 'library' as third party source functionality

const debug = new XDebugger({ debug: true, default: {
  browser: library.browser.name,
  version: library.browser.version,
  language: library.browser.lang,
  ...
}});
```

Also you can rewrite default `time` and `timestamp`:

```javascript
const debug = new XDebugger({ debug: true, default: {
  time: mycustomtime.toString(),
  timestamp: mycustomtime.getTime(),
}});
```

### How set max records and size of values log

- `length`: set the max records logger can save
- `size`: set the max size value of log allowed in MB, Ex: `{ key: "value value value value value value value " } => 80 Bytes`

```javascript
const debug = new XDebugger({ debug: true, default: {
  max: {
    length: 60,
    size: 100
  }
}});
```

## `datatypes` Not tested yet!!

Define allowed data type of log value.

Not tested with functions or other data type.

> By default it allow `number`, `string`, `object`.


**Try not use complex schema with console.table, that lose the readable format**
