const test=require('node:test');
const assert=require('node:assert/strict');
const Theory=require('../dist/theory.js');
const Music=require('../dist/music.js');

test('el patrón del usuario respeta mayúsculas, minúsculas y escala',()=>{
  assert.deepEqual(Theory.pattern('VI-I-iv',0,'major').map(s=>s.id),['9-major','0-major','5-minor']);
  assert.deepEqual(Theory.pattern('vi I IV',0,'major').map(s=>s.id),['9-minor','0-major','5-major']);
  assert.deepEqual(Theory.pattern('VI-I-iv',0,'minor').map(s=>s.id),['8-major','0-major','5-minor']);
});
test('los siete acordes diatónicos contienen solo notas de la escala en las doce tonalidades',()=>{
  for(let root=0;root<12;root++) for(const scale of ['major','minor']){
    const pcs=Music.scales[scale].intervals.map(i=>(root+i)%12);
    for(const d of Theory.diatonic[scale])assert(Music.fromId(Theory.degree(d,root,scale).id).pcs.every(pc=>pcs.includes(pc)));
  }
});
test('transportar un patrón conserva calidad y sube todas las voces',()=>{
  const pattern='I-vi-ii7-V7-vii°-Imaj7';
  const original=Theory.pattern(pattern,0,'major');
  for(let root=0;root<12;root++)Theory.pattern(pattern,root,'major').forEach((step,i)=>{
    const a=Music.fromId(original[i].id),b=Music.fromId(step.id);
    assert.equal(b.quality,a.quality);assert.equal(b.root,(a.root+root)%12);
  });
});
test('admite alteraciones y separadores sin aceptar patrones inválidos',()=>{
  assert.equal(Theory.degree('bVII',0,'major').id,'10-major');
  assert.equal(Theory.degree('#iv',0,'major').id,'6-minor');
  assert.equal(Theory.degree('ii7',0,'major').id,'2-m7');
  assert.deepEqual(Theory.pattern('I, vi; IV — V',0,'major').map(s=>s.degree),['I','vi','IV','V']);
  for(const input of ['', 'VIII','Iv','I / V','I-nope', '<img>',Array(33).fill('I').join('-')])assert.throws(()=>Theory.pattern(input,0,'major'));
  assert.throws(()=>Theory.degree('I',12,'major'));assert.throws(()=>Theory.degree('I',0,'pentatonic'));
});
test('reconoce notas repetidas, inversiones y lecturas ambiguas',()=>{
  const c=Theory.identify([48,52,55,60]);
  assert.equal(c[0].id,'0-major');assert.equal(Theory.matchName(c[0],'english'),'C');
  const inversion=Theory.identify([52,55,60])[0];assert.equal(Theory.matchName(inversion,'english'),'C/E');
  const ambiguous=Theory.identify([48,52,55,57]);assert(ambiguous.some(m=>m.quality==='6'&&m.root===0));assert(ambiguous.some(m=>m.id==='9-m7'));
  assert.deepEqual(Theory.identify([48,60,55]),[]);assert.deepEqual(Theory.identify([48,49,50]),[]);
});
test('todas las tríadas y séptimas completas de la biblioteca se reconocen',()=>{
  for(let root=0;root<12;root++)for(const quality of Object.keys(Music.qualities)){
    const c=Music.chord(root,quality);
    assert(Theory.identify(c.pcs.map(pc=>48+pc)).some(m=>m.id===c.id),c.id);
  }
});

test('reconoce el Do7 abierto de la captura, sin Sol, y su inversión',()=>{
  const c=Theory.identify([48,52,58,60,64])[0]; // x32310: Do Mi Si♭ Do Mi
  assert.equal(c.id,'0-7');assert.equal(c.omittedFifth,true);
  assert.equal(Theory.matchName(c,'latin'),'Do7');
  const inversion=Theory.identify([52,58,60,64])[0];
  assert.equal(Theory.matchName(inversion,'english'),'C7/E');
  assert.equal(inversion.omittedFifth,true);
});

test('admite la quinta omitida en séptimas de las doce tonalidades, sin ignorar otras notas',()=>{
  for(let root=0;root<12;root++)for(const quality of ['7','m7','maj7']){
    const intervals=Music.qualities[quality].intervals;
    const pitches=intervals.map(i=>48+root+i),id=`${root}-${quality}`;
    const full=Theory.identify(pitches).find(m=>m.id===id);
    assert(full);assert.equal(full.omittedFifth,false);
    const shell=pitches.filter((_,i)=>intervals[i]!==7);
    const match=Theory.identify(shell).find(m=>m.id===id);
    assert(match,id);assert.equal(match.omittedFifth,true);
    for(const essential of [0,intervals[1],intervals[3]]){
      assert(!Theory.identify(pitches.filter(p=>p!==48+root+essential)).some(m=>m.id===id),`${id} sin ${essential}`);
    }
    assert(!Theory.identify([...shell,49+root]).some(m=>m.id===id),`${id} con nota ajena`);
  }
  for(const quality of ['dim','m7b5','dim7','aug']){
    assert(!Theory.identify([48,51,57]).some(m=>m.root===0&&m.quality===quality));
  }
});

test('se reconocen las 96 digitaciones reales de la biblioteca, también con capo',()=>{
  for(let root=0;root<12;root++)for(const quality of Object.keys(Music.qualities))for(const capo of [0,1,5,9]){
    const chord=Music.withCapo(Music.chord(root,quality),capo);
    const pitches=chord.frets.flatMap((f,s)=>f<0?[]:[Music.tuning[5-s]+f]);
    assert(Theory.identify(pitches).some(m=>m.root===chord.root&&m.quality===quality),`${root}-${quality} capo ${capo}`);
  }
});

test('Fa mayor se simplifica como Mi con capo 1 y Si menor como La menor con capo 2',()=>{
  const f=Theory.capoAlternatives(5,'major')[0];
  assert.equal(f.shape.id,'4-major');assert.equal(f.capo,1);assert.equal(f.barre,false);
  const bm=Theory.capoAlternatives(11,'minor')[0];
  assert.equal(bm.shape.id,'9-minor');assert.equal(bm.capo,2);assert.equal(bm.barre,false);
  assert.equal(Theory.shapeEffort(Music.chord(5,'major')).barre,true);
  assert.equal(Theory.shapeEffort(Music.chord(4,'minor')).fingers,2);
});

test('las alternativas conservan fundamental, tipo y notas del acorde en todos los capos',()=>{
  for(let root=0;root<12;root++)for(const quality of Object.keys(Music.qualities)){
    const target=Music.chord(root,quality),options=Theory.capoAlternatives(root,quality);
    assert.equal(options.length,10);assert.equal(new Set(options.map(o=>o.capo)).size,10);
    for(const option of options){
      const c=Music.withCapo(option.shape,option.capo);
      assert.equal(c.root,root);assert.equal(c.quality,quality);
      assert.deepEqual([...c.pcs].sort(),[...target.pcs].sort());
      c.frets.forEach((f,s)=>{if(f>=0)assert(target.pcs.includes((Music.tuning[5-s]+f)%12));});
    }
    assert(options.every((o,i)=>!i||o.score>=options[i-1].score));
  }
  assert.throws(()=>Theory.capoAlternatives(12,'major'));
});
