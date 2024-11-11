// server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve only the static files from the dist directory
app.use(express.static(__dirname + '/dist/aetasaal-web'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/aetasaal-web/index.html'));
});

// Start the app by listening on the default Heroku port or port 4000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
