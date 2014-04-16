/**
 * Check that results can only be saved with an active nonce key.
 *
 * Assumes pages can be accessed from http://localhost/Tic-Tac-Toe/
 * Created using CasperJS 1.1.0-beta3
 */
var root = "http://localhost:5000";
var nonce = '';

casper.test.begin('assertSaveResults() tests', 5, function(test) {
  casper.start(root, function() {
    test.assertTitle('Tic Tac Toe Challenge', 'page has page title "Tic Tac Toe Challenge".');
  });
  
  casper.then(function() { 
    test.assertExists('input#nonce', 'nonce key generated.');
    nonce = this.getElementInfo('input#nonce').attributes.value;
  });

  casper.thenOpen( root + '/results/win', function() { 
    test.assertTextExists('Invalid', 'cannot save result without nonce key.');
  });

  casper.then(function() { 
    this.open( root + '/results/win?nonce=' + nonce );
  });

  casper.then(function() { 
    test.assertTextExists('saved', 'can save result with correct nonce key.');
  });

  casper.then(function() { 
    this.open( root + '/results/win?nonce=' + nonce );
  });

  casper.then(function() { 
    test.assertTextExists('Invalid', 'cannot re-save result using previously used nonce key.');
  });

  casper.run(function() {
    test.done();
  });
});
