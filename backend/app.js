const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cron = require('node-cron');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const connectorRoutes = require("./routes/connector");
const todoRoutes = require("./routes/todos");
const testRoutes = require("./routes/util");
const commentRoutes = require("./routes/comments");
const Contest = require('./controllers/util');
const Util = require('./utils/utilities');

const app = express();

const dbName = Util.getDbName();
mongoose
  .connect(
    dbName
  ).then(() => {}).catch(() => {console.log("Error Connecting to Db")});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//  scheduler
// | | | | | day of week
// | | | | month
// | | | day of month
// | | hour
// | minute
// second ( optional )
//  Eg. 0 0 */2 * * * means run every 2 hr
cron.schedule('0 0 */6 * * *', function() {
  Contest.getContest();
  console.log('running a task', new Date());
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api", connectorRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/util", testRoutes);
app.use("/api/comment", commentRoutes);

module.exports = app;
