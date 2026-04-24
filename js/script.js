// 获取 HTML 里的元素
const playBtn = document.getElementById('play-btn');
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');

// 记录当前是否在播放
let isPlaying = false;

// 给播放按钮添加点击事件
playBtn.addEventListener('click', function() {
    if (isPlaying) {
        // 如果正在播放，就暂停
        audioPlayer.pause();
        playBtn.innerText = '播放';
        songTitle.innerText = '♪ 已暂停';
        isPlaying = false;
    } else {
        // 如果没有播放，就开始播放
        audioPlayer.play();
        playBtn.innerText = '暂停';
        songTitle.innerText = '♪ 正在播放：紫宝的歌';
        isPlaying = true;
    }
});
