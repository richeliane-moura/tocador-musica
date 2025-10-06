// ---------- Seletores ----------
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

// ---------- Playlist ----------
const digno = { songName: 'Digno', artist: 'Eyshila', audio: 'digno.mp3', cover: 'foto1.jpg', liked: false };
const praSempreTeu = { songName: 'Pra Sempre Teu', artist: 'André Valadão', audio: 'pra-sempre-teu.mp3', cover: 'foto2.jpg', liked: false };
const deusDeus = { songName: 'Deus é Deus', artist: 'Delino Marçal', audio: 'deus-e-deus.mp3', cover: 'foto3.jpeg', liked: true };

let originalPlaylist = [digno, praSempreTeu, deusDeus];
let sortedPlaylist = [...originalPlaylist];
let index = 0;
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

// ---------- Carregar likes do LocalStorage ----------
const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
if(savedPlaylist){
    for(let i = 0; i < originalPlaylist.length; i++){
        originalPlaylist[i].liked = savedPlaylist[i]?.liked ?? false;
    }
}

// ---------- Funções principais ----------
function playSong(){
    play.querySelector('.bi').classList.replace('bi-play-circle-fill','bi-pause-circle-fill');
    song.play();
    cover.classList.add('playing');
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.replace('bi-pause-circle-fill','bi-play-circle-fill');
    song.pause();
    cover.classList.remove('playing');
    isPlaying = false;
}

function playPauseDecider(){ isPlaying ? pauseSong() : playSong(); }

function likeButtonRender(){
    const icon = likeButton.querySelector('.bi');
    if(sortedPlaylist[index].liked){
        icon.classList.replace('bi-heart','bi-heart-fill');
        likeButton.classList.add('button-active');
    } else {
        icon.classList.replace('bi-heart-fill','bi-heart');
        likeButton.classList.remove('button-active');
    }
}

function initializeSong(){
    const currentSong = sortedPlaylist[index];
    cover.src = `imagem/${currentSong.cover}`;
    song.src = `musica/${currentSong.audio}`;
    songName.innerText = currentSong.songName;
    bandName.innerText = currentSong.artist;
    likeButtonRender();

    // Barra e tempos zerados
    currentProgress.style.setProperty('--progress', `0%`);
    songTime.innerText = '00:00';
    totalTime.innerText = '00:00';
}

// ---------- Próxima e anterior ----------
function previousSong(){
    index = (index === 0) ? sortedPlaylist.length - 1 : index - 1;
    initializeSong();
    playSong();    
}

function nextSong(){
    index = (index === sortedPlaylist.length - 1) ? 0 : index + 1;
    initializeSong();
    playSong();    
}

// ---------- Barra de progresso ----------
function updateProgress(){
    if(!song.duration) return;
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    if(song.duration){
        song.currentTime = (clickPosition / width) * song.duration;
    }
}

// ---------- Shuffle e Repeat ----------
function shuffleArray(arr){
    let currentIndex = arr.length - 1;
    while(currentIndex > 0){
        const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
        currentIndex--;
    }
}

function shuffleButtonClicked(){
    const currentSong = sortedPlaylist[index];
    if(!isShuffled){
        isShuffled = true;
        let newPlaylist = [...originalPlaylist];
        shuffleArray(newPlaylist);

        // Mantém música atual no início
        const currentIndexInNew = newPlaylist.findIndex(song => song.audio === currentSong.audio);
        [newPlaylist[0], newPlaylist[currentIndexInNew]] = [newPlaylist[currentIndexInNew], newPlaylist[0]];

        sortedPlaylist = newPlaylist;
        index = 0;
        shuffleButton.classList.add('button-active');
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        index = sortedPlaylist.findIndex(song => song.audio === currentSong.audio);
        shuffleButton.classList.remove('button-active');
    }
    initializeSong();
    if(isPlaying) playSong();
}

function repeatButtonClicked(){
    repeatOn = !repeatOn;
    repeatButton.classList.toggle('button-active', repeatOn);
}

function nextOrRepeat(){
    if(repeatOn){
        song.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
}

// ---------- Tempo ----------
function toMMSS(num){
    const min = Math.floor(num/60);
    const sec = Math.floor(num%60);
    return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

function updateTotalTime(){
    if(song.duration) totalTime.innerText = toMMSS(song.duration);
}

// ---------- Curtir ----------
function likeButtonClicked(){
    sortedPlaylist[index].liked = !sortedPlaylist[index].liked;
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

// ---------- Inicialização ----------
initializeSong();

// ---------- Event Listeners ----------
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
