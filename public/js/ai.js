/**
 * AI class for choosing countermoves for Tic Tac Toe Game.
 *
 * Has function for choosing next 'good' move and next 'best' move
 * so that it can be beatable or unbeatable.
 *
 * Uses heuristic methodology to choose next move and is not
 * fully algorithmic. Negamax is partially implemented but 
 * contains a bug so is not used.
 *
 */
var AI = {

  positions: [1,2,3,4,5,6,7,8,9],
  winning_combinations: [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],
  cross_positions: [2,4,6,8],
  corner_positions: [1,3,7,9],
  ai_claimed_positions: [],
  user_claimed_positions: [],
  beatable: false,

  
 /**
  * Getting next move from available positions base on beatability setting
  */
  get_move: function( claimed_positions ){

    this.user_claimed_positions = claimed_positions.player_a;
    this.ai_claimed_positions = claimed_positions.player_b;

    if( this.beatable ){
      
      return this.next_good_move();

    } else {

      return this.next_best_move();
    }
  },

  available_positions: function(){

    var available = [];
    
    available = $(this.positions).not(this.ai_claimed_positions).get();
    available = $(available).not(this.user_claimed_positions).get();

    return available; 
  },



 /**
  * Next decent move for when playing against beatable AI
  */
  next_good_move: function(){

    if( $.inArray( 5, this.available_positions() ) !== -1 ){
      
      return 5;

    } else if( this.available_cross_positions().length > 0 ){

       return this.available_cross_positions()[0];

    } else{
    
      return this.random_available_position();
    }

  },

  random_available_position: function(){

    var ap = this.available_positions();
    random_position = Math.floor( Math.random() * ap.length );

    return ap[random_position];
  },

  available_cross_positions: function(){

    var available = [];
    available = $(this.cross_positions).not(this.ai_claimed_positions).get();
    available = $(available).not(this.user_claimed_positions).get();

    return available; 
  },

  available_corner_positions: function(){

    var available = [];
    available = $(this.corner_positions).not(this.ai_claimed_positions).get();
    available = $(available).not(this.user_claimed_positions).get();

    return available; 
  },


 /**
  * Next 'Best' move for when playing against unbeatable AI.
  *
  * Uses simple heuristic for choosing unbeatable moves 
  * that mimics the way a human would play an unbeatable game.
  *
  * @see: http://onlinelibrary.wiley.com/doi/10.1207/s15516709cog1704_3/pdf
  *
  */
  next_best_move: function(){

    var ap = this.available_positions();

    if( ap.length > 7 ) {

      if( ap.indexOf(5) !== -1 ){
        
        return 5;

      } else {

        return this.available_corner_positions()[0];
      }

    } else if( ap.length == 6 && 
               this.user_claimed_positions.indexOf(5) !== -1 && 
               $(this.corner_positions).not(this.user_claimed_positions).length != 4 )  {

        return this.available_corner_positions()[0];
      
    } else {

      if( this.winning_move() !== false ){

        return this.winning_move();  

      } else if( this.opponent_winning_move() !== false ) {

        return this.opponent_winning_move();

      } else if( this.opponent_forks() != false ){

        return this.opponent_forks()[0];

      } else if( this.non_blocked_cross_positions().length !== 0 ){

        return this.non_blocked_cross_positions()[0];

      } else if( this.available_corner_positions().length !== 0 ){

        return this.available_corner_positions()[0];        

      } else {

        return this.random_available_position();
      }
    }
  },


  winning_move: function(){

    var move = false;

    for( var i=0; i < this.winning_combinations.length; i++ ){
      win = this.winning_combinations[i];
      if( $(win).not( this.ai_claimed_positions ).length == 1 ){
        m = $(win).not( this.ai_claimed_positions )[0];
        if( $.inArray(m, this.user_claimed_positions) == -1 ){
          move = m;
        }
      }
    }

    return move;
  },


  opponent_winning_move: function(){

    var move = false;

    for( var i=0; i < this.winning_combinations.length; i++ ){
      win = this.winning_combinations[i];
      if( $(win).not( this.user_claimed_positions ).length == 1 ){
        m = $(win).not( this.user_claimed_positions )[0];
        if( $.inArray(m, this.ai_claimed_positions) == -1 ){
          move = m;
        }
      }
    }

    return move;
  },

  non_blocked_cross_positions: function(){

    var ap = this.available_positions();
    var non_blocked = [];


    if( $([2,8]).not( ap ).length == 0 ){
      non_blocked.push(2);
      non_blocked.push(8);
    }

    if( $([4,6]).not( ap ).length == 0 ){
      non_blocked.push(4);
      non_blocked.push(6);
    }

    return non_blocked; 
  },

  /*  return moves to block oppenent forks or false */
  opponent_forks: function(){

    var blocks = [];

    if( $([2,6]).not(this.user_claimed_positions).length == 0 ){
      
      blocks.push(3);
      
    } else if( $([2,4]).not(this.user_claimed_positions).length == 0 ){

      blocks.push(1);

    } else if( $([6,8]).not(this.user_claimed_positions).length == 0 ){

      blocks.push(9);

    } else if( $([4,8]).not(this.user_claimed_positions).length == 0 ){

      blocks.push(7);
    }

    var available_blocks = [];
    available_blocks = $(blocks).not(this.ai_claimed_positions).get();
    available_blocks = $(available_blocks).not(this.user_claimed_positions).get();

    if( available_blocks.length < 1 ){
    
      return false;
      
    } else {

      return available_blocks; 
    }
  },


 /**
  * Begining of negamax algorithm for choosing 'best'
  * next move given any current game state.
  *
  * Is incomplete and not used.
  */
  negamax: function( state, player, score ){

    if( this.is_terminal( state ) ){

      return this.evaluate_state( state );

    } else {

      var children = this.child_positions( state );
      var best = -1000
      
      for( var k=0; k < children.length; k++ ){

        var child_state = $.extend( {}, state );

        if( player == 1 ){
          
          child_state.ai_claimed_positions.push( children[k] );

        } else {

          child_state.user_claimed_positions.push( children[k] );
        }

        return -1 * this.negamax( child_state, -1 * player, 0 );
      }
    }
  },


  evaluate_state: function( state ){

    if( this.user_has_won_state( state.ai_claimed_positions ) ){

      return 1; 

    } else if( this.user_has_won_state( state.user_claimed_positions ) ){

      return -1; 

    } else {
    
      return 0;
    }
  },

  child_positions: function( state ){

    var available = [];
    var current = [];
    current = state.ai_claimed_positions.slice(0).concat( state.user_claimed_positions );
    available = $(this.positions).not(current).get();

    return available; 
  },

  is_terminal: function(state){

    var claimed_positions = 0;
    claimed_positions += state.ai_claimed_positions.length;
    claimed_positions += state.user_claimed_positions.length;

    if( claimed_positions > 8 ){
    
      return true;

    } else if( this.user_has_won_state( state.ai_claimed_positions ) || 
               this.user_has_won_state( state.user_claimed_positions ) ){

      return true;

    } else {
    
      return false;
    }
  },

  user_has_won_state: function( user_positions ){
    var winner = false;

    for( var i=0; i < this.winning_combinations.length; i++ ){
      var win = this.winning_combinations[i];
      if( $(win).not( user_positions ).length == 0 ){
        winner = true;
      }
    }
    
    return winner;
  },



  
  reset: function(){
    this.ai_claimed_positions = [];
    this.user_claimed_positions = [];
    this.beatable = false;
  }

}
