# XDebugger :postbox:

**A very lightweight library to create a production debugger with custom errors readable for humans. Includes errors in table format, logger and search methods with dynamic filters.**

This library was destinated for debug in production and obtain errors in background, in readable format for any developer. Also can disable console logs any time.

# Installation :cd:
```html
<!-- In development environment -->
<script src="xdebugger.js"></script>

<!-- In production environment -->
<script src="xdebugger.min.js" async></script>

```

# How to use :fire:

Use XDebugger is really easy and very flexible, it's possible define `debug`, `log`, `datatypes`, `action`, `default` and `max` variables for different logs requirements.

Can use for debug development or in production website. Also if you want for example can load debug parameters via API, like `{ debug: true, log: false }` and obtain errors or custom logs if you set.

## Basic initilize :wrench:

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


## How log :inbox_tray:

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

## How to listen errors :fax:
```javascript
window.onerror = (message, url, line, col, err) => debug.log(debug.onerror(message, url, line, col, err));
```

## How to get logs :mailbox_with_mail:

```javascript
debug.logged

// Output =>
> [{..}]
```

## How to search / filter logs :mailbox_closed:

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

## How set and send log per log to a API :outbox_tray:
```javascript
const debug = new Debugger({ debug: true, action: (log) => {
    // Here your code to POST log
  } 
});
```

## How export and download logs :outbox_tray:

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

## How console logs in readable format :bar_chart:

The `view` function accept `Arrays` or `Object`, that mean one or more logs.

```javascript
debug.view(debug.logged);
```
## How to clean debugger :mailbox_with_no_mail:

This clean logger and console.

```javascript
debug.clean();
```
## How set default data :bookmark_tabs:

`default` key in object initialization parameter allow set default data like browser, version, internalCode, etc.

```javascript
const debug = new XDebugger({ debug: true, default: {
  browser: () => // Function for get browser,
  version: () => // Function for get browser version,
  language: () => // Function for get user lang,
  ...
}});
```

Also you can rewrite default `time` and `timestamp`:

```javascript
const debug = new XDebugger({ debug: true, default: {
  time: () => // Function API time,
  timestamp: () => Function API time,
}});
```

### How set max records and size of values log :straight_ruler:

- `length`: set the max records logger can save
- `size`: set the max size in MB allow values log, Ex: `{ key: "value value value value value value value " } => 80 Bytes`

```javascript
const debug = new XDebugger({ debug: true, default: {
  max: {
    length: 60,
    size: 100
  }
}});
```

## `datatypes` Not tested yet!! :heavy_exclamation_mark:

Define allow data type of log value.

Not tested with functions or other data type.

Now allow `number`, `string`, `object`.


**Try not use complex schema with console.table, that lose the readable format**
