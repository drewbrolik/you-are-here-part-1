/**
 * Calculate features for the given token data.
 * @param {Object} tokenData
 * @param {string} tokenData.tokenId - Unique identifier of the token on its contract.
 * @param {string} tokenData.hash - Unique hash generated upon minting the token.
 * @returns {Object} - A set of features in the format of key-value pair notation.
 * @note - This function is called by the ArtBlocks metadata server to generate the
 *         features for a given token. For more information, visit
 *         https://docs.prohibition.art/how-to-setup-features
 */
function calculateFeatures(tokenData) {
  const hash = tokenData.hash;
  const invocation = Number(tokenData.tokenId) % 1_000_000;

  class Random {
    constructor() {
      this.useA = false;
      let sfc32 = function (uint128Hex) {
        let a = parseInt(uint128Hex.substring(0, 8), 16);
        let b = parseInt(uint128Hex.substring(8, 16), 16);
        let c = parseInt(uint128Hex.substring(16, 24), 16);
        let d = parseInt(uint128Hex.substring(24, 32), 16);
        return function () {
          a |= 0;
          b |= 0;
          c |= 0;
          d |= 0;
          let t = (((a + b) | 0) + d) | 0;
          d = (d + 1) | 0;
          a = b ^ (b >>> 9);
          b = (c + (c << 3)) | 0;
          c = (c << 21) | (c >>> 11);
          c = (c + t) | 0;
          return (t >>> 0) / 4294967296;
        };
      };
      // seed prngA with first half of tokenData.hash
      this.prngA = new sfc32(tokenData.hash.substring(2, 34));
      // seed prngB with second half of tokenData.hash
      this.prngB = new sfc32(tokenData.hash.substring(34, 66));
      for (let i = 0; i < 1e6; i += 2) {
        this.prngA();
        this.prngB();
      }
    }
    // random number between 0 (inclusive) and 1 (exclusive)
    random_dec() {
      this.useA = !this.useA;
      return this.useA ? this.prngA() : this.prngB();
    }
    // random number between a (inclusive) and b (exclusive)
    random_num(a, b) {
      return a + (b - a) * this.random_dec();
    }
    // random integer between a (inclusive) and b (inclusive)
    // requires a < b for proper probability distribution
    random_int(a, b) {
      return Math.floor(this.random_num(a, b + 1));
    }
    // random boolean with p as percent liklihood of true
    random_bool(p) {
      return this.random_dec() < p;
    }
    // random value in an array of items
    random_choice(list) {
      return list[this.random_int(0, list.length - 1)];
    }
  }

  var featureResponse = {}

  var
    grid,
    totalLayers,
    chaosFactor,
    strokeWidth,
    backgroundColor,
    hereColor,
    signed = false,
    strokeColor,
    posNeg,
    whichSig,
    R = new Random();

  // number of grid cells
  grid = Math.floor(R.random_num(3,11));
  featureResponse["Grid"] = grid+"x"+grid;
  
  // layers
  totalLayers = Math.floor(R.random_num(1,21));
  featureResponse["Layers"] = totalLayers+"";
  
  // chaos number
  chaosFactor = Math.floor(R.random_num(-6,6));
  featureResponse["Chaos Factor"] = chaosFactor+"";
  
  //styling
  strokeWidth = R.random_num(4,7.5);
  featureResponse["Line Width"] = Math.round(strokeWidth)+"";
  
  // colorway
  var colorway = Math.floor(R.random_num(1,8)); // 1 - 7
  var hereHueRange;
  if (colorway == 1) { // white
    backgroundColor = "White";
    strokeColor = "Black";
    hereColor = R.random_num(300,380);
    if (hereColor > 360) { hereColor -= 360; }
    hereHueRange = "Pink/Red/Orange";
  } else if (colorway == 2) { // blue
    backgroundColor = "Blue";
    strokeColor = "White";
    hereColor = R.random_num(0,43);
    hereHueRange = "Red/Orange/Yellow";
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 3) { // orange
    backgroundColor = "Orange";
    strokeColor = "White";
    hereColor = R.random_num(180,280);
    hereHueRange = "Teal/Blue/Purple";
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 4) { // green
    backgroundColor = "Green";
    strokeColor = "White";
    hereColor = R.random_num(0,54);
    hereHueRange = "Red/Orange/Yellow";
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 5) { // white with blue/purple
    backgroundColor = "White";
    strokeColor = "Black";
    hereColor = R.random_num(180,280);
    if (hereColor > 360) { hereColor -= 360; }
    hereHueRange = "Teal/Blue/Purple";
  } else if (colorway == 6) { // black
    backgroundColor = "Dark gray";
    strokeColor = "White";
    hereColor = R.random_num(155,245);
    hereHueRange = "Green/Teal/Blue";
    if (hereColor > 360) { hereColor -= 360; }
  } else if (colorway == 7) { // yellow
    backgroundColor = "Yellow";
    strokeColor = "Black";
    hereColor = R.random_num(194,342);
    if (hereColor > 360) { hereColor -= 360; }
    hereHueRange = "Teal/Crimson";
  }

  featureResponse["Background Color"] = backgroundColor;
  featureResponse["Line Color"] = strokeColor;
  featureResponse["Here Color"] = hslToHex(hereColor,100,50); // 50 l in hsl = 100 b in hsb
  featureResponse["Possible Here Hue Range"] = hereHueRange;

  here = Math.floor(R.random_num(1,grid*grid+1));
  posNeg = R.random_num(-1,1);
  hereSegment = Math.floor(R.random_num(1,7));

  var hereColorDev = ((chaosFactor*posNeg)/(360)*100).toFixed(2)+"%";
  featureResponse["Here Color Deviation"] = hereColorDev;

  // signature
  if (R.random_num(0,1) > .9) {
    signed = true;
    whichSig = R.random_num(0,1);
  }
  featureResponse["Signature"] = signed ? (whichSig > .5 ? "Truedrew" : "Drew Thomas" ) : "None";

  // here color blocks
  hereColorBlockType1 = R.random_num(0,1);
  hereColorBlockType2 = R.random_num(0,1);
  hereColorBlockType3 = R.random_num(0,1);

  var hereColorBlockTypes = [
    "Bar",
    "Lines",
    "Circle",
    "Grid of circles",
    "Side Triangle",
    "Grid of triangles",
    "Single grid triangle"
  ];

  return featureResponse;

  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

}