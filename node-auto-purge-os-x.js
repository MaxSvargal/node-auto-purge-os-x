var os = require('os'),
    exec = require('child_process').exec;

var intervalSec = 60,
    memLimitMb = 200;

(function() {
  var calculate = function() {
    var freeMem = os.freemem() / (1024 * 1024);
    if (freeMem <= memLimitMb) {
      console.log("Low memory. Start purge command...");
      return exec('purge', function(err, stdout, stderr) {
        return console.log("Purged from " + freeMem + " Mb");
      });
    } else {
      return console.log("Free memory is " + freeMem + " Mb");
    }
  };
  console.log("Script started with a limit " + memLimitMb + " Mb of memory for purge and with check interval " + intervalSec + " seconds.");
  setInterval(calculate, intervalSec * 1000);
  calculate();
})()