
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const frameSelect = document.getElementById('frameSelect');
const filterSelect = document.getElementById('filterSelect');
const countdown = document.getElementById('countdown');
let photoList = [];

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

filterSelect.addEventListener('change', () => {
  const filter = filterSelect.value;
  if (filter === 'nc') {
    video.style.filter = 'brightness(1.05) contrast(1.1) saturate(1.05)';
  } else if (filter === 'cc') {
    video.style.filter = 'contrast(1.1) saturate(0.75) sepia(0.15)';
  } else {
    video.style.filter = 'none';
  }
});

function startCountdown() {
  let count = 5;
  countdown.innerText = count;
  const interval = setInterval(() => {
    count--;
    countdown.innerText = count;
    if (count === 0) {
      clearInterval(interval);
      countdown.innerText = '';
      takePhoto();
    }
  }, 1000);
}

function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.filter = getComputedStyle(video).filter;
  ctx.drawImage(video, 0, 0);
  photoList.push(canvas.toDataURL());

  if (photoList.length === 3) {
    generateStripImage();
  }
}

function generateStripImage() {
  const stripCanvas = document.createElement('canvas');
  stripCanvas.width = 1080;
  stripCanvas.height = 1920;
  const ctx = stripCanvas.getContext('2d');
  const frame = new Image();
  frame.src = 'frames/' + frameSelect.value;
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, 1080, 1920);
    photoList.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 90, 90 + index * 600, 900, 500);
        if (index === 2) {
          const finalImage = new Image();
          finalImage.src = stripCanvas.toDataURL();
          preview.innerHTML = '';
          preview.appendChild(finalImage);
        }
      };
      img.src = src;
    });
  };
}

function downloadImage() {
  const img = preview.querySelector('img');
  if (!img) return;
  const link = document.createElement('a');
  link.download = '拍貼條.png';
  link.href = img.src;
  link.click();
}
