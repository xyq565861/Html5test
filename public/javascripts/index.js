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
var source = null;
var n = 0;
gainNode.connect(ac.destination);
$("#difficult")[0].onmousemove = function(){
	changeVolume(this.value/this.max);
}
$("#difficult")[0].onmousemove();
function changeVolume(soundvalue){
	gainNode.gain.value = soundvalue * soundvalue;

}

function start(buffer){    
    var bufferSource = ac.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(gainNode);
    if(n > 1){
    n--;
    return;
     }
    bufferSource[bufferSource.start?"start":"noteOn"](0);
    source = bufferSource;
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


