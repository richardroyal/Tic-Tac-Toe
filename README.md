In fulfillment of Cox Media Group pre-employment [code challenge assignment](https://github.com/coxmediagroup/Tic-Tac-Toe)

## Setup

Install [nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

Application developed using v0.10.25.


Install [MongoDB](http://docs.mongodb.org/manual/installation/)

To run tests, install [CasperJS](http://casperjs.readthedocs.org/en/latest/installation.html)

Tests developed using v1.1.0-beta3

From project folder

```sh
npm install
```

## Running Application

From project folder

```sh
# Launches server on http://localhost:5000/
# Can also user node web.js
foreman start
```
Application can also be view at [tic-tac-toe-rr.herokuapp.com](http://tic-tac-toe-rr.herokuapp.com)


## Testing

Test created using [CasperJS](http://casperjs.org/) - v1.1.0-beta3

Install casperjs ~1.1.0

```sh
# Start the nodejs dev server on http://localhost:5000/
foreman server

# Running full test suite
# Open test suite to see how to run an individual test.
./ts.tic-tac-toe.sh
```
