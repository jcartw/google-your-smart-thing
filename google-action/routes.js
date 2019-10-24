const { smarthome } = require("actions-on-google");

const config = require("../config/index");

// cache
let isUserLinked = true;
let onOffState = false; // true = ON, false = OFF

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

// EXECUTE intent
app.onExecute(async (body, headers) => {
  console.log("EXECUTE");
  const commands = [{ ids: [], status: "", states: { on: null } }];

  for (const input of body.inputs) {
    for (const command of input.payload.commands) {
      for (const device of command.devices) {
        for (const exec of command.execution) {
          commands[0].ids.push(device.id);

          let turnOn = null;
          if (exec.command === "action.devices.commands.OnOff") {
            turnOn = exec.params.on;
          }

          // send out command to device
          if (turnOn !== null) {
            commands[0].states.on = turnOn;
            try {
              _actuateLight({
                deviceId: device.id,
                turnOn
              });
              commands[0].status = "SUCCESS";
            } catch (err) {
              commands[0].status = "ERROR";
            }
          }
        }
      }
    }
  }

  return {
    requestId: body.requestId,
    payload: { commands }
  };
});

// QUERY intent
app.onQuery(async (body, headers) => {
  console.log("QUERY");
  const devices = {};

  for (const input of body.inputs) {
    for (const device of input.payload.devices) {
      const on = _getLightOnOffState(device.id);
      devices[device.id] = { on };
    }
  }

  return {
    requestId: body.requestId,
    payload: { devices }
  };
});

function _actuateLight({ deviceId, turnOn }) {
  if (turnOn) {
    console.log(`Turning Device ${deviceId} ON`);
    onOffState = true;
  } else {
    console.log(`Turning Device ${deviceId} OFF`);
    onOffState = false;
  }
}

function _getLightOnOffState(deviceId) {
  console.log(`Device ${deviceId} is ${onOffState ? "ON" : "OFF"}`);
  return onOffState;
}
