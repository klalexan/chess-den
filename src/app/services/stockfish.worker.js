

// This is the worker that will be running Stockfish in the background.

var sf;
try {
  sf = new Worker('../../assets/stockfish.js');
} catch (err) {
  sf = {};
}

export const getBest = (fen, level) => new Promise((resolve, reject) => {
  if (sf.postMessage === null || sf.postMessage === undefined) {
    resolve();
  }
  // sf.postMessage('uci');
  sf.postMessage("position fen " + fen);
  sf.postMessage("setoption name Skill Level value " + level);
  sf.postMessage("go depth 12");
  sf.onmessage = (event) => {
    if (event.data.startsWith("bestmove")) {
      resolve(event.data.split(" ")[1]);
    }
  };
});
