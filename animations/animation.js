//const _ = require('lodash');
const Color = require("color");
const EventEmitter = require("events");

const Strip = require("../strip");
var config = require("../config");

class Animation extends EventEmitter {
  constructor(seq) {
    super();

    this.name = "animation";
    this.strip = seq.strip;

    this.color = seq.color || config.color || Color.rgb(255, 255, 255);
    this.speed = seq.speed || config.speed || 20;
    this.times = seq.times || config.times || 1;
    this.state = Animation.stateEnum.notStarted;
  }

  start() {
    console.log('animation: "' + this.name + '" is starting');
    this.state = Animation.stateEnum.running;
    this.emit(Animation.eventEnum.started, this);
  }

  pause() {
    console.log('animation: "' + this.name + '" paused');
    this.state = Animation.stateEnum.paused;
    this.emit(Animation.eventEnum.paused, this);
  }

  resume() {
    console.log('animation: "' + this.name + '" resumed');
    this.state = Animation.stateEnum.running;
    this.emit(Animation.eventEnum.resumed, this);
  }

  stop() {
    console.log('animation: "' + this.name + '" stopped');
    this.state = Animation.stateEnum.stopped;
    this.emit(Animation.eventEnum.stopped, this);
  }

  finish() {
    console.log('animation: "' + this.name + '" finished');
    this.state = Animation.stateEnum.finished;
    this.emit(Animation.eventEnum.finished, this);
  }

  static get stateEnum() {
    return {
      notStarted: "notStarted",
      running: "running",
      paused: "paused",
      finished: "finished",
      stopped: "stopped"
    };
  }

  static get eventEnum() {
    return {
      started: "started",
      paused: "paused",
      resumed: "resumed",
      stopped: "stopped",
      finished: "finished"
    };
  }
}

module.exports = Animation;
