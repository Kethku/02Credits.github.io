// Generated by CoffeeScript 1.12.3
(function() {
  define(["mithril", "arbiter", "linkify-string", "emoticons"], function(m, arbiter, linkify, emoticons) {
    var renderText;
    renderText = function(text, id) {
      var classText;
      classText = text.indexOf(">") === 0 ? ".greentext" : "";
      if (text.indexOf("<") !== 0) {
        text = linkify("" + text);
        if (emoticons.singleEmoticon(text)) {
          return m(".emoticon", {
            style: {
              width: "100%",
              textAlign: "center"
            },
            ondblclick: function() {
              return arbiter.publish("messages/startEdit", id);
            }
          }, m.trust(emoticons.replace(text, true)));
        } else {
          text = emoticons.replace(text, false);
        }
      }
      return m("p" + classText, {
        ondblclick: function() {
          return arbiter.publish("messages/startEdit", id);
        }
      }, m.trust(text));
    };
    return {
      name: "text",
      parent: "container",
      render: function(doc, renderBefore, renderAfter) {
        var elements, i, len, ref, text;
        if (doc.text == null) {
          return renderText("error", doc._id);
        } else if (Array.isArray(doc.text)) {
          elements = [renderBefore(doc)];
          ref = doc.text;
          for (i = 0, len = ref.length; i < len; i++) {
            text = ref[i];
            elements.push(renderText(text.text, text.id));
          }
          elements.push(renderAfter(doc));
          return elements;
        } else {
          return [renderBefore(doc), renderText(doc.text, doc._id), renderAfter(doc)];
        }
      }
    };
  });

}).call(this);
