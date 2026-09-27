'use strict';
// Song references identify harmonic patterns or sections, not full transcriptions.
const Progressions = {
  pop: {
    name:'Los cuatro acordes del pop', family:'Pop', formula:'I – V – vi – IV', key:'Do mayor',
    ids:['0-major','7-major','9-minor','5-major'],
    description:'Una salida luminosa, un pequeño giro al menor y una vuelta que pide empezar otra vez.',
    tip:'Escucha el cambio de color al llegar al tercer acorde: es el único menor.',
    songs:[
      {title:'With or Without You',artist:'U2',section:'Ciclo armónico principal; en Re en la grabación.',url:'https://www.libertyparkmusic.com/with-or-without-you-solo-guitar/'},
      {title:'When I Come Around',artist:'Green Day',section:'Base de las estrofas; aquí transportada a Do.',url:'https://www.fender.com/articles/chords/3-common-guitar-chord-progressions'}
    ]
  },
  classic: {
    name:'El círculo de los 50',family:'Doo-wop',formula:'I – vi – IV – V',key:'Sol mayor',
    ids:['7-major','4-minor','0-major','2-major'],
    description:'Un recorrido cálido y familiar. El último acorde crea la tensión que resuelve al volver al primero.',
    tip:'Compara el segundo acorde menor con el de la progresión pop: el orden cambia la sensación.',
    songs:[
      {title:'Stand by Me',artist:'Ben E. King',section:'Patrón principal; la duración de los acordes varía.',url:'https://www.fender.com/articles/chords/guitar-chords-that-sound-good-together'},
      {title:'Every Breath You Take',artist:'The Police',section:'Familia armónica de las estrofas, con variaciones.',url:'https://www.fender.com/articles/chords/3-common-guitar-chord-progressions'}
    ]
  },
  minor: {
    name:'El pop empieza en menor',family:'Pop / rock',formula:'vi – IV – I – V',key:'Do mayor / La menor',
    ids:['9-minor','5-major','0-major','7-major'],
    description:'Los mismos cuatro acordes del pop, empezando por el menor. Un inicio íntimo que se abre hacia la luz.',
    tip:'Con La como centro también puedes leerla i – ♭VI – ♭III – ♭VII; aquí los grados se refieren a Do mayor.',
    songs:[
      {title:'Save Tonight',artist:'Eagle-Eye Cherry',section:'Bucle de acompañamiento principal.',url:'https://www.fender.com/articles/chords/3-common-guitar-chord-progressions'},
      {title:'Peace of Mind',artist:'Boston',section:'Esta familia de progresión aparece en el tema.',url:'https://www.fender.com/articles/chords/3-common-guitar-chord-progressions'}
    ]
  },
  rock: {
    name:'Tres acordes, mucho camino',family:'Rock & roll',formula:'I – IV – V',key:'Do mayor',
    ids:['0-major','5-major','7-major'],beats:[2,2,4],
    description:'Las tres funciones esenciales: salir de casa, tomar impulso y preparar el regreso.',
    tip:'Prueba dos pulsos en Do, dos en Fa y cuatro en Sol. Es un ejercicio del patrón, no el arreglo de una canción.',
    songs:[
      {title:'La Bamba',artist:'Ritchie Valens',section:'Base I–IV–V, con regresos de paso al IV en el arreglo.',url:'https://www.bellandcomusic.com/la-bamba.html'},
      {title:'Twist and Shout',artist:'The Beatles',section:'Patrón principal; Re–Sol–La en la grabación.',url:'https://www.andyguitar.co.uk/videos/beatles-guitar-day-02-twist-and-shout'}
    ]
  },
  jazz: {
    name:'La puerta al jazz',family:'Jazz',formula:'ii7 – V7 – Imaj7',key:'Do mayor',
    ids:['2-m7','7-7','0-maj7'],beats:[4,4,8],
    description:'Preparación, tensión y descanso. Las séptimas unen los acordes con un color más suave.',
    tip:'Deja que el acorde final dure dos compases y escucha cómo se resuelve la tensión de Sol7.',
    songs:[
      {title:'Autumn Leaves',artist:'Joseph Kosma · estándar de jazz',section:'Cadencia mayor de la primera frase; también hay ii–V–i menores.',url:'https://www.jazzguitar.be/blog/autumn-leaves-easy-jazz-guitar-chords/'},
      {title:'Fly Me to the Moon',artist:'Frank Sinatra · composición de Bart Howard',section:'Cadencias mayores dentro de una secuencia más larga.',url:'https://www.jazzguitar.be/blog/fly-me-to-the-moon/'}
    ]
  },
  blues: {
    name:'Doce compases de blues',family:'Blues',formula:'I7 · IV7 · V7 / 12 compases',key:'Mi · blues',
    ids:['4-7','4-7','4-7','4-7','9-7','9-7','4-7','4-7','11-7','9-7','4-7','11-7'],
    description:'Tres acordes y una estructura de doce compases. Aquí practicamos una vuelta básica con séptimas.',
    tip:'Cada tarjeta es un compás. El V7 final funciona como enlace para comenzar la siguiente vuelta.',
    songs:[
      {title:'Tush',artist:'ZZ Top',section:'Blues de doce compases con su propio riff y variaciones.',url:'https://www.fender.com/articles/songs/10-easy-rock-songs-to-learn-on-guitar'},
      {title:'Hound Dog',artist:'Elvis Presley',section:'Forma de doce compases; los últimos compases varían respecto a este ejercicio.',url:'https://www.loganhone.com/Library/sheetmusic/aug152024_Community_Band_Songbook-Vocals.pdf'}
    ]
  },
  andalusian: {
    name:'La bajada andaluza',family:'Flamenco / pop',formula:'i – ♭VII – ♭VI – V',key:'La menor',
    ids:['9-minor','7-major','5-major','4-major'],
    description:'Cuatro fundamentales que descienden. El acorde mayor del final concentra la tensión antes de volver al menor.',
    tip:'Los grados están escritos desde La menor. En el enfoque flamenco, Mi puede sentirse como el centro de reposo.',
    songs:[{title:'Runaway',artist:'Del Shannon',section:'Estrofas y solo: descenso menor con un V mayor.',url:'https://www.jonmaclennan.com/blog/runaway-chords'},
      {title:'Stray Cat Strut',artist:'Stray Cats',section:'Descenso de las estrofas en Do menor, con séptimas en los acordes mayores.',url:'https://www.jonmaclennan.com/blog/stray-cat-strut-chords'}]
  },
  canon: {
    name:'El recorrido del canon',family:'Clásica / pop',formula:'I – V – vi – iii – IV – I – IV – V',key:'Do mayor',
    ids:['0-major','7-major','9-minor','4-minor','5-major','0-major','5-major','7-major'],
    description:'Una frase más larga que alterna reposo y movimiento. Una base para reconocer parentescos entre clásica y pop.',
    tip:'Practicamos una reducción habitual a tríadas. El original incluye inversiones y variaciones en las voces.',
    songs:[{title:'Canon en Re mayor',artist:'Johann Pachelbel',section:'Reducción del ciclo armónico, transportada aquí a Do.',url:'https://www.hooktheory.com/theorytab/view/johann-pachelbel/canon-in-d-major'},
      {title:'Memories',artist:'Maroon 5',section:'Bucle principal inspirado en el canon; cambia la tonalidad.',url:'https://www.andyguitar.co.uk/videos/maroon-5-memories'}]
  }
};
if(typeof module!=='undefined')module.exports=Progressions;
