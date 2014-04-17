#!/bin/bash

echo "Running test suite for Tic Tac Toe."
echo "casperjs - `casperjs --version`"
echo "------------------------------------------------------"

echo "Running unit test on Game object."
casperjs test --includes=../public/js/jquery-1.11.0.min.js,../public/js/game.js,../public/js/ai.js unit/game.js unit/ai.js

echo "------------------------------------------------------"
echo "Testing that game results can only be saved with an active nonce key."
casperjs test integration/nonce.js

echo "------------------------------------------------------"
N=10
echo "Running integration tests ($N times)."
for (( c=0; c<=$N; c++ ))
do
  casperjs test integration/play_game.js
done

echo "Finished running test $N times."
echo "------------------------------------------------------"
