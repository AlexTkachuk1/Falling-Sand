const CANVAS = document.getElementById("canvas");
const CTX = CANVAS.getContext("2d");
CANVAS.height = 360;
CANVAS.width = 360;
const w = 6;
const columnsCount = CANVAS.width / w;
const rowsCount = CANVAS.height / w;
let nextGrid = [];


let drag = false;
CANVAS.addEventListener('mousedown', () => {
      drag = true;
});

CANVAS.addEventListener('mouseup', () => {
      drag = false;
});

CANVAS.addEventListener('mousemove', (event) => {
      if (!drag) return;

      const i = Math.floor(event.clientX / w) - 1;
      const j = Math.floor(event.clientY / w) - 1;

      if (i >= 0 && i < columnsCount && j >= 0 && j < rowsCount && nextGrid[i][j] === 0) nextGrid[i][j] = 1;
});


for (let i = 0; i < columnsCount; i++) {
      nextGrid[i] = [];
      for (let j = 0; j < rowsCount; j++) {
            nextGrid[i][j] = 0;
      }
}

animate();

function combineGraphics(array, arrayCopy, i, j, graphic) {
      if (array[i][j] === 1 && !arrayCopy[i][j]) {
            arrayCopy[i][j] = true;

            if (graphic[0] > i) graphic[0] = i;
            if (graphic[1] > j) graphic[1] = j;

            if (j + 1 >= 0 === 1 && !arrayCopy[i][j - 1]) {
                  graphic[3] += 1;
                  combineGraphics(array, arrayCopy, i, j - 1, graphic);
            }
            if (j + 1 <= rowsCount && array[i][j + 1] === 1 && !arrayCopy[i][j + 1]) {
                  graphic[3] += 1;
                  combineGraphics(array, arrayCopy, i, j + 1, graphic);
            }
      } else {
            graphic[0] = null;
      }
}

function animate() {
      CANVAS.width = 360;
      drawCanvas(CTX);
      requestAnimationFrame(animate);
}

function drawCanvas(ctx) {
      updateElements();

      let arrayCopy = [];
      for (let i = 0; i < columnsCount; i++) {
            arrayCopy[i] = [];
            for (let j = 0; j < rowsCount; j++) {
                  arrayCopy[i][j] = false;
            }
      }

      let graphics = [];

      for (let i = 0; i < columnsCount; ++i) {
            for (let j = 0; j < rowsCount; ++j) {
                  let graphic = [i, j, 1, 1];
                  combineGraphics(nextGrid, arrayCopy, i, j, graphic);
                  if (graphic[0] !== null) {
                        graphics.push(graphic);
                  }
            }
      }

      graphics.forEach(graphic => {
            ctx.beginPath();
            ctx.rect(graphic[0] * w, graphic[1] * w, graphic[2] * w, graphic[3] * w);
            ctx.fillStyle = '#201';
            ctx.fill();
            ctx.closePath();
      });
};

function updateElements() {
      for (let i = columnsCount - 1; i >= 0; --i) {
            for (let j = rowsCount - 1; j >= 0; --j) {
                  if (j + 1 < rowsCount) {
                        if (nextGrid[i][j] === 1) {
                              if (nextGrid[i][j + 1] !== 1) {
                                    nextGrid[i][j] = 0;
                                    nextGrid[i][j + 1] = 1;
                              } else {
                                    const dir = Math.random() > 0.5 ? 1 : -1;
                                    if (i + dir >= 0
                                          && i + dir < columnsCount
                                          && nextGrid[i + dir][j] === 0
                                          && j + 1 < rowsCount
                                          && nextGrid[i + dir][j + 1] === 0) {
                                          nextGrid[i][j] = 0;
                                          nextGrid[i + dir][j] = 1;
                                    }
                              }
                        }
                  }
            }
      }
}
