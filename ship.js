class Ship {
  constructor(x, y) {
    this.rad = 20;
    this.angle = 0;
    this.rotation_speed = 0.13;

    this.accel = 2;
    this.decel = 1;
    this.vel = 0;
    this.vmax = 7;

    this.x0 = x;
    this.y0 = y;
    this.angle0 = 0;

    // center point
    this.x = x;
    this.y = y;

    //points of the triangle
    this.x1 = 0;
    this.y1 = 0;

    this.x2 = 0;
    this.y2 = 0;

    this.x3 = 0;
    this.y3 = 0;

    this.setcoordinates();

    this.maxbullets = 1;
    this.bullets = [];

    //this.Annelies_mode();
  }

  Annelies_mode() {
    this.vmax = 2;
    this.maxbullets = 5;
  }

  setcoordinates() {

    this.x1 = this.x + this.rad * cos(this.angle);
    this.y1 = this.y + this.rad * sin(this.angle);

    this.x2 = this.x + this.rad * cos((TWO_PI / 3) + this.angle);
    this.y2 = this.y + this.rad * sin((TWO_PI / 3) + this.angle);

    this.x3 = this.x + this.rad * cos((2 * TWO_PI / 3) + this.angle);
    this.y3 = this.y + this.rad * sin((2 * TWO_PI / 3) + this.angle);
  }

  show() {
    fill(255);
    stroke(255);
    strokeWeight(1);
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    stroke(255, 0, 0);
    strokeWeight(3);
    line(this.x2, this.y2, this.x3, this.y3);

    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].show();
    }
  }

  rotate(a) {
    this.angle += a;
  }

  update() {
    this.recharge += 1;
    this.move();
    this.setcoordinates();
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update();
      if (this.bullets[i].offscreen()) {
        this.removebullet(i);
      }
    }
  }

  move() {
    this.x += this.vel * cos(this.angle);
    this.y += this.vel * sin(this.angle);

    if (this.x > width) {
      this.x -= width;
    } else if (this.x < 0) {
      this.x += width;
    }

    if (this.y < 0) {
      this.y += height;
    } else if (this.y > height) {
      this.y -= height;
    }
  }

  shoot() {
    if (this.bullets.length < this.maxbullets) {
      this.bullets.push(new Bullet(this.x1, this.y1, this.angle, this.bullettype));

      this.shootsound();
    }
  }

  shootsound() {
    if (!muted) {
      bulletsound.setVolume(0.5);
      bulletsound.play();
    }
  }

  boost() {
    this.vel = constrain(this.vel + this.accel, 0, this.vmax);
  }

  brake() {
    this.vel = constrain(this.vel - this.decel, -this.vmax / 2, this.vmax);
  }

  reset() {
    this.x = this.x0;
    this.y = this.y0;
    this.angle = this.angle0;
    this.vel = 0;
    //this.removebullet();
  }

  removebullet(i) {
    this.bullets.splice(i, 1);
  }
}
