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
    /* Register user click event listener                       */
    /************************************************************/
    $("td", board).click(function(e) {
      
      if( ! Game.is_over() ) {
        $("p#msg_" + id).text("");

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
  
                end_game('You have won!');
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

                end_game('Game has ended in a tie.');
              }
              
            });

          }

        }
      }

    }); 



  function end_game( msg ){

    $('table.game').hide();
    $('.results').show();
    $(".results").append("<p class='game-end'>" + msg + "</p>");
    $(".results").append("<p class='new-game'><br /><a href='.'>New Game?</a></p>");

    plot_global_data();
    plot_user_data();
    
  }


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
    /* Bot logic for choosing moves                             */
    /************************************************************/
    function bot_make_move(){

      position = bot_winning_move();

      if( position == -1 ){
        position = bot_block_winning_move();
      }

      if( position == -1 && $.inArray( 5, available_positions() ) != -1 ){
        position = 5;
      }

      if( position == -1 ){
        position = random_cross_position();
      }

      if( position == -1 ){
        position = random_available_position();
      }

      position = bot_minimax();

      bot_positions.push(position);

      $('td', board).filter(function() {
        if( $(this).data('position') && $(this).data('position') == position ){
          $(this).addClass("bot_claimed");
          $(this).html('<span>O</span>');
        }
      });
    }

    function bot_winning_move(){

      move = -1;
      for( i=0; i < Game.winning_combinations.length; i++ ){
        win = Game.winning_combinations[i];
        if( $(win).not(bot_positions).length == 1 ){
          m = $(win).not(bot_positions)[0];
          if( $.inArray(m, user_positions) == -1 && move == -1 ){
            move = m; 
          }
        }
      }

      return move;
    }

    function bot_block_winning_move(){

      move = -1;
      for( i=0; i < Game.winning_combinations.length; i++ ){
        win = Game.winning_combinations[i];
        if( $(win).not(user_positions).length == 1 ){
          m = $(win).not(user_positions)[0];
          if( $.inArray(m, bot_positions) == -1 && move == -1 ){
            move = m; 
          }
        }
      }
      
      return move;
    }

    function random_cross_position(){
      move = -1;

      ap = available_positions();
      cp = cross_positions;
      acp = array_intersection(ap, cp);

      if( acp.length > 0 ){
        move = acp[Math.floor( Math.random() * acp.length )];
      }
      
      return move;
    }

    function random_available_position(){

      ap = available_positions();
      random_position = Math.floor( Math.random() * ap.length );

      return ap[random_position];
    }

    var size = 100;

    /* 2 Ply MiniMax for bot AI */
    function bot_minimax(){
      minimax = {};
      heuristic = { 'min': null, 'max': null, 'move': null, 'minimax': null };
      highest_branch_minimax = { 'move': null, 'branch_sum_minimax': -1000 };
      ap = available_positions();
      bp = bot_positions.slice(0);
      up = user_positions.slice(0);

      for( i = 0; i < ap.length; i++ ){

        ply_one = {};
        ply_one.bot_positions = bp.slice(0);
        ply_one.bot_positions.push( ap[i] );

        ply_one.available_positions = ap.slice(0);
        taken = $.inArray( ap[i], ply_one.available_positions );
        ply_one.available_positions.splice( taken, 1 );

        /* IF BOT WINS */
        if( ply_has_winner( ply_one.bot_positions ) ){
          return ap[i];
        } else {

          minimax['branch_' + ap[i]] = [];

          for( j = 0; j < ply_one.available_positions.length; j++ ){
            ply_two = {};
            ply_two.user_positions = user_positions.slice(0);
            ply_two.user_positions.push(ply_one.available_positions[j]);
  
            /* Evaluation function for node is max - min when there is not winner */
            max = wins_left( ply_two.user_positions );
            min = wins_left( ply_one.bot_positions );

            if( ply_has_winner( ply_two.user_positions ) ){
              min = 1000;
            } 
  
            node_minimax = max - min;
            h = { 'move': ap[i], 'countermove': ply_one.available_positions[j], 'max': max,'min': min, 'minimax': node_minimax } 
            minimax['branch_' + ap[i]].push( h );
  
          }

        }
      }

      nmove = { 'minimax': -1000, 'move': null };
      for( var branch in minimax ){
        b_sum = 0;
        best_countermove_max = 1000;
        best_countermove_mm = -1000;

        for( n = 0; n < minimax[branch].length; n++ ){
          b_sum += minimax[branch][n].minimax;
          if( minimax[branch][n].max < best_countermove_max ){
            best_countermove_max = minimax[branch][n].max;
            best_countermove_mm = minimax[branch][n].minimax;
          }
        }


        if( nmove.minimax < best_countermove_mm ){
          nmove.minimax = best_countermove_mm
          nmove.move = minimax[branch][0].move
        }
      
      }

      return nmove.move;
    }



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
    
    function array_intersection(a, b){
      return a.filter( function(i){
        return $.inArray(i,b) > -1;
      });
    }
    
    /************************************************************/
    /* Game over and winning functions                          */
    /************************************************************/
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
    

    function wins_left( opponent_positions ){
      remaining_wins = 0;
      
      for( k=0; k < Game.winning_combinations.length; k++ ){
        win = Game.winning_combinations[k];
        if( $(win).not(opponent_positions).length == 3 ){
          remaining_wins += 1;
        }
      }
      return remaining_wins;
    }
    wins_left = wins_left;

    function ply_has_winner( player_positions ){
      has_winner = false;
      
      for( m=0; m < Game.winning_combinations.length; m++ ){
        win = Game.winning_combinations[m];
        if( $(win).not(player_positions).length == 0 ){
          has_winner = true;
        }
      }
      return has_winner;
    }
  }
}( jQuery ));
