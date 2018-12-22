// --- start point ---
function initialize() {
    setupCamera();
    document.addEventListener('mousemove', onMouseMove, false);
    draw();
}

// --- runs every frame ---
function draw() {
    renderer.render(scene, camera);
    ballMovement();
    playerMovement();
    updateCameraVals();
    rotateObjects();
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

const ballTexture = new THREE.TextureLoader().load( "https://i.imgur.com/AptTDnU.jpg" );
let ballMaterial = new THREE.MeshBasicMaterial({map: ballTexture});

let ball = new THREE.Mesh(
    new THREE.SphereGeometry(5, 8, 6),
    ballMaterial
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

const glass = new THREE.TextureLoader().load( "https://i.imgur.com/PoFDw4O.jpg" );
let glassMaterial = new THREE.MeshBasicMaterial({map: glass, transparent: true, opacity: 0.6})

const COURT_WIDTH = 420;
const COURT_HEIGHT = 210;

let gameArea = new THREE.Mesh(
    new THREE.PlaneGeometry(
        COURT_WIDTH, COURT_HEIGHT, 10, 10
    ),
    planeMaterial
);

scene.add(gameArea);

gameArea.rotation.x += 300.02;
gameArea.material.side = THREE.DoubleSide;

const areaBottom = gameArea.position.y -=5;

let gameAreaRoof = new THREE.Mesh(
    new THREE.PlaneGeometry(
        COURT_WIDTH, COURT_HEIGHT, 10, 10
    ),
    glassMaterial
);

scene.add(gameAreaRoof);

gameAreaRoof.rotation.x += 300.02;
const areaRoof = gameAreaRoof.position.y += 155;
gameAreaRoof.material.side = THREE.DoubleSide;

let wall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(
        COURT_WIDTH, COURT_HEIGHT-50, 10, 10
    ),
    glassMaterial
);

scene.add(wall1);
wall1.material.side = THREE.DoubleSide;
wall1.position.y += 75;
wall1.position.z -= 105;

let wall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(
        COURT_WIDTH, COURT_HEIGHT-50, 10, 10
    ),
    glassMaterial
);

scene.add(wall2);
wall2.material.side = THREE.DoubleSide;
wall2.position.y += 75;
wall2.position.z += 105;

let circles = [];

for(let i=0; i<6; i++) {
    let circleGeometry = new THREE.CircleGeometry( 235*i, 64, 0, 320);
    let circleMaterial = new THREE.MeshFaceMaterial(new THREE.MeshBasicMaterial(
        {map: new THREE.TextureLoader().load("https://i.imgur.com/w6uPqg8.jpg"),
         side: THREE.DoubleSide }));
    var circle = new THREE.Mesh( circleGeometry, circleMaterial );
    scene.add( circle );
    circle.rotation.x += 300.02;
    circle.rotation.z += i*3;
    circle.position.y = -10;
    if(i !== 0) circle.position.y *= (i*(i+3));
    circles.push(circle);
}

let playerMaterial = new THREE.MeshLambertMaterial({color: 0xCC1111, transparent: true, opacity: 0.6});

let player1 = new THREE.Mesh(
  new THREE.CubeGeometry(
      //width, height, depth, quality
      8, 45, 48, 7, 7, 7),
  playerMaterial);

scene.add(player1);

let player2 = new THREE.Mesh(
  new THREE.CubeGeometry(
    8, 45, 48, 7, 7, 7),
  playerMaterial);

scene.add(player2);

player1.position.x = -COURT_WIDTH/2 + 8;
player2.position.x = COURT_WIDTH/2 - 8;
player1.position.z = 8;
player2.position.z = 8;
player1.rotation.x += 300.02;
player2.rotation.x += 300.02;
player1.position.y += 70;
player2.position.y += 70;

const brick = new THREE.TextureLoader().load( "https://i.imgur.com/j4G4r8M.jpg" );
let brickMaterial = new THREE.MeshBasicMaterial({map: brick});

let basement = new THREE.Mesh(
  new THREE.CubeGeometry(
      //width, height, depth, quality
      COURT_WIDTH, COURT_HEIGHT, 33, 7, 7),
  brickMaterial);

scene.add(basement);
basement.rotation.x += 300.02;
basement.position.y -= 22.5;

const tripleColor = new THREE.TextureLoader().load( "https://i.imgur.com/TR9mA8N.jpg" );
let tripleColorMaterial = new THREE.MeshBasicMaterial({map: tripleColor});

let cylinderGeometry = new THREE.CylinderGeometry( 40, 40, 1300, 320 );
let cylinder = new THREE.Mesh( cylinderGeometry, tripleColorMaterial );
scene.add( cylinder );
cylinder.position.y -= 680;

const BALL_SPEED = 1.6;
let ballDirectionZ = 1;
let ballDirectionX = 1;
let ballDirectionY = 1;

