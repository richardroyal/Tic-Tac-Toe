In fulfillment of Cox Media Group [code challenge assignment](https://github.com/coxmediagroup/Tic-Tac-Toe)

Converted markdown version of this doc can be viewed here:

https://gist.github.com/richardroyal/73bc03aa5cf8ee60df5e


## Setup

Install [nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

Application developed using v0.10.25.


Install [MongoDB](http://docs.mongodb.org/manual/installation/)

To run tests, install [CasperJS](http://casperjs.readthedocs.org/en/latest/installation.html)

Tests developed using v1.1.0-beta3

```sh
# From project folder
npm install
```

## Run Application

From project folder

```sh
# Launch server on http://localhost:5000/, can also use: node web.js
foreman start
```
Application can also be viewed at [tic-tac-toe-rr.herokuapp.com](http://tic-tac-toe-rr.herokuapp.com)

## Features & Tools

* NodeJS App
* MongoDB
* jQuery
* Unit testing
* Integration testing
* Jade Template
* ExpressJS
* Chart.js
* Cookie Tracking
* Sass
* JS Minification
* Deployed to Heroku: http://tic-tac-toe-rr.herokuapp.com

## Testing

Test created using [CasperJS](http://casperjs.org/) - v1.1.0-beta3

Install casperjs ~1.1.0

```sh
# Start the nodejs dev server on http://localhost:5000/
foreman start

# Run full test suite, open test suite to see how to run an individual test.
./ts.tic-tac-toe.sh
```
