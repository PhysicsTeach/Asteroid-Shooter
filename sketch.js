let ship;
let asteroids = [];
let debugmessage = "";
let level = 1;
let fail = false;
let stars = [];

let muted = false;

function preload() {
  bulletsound = loadSound("sounds/bullet.mp3");
  explosionsound = loadSound("sounds/explosion.mp3");
  failuresound = loadSound("sounds/failure.mp3");
  backgroundsound = loadSound("sounds/background.mp3");
}

function setup() {
  createCanvas(1300, 600);
  start_level();
  start_background_sounds();
}

function draw() {
  //reset_debugmessage();
  background(0);

  ship.update();
  ship.show();

  for (let i = 0; i < asteroids.length; i++) {
    ast = asteroids[i];
    ast.update();
    ast.show();

    for (let j = 0; j < ship.bullets.length; j++) {
      let activebullet = ship.bullets[j];

      //if (ast.detect_collision(activebullet.x, activebullet.y)) {
      if (ast.contains_point(activebullet.x, activebullet.y)) {
        destroy_asteroid(i);
        ship.removebullet();
      }

    }

    //if (ast.detect_collision(ship.x1, ship.y1) || ast.detect_collision(ship.x2, ship.y2) || ast.detect_collision(ship.x3, ship.y3)) {
    if (ast.contains_point(ship.x1, ship.y1) || ast.contains_point(ship.x2, ship.y2) || ast.contains_point(ship.x3, ship.y3)) {
      lose();
    }

  }

  if (asteroids.length == 0 && !fail) {
    win();
  }

  show_stars();

  //helping with key codes
  //console.log(keyCode);

  if (keyIsDown(39)) {
    ship.rotate(ship.rotation_speed);
  }
  if (keyIsDown(37)) {
    ship.rotate(-ship.rotation_speed);
  }
  if (keyIsDown(38)) {
    ship.boost();
  }
  if (keyIsDown(40)) {
    ship.brake();
  }

  display_level();
  display_debugmessage();
}

function keyPressed() {

  // pressing "k" = a kill switch to test asteroid destruction. Seems to work.
  if (keyCode === 75) {
    destroy_asteroid(0);
  }
  if (keyCode === 82) {
    reset();
  }
  if (keyCode === 65 && !fail) {
    ship.shoot();
  }
  if (keyCode === 83) {
    muted = !muted;

    if (muted) {
      stop_background_sounds();
    } else {
      start_background_sounds();
    }
  }
}

function win() {
  if (level < 10) {
    level += 1;
    start_level();
  } else {
    debugmessage = "YOU WIN!"
  }
}

function start_background_sounds() {
  backgroundsound.setVolume(0.3);
  backgroundsound.loop();
}

function stop_background_sounds() {
  backgroundsound.stop();
}

function lose() {
  debugmessage = "YOU LOSE! PRESS R TO TRY AGAIN.";

  //Play the failure sound on the first hit.
  if (!muted && !fail) {
    failuresound.setVolume(0.6);
    failuresound.play();
  }

  //Enter failstate. You can't shoot anymore, and the failure sound is disabled.
  fail = true;
}

function start_level() {
  ship = new Ship(width / 2, height / 2);
  generate_asteroids(level);
  make_stars();
}

function reset_debugmessage() {
  debugmessage = "";
}

function display_debugmessage() {
  textSize(40);
  textAlign(CENTER);
  stroke(255);
  fill(255);
  text(debugmessage, width / 2, 50);
}

function display_level() {
  textSize(20);
  textAlign(RIGHT);
  stroke(255);
  fill(255);
  text("level " + level, width, 20);
}

function destroy_asteroid(index) {
  let ast = asteroids[index];
  if (ast.tier > 1) {
    asteroids.push(new Asteroid(ast.x, ast.y, ast.size / 2, ast.tier - 1));
    asteroids.push(new Asteroid(ast.x, ast.y, ast.size / 2, ast.tier - 1));
  }
  asteroids.splice(index, 1);

  //Play the "boom" sound.
  if (!muted) {
    explosionsound.playMode("restart");
    explosionsound.setVolume(0.5);
    explosionsound.play();
  }
}

function reset() {
  fail = false;
  asteroids = [];
  //generate_asteroid();
  //ship.reset();
  reset_debugmessage();
  level = 1;
  start_level();
}

function generate_asteroid() {
  let hor = random(0, 1);
  let upleft = random(0, 1);
  let ratio = random(0, 1);

  if (hor > 0.5) {
    let yn = random(0, height / 100);
    if (upleft > 0.5) {
      yn = height - yn;
    }
    asteroids.push(new Asteroid(ratio * width, yn, 100, 3));
  } else {
    let xn = random(1, width / 100);
    if (upleft > 0.5) {
      xn = width - xn;
    }
    asteroids.push(new Asteroid(xn, ratio * height, 100, 3));
  }


}

function generate_asteroids(num) {
  for (let i = 0; i < num; i++) {
    generate_asteroid();
  }
}

function make_stars() {
  stars = [];
  for (let i = 0; i < 250; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let z = random(0,10);
    
    let z1;
    if(z < 7){
      z1 = 1;
    } else if (z < 9.6) {
      z1 = 2;
    } else {
      z1 = 3;
    }
    
    stars.push(x);
    stars.push(y);
    stars.push(z1);
  }
}

function show_stars() {
  stroke(255);
  for (let i = 0; i < stars.length; i += 3) {
    strokeWeight(stars[i+2]);
    point(stars[i], stars[i + 1]);
  }
}

function minimum(a, b) {
  if (a < b) {
    return a;
  }
  return b;
}

function maximum(a, b) {
  if (a > b) {
    return a;
  }
  return b;
}

// function used in the Crossing Point algorithm to determine whether or not a point is inside a polygon.
// Called in the "Asteroid" class.
function does_horizontal_line_intersect_edge(x, y, x1, y1, x2, y2) {

  if (x > maximum(x1, x2) || y > maximum(y1, y2) || y < minimum(y1, y2) || (x == x2 && y == y2)) {
    return false;
  } else if (y1 != y2) {
    let xt = (x2 - x1) * (y - y1) / (y2 - y1) + x1;
    if (x > xt) {
      return false;
    }
  }
  return true;

}
