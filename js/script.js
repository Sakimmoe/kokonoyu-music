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

// ================= 1. R2 存储配置 =================
const R2_BASE_URL = "https://res.kokonoyu.com/"; 

// ================= 2. 你的歌单 =================
const songs = [
    { name: "中国话", file: "中国话.mp3", cover: "中国话.jpg" },
    { name: "杀破狼", file: "杀破狼.mp3", cover: "杀破狼.jpg" },
    { name: "恋は戦争", file: "恋は戦争.mp3", cover: "恋は戦争.jpg" },
    { name: "想你的365天", file: "想你的365天.mp3", cover: "想你的365天.jpg" },
    { name: "Uninstall", file: "Uninstall.mp3", cover: "Uninstall.jpg" },
    { name: "⚡虚 拟 萨 日 朗！！！⚡", file: "⚡虚 拟 萨 日 朗！！！⚡.mp3", cover: "⚡虚 拟 萨 日 朗！！！⚡.jpg" },
    { name: "青藏高原", file: "青藏高原.mp3", cover: "青藏高原.jpg" },
    { name: "仙剑问情", file: "仙剑问情.mp3", cover: "仙剑问情.jpg" },
    { name: "热爱105°C的拼音", file: "热爱105°C的拼音.mp3", cover: "热爱105°C的拼音.jpg" },
    { name: "1 2 fan club", file: "1 2 fan club.mp3", cover: "1 2 fan club.jpg" },
    { name: "梦想歌", file: "梦想歌.mp3", cover: "梦想歌.jpg" }
];

let songIndex = 0;
let playMode = 0; 
const modeIcons = [
    '<i class="fa-solid fa-repeat"></i> 列表循环',
    '<i class="fa-solid fa-shuffle"></i> 随机播放',
    '<i class="fa-solid fa-rotate-right"></i> 单曲循环'
];

// ================= 3. 加载逻辑 (增加文件夹路径) =================
function loadSong(song) {
    coverImg.classList.add('fade-out');
    songTitle.classList.add('fade-out');

    setTimeout(() => {
        songTitle.innerText = song.name;
        
        // 拼接路径：R2地址 + 文件夹名 + 文件名
        audioPlayer.src = R2_BASE_URL + "music/" + song.file;
        coverImg.src = R2_BASE_URL + "images/" + song.cover;
        
        coverImg.classList.remove('fade-out');
        songTitle.classList.remove('fade-out');
    }, 400); 
}

// 初始加载第一首歌
songTitle.innerText = songs[songIndex].name;
audioPlayer.src = R2_BASE_URL + "music/" + songs[songIndex].file;
coverImg.src = R2_BASE_URL + "images/" + songs[songIndex].cover;

// ================= 4. 播放控制 =================
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
        // 单曲循环不动序号
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) { songIndex = 0; }
    }
    loadSong(songs[songIndex]);
    if (playBtn.innerHTML.includes('暂停')) { playMusic(); }
}

function prevMusic() {
    if (playMode === 1) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex--;
        if (songIndex < 0) { songIndex = songs.length - 1; }
    }
    loadSong(songs[songIndex]);
    if (playBtn.innerHTML.includes('暂停')) { playMusic(); }
}

playBtn.addEventListener('click', () => {
    if (playBtn.innerHTML.includes('播放')) { playMusic(); } else { pauseMusic(); }
});
prevBtn.addEventListener('click', prevMusic);
nextBtn.addEventListener('click', nextMusic);

modeBtn.addEventListener('click', () => {
    playMode = (playMode + 1) % 3;
    modeBtn.innerHTML = modeIcons[playMode];
});

// ================= 5. 进度条逻辑 =================
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

// ================= 6. 自动生成歌单列表 =================
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
