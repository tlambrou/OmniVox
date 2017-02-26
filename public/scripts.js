// Function for serializing the data properly
$.fn.serializeObject = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

//Accessing the DOM
$(document).ready(function() {
  //On form submit
  $( "#post-form" ).submit(function( event ) {
    event.preventDefault();
    // var post = $(this).serialize(); //Old method for serializing
    var post = $('#post-form').serializeObject();
    console.log(post);

    // Posting data and pushing into the current view
    $.ajax({
      method: "POST",
      url: "/posts",
      data: post,
      success: function (data, status, jqXHR) { // 200
        event.preventDefault();
        console.log(data)
        $("#post-form")[0].reset();
        $('#posts').prepend(
          '<div class="plan-name"><a href=/post/"' + data._id + '">' + data.title + '</a></div><div class="remove-post pull-right" data-id="' + data._id + '"><button type="button" class="btn btn-default">Remove <span class="glyphicon glyphicon-minus"></span></div></button><div class="text"><p>' + data.category + '</p></div>')
        },
        error: function (response) { // 300-500
        }
      });
    });

    // Submitting a comment form.
    $( "#comment-form" ).submit(function( event ) {
      event.preventDefault();
      var comment = $(this).serialize(); //Old method for serializing
      // var comment = $(this).serializeObject();
      var postId = window.location.pathname.replace("/post", "").replace("edit","").replace("/","").replace("/","")

      // Posting data and pushing into the current view
      $.ajax({
        type: "POST",
        url: "/posts/" + postId + "/comments",
        data: comment,
        success: function (data, status) { // 200
          console.log(data.content)
          $('#comments').prepend('<div class="plan-name"><p>' + data.content + '</p></div>');
          $( "#comment-form" )[0].reset();
        },
        error: function (response) { // 300-500
          console.log(response);
        }
      });
    });

      // Removing post from the index view
      $('.remove-post').click(function (e) {
        e.preventDefault();
        var post = $(this);
        var postId = post.data('id');
        $.ajax({
          url: '/post/' + postId,
          type: 'DELETE',
          success: function(data) {
            console.log("blah here")
            post.parent().remove();
          }
        });
      });

      //Clicking the edit button
      $('.edit-post').click(function (e) {
        e.preventDefault();
        var post = $(this);
        var postId = post.data('id');
        window.location.href = "/post/edit/" + postId
      });

      // Submitting the edit form and redirecting to the post
      $("#edit-form").submit(function( event ) {
        event.preventDefault();
        // var post = $(this).serialize();
        var post = $('#edit-form').serializeObject();
        console.log(post);
        var postId = window.location.pathname.replace("/post", "").replace("edit","").replace("/","").replace("/","")


        $.ajax({
          method: "PUT",
          url: "/post/" + postId,
          data: post,
          success: function (data, status, jqXHR, req, res) { // 200
            // event.preventDefault();
            // res.redirect('/post/' + req.params.id);
            // res.status(200).json({});

            console.log("Success");
            // Redirect to updated post show route
            function Redirect() {
              window.location.replace("/post/" + postId);
            };
            Redirect();
          },
          error: function (response) { // 300-500
          }
        });
      });

      // Sign Up form validation
      // $('#signup-form').validate({
      //   rules: {
      //     password: {
      //       required: true,
      //       minlength: 6,
      //       maxlength: 10,
      //     } ,
      //     confirm: {
      //       equalTo: "#password",
      //       minlength: 6,
      //       maxlength: 10
      //     }
      //   },
      //   messages:{
      //     password: {
      //       required:"the password is required"
      //     }
      //   }
      // });

      // Submitting a sign up form'
      // $("#signup-form").submit(function(e) {
      //   e.preventDefault();
      //   var user = $(this).serializeObject();
      //   console.log(user);
      //
      //   $.post('/signup', user, function (data) {
      //     console.log(data);
      //   });
      // });

      // Buttons see-saw appearing on either side of page
      $('#show').click(function (e) {
        e.preventDefault();
        $('#show').removeClass("show").addClass("hide");
        $('#hide').removeClass("hide").addClass("show");
      });

      $('#hide').click(function (e) {
        e.preventDefault();
        $('#hide').removeClass("show").addClass("hide");
        $('#show').removeClass("hide").addClass("show");
      });

      // Toggling classes for button on and off (blue or green)
      $('#success').click(function(s) {
        s.preventDefault();
        $(this).toggleClass('btn-primary').toggleClass('btn-success');
      });
    });
