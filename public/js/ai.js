var AI = {

  positions: [1,2,3,4,5,6,7,8,9],
  winning_combinations: [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],
  cross_positions: [2,4,6,8],
  corner_positions: [1,3,5,7,9],
  ai_claimed_positions: [],
  user_claimed_positions: [],
  unbeatable: true,


  /* Getting next position
  ------------------------------------------------------------------*/
  get_move: function( claimed_positions ){

    this.user_claimed_positions = claimed_positions.player_a;
    this.ai_claimed_positions = claimed_positions.player_b;

    if( this.unbeatable ){
      
      return this.next_best_move();

    } else {

      return this.next_good_move();
    }
  },


  available_positions: function(){

    var available = [];
    available = $(this.positions).not(this.ai_claimed_positions).get();
    available = $(available).not(this.user_claimed_positions).get();

    return available; 
  },


  /* Return 'Good' next move
  ------------------------------------------------------------------*/
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


  /* Return 'Best' next move
  ------------------------------------------------------------------*/
  next_best_move: function(){

    var ap = this.available_positions();

    if( ap.length > 7 ) {

      if( ap.indexOf(5) !== -1 ){
        
        return 5;

      } else {

        return this.available_corner_positions()[0];
      }
      
    } else {

      if( this.winning_move() !== false ){

        return this.winning_move();  

      } else if( this.opponent_winning_move() !== false ) {

        return this.opponent_winning_move();

      } else if( this.available_cross_positions().length !== 0 ){

        return this.available_cross_positions()[0];
        
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


  /* Reset AI
  ------------------------------------------------------------------*/
  reset: function(){
    this.ai_claimed_positions = [];
    this.user_claimed_positions = [];
    this.unbeatable = true;
  }

}
