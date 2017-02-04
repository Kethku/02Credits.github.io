// Generated by CoffeeScript 1.12.0
(function() {
  define(["jquery"], function($) {
    var dumbNames, nameInput, randomIndex, settingsInputs, statusInput;
    nameInput = $('#displayName');
    statusInput = $('#status');
    if (localStorage.displayName != null) {
      nameInput.val(localStorage.displayName);
    } else {
      dumbNames = ["Village Idiot", "Dirty Peasant", "Dumbster", "assfaggot"];
      randomIndex = Math.floor(Math.random() * dumbNames.length);
      nameInput.val(dumbNames[randomIndex]);
      localStorage.displayName = dumbNames[randomIndex];
    }
    if (localStorage.status != null) {
      statusInput.val(localStorage.status);
    } else {
      localStorage.status = "Breathing";
      statusInput.val(localStorage.status);
    }
    settingsInputs = $(".settings-input");
    settingsInputs.keydown(function(e) {
      if (e.which === 13 || e.which === 27) {
        return this.blur();
      }
    });
    return settingsInputs.blur(function(e) {
      return localStorage[$(this).attr('id')] = $(this).val();
    });
  });

}).call(this);