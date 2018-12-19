// --- start point ---
function initialize() {
    draw();
}

// --- runs every frame ---
function draw() {
    renderer.render(scene, camera); 
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

let planeMaterial = new THREE.MeshLambertMaterial({color: 0x004dff});

let gameArea = new THREE.Mesh(
    new THREE.PlaneGeometry(
        370, 180, 10, 10
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

player1.position.x = -370/2 + 8;
player2.position.x = 370/2 - 8;

player1.position.z = 8;
player2.position.z = 8;