const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const authorization = require('./Models/authorization');

app.use(cors());
app.use(bodyParser.json());
app.disable('etag');

app.use('/authorization', authorization);

app.listen(8888, function () {
  console.log('Server listening on port 8888!');
});
