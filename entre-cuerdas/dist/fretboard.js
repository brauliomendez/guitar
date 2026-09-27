'use strict';
function renderBoard(){
  const isChord=['acordes','progresiones'].includes(state.view),c=isChord?currentChord():null;
  const capo=c?.capo??0,root=c?.root??state.root,maxFret=c?Math.max(...c.frets):0;
  const frets=Math.max(state.frets,maxFret>15?24:maxFret>12?15:12);
  const board=$('#fretboard');board.style.setProperty('--frets',frets);
  $('#fret-count').value=String(frets);
  $('#board-title').textContent=isChord?`${Music.chordName(c,state.notation)} · ${Music.qualities[c.quality].label.toLowerCase()}`:state.scale==='all'?'El mapa del mástil':state.scale==='single'?`Encuentra ${note(state.root)}`:`${Music.scales[state.scale].label} de ${note(state.root)}`;
  document.querySelector('.chord-legend').style.display=isChord?'inline':'none';
  document.querySelector('.chord-legend').textContent=capo?'○ Al capo · × No tocar':'○ Al aire · × No tocar';
  $('#board-hint').textContent=capo?`Capotraste en ${capo} · trastes reales`:'Vista frontal · 6.ª arriba · pala a la derecha';
  let html='';
  for(let f=frets;f>=0;f--)html+=`<span class="fret-label ${capo&&f===capo?'capo-label':''}">${f===0?'AIRE':f}</span>`;
  Music.tuning.map((midi,s)=>({midi,s})).reverse().forEach(({midi,s})=>{
    for(let f=frets;f>=0;f--){
      const pc=(midi+f)%12,shapeFret=c?.frets[5-s],chordPosition=isChord&&shapeFret===f;
      const muted=isChord&&shapeFret===-1&&f===capo,blocked=f<capo;
      const allowed=Music.scales[state.scale].intervals.some(i=>(root+i)%12===pc);
      const hidden=blocked||!(isChord?chordPosition||muted:allowed)||(!isChord&&state.hide);
      const display=muted?'×':boardName(pc);
      const accessible=blocked?`Cuerda ${s+1}, traste ${f}, detrás del capotraste`:state.hide&&!isChord?`Cuerda ${s+1}, traste ${f}`:`${boardName(pc)}, cuerda ${s+1}, ${f===capo?capo?'al capotraste':'al aire':`traste ${f}`}${muted?', no tocar':''}`;
      html+=`<button class="fret-cell ${f===0?'open':''} ${muted?'muted-chord':''} ${blocked?'behind-capo':''} ${capo&&f===capo?'at-capo':''}" data-string="${s}" data-fret="${f}" aria-label="${accessible}" ${blocked?'disabled':''} style="--string-width:${1+s*.25}px"><span class="note-dot ${pc===root&&!muted?'root':''} ${hidden?'hidden-note':''}">${hidden?'':display}</span></button>`;
    }
  });
  for(let f=frets;f>=0;f--)html+=`<span class="fret-marker">${[3,5,7,9,12,15,17,19,21,24].includes(f)?'<i></i>':''}${f===12||f===24?'<i></i>':''}</span>`;
  board.innerHTML=html;
}
function diagram(c){
  const capo=c.capo??0,relative=c.frets.map(f=>f<0?-1:f-capo);
  const positive=relative.filter(f=>f>0),start=Math.min(...positive)>3?Math.min(...positive):1;
  const rows=Math.max(4,Math.max(...positive)-start+1),height=rows*26+47;
  let svg=`<svg class="diagram" viewBox="0 0 170 ${height}" role="img" aria-label="Diagrama de ${Music.chordName(c,state.notation)}${capo?`, capotraste en traste ${capo}`:''}. Trastes reales de sexta a primera: ${c.frets.map(f=>f<0?'no tocar':f).join(', ')}">`;
  for(let f=0;f<=rows;f++)svg+=`<line x1="30" y1="${27+f*26}" x2="145" y2="${27+f*26}" stroke="${f===0&&start===1?(capo?'#8872a7':'#667263'):'#b4bcae'}" stroke-width="${f===0&&start===1?capo?7:4:1}"/>`;
  for(let s=0;s<6;s++)svg+=`<line x1="${30+s*23}" y1="27" x2="${30+s*23}" y2="${27+rows*26}" stroke="#96a18e" stroke-width="${1.5-s*.15}"/>`;
  if(start>1||capo)svg+=`<text x="3" y="45" fill="#637359" font-size="10">${start+capo}fr</text>`;
  if(c.barre)svg+=`<line x1="${30+c.barre.from*23}" x2="${30+c.barre.to*23}" y1="${40+(c.barre.fret-capo-start)*26}" y2="${40+(c.barre.fret-capo-start)*26}" stroke="#567449" stroke-width="14" stroke-linecap="round"/>`;
  relative.forEach((f,s)=>{
    const x=30+s*23;
    if(f<=0)svg+=`<text x="${x}" y="17" text-anchor="middle" font-size="14" fill="#566a4f">${f<0?'×':'○'}</text>`;
    else svg+=`<circle cx="${x}" cy="${40+(f-start)*26}" r="8.5" fill="#2c6258"/><text x="${x}" y="${44+(f-start)*26}" text-anchor="middle" fill="white" font-size="10">${c.fingers[s]||'•'}</text>`;
    svg+=`<text x="${x}" y="${44+rows*26}" text-anchor="middle" font-size="10" fill="#6f7e66">${6-s}</text>`;
  });
  return svg+'</svg>';
}
function renderDetail(){
  const panel=$('#detail-panel');panel.className='detail-panel card';
  if(['acordes','progresiones'].includes(state.view)){
    const c=currentChord(),q=Music.qualities[c.quality],shape=Music.fromId(c.shapeId);
    panel.classList.add('chord-detail');
    const notes=Music.spell(c.root,q.intervals,q.degrees,state.notation);
    panel.innerHTML=`<span class="detail-tag">${c.capo?'EL ACORDE QUE SUENA':state.view==='progresiones'?'ACORDE ACTUAL':'ASÍ SE TOCA'}</span><div class="big-note">${Music.chordName(c,state.notation)}</div><p class="detail-subtitle">${q.label}${c.barre?' · cejilla de índice':''}</p>${c.capo?`<div class="capo-summary">Forma <strong>${Music.chordName(shape,state.notation)}</strong> + capo <strong>${c.capo}</strong><br><span>Sube ${c.capo} semitono${c.capo===1?'':'s'}</span></div>`:''}${diagram(c)}<div class="note-chips">${notes.map(n=>`<span class="chip">${n}</span>`).join('')}</div><p class="detail-description">${c.capo?'○ Cuerda apoyada en el capo. ':''}1 índice · 2 medio · 3 anular · 4 meñique. Cuerdas de 6.ª a 1.ª.</p><button class="btn primary" id="listen-chord">▷ Escuchar acorde</button>${state.view==='acordes'?'<button class="btn soft" id="add-current">＋ Añadir a progresión</button>':'<div class="meter-track"><div class="meter-fill" id="step-meter"></div></div>'}`;
    return;
  }
  const sel=state.selected,pc=(Music.tuning[sel.string]+sel.fret)%12,midi=Music.tuning[sel.string]+sel.fret;
  panel.innerHTML=`<span class="detail-tag">LA NOTA QUE EXPLORAS</span><div class="big-note">${boardName(pc)}</div><p class="detail-subtitle">${Music.note(pc,state.notation==='latin'?'english':'latin')} · octava ${Math.floor(midi/12)-1}</p><div class="note-chips"><span class="chip">Cuerda ${sel.string+1}</span><span class="chip">${sel.fret===0?'Al aire':`Traste ${sel.fret}`}</span></div><p class="detail-description">${pc===state.root?'Es la tónica que has elegido. Búscala en las otras cuerdas para conectar posiciones.':'La misma nota aparece en distintos lugares del mástil. Escucha cómo cambia su altura.'}</p><button class="btn primary" id="listen-note">▷ Escuchar nota</button>`;
}
