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

  /**
   * Implement me. This function should return a set of features in the format of key-value pair notation.
   *
   * For example, this should return `{"Palette": "Rosy", "Scale": "Big", "Tilt": 72}` if the desired features for a mint were:
   * - Palette: Rosy
   * - Scale: Big
   * - Tilt: 72
   */


  var featureResponse = {}

  var
    grid = 3,
    currentLayer = 1,
    totalLayers = 10,
    chaosFactor = 0,
    strokeWidth = 4,
    backgroundColor = 90,
    //backgroundColorLighter,
    hereColor = 300,
    signed = false,
    strokeColor;

  // array of random values for each grid cell
  var gridArray = [];

  // set grid cell for "here" color
  var whereAreYou = true;
  var here;

  var jsonInstructions = {}
  jsonInstructions.layers = []

  
  var R;  
    
    // seed
    
    //const hash = tokenData.hash;
    //const invocation = Number(tokenData.tokenId) % 1_000_000;
    var seed = hashToSeed(hash);
  
    R = new Random();
    
    // set traits
    
    // number of grid cells
    grid = Math.floor(R.random_num(3,11));
    featureResponse["Grid"] = grid+"x"+grid;
    
    // layers
    totalLayers = Math.floor(R.random_num(1,21));
    featureResponse["Layers"] = totalLayers;
    
    // chaos number
    chaosFactor = Math.floor(R.random_num(-6,6));
    featureResponse["Chaos Factor"] = chaosFactor;
    
    //styling
    strokeWidth = R.random_num(4,7.5);
    featureResponse["Stroke Width"] = strokeWidth;
    
    // colorway
    var colorway = Math.floor(R.random_num(1,8)); // 1 - 7
    if (colorway == 1) { // white
      backgroundColor = "rgba(248,248,248,1)";
      strokeColor = 0;
      hereColor = R.random_num(300,380);
      if (hereColor > 360) { hereColor -= 360; }
    } else if (colorway == 2) { // blue
      //backgroundColor = "HSB(230,50%,100%)";
      backgroundColor = "HSB(220,55%,84%)";
      strokeColor = 255;
      //hereColor = R.random_num(300,380);
      hereColor = R.random_num(0,43);
      if (hereColor > 360) { hereColor -= 360; }
    } else if (colorway == 3) { // orange
      //backgroundColor = "HSB(32,50%,100%)";
      backgroundColor = "HSB(32,62%,100%)";
      strokeColor = 255;
      hereColor = R.random_num(180,280);
      if (hereColor > 360) { hereColor -= 360; }
    } else if (colorway == 4) { // green
      backgroundColor = "HSB(140,30%,85%)";
      strokeColor = 255;
      hereColor = R.random_num(0,54);
      if (hereColor > 360) { hereColor -= 360; }
    } else if (colorway == 5) { // white with blue/purple
      backgroundColor = "rgba(248,248,248,1)";
      strokeColor = 0;
      hereColor = R.random_num(180,280);
      if (hereColor > 360) { hereColor -= 360; }
    } else if (colorway == 6) { // black
      backgroundColor = "HSB(0,0%,13%)";
      strokeColor = 255;
      hereColor = R.random_num(155,245);
      if (hereColor > 360) { hereColor -= 360; }
    } else if (colorway == 7) { // yellow
      backgroundColor = "HSB(50,46%,100%)";
      strokeColor = 0;
      hereColor = R.random_num(194,342);
      if (hereColor > 360) { hereColor -= 360; }
    }
    featureResponse["Background Color"] = backgroundColor;
    featureResponse["Stroke Color"] = strokeColor;
    featureResponse["Here Color"] = hereColor;
    
    // signature
    if (R.random_num(0,1) > .7) { signed = true; }
    featureResponse["Signed"] = signed;


  return featureResponse;
}

function hashToSeed(hash) {
  // Sum up the character codes of the hash string
  return Array.from(hash).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

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