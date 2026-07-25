async function getsongs() {
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

async function main() {
    let songs = await getsongs();

    console.log(songs);

    let songUL = document
        .querySelector(".songlist")
        .getElementsByTagName("ul")[0];

    for (const song of songs) {

        // Extract only the song name
        let songName = decodeURIComponent(song.split("/").pop())
            .replace(".mp3", "");

        songUL.innerHTML += `
        
  <ul>
                    <li>
                        <div class="info invert">
                            <div class="invert">${songName}</div>
                            <div class="invert">nagesh</div>
                        </div>
                        <div class="playnow">play now</div>
                    
                        <img class="invert" src="music.svg" alt="music">
                            <img class="invert" src="play.svg" alt="play">
                        
                    </li>
                  </ul>
                
        `;
    }

    var audio = new Audio(songs[0]);
    // audio.play();
}

main();