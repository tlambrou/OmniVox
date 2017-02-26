$(document).ready(function() {
  $("#signup-form").submit(function( event ) {
    event.preventDefault();
    // var user = $(this).serialize();
    var user = $('#signup-form').serializeObject();
    console.log(user);

    $.ajax({
      method: "POST",
      url: "/signup",
      data: user,
      success: function (data, status, jqXHR, req, res) { // 200
        // event.preventDefault();
        // res.redirect('/post/' + req.params.id);
        // res.status(200).json({});

        console.log("Success");
        // Redirect to updated post show route
        // function Redirect() {
        //   window.location.replace("/post/" + postId);
        // };
        // Redirect();
      },
      error: function (response) { // 300-500
        console.log(response)
      }
    });
  });
});
