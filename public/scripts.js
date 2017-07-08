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
  $( "path-ref" ).replaceWith('path: <a href="/' + path + '">http://omnivox.io/' + path + '</a>');

  //On title save
  $( "#title-form").submit(function( event ) {
    event.preventDefault();
    var title = $('#title-form').serializeObject();
    console.log(title)
    var pollPath = window.location.pathname.replace("/","").replace("/","")
    $('#title-block').replaceWith('<div id="title-block"><h2 id="title-line"><span id="title-text>"' + title.title +'</span></h2></div>');
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

  // Edit the title in-place
  $('#title-edit').click(function (e) {
    event.preventDefault();
    var title = $('#title-text').html()
    $("#title-block").replaceWith('<div id="title-block"><form id="title-edit-form"><fieldset><div class="input-group"><input type="text" name="title" for="title" autofocus="autofocus" placeholder="Ask a Question for Your Poll Here" class="form-control"><div class="input-group-btn"><button type="submit" class="btn btn-info">Save</button></div></div></fieldset></form></div>')
    console.log(title)
    $('.form-control').val(title)
  });

  //On title edit save
  $( "#title-edit-form").submit(function( event ) {
    event.preventDefault();
    var title = $('#title-edit-form').serializeObject();
    console.log(title)
    var pollPath = window.location.pathname.replace("/","").replace("/","")
    $('#title-edit-form').replaceWith('<div id="title-block"><h2 id="title-line"><span id="title-text">' + title.title +'</span></h2></div>');
    $.ajax({
      method: "PATCH",
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

  //On description save
  $( "#desc-form").submit(function( event ) {
    event.preventDefault();
    var description = $('#desc-form').serializeObject();
    console.log(description)
    var pollPath = window.location.pathname.replace("/","").replace("/","")
    $('#desc-form').replace('<h5><p class="flow-text"><strong>Description:  </strong>' + description.description +'</p></h5>');
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
        $( "#thought-form" )[0].reset();
        var thoughtHTML = '<tr id="thought-row" class="info"><td> <div class="" data-toggle="buttons"> <label class="btn btn-sm btn-success active"> <input type="radio" name="options" id="option1" autocomplete="off" checked> <i class="fa fa-check"></i> Voted </label> <label class="btn btn-sm btn-default"> <input type="radio" name="options" id="option2" autocomplete="off"> <i class="fa fa-warning"></i> Vote </label> </div></td><td>'+ data.description +'</td><td> <div class="progress"> <div style="width: 0%;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" role="progressbar" class="blue progress-bar"> <span>0%</span> </div></div></td><td><span class="label label-info">Recent</span></td><td> <div class="remove-thought" data-id="'+ data._id +'"> <button type="button" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-trash"></span> </button> </div></td></tr>'

        if($('#table').length === 0){
          var content = '<table id="table" class="highlight"><thead><tr><th></th><th>Response</th><th style="width:40%;">Results</th><th>Votes</th><th></th></tr></thead><tbody id="thought-tbody">' + thoughtHTML + '</tbody></table>'
          $('#table-start').after(content)
        } else {
          $( "#thought-tbody" ).prepend(thoughtHTML)
        }

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

  // Removing thought from the poll show view
  $('.remove-thought').click(function (e) {
    e.preventDefault();
    var thought = $(this);
    var thoughtId = thought.data('id');
    $.ajax({
      url: '/thoughts/' + thoughtId,
      type: 'DELETE',
      success: function(data) {
        console.log("blah here")
        thought.parent().remove();
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

  // Table JS
  $("#mytable #checkall").click(function () {
    if ($("#mytable #checkall").is(':checked')) {
      $("#mytable input[type=checkbox]").each(function () {
        $(this).prop("checked", true);
      });

    } else {
      $("#mytable input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
      });
    }
  });

  $("[data-toggle=tooltip]").tooltip();

  // Voted check...
  $("#thought-tbody" )



  // User clicks to vote!
  $("#thought-tbody #vote-buttons").each( function() {
    $(this).click(function () {
      if ($(this).find("#unvote").hasClass("active")) {
        var pollPath = window.location.pathname.replace("/","").replace("/","")
        var thoughtId = $(this).find("#unvote-button").attr("name")
        var thought = { _id: thoughtId }
        $.ajax({
          method: "PUT",
          url: "/polls/" + pollPath + "/thoughts/" + thoughtId,
          data: thought,
          success: function (data) { // 200
            console.log(data);
            window.location.reload();

          },
          error: function (response) { // 300-500
            console.log(response);
          }
        });
      }


      // var thought = $(this);
      // console.log($(this));
      // var thoughtId = thought.data('id');
      // if ($(this).children().has("#vote").hasClass("active")) {
      //   var thoughtId = $("#vote-button").attr("name")
      //   console.log("thoughtId: " + thoughtId)
      // }
    })


  });

  // User clicks to unvote!
  $("#thought-tbody #vote-buttons").each( function() {
    $(this).click(function () {
      if ($(this).find("#vote").hasClass("active")) {
        var pollPath = window.location.pathname.replace("/","").replace("/","")
        var thoughtId = $(this).find("#vote-button").attr("name")
        var thought = { _id: thoughtId }

        $.ajax({
          method: "PUT",
          url: "/polls/" + pollPath + "/thoughts/" + thoughtId,
          data: thought,
          success: function (data) { // 200
            console.log(data);
            window.location.reload();

          },
          error: function (response) { // 300-500
            console.log(response);
          }
        });
      }
    })
  });

  // Render the path properly
  if($('#path-url').length === 0){
    var insertPath = '<h5 id="poll-path">path: <a id="path-url" href="/' + path + '">http://omnivox.io/' + path + '</a></h5>'
    $( "#poll-path" ).replaceWith( insertPath );
  }

});
