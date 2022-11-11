const express = require('express')
const app = express()
const port = 8080
var fs = require('fs');

//GET the messages.txt file and return it as a HTTP Response
app.get('/', (req, res) => {
  res.setHeader('content-type', 'text/plain');
  fs.readFile('/var/lib/observer/data/messages.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.send("Error reading files");
    }
    res.send(data)
  });
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})