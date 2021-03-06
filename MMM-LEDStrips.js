/* global Module */

Module.register("MMM-LEDStrips", {
  /**
     * Module config defaults
     */
  defaults: {
    speed: 20,
    times: 1,
    strips: [
      {
        id: 1,
        type: "ws2801",
        device: "/dev/spidev0.0",
        //brightness: 1.0,
        ledCount: 32
      }
    ],
    notifications: [
      {
        id: "BUTTONPRESSED",
        sequence: {
          type: "Pulse",
          stripId: 1, //id of strip
          color: "rgb(255, 255, 255)"
        }
      }
    ]
  },

  /**
     * Starting of the module
     */
  start: function() {
    Log.info("[" + this.name + "] Starting");
    this.sendSocketNotification("SET_CONFIG", this.config);
  },

  /**
     * @param {String} notification
     * @param {*}      payload
     */
  notificationReceived: function(notification, payload) {
    console.log(notification);
    for (let i = 0; i < this.config.notifications.length; i++) {
      let n = this.config.notifications[i];
      if (n.id == notification) {
        this.sendSocketNotification("SEQUENCE", n.sequence);
        break;
      }
    }

    if (notification === "MMM-LEDStrips_StopAll") {
      this.sendSocketNotification("TURN_OFF");
    } else if (notification === "MMM-LEDStrips_SEQUENCE") {
      this.sendSocketNotification("SEQUENCE", payload);
    }
  },

  /**
     * @returns {*}
     */
  getDom: function() {
    //return null;
    return document.createElement("div");
  }
});
