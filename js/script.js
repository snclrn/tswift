let progressSlider = document.querySelector(".progress .slider"),
  musicCurrentTime = document.querySelector(".time .current"),
  musicDurationTime = document.querySelector(".time .duration"),
  goForwardBtn = document.querySelector(".go .forward"),
  goBackwardBtn = document.querySelector(".go .backward"),
  toggleMusicButton = document.querySelector(".toggle-music-btn"),
  toggleButtonIcon = document.querySelector(".toggle-music-btn img");
let currentTime = 0;
let currentTimeInterval;
let player;

function onYouTubeIframeAPIReady() {
  // function to change music toggler button icon
  const toggleButton = (play) => {
    const icon = play ? "./images/stop.svg" : "./images/play.svg";
    toggleButtonIcon.src = icon;
  };

  // function for slider
  const handleSliderChange = (e) => {
    player.pauseVideo();
    updateSlider(e.target);
    musicCurrentTime.innerText = formatTime(e.target.value);
    toggleButton(false);
    clearInterval(currentTimeInterval);
  };

  const updateSlider = (target) => {
    if (target.type !== "range") {
      target = document.getElementById("range");
    }
    const min = target.min;
    const max = target.max;
    const val = target.value;

    target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
  };

  const handleSliderFunction = (e) => {
    player.seekTo(e.target.value);
    player.playVideo();
    toggleButton(true);
    musicCurrentTime.innerText = formatTime(e.target.value);
    currentTime = e.target.value;
  };

  toggleMusicButton.addEventListener("click", () => {
    if (
      player.getPlayerState() === YT.PlayerState.PLAYING ||
      player.getPlayerState() === YT.PlayerState.BUFFERING
    ) {
      player.pauseVideo();
      toggleButton(false);
      clearInterval(currentTimeInterval);
    } else {
      if (player.getPlayerState() === YT.PlayerState.ENDED) {
        progressSlider.value = 0;
        currentTime = 0;
      }

      player.playVideo();
    }
  });

  progressSlider.addEventListener("input", handleSliderChange);
  progressSlider.addEventListener("change", handleSliderFunction);

  goForwardBtn.addEventListener("click", (e) => {
    player.seekTo(player.getCurrentTime() + 10);
    player.playVideo();
  });

  goBackwardBtn.addEventListener("click", (e) => {
    player.seekTo(player.getCurrentTime() - 10);
    player.playVideo();
  });

  player = new YT.Player("player", {
    height: "0",
    width: "0",
    videoId: "5CbWqM0K2v8",
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: (e) => {
        player.setPlaybackQuality("small");
        toggleButton(player.getPlayerState() !== YT.PlayerState.CUED);
        progressSlider.max = player.getDuration() - 1;
        let duration = formatTime(player.getDuration() - 1);
        musicDurationTime.innerText = duration;
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) {
          toggleButton(false);
          clearInterval(currentTimeInterval);
        }

        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
          toggleButton(true);
          currentTimeInterval = setInterval(() => {
            musicCurrentTime.innerText = formatTime(
              player.playerInfo.currentTime
            );
            progressSlider.value = player.playerInfo.currentTime;
            updateSlider(progressSlider);
          }, 100);
        }
      },
    },
  });
}

function formatTime(duration) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
