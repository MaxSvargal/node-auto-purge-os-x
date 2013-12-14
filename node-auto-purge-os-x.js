var os = require('os'),
    exec = require('child_process').exec;

var intervalSec = 60,
    memLimitMb = 200;

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

  var execPurge = function() {
    exec('purge', function(err, stdout, stderr) {
      log("\x1B[33mPurged from " + getFreeMem() + " Mb\x1B[39m");
    });
  };

  var calculate = function() {
    var freeMem = getFreeMem();
    if (freeMem <= memLimitMb) {
      log("\x1B[32mLow memory (" + freeMem + " Mb). Start purge command...\x1B[39m");
      execPurge();
    } else {
      log("Free memory is \x1B[1m" + freeMem + " Mb\x1B[22m");
    }
  };

  log("\x1B[36mScript started with a limit " + memLimitMb + " Mb of memory for purge and with check interval " + intervalSec + " seconds.\x1B[39m");
  setInterval(calculate, intervalSec * 1000);
  calculate();
  
})()