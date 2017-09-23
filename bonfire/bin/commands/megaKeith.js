// Generated by CoffeeScript 1.12.0
(function() {
  define([], function() {
    return function(command, args) {
      var audio, keithWidth, megaKeith;
      if (command === "\\megaKeith") {
        keithWidth = window.innerWidth * 0.7;
        megaKeith = document.createElement("img");
        megaKeith.src = "./megaKeith/megaKeith.gif";
        megaKeith.style = "position: absolute; bottom: 0px; z-index: 10000; left: " + ((window.innerWidth - keithWidth) * 0.5) + "px; width: " + keithWidth + "px;";
        document.body.appendChild(megaKeith);
        audio = document.createElement("audio");
        audio.src = "./megaKeith/megaKeith.mp3";
        audio.volume = "0.4";
        audio.autoplay = "autoplay";
        setInterval(function() {
          var i, j, smoke, smokeId, smokeKeyFrames, smokeKeyframe;
          smokeId = "";
          for (i = j = 0; j <= 20; i = ++j) {
            smokeId += Math.floor(Math.random() * 10).toString();
          }
          smokeKeyFrames = "@keyframes Smoke" + smokeId + " {\n  0% { opacity: 0; bottom: -200px; transform: rotate(" + (Math.random() * 360) + "deg); }\n  80% { opacity: 0.8; }\n  100% { opacity: 0; transform: rotate(" + (Math.random() * 360) + "deg); bottom: 50px; }\n}";
          smokeKeyframe = document.createElement("style");
          smokeKeyframe.type = "text/css";
          smokeKeyframe.appendChild(document.createTextNode(smokeKeyFrames));
          document.head.appendChild(smokeKeyframe);
          smoke = document.createElement("img");
          smoke.src = "./megaKeith/smoke" + (Math.floor(Math.random() * 5) + 1) + ".png";
          smoke.style = "position: absolute; left: " + (Math.random() * window.innerWidth) + "px; animation: Smoke" + smokeId + " 3s; opacity: 0; z-index: 50000;";
          return document.body.appendChild(smoke);
        }, 100);
        document.body.appendChild(audio);
        return setTimeout(function() {
          return location.reload(true);
        }, 15000);
      }
    };
  });

}).call(this);
