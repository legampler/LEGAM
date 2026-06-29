document.addEventListener('DOMContentLoaded', () => {
    // --- Music Player Logic (Lokal MP3) ---
    const audio = document.getElementById('audioElement');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const timeDisplay = document.getElementById('timeDisplay');
    const noteIcon = document.querySelector('.note-icon');

    let isPlaying = false;

    // Toggle Play/Pause
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.log("Audio play blocked by browser:", e));
        }
    });

    // Update UI on Play
    audio.addEventListener('play', () => {
        isPlaying = true;
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        noteIcon.classList.add('playing');
    });

    // Update UI on Pause
    audio.addEventListener('pause', () => {
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        noteIcon.classList.remove('playing');
    });

    // Format time helper (seconds to m:ss)
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Update Progress Bar & Time
    audio.addEventListener('timeupdate', () => {
        const { duration, currentTime } = audio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            timeDisplay.innerText = formatTime(currentTime);
        }
    });

    // Click on progress bar to seek
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    });
    
    // Reset when audio ends
    audio.addEventListener('ended', () => {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        progressBar.style.width = `0%`;
        timeDisplay.innerText = "0:00";
        noteIcon.classList.remove('playing');
        isPlaying = false;
    });

    // --- Volume Control Logic ---
    const volumeSlider = document.getElementById('volumeSlider');
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');
    let previousVolume = 1;

    // Change volume via slider
    volumeSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        audio.volume = value;
        
        if (value === 0) {
            muteIcon.className = 'fas fa-volume-mute';
        } else if (value < 0.5) {
            muteIcon.className = 'fas fa-volume-down';
        } else {
            muteIcon.className = 'fas fa-volume-up';
        }
    });

    // Toggle mute/unmute
    muteBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            previousVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
            muteIcon.className = 'fas fa-volume-mute';
        } else {
            audio.volume = previousVolume > 0 ? previousVolume : 1;
            volumeSlider.value = audio.volume;
            if (audio.volume < 0.5) {
                muteIcon.className = 'fas fa-volume-down';
            } else {
                muteIcon.className = 'fas fa-volume-up';
            }
        }
    });
});
