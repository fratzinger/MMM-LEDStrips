const Color = require("color");
const Strip = require("../strip.js");

var Animation = require("./animation");

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

  start() {
    super.start();
    this.run();
  }

  resume() {
    super.resume();

    this.run();
  }

  run() {
    if (this._timer != null) {
      clearTimeout(this._timer);
    }
    this._timer = null;

    if (this.state != Animation.stateEnum.running) {
      return;
    }

    if (this._level <= 0.0) {
      this._level = 0.0;
      this._dir = this._step;
      this._totalIterations++;
    } else if (this._level >= 1.0) {
      this._level = 1.0;
      this._dir = -this._step;
    }

    if (this._totalIterations > this.times) {
      this.finish();
      return;
    }

    this._level += this._dir;

    if (this._level < 0.0) {
      this._level = 0.0;
    } else if (this._level > 1.0) {
      this._level = 1.0;
    }

    if (this.color instanceof Color) {
      let r = this.color.red() * this._level;
      let g = this.color.green() * this._level;
      let b = this.color.blue() * this._level;

      this.strip.fill(Color.rgb(r, g, b));
    } else if (this.color.constructor === Array) {
      let cols = [];
      for (let i = 0; i < this.color.length; i++) {
        let r = this.color[i].red() * this._level;
        let g = this.color[i].green() * this._level;
        let b = this.color[i].blue() * this._level;
        cols.push(Color.rgb(r, g, b));
      }

      this.strip.fill(cols);
    } else {
      throw new Error("Instance is no Color or Color[]");
    }

    let self = this;

    this._timer = setTimeout(function() {
      self.run();
    }, this.speed);
  }

  pause() {
    super.pause();
  }

  stop() {
    super.stop();
  }
}

module.exports = Pulse;
