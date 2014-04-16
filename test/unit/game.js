/**
 * Testing game.js functionality
 *
 * Assumes pages can be accessed from http://localhost:5000/
 * Created using CasperJS 1.1.0-beta3
 */
var root = "http://localhost:5000";

casper.test.begin('User can claim open positions', 22, function suite(test) {


  /* Game initialized
  --------------------------------------------*/
  casper.start(root, function() {
    test.assertTitle('Tic Tac Toe Challenge', 'page has page title "Tic Tac Toe Challenge".');
  });

  casper.then(function() {
    test.assertEquals( Game.positions.length, 9, 'all 9 positions initialized.' );
    test.assertEquals( Game.total_claimed_positions(), 0, 'no claimed positions.' );
    test.assert( Game.position_is_claimable(1), 'first position is claimable.' );
    test.assertNot( Game.is_over(), "game has not ended." );
  });

  /* Player can claim positions
  --------------------------------------------*/
  casper.then(function() {
    Game.claim_position('player_a', 1);
    test.assertEquals( Game.total_claimed_positions(), 1, 'claimed positions incremented.' );
    test.assertNot( Game.position_is_claimable(1), 'claimed position is no longer claimable.' );
    test.assertNot( Game.is_over(), "game has not ended." );
  });
  
  /* Player can win
  --------------------------------------------*/
  casper.then(function() {
    Game.claim_position('player_a', 2);
    Game.claim_position('player_a', 3);
    test.assertEquals( Game.total_claimed_positions(), 3, 'claimed positions incremented.' );
    test.assertNot( Game.position_is_claimable(3), 'claimed position is no longer claimable.' );
    test.assertEquals( Game.claimed_positions.player_a, [1,2,3], 'tracking player positions.' );
    test.assertNot( Game.ended_in_tie(), "game ended in tie." );
    test.assert( Game.user_has_won('player_a'), "game has ended in win." );
    test.assert( Game.is_over(), "game has ended." );
  });

  /* Game reset and end in tie
  --------------------------------------------*/
  casper.then(function() {
    Game.reset();
    test.assertEquals( Game.total_claimed_positions(), 0, 'no claimed positions.' );
    test.assert( Game.position_is_claimable(1), 'first position is claimable.' );
    test.assertNot( Game.is_over(), "game has not ended." );

    Game.claim_position('player_a', 1);
    Game.claim_position('player_a', 3);
    Game.claim_position('player_a', 6);
    Game.claim_position('player_a', 7);
    Game.claim_position('player_a', 8);

    test.assertEquals( Game.total_claimed_positions(), 5, 'claimed positions incremented.' );

    Game.claim_position('player_b', 2);
    Game.claim_position('player_b', 4);
    Game.claim_position('player_b', 5);
    Game.claim_position('player_b', 9);

    test.assertNot( Game.user_has_won('player_a'), "game has ended in win." );
    test.assertNot( Game.user_has_won('player_b'), "game has ended in win." );
    test.assert( Game.ended_in_tie(), "game ended in tie." );
    test.assert( Game.is_over(), "game has ended." );
  });


  casper.run(function() {
    Game.reset();
    test.done();
  });

});
