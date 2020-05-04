const express = require('express');
const PORT = process.env.PORT || 4000;
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/db');
const path = require('path');
const userRoutes = require('./api/routes/music'); //bring in our user routes

const app = express();

//configure database and mongoose
mongoose.set('useCreateIndex', true);
mongoose
  .connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database is connected');
  })
  .catch((err) => {
    console.log({ database_error: err });
  });
// db configuaration ends here
//registering cors
app.use(cors());

//configure body parser
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//configure body-parser ends here
app.use(morgan('dev')); // configire morgan
app.use('/music', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('portal/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'portal', 'build', 'index.html')); // relative path
  });
}

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
