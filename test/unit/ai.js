/**
 * Testing ai.js functionality
 *
 * Assumes pages can be accessed from http://localhost:5000/
 * Created using CasperJS 1.1.0-beta3
 */
var root = "http://localhost:5000";

casper.test.begin('AI can claim open positions', 8, function suite(test) {


  /* Game initialized
  --------------------------------------------*/
  casper.start(root, function() {
    test.assertTitle('Tic Tac Toe Challenge', 'page has page title "Tic Tac Toe Challenge".');
    test.assertEquals( Game.positions.length, 9, 'all 9 positions initialized.' );
    test.assertEquals( Game.total_claimed_positions(), 0, 'no claimed positions.' );
    test.assert( Game.position_is_claimable(1), 'first position is claimable.' );
    test.assertNot( Game.is_over(), "game has not ended." );
  });

  /* Initial AI Logic for beatable bot
  --------------------------------------------*/
  casper.then(function() {
    AI.unbeatable = false;
    test.assertEquals( AI.get_move( Game.claimed_positions ), 5, 'AI chooses center position.' );
    Game.claim_position( 'player_b', AI.get_move( Game.claimed_positions ) );
    test.assertNot( Game.position_is_claimable(5), 'claimed position is no longer claimable.' );
    test.assertNot( Game.is_over(), "game has not ended." );
  });
  

  casper.run(function() {
    Game.reset()
    test.done();
  });

});
