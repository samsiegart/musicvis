var audioSource = new SoundCloudAudioSource('player');
var canvasElement = document.getElementById('canvas');
var context = canvasElement.getContext("2d");
var player =  document.getElementById('player');
var loader = new SoundcloudLoader(player);

loader.loadStream("https://soundcloud.com/odesza/its-only", function(){
  audioSource.playStream(loader.streamUrl());
  draw();
});

var draw = function() {
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
};

