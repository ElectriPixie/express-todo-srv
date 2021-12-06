import express from 'express';
const bodyParser = require('body-parser')
const withAuth = require("./withAuth");
const todo = require("./routes/todo");
const user = require("./routes/user");
const cors = require("cors");
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/webapp', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", todo);
app.use("/", user);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(4000, () =>
  console.log('Example app listening on port 4000!'),
);
