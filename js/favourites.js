const Favourites = (() => {
 const KEY="orynza_favourites"; let ids=[];
 function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");ids=Array.isArray(v)?v:[]}catch{ids=[]}}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(ids))}catch{}}
 function has(id){return ids.includes(id)}
 function toggle(id){ids=has(id)?ids.filter(x=>x!==id):[...ids,id];save()}
 function songs(){return ids.map(id=>App.songs.find(s=>s.songId===id)).filter(Boolean)}
 load();return {has,toggle,songs,load};
})();