var player =  document.getElementById('player');
var loader = new SoundcloudLoader(player);
var audioSource = new SoundCloudAudioSource(player);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x441122, 1);
document.body.insertBefore(renderer.domElement, document.body.firstChild);
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

var clickedArrow = false;

document.getElementById('iconRow').addEventListener('click', function(e){
  clickedArrow = true;
  var bottomBar = document.getElementById('bottomBar');
  if (bottomBar.classList.contains('hide')){
    bottomBar.classList.remove('hide');
    bottomBar.classList.add('show');
  } else {
    bottomBar.classList.remove('show');
    bottomBar.classList.add('hide');
  }
});

window.onload = function() {
  setTimeout(function(){
    if(clickedArrow == false){
      document.getElementById('iconRow').click();
    }
  }, 3000);
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
dirLight.color.r = 50;
dirLight.color.g = 15;
dirLight.color.b = 70;
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

  dirLight.color.r = 1.6*red;
  dirLight.color.g = green;
  dirLight.color.b = 1.3*blue;

  requestAnimationFrame( render );

  x_rotation_velocity = green / 30;
  y_rotation_velocity = blue / 30;
  z_rotation_velocity = red / 30;
  shape.rotation.y += x_rotation_velocity;
  shape.rotation.x += y_rotation_velocity;
  shape.rotation.x += z_rotation_velocity;

  shape.geometry.dispose();
  delete shape.geometry;
  shape.geometry = new THREE.IcosahedronGeometry(audioSource.volume / 7000, 0);

  renderer.render(scene, camera);
};

//"https://soundcloud.com/anna-lunoe/hyperhousemegamix"
//"https://soundcloud.com/grey/zedd-beautiful-now-remix"
var streamDatIsh = function(songUrl) {
  loader.loadStream(songUrl, function(){
    var artistLink = document.createElement('a');
    artistLink.setAttribute('href', loader.sound.user.permalink_url);
    artistLink.innerHTML = loader.sound.user.username;
    var trackLink = document.createElement('a');
    trackLink.setAttribute('href', loader.sound.permalink_url);
    if(loader.sound.kind=="playlist"){
      trackLink.innerHTML = "<p>" + loader.sound.tracks[loader.streamPlaylistIndex].title + "</p>" + "<p>"+loader.sound.title+"</p>";
    }else{
      trackLink.innerHTML = loader.sound.title;
    }
    var image = loader.sound.artwork_url ? loader.sound.artwork_url : loader.sound.user.avatar_url;

    var infoImage = document.getElementById('infoImage');
    var infoArtist = document.getElementById('infoArtist');
    var infoTrack = document.getElementById('infoTrack');

    infoImage.setAttribute('src', image);

    infoArtist.innerHTML = '';
    infoArtist.appendChild(artistLink);

    infoTrack.innerHTML = '';
    infoTrack.appendChild(trackLink);

    var trackToken = loader.sound.permalink_url.substr(22);
    window.location = '#' + trackToken;

    audioSource.playStream(loader.streamUrl());
    //draw();
  });
};


var initialize = function () {
  var trackUrl = "";
  if (window.location.hash) {
    trackUrl = 'https://soundcloud.com/' + window.location.hash.substr(1);
  } else {
    trackUrl = "https://soundcloud.com/sunday-girl/sunday-girl-where-is-my-mind"
  }
  streamDatIsh(trackUrl);
}
initialize();
render();

document.getElementById("urlForm").addEventListener("submit", function(e) {
  e.preventDefault();
  var soundcloud_url = document.getElementById("soundcloud_url_input").value;
  streamDatIsh(soundcloud_url);
});

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

