/*!
 *  jQuery Tic Tac Toe JavaScript Library
 *  Acts on HTML 3X3 table.
 *  
 *  Responds with countermove after each user move.
 *
 *  @version 0.0.1
 *  @author Richard Royal
 */
(function( $ ) {
  $.fn.Tic_Tac_Toe = function(args) {

    var board = $(this);
    var id = new Date().getTime().toString();
    var user_positions = [];
    var bot_positions = [];
    var total_positions = [];
    var winning_combinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
    var cross_positions = [2,4,6,8];
    

    /************************************************************/
    /* Setup board data-dash attributes and message container   */
    /************************************************************/
    $("td", board).each( function(index){
      $(this).data("position", index + 1);
      total_positions.push( index + 1 );
    });
    $(board).after("<p id='msg_" + id + "' class='game_msg'>Make the first move.</p>");


    /************************************************************/
    /* User play listener and AI response.                      */
    /************************************************************/
    $("td", board).click(function(e) {
      
      if( ! Game.is_over() ) {
        $("p#msg_" + id).text("");
        $('.controls').hide();

        position = $(this).data('position');
  
        if( Game.position_is_claimable( position ) ) {

          Game.claim_position( 'player_a', position );
          $(this).addClass("user_claimed");
          $(this).html('<span>X</span>');
  
          if( Game.user_has_won('player_a') ){

            $.ajax({

              url: '/results/win',
              data: {
                 nonce: $('input#nonce').val(),
                 user_id: $.cookie('ttt-rr')
              },
              
              error: function(xhr, status, error){

                $("p#msg_" + id).append( xhr.responseText + "<br />");
              },
              complete: function(xhr,status){
  
                end_game('You won!');
              }
              
            });

          } else {

            position = AI.get_move( Game.claimed_positions );
            Game.claim_position( 'player_b', position );

            $('td', board).filter(function() {
              if( $(this).data('position') && $(this).data('position') == position ){
                $(this).addClass("bot_claimed");
                $(this).html('<span>O</span>');
              }
            });

          }

          if( Game.user_has_won('player_b') ) {

            $.ajax({

              url: '/results/loss',
              data: { 
                 nonce: $('input#nonce').val(),
                 user_id: $.cookie('ttt-rr')
              },
              
              error: function(xhr, status, error){

                $("p#msg_" + id).append( xhr.responseText + "<br />");
              },
              complete: function(xhr,status){

                end_game('You lost.');
              }
              
            });

          } else if( Game.ended_in_tie() ){

            $.ajax({

              url: '/results/tie',
              data: { 
                 nonce: $('input#nonce').val(),
                 user_id: $.cookie('ttt-rr')
              },
              
              error: function(xhr, status, error){

                $("p#msg_" + id).append( xhr.responseText + "<br />");
              },
              complete: function(xhr,status){

                end_game('Draw');
              }
              
            });

          }

        }
      }

    }); 



    /************************************************************/
    /* Utilities for claimable and total positions              */
    /************************************************************/

    function user_can_claim_position( position ){

      claimable = true;

      if( typeof position === 'undefined' ){
        claimable = false;
      } else if( $.inArray( position, user_positions ) != -1 ){
        claimable = false;
      } else if( $.inArray( position, bot_positions ) != -1 ){
        claimable = false;
      } else if( user_positions.length >= 5 ) {
        claimable = false;
      }

      return claimable;
    }

    function available_positions(){

      available = [];
      available = $(total_positions).not(user_positions).get();
      available = $(available).not(bot_positions).get();

      return available;
    }
    
    
    /************************************************************/
    /* Game over and winning functions                          */
    /************************************************************/

    function end_game( msg ){
  
      $('table.game').hide();
      $('.results').show();
      $(".results").append("<p class='game-end'>" + msg + "</p>");
      $(".results").append("<p class='new-game'><br /><a href='.'>New Game?</a></p>");
  
      plot_global_data();
      plot_user_data();
    }
  

    function check_bot_has_won(){
      won = false;

      if( ! game_over ){
      
        for( i=0; i < Game.winning_combinations.length; i++ ){
          win = Game.winning_combinations[i];
          if( $(win).not(bot_positions).length == 0 ){
            won = true;
          }
        }
      }

      return won;
    }

    function check_user_has_won(){
      won = false;

      if( ! game_over ){

        for( i=0; i < Game.winning_combinations.length; i++ ){
          win = Game.winning_combinations[i];
          if( $(win).not(user_positions).length == 0 ){
            won = true;
          }
        }
      }

      return won;
    }


    /************************************************************/
    /* Plot data after game over using stats from JSON.         */
    /************************************************************/

    function plot_global_data(){
      $.getJSON( "/results/data/global.json", function( data ) {
        var ctx = $("#global_doughnut").get(0).getContext("2d");
        new Chart(ctx).Doughnut(data);
  
        $(".charts .global").append( '<p class="wins">Wins: ' + data[0].value + '</p>');
        $(".charts .global").append( '<p class="ties">Ties: ' + data[2].value + '</p>');
        $(".charts .global").append( '<p class="losses">Losses: ' + data[1].value + '</p>');
      });
    }
  
    function plot_user_data(){
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
    }


    /************************************************************/
    /* Controls for beatable and unbeatable AI.                 */
    /************************************************************/
    $("input#beatable").click(function(e) {
      AI.beatable = $(this).is(':checked');
    });

  }
}( jQuery ));
