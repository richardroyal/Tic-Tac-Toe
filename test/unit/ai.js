/**
 * Testing ai.js functionality
 *
 * Assumes pages can be accessed from http://localhost:5000/
 * Created using CasperJS 1.1.0-beta3
 */
var root = "http://localhost:5000";

casper.test.begin('AI can claim open positions', 22, function suite(test) {


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

    AI.reset();
    test.assertEquals( AI.available_positions(), [1,2,3,4,5,6,7,8,9], 'AI properly reset.' );
  });
  

  /* AI support functions for unbeatable bot
  --------------------------------------------*/
  casper.then(function() {
    Game.reset();
    AI.reset();

    state = { ai_claimed_positions: [], user_claimed_positions: [] };
    test.assertEquals( AI.user_has_won_state(state.ai_claimed_positions), false, 'state not won.' );
    test.assertEquals( AI.user_has_won_state(state.user_claimed_positions), false, 'state not won.' );
    test.assertEquals( AI.is_terminal(state), false, 'state not terminal.' );
    test.assertEquals( AI.child_positions(state), [1,2,3,4,5,6,7,8,9], 'all positions available.' );

    state.ai_claimed_positions = [1,2,3];
    test.assertEquals( AI.evaluate_state( state ), 1, 'ai win evaluluates to 1.' );
    test.assertEquals( AI.is_terminal(state), true, 'state is terminal.' );
    test.assertEquals( AI.child_positions(state), [4,5,6,7,8,9], 'correct positions available.' );

    state.ai_claimed_positions = [1,2,4];
    state.user_claimed_positions = [7,8,9];
    test.assertEquals( AI.evaluate_state(state), -1, 'user win evaluluates to -1.' );
    test.assertEquals( AI.is_terminal(state), true, 'state is terminal.' );
    test.assertEquals( AI.child_positions(state), [3,5,6], 'correct positions available.' );

    state.ai_claimed_positions = [1,3,4,8,9];
    state.user_claimed_positions = [2,5,6,7];
    test.assertEquals( AI.evaluate_state( state ), 0, 'tie evaluluates to 0.' );
    test.assertEquals( AI.is_terminal(state), true, 'state is terminal.' );
    test.assertEquals( AI.child_positions(state), [], 'no positions available.' );
  });


  /* AI minimax functionality
  --------------------------------------------*/
  casper.then(function() {
    Game.reset();
    AI.reset();

    state = { ai_claimed_positions: [5,6], user_claimed_positions: [1,2,3] };
    available = [4,7,8,9];

    for( var l=0; l < available.length; l++ ){
      pstate = {};
      pstate.ai_claimed_positions = [ 5,6, available[l] ];
      pstate.user_claimed_positions = [1,2,3];
      var branch_score = AI.negamax( pstate, 1, -100 );
      console.log( branch_score );
      console.log('***********************************')
    }


/*
    state = { ai_claimed_positions: [], user_claimed_positions: [1] };
    available = [2,3,4,5,6,7,8,9];

    for( var l=0; l < available.length; l++ ){
      pstate = {};
      pstate.ai_claimed_positions = [ available[l] ];
      pstate.user_claimed_positions = [1];
      var branch_score = AI.negamax( pstate, 1, 0 );
      console.log( branch_score );
      console.log('***********************************')
    }
*/    
  });





  casper.run(function() {
    Game.reset();
    test.done();
  });

});
