const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("textInput");
const replay = document.getElementById("replay");
const displayText = document.getElementById("displayText");
const displayImage = document.getElementById("displayImage");
let text = "";
replay.addEventListener("click", () => {
  reset();
});
input.addEventListener("input", (e) => {
  text = e.target.value;
  showImage = false;
  reset();
});

displayText.addEventListener("click", () => {
  text = input.value;
  showImage = false;
  reset();
});
displayImage.addEventListener("click", () => {
  showImage = true;
  loadImage();
  reset();
});

function reset() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = [];
  displayArt();
}
///////////////////////////////////////////////////////////////////
var img = new Image();
async function loadImage() {
  const res = await fetch("https://picsum.photos/100");
  const blob = await res.blob();
  const url = await window.URL.createObjectURL(blob);
  img.src = url;
}
loadImage();
// img.src = "images/nike.jpg";
var showImage = true;
var particles = [];
img.onload = displayArt();

function displayArt() {
  drawImg();
  getData();
  startAnimation();
}
function drawImg() {
  if (showImage) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.font = "50px Arial";
    ctx.fillStyle = "grey";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
}
function getData() {
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < data.height; y++) {
    for (var x = 0; x < data.width; x++) {
      var index = y * 4 * data.width + x * 4;
      if (data.data[index + 3] > 127) {
        const particle = {
          targetX: x,
          targetY: y,
          currentX: canvas.width / 2,
          currentY: canvas.height + 10,
          speed: Math.random() * 1,
          color:
            "rgb(" +
            data.data[index] +
            "," +
            data.data[index + 1] +
            "," +
            data.data[index + 2] +
            ")",
        };
        particles.push(particle);
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.currentX, particle.currentY, 1, 1);
  });
  canStop || particles.length === 0
    ? console.log("animation done")
    : requestAnimationFrame(animate);
}
var canStop = false;
function stopAnimation() {
  canStop = true;
}
var timer;
function startAnimation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canStop = false;
  clearTimeout(timer);
  particles.forEach((particle) => {
    const startDelay = particle.targetY / 30 - particles[0].targetY / 30;
    TweenMax.to(particle, particle.speed, {
      currentX: particle.targetX,
      currentY: particle.targetY,
      delay: startDelay,
      ease: Power2.easeOut,
    });
    if (particle === particles[particles.length - 1]) {
      timer = setTimeout(stopAnimation, startDelay * 1000 + 1000);
    }
  });
  animate();
}
