// Generated by CoffeeScript 1.12.0
(function() {
  define(["arbiter"], function(arbiter) {
    return function(command, args) {
      var i, id, j, text;
      if (command === "\\refresh") {
        id = "";
        for (i = j = 0; j <= 20; i = ++j) {
          id += Math.floor(Math.random() * 10).toString();
        }
        text = "<script>\nif (!localStorage.refresh" + id + ") {\n  localStorage.refresh" + id + " = true;\n\n  var keithWidth = window.innerWidth * 0.7;\n  var megaKeith = document.createElement(\"img\");\n  megaKeith.src = \"./megaKeith/megaKeith.gif\";\n  megaKeith.style = \"position: absolute; bottom: 0px; z-index: 10000; left: \" + (window.innerWidth - keithWidth) * 0.5 + \"px; width: \" + keithWidth + \"px;\"\n  document.body.appendChild(megaKeith);\n  var audio = document.createElement(\"audio\");\n  audio.src = \"./megaKeith/megaKeith.mp3\";\n  audio.volume = \"0.4\";\n  audio.autoplay = \"autoplay\";\n  document.body.appendChild(audio);\n\n  if (window.nodeRequire) {\n    var remote = nodeRequire('remote');\n    var win = remote.getCurrentWindow();\n    win.webContents.session.clearCache(function() {\n      location.reload(true);\n    });\n  } else {\n    location.reload(true);\n  }\n}\n</script>";
        return arbiter.publish("messages/send", {
          text: text,
          author: localStorage.displayName
        });
      }
    };
  });

}).call(this);
