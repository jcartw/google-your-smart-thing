// Present authorization page
module.exports.authorize = async (req, res) => {
  res.sendFile(`${__dirname}/authorize.html`);
};

// Provide initial token upon account linking
module.exports.login = async (req, res) => {
  const code = "CODE";
  const { redirect_uri, state } = req.body;
  res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
};

// provide token without auth
// Note: this is where the Client ID and secret would be confirmed
module.exports.refreshToken = async (req, res) => {
  const accessToken = "ACCESS_TOKEN";
  const refreshToken = "REFRESH_TOKEN";
  const expiresIn = 3600 * 24 * 30; // 30 days

  // Flow
  // 1. Grant type: authorization_code (code = CODE, refresh_token=undefined)
  // 2. Grant type: refresh_token (refresh token = REFRESH_TOKEN, code=undefined)

  res.status(200).json({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: "bearer"
  });
};
