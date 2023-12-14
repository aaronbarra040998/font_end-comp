const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
document.addEventListener("DOMContentLoaded", function() {
    var videoBackground = document.getElementById('video-background');
    var video = document.createElement('video');

    video.src = '../assets/video/vid_1.mp4';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;

    videoBackground.appendChild(video);
});
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
});