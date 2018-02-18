const Color = require("color");

/**
     * 
     * @param {number} pos between 0 and 255
     * @returns {Color} 
     */
_wheel = function(pos) {
  if (pos < 85) {
    return Color.rgb(pos * 3, 255 - pos * 3, 0);
  } else if (pos < 170) {
    pos -= 85;
    return Color.rgb(255 - pos * 3, 0, pos * 3);
  } else {
    pos -= 170;
    return Color.rgb(0, pos * 3, 255 - pos * 3);
  }
};

module.exports = {
  color(col) {
    try {
      if (col instanceof Color) {
        return col;
      } else if (typeof col === "string" || col instanceof String) {
        if (col == "rainbow") {
          let rainbowCols = this._rainbow();
          return rainbowCols;
        } else {
          let c = Color(col);
          return c;
        }
      } else {
        throw new Error("color creation not handled");
      }
    } catch (ex) {
      console.error(ex);
      return Color.rgb(255, 255, 255);
    }
  },

  getRainbow() {},
  _rainbow() {
    let colors = [];
    for (i = 0; i < this._count; i++) {
      var col = wheel((i * 256.0 / this._count) % 256);
      colors.push(col);
    }
    return colors;
  }
};
