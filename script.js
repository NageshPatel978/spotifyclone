let currentsong = new Audio();
let songs;
// Get all songs
async function getsongs(folder) {
    let a = await fetch("http://127.0.0.1:5500/webdsongs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}
// Convert seconds to mm:ss
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}
// Play a song
const playMusic = (track) => {
    currentsong.src = track;
    currentsong.play();
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML =
        decodeURI(track.split("/").pop()).replace(".mp3", "");
    document.querySelector(".songtime").innerHTML =
        "00:00 / 00:00";
};
async function main() {
    songs = await getsongs();
    console.log(songs);
    // Display all songs in playlist
    let songUL = document
        .querySelector(".songlist")
        .getElementsByTagName("ul")[0];
    let listHTML = "";
    for (const song of songs) {
        // Get only filename for displaying
        let fileName = song.split("/").pop();
        let songName = decodeURIComponent(fileName)
            .replace(".mp3", "");
        listHTML += `
            <li data-file="${fileName}">
                <div class="info invert">
                    <div class="invert">
                        ${songName}
                    </div>
                </div>
                <div class="playnow">
                    play now
                </div>
                <img class="invert" src="music.svg" alt="music">
                <img class="invert" src="play.svg" alt="play">
            </li>
        `;
    }
    songUL.innerHTML = listHTML;
    // Add click event to every song
    Array.from(
        songUL.getElementsByTagName("li")
    ).forEach((li) => {
        li.addEventListener("click", () => {
            let fileName = li.dataset.file;
            // Find the full URL from songs array
            let song = songs.find(song =>
                song.endsWith(fileName)
            );
            console.log("Playing:", song);
            playMusic(song);
        });
    });
    // Play  Pause button
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    });
    // Update time and seekbar
    currentsong.addEventListener("timeupdate", () => {
        console.log(
            currentsong.currentTime,
            currentsong.duration
        );
        document.querySelector(".songtime").innerHTML =
            `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;


        document.querySelector(".circle").style.left =
            (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
    // Seekbar
    document.querySelector(".seekbar")
        .addEventListener("click", (e) => {
            let percent =
                (e.offsetX /
                e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left =
                percent + "%";
            currentsong.currentTime =
                (currentsong.duration * percent) / 100;
        });
    // Previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src);
        console.log("Current index:", index);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }
    });
    // Next button
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src);
        console.log("Current index:", index);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        }
    });
    // add a event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
       console.log(e,e.target,e.target.value);
       currentsong.volume=e.target.value/100;

    })
}
main();