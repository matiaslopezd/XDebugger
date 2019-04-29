# XDebugger

**A very lightweight library to create a production debugger with custom errors readable for humans. Includes errors in table format, logger and search methods with dynamic filters.**

This library was destinated for debug in production and obtain errors in background, in readable format for any developer. Also can disable console logs any time.

# Installation
```html
<!-- In development environment -->
<script src="xdebugger.js"></script>

<!-- In production environment -->
<script src="xdebugger.min.js" async></script>

```

# How to use

Use XDebugger is really easy and very flexible, it's possible define `debug`, `log`, `datatypes`, `action`, `default` and `max` variables for different logs requirements.

## Basic initilize

```javascript
// In development environment
const debug = new XDebugger({ debug: true, log: true });

// In production environment
const debug = new XDebugger({ debug: true });

```

Set `{ log: false }` deactivate complete console. That's mean XDebugger, clean console for not show any log, info, warn, table and error. If try log anything console show:

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

The `view` function accept `Arrays` or `Object`, that mean one or more logs.

```javascript
debug.view(debug.logged);
```
## How to clean debugger

This clean logger and console.

```javascript
debug.clean();
```


