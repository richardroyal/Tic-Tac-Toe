#!/bin/bash

echo "Running test suite for Tic Tac Toe."
echo "casperjs - `casperjs --version`"
echo "------------------------------------------------------"

echo "Running unit test on Game object."
casperjs test --includes=../public/js/game.js,../public/js/jquery-1.11.0.min.js unit/game.js


echo "------------------------------------------------------"
N=10
echo "Running integration tests ($N times)."
for (( c=0; c<=$N; c++ ))
do
  casperjs test integration/play_game.js
done

echo "Finished running test $N times."
echo "------------------------------------------------------"
