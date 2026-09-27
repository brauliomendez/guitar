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
      if (pcs.length === q.intervals.length && q.intervals.every(i => pcs.includes((root+i)%12)))
        matches.push({root,quality,bass,label:q.label,suffix:q.suffix,id:music.qualities[quality]?`${root}-${quality}`:null});
    }
    return matches.sort((a,b) => Number(b.root===bass)-Number(a.root===bass));
  }
  function matchName(c,notation) {
    return music.note(c.root,notation,[3,8,10].includes(c.root))+c.suffix+(c.bass===c.root?'':'/'+music.note(c.bass,notation,[3,8,10].includes(c.bass)));
  }
  return {degree,pattern,diatonic,identify,matchName};
})();
if(typeof module!=='undefined')module.exports=Theory;
