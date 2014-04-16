var Game = {

  positions: [1,2,3,4,5,6,7,8,9],
  winning_combinations: [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],
  cross_positions: [2,4,6,8],

  claimed_positions: {
    player_a: [],
    player_b: [],
  },
  
  /* Claim position and availability functions.
  ---------------------------------------------------*/
  position_is_claimable: function(position){

    if( $.inArray( position, this.claimed_positions.player_a ) != -1 ){

      return false;

    } else if( $.inArray( position, this.claimed_positions.player_b ) != -1 ){

      return false;

    } else {

      return true;
    }
  },

  claim_position: function(user, position){
    this.claimed_positions[user].push(position);
  },

  /* Determine a winner, tie, or game over.
  ---------------------------------------------------*/

  is_over: function(){

    if( this.total_claimed_positions() > 8 ){

      return true;

    } else if( this.user_has_won('player_a') || this.user_has_won('player_b') ){

      return true;
      
    } else {

      return false;  
    }
  },

  user_has_won: function(user){
    winner = false;

    for( var i=0; i < this.winning_combinations.length; i++ ){
      var win = this.winning_combinations[i];
      if( $(win).not( this.claimed_positions[user] ).length == 0 ){
        winner = true;
      }
    }
    
    return winner;
  },

  ended_in_tie: function() {

    if( this.total_claimed_positions() < 9 ){
    
      return false;

    } else if( this.user_has_won('player_a') || this.user_has_won('player_b') ){

      return false;
    } else {
    
      return true;
    }
  },

  total_claimed_positions: function(){

    a_claimed = this.claimed_positions.player_a.length;
    b_claimed = this.claimed_positions.player_b.length;

    return a_claimed + b_claimed;
  },

  reset: function(){
    this.claimed_positions.player_a = [];
    this.claimed_positions.player_b = [];
  },

}
