(function(document, Reveal){

  // fragment display handlers

  var fragments = [],
      fragment_fns = [],
      fragment_back_fns = [];

  Reveal.addEventListener( 'fragmentshown', function( event ) {
    var fn = fragment_fns[fragments.indexOf(event.fragment)];
    if(fn) fn(event);
  })

  Reveal.addEventListener( 'fragmenthidden', function( event ) {
    var fn = fragment_back_fns[fragments.indexOf(event.fragment)];
    if(fn) fn(event);
  })

  function registerFragment(fn, back_fn){
    var el = document.createElement('div');
    el.className = 'fragment';
    fragments.push(el);
    fragment_fns.push(fn);
    fragment_back_fns.push(back_fn);
  }

  // -------------------








var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({antialias:true});
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor(0xdddddd);
// document.body.appendChild( renderer.domElement );

var group = new THREE.Object3D();


camera.position.z = 10;
camera.lookAt({x:0,y:0,z:0})
// camera.position.y = -0.5



function ball(color){
  var r = (color & 0xff0000) >> 16,
      g = (color & 0x00ff00) >> 8,
      b = (color & 0x0000ff);


  var geometry2 = new THREE.SphereGeometry(.05,10,10)
  var material = new THREE.MeshBasicMaterial( { wireframe: false, color: color, opacity: 0.2} );
  var sphere = new THREE.Mesh( geometry2, material );
  sphere.position.x = (r / 255) - 0.5;
  sphere.position.y = (g / 255) - 0.5;
  sphere.position.z = (b / 255) - 0.5;
  group.add( sphere );
}


ball(0x000000);

ball(0x0000ff);
ball(0x00ff00);
ball(0xff0000);

function interpolate(color1, color2, num){

  var r1 = (color1 & 0xff0000) >> 16,
      g1 = (color1 & 0x00ff00) >> 8,
      b1 = (color1 & 0x0000ff),
      r2 = (color2 & 0xff0000) >> 16,
      g2 = (color2 & 0x00ff00) >> 8,
      b2 = (color2 & 0x0000ff);

  var colours = [], r, g ,b;
  for(var i = 0; i < num+1; i++){
    r = (r1 + ((r2 - r1)*(i/num)));
    g = (g1 + ((g2 - g1)*(i/num)));
    b = (b1 + ((b2 - b1)*(i/num)));
    colours.push((r << 16) + (g << 8) + b)
  }
  return colours;
}





scene.add(group)


group.rotation.x = 0.3;
group.rotation.y = -0.5;


renderer.render(scene, camera);

var stop = false, rotateby = 0;

function render() {
  if(!stop) requestAnimationFrame(render);
  renderer.render(scene, camera);

  group.rotation.z += rotateby;
  TWEEN.update();

}
// render();


var cube;
function draw_white(){
  ball(0xffffff);

  var geometry = new THREE.CubeGeometry(1,1,1,3,3,3);
  var material = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000, opacity: 0.04} );
  material.transparent = true;
  cube = new THREE.Mesh( geometry, material );
  group.add( cube );
}

function draw_cyk(){

  ball(0x00ffff);
  ball(0xffff00);
  ball(0xff00ff);

}

function draw_bluegrad(){
  interpolate(0x2E2380,0x877BD6 ,6).forEach(ball);
}

var position = { x: group.rotation.x, y: group.rotation.y };
var target = { x: -Math.PI/4 + 0.2, y: (-Math.PI/4) };
var tween = new TWEEN.Tween(position).to(target, 1000);
tween.easing(TWEEN.Easing.Quartic.InOut)
tween.onUpdate(function(){
  group.rotation.x = position.x
  group.rotation.y = position.y
});

function draw_rotate(){
  tween.start()
}

function draw_cylinder(){

  var hsl = new THREE.CylinderGeometry(Math.sqrt(3)/2, Math.sqrt(3)/2, Math.sqrt(3), 40, 3, false);

  var material = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000, opacity: 0.04} );
  material.transparent = true;
  var cylinder = new THREE.Mesh( hsl, material );

  cylinder.rotation.x = Math.PI/4
  cylinder.rotation.z = 2.55;

  group.add( cylinder );

  cube.visible = false

  // rotateby = 0.005;

}






function draw_rotate(){
  tween.start()
}


function draw_by_hue(){
  var hue_position = { x: group.rotation.x };
  var hue_target = { x: 0.62 };
  var tween = new TWEEN.Tween(hue_position).to(hue_target, 1000);
  tween.easing(TWEEN.Easing.Quartic.InOut)
  tween.onUpdate(function(){
    group.rotation.x = hue_position.x
  });
  tween.start();
}





// t = 100;
// setTimeout(draw_white,    t+=1000)
// setTimeout(draw_cyk,      t+=1000)
// setTimeout(draw_bluegrad, t+=1000)
// setTimeout(draw_rotate,   t+=1000)
// setTimeout(draw_cylinder, t+=1000)
// setTimeout(draw_by_hue,   t+=1000)




registerFragment(render);
registerFragment(draw_white);
registerFragment(draw_cyk);
registerFragment(draw_bluegrad);
registerFragment(draw_rotate);
registerFragment(draw_cylinder);
registerFragment(draw_by_hue);

registerFragment(function(){
  stop = true;
});





  // registerFragment(function(){
  //   console.log("HELLO ONE");
  //   render();
  // },function(){
  //   console.log("REVERT ONE")
  // });
  // registerFragment(function(){
  //   console.log("HELLO TWO")
  // });
  // registerFragment(function(){
  //   console.log("HELLO THREE")
  // },function(){
  //   console.log("REVERT THREE")
  // });





  // -------------------

  this.colourspace = function(){
    var section = document.querySelector('[data-colour-cubes]');

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xdddddd);
    section.appendChild( renderer.domElement );


    renderer.render(scene, camera);


    fragments.forEach(function(fragment){
      section.appendChild(fragment)
    });


  }
}).call(this, document, Reveal)