(function(window, $, _){
  $('.video-annotations').remove();
  var polling = false;
  BODY_CONTAINER = $('#body-container');
  PAGE_CONTAINER = $('#page-container');
  VIDEO_CONTENT = $('.html5-video-content');
  VIDEO_CONTAINER = $('.html5-video-container');
  HEADER_CONTAINER = $('#watch-header');

  var a = chrome.extension.getURL('custom.css');
  $('<link rel="stylesheet" type="text/css" href="' + a + '" >').appendTo("head");
  var a = chrome.extension.getURL('bootstrap-theme.min.css');
  $('<link rel="stylesheet" type="text/css" href="' + a + '" >').appendTo("head");
  // var cssId = 'myCss';  // you could encode the css path itself to generate id..
  // if (!document.getElementById(cssId))
  // {
  //     var head  = document.getElementsByTagName('head')[0];
  //     var link  = document.createElement('link');
  //     link.id   = cssId;
  //     link.rel  = 'stylesheet';
  //     link.type = 'text/css';
  //     link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css';
  //     link.media = 'all';
  //     head.appendChild(link);
  // }
  //
  // var otherCss = 'customCss';  // you could encode the css path itself to generate id..
  // if (!document.getElementById(otherCss))
  // {
  //     var head  = document.getElementsByTagName('head')[0];
  //     var link  = document.createElement('link');
  //     link.id   = otherCss;
  //     link.rel  = 'stylesheet';
  //     link.type = 'text/css';
  //     link.href = 'https://dl.dropboxusercontent.com/s/w7ad3kgf3i57qxg/custom.css?dl=0';
  //     link.media = 'all';
  //     head.appendChild(link);
  // }

  console.log(HEADER_CONTAINER);
  HEADER_CONTAINER.prepend('<div class="row" style="padding-left: 30px; margin-top: 10px;"><div class="col-md-2" style="z-index:100000;"><img class = "profile img-circle" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div><div class="col-md-3" style="z-index:0;"><div class="left-arrow progress" style="height:20px;z-index:-1;"><div class="progress-bar left" style="width:100%;background-color:#888888;z-index:-10;"><h6 style="margin-top: 2px;">This is a message.</h6></div></div></div><div class="col-md-3"><div class="right-arrow progress" style="height:20px;"><div class="progress-bar right" style="width:100%;background-color:#888888;">This is a message</div></div></div><div class="col-md-2"><img class = "profile img-circle" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div></div>');
  HEADER_CONTAINER.prepend('<div class="plug"><div class="yt-card yr-card-has-padding"><div class="container"><div class="row"><div class="col-sm-3 tile first tile0"><div class="row"><div class="col-xs-4"><img class = "profile" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div><div class="col-xs-8"><h4 class="name">Jimmy Fallon</h4><h6 class="tags">Actor, Host, Comedian</h6><h6 class="description">He is the host and executive producer of Jimmy Kimmel Live!, a late-night talk show that premiered on ABC in 2003.</h6></div></div></div><div class="col-sm-3 tile second tile1"><div class="row"><div class="col-xs-8"><h4 class="name">Kim Kardashian </h4><h6 class="tags">Actress, Model</h6><h6 class="description">Born and raised in Los Angeles, California, Kardashian first gained media attention through her friendship with Paris Hilton. </h6></div><div class="col-xs-4"><img class = "profile" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div></div></div></div></div></div></div>');
  var width = VIDEO_CONTENT.innerWidth();
  var height = VIDEO_CONTENT.innerHeight();
  ANNOTATIONS = $(document.createElement('div'));
  ANNOTATIONS.addClass('video-annotations iv-module');
  VIDEO_CONTENT.prepend(ANNOTATIONS);
  OVERLAY = $(document.createElement('div'));
  OVERLAY.addClass('video-legacy-annotations html5-stop-propagation');
  ANNOTATIONS.prepend(OVERLAY);

  var peopleListener = [];
  var length;

  var info = [];
  function deregisterClickInfo() {
    for (var i = 0; i < length; i++) {
      info[i].el.off();
      info[i].el.hide();
      info[i].isHidden = true;
    }
  };
  function plotRectangle(el, rect) {
    var div = $(document.createElement('div'));
    div.addClass('annotation-shape annotation-type-highlight');
    var actualWidth = width/1280*rect.left+'px';
    var actualHeight = height/720*rect.top+'px';
    var index = rect.index;
    div.css({
      opacity: 0.8,
      left: actualWidth,
      top: actualHeight,
      width: rect.width + 'px',
      height: rect.height + 'px',
      border: '2px solid ' + (rect.color || 'magenta'),
      'z-index': 0,
    });
    info[index] = {
      el: div,
      data: $('.tile'+index.toString())
    };
    peopleListener[index] = div.click(function() {
      if (info[index].isHidden) {
        info[index].isHidden = false;
        info[index].data.show();
      }
      else {
        info[index].isHidden = true;
        info[index].data.hide();
      }
    });
    console.log(div);
    el.prepend(div);
    return div;
  }

  console.log(VIDEO_CONTAINER);
  BODY_CONTAINER.prepend('<div class="plug"><a id="get-screenshot" href="javascript:void(0);" style="position:absolute;top:50px;right:500px;" class=""><span class="">Get ScreenShot</span></a></div>');
  BODY_CONTAINER.prepend('<div class="plug"><a id="continumm" href="javascript:void(0);" style="position:absolute;top:50px;right:700px;" class=""><span class="">Continumm</span></a></div>');

  GET_SCREENSHOT = $('#get-screenshot');
  CONTINUMM = $('#continumm');

  console.log("connecting to background");
  var port = chrome.runtime.connect({name: "my-channel"});
  port.onMessage.addListener(function(msg) {
    if (msg.success) {
      deregisterClickInfo();
      $('.annotation-shape').remove();
      console.log("got data from oxford");
      var coor = JSON.parse(msg.success);
      coor = JSON.parse(coor);
      console.log(coor);
      length = coor.length;
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
            class: "rectangle" + key.toString(),
            index: key
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
    port.postMessage({action: "detect"});
  });
  CONTINUMM.click(function() {
    if (polling) {
      polling = false;
      console.log("unpolling");
      port.postMessage({action: 'unpoll'});
    }
    else {
      console.log("polling");
      polling = true;
      port.postMessage({action: 'poll'});
    }
  })
})(window, jQuery, _);
