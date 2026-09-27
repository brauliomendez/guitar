const test = require('node:test');
const assert = require('node:assert/strict');
const music = require('../dist/music.js');

test('las seis cuerdas abiertas tienen las alturas de afinación estándar', () => {
  assert.deepEqual(music.tuning, [64, 59, 55, 50, 45, 40]);
  assert.deepEqual(music.tuning.map(n => music.note(n % 12, 'english')), ['E', 'B', 'G', 'D', 'A', 'E']);
});

test('las 84 posiciones producen las notas que forman el acorde', () => {
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
  assert.equal(count, 84);
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
