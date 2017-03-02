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

  var path = window.location.pathname.replace("/","").replace("/","")
  console.log(path)
  $( "path-ref" ).replaceWith('path: <a href="/' + path + '">http://omnivox.io/' + path + '</a>');

  //On title save
  $( "#title-form").submit(function( event ) {
    event.preventDefault();
    var title = $('#title-form').serializeObject();
    console.log(title)
    var pollPath = window.location.pathname.replace("/","").replace("/","")
    $('#title-form').replaceWith('<span class="title">' + title.title +'</span>');
    $.ajax({
      method: "PUT",
      url: "/" + pollPath,
      data: title,
      success: function (data) { // 200
        console.log(data.title);
      },
      error: function (response) { // 300-500
        console.log(response);
      }
    });

  });

  //On title save
  $( "#desc-form").submit(function( event ) {
    event.preventDefault();
    var description = $('#desc-form').serializeObject();
    console.log(description)
    var pollPath = window.location.pathname.replace("/","").replace("/","")
    $('#desc-form').replaceWith('<div class="text"> <p><strong>Description:  </strong>' + description.description +'</p></div>');
    $.ajax({
      method: "PUT",
      url: "/" + pollPath,
      data: description,
      success: function (data) { // 200
        console.log(data.description);
      },
      error: function (response) { // 300-500
        console.log(response);
      }
    });

  });

    //On form submit
    $( "#poll-form" ).submit(function( event ) {
      event.preventDefault();
      // var poll = $(this).serialize(); //Old method for serializing
      var pollPath = $('#poll-form').serializeObject();
      console.log(pollPath.path);
      window.location.href = "/" + slugify(pollPath.path);

      // Posting data and pushing into the current view
      // $.ajax({
      //   method: "POST",
      //   url: "/polls",
      //   data: pollPath,
      //   success: function (data, status, jqXHR) { // 200
      //     event.preventDefault();
      //     console.log(data)
      //     $("#poll-form")[0].reset();
      //     $('#polls').prepend(
      //       '<div class="plan-name"><a href=/polls/"' + data._id + '">' + data.title + '</a></div><div class="remove-poll pull-right" data-id="' + data._id + '"><button type="button" class="btn btn-default">Remove <span class="glyphicon glyphicon-minus"></span></div></button><div class="text"><p>' + data.path + '</p></div>')
      //     },
      //     error: function (response) { // 300-500
      //     }
      //   });
    });

    // Submitting a thought form.
    $( "#thought-form" ).submit(function( event ) {
      event.preventDefault();
      // var thought = $(this).serialize(); //Old method for serializing
      var thought = $(this).serializeObject();
      var pollPath = window.location.pathname.replace("/","").replace("/","")
      console.log(thought)

      // Posting data and pushing into the current view
      $.ajax({
        type: "POST",
        url: "/" + pollPath + "/thoughts",
        data: thought,
        success: function (data, status, jqXHR) { // 200
          console.log("status")
          // $('#thoughts').prepend('<div class="plan-name"><p>' + data.description + '</p></div>');
          $( "#thought-form" )[0].reset();
          // <tr data-status="pagado"> <td> <div class="ckbox"> <input type="checkbox" id="checkbox"> <label for="checkbox1"></label> </div></td><td> <a href="javascript:;" class="star"> <i class="glyphicon glyphicon-star"></i> </a> </td><td> <div class="media"><div class="media-body"> <span data-livestamp="{{poll.updatedAtTime}}"></span><p class="summary">{{this.description}}</p></div></div></td></tr>
        },
        error: function (response) { // 300-500
          console.log(response);
        }
      });
    });

    // Removing poll from the index view
    $('.remove-poll').click(function (e) {
      e.preventDefault();
      var poll = $(this);
      var pollId = poll.data('id');
      $.ajax({
        url: '/poll/' + pollId,
        type: 'DELETE',
        success: function(data) {
          console.log("blah here")
          poll.parent().remove();
        }
      });
    });

    //Clicking the edit button
    $('.edit-poll').click(function (e) {
      e.preventDefault();
      var poll = $(this);
      var pollId = poll.data('id');
      window.location.href = "/polls/edit/" + pollId
    });

    // Submitting the edit form and redirecting to the poll
    $("#edit-form").submit(function( event ) {
      event.preventDefault();
      // var poll = $(this).serialize();
      var poll = $('#edit-form').serializeObject();
      console.log(poll);
      var pollId = window.location.pathname.replace("/polls", "").replace("edit","").replace("/","").replace("/","")


      $.ajax({
        method: "PUT",
        url: "/polls/" + pollId,
        data: poll,
        success: function (data, status, jqXHR, req, res) { // 200
          // event.preventDefault();
          // res.redirect('/polls/' + req.params.id);
          // res.status(200).json({});

          console.log("Success");
          // Redirect to updated polls show route
          function Redirect() {
            window.location.replace("/polls/" + pollId);
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
    //   $.poll('/signup', user, function (data) {
    //     console.log(data);
    //   });
    // });

    // Buttons see-saw appearing on either side of page
    // $('#show').click(function (e) {
    //   e.preventDefault();
    //   $('#show').removeClass("show").addClass("hide");
    //   $('#hide').removeClass("hide").addClass("show");
    // });
    //
    // $('#hide').click(function (e) {
    //   e.preventDefault();
    //   $('#hide').removeClass("show").addClass("hide");
    //   $('#show').removeClass("hide").addClass("show");
    // });
    //
    // // Toggling classes for button on and off (blue or green)
    // $('#success').click(function(s) {
    //   s.preventDefault();
    //   $(this).toggleClass('btn-primary').toggleClass('btn-success');
    // });
  });
