const Playlists = (() => {
 const KEY="orynza_playlists"; let items=[];
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}};
 function load(seed){const saved=read();items=Array.isArray(saved)?saved:seed;save();}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch{}}
 function all(){return items}
 function create(name){const p={playlistId:"p"+Date.now(),name:name.trim(),description:"Your personal collection.",songIds:[]};items.unshift(p);save();return p}
 function add(pid,sid){const p=items.find(x=>x.playlistId===pid);if(p&&!p.songIds.includes(sid)){p.songIds.push(sid);save();return true}return false}
 function remove(pid,sid){const p=items.find(x=>x.playlistId===pid);if(p){p.songIds=p.songIds.filter(x=>x!==sid);save()}}
 function removePlaylist(pid){items=items.filter(p=>p.playlistId!==pid);save()}
 return {load,all,create,add,remove,removePlaylist};
})();