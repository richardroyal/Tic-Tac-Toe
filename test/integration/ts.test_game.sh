#!/bin/bash

echo "Running test suite for Tic Tac Toe."
echo "casperjs - `casperjs --version`"
echo "------------------------------------------------------"

TESTS=10
 
for (( c=0; c<=$TESTS; c++ ))
do
  casperjs test play_game.js
done

echo "Finished running test $TESTS times."

echo "------------------------------------------------------"
