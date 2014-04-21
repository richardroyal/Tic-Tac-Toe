/**
 * Play every possible game to verify AI is unbeatable.
 * Permutations are dummy generated and do not consider rotations 
 * or other efficientcy steps/methods.
 *
 * Assumes pages can be accessed from http://localhost/Tic-Tac-Toe/
 * Created using CasperJS 1.1.0-beta3
 */
var root = "http://localhost:5000";
var positions = [1,2,3,4,5,6,7,8,9];
var all_possible_games = [];


function generate_permutations( list ){

  if (list.length == 0){
    return [[]];
  }
    
  var result = [];
  
  for (var i=0; i<list.length; i++) {

    var copy = Object.create(list);
    var head = copy.splice(i, 1);

    var rest = generate_permutations(copy);
    
    for (var j=0; j<rest.length; j++) {
      var next = head.concat(rest[j]);
      result.push(next);
    }
  }
  
  return result;
}


casper.test.begin('User cannot beat AI tests', 1, function(test) {

  casper.start(root, function() {
    this.echo('Generating all possible games.', 'PARAMETER' );
    all_possible_games = generate_permutations( positions );
    this.echo( all_possible_games.length + ' games generated.', 'PARAMETER' );
    test.assertEquals( all_possible_games.length, 362880, '9! total games' );
    this.echo( 'Testing all possible games. This could take a while.', 'PARAMETER' );
  });
  

  casper.then(function() { 

    for( var i = 0; i < all_possible_games.length; i++ ){

      Game.reset();
      AI.reset();
      var test_game = all_possible_games[i];

      for( var j = 0; j < test_game.length; j++ ){

        if( Game.is_over() ){

          if( Game.user_has_won('player_a') ){
            this.echo( 'GAME i: ' + i );
            this.echo(Game.claimed_positions.player_a, 'PARAMETER' )
            this.echo(Game.claimed_positions.player_b, 'PARAMETER' )
            test.assertNotEquals( Game.user_has_won('player_a'), true, 'user has not won.' );
          }

        } else {
        
          if( Game.position_is_claimable( test_game[j] ) ) {

            Game.claim_position( 'player_a', test_game[j] );

            var position = AI.get_move( Game.claimed_positions );

            if( Game.position_is_claimable( position ) ) {
              Game.claim_position( 'player_b', position );
            }

          }
        }
      }
    }
  });



  casper.run(function() {
    test.done();
  });
});
