


let currentSong = new Audio();

let songs;

let currFolder;

function formatTime(seconds) {

  if(isNaN(seconds) || seconds < 0 ){

    return "00:00"
    

  }

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds as two-digit numbers (e.g., 03, 07)
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  // Return the formatted string as MM:SS
  return `${formattedMinutes}:${formattedSeconds}`;
}





async function getSongs(folder) {

  currFolder = folder;




  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);

  //While hosting you will remove the 127.00

  let response = await a.text();

  

  let div = document.createElement("div");

  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");


  

  songs = [];

  //Get the list of all the songs
  

  for (const element of anchors) {
    

    if (element.href.endsWith("mp3")) {

      songs.push(element.href.split(`/${folder}/`)[1]);

    }
  }

    //Show all the songs in the playlist

    let songListUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songListUL.innerHTML = "";
  

    for (const song of songs) {
  
      
      
      let song2 = song.replaceAll("%20", " " );
  
     
      
  
      let song3 = song2.replaceAll(".mp3", "");
  
      let song4 = song3.replaceAll("_", " ");
  
      if (song4.length > 20) {
        
        song4 =  song4.slice(0,20)  + "...";
   
      } 
      
      
      songListUL.innerHTML = songListUL.innerHTML + ` 
      
      <li>
                  <div class="musicInfo">
  
                <img class="invert" src="/pics/music.svg" alt="music">
                  
                <div class="info">
  
                  <div class="">${song4}</div>
                  <div class="">Ayush</div>
  
                </div>   
  
               </div>
  
                  <div class="playNow">
                    
                    <span>Play now</span>
                    <img class="invert" src="/pics/play.svg" alt="play">
  
                  </div>
  
                  
  
                </li> `;
      
   
  
    }
  
    
    
  
  
    
    
  
  
  let i = 0;
  //Attach an event listener to each song
  
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach( a => {
  
    let link = songs[i];
  
    i++;
  
    a.addEventListener("click",() => {
  
      let eventCall = (link)=>{
  
        
        playMusic(a.querySelector(".info").firstElementChild.innerHTML,link);
      
      }
     eventCall(link);
    
    }
    )
    
    
  
  }
  )
  
  


}


const playMusic = (songName,track,pause = false)=>{

    currentSong.src =  `/${currFolder}/` + track;


    if(!pause){

    currentSong.play();
    play.src = "/pics/pause.svg"
    }
    
    
    document.querySelector(".songInfo").innerHTML = songName;

    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";


  

}

//Create Cards dynamically

