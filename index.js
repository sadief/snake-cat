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
  body = request.body.you.body
  console.log('BODY1', body)


  console.log('START response', board, head)

  var data = ["up", "down", "right", "left"]

  if (head.x == board.x) {
    data = data.filter(move => move != "right");
    console.log("You are at the RIGHT wall")
  }

  if (head.x == 0) {
    data = data.filter(move => move != "left");
    console.log("You are at the LEFT wall")
  }

  if (head.y == board.y) {
    data = data.filter(move => move != "down");
    console.log("You are at the BOTTOM wall")
  }

  if (head.y == 0) {
    data = data.filter(move => move != "up");
    console.log("You are at the TOP wall")
  }


  var possibleMoves = [
    { name: 'right', x: head.x + 1, y: head.y },
    { name: 'left', x: head.x - 1, y: head.y },
    { name: 'up', x: head.x, y: head.y - 1 },
    { name: 'down', x: head.x, y: head.y + 1 }
  ]

  console.log('Possible Moves', possibleMoves)

  for (var i = 0; i < body.length; i++) {

    if (body[i].x == head.x + 1 && body[i].y == head.y) {
      data = data.filter(move => move != "right");
      console.log('REALLY DONT GO RIGHT')
    }

    if (body[i].x == head.x - 1 && body[i].y == head.y) {
      data = data.filter(move => move != "left");

      console.log('REALLY DONT GO LEFT')
    }

    if (body[i].x == head.x && body[i].y == head.y - 1) {
      data = data.filter(move => move != "down");

      console.log('REALLY DONT GO UP')
    }

    if (body[i].x == head.x && body[i].y == head.y + 1) {
      data = data.filter(move => move != "up");

      console.log('REALLY DONT GO DOWN')
    }


    console.log('COMPARE', body[i], head)
  }
  console.log('HEAD', head)



  var moveMe = { move: '' };
  console.log('DATA', data)
  for (var i = 0; i < data.length; i++) {
    moveMe.move = data[getRandomInt(data.length)]
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
