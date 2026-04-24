const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const modeBtn = document.getElementById('mode-btn');
const playlistBtn = document.getElementById('playlist-btn');
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const coverImg = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const playlistWrapper = document.getElementById('playlist-wrapper');
const playlistList = document.getElementById('playlist-list');

const songs = [
    {
        name: "紫宝的初见 (2026-01-13)",
        file: "test1.mp3",
        cover: "avatar.jpg"
    },
    {
        name: "中国话",
        file: "中国话.mp3", 
        cover: "中国话.jpg"
    }
];

let songIndex = 0;
let playMode = 0; 

const modeIcons = [
    '<i class="fa-solid fa-repeat"></i> 列表循环',
    '<i class="fa-solid fa-shuffle"></i> 随机播放',
    '<i class="fa-solid fa-rotate-right"></i> 单曲循环'
];

function loadSong(song) {
    coverImg.classList.add('fade-out');
    songTitle.classList.add('fade-out');

    setTimeout(() => {
        songTitle.innerText = song.name;
        audioPlayer.src = 'music/' + song.file;
        coverImg.src = 'images/' + song.cover;
        
        coverImg.classList.remove('fade-out');
        songTitle.classList.remove('fade-out');
    }, 400); 
}

songTitle.innerText = songs[songIndex].name;
audioPlayer.src = 'music/' + songs[songIndex].file;
coverImg.src = 'images/' + songs[songIndex].cover;

function playMusic() {
    setTimeout(() => { audioPlayer.play(); }, 400);
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> 暂停';
    coverImg.classList.add('spin');
    coverImg.classList.remove('paused');
}

function pauseMusic() {
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> 播放';
    coverImg.classList.add('paused');
}

function nextMusic() {
    if (playMode === 1) {
        let randomIndex = Math.floor(Math.random() * songs.length);
        while(randomIndex === songIndex && songs.length > 1) {
            randomIndex = Math.floor(Math.random() * songs.length);
        }
        songIndex = randomIndex;
    } else if (playMode === 2) {
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) { songIndex = 0; }
    }
    
    loadSong(songs[songIndex]);
    if (playBtn.innerText.includes('暂停')) { playMusic(); }
}

function prevMusic() {
    if (playMode === 1) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex--;
        if (songIndex < 0) { songIndex = songs.length - 1; }
    }
    loadSong(songs[songIndex]);
    if (playBtn.innerText.includes('暂停')) { playMusic(); }
}

playBtn.addEventListener('click', () => {
    if (playBtn.innerText.includes('播放')) { playMusic(); } else { pauseMusic(); }
});
prevBtn.addEventListener('click', prevMusic);
nextBtn.addEventListener('click', nextMusic);

modeBtn.addEventListener('click', () => {
    playMode = (playMode + 1) % 3;
    modeBtn.innerHTML = modeIcons[playMode];
});

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
}
audioPlayer.addEventListener('timeupdate', updateProgress);

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}
progressContainer.addEventListener('click', setProgress);
audioPlayer.addEventListener('ended', nextMusic);

songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.innerText = (index + 1) + ". " + song.name;
    
    li.addEventListener('click', () => {
        if (songIndex !== index) {
            songIndex = index;
            loadSong(songs[songIndex]);
            playMusic();
        }
    });
    playlistList.appendChild(li);
});

playlistBtn.addEventListener('click', () => {
    if (playlistWrapper.style.maxHeight && playlistWrapper.style.maxHeight !== '0px') {
        playlistWrapper.style.maxHeight = '0';
        playlistBtn.innerHTML = '<i class="fa-solid fa-list-ul"></i> 展开歌单'; 
    } else {
        playlistWrapper.style.maxHeight = '300px';
        playlistBtn.innerHTML = '<i class="fa-solid fa-list-ul"></i> 收起歌单'; 
    }
});
