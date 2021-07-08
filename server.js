const express = require('express')
const app = express()
const myApp = require('./myApp')
const cors = require('cors')
require('dotenv').config()

app.use(myApp)
app.use(cors())
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://freecodecamp.org');
})
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
