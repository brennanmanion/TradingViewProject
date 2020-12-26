$(document).ready(function() {

  // Function that parses URL parameters.
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Pre-fill form data.
  $("#firstName").val(getParameterByName("firstName"));
  $("#lastName").val(getParameterByName("lastName"));
  $("#email").val(getParameterByName("email"));
  $("#endpointId").val(getParameterByName("endpointId"));
  if (getParameterByName("t1") == "OptIn") {
    $("#topic1In").prop('checked', true);
  }
  if (getParameterByName("t2") == "OptIn") {
    $("#topic2In").prop('checked', true);
  }
  if (getParameterByName("t3") == "OptIn") {
    $("#topic3In").prop('checked', true);
  }
  if (getParameterByName("t4") == "OptIn") {
    $("#topic4In").prop('checked', true);
  }

  // Handle form submission.
  $("#submit").click(function(e) {

    // Get endpoint ID from URL parameter.
    var endpointId = getParameterByName("endpointId");

    var firstName = $("#firstName").val(),
      lastName = $("#lastName").val(),
      email = $("#email").val(),
      source = window.location.pathname,
      optTimestamp = undefined,
      utcSeconds = Date.now() / 1000,
      timestamp = new Date(0);

    var topicOptIn = [
      $('#topic1In').is(':checked'),
      $('#topic2In').is(':checked'),
      $('#topic3In').is(':checked'),
      $('#topic4In').is(':checked')
    ];

    e.preventDefault();

    $('#submit').prop('disabled', true);
    $('#submit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Saving your preferences</button>');

    // If customer unchecks a box, or leaves a box unchecked, set the opt
    // status to "OptOut".
    for (i = 0; i < topicOptIn.length; i++) {
      if (topicOptIn[i] == true) {
        topicOptIn[i] = "OptIn";
      } else {
        topicOptIn[i] = "OptOut";
      }
    }

    timestamp.setUTCSeconds(utcSeconds);

    var data = JSON.stringify({
      'endpointId': endpointId,
      'firstName': firstName,
      'lastName': lastName,
      'topic1': topicOptIn[0],
      'topic2': topicOptIn[1],
      'topic3': topicOptIn[2],
      'topic4': topicOptIn[3],
      'source': source,
      'optTimestamp': timestamp.toString(),
      'optOutAll': false
    });

    $.ajax({
      type: 'POST',
      url: 'https://mbumynb4o3.execute-api.us-west-2.amazonaws.com/v1/prefs',
      contentType: 'application/json',
      data: data,
      success: function(res) {
        $('#form-response').html('<div class="mt-3 alert alert-success" role="alert">Your preferences have been saved!</div>');
        $('#submit').prop('hidden', true);
        $('#unsubAll').prop('hidden', true);
        $('#submit').text('Preferences saved!');
      },
      error: function(jqxhr, status, exception) {
        $('#form-response').html('<div class="mt-3 alert alert-danger" role="alert">An error occurred. Please try again later.</div>');
        $('#submit').text('Save preferences');
        $('#submit').prop('disabled', false);
      }
    });
  });

  // Handle the case when the customer clicks the "Unsubscribe from all"
  // button.
  $("#unsubAll").click(function(e) {
    var firstName = $("#firstName").val(),
      lastName = $("#lastName").val(),
      source = window.location.pathname,
      optTimestamp = undefined,
      utcSeconds = Date.now() / 1000,
      timestamp = new Date(0);

    // Get endpoint ID from URL parameter.
    var endpointId = getParameterByName("endpointId");

    e.preventDefault();

    $('#unsubAll').prop('disabled', true);
    $('#unsubAll').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Saving your preferences</button>');

    // Uncheck all boxes to give user a visual representation of the opt-out action.
    $("#topic1In").prop('checked', false);
    $("#topic2In").prop('checked', false);
    $("#topic3In").prop('checked', false);
    $("#topic4In").prop('checked', false);

    timestamp.setUTCSeconds(utcSeconds);

    var data = JSON.stringify({
      'endpointId': endpointId,
      'source': source,
      'optTimestamp': timestamp.toString(),
      'optOutAll': true
    });

    $.ajax({
      type: 'POST',
      url: 'https://mbumynb4o3.execute-api.us-west-2.amazonaws.com/v1/prefs',
      contentType: 'application/json',
      data: data,
      success: function(res) {
        $('#form-response').html('<div class="mt-3 alert alert-info" role="alert">Successfully opted you out of all future email communications.</div>');
        $('#submit').prop('hidden', true);
        $('#unsubAll').prop('hidden', true);
      },
      error: function(jqxhr, status, exception) {
        $('#form-response').html('<div class="mt-3 alert alert-danger" role="alert">An error occurred. Please try again later.</div>');
      }
    });
  });
});
