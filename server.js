"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

db().catch((err) => console.log(err));

async function db() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to DB");
  await Books.create(
    [
      {
        _id: "63657911922d375e25ad1b85",
        title: "The nya nya test book",
        comments: ["mew", "meow", "NYA"],
      },
      {
        _id: "63680748dad31302a987eaed",
        title: "Comment modification testnya",
      },
    ],
    (err, docs) => {
      err ? console.log(err) : console.log(docs);
    }
  );
  startApp();
}

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  comments: {
    type: [String],
  },
});

const Books = mongoose.model("Books", bookSchema);

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app, Books);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

//Start our server and tests!
function startApp() {
  const listener = app.listen(process.env.PORT || 3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          console.log("Tests are not valid:");
          console.error(e);
        }
      }, 1500);
    }
  });
}
module.exports = app; //for unit/functional testing
