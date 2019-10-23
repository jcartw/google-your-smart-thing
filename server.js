const express = require("express");
const bodyParser = require("body-parser");
const oAuthRoutes = require("./oauth/routes");
const googleActionRoutes = require("./google-action/routes");

const PORT = 9000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// OAuth Flow
app.get("/authorize", oAuthRoutes.authorize);
app.post("/login", oAuthRoutes.login);
app.post("/token", oAuthRoutes.refreshToken);

// Google Action
app.post("/fulfill", googleActionRoutes.fulfill);

app.listen(PORT, () => {
  console.log(`starting server on port ${PORT}`);
});
