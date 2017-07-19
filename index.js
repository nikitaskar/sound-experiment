

var gsap = require("gsap");
var TweenMax = gsap.TweenMax;
var audioPlayer = require("web-audio-player");
global.THREE = require('three');

var scene, camera, renderer;
var geometry, material, mesh;
var container;
var controls = require('orbit-controls')();
var spheres = [];
var colors = [0x1c1261, 0xb41538, 0xffc12d];
var rand, meshClone;


var easing = "Linear.easeOut";


function staggerShake(element) {
   for (i = 0; i < element.length; i++){
     random = Math.random()*6+2;
     TweenMax.to(spheres[i].scale, 0.7, { x: random, y: random, z: random, ease: easing });
   }
}

init();
staggerShake(spheres);
animate();


function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 600;
    TweenMax.to(camera.position, 1.5, { x: 0, y: 0, z: 300, ease: Elastic.easeOut, });

    geometry = new THREE.SphereGeometry( 1, 40, 40 );
    material = new THREE.MeshBasicMaterial( { color: colors[Math.floor(Math.random()*3)], wireframe: false, } );
    mesh = new THREE.Mesh( geometry, material );

    for ( i = 0; i < 250; i++) {
      meshClone = mesh.clone();
      meshClone.material = mesh.material.clone();
      meshClone.material.color.setHex(colors[Math.floor(Math.random()*3)]);

      spheres.push(meshClone);
    }

    var vector = new THREE.Vector3();

  	for ( var i = 0, l = spheres.length; i < l; i ++ ) {

  		var phi = Math.acos( -1 + ( 2 * i ) / l );
  		var theta = Math.sqrt( l * Math.PI ) * phi;

  		spheres[i].position.x = 120 * Math.cos( theta ) * Math.sin( phi );
  		spheres[i].position.y = 120 * Math.sin( theta ) * Math.sin( phi );
  		spheres[i].position.z = 120 * Math.cos( phi );


  		vector.copy( spheres[i].position ).multiplyScalar( 2 );

  		scene.add(spheres[i]);

  	}

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xf6f6f6, 1);
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

  requestAnimationFrame( animate );

  renderer.render( scene, camera );

}
