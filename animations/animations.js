const Animation = require("./animation");

const Pulse = require("./pulse");

const createAnimation = function(seq) {
  if (typeof seq.type === "string" || seq.type instanceof String) {
    if (seq.type == "Pulse") {
      return new Pulse(seq);
    }
  }
};

createAnimation.Animation = Animation;
createAnimation.Pulse = Pulse;

module.exports = createAnimation;
