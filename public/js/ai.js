var AI = {

  positions: [1,2,3,4,5,6,7,8,9],
  winning_combinations: [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],
  cross_positions: [2,4,6,8],
  ai_claimed_positions: [],
  user_claimed_positions: [],
  unbeatable: true,


  /* Getting next position
  ------------------------------------------------------------------*/
  get_move: function( claimed_positions ){

    this.unbeatable = false;

    this.user_claimed_positions = claimed_positions.player_a;
    this.ai_claimed_positions = claimed_positions.player_b;

    if( this.unbeatable ){
      
      return this.random_available_position();

    } else {

      return this.good_next_move();
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
  good_next_move: function(){
    console.log( this.available_positions() );

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

  /* Return 'Perfect' next move
  ------------------------------------------------------------------*/

}
