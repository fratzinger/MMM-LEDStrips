/* global Module */

Module.register("MMM-PiLights", {
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
        devide: "/dev/spidev0.0",
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
    this.config.notifiations.forEach((n, index) => {
        if (n.id == notification) {
            this.sendSocketNotification("SEQUENCE", n.sequence);
            break;
        }
    });
  },

  /**
     * @returns {*}
     */
  getDom: function() {
    //return null;
    return document.createElement("div");
  }
});
