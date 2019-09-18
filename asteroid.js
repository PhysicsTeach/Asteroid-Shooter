class Asteroid {
  constructor(x, y, size, tier) {
    //center point
    this.x = x;
    this.y = y;

    this.size = size;
    this.outer_points = [];
    this.generate_outer_points();

    this.vel = 100 / this.size;
    this.angle = random(0, TWO_PI);

    this.tier = tier;
  }

  generate_outer_points() {
    let n = floor(random(10, 20));
    let angle = 0;
    let lowerlimit = 0;
    let upperlimit = 0;

    let xn = 0;
    let yn = 0;

    for (let i = 0; i < n; i++) {
      let r = random(0.95 * this.size, 1.05 * this.size);

      if (i / n < 0.25) {
        if (upperlimit < PI / 2) {
          upperlimit = PI / 2;
        }
      } else if (i / n < 0.5) {
        if (lowerlimit < PI / 2) {
          lowerlimit = PI / 2;
        }
        if (upperlimit < PI) {
          upperlimit = PI;
        }
      } else if (i / n < 0.75) {
        if (lowerlimit < PI) {
          lowerlimit = PI;
        }
        if (upperlimit < 1.5 * PI) {
          upperlimit = 1.5 * PI;
        }
      } else {
        if (lowerlimit < 1.5 * PI) {
          lowerlimit = 1.5 * PI;
        }
        if (upperlimit < TWO_PI) {
          upperlimit = TWO_PI;
        }
      }
      angle = random(lowerlimit + 0.15 * (upperlimit - lowerlimit), lowerlimit + 0.50 * (upperlimit - lowerlimit));
      xn = this.x + r * cos(angle);
      yn = this.y + r * sin(angle);
      lowerlimit = angle;
      this.outer_points.push(xn);
      this.outer_points.push(yn);
    }
  }

  show() {
    stroke(255);
    strokeWeight(1);
    noFill();
    let n = this.outer_points.length;
    let li = this.outer_points;

    beginShape();
    for (let i = 0; i < n; i += 2) {
      vertex(li[i], li[i + 1]);
    }
    endShape(CLOSE);

  }

  update() {
    this.theta += this.rotation_velocity;
    this.move();
    this.teleport();
  }

  move() {
    let delx = this.vel * cos(this.angle);
    let dely = this.vel * sin(this.angle);

    this.x += delx;
    this.y += dely;
    this.update_verteces(delx, dely);
  }

  teleport() {
    if (this.x < 0) {
      this.x += width;
      this.update_verteces(width, 0);
    } else if (this.x > width) {
      this.x -= width;
      this.update_verteces(-width, 0);
    }

    if (this.y < 0) {
      this.y += height;
      this.update_verteces(0, height);
    } else if (this.y > height) {
      this.y -= height;
      this.update_verteces(0, -height);
    }
  }

  update_verteces(x, y) {
    for (let i = 0; i < this.outer_points.length; i += 2) {
      this.outer_points[i] += x;
      this.outer_points[i + 1] += y;
      
    }
  }
  
  // Crossing Number algorithm to determine if a point is inside the Asteroid.
  contains_point(x,y){
    let vertices = this.outer_points;
    let num = 0;
    for(let i = 0; i < vertices.length; i+=2){
      let x1 = vertices[i];
      let y1 = vertices[i+1];
      let x2;
      let y2;
      if(i < vertices.length - 2){
        x2 = vertices[i+2];
        y2 = vertices[i+3];
      } else {
        x2 = vertices[0];
        y2 = vertices[1];
      }
      
      if(does_horizontal_line_intersect_edge(x, y, x1, y1, x2, y2)){
        num += 1;
      }
    }
    return(num%2 != 0)
  }
  
}

