module.exports = function(app) {
  // USER CREATE
  app.post('/users', function (req, res) {
    console.log(req.body);
    // User.save(req.body, function(err, user));
    res.json({msg: "Got it!"});
  })

  //USER UPDATE
  app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user');
  });

  //USER DELETE
  app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user');
  });
}
