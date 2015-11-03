var audioSource = new SoundCloudAudioSource('player');
var player =  document.getElementById('player');
var loader = new SoundcloudLoader(player);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x441122, 0.5 );
document.body.insertBefore(renderer.domElement, document.body.firstChild);
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

var geometry = new THREE.IcosahedronGeometry(2,0);
var material = new THREE.MeshPhongMaterial({
  color: 0xBBBBBB,
  emissive: 0x292026,
  side: THREE.DoubleSide,
  shading: THREE.FlatShading
});

var shape = new THREE.Mesh( geometry, material );
scene.add( shape );

var dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, -1, 1.1);
scene.add(dirLight);

camera.position.z = 5;

var render = function () {
  var red = 0;
  var green = 0;
  var blue = 0;
  for(bin = 0; bin < (audioSource.streamData.length / 4); bin++){
    green += audioSource.streamData[bin] / 6000.0;
  }
  for(bin = Math.floor(audioSource.streamData.length / 4); bin < (2 * (audioSource.streamData.length / 4)); bin++){
    blue += audioSource.streamData[bin] / 6000.0;
  }
  for(bin = Math.floor(2 * (audioSource.streamData.length / 4)); bin < audioSource.streamData.length; bin++){
    red += audioSource.streamData[bin] / 6000.0;
  }

  dirLight.color.r = red*1.6;
  dirLight.color.g = green;
  dirLight.color.b = blue*1.3;

  requestAnimationFrame( render );

  x_rotation_velocity = green / 85;
  y_rotation_velocity = blue / 85;
  z_rotation_velocity = red / 85;
  shape.rotation.y += x_rotation_velocity;
  shape.rotation.x += y_rotation_velocity;
  shape.rotation.x += z_rotation_velocity;

  shape.geometry = new THREE.IcosahedronGeometry(audioSource.volume / 7000, 0);

  renderer.render(scene, camera);
};

//"https://soundcloud.com/anna-lunoe/hyperhousemegamix"
//"https://soundcloud.com/grey/zedd-beautiful-now-remix"
loader.loadStream("https://soundcloud.com/anna-lunoe/hyperhousemegamix", function(){
  audioSource.playStream(loader.streamUrl());
  //draw();
  render();
});

var change_song = function() {
  soundcloud_url = document.getElementById("soundcloud_url_input").value;
  loader.loadStream(soundcloud_url, function(){
    audioSource.playStream(loader.streamUrl());
    render();
  });
};

/*var draw = function() {
    for(bin = 0; bin < audioSource.streamData.length; bin ++) {
        var val = audioSource.streamData[bin];
        var red = 0;
        var green = 255;
        var blue = 0;
        context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        context.fillRect(bin * 8, 0, 8, 400);
        green = 0;
        red = 255
        context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
        context.fillRect(bin * 8, 400-val, 8, val);
    }
    blue = 0;
    red = 0;
    green = 255;
    context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    context.fillRect(0,0,1000,8);
    blue = 255;
    green = 0;
    context.fillStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    context.fillRect(0,0,audioSource.volume/40,8);

    requestAnimationFrame(draw);
};*/

