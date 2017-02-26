module.exports = function(app) {

  var Post = require('../models/post.js');
  var Comment = require('../models/comment.js');

  //COMMENT INDEX
  // app.get('/', function(req, res) {
  //   Post.find().sort({'_id': -1}).exec(function(err, posts) {
  //     res.render('posts-index', { posts: posts});
  //   });
  // });

  //POST SHOW
  // app.get('/post/:id', function (req, res) {
  //   var post = Post.findById(req.params.id).populate('comments').exec(function(err, post){
  //     res.render('post-show', {post: post});
  //   });
  // });


  //COMMENT CREATE
  app.post('/posts/:postId/comments', function (req, res) {
    Post.findById(req.params.postId).exec(function (err, post) {
      
      var comment = new Comment(req.body)
      comment.save(function (err) {
        if (err) { return res.status(300) };

        post.comments.push(comment._id);

        post.save(function (err) {
          if (err) {
            console.log(err)
            return res.send();
          }
        });

        res.status(200).json(comment);
      })
    });
    // var comment = new Comment(req.body);
    // post = Post.findById(req.params.id)
    //
    // comment.save(function (err) {
    //   console.log(comment);
    //   res.send(comment);
    // });
  });

  //POST DELETE
  // app.delete('/post/:id', function (req, res) {
  //   Post.findById(req.params.id).exec(function (err, post) {
  //     post.remove();
  //
  //     res.status(200).json({});
  //   });
  // });

  //POST EDIT
  // app.get('/post/edit/:id', function (req, res) {
  //   var post = Post.findById(req.params.id).exec(function(err, post){
  //     res.render('post-edit', {post: post});
  //   });
  // });

  //POST UPDATE
  // app.put('/post/:id', function(req, res) {
  //   Post.findById(req.params.id).exec(function(err, post) {
  //     if (err) { return res.send(err) }
  //     post.title = req.body.title;
  //     post.category = req.body.category;
  //     post.content = req.body.content;
  //
  //     post.save(function(err, post) {
  //       if (err) { return res.send(err) }
  //       res.send(post)
  //     })
  //   })
  // })
}
