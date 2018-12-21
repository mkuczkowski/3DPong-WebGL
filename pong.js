// --- start point ---
function initialize() {
    draw();
}

// --- runs every frame ---
function draw() {
    renderer.render(scene, camera);
    ballMovement();
    playerMovement();
    requestAnimationFrame(draw);
}

const WIDTH = 1200;
const HEIGHT = 700;

const renderer = new THREE.WebGLRenderer();

renderer.setSize(WIDTH, HEIGHT);

const canvas = document.getElementById("canvas");
canvas.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera( 50, (WIDTH/HEIGHT), 0.1, 10000);
let scene = new THREE.Scene();

scene.add(camera);
camera.position.z = 320;

let sphereMaterial = new THREE.MeshLambertMaterial({color: 0xC43467});
let ball = new THREE.Mesh(
    new THREE.SphereGeometry(5, 8, 6),
    sphereMaterial
);

scene.add(ball);

let pointLight = new THREE.PointLight(0xFFFFFF);

pointLight.position.x = 550;
pointLight.position.y = 122;
pointLight.position.z = 4800;
pointLight.intensity = 6;
pointLight.distance = 10000;

scene.add(pointLight);

const court = new THREE.TextureLoader().load( "https://i.imgur.com/nWDveBQ.png" );

let planeMaterial = new THREE.MeshBasicMaterial({map: court});

const COURT_WIDTH = 390;
const COURT_HEIGHT = 180;

let gameArea = new THREE.Mesh(
    new THREE.PlaneGeometry(
        COURT_WIDTH, COURT_HEIGHT, 10, 10
    ),
    planeMaterial
);

scene.add(gameArea);

let playerMaterial = new THREE.MeshLambertMaterial({color: 0xCC1111});

let player1 = new THREE.Mesh(
  new THREE.CubeGeometry(
      //width, height, depth, quality
      8, 45, 8, 7, 7, 7),
  playerMaterial);

scene.add(player1);

let player2 = new THREE.Mesh(
  new THREE.CubeGeometry(
    8, 45, 8, 7, 7, 7),
  playerMaterial);

scene.add(player2);

player1.position.x = -COURT_WIDTH/2 + 8;
player2.position.x = COURT_WIDTH/2 - 8;

player1.position.z = 8;
player2.position.z = 8;

const BALL_SPEED = 1.7;
let ballDirectionY = 1;
let ballDirectionX = 1;

function ballMovement() {
    ball.position.x -= ballDirectionX * BALL_SPEED;
    ball.position.y -= ballDirectionY * BALL_SPEED;

    if(ball.position.y <= -COURT_HEIGHT/2) ballDirectionY = -ballDirectionY;
    if(ball.position.y >= COURT_HEIGHT/2)  ballDirectionY = -ballDirectionY;

    if (ball.position.x <= -COURT_WIDTH/2) {
        //player2 scores
        nextRound();
    }
    if (ball.position.x >= COURT_WIDTH/2) {
        //player1 scores
        nextRound();
    }

    if (ball.position.x <= player1.position.x + 8
        &&  ball.position.x >= player1.position.x) {
            if (ball.position.y <= player1.position.y + 45/2
            &&  ball.position.y >= player1.position.y - 45/2) {               
                    ballDirectionX = -ballDirectionX;   
            }
        }

    if (ball.position.x <= player2.position.x + 8
        &&  ball.position.x >= player2.position.x) {
            if (ball.position.y <= player2.position.y + 45/2
            &&  ball.position.y >= player2.position.y - 45/2) {
                    ballDirectionX = -ballDirectionX;
                }
            }
            
}

function playerMovement() {
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37: //left arrow
                if(player1.position.y < COURT_HEIGHT / 2 - 25) 
                    player1.position.y += 3.5;   
                break;
            case 39: //right arrow
                if(player1.position.y > -COURT_HEIGHT / 2 + 25) 
                    player1.position.y -= 3.5;
                break;
        }
    };
    player2.position.y = ball.position.y * 0.7;
}

function nextRound() {
    ball.position.x = 0;
    ball.position.y = 0;
    player1.position.y = 0;
    player2.position.y = 0;
}

let sliderPosX = document.getElementById("posXRange");
let posX = document.getElementById("posX");
posX.innerHTML = sliderPosX.value;

sliderPosX.oninput = function() {
    camera.position.x = this.value;
    posX.innerHTML = this.value;
}

let sliderPosY = document.getElementById("posYRange");
let posY = document.getElementById("posY");
posY.innerHTML = sliderPosY.value;

sliderPosY.oninput = function() {
    camera.position.y = this.value;
    posY.innerHTML = this.value;
}

let sliderPosZ = document.getElementById("posZRange");
let posZ = document.getElementById("posZ");
posZ.innerHTML = sliderPosZ.value;

sliderPosZ.oninput = function() {
    camera.position.z = this.value;
    posZ.innerHTML = this.value;
}

let sliderRotX = document.getElementById("rotXRange");
let rotX = document.getElementById("rotX");
rotX.innerHTML = sliderRotX.value;

sliderRotX.oninput = function() {
    camera.rotation.x = this.value;
    rotX.innerHTML = this.value;
}

let sliderRotY = document.getElementById("rotYRange");
let rotY = document.getElementById("rotY");
rotY.innerHTML = sliderRotY.value;

sliderRotY.oninput = function() {
    camera.rotation.y = this.value;
    rotY.innerHTML = this.value;
}

let sliderRotZ = document.getElementById("rotZRange");
let rotZ = document.getElementById("rotZ");
rotZ.innerHTML = sliderRotZ.value;

sliderRotZ.oninput = function() {
    camera.rotation.z = this.value;
    rotZ.innerHTML = this.value;
}