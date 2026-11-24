const Search = {
 filter(query, songs = App.songs) {
  const q = String(query || "").trim().toLocaleLowerCase();
  if (!q) return [];
  return songs.filter(s => [s.title,s.artist,s.album,s.category,s.language].some(v => String(v || "").toLocaleLowerCase().includes(q)));
 }
};