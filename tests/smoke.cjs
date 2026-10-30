'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'web');
const appSource = fs.readFileSync(path.join(WEB,'app.js'), 'utf8');
const handlers = {};
const store = {};
const elements = {
  app: {innerHTML:''},
  toast: {textContent:'',classList:{add(){},remove(){}}}
};
const location = {
  hostname:'localhost', protocol:'http:', hash:'#inicio',
  href:'http://localhost:8080/?utm_source=referral#inicio'
};
const doc = {
  getElementById:id=>elements[id]||(elements[id]={innerHTML:''}),
  documentElement:{classList:{toggle(){}}},
  addEventListener:(kind,callback)=>(handlers[kind]??=[]).push(callback)
};
const context = {
  document:doc, location, navigator:{}, crypto:{randomUUID:()=>String(Date.now())},
  window:{addEventListener(){},scrollTo(){}},
  history:{pushState:(_data,_title,hash)=>{location.hash=hash;location.href='http://localhost:8080/'+hash;},replaceState:(_data,_title,url)=>{location.href=new URL(url,location.href).href;location.hash=new URL(location.href).hash;}},
  localStorage:{getItem:key=>store[key]??null,setItem:(key,val)=>{store[key]=val}},
  Intl, Date, URL, setTimeout, clearTimeout, requestAnimationFrame:f=>f(), console,
  confirm:()=>true
};
vm.runInNewContext(appSource,context,{filename:'web/app.js'});
assert.equal(location.href,'http://localhost:8080/#inicio','La URL inicial debe limpiar los parámetros de seguimiento');
const expectText=what=>assert.ok(elements.app.innerHTML.includes(what),`Falta: ${what}`);
const click=(data)=>{
  const target={dataset:data,closest:()=>target};
  return handlers.click.at(-1)({target,preventDefault(){}});
};
const go=where=>click({go:where});

expectText('2.º parcial de ICP2');
expectText('2.º parcial de Taller de Dibujo');
expectText('2.º parcial de Matemática');
expectText('Pedido de recuperatorio de ICP2');
expectText('assets/robot.png');

go('calendario');
expectText('Fechas de cursada');
expectText('2 nov de 2026');
expectText('3 nov de 2026');
expectText('6 nov de 2026');
click({calendarFilter:'oficial'});
expectText('Inscripción al segundo parcial · segundo cuatrimestre');
expectText('2026');
expectText('calendario-academico');

go('buscador');
click({searchTab:'alejandria'});
const alejandriaLinks = [
  'https://openlibrary.org/?lang=es',
  'https://www.redalyc.org/',
  'https://biblioteca.fadu.uba.ar/tiki/tiki-read_article.php?articleId=894',
  'https://www.loc.gov/collections/world-digital-library/about-this-collection/',
  'https://www.gutenberg.org/',
  'https://www.cervantesvirtual.com/',
  'https://www.europeana.eu/es',
  'https://archive.org/'
];
for (const url of alejandriaLinks) expectText(url.replaceAll('&','&amp;'));
assert.equal((elements.app.innerHTML.match(/<small>ALEJANDRÍA<\/small>/g)||[]).length,8,'Alejandría debe mostrar exactamente 8 recursos');
assert.ok(!elements.app.innerHTML.includes('Bibliotecas virtuales · Alejandría'),'Persistió un recurso antiguo');
assert.ok(!elements.app.innerHTML.includes('Recursos de estudio UBA XXI'),'Persistió el campus anterior en Alejandría');
assert.ok(elements.app.innerHTML.includes('rel="noopener noreferrer"'),'Los enlaces externos deben ser seguros');
click({searchTab:'codice'});
expectText('Parciales del CBC');
click({searchTab:'materiales'});
expectText('icp2-cronograma-2026.pdf');
expectText('ipc-organizador-2025.pdf');
for(const f of ['icp1-programa.pdf','icp1-organizador.pdf','icp2-programa-2026.pdf','icp2-cronograma-2026.pdf','ipc-programa-2025.pdf','ipc-organizador-2025.pdf','icse-programa-2024.pdf','icse-organizador-2024.pdf']){
  const data=fs.readFileSync(path.join(WEB,'materiales',f));
  assert.equal(data.subarray(0,4).toString(),'%PDF',`PDF inválido: ${f}`);
}

go('carreras');
expectText('Diseño Industrial');expectText('Diseño de Imagen y Sonido');

go('acerca');
expectText('Patricia Retamozo');expectText('Introducción al Conocimiento Proyectual 2');

go('plan');
expectText('Materias del CBC');
click({addCbc:'Matemática'});
expectText('Matemática');
assert.ok(Object.values(store).some(s=>s.includes('Matemática')),'No se persistió la materia');

go('asistente');
click({tab:'estudia'});
expectText('Campus Virtual UBA XXI');expectText('SIU Guaraní');

const index=fs.readFileSync(path.join(WEB,'index.html'),'utf8');
assert.ok(index.includes('Patricia Retamozo'));
assert.ok(index.includes('assets/icon-192.png'));
const sw=fs.readFileSync(path.join(WEB,'sw.js'),'utf8');
for(const match of sw.matchAll(/'\.\/([^']+)'/g)){
  if(!match[1] || match[1]==='./')continue;
  const p=path.join(WEB,match[1]);
  assert.ok(fs.existsSync(p),`Falta recurso cacheado: ${match[1]}`);
}
// El enlace compartido debe omitir parámetros de seguimiento, también al copiarlo.
(async () => {
  let copied = '';
  context.navigator.clipboard = { writeText: async value => { copied = value; } };
  location.href = 'https://mebisa.github.io/h.UBA/?utm_source=referral#compartir';
  location.hash = '#compartir';
  await click({go:'compartir'});
  expectText('value=\"https://mebisa.github.io/h.UBA/\"');
  assert.ok(!elements.app.innerHTML.includes('utm_source'), 'Se mostró un parámetro de seguimiento');
  await click({action:'copy-link'});
  assert.equal(copied, 'https://mebisa.github.io/h.UBA/');
  location.href = 'https://mebisa.github.io/h.UBA/index.html?utm_campaign=referral#compartir';
  await click({go:'compartir'});
  expectText('value=\"https://mebisa.github.io/h.UBA/\"');
  console.log('Pruebas de rutas, fechas, PDFs, recursos y enlace compartido: OK');
})().catch(err => { console.error(err); process.exitCode = 1; });
