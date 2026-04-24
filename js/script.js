// ================= 1. 获取网页里的元素 =================
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playlistBtn = document.getElementById('playlist-btn'); // 获取歌单按钮
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const coverImg = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const lyricsText = document.getElementById('lyrics-text');
const playlistBox = document.getElementById('playlist-box'); // 获取歌单外框
const playlistList = document.getElementById('playlist-list'); // 获取歌单列表

// ================= 2. 建立你的专属歌单 =================
const songs = [
    {
        name: "紫宝的初见 (2026-01-13)",
        file: "test1.mp3",
        cover: "avatar.jpg" // 【已修复】这里改回了你的 avatar.jpg
    },
    {
        name: "第二首超级好听的歌",
        file: "test2.mp3",
        cover: "avatar.jpg"
    },
    {
        name: "第三首绝赞神曲",
        file: "test3.mp3",
        cover: "avatar.jpg"
    }
    // 以后只要按照这个格式往下复制增加就行，100首也没问题！
];

let songIndex = 0;

// ================= 3. 核心功能：加载歌曲 =================
function loadSong(song) {
    songTitle.innerText = '♪ ' + song.name;
    audioPlayer.src = 'music/' + song.file;
    coverImg.src = 'images/' + song.cover;
    lyricsText.innerText = "正在播放：" + song.name + " (歌词功能准备中...)";
}

loadSong(songs[songIndex]);

// ================= 4. 控制播放、暂停、上一首、下一首 =================
function playMusic() {
    audioPlayer.play();
    playBtn.innerText = '暂停';
}

function pauseMusic() {
    audioPlayer.pause();
    playBtn.innerText = '播放';
}

function prevMusic() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playMusic();
}

function nextMusic() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playMusic();
}

playBtn.addEventListener('click', () => {
    if (playBtn.innerText === '播放') {
        playMusic();
    } else {
        pauseMusic();
    }
});
prevBtn.addEventListener('click', prevMusic);
nextBtn.addEventListener('click', nextMusic);

// ================= 5. 控制进度条 =================
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

// ================= 6. 新增：歌单列表自动生成与展开控制 =================

// 循环读取你的歌单，自动把每一首歌变成列表里的一行
songs.forEach((song, index) => {
    const li = document.createElement('li');
    // 列表显示：序号 + 歌名
    li.innerText = (index + 1) + ". " + song.name;
    
    // 给列表里的每一首歌加上点击功能：点哪首就放哪首
    li.addEventListener('click', () => {
        songIndex = index;
        loadSong(songs[songIndex]);
        playMusic();
    });
    
    // 把这行歌塞进列表里
    playlistList.appendChild(li);
});

// 点击“≡ 歌单”按钮，切换显示/隐藏状态
playlistBtn.addEventListener('click', () => {
    if (playlistBox.style.display === 'none') {
        playlistBox.style.display = 'block'; // 显示
    } else {
        playlistBox.style.display = 'none';  // 隐藏
    }
});
