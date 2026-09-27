const test = require('node:test');
const assert = require('node:assert/strict');
const music = require('../dist/music.js');

test('las seis cuerdas abiertas tienen las alturas de afinación estándar', () => {
  assert.deepEqual(music.tuning, [64, 59, 55, 50, 45, 40]);
  assert.deepEqual(music.tuning.map(n => music.note(n % 12, 'english')), ['E', 'B', 'G', 'D', 'A', 'E']);
});

test('las 96 posiciones producen las notas que forman el acorde', () => {
  let count = 0;
  for (let root = 0; root < 12; root++) {
    for (const quality of Object.keys(music.qualities)) {
      const chord = music.chord(root, quality);
      const sounding = chord.frets.flatMap((fret, string) => fret < 0 ? [] : [(music.tuning[5 - string] + fret) % 12]);
      assert(sounding.every(pc => chord.pcs.includes(pc)), `${chord.id}: nota ajena al acorde`);
      // La posición abierta habitual x32310 de C7 omite la quinta.
      const required = chord.id === '0-7' ? chord.pcs.filter(pc => pc !== 7) : chord.pcs;
      assert(required.every(pc => sounding.includes(pc)), `${chord.id}: falta una nota esencial`);
      assert.equal(chord.frets.length, 6);
      count++;
    }
  }
  assert.equal(count, 96);
});

test('las posiciones iniciales de Do, Lam y Fa son correctas', () => {
  assert.deepEqual(music.fromId('0-major').frets, [-1, 3, 2, 0, 1, 0]);
  assert.deepEqual(music.fromId('9-minor').frets, [-1, 0, 2, 2, 1, 0]);
  assert.deepEqual(music.fromId('5-major').frets, [1, 3, 3, 2, 1, 1]);
});

test('la ortografía de Fa mayor usa Si bemol y la de Do sostenido mayor usa Mi sostenido', () => {
  const s = music.scales.major;
  assert.deepEqual(music.spell(5, s.intervals, s.degrees), ['Fa','Sol','La','Si♭','Do','Re','Mi']);
  assert.deepEqual(music.spell(1, s.intervals, s.degrees, 'english'), ['C♯','D♯','E♯','F♯','G♯','A♯','B♯']);
});

test('las entradas inválidas se rechazan sin crear acordes', () => {
  for (const id of ['99-major', '-1-major', '0-unknown', 'hello', '<script>']) assert.throws(() => music.fromId(id));
});

test('Do con capo 2 suena Re y conserva la forma y las cuerdas silenciadas', () => {
  const shape=music.fromId('0-major');
  const sounding=music.withCapo(shape,2);
  assert.equal(music.chordName(sounding,'english'),'D');
  assert.deepEqual(sounding.frets,[-1,5,4,2,3,2]);
  assert.deepEqual(sounding.pcs,[2,6,9]);
  assert.deepEqual(shape.frets,[-1,3,2,0,1,0]);
  assert.equal(sounding.shapeId,'0-major');
});

test('el capotraste sube todas las voces de cada acorde el mismo número de semitonos', () => {
  for(let root=0;root<12;root++) for(const quality of Object.keys(music.qualities)) {
    const base=music.chord(root,quality);
    for(let capo=0;capo<=9;capo++) {
      const c=music.withCapo(base,capo);
      c.frets.forEach((f,i)=>{
        if(base.frets[i]<0)assert.equal(f,-1);
        else {
          assert.equal(f-base.frets[i],capo);
          assert(c.pcs.includes((music.tuning[5-i]+f)%12));
          assert(f<=24);
        }
      });
      if(base.barre)assert.equal(c.barre.fret,base.barre.fret+capo);
    }
  }
  for(const invalid of [-1,10,2.5,NaN,'2'])assert.throws(()=>music.withCapo(music.fromId('0-major'),invalid));
});

test('los ocho patrones tienen acordes válidos, duraciones coherentes y dos referencias', () => {
  const patterns=require('../dist/progressions.js');
  assert.equal(Object.keys(patterns).length,8);
  for(const p of Object.values(patterns)) {
    p.ids.forEach(id=>assert.doesNotThrow(()=>music.fromId(id)));
    assert.equal(p.songs.length,2);
    p.songs.forEach(song=>assert.equal(new URL(song.url).protocol,'https:'));
    if(p.beats){assert.equal(p.beats.length,p.ids.length);assert(p.beats.every(n=>Number.isInteger(n)&&n>0&&n<=32));}
  }
  assert.equal(patterns.blues.ids.length,12);
  assert.deepEqual(patterns.andalusian.ids,['9-minor','7-major','5-major','4-major']);
});
