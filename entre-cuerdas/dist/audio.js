'use strict';
const GuitarAudio=(()=>{
let context=null,master=null,volume=.5;const voices=new Set();
async function ready(){if(!context){context=new(window.AudioContext||window.webkitAudioContext)();master=context.createGain();master.gain.value=volume*.65;master.connect(context.destination);}if(context.state==='suspended')await context.resume();return context;}
function pluck(midi,delay=0,duration=2){if(!context||context.state!=='running')return;const frequency=440*Math.pow(2,(midi-69)/12),rate=context.sampleRate,n=Math.round(rate/frequency),length=Math.ceil(rate*duration),data=new Float32Array(length),ring=new Float32Array(n);
// Karplus–Strong synthesis: a filtered noise loop models a plucked string.
for(let i=0;i<n;i++)ring[i]=Math.random()*2-1;for(let i=0;i<length;i++){const j=i%n;data[i]=ring[j]*Math.min(1,i/(rate*.004));ring[j]=.497*(ring[j]+ring[(j+1)%n]);}
const buffer=context.createBuffer(1,length,rate);buffer.copyToChannel(data,0);const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.connect(gain);gain.connect(master);gain.gain.value=.55;source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();};voices.add(source);source.start(context.currentTime+delay);}
function strum(c,duration=2){[...Music.tuning].reverse().forEach((midi,i)=>{if(c.frets[i]>=0)pluck(midi+c.frets[i],i*.028,Math.max(.25,Math.min(duration,4)));});}
function click(accent=false){if(!context)return;const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime;osc.frequency.value=accent?1100:800;gain.gain.setValueAtTime(.12,now);gain.gain.exponentialRampToValueAtTime(.001,now+.05);osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+.06);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};}
function stop(){for(const v of voices){try{v.stop();}catch{}}voices.clear();}function setVolume(v){volume=v;if(master)master.gain.setTargetAtTime(v*.65,context.currentTime,.025);}return{ready,pluck,strum,click,stop,setVolume};})();