async function displayAlbums() {
  
  let a = await fetch(`http://127.0.0.1:5500/songs/`);

  let response = await a.text();

  let div = document.createElement("div");

  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");

 let array =  Array.from(anchors);

 for (let i = 0; i < array.length; i++) {

     const e = array[i];

     if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
     
      
     let folder = e.href.split("/").slice(-1)[0];

     //Get the metadata of each folder
      
     let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);

     let response = await a.json();



     let cardContainer = document.querySelector(".cardContainer");
     
     cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder = "${folder}" class="card ">

              <div class="play">

               

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" >
                 
                  <circle cx="50" cy="50" r="50" fill="#1ed760"></circle>
             
                  <polygon points="40,30 70,50 40,70" fill="black"></polygon>

 
                </svg>
              

                 
              </div>
              
              <img src="/songs/${folder}/cover.jpg"  alt="cover" class="rounded">

              <h2>${response.title}</h2>

              <p>${response.description}</p>


            </div>` 
     


    }


 }
  

    //Load the playlist whenever card is clicked

    let cardArr = Array.from(document.getElementsByClassName("card"));

    cardArr.forEach( e => {
       
      e.addEventListener("click",async item=> {
        
        await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        
        playMusic(document.querySelector(".songList").getElementsByTagName("li")[0].querySelector(".info").firstElementChild.innerHTML,songs[0]);
        
       
        
  
      }
      )
  
  
    }
    )

  
  

}


async function main() { 

  

  

   await getSongs("songs/ncs");

   //On loading first song is inserted

   playMusic(document.querySelector(".songList").getElementsByTagName("li")[0].querySelector(".info").firstElementChild.innerHTML,songs[0],true);


   //Display all albums in page

  await displayAlbums();

   


//Attach an event listener to play, pause and next

  let play = document.getElementById("play");

  play.addEventListener("click",() => {
   
  if (currentSong.paused) {
    currentSong.play();
    play.src = "/pics/pause.svg"
  } else {
    currentSong.pause();
    play.src = "/pics/play.svg"
  } 

 }
 )

  
 //Listen for timeupdate event

  currentSong.addEventListener("timeupdate", () => {
    
    // console.log(currentSong.currentTime, currentSong.duration);
     
    document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`

    
    let percent = (currentSong.currentTime / currentSong.duration) *100 ;


    if (percent > 99 ) {
      document.querySelector(".circle").style.left = "99%"
      
    } else {
      document.querySelector(".circle").style.left = percent + "%";
    }

    if(currentSong.currentTime==currentSong.duration){

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    let takeList = document.querySelector(".songList").getElementsByTagName("ul")[0].children;

    let takeArr = Array.from(takeList);

    
    if( (index + 1) < songs.length && (index + 1 > 0 )){


         let songName = takeArr[index+1] ;
      
      
      playMusic(songName.querySelector(".info").firstElementChild.innerHTML,songs[index + 1]);

      
 
     

    }else{

      let play = document.getElementById("play");
      play.src = "/pics/play.svg"




    }


    }

  }
  )


  //Add a event listener to seekbar

  document.querySelector(".seekBar").addEventListener("click",(e) => {

    let percent = (e.offsetX / document.querySelector(".seekBar").getBoundingClientRect().width) * 100 ;
   

    if (percent > 99 ) {
      document.querySelector(".circle").style.left =  "99%";
      
      
    } else {
      document.querySelector(".circle").style.left = percent+ "%";
      
    }

    currentSong.currentTime = (percent  * currentSong.duration)/100;

     
   
  }
  )


  //Add an event listener for hamburger icon

  document.querySelector(".hamburger").addEventListener("click", () => {
    
    document.querySelector(".leftDiv").style.left = "0%";


  }
  )
  

  //Add an event listener for cross icon

  document.querySelector(".cross").addEventListener("click", () => {
    
    document.querySelector(".leftDiv").style.left = "-150%";


  }
  )


  //Add an event listener to previous 

  let previous = document.getElementById("previous");


  previous.addEventListener("click", () => {
    
    
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    let takeList = document.querySelector(".songList").getElementsByTagName("ul")[0].children;

    let takeArr = Array.from(takeList);

    
    if((index - 1) >= -1){

      
      
      if ((index - 1) == -1 ) {
        let songName = takeArr[index] ;
        
        
     
      
      playMusic(songName.querySelector(".info").firstElementChild.innerHTML,songs[index ]);
      }else{

        let songName = takeArr[index-1] ;
      
      
      playMusic(songName.querySelector(".info").firstElementChild.innerHTML,songs[index - 1]);

      }
 
      

    }
  
  
    
  }
  )

  
  //Add an event listener to  next

  let next  = document.getElementById("next");

  next.addEventListener("click", () => {
    
   
   

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

    let takeList = document.querySelector(".songList").getElementsByTagName("ul")[0].children;

    let takeArr = Array.from(takeList);

    
    if( (index + 1) <= songs.length && (index + 1 > 0 )){

      if ((index + 1) == songs.length) {

        let songName = takeArr[index] ;

      playMusic(songName.querySelector(".info").firstElementChild.innerHTML,songs[index]);

        
      }else{


         let songName = takeArr[index+1] ;
      
      
      playMusic(songName.querySelector(".info").firstElementChild.innerHTML,songs[index + 1]);

      }
 
     

    }



  }
  )


  //Add a event listener to volume

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e) => {

    console.log("Setting Volume", e.target.value, "/ 100");
    
      currentSong.volume = parseFloat(e.target.value)/100;

      if (currentSong.volume == 0) {
        document.querySelector(".volume > img").src = "/pics/mute.svg";
        
      } else {
        document.querySelector(".volume > img").src = "/pics/volume.svg";
        
      }

  }
  )


  //Add an event listener to mute the track

  document.querySelector(".volume > img").addEventListener("click", (e) => {


    if (currentSong.volume != 0) {
      
      e.target.src = "/pics/mute.svg";

      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      currentSong.volume = 0;

    } else {
      
      e.target.src = "/pics/volume.svg";

      document.querySelector(".range").getElementsByTagName("input")[0].value = 40;
      
      currentSong.volume = .4;
    }


  }
  )


  
    
}        
     

main(); 
