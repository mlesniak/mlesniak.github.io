// TODO ML Optimize createGrid()

let size = 10;

let cols;
let rows;

let grid = undefined;

function setup() {
    let w = floor(innerWidth / size) * size + size;
    let h = floor(innerHeight / size) * size + size;

    let c = createCanvas(w, h);
    c.style('display', 'block');
    c.style('margin-left', '-8px');
    c.style('margin-top', '-8px');
    cols = floor(width / size);
    rows = floor(height / size);

    grid = createGrid(cols, rows);
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grid[x][y] = floor(random(2));
        }
    }
}

function draw() {
    drawGrid();
    grid = updateGrid(grid);
}

function drawGrid() {
    background(255);
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y] == 1) {
                stroke(200);
                fill(0);
            } else {
                if (size < 10) {
                    noStroke();
                }
                fill(255);
            }
            rect(x * size, y * size, size - 1, size - 1);
        }
    }
}

function updateGrid(grid) {
    let ng = createGrid(cols, rows);

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            let n = countNeighbours(grid, x, y);
            if (grid[x][y] == 0 && n == 3) {
                ng[x][y] = 1;
            }
            if (grid[x][y] == 1 && n < 2) {
                ng[x][y] = 0;
            }
            if (grid[x][y] == 1 && (n == 2 || n == 3)) {
                ng[x][y] = 1;
            }
            if (grid[x][y] == 1 && n > 3) {
                ng[x][y] = 0;
            }
        }
    }

    return ng;
}

function countNeighbours(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            // Wrap around.
            sum += grid[(x + i + cols) % cols][(y + j + rows) % rows];
        }
    }

    return sum;
}


function createGrid(cols, rows) {
    let g = new Array(cols);
    for (let x = 0; x < cols; x++) {
        g[x] = new Array(rows);
    }

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            g[x][y] = 0;
        }
    }

    return g;
}

