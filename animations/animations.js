const Animation = require("./animation");

const Color = require("color");
const Pulse = require("./pulse");
const colorHelper = require("../colorHelper");

const createAnimation = function(seq) {
  if (typeof seq.type === "string" || seq.type instanceof String) {
    if (seq.color) {
      seq.color = colorHelper.color(seq.color, seq.strip);
    }
    if (seq.type == "Pulse") {
      return new Pulse(seq);
    }
  }
};

createAnimation.Animation = Animation;
createAnimation.Pulse = Pulse;

module.exports = createAnimation;
