(function(window, $, undefined){
  BODY_CONTAINER = $('#body-container');
  PAGE_CONTAINER = $('#page-container');
  VIDEO_CONTAINER = $('.html5-video-container');
  console.log(VIDEO_CONTAINER);
  BODY_CONTAINER.prepend('<div class="plug"><a id="get-screenshot" href="javascript:void(0);" style="position:absolute;top:50px;right:500px;" class=""><span class="">Get ScreenShot</span></a></div>');

  GET_SCREENSHOT = $('#get-screenshot');

  console.log("connecting to background");
  var port = chrome.runtime.connect({name: "my-channel"});
  port.postMessage({myProperty: "value"});
  port.onMessage.addListener(function(msg) {
    console.log(msg);
  });
  GET_SCREENSHOT.click(function(){
    port.postMessage({action: "detect"});
  });
})(window, jQuery);
