/* global require */

const _ = require("lodash");
const Color = require("color");
const NodeHelper = require("node_helper");
const bodyParser = require("body-parser");

const async = require("async");

var ajv = require("ajv")({
  allErrors: true,
  format: "full",
  coerceTypes: true
});

const animations = require("./animations/animations");
const Animation = require("./animations/animation");
const Strip = require("./strip.js");

var config = require("./config");

module.exports = NodeHelper.create({
  /**
     * node_helper start method
     */
  start: function() {
    console.log("[MMM-LEDStrips] Starting node_helper");

    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));

    this.expressApp.get("/LEDStrip", (req, res) => {
      console.error("[MMM-LEDStrips] Incoming:", req.query);

      if (typeof req.query.sequence !== "undefined") {
        // Sequence
        var seq = req.query.sequence;

        /*this.runSequence(req, iterations, speed, r, g, b)
          .then(function() {
            res.status(200).send({
              status: 200
            });
          })
          .catch(function(err) {
            res.status(400).send({
              status: 400,
              error: err.message
            });
          });*/
      }
    });
  },

  animationsToRun: [],

  /**
     *
     * @param {String} notification
     * @param {*}      payload
     */
  socketNotificationReceived: function(notification, payload) {
    console.info(notification);
    if (notification === "SET_CONFIG") {
      config = payload;
      config.strips = [];

      this.config.strips.forEach((strip, index) => {
        try {
          config.strips.push(new Strip(strip.id, strip.type, strip.ledCount, strip.device));
        } catch (err) {
          console.error("[PiLights] Unable to open SPI (" + this.config.device + "), not supported? ", err.message);
        }
      });
    } else if (notification === "SEQUENCE") {
      let ani = animations(payload);
      this.pushAnimation(ani);
    } else if (notification === "TURN_OFF") {
      this.removeAll();
      config.strips.forEach(strip => {
        strip.clear();
      });
    }
  },

  /**
 * @param {Animation} animation
 */
  pushAnimation: function(animation) {
    if (this.animationsToRun.length == 0) {
      animation.start();
    }
    animation.animationsToRun.push(animation);
    let self = this;
    animation.once(Animation.eventEnum.finished, animation => {
      self.removeAnimation(animation);
    });
    animation.once(Animation.eventEnum.stopped, animation => {
      self.removeAnimation(animation);
    });
  },

  /**
   * @param {Animation} animation
   */
  removeAnimation: function(animation) {
    if (animation.state == Animation.stateEnum.running) {
      animation.stop();
    }
    _.pull(this.animationsToRun, animation);
    animation.removeAllListeners();
  },

  removeAll() {
    let self = this;
    this.animationsToRun(animation => {
      self.removeAnimation(animation);
    });
  },

  startNextAnimation: function() {
    if (this.animationsToRun.length > 0) {
      this.animationsToRun[0].start();
    }
  }
});
