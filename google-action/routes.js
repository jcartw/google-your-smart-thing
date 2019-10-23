const { smarthome } = require("actions-on-google");

const config = require("../config/index");

// cache
let isUserLinked = true;

const app = smarthome({});
module.exports.fulfill = app;

// SYNC intent
app.onSync(async (body, headers) => {
  console.log("SYNC intent");
  isUserLinked = true;

  const userId = config.userId;
  const deviceId = config.deviceId;
  const deviceName = "Jimmy";

  const device = {
    id: deviceId,
    type: "action.devices.types.LIGHT",
    traits: ["action.devices.traits.OnOff"],
    willReportState: false,
    name: {
      defaultNames: [deviceName],
      name: deviceName,
      nicknames: [deviceName]
    }
  };

  // report state to Home Graph
  const onOffState = await _getLightOnOffState(deviceUuid);
  _reportLightOnOffState(deviceUuid, onOffState);

  return {
    requestId: body.requestId,
    payload: {
      agentUserId: userId,
      devices: [device]
    }
  };
});

// DISCONNECT intent
app.onDisconnect((body, headers) => {
  console.log("DISCONNECT intent");
  isUserLinked = false;
  if (!isUserLinked) {
    console.log("UNLINKED");
  }
});
