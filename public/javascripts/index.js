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
    choose("/media/"+this.title);
  }
}

var xhr = new XMLHttpRequest();
var ac = new window.AudioContext();
function start(buffer){
    var bufferSource = ac.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.connect(ac.destination);
    bufferSource[bufferSource.start?"start":"noteOn"](0);
}

function choose(songs){
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
