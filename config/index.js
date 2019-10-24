module.exports = {
  userId: process.env.USER_ID || "USER_01",
  deviceId: process.env.DEVICE_ID || "DEVICE_01",
  iotery: {
    baseApiUrl: "https://api.iotery.io/v1",
    teamApiKey: process.env.IOTERY_TEAM_API_KEY || null
  }
};
