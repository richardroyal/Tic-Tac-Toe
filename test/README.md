# Testing

Test created using [CasperJS](http://casperjs.org/) - v1.1.0-beta3

## Running tests

Install casperjs ~1.1.0
Start the nodejs dev server on http://localhost:5000/ `node web.js`

```sh
# Running full test suite
./ts.tic-tac-toe.sh
```

```sh
# Running individual tests

# Integration tests - run once
casperjs test integration/play_game.js
```
