const Color = require("color");
const colorHelper = require("./colorHelper");

const typeEnum = {
  lpd8806: "lpd8806",
  ws2801: "ws2801"
};

class Strip {
  constructor(id, type, count, device) {
    this._id = id;
    this._type = type;
    this._leds = null;
    this._count = count;
    if (type == "lpd8806") {
      this._type = typeEnum.lpd8806;
    } else if (type == "ws2801") {
      this._type = typeEnum.ws2801;
    }

    this.connect();
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get count() {
    return this._count;
  }

  get leds() {
    return this._leds;
  }

  connect() {
    if (this.type == typeEnum.lpd8806) {
      // Internal reference to lpd8806-async
      var LPD8806 = require("lpd8806-async");
      this._leds = new LPD8806(this._count, device);
    } else if (this.type == typeEnum.ws2801) {
      // Internal reference to rpi-ws2801
      this._leds = require("rpi-ws2801").connect(this._count, device);
    }
  }

  disconnect() {
    if (this.type == typeEnum.lpd8806) {
      // not supported
    } else if (this.type == typeEnum.ws2801) {
      this.leds.disconnect();
    }
  }

  clear() {
    if (this.type == typeEnum.ws2801) {
      this.leds.clear();
    }
  }

  /**
   * 
   * @param {Color||Color[]||String} col 
   */
  fill(col) {
    if (col instanceof Color) {
      if (this.type == typeEnum.ws2801) {
        this.leds.fill(col.red(), col.green(), col.blue());
      }
    } else if (col instanceof Array) {
      for (let i = 0; i < col.length; i++) {
        this.setColor(i, col[i]);
      }
    } else if (col instanceof String) {
      this.fill(colorHelper.color(col));
    }
  }

  /**
   * 
   * @param {number} i index of LED 
   * @param {Color} col color to set for LED 
   */
  setColor(i, col, update = true) {
    if (!(col instanceof Color)) {
      return new Error("col must be instanceof Color");
    }
    if (this.type == typeEnum.ws2801) {
      this.leds.setColor(i, col.rgb().array());
    }
    if (update) {
      this.update();
    }
  }

  update() {
    if (this.type == typeEnum.ws2801) {
      this.leds.update();
    }
  }
}

module.exports = Strip;
