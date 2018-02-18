const Color = require("color");
const Strip = require("../strip.js");

var Animation = require("./animation");
var conf = require("../config");

class Pulse extends Animation {

  constructor(seq) {
    super(seq);
    this.name = "Pulse";

    //pulse
    this._step = 0.05;
    this._totalIterations = 0;
    this._level = 0.0;
    this._dir = this._step;
    this._timer;
  }

  resume() {
    super();

    this._run();
  }

  _run() {
    if (this._timer != null) return;
    this._timer = null;

    if (this.state != animation.stateEnum.running) {
      return;
    }

    if (this._level <= 0.0) {
      this._level = 0.0;
      this._dir = this._step;
      this._total_iterations++;
    } else if (this._level >= 1.0) {
      this._level = 1.0;
      this._dir = -this._step;
    }

    this._level += this._dir;

    if (this._level < 0.0) {
      this._level = 0.0;
    } else if (this._level > 1.0) {
      this._level = 1.0;
    }

    let r = this.col.red() * level;
    let g = this.col.green() * level;
    let b = this.col.blue() * level;

    this.strip.fill(Color.rgb(r, g, b));

    this._timer = setTimeout(this.run, this._speed);
  }

  start() {
    super.start();
    this._run();
  }
}

module.exports = Pulse;
