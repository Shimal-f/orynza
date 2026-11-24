const Player = (() => {
 const audio=document.getElementById("audio"), $=id=>document.getElementById(id);
 const state={queue:[],index:0,current:null,shuffle:false,repeat:false};
 const fmt=n=>Number.isFinite(n)?`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,"0")}`:"0:00";
 function paint(){ $("playBtn").textContent=audio.paused?"▶":"Ⅱ"; $("playBtn").setAttribute("aria-label",audio.paused?"Play":"Pause"); if(state.current)$("likeCurrent").textContent=Favourites.has(state.current.songId)?"♥":"♡"; }
 async function start(){try{await audio.play();paint()}catch{paint();App.toast("Playback could not start. Please try again.")}}
 function setTrack(song,autoplay=true){if(!song)return;state.current=song;const found=state.queue.findIndex(x=>x.songId===song.songId);if(found>=0)state.index=found;else{state.queue=[song];state.index=0}
  $("playerCover").src=song.coverImage;$("playerTitle").textContent=song.title;$("playerArtist").textContent=song.artist;$("currentTime").textContent="0:00";$("totalTime").textContent="0:00";$("seekBar").value=0;
  audio.pause();audio.src=song.audioSource;audio.load();App.addRecent(song);paint();if(autoplay)start();
 }
 function playQueue(list,startAt=0){if(!Array.isArray(list)||!list.length){App.toast("There are no songs to play yet.");return}state.queue=list.slice();state.index=Math.max(0,Math.min(startAt,state.queue.length-1));setTrack(state.queue[state.index])}
 function toggle(){if(!state.current){if(App.songs.length)playQueue(App.songs,0);return}if(audio.paused)start();else{audio.pause();paint()}}
 function next(){if(!state.queue.length)return;if(state.shuffle&&state.queue.length>1){let n;do{n=Math.floor(Math.random()*state.queue.length)}while(n===state.index);state.index=n}else if(state.index<state.queue.length-1)state.index++;else if(state.repeat)state.index=0;else{audio.pause();paint();return}setTrack(state.queue[state.index])}
 function previous(){if(audio.currentTime>3){audio.currentTime=0;return}if(state.index>0)state.index--;else if(state.repeat)state.index=state.queue.length-1;else{audio.currentTime=0;return}setTrack(state.queue[state.index])}
 audio.addEventListener("timeupdate",()=>{$("currentTime").textContent=fmt(audio.currentTime);$("totalTime").textContent=fmt(audio.duration);$("seekBar").value=audio.duration?(audio.currentTime/audio.duration)*100:0});
 audio.addEventListener("loadedmetadata",()=>{$("totalTime").textContent=fmt(audio.duration)});
 audio.addEventListener("play",paint);audio.addEventListener("pause",paint);
 audio.addEventListener("ended",()=>{if(state.repeat&&state.queue.length===1){audio.currentTime=0;start()}else next()});
 audio.addEventListener("error",()=>{paint();App.toast("This audio file could not be loaded. Check the project files.")});
 $("playBtn").addEventListener("click",toggle);$("nextBtn").addEventListener("click",next);$("prevBtn").addEventListener("click",previous);
 $("seekBar").addEventListener("input",e=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*Number(e.target.value)/100});
 $("volumeBar").addEventListener("input",e=>{audio.volume=Number(e.target.value);audio.muted=false;$("muteBtn").textContent="◖"});
 audio.volume=.8;$("muteBtn").addEventListener("click",()=>{audio.muted=!audio.muted;$("muteBtn").textContent=audio.muted?"×":"◖"});
 $("shuffleBtn").addEventListener("click",()=>{state.shuffle=!state.shuffle;$("shuffleBtn").classList.toggle("active",state.shuffle);App.toast(state.shuffle?"Shuffle on":"Shuffle off")});
 $("repeatBtn").addEventListener("click",()=>{state.repeat=!state.repeat;$("repeatBtn").classList.toggle("active",state.repeat);App.toast(state.repeat?"Repeat on":"Repeat off")});
 $("likeCurrent").addEventListener("click",()=>{if(state.current){Favourites.toggle(state.current.songId);paint();App.renderCurrent()}});
 $("queueBtn").addEventListener("click",()=>App.showQueue(state.queue,state.index));
 return {playQueue,toggle,next,previous,get current(){return state.current},get queue(){return state.queue}};
})();