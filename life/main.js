let fs = false;
let size = 10;

let cols;
let rows;

let grids = [];
let index = 0;

function setup() {
    let c = createCanvas(windowWidth, windowHeight);
    c.style('display', 'block');
    c.style('margin-left', '-8px');
    c.style('margin-top', '-8px');
    cols = floor(windowWidth / size);
    rows = floor(windowHeight / size);
    
    index = 0;
    grids[0] = createGrid(cols, rows);
    grids[1] = createGrid(cols, rows);
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grids[0][x][y] = floor(random(2));
            grids[1][x][y] = grids[0][x][y];
        }
    }
}

function draw() {
    drawGrid();
    fill(255, 0, 0);
    // For debugging index.
    // text(index, 0, 10);
    if (!mouseIsPressed) {
        updateGrid();
    }
    
}

function drawGrid() {
    let currentGrid = grids[index % 2];
    background(0);
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            if (currentGrid[x][y] == 1) {
                stroke(0);
                fill(0, 200, 0);
            } else {
                if (size < 10) {
                    noStroke();
                }
                fill(0);
            }
            rect(x * size, y * size, size - 1, size - 1);
        }
    }
}

function updateGrid() {
    let currentGrid = grids[index % 2];
    let nextGrid = grids[(index + 1) % 2];
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            let n = countNeighbours(currentGrid, x, y);
            let value = currentGrid[x][y];
            nextGrid[x][y] = currentGrid[x][y];
            if (value == 0 && n == 3) {
                nextGrid[x][y] = 1;
            }
            if (value == 1 && n < 2) {
                nextGrid[x][y] = 0;
            }
            if (value == 1 && (n == 2 || n == 3)) {
                nextGrid[x][y] = 1;
            }
            if (value == 1 && n > 3) {
                nextGrid[x][y] = 0;
            }
        }
    }

    index++;
}

function mouseDragged() {
    grids[index % 2][floor(mouseX / size)][floor(mouseY / size)] = 1;
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

function mouseClicked() {
    updateGrid();
}

/**
 * Fullscreen handling.
 */
function keyPressed() {
    if (key === 'F') {
        fs = !fs;
        fullscreen(fs);
        setup();
    }

    if (key === 'R') {
        setup();
    }

    console.log(key);
    if (key === 'K') {
        size += 2;
        setup();
    }

    if (key === 'J') {
        if (size == 4) {
            return;
        }
        size -= 2;
        setup();
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setup();
}

