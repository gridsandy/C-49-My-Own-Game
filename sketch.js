const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var backg;
var heliimg, heli;
var airdropBImg, airdropHImg, alienImg, blastImg, bulletImg, barrelImg, turretImg, heartImg;
var aliensGroup, barrelsGroup, bulletsGroup, hostileBulletsGroup, bulletDropGroup;
var alien, barrel, bullet, blast, blast2, bulletDrop, healthDrop;
var score = 0;
var angle = 90;
var health = 100;
var bullets = 100;

function preload() {
  backg = loadImage('./assets/backg.webp');
  heliimg = loadAnimation('./assets/Heli1.png', './assets/Heli2.png');
  airdropBImg = loadImage('./assets/Airdrop_Bullet.png');
  airdropHImg = loadImage('./assets/Airdrop_Health.png');
  alienImg = loadImage('./assets/Alien.png');
  blastImg = loadImage('./assets/blast.png');
  bulletImg = loadImage('./assets/bullet.png');
  barrelImg = loadImage('./assets/oil_barrel.png');
  turretImg = loadImage('./assets/Turret.png');
  heartImg = loadImage('./assets/heart.png');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  engine = Engine.create();
  world = engine.world;

  heli = createSprite(width - 250, 100, 100, 100)
  heli.addAnimation('heli', heliimg)
  heli.scale = 0.7;
  turret = createSprite(width - 280, 145, 100, 100);
  turret.addImage(turretImg);
  turret.scale = 0.1
  turret.angle = 90;


  aliensGroup = new Group();
  barrelsGroup = new Group();
  bulletsGroup = new Group();
  hostileBulletsGroup = new Group();
  blastGroup = new Group();
  bulletDropGroup = new Group();

}


function draw() {
  background(backg);
  Engine.update(engine);
  handleHeli();
  spawnAliens();
  spawnBarrels();
  handleBulletCollisionAliens();
  handleBulletCollisionBarrels();
  handleHeliCollision();
  handleBullets();
  handleAliens();
  randomBullets();
  handleBulletCollisionHeli();
  spawnBulletDrops();
  handleBulletDrop();

  fill('black');
  textSize(20);
  text(`Score: ${score}`, 20, 30);

  image(heartImg, 150, 15, 25, 25);
  fill('');
  rect(200, 20, 100, 20);
  fill('red');
  rect(200, 20, health, 20);
  fill('black');
  text('Target: 500', 330, 30)
  fill('black');
  text(`Bullets Remaining: ${bullets}`, 460, 30)

  if (score >= 200) {
    window.open('win.html', '_self')
  }

  if (frameCount % 80 === 0) {
    for (let i = 0; i < blastGroup.length; i++) {
      blastGroup[i].remove();
    }
  }

  if (frameCount % 40 === 0) {
    if (health < 100) {
      health += 5;
    }
  }

  drawSprites();
}

function handleHeli() {
  if (keyIsDown(UP_ARROW)) {
    heli.y = heli.y - 7
    turret.y = turret.y - 7
  }

  if (keyIsDown(DOWN_ARROW)) {
    heli.y = heli.y + 7
    turret.y = turret.y + 7
  }

  if (keyIsDown(LEFT_ARROW)) {
    heli.x = heli.x - 7;
    turret.x = turret.x - 7;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    heli.x = heli.x + 7
    turret.x = turret.x + 7
  }

  if (keyIsDown(83)) {
    turret.angle = turret.angle + 5
  }

  if (keyIsDown(32)) {
    if (bullets > 0) {
      bullet = createSprite(turret.x, turret.y, 10, 10);
      bullet.addImage(bulletImg);
      bullet.scale = 0.03;
      bullet.velocityX = Math.round(random(-20, -27));
      bullet.angle = -90
      bulletsGroup.add(bullet);
      bullets--;
      var sound = new Audio('assets/shoot.mp3');
      sound.play();
    }
  }
}

function handleHeliCollision() {
  for (let i = 0; i < aliensGroup.length; i++) {
    if (heli.isTouching(aliensGroup[i])) {
      boom()
      health = health - 49.99;
      aliensGroup[i].remove();
      blast = createSprite(heli.x, heli.y);
      blast.addImage(blastImg);
      blast.scale = 0.3;
      blastGroup.add(blast);
      setTimeout(() => {
        blast.remove();
      }, 500);
      if (health <= 2) {
        setTimeout(() => {
          window.open('gameover.html', '_self')
        }, 400);
      }
    }
  }
}

function spawnAliens() {
  if (frameCount % 50 === 0) {
    alien = createSprite(Math.round(random(-200, -80)), Math.round(random(400, 700)), 80, 100);
    alien.addImage(alienImg);
    alien.scale = 0.35;
    alien.velocityX = 8;
    aliensGroup.add(alien);
  }
}

