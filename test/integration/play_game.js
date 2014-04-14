/**
 * Dummy play game choosing random available position.
 *
 * Assumes pages can be accessed from http://localhost/Tic-Tac-Toe/
 * Created using CasperJS 1.1.0-beta3
 */
var root = "http://localhost:5000";
var positions = [1,2,3,4,5,6,7,8,9];

casper.click_a_space = function(n_th){
  this.echo("Clicking position " + n_th.toString(), "PARAMETER" );
  this.click( 'table.game td.position_' + n_th.toString() );
}

casper.test.begin('assertPlayGame() tests', 5, function(test) {
  casper.start(root, function() {
    test.assertTitle('Tic Tac Toe Challenge', 'page has page title "Tic Tac Toe Challenge".');
  });
  
  casper.then(function() { 
    test.assertTextExists('Make the first move.', 'page contains starting instructions.');
  });

  casper.then(function() { 
    casper.page.injectJs('jquery.js');
    casper.evaluate( function(){
      $('table.game td').each( function(i){
        $(this).addClass('position_' + (i + 1).toString());
      });
    });
  });

  casper.then(function() { 
    test.assertExists('.position_9');
  });

  casper.then(function() { 
    var i = positions.length, j, temp;
    while ( --i ){
      j = Math.floor( Math.random() * (i - 1) );
      temp = positions[i];
      positions[i] = positions[j];
      positions[j] = temp;
    }
  });

  casper.then(function() { 
    for( k=0; k<positions.length; k++ ){
      casper.click_a_space(positions.pop());
    }
  });

  casper.then(function() { 
    test.assertTextExists('X', 'page contains "X"');
  });

  casper.then(function() { 
    test.assertTextDoesntExist("User has won.");
  });

  /*
  casper.then(function() { 
    this.capture('test.png');
  });
  */

  casper.run(function() {
    test.done();
  });
});
