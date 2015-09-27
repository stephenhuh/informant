(function(window, $, undefined){
  BODY_CONTAINER = $('#body-container');
  PAGE_CONTAINER = $('#page-container');
  VIDEO_CONTAINER = $('.html5-video-container');
  HEADER_CONTAINER = $('#watch-header');

  var cssId = 'myCss';  // you could encode the css path itself to generate id..
  if (!document.getElementById(cssId))
  {
      var head  = document.getElementsByTagName('head')[0];
      var link  = document.createElement('link');
      link.id   = cssId;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css';
      link.media = 'all';
      head.appendChild(link);
  }

  var otherCss = 'customCss';  // you could encode the css path itself to generate id..
  if (!document.getElementById(otherCss))
  {
      var head  = document.getElementsByTagName('head')[0];
      var link  = document.createElement('link');
      link.id   = otherCss;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://dl.dropboxusercontent.com/s/w7ad3kgf3i57qxg/custom.css?dl=0';
      link.media = 'all';
      head.appendChild(link);
  }

  console.log(HEADER_CONTAINER);
  BODY_CONTAINER.prepend('<div class="plug"><a id="get-screenshot" href="javascript:void(0);" style="position:absolute;top:50px;right:500px;" class=""><span class="">Get ScreenShot</span></a></div>');
  HEADER_CONTAINER.prepend('<div class="row" style="padding-left: 30px; margin-top: 10px;"><div class="col-md-2" style="z-index:100000;"><img class = "profile img-circle" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div><div class="col-md-3" style="z-index:0;"><div class="left-arrow progress" style="height:20px;z-index:-1;"><div class="progress-bar left" style="width:100%;background-color:#888888;z-index:-10;"><h6 style="margin-top: 2px;">This is a message.</h6></div></div></div><div class="col-md-3"><div class="right-arrow progress" style="height:20px;"><div class="progress-bar right" style="width:100%;background-color:#888888;">This is a message</div></div></div><div class="col-md-2"><img class = "profile img-circle" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div></div>');
  HEADER_CONTAINER.prepend('<div class="plug"><div class="yt-card yr-card-has-padding"><div class="container"><div class="row"><div class="col-sm-3 tile first"><div class="row"><div class="col-xs-4"><img class = "profile" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div><div class="col-xs-8"><h4 class="name">Jimmy Kimmel</h4><h6 class="tags">Actor, Host, Comedian</h6><h6 class="description">He is the host and executive producer of Jimmy Kimmel Live!, a late-night talk show that premiered on ABC in 2003.</h6></div></div></div><div class="col-sm-3 tile second"><div class="row"><div class="col-xs-8"><h4 class="name">Kim Kardashian </h4><h6 class="tags">Actress, Model</h6><h6 class="description">Born and raised in Los Angeles, California, Kardashian first gained media attention through her friendship with Paris Hilton. </h6></div><div class="col-xs-4"><img class = "profile" src="http://www.soulstrut.com/2015/assets/img/anon.gif" /></div></div></div></div></div></div></div>');
  VIDEO_CONTAINER.appendTo('<div class="plug">OKAY</div>');

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
