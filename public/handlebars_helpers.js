
Handlebars.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    return mmnt.format(format);
});

Handlebars.registerHelper('fromNow', function (date) {

    var mmnt = moment(date);
    return mmnt.fromNow();
});

Handlebars.registerHelper('bold', function(options) {
  return new Handlebars.SafeString(
      '<div class="mybold">'
      + options.fn(this)
      + '</div>');
});