function ballMovement() {
    ball.position.x -= ballDirectionX * BALL_SPEED;
    ball.position.z -= ballDirectionZ * BALL_SPEED;
    ball.position.y += ballDirectionY * BALL_SPEED;

    if(ball.position.z <= -COURT_HEIGHT/2) ballDirectionZ = -ballDirectionZ;
    if(ball.position.z >= COURT_HEIGHT/2)  ballDirectionZ = -ballDirectionZ;
    if(ball.position.y >= areaRoof) ballDirectionY = -ballDirectionY;
    if(ball.position.y <= areaBottom) ballDirectionY = 1;

    if (ball.position.x <= -COURT_WIDTH/2) {
        //player2 scores
        nextRound();
    }
    if (ball.position.x >= COURT_WIDTH/2) {
        //player1 scores
        nextRound();
    }

    if (ball.position.x <= player1.position.x + 8
        &&  ball.position.x >= player1.position.x - 8) {
            if (ball.position.z <= player1.position.z + 45/2
            &&  ball.position.z >= player1.position.z - 45/2) {
                if (ball.position.y <= player1.position.y + 48/2
                &&  ball.position.y >= player1.position.y - 48/2) {
                    ballDirectionX = -ballDirectionX;
                }                
            }
        }

    if (ball.position.x <= player2.position.x + 8
        &&  ball.position.x >= player2.position.x - 8) {
            if (ball.position.z <= player2.position.z + 45/2
            &&  ball.position.z >= player2.position.z - 45/2) {
                if (ball.position.y <= player2.position.y + 48/2
                &&  ball.position.y >= player2.position.y - 48/2) {
                        ballDirectionX = -ballDirectionX; 
                }
            }
        } 
}

function playerMovement() {
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 65: //a
                if(player1.position.z > -COURT_HEIGHT / 2 + 25) 
                    player1.position.z -= 6.5;
                break;
            case 68: //d
                if(player1.position.z < COURT_HEIGHT / 2 - 25) 
                    player1.position.z += 6.5;   
                break;
            case 83: //s
                if(player1.position.y > areaBottom)
                    player1.position.y -= 6.5;
                break;
            case 87: //w
                if(player1.position.y < areaRoof)
                    player1.position.y += 6.5;
                break;
        }
    };
    player2.position.z = ball.position.z * 0.8;
    player2.position.y = ball.position.y * 0.9;
}

let mouse = {x: 0, y: 0};
function onMouseMove(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    player1.position.z = mouse.x * 170;
	player1.position.y = mouse.y * 150 + 50;
};

function nextRound() {
    ball.position.x = 0;
    ball.position.y = 0;
    player1.position.y = 70;
    player2.position.y = 70;
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

function setupCamera() {
    sliderPosX.value = posX.innerHTML = camera.position.x = -350;
	sliderPosY.value = posY.innerHTML = camera.position.y = 50;
	sliderPosZ.value = posZ.innerHTML = camera.position.z = 10;
	sliderRotX.value = rotX.innerHTML = camera.rotation.x = 0;
	sliderRotY.value = rotY.innerHTML = camera.rotation.y = -1.55;
	sliderRotZ.value = rotZ.innerHTML = camera.rotation.z;
}

function updateCameraVals() {
    sliderPosX.value = posX.innerHTML = Math.round(camera.position.x * 100) / 100;
	sliderPosY.value = posY.innerHTML = Math.round(camera.position.y * 100) / 100;;
	sliderPosZ.value = posZ.innerHTML = Math.round(camera.position.z * 100) / 100;
	sliderRotX.value = rotX.innerHTML = Math.round(camera.rotation.x * 100) / 100;
	sliderRotY.value = rotY.innerHTML = Math.round(camera.rotation.y * 100) / 100;
	sliderRotZ.value = rotZ.innerHTML = Math.round(camera.rotation.z * 100) / 100;
}

let skyGeo = new THREE.CubeGeometry(10000, 10000, 10000); 

let skyMaterials = [
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("https://i.imgur.com/A2pUBYB.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("https://i.imgur.com/lrv5RwF.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("https://i.imgur.com/ViLdqba.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("https://i.imgur.com/ymZ0c6O.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("https://i.imgur.com/PGjQMKa.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("https://i.imgur.com/pLcKikk.png"), side: THREE.DoubleSide })
];

let skyMaterial = new THREE.MeshFaceMaterial(skyMaterials);
let sky = new THREE.Mesh(skyGeo, skyMaterial);
scene.add(sky);

let controls = new THREE.OrbitControls(camera, renderer.domElement);

function rotateObjects() {
    let itr = 0;
    circles.forEach(function(item) {
        if(itr++ % 2 === 0)
            item.rotation.z += 0.001;
        else
            item.rotation.z -= 0.001;
    });
    cylinder.rotation.y += 0.04;
    ball.rotation.z += 0.03;
    ball.rotation.x += 0.03;
    ball.rotation.y += 0.03;
}