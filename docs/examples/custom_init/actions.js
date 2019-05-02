/*
** Generate random errors for testing purpose
** This is not part of XDebugger code
*/

// Here create new Debugger tray
let debug = null;

document.querySelector('#init').onclick = function(){
  const dbg = (document.querySelector('#debug').value === 'true') ? true : false;
  const lg = (document.querySelector('#log').value === 'true') ? true : false;
  // -------------------------------------------------
  // Initialize XDebugger
  debug = new XDebugger({ debug: dbg, log: lg });
  // Add global error listener
  window.onerror = (message, url, line, col, err) => debug.log(debug.onerror(message, url, line, col, err));
  // -------------------------------------------------
  document.querySelector('#debug_status').innerText = (dbg) ? 'On' : 'Off';
  document.querySelector('#log_status').innerText = (lg) ? 'On' : 'Off';
}



document.querySelector('#generate').onclick = function () {
  if(debug){
    debug.log({
      message: `${Math.random().toString(36).substring(7)} is the message`,
      code: 500,
      explanation: `${Math.random().toString(36).substring(7)} is the explanation.`,
      response: `${Math.random().toString(36).substring(7)} is the response.`,
      error: `${Math.random().toString(36).substring(7)} is the error.`,
    });
  }else {
    console.error('The debugger isn\'t initializate');
  }
}

setTimeout(function () {
  throw new Error("boom!");
}, 5000)

setTimeout(function () {
  eval("{");
}, 5000)