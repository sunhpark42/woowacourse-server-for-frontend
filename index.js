const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;
const config = require('./config/key');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS all accept
const cors = require('cors');

app.use(cors());

// MongoDB connection
const mongoose = require('mongoose');

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

/* main page */

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

/* level1 subway router */

const LEVEL1_SUBWAY_HOST = '/level1/subway';
const Level1Subway = require('./level1-subway/index');

app.use(LEVEL1_SUBWAY_HOST, Level1Subway);

/* level2 cart router */

const LEVEL2_CART_HOST = '/level2/cart';
const Level2Cart = require('./level2-cart/index');

app.use(LEVEL2_CART_HOST, Level2Cart);

app.listen(PORT, () => console.log(`App is Running at ${PORT}`));

app.use(express.static('swagger'));
app.get('/swagger/subway.json', (req, res) => res.sendFile(__dirname + '/swagger/subway.json'));
app.get('/swagger/cart.json', (req, res) => res.sendFile(__dirname + '/swagger/cart.json'));

const swaggerUI = require('swagger-ui-express');

const options = {
  explorer: true,
  swaggerOptions: {
    urls: [
      {
        url: '/swagger/subway.json',
        name: '레벨 1 지하철 노선도 API 명세',
      },
      {
        url: '/swagger/cart.json',
        name: '레벨 2 지하철 노선도 API 명세',
      },
    ],
  },
};

app.use('/docs', swaggerUI.serve, swaggerUI.setup(null, options));
