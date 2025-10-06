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

// Playlist
const digno = {
    songName: 'Digno',
    artist: 'Eyshila',
    audio: 'digno.mp3',
    cover: 'foto1.jpg',
    liked: false,
};

const praSempreTeu = {
    songName: 'Pra Sempre Teu',
    artist: 'André Valadão',
    audio: 'pra-sempre-teu.mp3',
    cover: 'foto2.jpg',
    liked: false,
};

const deusDeus = {
    songName: 'Deus é Deus',
    artist: 'Delino Marçal',
    audio: 'deus-e-deus.mp3',
    cover: 'foto3.jpeg',
    liked: true,
};


let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalplaylist = [digno, praSempreTeu, deusDeus];
let sortedPlaylist = [...originalplaylist];
let index = 0;

// ---------- Funções principais ----------

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    cover.classList.add('playing'); // animação opcional
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    song.pause();
    cover.classList.remove('playing');
    isPlaying = false;
}

function playPauseDecider(){
    isPlaying ? pauseSong() : playSong();
}

function likeButtonRender(){
    if(sortedPlaylist[index].liked){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
}

function initializeSong(){
    cover.src = `imagem/${sortedPlaylist[index].cover}`;
    song.src = `musica/${sortedPlaylist[index].audio}`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();    
}

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

function updateProgress(){
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toMMSS(song.currentTime);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

// ---------- Shuffle e Repeat ----------

function shuffleArray(preshuffleArray){
    let currentIndex = preshuffleArray.length - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        let aux = preshuffleArray[currentIndex];
        preshuffleArray[currentIndex] = preshuffleArray[randomIndex];
        preshuffleArray[randomIndex] = aux;
        currentIndex--;
    }
}

function shuffleButtonClicked() {
    if (!isShuffled) {
        isShuffled = true;

        // Cria uma cópia do original e embaralha
        let newPlaylist = [...originalplaylist];
        shuffleArray(newPlaylist);

        // Mantém a música atual no início da lista para não pular a música atual
        const currentSong = sortedPlaylist[index];
        const currentIndexInNew = newPlaylist.findIndex(song => song.audio === currentSong.audio);
        [newPlaylist[0], newPlaylist[currentIndexInNew]] = [newPlaylist[currentIndexInNew], newPlaylist[0]];

        sortedPlaylist = newPlaylist;
        index = 0; // reset para o início da nova lista embaralhada

        shuffleButton.classList.add('button-active');
    } else {
        isShuffled = false;
        // mantém a música atual na lista original
        const currentSong = sortedPlaylist[index];
        sortedPlaylist = [...originalplaylist];
        index = sortedPlaylist.findIndex(song => song.audio === currentSong.audio);

        shuffleButton.classList.remove('button-active');
    }
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

function toMMSS(originalNumber){
    let min = Math.floor(originalNumber / 60);
    let secs = Math.floor(originalNumber % 60); 
    return `${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTime(){
    totalTime.innerText = toMMSS(song.duration);
}

// ---------- Curtir ----------

function likeButtonClicked(){
    sortedPlaylist[index].liked = !sortedPlaylist[index].liked;
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalplaylist));
}

// ---------- Inicialização ----------

initializeSong();

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
