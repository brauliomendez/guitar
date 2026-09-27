'use strict';
function renderLibrary(){
  const library=$('#progression-library');
  library.hidden=state.view!=='progresiones';
  if(library.hidden){library.innerHTML='';return;}
  const selected=Progressions[state.browsePreset];
  const loaded=selected.ids.length===state.sequence.length&&selected.ids.every((id,i)=>state.sequence[i].id===id&&(state.sequence[i].capo??0)===0&&state.sequence[i].beats===(selected.beats?.[i]??4));
  library.innerHTML=`
    <div class="library-heading"><div><p class="eyebrow">UN MISMO PATRÓN, MUCHAS CANCIONES</p><h2>Ocho caminos para explorar</h2></div><span class="library-count">08 progresiones</span></div>
    <div class="progression-grid" aria-label="Elige una progresión">
      ${Object.entries(Progressions).map(([id,p],i)=>`<button class="progression-card ${state.browsePreset===id?'selected':''}" data-preset="${id}" aria-pressed="${state.browsePreset===id}"><span class="progression-card-top"><span>${p.family}</span><span>${String(i+1).padStart(2,'0')}</span></span><strong>${p.name}</strong><span class="progression-formula">${p.formula}</span></button>`).join('')}
    </div>
    <article class="progression-story" aria-label="Detalle de la progresión seleccionada">
      <div class="progression-explanation"><p class="eyebrow">${selected.family} · ${selected.key}</p><h3>${selected.name}</h3><p>${selected.description}</p><div class="example-chords">${selected.ids.map(id=>`<span>${Music.chordName(Music.fromId(id),state.notation)}</span>`).join('')}</div><p class="listening-tip">${selected.tip}</p><button id="load-progression" class="btn primary">${loaded?'↻ Reiniciar este patrón':'▷ Practicar esta progresión'}</button><span class="load-hint">Carga el patrón en la secuencia de abajo.</span></div>
      <div class="song-examples"><p class="eyebrow">RECONÓCELA EN ESTAS CANCIONES</p>${selected.songs.map(song=>`<a class="song-reference" href="${song.url}" target="_blank" rel="noopener noreferrer"><span class="song-symbol" aria-hidden="true">♫</span><span><strong>${song.title}</strong><span class="song-artist">${song.artist}</span><small>${song.section}</small></span><span class="source-arrow" aria-hidden="true">↗</span></a>`).join('')}<p class="song-note">Los enlaces abren una lección o análisis. Practicamos el patrón simplificado: la tonalidad, el ritmo y algunos acordes pueden variar en cada canción.</p></div>
    </article>`;
}
function loadProgression(){
  const p=Progressions[state.browsePreset];
  stop();
  state.sequence=p.ids.map((id,i)=>({id,beats:p.beats?.[i]??4,capo:0}));
  save();renderLibrary();renderBoard();renderDetail();renderProgression();
  $('.workspace').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  toast(`${p.name}: lista para tocar`);
}
