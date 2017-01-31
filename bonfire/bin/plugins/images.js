// Generated by CoffeeScript 1.12.0
(function() {
  define(["mithril"], function(m) {
    var gfycatConfig, gfycatRegex, gifvRegex, imageConfig, imageRegex, imgurRegex, videoRegex, youtubeRegex;
    imageRegex = /.(?:jpg|gif|png|jpeg|bmp|JPG|GIF|PNG|JPEG|BMP)$/;
    imageConfig = function(element, isInitialized) {
      if (!isInitialized) {
        return $(element).materialbox();
      }
    };
    imgurRegex = /https?:\/\/(i\.)?imgur\.com\/(gallery\/)?(.*?)(?:[#\/].*|$)/;
    gfycatRegex = /(?:^https?:\/\/gfycat.com\/)/;
    gfycatConfig = function(element, isInitialized) {
      if (!isInitialized) {
        return new gfyObject(element).init();
      }
    };
    gifvRegex = /.(?:gifv|GIFV)$/;
    videoRegex = /.webm|.wmv|.mp4$/;
    youtubeRegex = /(?:(?:https?:\/\/www\.youtube\.com\/watch\?v=)|(?:^https?:\/\/youtu.be\/))([^#\&\?]*)(?:\?t=(\d+m)?(\d+m)?(\d+s)?)?/;
    return {
      name: "images",
      parent: "container",
      position: "before",
      render: function(doc, renderChildren) {
        var i, id, images, len, link, match, ref, seconds, start, youtubeElement, youtubeId;
        if (doc.links != null) {
          images = [];
          ref = doc.links;
          for (i = 0, len = ref.length; i < len; i++) {
            link = ref[i];
            if (imageRegex.test(link.href)) {
              images.push(m("img.materialboxed", {
                config: imageConfig,
                src: "" + link.href
              }));
            } else if (gifvRegex.test(link.href)) {
              link.href = link.href.substring(0, link.href.length - 4) + "mp4";
            } else if (imgurRegex.test(link.href)) {
              match = link.href.match(imgurRegex);
              images.push(m("img.materialboxed", {
                config: imageConfig,
                src: "http://i.imgur.com/" + match[3] + ".jpg"
              }));
            }
            if (gfycatRegex.test(link.href)) {
              id = link.href.replace(gfycatRegex, '');
              images.push(m("img.gfyitem#giphyId=" + id, {
                config: gfycatConfig,
                "data-id": id,
                "data-controls": true
              }));
            }
            if (videoRegex.test(link.href)) {
              images.push(m("video.responsive-video", {
                controls: true,
                loop: true,
                autoplay: true,
                muted: true,
                width: "100%",
                src: link.href
              }));
            }
            if (youtubeRegex.test(link.href)) {
              match = link.href.match(youtubeRegex);
              youtubeId = match[1];
              start = "";
              seconds = 0;
              if (match[2] != null) {
                seconds += parseInt(match[2]) * 60;
              }
              if (match[3] != null) {
                seconds += parseInt(match[3]);
              }
              if (seconds !== 0) {
                start = "&start=" + seconds;
              }
              youtubeElement = m(".video-container[no-controls]", m("iframe", {
                width: "853",
                height: "480",
                src: "http://www.youtube.com/embed/" + youtubeId + "?rel=0;autohide=1" + start,
                frameborder: "0",
                allowfullscreen: true
              }));
              images.push(youtubeElement);
            }
          }
          return m(".card-image", {
            width: "80%"
          }, [images, renderChildren(doc)]);
        }
      }
    };
  });

}).call(this);
