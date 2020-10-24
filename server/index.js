const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Configuration
const PORT = 4000;
const API_SERVICE_URL =
  "https://books.zoho.com/api/v3/contacts?organization_id=649249007";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Logging
app.use(morgan("dev"));

const heders = {
  "Content-Type": "application/json",
  Authorization: process.env.AUTH_KEY,
};

app.use(
  "/contacts",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/contacts`]: "",
    },
    headers: heders,
  })
);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Not Found");
  next(error);
}

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || PORT, () =>
  console.log("Express server is running on localhost:4000")
);
