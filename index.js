const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---
var board = { x: 0, y: 0 }
var head = {}
// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  board['y'] = request.body.board.height - 1
  board['x'] = request.body.board.width - 1

  head = request.body.you.body[0]

  console.log('START response', board, head)


  // Response data
  const data = {
    "color": "#B22222",
    "headType": "bendr",
    "tailType": "bolt"
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move

  head = request.body.you.body[0]

  console.log('START response', board, head)

  var data = ["up", "down", "right", "left"]

  if (head.x == board.x) {
    data = data.filter(move => "right");
    console.log("You are at the RIGHT wall")
  }

  if (head.x == 0) {
    data = data.filter(move => "left");
    console.log("You are at the LEFT wall")
  }

  if (head.y == board.y) {
    data = data.filter(move => "down");
    console.log("You are at the BOTTOM wall")
  }

  if (head.y == 0) {
    data = data.filter(move => "up");
    console.log("You are at the TOP wall")
  }


  var moveMe = '';
  // // Response data
  const ra = {
    move: 'right', // one of: ['up','down','left','right']
  }

  for (var i = 0; i < data.length; i++) {
    moveMe = { move: data[getRandomInt(data.length)] }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  return response.json(moveMe)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