function spawnBarrels() {
  if (frameCount % 200 === 0) {
    barrel = createSprite(Math.round(random(25, 1000)), 700, 60, 80);
    barrel.addImage(barrelImg);
    barrel.scale = 0.1;
    barrelsGroup.add(barrel);
  }
}

function handleBulletCollisionAliens() {
  for (let i = 0; i < aliensGroup.length; i++) {
    for (let j = 0; j < bulletsGroup.length; j++) {
      if (aliensGroup[i].isTouching(bulletsGroup[j])) {
        boom()
        blast = createSprite(bulletsGroup[j].x, bulletsGroup[j].y);
        blast.addImage(blastImg);
        blast.scale = 0.07;
        blastGroup.add(blast);
        aliensGroup[i].remove();
        bulletsGroup[j].remove();
        score += 10;
        setTimeout(() => {
          blast.remove();
        }, 300);
        break;
      }
    }
  }
}

function handleBulletCollisionBarrels() {
  for (let i = 0; i < barrelsGroup.length; i++) {
    for (let j = 0; j < bulletsGroup.length; j++) {
      if (barrelsGroup[i].isTouching(bulletsGroup[j])) {
        boom()
        blast = createSprite(bulletsGroup[j].x, bulletsGroup[j].y);
        blast.addImage(blastImg);
        blast.scale = 0.25;
        blastGroup.add(blast);
        barrelsGroup[i].remove();
        bulletsGroup[j].remove();
        for (let k = 0; k < aliensGroup.length; k++) {
          if (blast.isTouching(aliensGroup[k])) {
            blast2 = createSprite(aliensGroup[k].x, aliensGroup[k].y, 100, 100);
            blast2.addImage(blastImg);
            blast2.scale = 0.12;
            blastGroup.add(blast2);
            aliensGroup[k].remove();
            score += 20
            setTimeout(() => {
              blast2.remove();
            }, 300);
          }

        }
        score += 15
        setTimeout(() => {
          blast.remove();
        }, 300);
        break;
      }
    }
  }
}

function handleBullets() {
  for (let i = 0; i < bulletsGroup.length; i++) {
    if (bulletsGroup[i].x < -20) {
      bulletsGroup[i].remove();
    }
  }
}

function handleAliens() {
  for (let i = 0; i < aliensGroup.length; i++) {
    if (aliensGroup[i].x > window.innerWidth + 50) {
      aliensGroup[i].remove();
      if (score >= 10) {
        score -= 10;
      }
    }
  }
}

function boom() {
  var sound = new Audio('assets/explosion.mp3');
  sound.play();
}

function randomizer(x, y) {
  return Math.round(Math.random(x, y));
}

function randomBullets() {
  if (frameCount % 100 === 0) {
    var randomNum = randomizer(0, aliensGroup.length);
    console.log(randomNum);
    for (let i = 0; i < 3; i++) {
      if (aliensGroup[randomNum] != undefined && aliensGroup[randomNum].x < window.innerWidth - 200) {
        bullet = createSprite(aliensGroup[randomNum].x, aliensGroup[randomNum].y, 10, 10);
        bullet.addImage(bulletImg);
        bullet.scale = 0.03;
        bullet.velocityX = Math.round(random(20, 25));
        hostileBulletsGroup.add(bullet);
        var sound = new Audio('assets/shoot.mp3');
        sound.play();
        setTimeout(() => {

        }, 100);
      }
    }
  }
}

function handleBulletCollisionHeli() {
  for (let j = 0; j < hostileBulletsGroup.length; j++) {
    if (heli.isTouching(hostileBulletsGroup[j])) {
      boom()
      blast = createSprite(heli.x, heli.y);
      blast.addImage(blastImg);
      blast.scale = 0.02;
      blastGroup.add(blast);
      hostileBulletsGroup[j].remove();
      score -= 5;
      health -= 10;
      setTimeout(() => {
        blast.remove();
      }, 100);
      break;
    }
  }
}

function spawnBulletDrops() {
  if (frameCount % 180 === 0) {
    bulletDrop = createSprite(Math.round(random(70, window.innerWidth - 70)), -20);
    bulletDrop.addImage(airdropBImg)
    bulletDrop.scale = 0.3;
    bulletDrop.velocityY = 2;
    bulletDropGroup.add(bulletDrop);
  }
}

function handleBulletDrop() {
  for (let i = 0; i < bulletDropGroup.length; i++) {
    if (bulletDropGroup[i].isTouching(heli)) {
      bullets += 50;
      bulletDropGroup[i].remove();
    }
    
  }
}

