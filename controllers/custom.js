
module.exports = function(app) {
  //Custom route
  app.get('/greetings/:name', function(req, res) {
    res.send('<h1>Greetings, ' + req.params.name + '</h1>');
  });

  //Pushing JSON via the route
  app.get('/api/blahs', function(req, res) {
    res.json([
      { name: "Blah"},
      { name: "Blah"},
      { name: "Blah"}
    ]);
  });
}
