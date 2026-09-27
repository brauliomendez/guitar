const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');

function player(){
  let now=0,serial=0;
  const timers=new Map(),sounds=[];
  const element={innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){}};
  const context=vm.createContext({
    Music:require('../dist/music.js'),Progressions:require('../dist/progressions.js'),
    document:{querySelector:selector=>selector.startsWith('[data-step=')?null:element,querySelectorAll:()=>[],addEventListener(){}},
    window:{addEventListener(){}},location:{hash:''},localStorage:{getItem:()=>null},
    performance:{now:()=>now},
    setTimeout:(fn,delay)=>{const id=++serial;timers.set(id,{fn,at:now+delay});return id;},
    clearTimeout:id=>timers.delete(id),
    GuitarAudio:{ready:async()=>{},stop:()=>sounds.push('stop'),strum:c=>sounds.push(c.id),click(){}},
    identifying:()=>false,renderLibrary(){},renderBoard(){},renderDetail(){}
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8'),context);
  const run=code=>vm.runInContext(code,context);
  run("state.view='progresiones';state.sequence=[{id:'0-major',beats:2},{id:'9-minor',beats:2},{id:'5-major',beats:2}];state.bpm=120;");
  return {run,timers,sounds,state:()=>JSON.parse(run('JSON.stringify({active:state.active,beat:state.beat,playing:state.playing,paused:state.paused})')),
    advance(){const [id,task]=[...timers.entries()].sort((a,b)=>a[1].at-b[1].at)[0];timers.delete(id);now=task.at;task.fn();}};
}

test('saltar durante la reproducción reinicia el pulso y sustituye el temporizador anterior',async()=>{
  const p=player();await p.run('play()');
  p.advance();assert.equal(p.state().beat,1);const oldTimer=[...p.timers.keys()][0];
  p.run('selectSequenceStep(1)');
  assert.deepEqual(p.state(),{active:1,beat:0,playing:true,paused:false});
  assert.equal(p.timers.size,1);assert(!p.timers.has(oldTimer));assert.equal(p.sounds.at(-1),'9-minor');
  p.advance();assert.equal(p.state().beat,1);p.advance();assert.equal(p.state().active,2);assert.equal(p.sounds.at(-1),'5-major');
});
test('saltar en pausa o detenido no inicia audio y continuar parte del nuevo acorde',async()=>{
  const p=player();p.run('selectSequenceStep(2)');assert.equal(p.state().playing,false);assert.equal(p.timers.size,0);
  await p.run('play()');await p.run('play()');p.run('selectSequenceStep(1)');
  assert.deepEqual(p.state(),{active:1,beat:0,playing:false,paused:true});assert.equal(p.timers.size,0);
  await p.run('play()');assert.equal(p.state().active,1);assert.equal(p.sounds.at(-1),'9-minor');
});
test('saltar al último acorde respeta el final sin bucle e ignora índices inválidos',async()=>{
  const p=player();p.run('state.loop=false');await p.run('play()');p.run('selectSequenceStep(2)');
  for(const index of [-1,3,0.5,NaN])p.run(`selectSequenceStep(${index})`);
  assert.equal(p.state().active,2);p.advance();p.advance();assert.equal(p.state().playing,false);
});
