(function(window, $, _){
  var timeout,interval;
  function unPoll() {
    if (!_.isUndefined(timeout)) {
      clearTimeout(timeout);
    }
    if (!_.isUndefined(interval)) {
      clearInterval(interval);
    }
  }
  chrome.runtime.onConnect.addListener(function(port) {
    // setTimeout(function() {
    //   setInterval(function() {
    //     $.get('http://localhost:1337').success(function(resp){
    //       port.postMessage(resp);
    //     })
    //     .error(function(resp){
    //       port.postMessage(resp);
    //     })
    //   }, 10000);
    // }, 2000);
    port.postMessage("connected");
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
        }, 10000);
      };
      if (msg.action == 'unpoll') {
        unPoll();
      }
    });
  });
})(window, jQuery, _);
