var gsap = require("gsap");
var TweenMax = gsap.TweenMax;
var audioPlayer = require("web-audio-player");
global.THREE = require('three');
var mouseEventOffset = require('mouse-event-offset');
var tweenr = require('tweenr')();
var mouseOffset = new THREE.Vector2();

var scene, camera, renderer;
var geometry, material, mesh;
var container;
var controls;
var spheres = [];
var target = new THREE.Vector3();
var colors = [[0x301781, 0x76E2F4, 0x615DEC],[0xFC345C, 0x49BEB7, 0xAFFFDF],[0x1A2F4B, 0x0CdA98, 0x00FFCC],[0xFF4545, 0xFFEDB2, 0xFF9867]];
var rand, meshClone, randomColorPattern;
var radius = {radius: 110};
var blop;

function staggerShake(element) {
   var easing = "Linear.easeOut";

   for (i = 0; i < element.length; i++){
     random = Math.random()*3+0.5;
     var blop = TweenMax.to(spheres[i].scale, 0.4, { x: random, y: random, z: random, ease: easing });

   }
}

var click = document.getElementById("changecolor").addEventListener("click", changeColor);

function changeColor(){

    randomColorPattern = [Math.floor(Math.random()*4)];

    if (controls.distance !== 300) {
      blop.invalidate();
      blop.restart();
    }

    for ( i = 0; i < spheres.length; i++) {
      spheres[i].material.color.setHex(colors[randomColorPattern][Math.floor(Math.random()*3)]);


    }
    controls.distance = 410;
    blop = TweenMax.to(controls, 1, { distance: 300, ease: Elastic.easeOut, });

}

var audio = audioPlayer('indiansummer.mp3');

audio.on('load', () => {
  // start playing audio file
  //audio.play();

  // and connect your node somewhere, such as
  // the AudioContext output so the user can hear it!
  audio.node.connect(audio.context.destination);
});


init();
staggerShake(spheres);
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    controls = require('orbit-controls')({position : [0,0,0], distance: 300, zoom: false, rotateSpeed: 0.006, damping: 0.08,});
    geometry = new THREE.SphereGeometry( 1, 40, 40 );
    material = new THREE.MeshBasicMaterial( { color: colors[Math.floor(Math.random()*3)], wireframe: false, } );
    mesh = new THREE.Mesh( geometry, material );
  console.log(controls);
    randomColorPattern = [Math.floor(Math.random()*4)];

    for ( i = 0; i < 600; i++) {
      meshClone = mesh.clone();
      meshClone.material = mesh.material.clone();
      meshClone.material.color.setHex(colors[randomColorPattern][Math.floor(Math.random()*3)]);

      spheres.push(meshClone);
    }

    var vector = new THREE.Vector3();

  	for ( var i = 0, l = spheres.length; i < l; i ++ ) {

  		var phi = Math.acos( -1 + ( 2 * i ) / l );
  		var theta = Math.sqrt( l * Math.PI ) * phi;

  		spheres[i].position.x = radius.radius * Math.cos( theta ) * Math.sin( phi );
  		spheres[i].position.y = radius.radius * Math.sin( theta ) * Math.sin( phi );
  		spheres[i].position.z = radius.radius * Math.cos( phi );

  		vector.copy( spheres[i].position ).multiplyScalar( 2 );

  		scene.add(spheres[i]);
  	}

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true,});
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

  controls.update();
  camera.position.fromArray(controls.position);
  camera.up.fromArray(controls.up);
  camera.lookAt(target);
  renderer.render( scene, camera );
}
