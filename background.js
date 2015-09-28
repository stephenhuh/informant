(function(window, $, _){
  var timeout,interval;
  $.get('http://localhost:1337/dl');
  function unPoll() {
    if (!_.isUndefined(timeout)) {
      clearTimeout(timeout);
    }
    if (!_.isUndefined(interval)) {
      clearInterval(interval);
    }
  }
  chrome.runtime.onConnect.addListener(function(port) {
    port.postMessage("connected");
    var pollingInterval = setInterval(function() {
      console.log("polling for wit");
      $.get('http://localhost:1337/informant')
      .success(function(resp){
        port.postMessage({info: resp});
      })
      .error(function(resp){
        port.postMessage(resp);
      });
    }, 5000);
    port.onMessage.addListener(function(msg) {
      // do some stuff here
      if (msg.action == "detect") {
        $.get('http://localhost:1337')
        .success(function(resp){
          port.postMessage({success: resp});
        })
        .error(function(resp){
          port.postMessage(resp);
        })
      };
      if (msg.action == "poll") {
        unPoll();
        interval = setInterval(function() {
          $.get('http://localhost:1337').success(function(resp){
            port.postMessage({success: resp});
          })
          .error(function(resp){
            port.postMessage(resp);
          })
        }, 2000);
      };
      if (msg.action == 'unpoll') {
        unPoll();
      }
    });
  });
})(window, jQuery, _);
