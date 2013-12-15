var os = require('os'),
    exec = require('child_process').exec;

var intervalSec = 60,
    memLimitMb = 200;

var AddConsoleStyles = (function() {
  var addProperty = function(color, openTag, closeTag) {
    String.prototype.__defineGetter__(color, function() {
      return openTag + this + closeTag;
    });
  };
  var styles = {
    'cyan'  : ['\x1B[36m', '\x1B[39m'],
    'green' : ['\x1B[32m', '\x1B[39m'],
    'yellow': ['\x1B[33m', '\x1B[39m'],
    'bold'  : ['\x1B[1m', '\x1B[22m']
  };
  for(style in styles) {
    addProperty(style, styles[style][0], styles[style][1]);
  };
})();

(function() {
  var log = function(str) {
    return console.log( '\x1B[90m[' + getTime() + ']\x1B[39m ' + str);
  };

  var getFreeMem = function() {
    return Math.round(os.freemem() / (1024 * 1024));
  };

  var getTime = function() {
    d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
  };

  var execPurge = function(preFreeMem) {
    exec('purge', function(err, stdout, stderr) {
      log(("Purged " + (getFreeMem() - preFreeMem) + " Mb").yellow);
    });
  };

  var calculate = function() {
    var freeMem = getFreeMem();
    if (freeMem <= memLimitMb) {
      log(("Low memory (" + freeMem + " Mb). Start purge command...\x1B[39m").green);
      execPurge(freeMem);
    } else {
      log(freeMem.toString().bold + " Mb free.");
    }
  };

  log(("Script started with a limit " + memLimitMb + "Mb of memory for purge and with check interval " + intervalSec + " seconds.").cyan);
  setInterval(calculate, intervalSec * 1000);
  calculate();

})()

