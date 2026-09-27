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
