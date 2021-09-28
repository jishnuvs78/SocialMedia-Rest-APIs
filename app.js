const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./ApiRoutes/auth");
const postRoute = require("./ApiRoutes/posts");
const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/auth", authRoute);
app.use("/api/posts",postRoute);

dotenv.config();

mongoose.connect(process.env.URL, {useNewUrlParser: true,useUnifiedTopology: true},()=>{
  console.log("connected");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
