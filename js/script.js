// ================= 1. 获取网页里的元素 =================
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const coverImg = document.getElementById('cover');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const lyricsText = document.getElementById('lyrics-text');

// ================= 2. 建立你的专属歌单 =================
// 你的 100 多首歌都要按照这个格式加进这里面
const songs = [
    {
        name: "紫宝的初见 (2026-01-13)", // 网页上显示的歌曲名
        file: "test1.mp3",              // music文件夹里对应的mp3文件名
        cover: "avatar.png"             // images文件夹里对应的封面图（可以每首歌不一样）
    },
    {
        name: "第二首超级好听的歌",
        file: "test2.mp3",
        cover: "avatar.png"
    },
    {
        name: "第三首绝赞神曲",
        file: "test3.mp3",
        cover: "avatar.png"
    }
    // 继续往下加，注意除了最后一首歌，每首歌的大括号 } 后面都要有逗号 ,
];

// 记录当前播放的是第几首歌（0代表第一首）
let songIndex = 0;

// ================= 3. 核心功能：加载歌曲 =================
function loadSong(song) {
    // 更新标题、音乐文件路径、封面图路径
    songTitle.innerText = '♪ ' + song.name;
    audioPlayer.src = 'music/' + song.file;
    coverImg.src = 'images/' + song.cover;
    // 歌词部分比较复杂，目前先显示提示文字
    lyricsText.innerText = "正在播放：" + song.name + " (歌词功能准备中...)";
}

// 网页一打开，默认加载第一首歌
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
    songIndex--; // 序号减一
    if (songIndex < 0) {
        songIndex = songs.length - 1; // 如果是第一首，跳回最后一首
    }
    loadSong(songs[songIndex]);
    playMusic();
}

function nextMusic() {
    songIndex++; // 序号加一
    if (songIndex > songs.length - 1) {
        songIndex = 0; // 如果是最后一首，跳回第一首
    }
    loadSong(songs[songIndex]);
    playMusic();
}

// 给按钮绑定点击事件
playBtn.addEventListener('click', () => {
    // 检查当前按钮文字，如果是“播放”就执行播放代码，否则暂停
    if (playBtn.innerText === '播放') {
        playMusic();
    } else {
        pauseMusic();
    }
});
prevBtn.addEventListener('click', prevMusic);
nextBtn.addEventListener('click', nextMusic);

// ================= 5. 控制进度条 =================
// 随着音乐播放，更新进度条宽度
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
}
audioPlayer.addEventListener('timeupdate', updateProgress);

// 点击进度条，可以跳转音乐进度
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}
progressContainer.addEventListener('click', setProgress);

// 音乐播放完毕后，自动播放下一首
audioPlayer.addEventListener('ended', nextMusic);
