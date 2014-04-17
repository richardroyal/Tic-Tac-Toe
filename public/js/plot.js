$( document ).ready(function() {

  $.getJSON( "/results/data/global.json", function( data ) { 
    var ctx = $("#global_doughnut").get(0).getContext("2d");
    new Chart(ctx).Doughnut(data);        

    $(".charts .global").append( '<p class="wins">Wins: ' + data[0].value + '</p>');
    $(".charts .global").append( '<p class="ties">Ties: ' + data[2].value + '</p>');
    $(".charts .global").append( '<p class="losses">Losses: ' + data[1].value + '</p>');
  });

  var user_id = $.cookie('ttt-rr');
  if( user_id !== undefined ){
    $.getJSON( "/results/data/user.json?user_id=" + user_id, function( data ) { 
      var ctx = $("#user_doughnut").get(0).getContext("2d");
      new Chart(ctx).Doughnut(data);        
  
      $(".charts .user").append( '<p class="wins">Wins: ' + data[0].value + '</p>');
      $(".charts .user").append( '<p class="ties">Ties: ' + data[2].value + '</p>');
      $(".charts .user").append( '<p class="losses">Losses: ' + data[1].value + '</p>');
    });
  } 

});
