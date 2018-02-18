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
    console.log("[PiLights] Starting node_helper");

    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));

    this.expressApp.get("/PiLights", (req, res) => {
      console.error("[PiLights] Incoming:", req.query);

      if (typeof req.query.sequence !== "undefined") {
        // Sequence
        var seq = req.query.sequence;
        var r = Number(req.query.r) || 0;
        var g = Number(req.query.g) || 0;
        var b = Number(req.query.b) || 0;

        var iterations = Number(req.query.iterations) || 1;
        var speed = Number(req.query.speed) || 10;

        this.runSequence(req, iterations, speed, r, g, b)
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
          });
      } else if (
        typeof req.query.r !== "undefined" ||
        typeof req.query.g !== "undefined" ||
        typeof req.query.b !== "undefined"
      ) {
        r = Number(req.query.r) || 0;
        g = Number(req.query.g) || 0;
        b = Number(req.query.b) || 0;
        console.error(r + " " + g + " " + b);
        if (typeof req.query.id !== "undefined") {
          id = Number(req.query.id) || 0;
          this.leds.setColor(id, [r, g, b]);
          this.leds.update();
        } else {
          this.leds.fill(r, g, b);
        }
        res.status(200).send({
          status: 200
        });
      } else if (typeof req.query.stop !== "undefined") {
        this.off();
        res.status(200).send({
          status: 200
        });
      } else {
        res.status(400).send({
          status: 400,
          error: "Sequence not specified"
        });
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
          console.error("[PiLights] Unable to open SPI (" + this.config.device + "), not supported?", err.message);
        }
      });
    } else if (notification === "SEQUENCE") {
      let ani = animations(payload);
      this.pushAnimation(ani);
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
    _.pull(this.animationsToRun, animation);
    animation.removeAllListeners();
  },

  startNextAnimation: function() {
    if (this.animationsToRun.length > 0) {
      this.animationsToRun[0].start();
    }
  }
});
