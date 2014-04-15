var AI = {

  positions: [1,2,3,4,5,6,7,8,9],
  winning_combinations: [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],
  ai_claimed_positions: [],
  user_claimed_positions: [],


  get_move: function( claimed_positions ){

    this.user_claimed_positions = claimed_positions.player_a;
    this.ai_claimed_positions = claimed_positions.player_b;
    
    return this.random_available_position();
  },


  available_positions: function(){

    available = [];
    available = $(this.positions).not(this.ai_claimed_positions).get();
    available = $(available).not(this.user_claimed_positions).get();

    return available; 
  },


  random_available_position: function(){

    ap = this.available_positions();
    random_position = Math.floor( Math.random() * ap.length );

    return ap[random_position];
  },

}
