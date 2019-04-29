const XDebugger = class {
  /*
   ** XDebugger - MIT License 2019
   ** A very lightweight class for create a production debbuger with a custom errors with a human readable table format,
   ** temp logger and search methods with dynamics filters.
   ** Version v0 .0 .1 - April 2019
   ** Develop for Videsk™ by Matias Lopez
   **
   ** ------------------------------------
   **
   ** Info Error suggested:
   ** Message: Short text about error, explanation, response, error by default, ex: Function expected
   ** Code: Public code number of error for identify, ex: 407
   ** Explanation: Large description about the captured error, ex: evaluator expect function and recieve a ${typeof}.
   ** Response: The solution for error, ex: Change the value by a function
   ** Error: Plain error, Ex: Uncaught TypeError: y is not a function
   */
  constructor(obj) {
    this._debug = obj.debug || false;
    this._log = obj.log || false;
    this._datatypes = obj.types || ['string', 'number', 'object'];
    this.logged = [];
    this._action = obj.action;
    this._default = obj.default || {};
    this._max = obj.max || { length: -1, size: 2000};
    // Initialize functions
    this.filters();
    this.init();
  }

  // eslint-disable-next-line class-methods-use-this
  log(obj) {
    // If obj is not definied create but empty
    obj = (!obj) ? {} : obj;
    // Add time
    obj.time = (!obj.time) ? new Date().toString() : obj.time;
    // Add timestamp
    obj.timestamp = (!obj.timestamp) ? new Date().getTime() : obj.timestamp;
    // Check if exist custom default data and add to obj
    if(Object.keys(this._default).length > 0){
      // If exist custom data add to obj
      Object.keys(this._default).map(async (key) => {
        // Await to finish checker type data
        obj[key] = await this.checker(this._default[key], (type) => {
          return this._default[key];
        });
      })
    }
    // Only log in console if debug is true
    if (this._debug && this._log) {
      this.view(obj);
    }
    if (this._debug) {
      // Push in temp tray
      if (this.logged.length <= this._max.length || this._max.length === -1) {
        this.logged.push(obj);
      }
    }
    if (typeof this._action === 'function' && this._debug) {
      // Execute custom function like send to API error or other action
      this._action(obj);
    }
    if(!this._log){
      // Clear all errors
      setTimeout(() => console.clear(), 100);
    }
  }

  view(obj){

    function consoleModel(obj) {
      // Log error and save in a temp tray
      console.error('⚠ New error captured, see more info in the follow table ↓');
      // Log table
      console.table(obj);
    }

    if(obj instanceof Array){
      obj.map((log) => {
        consoleModel(log);
      })
    }else if(obj instanceof Object) {
      consoleModel(obj);
    }
  }

  clean() {
    // Clean logged
    this.logged = [];
  }

  search(query) {
    // Return log filtered by query
    // Initilize filters
    // Create a temp array, mapped array and result
    const tempArray = [];
    // Check if key and query are correct data types
    if (typeof query === 'object' && Object.keys(query).length > 0) {
      Object.keys(query).map((key) => {
        // Get data type of value
        const type = this.checker(query[key]);
        // Get nested first key
        const nestedkey = Object.keys(query[key])[0] || null;
        // Get the function for filter
        const filter = (type === 'object') && window[nestedkey] || window['$eq'];
        // Get the value
        const value = (type === 'object') ? query[key][nestedkey] : query[key];
        // Create a schema of obj for filter
        const schema = {
          key,
          value
        };
        // Assign array with logs if exist filtered logs continue with that (tempArray) or start with logged (this.logged)
        const mappedArray = (tempArray.length > 0) ? tempArray : this.logged;
        // Start querying in the temp logger
        mappedArray.map(async (log) => {
          // Execute the dynamic filter function
          const result = await filter(log, schema);
          if (Object.keys(result).length > 0) tempArray.push(result);
        });
      });
    }
    return tempArray;
  }

  export (obj) {
    obj = (!obj) ? this.logged : obj;
    const a = document.createElement('a');
    const id = obj.id || Math.random().toString(36).substr(2, 5);
    const logs = obj.logs || this.logged;
    const today = new Date();
    const name = obj.name || `xdebugger_${today.getMonth()}-${today.getDate()}-${today.getFullYear()}_${id}`
    a.href = URL.createObjectURL(new Blob([JSON.stringify(logs)], {
      'json': `text/json`
    }));
    a.download = `${name}.json`;
    a.click();
  }

  init(){
    if(!this._log){
      window.console.log = function () {
        return 'Developer mode is disabled.';
      }
      window.console.error = function () {
        return 'Developer mode is disabled.';
      }
      window.console.table = function () {
        return 'Developer mode is disabled.';
      }
      window.console.warn = function () {
        return 'Developer mode is disabled.';
      }
      window.console.info = function () {
        return 'Developer mode is disabled.';
      }
    }
  }

  checker(value, callback) {
    // Check size of value
    this.checkSize(value, (size) => {
      // Allow max or equal to the limit size
      if(size <= this._max.size){
        // Create variable with type
        const type = typeof value;
        // Check if data type of the value is allowed
        if (this._datatypes.includes(type)) {
          // Execute function with type inside
          if (typeof callback === 'function') {
            callback(type);
          } else {
            return type;
          }
        } else if (!this._datatypes.includes(type) && this._debug) {
          if(this._log){
            // Log error if data type is not allowed
            // Log in console types allowed for developers
            console.error('Only allows the following types ↓');
            // Log table with allowed data types
            console.table(this._datatypes);
          }
          // Log in console table with not data type not allowed and explanation
          this.log({
            message: `${value} is not a valid data type`,
            code: 150,
            explanation: `The variable was evaluated and is not valid, typeof ${value}: ${typeof value}.`,
            response: `Change to ${this._datatypes.toString()} data type.`,
            error: `Value expect a ${this._datatypes.toString()} and recieve ${typeof value}`,
          });
        }
      } else {
        this.log({
          message: `Value error is to big`,
          code: 150,
          explanation: `The error is too big, the size is ${size} MB max allowed is ${this._max.size} MB.`,
          response: `Change to less than ${this._max.size} MB.`,
          error: `[Error is to big to display] Not allowed value size, is bigger than ${this._max.size} MB`,
        });
      }
    });
  }

  filters(){
    /*
     ** Filters of search
     ** eq: Match value of log key with query value key
     ** cnt: Contains value of log key with query value key
     ** lte: Less or equal value of log key with query value key
     ** lt: Less value of log key with query value key
     ** gte: More or equal value of log key with query value key
     ** gt: More value of log key with query value key
     */
    window.$eq = (log, obj) => {
      // Return only if value of key match
      return (log[obj.key] === obj.value) ? log : {};
    }

    window.$cnt = (log, obj) => {
      // Return only if value of key contain value
      return (log[obj.key].includes(obj.value)) ? log : {};
    }

    // Querying
    window.$lte = (log, obj)=> {
      let result = null;
      if (typeof obj.value === 'number') {
        result = (log[obj.key] <= obj.value) ? log : {};
      }
      return result;
    }

    window.$lt = (log, obj) =>{
      let result = null;
      if (typeof obj.value === 'number') {
        result = (log[obj.key] < obj.value) ? log : {};
      }
      return result;
    }

    window.$gt = (log, obj) =>{
      let result = null;
      if (typeof obj.value === 'number') {
        result = (log[obj.key] > obj.value) ? log : {};
      }
      return result;
    }

    window.$gte = (log, obj) => {
      let result = null;
      if (typeof obj.value === 'number') {
        result = (log[obj.key] >= obj.value) ? log : {};
      }
      return result;
    }
  }

  onerror(message, url, line, column, error) {
    // Add message error
    // Add url error
    // // Add file error
    // Add line of error in the file
    /*
    ** Check if exist column number of error and add to error object
    ** Not compatible with all browsers like IE11 and olders browsers version
    */
    // Check if exist error description and add to error object
    return {
      message,
      url,
      file: url.substring(url.lastIndexOf('/') + 1) || 'undefinied',
      line,
      column: column || '-',
      error: error.message || error || 'undefinied',
      clean: true
    };
  }
  
  checkSize(obj, callback) {
    /*
    ** Thanks to Yan Qing - Profile: https: //gist.github.com/zensh
    ** Gist: https: //gist.github.com/zensh/4975495
    */
    let bytes = 0;
    function sizeOf(obj) {
      if (obj !== null && obj !== undefined) {
        switch (typeof obj) {
          case 'number':
            bytes += 8;
            break;
          case 'string':
            bytes += obj.length * 2;
            break;
          case 'boolean':
            bytes += 4;
            break;
          case 'object':
            var objClass = Object.prototype.toString.call(obj).slice(8, -1);
            if (objClass === 'Object' || objClass === 'Array') {
              for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                sizeOf(obj[key]);
              }
            } else bytes += obj.toString().length * 2;
            break;
        }
      }
      return bytes;
    };

    function formatByteSize(bytes) {
      // Divided for get MiB scale
      return bytes / 1048576;
    };

    const result = formatByteSize(sizeOf(obj));
    if(typeof callback === 'function'){
      callback(result)
    }else{
      return result;
    }
  };
};

