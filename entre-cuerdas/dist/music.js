'use strict';
const Music = (() => {
const latin=['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'],english=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const flatLatin=['Do','Re♭','Re','Mi♭','Mi','Fa','Sol♭','Sol','La♭','La','Si♭','Si'],flatEnglish=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
const tuning=[64,59,55,50,45,40];
const qualities={
dim:{label:'Disminuido',suffix:'dim',intervals:[0,3,6],degrees:[0,2,4],shape:[0,1,2,0,-1,-1],fingers:[0,1,2,0,0,0]},
major:{label:'Mayor',suffix:'',intervals:[0,4,7],degrees:[0,2,4],shape:[0,2,2,1,0,0],fingers:[0,2,3,1,0,0]},
minor:{label:'Menor',suffix:'m',intervals:[0,3,7],degrees:[0,2,4],shape:[0,2,2,0,0,0],fingers:[0,2,3,0,0,0]},
'7':{label:'Séptima dominante',suffix:'7',intervals:[0,4,7,10],degrees:[0,2,4,6],shape:[0,2,0,1,0,0],fingers:[0,2,0,1,0,0]},
m7:{label:'Menor séptima',suffix:'m7',intervals:[0,3,7,10],degrees:[0,2,4,6],shape:[0,2,0,0,0,0],fingers:[0,2,0,0,0,0]},
maj7:{label:'Mayor séptima',suffix:'maj7',intervals:[0,4,7,11],degrees:[0,2,4,6],shape:[0,2,1,1,0,0],fingers:[0,3,1,2,0,0]},
sus2:{label:'Suspendido 2',suffix:'sus2',intervals:[0,2,7],degrees:[0,1,4],shape:[-1,0,2,2,0,0],fingers:[0,0,1,2,0,0],base:9},
sus4:{label:'Suspendido 4',suffix:'sus4',intervals:[0,5,7],degrees:[0,3,4],shape:[0,2,2,2,0,0],fingers:[0,1,2,3,0,0]}
};
const rawOpen={
'0-major':[[-1,3,2,0,1,0],[0,3,2,0,1,0]],'2-major':[[-1,-1,0,2,3,2],[0,0,0,1,3,2]],'7-major':[[3,2,0,0,0,3],[2,1,0,0,0,3]],'9-major':[[-1,0,2,2,2,0],[0,0,1,2,3,0]],
'9-minor':[[-1,0,2,2,1,0],[0,0,2,3,1,0]],'2-minor':[[-1,-1,0,2,3,1],[0,0,0,2,3,1]],'0-7':[[-1,3,2,3,1,0],[0,3,2,4,1,0]],'2-7':[[-1,-1,0,2,1,2],[0,0,0,2,1,3]],'7-7':[[3,2,0,0,0,1],[3,2,0,0,0,1]],'9-7':[[-1,0,2,0,2,0],[0,0,1,0,2,0]],'11-7':[[-1,2,1,2,0,2],[0,2,1,3,0,4]],
'0-maj7':[[-1,3,2,0,0,0],[0,3,2,0,0,0]],'5-maj7':[[-1,-1,3,2,1,0],[0,0,3,2,1,0]],'9-maj7':[[-1,0,2,1,2,0],[0,0,2,1,3,0]],'2-maj7':[[-1,-1,0,2,2,2],[0,0,0,1,2,3]],'9-m7':[[-1,0,2,0,1,0],[0,0,2,0,1,0]],'2-m7':[[-1,-1,0,2,1,1],[0,0,0,2,1,1]],
'2-sus2':[[-1,-1,0,2,3,0],[0,0,0,1,3,0]],'0-sus2':[[-1,3,0,0,1,3],[0,3,0,0,1,4]],'2-sus4':[[-1,-1,0,2,3,3],[0,0,0,1,3,4]],'9-sus4':[[-1,0,2,2,3,0],[0,0,1,2,3,0]]};
function chord(root,quality){
const q=qualities[quality],id=`${root}-${quality}`;if(!q||!Number.isInteger(root)||root<0||root>11)throw Error('Acorde no válido');
let shape;const open=rawOpen[id];if(open)shape={frets:open[0],fingers:open[1],barre:id==='2-m7'?{fret:1,from:4,to:5}:null};
else{const offset=(root-(q.base??4)+12)%12;const movable={dim:[1,2,3,1,0,0],major:[1,3,4,2,1,1],minor:[1,3,4,1,1,1],'7':[1,3,1,2,1,1],m7:[1,3,1,1,1,1],maj7:[1,4,2,3,1,1],sus2:[0,1,3,4,1,1],sus4:[1,2,3,4,1,1]};shape={frets:q.shape.map(f=>f<0?-1:f+offset),fingers:offset?movable[quality]:q.fingers,barre:offset?{fret:offset,from:quality==='sus2'?1:0,to:quality==='dim'?3:5}:null};}
return{id,root,quality,...shape,pcs:q.intervals.map(i=>(root+i)%12)};}
function fromId(id){const m=/^(\d+)-(major|minor|7|m7|maj7|sus2|sus4|dim)$/.exec(id);if(!m)throw Error('Acorde no válido');return chord(Number(m[1]),m[2]);}
function withCapo(shape,capo=0){
  if(!Number.isInteger(capo)||capo<0||capo>9)throw Error('Capotraste no válido');
  return {...shape,capo,shapeRoot:shape.root,shapeId:shape.id,root:(shape.root+capo)%12,
    frets:shape.frets.map(f=>f<0?-1:f+capo),pcs:shape.pcs.map(pc=>(pc+capo)%12),
    barre:shape.barre?{...shape.barre,fret:shape.barre.fret+capo}:null};
}
function note(pc,notation='latin',flats=false){return(flats?(notation==='latin'?flatLatin:flatEnglish):(notation==='latin'?latin:english))[((pc%12)+12)%12];}
function chordName(c,notation='latin'){return note(c.root,notation,[3,8,10].includes(c.root))+qualities[c.quality].suffix;}
function spell(root,intervals,degrees,notation='latin'){const bases=[0,2,4,5,7,9,11],letters=notation==='latin'?['Do','Re','Mi','Fa','Sol','La','Si']:['C','D','E','F','G','A','B'],r=[0,0,1,2,2,3,3,4,5,5,6,6][root];return intervals.map((v,i)=>{const l=(r+degrees[i])%7;let d=(root+v-bases[l]+12)%12;if(d>6)d-=12;return letters[l]+(d>0?'♯'.repeat(d):'♭'.repeat(-d));});}
const scales={all:{label:'Todas las notas',intervals:Array.from({length:12},(_,i)=>i)},single:{label:'Una sola nota',intervals:[0]},major:{label:'Escala mayor',intervals:[0,2,4,5,7,9,11],degrees:[0,1,2,3,4,5,6]},minor:{label:'Escala menor natural',intervals:[0,2,3,5,7,8,10],degrees:[0,1,2,3,4,5,6]},pentatonic:{label:'Pentatónica menor',intervals:[0,3,5,7,10],degrees:[0,2,3,4,6]}};
return{latin,english,tuning,qualities,scales,chord,fromId,withCapo,note,chordName,spell};
})();
if(typeof module!=='undefined')module.exports=Music;
