let fs = false;
let size = 20;

class Char {
    constructor(x, y, speed, highlight) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.highlight = highlight;
        this.setRandomCharacter();
    }

    setRandomCharacter() {
        // http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
        let min = 0x30a0;
        let max = 0x30ff;
        this.char = String.fromCharCode(random(min, max));
    }

    render() {
        if (this.highlight) {
            fill(200, 200, 200);
        } else {
            fill(0, 200, 0);
        }
        text(this.char, this.x, this.y)
    }

    update() {
        let isUpdate = random() < 0.05;
        if (isUpdate) {
            this.setRandomCharacter();
        }
        this.y = this.y + this.speed;
        if (this.y > height) {
            this.y = 0;
        }
    }
}

class Column {
    constructor(x, speed) {
        this.x = x;
        this.speed = speed;
        
        // Maximum of 1/2 of window height
        let rowLength = floor(random(10, height / size * 0.50));
        let offset = random(-1000, 0);
        this.chars = [];
        for (let i = 0; i < rowLength; i++) {
            let isLast = i == rowLength - 1;
            this.chars.push(new Char(x, 0 + i * size + offset, this.speed, isLast));
        }
    }

    render() {
        for (let i = 0; i < this.chars.length; i++) {
            this.chars[i].render();
        }
    }

    update() {
        for (let i = 0; i < this.chars.length; i++) {
            this.chars[i].update();
        }
    }
}

let columns;

function setup() {
    columns = [];
    let cnv = createCanvas(windowWidth + 8, windowHeight + 8);
    for (let i = 0; i < windowWidth / size; i++) {
        let speed = random(3, 5);
        columns.push(new Column(i * size, speed))
    }
}

function draw() {
    background(0, 100);
    textSize(size);
    for (let i = 0; i < columns.length; i++) {
        columns[i].render();
        columns[i].update();
    }
}

function keyPressed() {
    if (key === 'F') {
        fs = !fs;
        fullscreen(fs);
        setup();
    }

    if (key === 'R') {
        setup();
    }

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

