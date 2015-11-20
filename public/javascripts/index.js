function $(s){
  return document.querySelectorAll(s);

}
var lis = $("#list li");
for(var i = 0; i< lis.length; i++){
  lis[i].onclick = function(){
    for(var j = 0; j<lis.length; j++){
      lis[j].className = "unselect";
    }        
    this.className = "select";
  }
  lis[i].ondblclick = function(){
    choose("/media/"+this.title);
    }
}
var xhr = new XMLHttpRequest();
var ac = new window.AudioContext();
var gainNode = ac.createGain();
var analyser = ac.createAnalyser();
var size = 128;
analyser.fftSize = size*2;
analyser.connect(gainNode);
var source = null;
var n = 0;
var box = $("#box")[0];
var height,width;
var canvas = document.createElement("canvas");
box.appendChild(canvas);
var ctx = canvas.getContext("2d");
resize();
window.onresize = resize;

function resize(){
    height = box.clientHeight;
    width = box.clientWidth;
    canvas.height = height;
    canvas.width = width;
    var line = ctx.createLinearGradient(0,0,0,height);
    line.addColorStop(0,"red");
    line.addColorStop(0.5,"green");
    line.addColorStop(1,"blue");
    ctx.fillStyle = line;
    
}

gainNode.connect(ac.destination);
$("#difficult")[0].onmousemove = function(){
	changeVolume(this.value/this.max);
}
$("#difficult")[0].onmousemove();
function changeVolume(soundvalue){
	gainNode.gain.value = soundvalue * soundvalue;

}

function visualizer(){
    var arr = new Uint8Array(analyser.frequencyBinCount)
    requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame;
    function v(){
        analyser.getByteFrequencyData(arr);
        draw(arr);
        requestAnimationFrame(v);
    }    
    requestAnimationFrame(v);
}

function draw(arr){
    ctx.clearRect(0,0,width,height);
    var w = width/size;
    for (var i = 0;i<size;i++){
        var h = arr[i]/256 * height;
        ctx.fillRect(w * i, height - h, w*0.8,h);
        
    }
}
function start(buffer){    
    var bufferSource = ac.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(analyser);
    if(n > 1){
    n--;
    return;
     }
    bufferSource[bufferSource.start?"start":"noteOn"](0);
    source = bufferSource;
    visualizer();
}

function choose(songs){
    n++;
    source && source[source.stop ? "stop" : "noteOff"](0);
    xhr.abort();
    xhr.open("GET",songs);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(){
    ac.decodeAudioData(xhr.response,function(buffers){
    start(buffers);
    },function(err){
      console.log(err);
    });
  }
  xhr.send();
}


