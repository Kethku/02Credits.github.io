// Generated by CoffeeScript 1.12.0
(function() {
  define(["mithril", "arbiter", "linkify-string", "emoticons"], function(m, arbiter, linkify, emoticons) {
    var renderText;
    renderText = function(text, author, id) {
      var classText;
      classText = text.indexOf(">") === 0 ? ".greentext" : "";
      if (text.indexOf("<") !== 0) {
        text = linkify("" + text, {
          format: function(value, type) {
            if (type === 'url' && value.length > 50) {
              value = value.slice(0, 50) + '…';
            }
            return value;
          }
        });
        if (emoticons.singleEmoticon(text)) {
          return m(".emoticon", {
            style: {
              width: "100%",
              textAlign: "center"
            },
            ondblclick: function() {
              return arbiter.publish("messages/startEdit", id);
            }
          }, m.trust(emoticons.replace(text, id, author, true)));
        } else {
          text = emoticons.replace(text, id, author, false);
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
        return (renderBefore(doc)).then(function(beforeChildren) {
          return (renderAfter(doc)).then(function(afterChildren) {
            var elements, i, len, ref, text;
            if (doc.text != null) {
              if (Array.isArray(doc.text)) {
                elements = [beforeChildren];
                ref = doc.text;
                for (i = 0, len = ref.length; i < len; i++) {
                  text = ref[i];
                  elements.push(renderText(text.text, doc.author, text.id));
                }
                elements.push(afterChildren);
                return elements;
              } else {
                return [beforeChildren, renderText(doc.text, doc.author, doc._id), afterChildren];
              }
            } else {
              return [beforeChildren, afterChildren];
            }
          });
        });
      }
    };
  });

}).call(this);
