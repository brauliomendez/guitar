'use strict';
const Theory = (() => {
  const music = typeof module !== 'undefined' ? require('./music.js') : Music;
  const romans = ['I','II','III','IV','V','VI','VII'];
  const diatonic = {major:['I','ii','iii','IV','V','vi','vii°'],minor:['i','ii°','III','iv','v','VI','VII']};
  function degree(token, root, scale) {
    if (!Number.isInteger(root) || root < 0 || root > 11 || !diatonic[scale]) throw Error('Elige una tonalidad mayor o menor natural.');
    const m = /^([b♭#♯]?)(VII|III|VI|IV|II|V|I|vii|iii|vi|iv|ii|v|i)(maj7|7|°|dim|sus2|sus4)?$/.exec(token.trim());
    if (!m) throw Error('Usa grados como I, vi, iv, V7 o vii°.');
    const index = romans.indexOf(m[2].toUpperCase());
    const minor = m[2] === m[2].toLowerCase();
    const quality = m[3] === '°' || m[3] === 'dim' ? 'dim' : m[3] === '7' ? minor ? 'm7' : '7' : m[3] || (minor ? 'minor' : 'major');
    const offset = ['b','♭'].includes(m[1]) ? -1 : ['#','♯'].includes(m[1]) ? 1 : 0;
    const pc = (root + music.scales[scale].intervals[index] + offset + 12) % 12;
    const roman = (offset < 0 ? '♭' : offset > 0 ? '♯' : '') + m[2] + (m[3] === 'dim' ? '°' : m[3] || '');
    return {degree:roman, id:music.chord(pc,quality).id};
  }
  function pattern(text, root, scale) {
    const tokens = text.trim().split(/[\s,;–—−-]+/).filter(Boolean);
    if (!tokens.length) throw Error('Escribe un patrón o añade grados con los botones.');
    if (tokens.length > 32) throw Error('La secuencia admite hasta 32 grados.');
    return tokens.map(t => degree(t,root,scale));
  }
  // Compare pitch classes, preserving the lowest actual pitch to name inversions.
  function identify(midis) {
    const pitches = midis.filter(Number.isFinite);
    const pcs = [...new Set(pitches.map(n => ((n % 12) + 12) % 12))];
    if (pcs.length < 3) return [];
    const templates = {...music.qualities,
      aug:{label:'Aumentado',suffix:'aug',intervals:[0,4,8]},
      '6':{label:'Sexta mayor',suffix:'6',intervals:[0,4,7,9]},
      m6:{label:'Sexta menor',suffix:'m6',intervals:[0,3,7,9]},
      add9:{label:'Mayor con novena añadida',suffix:'add9',intervals:[0,4,7,2]},
      m7b5:{label:'Semidisminuido',suffix:'m7♭5',intervals:[0,3,6,10]},
      dim7:{label:'Séptima disminuida',suffix:'dim7',intervals:[0,3,6,9]}};
    const bass = Math.min(...pitches) % 12, matches = [];
    for (let root=0;root<12;root++) for (const [quality,q] of Object.entries(templates)) {
      const missing = q.intervals.filter(i => !pcs.includes((root+i)%12));
      // Common seventh voicings can omit the perfect fifth, but must retain
      // root, third and seventh. Never ignore extra notes or an altered fifth.
      const omittedFifth = ['7','m7','maj7'].includes(quality) && missing.length === 1 && missing[0] === 7;
      if (pcs.every(pc => q.intervals.includes((pc-root+12)%12)) && (!missing.length || omittedFifth))
        matches.push({root,quality,bass,label:q.label,suffix:q.suffix,omittedFifth,id:music.qualities[quality]?`${root}-${quality}`:null});
    }
    return matches.sort((a,b) => Number(a.omittedFifth)-Number(b.omittedFifth) || Number(b.root===bass)-Number(a.root===bass));
  }
  function matchName(c,notation) {
    return music.note(c.root,notation,[3,8,10].includes(c.root))+c.suffix+(c.bass===c.root?'':'/'+music.note(c.bass,notation,[3,8,10].includes(c.bass)));
  }
  function shapeEffort(shape) {
    const pressed=shape.frets.filter(f=>f>0);
    const fingers=new Set(shape.fingers.filter((finger,i)=>finger>0&&shape.frets[i]>0)).size;
    const stretch=pressed.length?Math.max(...pressed)-Math.min(...pressed):0;
    return {barre:!!shape.barre,fingers,stretch};
  }
  function capoAlternatives(root,quality) {
    music.chord(root,quality); // Validate the sounding chord before transposing backwards.
    return Array.from({length:10},(_,capo)=>{
      const shape=music.chord((root-capo+12)%12,quality),effort=shapeEffort(shape);
      // An approximate ordering: avoid index barres, then balance fingers and capo height.
      const score=Number(effort.barre)*100+effort.fingers*4+effort.stretch+capo*1.5;
      return {shape,capo,...effort,score};
    }).sort((a,b)=>a.score-b.score||a.capo-b.capo);
  }
  return {degree,pattern,diatonic,identify,matchName,shapeEffort,capoAlternatives};
})();
if(typeof module!=='undefined')module.exports=Theory;
