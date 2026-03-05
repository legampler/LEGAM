// TEXT TYPING
const texts = ["Content Creator","Gamers","Streamer"];
let i = 0;

function typeText(text, element){
  element.textContent="";
  let j = 0;

  let typing = setInterval(()=>{
    element.textContent += text[j];
    j++;

    if(j === text.length){
      clearInterval(typing);
    }

  },100);
}

function loopTyping(){
  const el = document.getElementById("typing");
  typeText(texts[i], el);
  i = (i + 1) % texts.length;
}

setInterval(loopTyping,3000);
loopTyping();


// MUSIC PLAYER
const audio = document.getElementById("bg-music");
const playBtn = document.getElementById("play-btn");
const stopBtn = document.getElementById("stop-btn");
const volumeSlider = document.getElementById("volume");

let audioCtx;
let analyser;
let source;

playBtn.addEventListener("click", () => {
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    drawSpectrum();
  }

  audioCtx.resume();
  audio.play();
});

stopBtn.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});


// SPECTRUM VISUALIZER
const canvas = document.getElementById("spectrum");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.parentElement.offsetWidth - 20;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawSpectrum(){
  requestAnimationFrame(drawSpectrum);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for(let i = 0; i < bufferLength; i++){
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = "#ff9800";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
