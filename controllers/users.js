module.exports = function(app) {
  // USER CREATE
  app.post('/users', function (req, res) {
    console.log(req.body);
    // User.save(req.body, function(err, user));
    res.json({msg: "Got it!"});
  })

  //USER UPDATE
  app.put('/users', function (req, res) {
    res.send('Got a PUT request at /users');
  });

  //USER DELETE
  app.delete('/users', function (req, res) {
    res.send('Got a DELETE request at /users');
  });
}
