(() => {
'use strict';
const KEY = 'huba-estudiante-v2';
const LEGACY_KEY = 'huba-demo-data-v1';
const NAV = [
  ['inicio','Inicio','home'],['asistente','Asistente virtual','bot'],['buscador','Buscador','search'],
  ['mis-cosas','Mis cosas','folder'],['plan','Plan de estudio','book'],['carreras','Carreras FADU','award'],['calendario','Calendario','calendar'],
  ['recordatorios','Recordatorios','bell'],['correo','Correo','mail'],['ayuda','Ayuda / FAQ','help'],['configuracion','Configuración','settings'],['soporte','Soporte','headphones'],['acerca','Acerca de','help']
];
const ICONS = {
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  bot:'<rect x="3" y="7" width="18" height="14" rx="5"/><path d="M12 7V3m-4 10h.01M16 13h.01M8 17c2 2 6 2 8 0"/>',
  search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  book:'<path d="M12 7c-3-2-6-2-9-1v13c3-1 6-1 9 1 3-2 6-2 9-1V6c-3-1-6-1-9 1zM12 7v13"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 9h18c0-1-3-2-3-9zM10 21h4"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a3 3 0 1 1 4.2 2.7c-1.5.6-1.7 1.2-1.7 2.3M12 17h.01"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="m10 2-.4 2-2 1-2-.9-2 3 1.5 1.5-.2 2.4-2 1v3l2 1 .2 2.4L3.6 20l2 3 2-.9 2 1 .4 2h4l.4-2 2-1 2 .9 2-3-1.5-1.5.2-2.4 2-1v-3l-2-1-.2-2.4L20.4 7l-2-3-2 .9-2-1L14 2z" transform="translate(0 -1) scale(1 .92)"/>',
  headphones:'<path d="M3 14v-2a9 9 0 0 1 18 0v2m-18 0v5a2 2 0 0 0 2 2h3v-8H5a2 2 0 0 0-2 2zm18 0v5a2 2 0 0 1-2 2h-3v-8h3a2 2 0 0 1 2 2z"/>',
  arrow:'<path d="M4 12h16m-7-7 7 7-7 7"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  trash:'<path d="M4 7h16M10 4h4m-8 3 1 14h10l1-14M10 11v6m4-6v6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  spark:'<path d="m12 2 2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  moon:'<path d="M20 16A8 8 0 0 1 8 4a8 8 0 1 0 12 12z"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"/>',
  send:'<path d="M22 2 11 13m11-11-7 20-4-9-9-4z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4m-7 7 7 4"/>',
  edit:'<path d="M4 20h4L20 8l-4-4L4 16zM13 7l4 4"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="m8 13-2 9 6-3 6 3-2-9"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-6 5-6 13 0 18 6-5 6-13 0-18"/>'
};
const icon = (name,sz=20) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.help}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const init = () => ({ subjects:[], events:[], reminders:[], settings:{dark:false,large:false,contrast:false,voice:false}, notes:[] });
let state;
try { const saved=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(LEGACY_KEY)||'null'); state=saved && typeof saved==='object' ? {...init(),...saved,settings:{...init().settings,...saved.settings}} : init(); } catch {state=init();}
for (const arrayKey of ['subjects','events','reminders','notes']) if (!Array.isArray(state[arrayKey])) state[arrayKey]=[];
let page='inicio', chatTab='chat', searchTab='todos', searchText='', calendarFilter='cursada', editReminder=null, deferredInstall=null;
let chat=[{from:'bot',text:'¡Hola! 👋 Soy h.UBA, tu asistente de demostración. Puedo orientarte sobre las secciones de esta app y ayudarte a organizarte. Para trámites e información académica, verificá siempre los canales oficiales de la UBA.'}];
const persist = () => {try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('No se pudieron guardar los cambios en este dispositivo.');}};
const uid = () => crypto?.randomUUID?.() || String(Date.now())+'-'+String(Math.random()).slice(2);
const dateToday = () => {let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const fmtDate = date => {if(!date) return 'Sin fecha';const [y,m,d]=date.slice(0,10).split('-').map(Number);return new Intl.DateTimeFormat('es-AR',{day:'numeric',month:'short',year:'numeric'}).format(new Date(y,m-1,d));};
const PERSONAL_DATES = [
 {id:'icp2-parcial-2-2026',title:'2.º parcial de ICP2',date:'2026-11-02',type:'Exámenes',origin:'Fechas de cursada',details:'Introducción al Conocimiento Proyectual II · horario a confirmar'},
 {id:'icp2-recuperatorio-2026',title:'Pedido de recuperatorio de ICP2',date:'2026-11-02',end:'2026-11-03',type:'Trámites',origin:'Fechas de cursada',details:'Período del 2 al 3 de noviembre de 2026 · modalidad a confirmar'},
 {id:'dibujo-parcial-2-2026',title:'2.º parcial de Taller de Dibujo',date:'2026-11-03',type:'Exámenes',origin:'Fechas de cursada',details:'Horario a confirmar'},
 {id:'matematica-parcial-2-2026',title:'2.º parcial de Matemática',date:'2026-11-06',type:'Exámenes',origin:'Fechas de cursada',details:'Horario a confirmar'}
];
const ACADEMIC_URL = 'https://ubaxxi.uba.ar/calendario-academico/';
const OFFICIAL_DATES = [
 {id:'2026-preingreso-feb',title:'Pre-ingreso UBA',date:'2026-02-02',end:'2026-02-18',type:'Inscripciones'},
 {id:'2026-rematriculacion-feb',title:'Re-matriculación',date:'2026-02-02',end:'2026-02-18',type:'Trámites'},
 {id:'2026-cambio-feb',title:'Cambio y simultaneidad de carrera',date:'2026-02-02',end:'2026-02-13',type:'Trámites'},
 {id:'2026-inscripcion-materias-1',title:'Inscripción a materias UBA XXI',date:'2026-02-13',end:'2026-03-01',type:'Inscripciones',details:'Abre 13/2 a las 11 h y cierra 1/3 a las 17 h'},
 {id:'2026-curso-verano',title:'Curso Intensivo de Verano',date:'2026-01-26',end:'2026-03-06',type:'Cursada'},
 {id:'2026-integrador-verano',title:'Inscripción a examen integrador · verano',date:'2026-02-18',end:'2026-02-19',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-final-feb',title:'Inscripción a final · febrero',date:'2026-02-03',end:'2026-02-04',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-preingreso-mar',title:'Pre-ingreso UBA · marzo',date:'2026-03-06',end:'2026-03-11',type:'Inscripciones'},
 {id:'2026-inscripcion-materias-mar',title:'Segunda inscripción a materias UBA XXI',date:'2026-03-06',end:'2026-03-13',type:'Inscripciones',details:'Solo ingresantes 2026 · 11 h a 17 h'},
 {id:'2026-cuatrimestre-1',title:'Primer cuatrimestre UBA XXI',date:'2026-03-05',end:'2026-06-18',type:'Cursada'},
 {id:'2026-primer-parcial-1',title:'Inscripción al primer parcial · 1.º cuatrimestre',date:'2026-03-30',end:'2026-03-31',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-segundo-parcial-1',title:'Inscripción al segundo parcial · 1.º cuatrimestre',date:'2026-05-13',end:'2026-05-14',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-anual',title:'Inicio de cursada anual 2026',date:'2026-03-05',type:'Cursada',details:'Cierre sujeto a confirmación oficial'},
 {id:'2026-anual-primer-parcial',title:'Inscripción a primer parcial · materia anual',date:'2026-05-13',end:'2026-05-14',type:'Inscripciones',details:'Abre 11 h y cierra 17 h. El segundo parcial anual no tiene fecha confirmada'},
 {id:'2026-invierno',title:'Curso Intensivo de Invierno',date:'2026-06-08',end:'2026-07-17',type:'Cursada'},
 {id:'2026-invierno-materias',title:'Inscripción a materias intensivas de invierno',date:'2026-05-27',end:'2026-06-01',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-invierno-integrador',title:'Inscripción al integrador · invierno',date:'2026-06-30',end:'2026-07-01',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-final-julio-b1',title:'Inscripción a finales julio · bloque 1',date:'2026-06-23',end:'2026-06-24',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-final-julio-b2',title:'Inscripción a finales julio · bloque 2',date:'2026-07-03',end:'2026-07-04',type:'Inscripciones',details:'Incluye ICP1, ICP2 y Matemática · abre 11 h y cierra 17 h'},
 {id:'2026-preingreso-julio',title:'Pre-ingreso UBA · julio',date:'2026-06-26',end:'2026-07-13',type:'Inscripciones'},
 {id:'2026-rematricula-julio',title:'Re-matriculación · julio',date:'2026-06-26',end:'2026-07-13',type:'Trámites'},
 {id:'2026-cambio-julio',title:'Cambio y simultaneidad de carrera · julio',date:'2026-06-26',end:'2026-07-06',type:'Trámites'},
 {id:'2026-materias-2',title:'Inscripción a materias UBA XXI · segundo cuatrimestre',date:'2026-07-08',end:'2026-07-26',type:'Inscripciones',details:'Abre 8/7 a las 11 h y cierra 26/7 a las 17 h'},
 {id:'2026-cuatrimestre-2',title:'Segundo cuatrimestre UBA XXI',date:'2026-07-30',end:'2026-11-11',type:'Cursada'},
 {id:'2026-primer-parcial-2',title:'Inscripción al primer parcial · segundo cuatrimestre',date:'2026-08-24',end:'2026-08-25',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-segundo-parcial-2',title:'Inscripción al segundo parcial · segundo cuatrimestre',date:'2026-10-05',end:'2026-10-06',type:'Inscripciones',details:'Abre 11 h y cierra 17 h; no es la fecha de rendir'},
 {id:'2026-preingreso-2027',title:'Pre-ingreso UBA para 2027 · consultar fechas',date:'2026-11-12',type:'Inscripciones',details:'El sitio oficial publica el comienzo el 12/11 y tiene un error tipográfico en la fecha de cierre. Verificá antes de tramitar.'},
 {id:'2026-final-dic-b1',title:'Inscripción a finales diciembre · bloque 1',date:'2026-11-19',end:'2026-11-20',type:'Inscripciones',details:'Abre 11 h y cierra 17 h'},
 {id:'2026-final-dic-b2',title:'Inscripción a finales diciembre · bloque 2',date:'2026-11-30',end:'2026-12-01',type:'Inscripciones',details:'Incluye ICP1, ICP2, Matemática y Taller de Dibujo · abre 11 h y cierra 17 h'}
].map(x=>({...x,origin:'Calendario académico UBA XXI',url:ACADEMIC_URL}));
const materialDocs = [
 {subject:'Introducción al Conocimiento Proyectual I (ICP1)',documents:[['Programa 2025 · Cátedra Sordelli','icp1-programa.pdf'],['Organizador 2025 · Cátedra Sordelli','icp1-organizador.pdf']]},
 {subject:'Introducción al Conocimiento Proyectual II (ICP2)',documents:[['Programa 2026 · Cátedra Sordelli','icp2-programa-2026.pdf'],['Cronograma 2.º cuatrimestre 2026 · Sordelli','icp2-cronograma-2026.pdf']]},
 {subject:'Introducción al Pensamiento Científico (IPC)',documents:[['Programa · Intensivo verano 2025, Perot','ipc-programa-2025.pdf'],['Organizador · Intensivo verano 2025, Perot','ipc-organizador-2025.pdf']]},
 {subject:'Introducción al Conocimiento de la Sociedad y el Estado (ICSE)',documents:[['Programa 2024 · Pedrosa','icse-programa-2024.pdf'],['Organizador 2024 · Pedrosa','icse-organizador-2024.pdf']]}
];
const CBC_SUBJECTS = [
 ['Introducción al Conocimiento Proyectual I','ICP1',0],
 ['Introducción al Conocimiento Proyectual II','ICP2',1],
 ['Introducción al Pensamiento Científico','IPC',2],
 ['Introducción al Conocimiento de la Sociedad y el Estado','ICSE',3],
 ['Matemática','MAT',-1],
 ['Taller de Dibujo','DIB',-1],
 ['Semiología','SEM',-1]
];
const FADU_CAREERS = [
 ['Arquitectura','https://www.fadu.uba.ar/arquitectura/'],
 ['Diseño Gráfico','https://www.fadu.uba.ar/diseno-grafico/'],
 ['Diseño de Imagen y Sonido','https://www.fadu.uba.ar/diseno-de-imagen-y-sonido/'],
 ['Diseño de Indumentaria','https://www.fadu.uba.ar/diseno-de-indumentaria/'],
 ['Diseño Textil','https://www.fadu.uba.ar/diseno-textil/'],
 ['Diseño Industrial','https://www.fadu.uba.ar/nuevo-plan-de-estudios-de-diseno-industrial/'],
 ['Planificación y Diseño del Paisaje','https://www.fadu.uba.ar/lic-en-planificacion-y-diseno-del-paisaje/']
];
const PLATFORMS = [
 ['SIU Guaraní · CBC','https://guarani.uba.ar/cbc/','Gestión académica e inscripciones'],
 ['Campus Virtual UBA XXI','https://www.ubaxxicampusvirtual.uba.ar/my/courses.php','Ingresá a tus cursos de UBA XXI'],
 ['Campus Virtual CBC','https://cbccampusvirtual.uba.ar/login/index.php','Acceso al campus de CBC'],
 ['Calendario académico UBA XXI',ACADEMIC_URL,'Fechas publicadas por UBA XXI'],
 ['Sedes CBC','https://www.cbc.uba.ar/sedes','Ubicación y consultas de sedes'],
 ['Trámites CBC','https://www.cbc.uba.ar/tramites','Trámites y gestiones oficiales'],
 ['Orientación vocacional CBC','https://www.cbc.uba.ar/orientacion-vocacional/actividades-cbc/reorientacion','Actividades de orientación y reorientación']
];
const EXAM_RESOURCES=[
 ['Modelos de parciales · UBA XXI','https://www.altillo.com/examenes/uba/ubaxxi/index.asp'],
 ['Modelos de parciales · CBC','https://www.altillo.com/examenes/uba/cbc/index.asp'],
 ['Modelos de parciales · FADU','https://www.altillo.com/examenes/uba/fadu/index.asp']
];
const linkOut = (url,title,sub='') => `<a class="card-link external-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><span class="feature-icon">${icon('globe',20)}</span><span class="grow"><strong>${esc(title)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</span>${icon('arrow',16)}</a>`;
const dateSpan = e => `${fmtDate(e.date)}${e.end && e.end!==e.date?` — ${fmtDate(e.end)}`:''}`;
const upcomingEvents = count => nextItems([...PERSONAL_DATES,...state.events,...state.reminders],count);

const navi = (id, txt, ico, active) => `<button type="button" class="nav-link ${active?'active':''}" data-go="${id}" ${active?'aria-current="page"':''}><span class="nav-icon">${icon(ico,19)}</span>${esc(txt)}</button>`;
const pageHead = (tag,title,sub) => `<div class="section-tag">${esc(tag)}</div><h1 class="page-title">${esc(title)}</h1><p class="subtitle">${esc(sub)}</p>`;
const button = (text,action,extra='',css='btn-secondary') => `<button type="button" class="btn ${css}" data-action="${action}" ${extra}>${text}</button>`;
const empty = (title,sub) => `<div class="empty">${icon('folder',27)}<strong>${esc(title)}</strong>${esc(sub)}</div>`;
const nextItems = (arr,count=3) => arr.filter(x => x.date >= dateToday() && !x.done).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,count);
function toast(text){const el=document.getElementById('toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3300);}
const renderCalendar = () => {const now=new Date(), yr=now.getFullYear(), mo=now.getMonth(), num=new Date(yr,mo+1,0).getDate(), begin=(new Date(yr,mo,1).getDay()+6)%7;let html=['L','M','M','J','V','S','D'].map(d=>`<span class="weekday">${d}</span>`).join('');for(let i=0;i<begin;i++)html+='<span></span>';for(let d=1;d<=num;d++){let date=`${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;let cl=(d===now.getDate()?'today ':'')+([...PERSONAL_DATES,...OFFICIAL_DATES,...state.events].some(e=>e.date<=date&&(e.end||e.date)>=date)?'event-day':'');html+=`<span class="day ${cl}">${d}</span>`;}return `<div class="mini-month"><strong>${new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(now)}</strong>${icon('calendar',17)}</div><div class="mini-calendar">${html}</div>`;};
function home(){
const done=state.subjects.filter(x=>x.done).length, progress=state.subjects.length?Math.round(done/state.subjects.length*100):0;
const cards=[['asistente','bot','Asistente virtual','Un lugar para empezar, explorar y consultar.'],['buscador','search','Buscador','Explorá Alejandría, Códice y tus notas.'],['plan','book','Plan de estudio','Organizá las materias y registrá tu progreso.'],['calendario','calendar','Calendario','Reuní exámenes, clases, eventos y entregas.']];
return `<div class="home-layout"><div><section class="hero"><div class="hero-copy"><span class="section-tag">TU ESPACIO DE ESTUDIO</span><h1>Tu camino en la UBA,<br>más simple.</h1><p>Todo para planificar, descubrir recursos y avanzar a tu ritmo, en un solo lugar.</p><div class="btn-row"><button data-go="asistente" class="btn btn-primary">${icon('spark',17)} Preguntale a h.UBA</button><button data-go="mis-cosas" class="btn btn-secondary">Mis cosas ${icon('arrow',15)}</button></div></div><img class="hero-robot" src="./assets/robot.png" alt="Robot ilustrado de h.UBA"></section>
<div class="summary-grid"><div class="stat-card"><span class="stat-icon">${icon('book',20)}</span><div><strong>${state.subjects.length}</strong><small>Mis materias</small></div></div><div class="stat-card"><span class="stat-icon">${icon('calendar',20)}</span><div><strong>${nextItems([...PERSONAL_DATES,...state.events],999).length}</strong><small>Próximos eventos</small></div></div><div class="stat-card"><span class="stat-icon">${icon('award',20)}</span><div><strong>${progress}%</strong><small>Progreso</small></div></div></div>
<div class="section-heading"><h2>¿Qué querés hacer hoy?</h2><span>Accesos rápidos</span></div><div class="feature-grid">${cards.map(([id,ico,name,desc])=>`<button data-go="${id}" class="feature-card"><span class="feature-icon">${icon(ico,23)}</span><span class="arrow">${icon('arrow',17)}</span><h3>${name}</h3><p>${desc}</p></button>`).join('')}</div><section class="panel quick-access"><h3>Accesos universitarios</h3><div class="quick-access-grid">${PLATFORMS.slice(0,4).map(([n,u,d])=>linkOut(u,n,d)).join('')}</div></section></div>
<aside class="right-column"><div class="stack"><div class="panel sidebar-panel"><h3>Tu calendario</h3>${renderCalendar()}<div class="divider"></div><button data-go="calendario" class="btn btn-light btn-compact">Ver calendario ${icon('arrow',14)}</button></div><div class="panel"><h3>Próximas fechas</h3><div class="plain-list">${upcomingEvents(5).length?upcomingEvents(5).map(x=>`<div class="list-item"><span class="feature-icon">${icon('clock',17)}</span><div class="grow"><strong>${esc(x.title)}</strong><p>${dateSpan(x)}</p></div></div>`).join(''):'<p class="tiny-note">No hay compromisos próximos cargados.</p>'}</div></div></div><div class="right-promo"><h3>¡Hola, soy h.UBA!</h3><p>¿Necesitás una mano para organizar tus estudios?</p><button class="btn btn-primary btn-compact" data-go="asistente">Charlamos ${icon('arrow',14)}</button><img src="./assets/robot.png" alt=""></div></aside></div>`;
}
const chatAnswers=[
  {keys:['cbc','ciclo basico'],reply:'El Ciclo Básico Común (CBC) forma parte del recorrido de ingreso a varias carreras de la UBA. Para requisitos, inscripción y fechas vigentes, consultá la información oficial de la universidad. Desde Calendario podés guardar tus fechas importantes.'},
  {keys:['inscrip','guarani','trámite','tramite'],reply:'Las inscripciones, trámites y gestión académica dependen de la unidad académica. Consultá los canales oficiales de la UBA o de tu facultad. Si tenés una fecha, podés registrarla en Calendario.'},
  {keys:['materia','estudi','organiza','plan'],reply:'En «Plan de estudio» podés agregar materias, marcarlas como completadas y visualizar tu avance. También tenés «Mis cosas» para ver tus contenidos guardados.'},
  {keys:['examen','parcial','fecha','calendario'],reply:'Entrá a «Calendario» y agregá el examen o la entrega con su fecha. Podés crear un recordatorio separado en «Recordatorios».'},
  {keys:['biblioteca','alejandria','apunte','códice','codice'],reply:'En «Buscador» podés elegir Alejandría para acceder a ocho bibliotecas y repositorios digitales, Códice para consultar modelos de parciales y «PDF por materia» para abrir los programas y organizadores disponibles. Los enlaces se abren en sus sitios de origen.'},
  {keys:['vocacion','orientaci','carrera'],reply:'La sección Orientación está dividida en vocacional y universitaria. Por ahora esta demo ofrece orientación general; para asesoramiento formal, recurrí a los servicios oficiales de la UBA.'},
  {keys:['soporte','ayuda','contacto'],reply:'En «Ayuda / FAQ» tenés preguntas frecuentes sobre el uso de la app. «Soporte» contiene las opciones de contacto y derivación que quedan previstas para integrar.'}
];
function ask(text){chat.push({from:'user',text});let q=text.toLocaleLowerCase('es-AR');let result=chatAnswers.find(r=>r.keys.some(k=>q.includes(k)));chat.push({from:'bot',text:result?result.reply:'Puedo ayudarte con materias, calendario, apuntes, CBC, trámites y orientación general. Mis respuestas son orientativas. Para información vigente, consultá los enlaces oficiales.'});if(page==='asistente')render();requestAnimationFrame(()=>{let el=document.querySelector('.chat-window');if(el)el.scrollTop=el.scrollHeight;});}
function assistant(){
const tabs=[['chat','Preguntale a h.UBA'],['conoce','Conocé la UBA'],['estudia','Estudiá en la UBA'],['orientacion','Orientación'],['derivaciones','Derivaciones']];
let html=`${pageHead('TE ACOMPAÑAMOS','Asistente virtual','Información inicial, orientación y herramientas para tu recorrido universitario.')}<div class="notice">Las respuestas del chat son orientativas y predefinidas. Para gestiones académicas, usá siempre los enlaces oficiales.</div><div class="tabs" role="tablist">${tabs.map(([id,name])=>`<button class="tab" role="tab" data-tab="${id}" aria-selected="${id===chatTab}">${name}</button>`).join('')}</div>`;
if(chatTab==='chat') html+=`<div class="page-grid"><section class="panel"><h3>${icon('bot',21)} Chat con h.UBA</h3><div class="chat-window" role="log" aria-live="polite">${chat.map(m=>`<div class="chat-msg ${m.from==='user'?'user':''}"><small>${m.from==='user'?'Vos':'h.UBA · demo'}</small>${esc(m.text)}</div>`).join('')}</div><form id="chat-form" class="chat-compose"><input aria-label="Escribí tu pregunta" name="message" placeholder="Escribí tu pregunta..." maxlength="500" required autocomplete="off"><button class="btn btn-primary" type="submit" aria-label="Enviar">${icon('send',19)}</button><button class="btn btn-secondary" type="button" data-action="voice-input" aria-label="Dictar pregunta">${icon('mic',18)}</button></form><div class="chip-row">${['¿Cómo organizo mis materias?','¿Qué es el CBC?','¿Dónde están los apuntes?'].map(s=>`<button class="chip" type="button" data-ask="${esc(s)}">${esc(s)}</button>`).join('')}</div></section><aside class="panel"><h3>También podés</h3><div class="plain-list">${[['plan','Organizar materias','book'],['calendario','Anotar fechas','calendar'],['buscador','Explorar recursos','search']].map(([p,t,i])=>`<button class="card-link" data-go="${p}">${icon(i,19)} <span class="grow"><strong>${t}</strong></span>${icon('arrow',15)}</button>`).join('')}</div></aside></div>`;
else{let details={conoce:[['Conocé la UBA','Explorá la universidad, sus unidades académicas y los canales oficiales de información.'],['Preguntas frecuentes','Inscripción, documentación y trámites requieren información actualizada de las fuentes oficiales.']],estudia:[['Recorrido universitario','Organizá tus materias, fechas de cursada y progreso desde esta aplicación.'],['Herramientas','Guardá eventos, recordatorios y notas personales.']],orientacion:[['Orientación vocacional','Un espacio previsto para acercar recursos de elección de carrera.'],['Orientación universitaria','Información y acompañamiento sobre la vida universitaria.']],derivaciones:[['Consultas administrativas','Previsto para derivar consultas a las áreas correspondientes.'],['Docentes','Canal a integrar con unidades académicas y equipos docentes.'],['Soporte técnico','Asistencia sobre el funcionamiento de la aplicación.']]}[chatTab];html+=`<div class="module-grid">${details.map(([t,d])=>`<section class="panel"><span class="feature-icon">${icon('globe',23)}</span><h3 style="margin-top:13px">${t}</h3><p class="tiny-note">${d}</p></section>`).join('')}</div><section class="panel" style="margin-top:17px"><h3>Enlaces oficiales y de interés</h3><div class="module-grid">${PLATFORMS.filter((l)=>chatTab==='orientacion'?l[0].includes('Orientación')||l[0].includes('Sedes'):l[0]!=='Orientación vocacional CBC').map(([n,u,d])=>linkOut(u,n,d)).join('')}</div></section>`;}
return html;
}
const resources = [
 {group:'alejandria',title:'Open Library',body:'Catálogo abierto de libros, con opciones de lectura y préstamo digital.',url:'https://openlibrary.org/?lang=es'},
 {group:'alejandria',title:'Redalyc',body:'Revistas y artículos científicos de acceso abierto, especialmente de Iberoamérica.',url:'https://www.redalyc.org/'},
 {group:'alejandria',title:'Biblioteca FADU · UBA',body:'Recurso de la biblioteca de la Facultad de Arquitectura, Diseño y Urbanismo.',url:'https://biblioteca.fadu.uba.ar/tiki/tiki-read_article.php?articleId=894'},
 {group:'alejandria',title:'Biblioteca Digital Mundial',body:'Colección de patrimonio cultural de todo el mundo, alojada en la Biblioteca del Congreso de Estados Unidos.',url:'https://www.loc.gov/collections/world-digital-library/about-this-collection/'},
 {group:'alejandria',title:'Project Gutenberg',body:'Biblioteca de libros electrónicos gratuitos, principalmente obras de dominio público.',url:'https://www.gutenberg.org/'},
 {group:'alejandria',title:'Biblioteca Virtual Miguel de Cervantes',body:'Literatura y patrimonio documental en español, con colecciones de autores y obras.',url:'https://www.cervantesvirtual.com/'},
 {group:'alejandria',title:'Europeana',body:'Arte, libros y documentos del patrimonio cultural digital europeo.',url:'https://www.europeana.eu/es'},
 {group:'alejandria',title:'Internet Archive',body:'Colecciones digitales de libros, publicaciones, audio, video y archivos históricos.',url:'https://archive.org/'},
 {group:'codice',title:'Parciales de UBA XXI',body:'Ejemplos de parciales compartidos en Altillo (fuente externa, no oficial).',url:'https://www.altillo.com/examenes/uba/ubaxxi/index.asp'},
 {group:'codice',title:'Parciales del CBC',body:'Ejemplos de parciales compartidos en Altillo (fuente externa, no oficial).',url:'https://www.altillo.com/examenes/uba/cbc/index.asp'},
 {group:'codice',title:'Parciales FADU',body:'Ejemplos de parciales compartidos en Altillo (fuente externa, no oficial).',url:'https://www.altillo.com/examenes/uba/fadu/index.asp'},
 ...materialDocs.flatMap(m=>m.documents.map(([label,path])=>({group:'materiales',title:`${m.subject} · ${label}`,body:'Material PDF adjuntado, disponible dentro de la aplicación.',url:`./materiales/${path}`,local:true})))
];
function searchResults(){
 const terms=searchText.toLocaleLowerCase('es-AR');
 const list=resources.filter(r=>(searchTab==='todos'||r.group===searchTab)&&(`${r.title} ${r.body}`).toLocaleLowerCase('es-AR').includes(terms));
 const notes=searchTab==='todos'?state.notes.filter(n=>!terms||n.text.toLocaleLowerCase('es-AR').includes(terms)):[];
 return `<div class="module-grid">${list.map(r=>`<article class="resource"><small>${r.group==='materiales'?'PDF ADJUNTO':r.group==='alejandria'?'ALEJANDRÍA':'CÓDICE'}</small><h3>${esc(r.title)}</h3><p>${esc(r.body)}</p><a class="btn btn-secondary btn-compact" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${icon(r.local?'book':'globe',15)} ${r.local?'Abrir PDF':'Visitar recurso'} ${icon('arrow',14)}</a></article>`).join('')}${notes.map(n=>`<article class="resource"><small>MIS APUNTES</small><h3>Nota personal</h3><p>${esc(n.text)}</p><button class="btn btn-danger btn-compact" data-delete-note="${esc(n.id)}">${icon('trash',14)} Eliminar</button></article>`).join('')}</div>${!list.length&&!notes.length?empty('Sin coincidencias','Probá con otros términos o cambiá el filtro.'):''}`;
}
function buscador(){return `${pageHead('BIBLIOTECA Y MATERIALES','Buscador','Explorá bibliotecas digitales, modelos de parciales y programas PDF asociados a materias.')}<section class="panel"><div class="field"><label for="query">¿Qué estás buscando?</label><input id="query" class="input-search" type="search" value="${esc(searchText)}" placeholder="ICP2, Matemática, parciales, apuntes..." autocomplete="off"></div><div class="tabs" style="margin-top:15px;margin-bottom:13px">${[['todos','Todos'],['materiales','PDF por materia'],['alejandria','Alejandría'],['codice','Códice / Parciales']].map(([id,t])=>`<button class="tab" data-search-tab="${id}" aria-selected="${id===searchTab}">${t}</button>`).join('')}</div><div id="search-results">${searchResults()}</div></section><section class="panel" style="margin-top:17px"><h3>Guardar nota de estudio</h3><form id="note-form" class="form-grid"><div class="field full"><label for="note">Texto de la nota</label><textarea id="note" name="text" maxlength="2000" required placeholder="Una idea o apunte para recordar"></textarea></div><div class="form-actions"><button class="btn btn-primary" type="submit">${icon('plus',16)} Guardar nota</button></div></form></section>`;}
function carreras(){return `${pageHead('CONOCÉ FADU','Carreras y planes de estudio','Explorá la oferta académica de Arquitectura, Diseño y Urbanismo.')}
<section class="panel"><h3>Carreras y planes oficiales</h3><div class="module-grid">${FADU_CAREERS.map(([n,u])=>linkOut(u,n,'Sitio de FADU · UBA')).join('')}</div></section>
<section class="panel" style="margin-top:18px"><h3>Materias y recursos del CBC</h3><p class="tiny-note">Los programas y organizadores adjuntos están clasificados en Buscador, bajo «PDF por materia». No se agregaron materiales de Matemática ni Taller de Dibujo porque no se adjuntaron sus programas.</p><button class="btn btn-primary" data-go="buscador">${icon('book',17)} Consultar material de estudio</button></section>`;}
function acerca(){return `${pageHead('ACERCA DEL PROYECTO','Acerca de h.UBA','Presentación de la propuesta académica.')}
<div class="about-panel panel"><img src="./assets/robot.png" alt="Mascota de h.UBA"><div><h2>h.UBA</h2><p class="about-lead">App prototipo hecha por <strong>Patricia Retamozo</strong> para la materia <strong>Introducción al Conocimiento Proyectual 2</strong>.</p><p>Una propuesta de acompañamiento estudiantil para centralizar recursos académicos, consultas y organización personal.</p><p class="tiny-note">Trabajo académico independiente. No es una aplicación oficial de la Universidad de Buenos Aires. Los enlaces externos conducen a sus respectivos sitios; no solicita credenciales institucionales.</p></div></div>`;}
function misCosas(){const done=state.subjects.filter(s=>s.done).length;return `${pageHead('TU ESPACIO','Mis cosas','Tus materias, apuntes y accesos, en un solo lugar.')}<div class="module-grid">${[['asistente','bot','h.UBA','Asistente virtual'],['buscador','book','Apuntes','Guardaste '+state.notes.length+' notas'],['buscador','folder','Biblioteca','Explorar recursos'],['plan','book','Materias',state.subjects.length+' materias registradas'],['plan','award','Plan de estudio',done+' completadas'],['calendario','calendar','Calendario',state.events.length+' eventos']].map(([p,i,t,d])=>`<button class="card-link" data-go="${p}"><span class="feature-icon">${icon(i,21)}</span><span class="grow"><strong>${t}</strong><small>${d}</small></span>${icon('arrow',16)}</button>`).join('')}</div>`;}
function plan(){const done=state.subjects.filter(x=>x.done).length, pct=state.subjects.length?Math.round(done/state.subjects.length*100):0;
return `${pageHead('AVANZÁ A TU RITMO','Plan de estudio','Agregá materias, fijá objetivos y registrá lo que completaste.')}<div class="page-grid"><div class="stack"><section class="panel"><h3>Tus materias <span class="label-badge">${done}/${state.subjects.length} completadas</span></h3><div class="progress"><span style="width:${pct}%"></span></div><p class="tiny-note">Progreso registrado: ${pct}%</p><div class="plain-list">${state.subjects.length?state.subjects.map(s=>`<div class="list-item ${s.done?'done':''}"><input type="checkbox" ${s.done?'checked':''} data-check-subject="${esc(s.id)}" aria-label="Completar ${esc(s.title)}"><div class="grow"><strong>${esc(s.title)}</strong><p>${s.goal?`Meta: ${esc(s.goal)}`:'Sin meta configurada'}</p></div><button class="icon-btn" data-delete-subject="${esc(s.id)}" aria-label="Eliminar ${esc(s.title)}">${icon('trash',17)}</button></div>`).join(''):empty('Agregá tu primera materia','Podés marcarla como completada cuando avances.')}</div></section></div><aside class="panel"><h3>Agregar materia</h3><form id="subject-form" class="form-grid"><div class="field full"><label for="subject-title">Nombre</label><input id="subject-title" name="title" required maxlength="80" placeholder="Ej. Matemática"></div><div class="field full"><label for="subject-goal">Meta (opcional)</label><input id="subject-goal" name="goal" maxlength="120" placeholder="Ej. Aprobar el primer parcial"></div><div class="form-actions"><button class="btn btn-primary" type="submit">${icon('plus',16)} Agregar</button></div></form></aside></div><section class="panel" style="margin-top:18px"><h3>Materias del CBC · materiales asociados</h3><p class="tiny-note">Programas y organizadores disponibles de los períodos indicados en los PDF. Para materias sin archivos, se ofrece el acceso al buscador y se pueden agregar al plan personal.</p><div class="module-grid">${CBC_SUBJECTS.map(([n,code,idx])=>`<div class="subject-card"><strong>${esc(n)}</strong><small>${esc(code)} · ${idx>=0?`${materialDocs[idx].documents.length} documentos PDF`:'Sin archivos adjuntos'}</small><div class="btn-row"><button class="btn btn-primary btn-compact" data-add-cbc="${esc(n)}">${icon('plus',14)} Agregar al plan</button>${idx>=0?`<button class="btn btn-secondary btn-compact" data-go="buscador" data-pdf-subject="${esc(code)}">${icon('book',14)} Ver PDFs</button>`:''}</div></div>`).join('')}</div></section>`;}
function calendario(){
 const all=[...PERSONAL_DATES,...OFFICIAL_DATES,...state.events].sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));
 const selected=calendarFilter;
 const visible=all.filter(x=>selected==='todos'||(selected==='cursada' && x.origin!=='Calendario académico UBA XXI')||(selected==='oficial' && x.origin==='Calendario académico UBA XXI'));
 const upcoming=upcomingEvents(8);
 return `${pageHead('FECHAS Y AGENDA','Calendario 2026','Tus próximos parciales, trámites, recordatorios y fechas oficiales de UBA XXI.')}
 <section class="panel key-dates"><h3>${icon('clock',20)} Próximas fechas importantes</h3><div class="deadline-grid">${upcoming.length?upcoming.map(e=>`<div class="deadline-card"><span>${fmtDate(e.date).replace(' de ',' ')}</span><strong>${esc(e.title)}</strong><small>${e.end?'Hasta '+fmtDate(e.end):esc(e.type)}</small></div>`).join(''):empty('Sin próximas fechas','No hay eventos pendientes para los próximos días.')}</div></section>
 <div class="calendar-layout"><section class="panel"><div class="section-heading"><h2>Agenda de eventos</h2><span>${visible.length} registros</span></div><div class="tabs calendar-filters" role="group" aria-label="Filtrar eventos">${[['cursada','Fechas de cursada'],['oficial','UBA XXI 2026'],['todos','Todos']].map(([k,t])=>`<button class="tab" data-calendar-filter="${k}" aria-selected="${selected===k}">${t}</button>`).join('')}</div>
 <div class="notice academic-note">${selected==='oficial'?'Fechas extraídas del calendario académico de UBA XXI. Las inscripciones a parciales no son las fechas de examen.':selected==='cursada'?'Los parciales y el recuperatorio indicados son fechas proporcionadas para este prototipo; verificá el horario en tu cátedra.':'Se muestran tanto las fechas de cursada como las del calendario académico oficial.'} <a href="${ACADEMIC_URL}" target="_blank" rel="noopener noreferrer">Consultar fuente oficial</a></div>
 <div class="plain-list event-list">${visible.length?visible.map(e=>`<div class="list-item event-row"><span class="event-date"><b>${e.date.slice(8,10)}</b><small>${new Intl.DateTimeFormat('es-AR',{month:'short'}).format(new Date(e.date+'T12:00:00'))}</small></span><div class="grow"><strong>${esc(e.title)}</strong><p>${dateSpan(e)} · ${esc(e.type)}${e.details?` · ${esc(e.details)}`:''}</p><span class="badge-small ${e.origin==='Calendario académico UBA XXI'?'source-academic':'source-personal'}">${esc(e.origin||'Mis eventos')}</span>${e.url?` <a class="source-link" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a>`:''}</div>${!e.origin?`<button class="icon-btn" data-delete-event="${esc(e.id)}" aria-label="Eliminar ${esc(e.title)}">${icon('trash',17)}</button>`:''}</div>`).join(''):empty('No hay eventos','Agregá el primer evento a tu agenda.')}</div></section>
 <aside class="stack"><section class="panel"><h3>Agregar evento personal</h3><form id="event-form" class="form-grid"><div class="field full"><label for="event-title">Título</label><input id="event-title" name="title" maxlength="100" required placeholder="Ej. Parcial de Matemática"></div><div class="field full"><label for="event-date">Fecha</label><input id="event-date" name="date" type="date" value="${dateToday()}" required></div><div class="field full"><label for="event-type">Tipo</label><select id="event-type" name="type"><option>Clases</option><option>Exámenes</option><option>Entregas</option><option>Inscripciones</option><option>Trámites</option><option>Eventos</option></select></div><div class="form-actions"><button type="submit" class="btn btn-primary">${icon('plus',15)} Agregar evento</button></div></form></section><section class="panel"><h3>Calendario de este mes</h3>${renderCalendar()}</section><section class="panel"><h3>Calendario académico oficial</h3><p class="tiny-note">Las fechas pueden modificarse por cuestiones organizativas. Consultá siempre los avisos oficiales.</p>${linkOut(ACADEMIC_URL,'Ver UBA XXI 2026')}</section></aside></div>`;
}
function reminders(){const e=state.reminders.find(x=>x.id===editReminder);return `${pageHead('NO TE OLVIDES','Recordatorios','Creá, modificá y organizá tus pendientes personales.')}<div class="page-grid"><section class="panel"><h3>Recordatorios <span class="label-badge">${state.reminders.length}</span></h3><div class="plain-list">${state.reminders.length?state.reminders.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>`<div class="list-item ${r.done?'done':''}"><input type="checkbox" ${r.done?'checked':''} data-check-reminder="${esc(r.id)}" aria-label="Marcar ${esc(r.title)}"><div class="grow"><strong>${esc(r.title)}</strong><p>${fmtDate(r.date)}</p></div><div class="actions"><button class="icon-btn" data-edit-reminder="${esc(r.id)}" aria-label="Editar ${esc(r.title)}">${icon('edit',16)}</button><button class="icon-btn" data-delete-reminder="${esc(r.id)}" aria-label="Eliminar ${esc(r.title)}">${icon('trash',16)}</button></div></div>`).join(''):empty('Todo al día','Todavía no creaste recordatorios.')}</div></section><aside class="panel"><h3>${e?'Editar recordatorio':'Nuevo recordatorio'}</h3><form id="reminder-form" class="form-grid"><div class="field full"><label for="reminder-title">Descripción</label><input id="reminder-title" name="title" maxlength="100" required value="${esc(e?.title||'')}" placeholder="Ej. Preparar la entrega"></div><div class="field full"><label for="reminder-date">Fecha</label><input id="reminder-date" name="date" type="date" required value="${esc(e?.date||dateToday())}"></div><div class="form-actions">${e?`<button type="button" class="btn btn-secondary" data-action="cancel-reminder">Cancelar</button>`:''}<button type="submit" class="btn btn-primary">${icon(e?'check':'plus',16)} ${e?'Guardar cambios':'Crear'}</button></div></form><p class="tiny-note">Los recordatorios se guardan en este dispositivo. No envían avisos automáticos con la app cerrada.</p></aside></div>`;}
const faqItems=[
 ['¿Cómo agrego una materia?','Entrá a Plan de estudio, escribí el nombre y una meta opcional y presioná Agregar. Podés marcarla como completada.'],
 ['¿Dónde se guardan mis datos?','En el almacenamiento local de este navegador o de la app instalada. No se sincronizan con una cuenta y pueden perderse si borrás los datos del sitio o la aplicación.'],
 ['¿Está conectado con SIU Guaraní?','No solicita usuario y contraseña. Podés abrir SIU Guaraní CBC desde los accesos oficiales de la app.'],
 ['¿Cómo responde el asistente?','Ofrece respuestas predefinidas de orientación y enlaces a fuentes externas.'],
 ['¿Puedo recibir notificaciones automáticas?','Todavía no. La sección Recordatorios almacena pendientes, pero no programa notificaciones cuando la app está cerrada.'],
 ['¿La app es oficial de la UBA?','No. Es un prototipo independiente basado en una propuesta de experiencia estudiantil; no implica aprobación ni afiliación institucional.']
];
const faq = () => `<div class="panel">${faqItems.map(([q,a])=>`<details class="faq-item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
function ayuda(){return `${pageHead('PREGUNTAS Y RESPUESTAS','Ayuda / FAQ','Encontrá respuestas rápidas sobre el funcionamiento del prototipo.')}${faq()}`;}
function configuration(){return `${pageHead('A TU MANERA','Configuración','Ajustá la apariencia y las opciones de accesibilidad.')}<div class="page-grid"><div class="stack"><section class="panel"><h3>${icon('moon',19)} Apariencia</h3>${[
 ['dark','Modo día / noche','Cambiá el tema visual'],['large','Tamaño de fuente grande','Aumentá el tamaño general de los textos'],['contrast','Alto contraste','Mejorá la diferenciación entre los elementos']
].map(([id,t,d])=>`<label class="toggle-line"><span><strong>${t}</strong><small>${d}</small></span><input class="switch" data-setting="${id}" type="checkbox" ${state.settings[id]?'checked':''} aria-label="${t}"></label>`).join('')}</section><section class="panel"><h3>${icon('mic',19)} Accesibilidad y voz</h3><label class="toggle-line"><span><strong>Lectura de respuestas</strong><small>Texto a audio usando la función del dispositivo, si está disponible</small></span><input class="switch" data-setting="voice" type="checkbox" ${state.settings.voice?'checked':''}></label><div class="divider"></div><p class="tiny-note">El dictado de voz se ofrece donde el navegador Android lo permita. Los permisos del micrófono los administra Android.</p></section></div><aside class="stack"><section class="panel"><h3>Perfil y privacidad</h3><p class="tiny-note">Modo invitado. Esta demo no tiene login ni envía datos a un servidor.</p><span class="label-badge">Datos almacenados localmente</span><div class="divider"></div>${button(`${icon('trash',16)} Borrar mis datos`,'clear-data','','btn-danger')}</section><section class="panel"><h3>Información</h3><p class="tiny-note">Prototipo académico de Patricia Retamozo, para Introducción al Conocimiento Proyectual 2.</p><button data-go="acerca" class="btn btn-secondary">Acerca de h.UBA</button><div class="divider"></div><h3>Instalación</h3><p class="tiny-note">En Android, abrí la web en Chrome y elegí «Instalar app» o «Agregar a pantalla principal».</p>${button(`${icon('download',15)} Instalar`, 'install','','btn-primary')}</section></aside></div>`;}
function mas(){return `${pageHead('EXPLORÁ h.UBA','Más opciones','Elegí una sección para continuar.')}<div class="module-grid">${NAV.filter(x=>!['inicio','asistente','buscador','mis-cosas','calendario'].includes(x[0])).map(([id,title,ico])=>`<button class="card-link" data-go="${id}"><span class="feature-icon">${icon(ico,20)}</span><span class="grow"><strong>${esc(title)}</strong></span>${icon('arrow',16)}</button>`).join('')}</div>`;}
function soporte(){return `${pageHead('ESTAMOS PARA AYUDARTE','Soporte','Canales de consulta previstos para la futura versión integrada.')}<div class="module-grid"><section class="panel"><span class="feature-icon">${icon('help',21)}</span><h3 style="margin-top:12px">Preguntas frecuentes</h3><p class="tiny-note">Consultá instrucciones sobre el uso de la app.</p><button data-go="ayuda" class="btn btn-secondary">Ver FAQ ${icon('arrow',15)}</button></section><section class="panel"><span class="feature-icon">${icon('bot',21)}</span><h3 style="margin-top:12px">Chatbot</h3><p class="tiny-note">Probá el asistente de respuestas predefinidas.</p><button data-go="asistente" class="btn btn-secondary">Abrir chat ${icon('arrow',15)}</button></section><section class="panel"><span class="feature-icon">${icon('mail',21)}</span><h3 style="margin-top:12px">Contacto</h3><p class="tiny-note">Falta configurar una dirección institucional para recibir consultas. No se simula un envío.</p><span class="label-badge">Pendiente de integración</span></section><section class="panel"><span class="feature-icon">${icon('headphones',21)}</span><h3 style="margin-top:12px">Derivación a soporte</h3><p class="tiny-note">Se podrá derivar el caso a soporte técnico, administración o docentes cuando existan sistemas habilitados.</p><span class="label-badge">Próxima etapa</span></section></div>`;}
function compartir(){if(location.hostname==='appassets.androidplatform.net')return `${pageHead('COMPARTIR','Acceso por QR','El QR público se genera al publicar la versión web en GitHub Pages.')}<div class="panel"><p class="tiny-note">Esta es la copia offline del APK. Para compartir el acceso con otras personas, publicá la carpeta web siguiendo el README y usá el QR generado en la versión online.</p></div>`;const link=location.href.split('#')[0];return `${pageHead('COMPARTIR','Acceder por QR','Una vez publicada la app en GitHub Pages, el QR se genera automáticamente en el sitio.')}<section class="panel" style="max-width:550px"><img src="./qr.png" alt="Código QR del acceso público, disponible después de publicar" style="width:225px;height:225px;display:block;margin:8px auto 16px" onerror="this.style.display='none';document.getElementById('qr-status').textContent='El QR se generará al publicar el repositorio mediante GitHub Actions.'"><p id="qr-status" class="tiny-note" style="text-align:center">Escaneá este código con Android para abrir e instalar h.UBA.</p><div class="field"><label for="share-url">Dirección de la aplicación</label><input id="share-url" readonly value="${esc(link)}" /></div><div class="btn-row" style="margin-top:15px">${button(`${icon('share',15)} Copiar enlace`,'copy-link','','btn-primary')}<a class="btn btn-secondary" href="./qr.png" download="huba-qr.png">${icon('download',15)} Descargar QR</a></div></section>`;}
function applyAppearance(){document.documentElement.classList.toggle('dark',!!state.settings.dark);document.documentElement.classList.toggle('font-large',!!state.settings.large);document.documentElement.classList.toggle('high-contrast',!!state.settings.contrast);}
function render(){applyAppearance();const valid=NAV.some(n=>n[0]===page)||page==='compartir'||page==='correo'||page==='mas';if(!valid)page='inicio';const p=page==='correo'?'Contacto':page==='mas'?'Más opciones':(NAV.find(n=>n[0]===page)?.[1]||'Compartir');const desktop=NAV.map(([id,t,i],idx)=>`${idx===0?'<div class="nav-caption">PRINCIPAL</div>':''}${id==='correo'?'<div class="nav-caption">MÁS OPCIONES</div>':''}${navi(id,t,i,page===id)}`).join('');const routes={inicio:home,asistente:assistant,buscador, 'mis-cosas':misCosas,plan,carreras,calendario,recordatorios:reminders,acerca,ayuda,configuracion:configuration,soporte,compartir,mas,correo:soporte};
document.getElementById('app').innerHTML=`<aside class="sidebar"><a class="brand" href="#inicio" aria-label="h.UBA, ir al inicio"><img class="brand-logo" src="./assets/robot.png" alt=""><span><span class="brand-text">h.UBA</span><span class="brand-sub" style="display:block">Espacio estudiantil</span></span></a><nav aria-label="Navegación principal">${desktop}</nav><div class="sidebar-bottom"><strong>h.UBA · Prototipo</strong>Proyecto académico de Patricia Retamozo</div></aside><div class="main-wrap"><header class="topbar"><div class="breadcrumbs">h.UBA <span style="margin:0 9px">/</span> <strong>${esc(p)}</strong></div><div class="top-actions"><span class="demo-pill">PROTOTIPO</span><button class="icon-btn" data-go="compartir" aria-label="Compartir aplicación" title="Compartir">${icon('share',19)}</button><button class="icon-btn" data-go="recordatorios" aria-label="Ver recordatorios" title="Recordatorios">${icon('bell',18)}</button><span class="avatar" title="Modo invitado">U</span></div></header><main class="content" id="main">${routes[page]()}<p class="footnote">h.UBA · Prototipo independiente y no oficial. Sin integración con sistemas académicos.</p></main></div><nav class="mobile-nav" aria-label="Navegación móvil">${[['inicio','home','Inicio'],['asistente','bot','Chat'],['buscador','search','Buscar'],['calendario','calendar','Agenda'],['mis-cosas','folder','Mis cosas'],['mas','menu','Más']].map(([id,i,t])=>`<button class="${page===id?'active':''}" data-go="${id}" ${page===id?'aria-current="page"':''}>${icon(i,22)}<span>${t}</span></button>`).join('')}</nav>`;}
function go(id){if(id==='correo'){page='soporte';toast('El correo institucional aún no está configurado.');}else page=id;const hash='#'+page;if(location.hash!==hash)history.pushState({page},'',hash);render();window.scrollTo({top:0,behavior:'instant'});}
function voiceInput(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('El dictado no está disponible en este navegador.');return;}const sr=new SR();sr.lang='es-AR';sr.interimResults=false;sr.onresult=e=>{let txt=e.results?.[0]?.[0]?.transcript;if(txt)ask(txt);};sr.onerror=()=>toast('No se pudo realizar el dictado. Revisá el micrófono.');sr.start();toast('Escuchando pregunta…');}
function speak(text){if(!state.settings.voice||!('speechSynthesis' in window))return;const msg=new SpeechSynthesisUtterance(text);msg.lang='es-AR';msg.rate=1;window.speechSynthesis.cancel();window.speechSynthesis.speak(msg);}
function update(){persist();render();}
document.addEventListener('click',e=>{
 if(location.hostname!=='appassets.androidplatform.net')return;
 const link=e.target.closest('a[href]');
 if(!link)return;
 const url=new URL(link.getAttribute('href'),location.href);
 if(url.protocol==='https:' && (url.host!=='appassets.androidplatform.net'||url.pathname.includes('/materiales/'))){
   e.preventDefault();window.location.assign(url.href);
 }
},true);
document.addEventListener('click',async e=>{
 const elem=e.target.closest('button,[data-go]');if(!elem)return;
 if(elem.dataset.pdfSubject){searchTab='materiales';searchText=elem.dataset.pdfSubject;go('buscador');return;}
 if(elem.dataset.go){go(elem.dataset.go);return;}
 if(elem.dataset.tab){chatTab=elem.dataset.tab;render();return;}
 if(elem.dataset.searchTab){searchTab=elem.dataset.searchTab;render();return;}
 if(elem.dataset.calendarFilter){calendarFilter=elem.dataset.calendarFilter;render();return;}
 if(elem.dataset.ask){ask(elem.dataset.ask);speak(chat.at(-1).text);return;}
 if(elem.dataset.addCbc){const title=elem.dataset.addCbc;if(!state.subjects.some(s=>s.title===title)){state.subjects.push({id:uid(),title,goal:'',done:false});update();toast('Materia agregada a tu plan.');}else toast('La materia ya está en tu plan.');return;}
 const delMap=[['delete-subject','subjects'],['delete-event','events'],['delete-reminder','reminders'],['delete-note','notes']];for(const [attribute,key] of delMap)if(elem.dataset[attribute]){if(confirm('¿Querés eliminar este elemento?')){state[key]=state[key].filter(x=>x.id!==elem.dataset[attribute]);if(key==='reminders')editReminder=null;update();toast('Elemento eliminado.');}return;}
 if(elem.dataset.editReminder){editReminder=elem.dataset.editReminder;render();return;}
 const a=elem.dataset.action;
 if(a==='cancel-reminder'){editReminder=null;render();}
 else if(a==='voice-input')voiceInput();
 else if(a==='clear-data'){if(confirm('Esto elimina todas las materias, notas, eventos, recordatorios y preferencias guardadas en este dispositivo. ¿Continuar?')){state=init();editReminder=null;update();toast('Datos locales eliminados.');}}
 else if(a==='copy-link'){try{await navigator.clipboard.writeText(location.href.split('#')[0]);toast('Enlace copiado.');}catch{toast('No fue posible copiar el enlace.');}}
 else if(a==='install'){if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;}else toast('Abrí el menú de Chrome y elegí «Instalar aplicación» o «Agregar a pantalla principal».');}
});
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.dataset.setting){state.settings[el.dataset.setting]=el.checked;update();toast('Preferencia guardada.');}
 if(el.dataset.checkSubject){const x=state.subjects.find(s=>s.id===el.dataset.checkSubject);if(x){x.done=el.checked;update();}}
 if(el.dataset.checkReminder){const x=state.reminders.find(s=>s.id===el.dataset.checkReminder);if(x){x.done=el.checked;update();}}
});
document.addEventListener('input',e=>{if(e.target.id==='query'){searchText=e.target.value;const container=document.getElementById('search-results');if(container)container.innerHTML=searchResults();}});
document.addEventListener('submit',e=>{
 const form=e.target, id=form.id;if(!['chat-form','subject-form','event-form','reminder-form','note-form'].includes(id))return;e.preventDefault();let data=new FormData(form), title=String(data.get('title')||'').trim().slice(0,100);
 if(id==='chat-form'){let message=String(data.get('message')||'').trim();if(!message)return;ask(message);speak(chat.at(-1).text);return;}
 if(id==='note-form'){let txt=String(data.get('text')||'').trim();if(!txt)return;state.notes.unshift({id:uid(),text:txt.slice(0,2000)});update();toast('Nota guardada.');return;}
 if(!title){toast('Ingresá una descripción.');return;}
 if(id==='subject-form'){state.subjects.push({id:uid(),title:title.slice(0,80),goal:String(data.get('goal')||'').trim().slice(0,120),done:false});}
 if(id==='event-form'){const date=String(data.get('date')||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;state.events.push({id:uid(),title,date,type:String(data.get('type')||'Eventos')});}
 if(id==='reminder-form'){const date=String(data.get('date')||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;if(editReminder){let item=state.reminders.find(x=>x.id===editReminder);if(item){item.title=title;item.date=date;}}else state.reminders.push({id:uid(),title,date,done:false});editReminder=null;}
 update();toast('Guardado correctamente.');
});
window.addEventListener('popstate',()=>{page=location.hash.slice(1)||'inicio';render();});
window.addEventListener('hashchange',()=>{if(page!==location.hash.slice(1)){page=location.hash.slice(1)||'inicio';render();}});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;});
page=decodeURIComponent(location.hash.slice(1))||'inicio';render();
if('serviceWorker' in navigator&&location.protocol==='https:'&&location.hostname!=='appassets.androidplatform.net')navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
