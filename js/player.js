import playList from "./playList.js";

const audio = document.querySelector("audio");
const player = document.querySelector(".player");
const playPrev = document.querySelector(".play-prev");
const play = document.querySelector(".play");
const playNext = document.querySelector(".play-next");
const playListContainer = document.querySelector(".play-list");
const timeAudio = document.querySelector(".audiotime");
const audioLength = document.querySelector(".audio-track");
const audioRunTime = document.querySelector(".current-time-run");
const audioShowTime = document.querySelector(".current-time-show");
const CurrentAudio = document.querySelector(".current-audio");
const volumeLine = document.querySelector(".volume-line");
const volumeIcon = document.querySelector(".volume-icon");
const volumeMute = document.querySelector(".volume-mute");

let isPlay = false;
let playNum = 0;
let arrPlayList = playListContainer.childNodes;

playList.forEach((el) => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.innerHTML = `<span class='play-title'>${el.title}</span><span class='time-run'>${el.duration}</span> `;
  playListContainer.append(li);
});

function playPrevAudio() {
  playNum == 0 ? (playNum = playList.length - 1) : playNum--;
  toggleAudio();
}

function playNextAudio() {
  playNum == playList.length - 1 ? (playNum = 0) : playNum++;
  toggleAudio();
}

function togglePlay() {
  play.classList.toggle("pause");
  isPlay = !isPlay;
  isPlay ? audio.play() : audio.pause();
}

function toggleAudio() {
  isPlay = true;
  play.classList.add("pause");
  playListContainer.childNodes[playNum].classList.add("item-active", "paused");
  CurrentAudio.textContent = playList[playNum].title;
  audioShowTime.textContent = playList[playNum].duration;
  audio.src = playList[playNum].src;
  audio.play();
}

arrPlayList.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    playNum = index;
    if (e.currentTarget.classList.contains("item-active")) {
      item.classList.remove("paused");
      item.classList.remove("item-active");
      play.classList.remove("pause");
      isPlay = false;
      audio.pause();
    } else {
      for (item of arrPlayList) {
        item.classList.remove("item-active");
        item.classList.remove("paused");
      }
      item.classList.add("paused");
      item.classList.add("item-active");
      play.classList.add("pause");
      toggleAudio();
    }
  });
});

playPrev.addEventListener("click", playPrevAudio);
playNext.addEventListener("click", playNextAudio);
play.addEventListener("click", togglePlay);

function changeAudioTime() {
  audioLength.addEventListener(
    "mousedown",
    (e) => {
      slideDurationLine(e);
    },
    false
  );
  audioLength.addEventListener("mousemove", (e) => {
    if (e.buttons == 1) {
      slideDurationLine(e);
    }
  });
  audioLength.addEventListener("mouseup", (e) => {
    slideDurationLine(e);
  });
}

function slideDurationLine(e) {
  const audioWidth = window.getComputedStyle(audioLength).width;
  const newLength = (e.offsetX / parseInt(audioWidth)) * audio.duration;
  audio.currentTime = newLength;
  if (newLength == audioWidth) playNextAudio();
}

changeAudioTime();

audio.addEventListener("timeupdate", () => {
  const audioWidth = window.getComputedStyle(audioLength).width;
  const audioTime = Math.floor(audio.currentTime);
  const audioDuration = Math.floor(audio.duration);
  timeAudio.style.width = (audioTime / audioDuration) * 100 + "%";
  audioRunTime.textContent = formatTime(audioTime);
  audioShowTime.textContent = formatTime(audioDuration);

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
    return formattedTime;
  }

  audio.addEventListener("ended", () => {
    playNum == playList.length - 1 ? (playNum = 0) : playNum++;
    toggleAudio();
  });

  audio.addEventListener("loadedmetadata", () => {
    const audioDuration = Math.floor(audio.duration);
    audioShowTime.textContent = formatTime(audioDuration);
  });

  document.addEventListener("DOMContentLoaded", () => {
    toggleAudio();
  });
});



let currentVolume = 0.5;
audio.volume = currentVolume;

volumeLine.addEventListener("input", () => {
  currentVolume = parseFloat(volumeLine.value);
  audio.volume = currentVolume;
  updateVolumeIcon(currentVolume);
});

volumeMute.addEventListener("click", () => {
  audio.muted = !audio.muted;
  updateVolumeIcon(currentVolume);
});

function updateVolumeIcon(volume) {
  if (volume === 0 || audio.muted) {
    volumeIcon.classList.remove("fa-volume-up");
    volumeIcon.classList.add("fa-volume-mute");
  } else if (volume > 0.5) {
    volumeIcon.classList.remove("fa-volume-down", "fa-volume-mute");
    volumeIcon.classList.add("fa-volume-up");
  } else {
    volumeIcon.classList.remove("fa-volume-up", "fa-volume-mute");
    volumeIcon.classList.add("fa-volume-down");
  }
}

function changeVolume() {
    const volumeLine = document.querySelector(".volume-line");
  
    volumeLine.addEventListener("input", () => {
      const volumeValue = parseFloat(volumeLine.value);
      const volume = volumeValue >= 0 && volumeValue <= 1 ? volumeValue : volumeValue < 0 ? 0 : 1;
      audio.volume = volume;
    });
  }
  
  volumeLine.addEventListener("input", changeVolume);