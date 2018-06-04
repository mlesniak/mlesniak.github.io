/**
 * Simple starfield simulation using p5.js.
 */

class Star { 
  constructor() {
    this.x = random(-width/2, width/2);
    this.y = random(-height/2, height/2);
    this.z = random(width);
    this.speed = random(1, 10);
  }
  
  update() {
    this.z = this.z - this.speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width/2, width/2);
      this.y = random(-height/2, height/2);
    }
  }
  
  show() {
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, 8, 0);
    let s = map(this.z, 50, width, 255, 0);
    
    fill(s);
    noStroke();
    ellipse(sx, sy, r, r);
  }  
} 

let stars = [];
let numStars = 400;
let fs = false;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  // Special fix to remove white borders.
  c.style('display', 'block');
  c.style('margin-left', '-8px');
  c.style('margin-top', '-8px');
  for (var i = 0; i < numStars; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  translate(width / 2, height / 2);
  background(0);
  for (var i = 0; i < numStars; i++) {
    stars[i].update();
    stars[i].show();
  }
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
