// ================= 1. 获取网页里的元素 =================
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playlistBtn = document.getElementById('playlist-btn');
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const coverImg = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const lyricsText = document.getElementById('lyrics-text');
const playlistWrapper = document.getElementById('playlist-wrapper');
const playlistList = document.getElementById('playlist-list');

// ================= 2. 建立你的专属歌单 =================
const songs = [
    {
        name: "紫宝的初见 (2026-01-13)",
        file: "test1.mp3",
        cover: "avatar.jpg" 
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
    // 以后继续在这里加...
];

let songIndex = 0;

// ================= 3. 核心功能：带动画加载歌曲 =================
function loadSong(song) {
    // 1. 先让封面和标题变透明、缩小（触发 fade-out）
    coverImg.classList.add('fade-out');
    songTitle.classList.add('fade-out');

    // 2. 等待 400 毫秒（正好是 CSS 动画的时间），等它们消失后，再换图片和文字
    setTimeout(() => {
        songTitle.innerText = '♪ ' + song.name;
        audioPlayer.src = 'music/' + song.file;
        coverImg.src = 'images/' + song.cover;
        lyricsText.innerText = "正在播放：" + song.name + " (歌词功能准备中...)";
        
        // 3. 换好内容后，去掉 fade-out，它们就会丝滑地重新出现
        coverImg.classList.remove('fade-out');
        songTitle.classList.remove('fade-out');
    }, 400); 
}

// 网页一打开，默认加载第一首歌（不需要动画）
songTitle.innerText = '♪ ' + songs[songIndex].name;
audioPlayer.src = 'music/' + songs[songIndex].file;
coverImg.src = 'images/' + songs[songIndex].cover;

// ================= 4. 控制播放、暂停、上一首、下一首 =================
function playMusic() {
    // 稍微延迟一点播放，配合视觉动画
    setTimeout(() => {
        audioPlayer.play();
    }, 400);
    playBtn.innerText = '⏸ 暂停';
}

function pauseMusic() {
    audioPlayer.pause();
    playBtn.innerText = '▶ 播放';
}

function prevMusic() {
    songIndex--;
    if (songIndex < 0) { songIndex = songs.length - 1; }
    loadSong(songs[songIndex]);
    if (playBtn.innerText.includes('暂停')) { playMusic(); }
}

function nextMusic() {
    songIndex++;
    if (songIndex > songs.length - 1) { songIndex = 0; }
    loadSong(songs[songIndex]);
    if (playBtn.innerText.includes('暂停')) { playMusic(); }
}

playBtn.addEventListener('click', () => {
    if (playBtn.innerText.includes('播放')) {
        audioPlayer.play();
        playBtn.innerText = '⏸ 暂停';
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

// ================= 6. 歌单列表自动生成与丝滑展开 =================
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

// 点击“展开歌单”按钮，使用 max-height 实现丝滑抽屉效果
playlistBtn.addEventListener('click', () => {
    if (playlistWrapper.style.maxHeight && playlistWrapper.style.maxHeight !== '0px') {
        playlistWrapper.style.maxHeight = '0'; // 收起
        playlistBtn.innerText = '🎵 展开歌单';
    } else {
        // 300px 是给歌单预留的高度，如果歌单太长可以在这里加大数值
        playlistWrapper.style.maxHeight = '300px'; // 展开
        playlistBtn.innerText = '🎵 收起歌单';
    }
});
