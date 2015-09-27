(function(window, $, _){
  $('.video-annotations').remove();
  BODY_CONTAINER = $('#body-container');
  PAGE_CONTAINER = $('#page-container');
  VIDEO_CONTENT = $('.html5-video-content');
  VIDEO_CONTAINER = $('.html5-video-container');
  var width = VIDEO_CONTENT.innerWidth();
  var height = VIDEO_CONTENT.innerHeight();
  ANNOTATIONS = $(document.createElement('div'));
  ANNOTATIONS.addClass('video-annotations iv-module');
  VIDEO_CONTENT.prepend(ANNOTATIONS);
  OVERLAY = $(document.createElement('div'));
  OVERLAY.addClass('video-legacy-annotations html5-stop-propagation');
  ANNOTATIONS.prepend(OVERLAY);

  function plotRectangle(el, rect) {
    var div = $(document.createElement('div'));
    div.addClass('annotation-shape annotation-type-highlight');
    var actualWidth = width/1280*rect.left+'px';
    var actualHeight = height/720*rect.top+'px';
    div.css({
      opacity: 0.8,
      left: actualWidth,
      top: actualHeight,
      width: rect.width + 'px',
      height: rect.height + 'px',
      border: '2px solid ' + (rect.color || 'magenta'),
      'z-index': 0,
    });
    var svg = $(document.createElement('svg'));
    // svg.
    // document.body.appendChild(div);
    console.log(div);
    el.prepend(div);
    return div;
  }

  console.log(VIDEO_CONTAINER);
  BODY_CONTAINER.prepend('<div class="plug"><a id="get-screenshot" href="javascript:void(0);" style="position:absolute;top:50px;right:500px;" class=""><span class="">Get ScreenShot</span></a></div>');

  GET_SCREENSHOT = $('#get-screenshot');

  console.log("connecting to background");
  var port = chrome.runtime.connect({name: "my-channel"});
  port.postMessage({myProperty: "value"});
  port.onMessage.addListener(function(msg) {
    if (msg.success) {
      console.log("got data from oxford");
      var coor = JSON.parse(msg.success);
      coor = JSON.parse(coor);
      console.log(coor);
      _.each(coor, function(val, key) {
        if (_.isString(val)) {
          val = JSON.parse(val);
        }
        console.log(val);
        if (_.isObject(val)) {
          var rect = {
            left: val.faceRectangle.left.toString(),
            top: val.faceRectangle.top.toString(),
            width: val.faceRectangle.width.toString(),
            height: val.faceRectangle.height.toString(),
            class: "rectangle" + key.toString()
          }
          console.log(rect);
          plotRectangle(OVERLAY, rect);
        }
      });
      // VIDEO_CONTAINER.prepend(OVERLAY);
    }
    else {
      console.log(msg);
    }
  });
  GET_SCREENSHOT.click(function(){
    $('.annotation-shape').remove();
    port.postMessage({action: "detect"});
  });
})(window, jQuery, _);
