// Generated by CoffeeScript 1.12.3
(function() {
  define(["mithril", "arbiter", "linkify"], function(m, arbiter, linkify) {
    return {
      name: "container",
      parent: "root",
      render: function(doc, renderBefore, renderInner, renderAfter) {
        var i, j, len, len1, link, ref, ref1, text;
        if (doc.text != null) {
          if (Array.isArray(doc.text)) {
            doc.links = [];
            ref = doc.text;
            for (i = 0, len = ref.length; i < len; i++) {
              text = ref[i];
              if (text.text.indexOf("<") !== 0) {
                ref1 = linkify.find(text.text);
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                  link = ref1[j];
                  doc.links.push(link);
                }
              }
            }
          } else if (doc.text.indexOf("<") !== 0) {
            doc.links = linkify.find(doc.text);
          }
        }
        return m(".message-container", {
          key: doc["_id"]
        }, m(".message.blue-grey.lighten-5", {
          ondblclick: function() {
            if (!Array.isArray(doc.text)) {
              return arbiter.publish("messages/startEdit", doc._id);
            }
          }
        }, [renderBefore(doc), m(".message-content.black-text", renderInner(doc)), renderAfter(doc)]));
      }
    };
  });

}).call(this);
