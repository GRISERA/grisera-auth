require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/User");
const Permission = require("./models/Permission");

const connectWithRetry = () => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(async () => {
      console.log('Connected to DB');
      console.log(process.env.DB_URL);
      const admin = new mongoose.mongo.Admin(mongoose.connection.db);
      const dbs = await admin.listDatabases();
      const dbExists = dbs.databases.some(db => db.name === process.env.DB_NAME);

      if (dbExists) {
        console.log('Database exists.');
        await User.createIndexes();
        await Permission.createIndexes();
      } else {
        console.log('Database does not exist.');
        throw new Error('Database does not exist');
      }
    })
    .catch((err) => {
      console.error(err);
      console.log('Failed to connect to DB. Retrying in 1 second..');
      setTimeout(connectWithRetry, 1000);
    });
};

connectWithRetry();

const app = express();
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(bodyParser.json());

app.use('/api/permissions', require('./endpoints/permissions'));
app.use('/api/register', require('./endpoints/register'));
app.use('/api/login', require('./endpoints/login'));
app.use('/api/health', require('./endpoints/health'));
app.use('/api/users', require('./endpoints/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
