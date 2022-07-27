const express = require("express");
const fs = require("fs");
const path = require("path");
const { Helmet } = require("react-helmet-async");
const { renderToString } = require("react-dom/server");

// create express application
const app = express();

// serve static assets
// app.get(
//   /\.(js|css|map|ico)$/,
//   express.static(path.resolve(__dirname, "../build"))
// );
app.use(express.static(path.resolve(__dirname, "../build")));

// for any other requests, send `index.html` as a response
app.use("*", (req, res) => {
  // read `index.html` file
  // const helmet = Helmet.;
  let indexHTML = fs.readFileSync(
    path.resolve(__dirname, "../build/index.html"),
    {
      encoding: "utf8",
    }
  );

  // set header and status
  res.contentType("text/html");
  res.status(200);

  return res.send(indexHTML);
});

// run express server on port 9000
app.listen("9000", () => {
  console.log("Express server started at http://localhost:9000");
});
