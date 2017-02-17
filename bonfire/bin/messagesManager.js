// Generated by CoffeeScript 1.12.0
(function() {
  define(["jquery", "underscore", "pouchdbManager", "mithril", "moment", "pouchdb-collate", "messageRenderer", "inputManager", "arbiter", "scrollManager"], function($, _, PouchDB, m, moment, collate, messageRenderer, inputManager, arbiter, scrollManager) {
    var caughtUp, currentDB, editPrimed, handleChange, localDB, primeQueries, remoteChanges, remoteDB, render, renderMessages, searchPrimed;
    remoteDB = new PouchDB('http://uwhouse.ddns.net:5984/messages');
    localDB = new PouchDB('messages');
    currentDB = remoteDB;
    caughtUp = false;
    editPrimed = false;
    searchPrimed = false;
    handleChange = function(change) {
      render();
      if (change.doc.author !== localStorage.displayName) {
        if (typeof notifier !== "undefined" && notifier !== null) {
          return notifier.notify(true);
        }
      }
    };
    primeQueries = function() {
      if (caughtUp) {
        localDB.query("by_author", {
          key: localStorage.displayName,
          limit: 1,
          descending: true
        }).then(function() {
          if (!editPrimed) {
            editPrimed = true;
            return Materialize.toast("Edit Ready", 4000);
          }
        })["catch"](function(err) {
          return arbiter.publish("error", err);
        });
        return localDB.search({
          fields: ['text'],
          build: true
        }).then(function() {
          if (!searchPrimed) {
            searchPrimed = true;
            return Materialize.toast("Search Ready", 4000);
          }
        })["catch"](function(err) {
          return arbiter.publish("error", err);
        });
      }
    };
    render = function() {
      if (!inputManager.searching) {
        return currentDB.allDocs({
          include_docs: true,
          conflicts: false,
          attachments: true,
          binary: true,
          limit: scrollManager.messages,
          descending: true,
          startkey: "_design"
        }).then(function(results) {
          return renderMessages(results.rows.reverse());
        })["catch"](function(err) {
          return arbiter.publish("error", err);
        });
      }
    };
    renderMessages = function(messages, preventCombining) {
      var currentAuthor, currentMessage, doc, groupedMessages, i, len, message;
      messages = _.filter(messages, function(message) {
        var doc;
        doc = message.doc;
        return (doc.text != null) && (doc.author != null);
      });
      groupedMessages = [];
      currentAuthor = {};
      currentMessage = null;
      for (i = 0, len = messages.length; i < len; i++) {
        message = messages[i];
        if (message.doc.text.startsWith("<")) {
          if (currentMessage != null) {
            groupedMessages.push(currentMessage);
            currentMessage = null;
          }
          groupedMessages.push(message);
        } else {
          if (currentMessage != null) {
            if (currentMessage.doc.author === message.doc.author && moment.utc(message.doc.time).diff(moment.utc(currentMessage.doc.time), 'minutes') < 2 && !preventCombining) {
              if (message.doc.edited) {
                currentMessage.doc.edited = true;
              }
              currentMessage.doc.time = message.doc.time;
              currentMessage.doc.text.push({
                text: message.doc.text,
                id: message.doc._id
              });
            } else {
              groupedMessages.push(currentMessage);
              currentMessage = message;
              message.doc.text = [
                {
                  text: message.doc.text,
                  id: message.doc._id
                }
              ];
            }
          } else {
            currentMessage = message;
            message.doc.text = [
              {
                text: message.doc.text,
                id: message.doc._id
              }
            ];
          }
        }
      }
      if (currentMessage != null) {
        groupedMessages.push(currentMessage);
      }
      m.render($('#messages').get(0), m("div", (function() {
        var j, len1, results1;
        results1 = [];
        for (j = 0, len1 = groupedMessages.length; j < len1; j++) {
          message = groupedMessages[j];
          doc = message.doc;
          results1.push(messageRenderer.render(doc));
        }
        return results1;
      })()));
      return arbiter.publish("messages/rendered");
    };
    render();
    remoteChanges = remoteDB.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', handleChange).on('error', function(err) {
      return arbiter.publish("error", err);
    });
    localDB.sync(remoteDB).then(function() {
      $('.progress').fadeOut();
      caughtUp = true;
      primeQueries();
      localDB.sync(remoteDB, {
        live: true,
        retry: true
      }).on('error', function(err) {
        return arbiter.publish("error", err);
      });
      localDB.changes({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', handleChange).on('error', function(err) {
        return arbiter.publish("error", err);
      });
      remoteChanges.cancel();
      return currentDB = localDB;
    })["catch"](function(err) {
      return arbiter.publish("error", err);
    });
    $('#input').prop('disabled', false);
    arbiter.subscribe("messages/render", function(messages) {
      if (messages == null) {
        return render();
      } else {
        return renderMessages(messages);
      }
    });
    arbiter.subscribe("messages/edit", function(args) {
      var id, text;
      id = args.id;
      text = args.text;
      $('.progress').fadeIn();
      return currentDB.get(id).then(function(doc) {
        $('.progress').fadeOut();
        doc.text = text;
        doc.edited = true;
        return currentDB.put(doc);
      })["catch"](function(err) {
        arbiter.publish("error", err);
        return $('.progress').fadeOut();
      });
    });
    arbiter.subscribe("messages/search", function(query) {
      if (caughtUp) {
        renderMessages([]);
        $('.progress').fadeIn();
        return localDB.search({
          query: query,
          fields: ['text'],
          include_docs: true
        }).then(function(results) {
          $('.progress').fadeOut();
          return renderMessages(results.rows.reverse(), true);
        })["catch"](function(err) {
          arbiter.publish("error", err);
          return $('.progress').fadeOut();
        });
      } else {
        return Materialize.toast("Sync still in progress");
      }
    });
    arbiter.subscribe("messages/send", function(args) {
      var author, text;
      text = args.text;
      author = args.author;
      if ((text != null) && (author != null)) {
        return currentDB.allDocs({
          include_docs: true,
          conflicts: false,
          limit: 1,
          descending: true,
          startkey: "_design"
        }).then(function(results) {
          var doc, id, idNumber, messageNumber, now, time;
          doc = results.rows[0].doc;
          now = moment().utc();
          time = now.valueOf();
          messageNumber = (parseInt(doc.messageNumber) + 1).toString();
          idNumber = parseInt(messageNumber.toString() + time.toString());
          id = collate.toIndexableString(idNumber).replace(/\u0000/g, '\u0001');
          return currentDB.put({
            "_id": id,
            "messageNumber": messageNumber,
            "time": time,
            "author": author,
            "text": text
          });
        })["catch"](function(err) {
          return arbiter.publish("error", err);
        });
      }
    });
    arbiter.subscribe("messages/getLast", function(callback) {
      if (caughtUp) {
        $('.progress').fadeIn();
        return currentDB.query("by_author", {
          key: localStorage.displayName,
          limit: 1,
          include_docs: true,
          descending: true
        }).then(function(result) {
          $('.progress').fadeOut();
          return callback(result.rows[0].doc);
        })["catch"](function(err) {
          $('.progress').fadeOut();
          return arbiter.publish("error", err);
        });
      } else {
        return Materialize.toast("Sync still in progress");
      }
    });
    arbiter.subscribe("messages/get", function(args) {
      var callback, id;
      id = args.id;
      callback = args.callback;
      return currentDB.get(id).then(function(doc) {
        return callback(doc);
      })["catch"](function(err) {
        return arbiter.publish("error", err);
      });
    });
    return setInterval(function() {
      return primeQueries();
    }, 10000);
  });

}).call(this);
