class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vel = 25;
    this.d = 3;
  }

  show() {
    noFill();
    strokeWeight(this.d);
    stroke(255, 0, 0);
    line(this.x, this.y, this.x - this.d * cos(this.angle)*3, this.y - this.d * sin(this.angle)*3);
  }

  update() {
    this.x += this.vel * cos(this.angle);
    this.y += this.vel * sin(this.angle);
  }

  settype(type) {
    this.type = type;
  }

  offscreen() {
    return (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
  }
}
