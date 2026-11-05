/* SOSIALIZARTE · Previews SOS · Piloto aislado
   Solo lee datos publicables de la pestaña Previews (CSV publicado, jamás el CRM completo).
   No envía correos, no modifica el CRM, no contacta a los prospectos.
*/
(() => {
"use strict";
const $ = (id) => document.getElementById(id);
const clean = (v, max = 480) => String(v == null ? "" : v).trim().slice(0, max);
const normalize = (v) => clean(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");
const templates = {
  inmobiliaria:{
    label:"Inmobiliaria · Captación de interesados",
    title:"Convertir cada consulta en una oportunidad que pueda atenderse.",
    intro:"Así podría capturarse la intención de compra o renta y canalizarse al asesor adecuado.",
    chat:[
      ["client","Hola, busco opciones de departamentos por la zona sur de CDMX."],
      ["bot","¡Hola! Podemos ayudarte a registrar tu búsqueda. ¿Quieres comprar o rentar?"],
      ["client","Comprar, con presupuesto de 3 a 4 millones."],
      ["bot","Perfecto. La idea es organizar tu solicitud y enviarla a un asesor para dar seguimiento."]
    ]
  },
  consultorio:{
    label:"Salud · Solicitudes de citas",
    title:"Que solicitar una cita sea más sencillo, incluso fuera de horario.",
    intro:"Un recorrido de atención para orientar al paciente y recopilar los datos necesarios antes de confirmar disponibilidad.",
    chat:[
      ["client","Buenas tardes, quisiera agendar una consulta."],
      ["bot","Con gusto. ¿Qué especialidad necesitas?"],
      ["client","Una valoración. ¿Hay horarios esta semana?"],
      ["bot","Podemos registrar tu solicitud y, con una agenda integrada, consultar horarios disponibles."]
    ]
  },
  servicio_tecnico:{
    label:"Servicios técnicos · Cotizaciones",
    title:"Recibir solicitudes mejor documentadas desde el primer mensaje.",
    intro:"Organizar equipo, falla, ubicación y horario evita pedir los mismos datos varias veces.",
    chat:[
      ["client","Hola, necesito servicio para mi sistema de climatización."],
      ["bot","Con gusto. ¿Qué tipo de sistema es y en qué zona se encuentra?"],
      ["client","Es un equipo de calefacción y estoy en Tlalpan."],
      ["bot","Gracias. Podemos registrar los datos para que el equipo evalúe el servicio y te contacte."]
    ]
  },
  despacho:{
    label:"Servicios profesionales · Seguimiento",
    title:"Ordenar las consultas antes de que lleguen a tu equipo.",
    intro:"Clasificar el motivo de contacto ayuda a dar seguimiento y priorizar solicitudes.",
    chat:[
      ["client","Hola, quiero información sobre sus servicios."],
      ["bot","Con gusto. ¿Tu consulta es para una persona o una empresa?"],
      ["client","Para mi empresa, necesito una asesoría."],
      ["bot","Podemos registrar el tema y tu medio de contacto para canalizarlo con la persona indicada."]
    ]
  },
  restaurante:{
    label:"Restaurantes · Reservaciones",
    title:"Facilitar la atención de solicitudes sin saturar al equipo.",
    intro:"Una atención guiada puede recopilar fecha, hora y personas antes de confirmar la mesa.",
    chat:[
      ["client","Hola, ¿puedo reservar para cuatro personas el sábado?"],
      ["bot","¡Claro! ¿A qué hora te gustaría asistir?"],
      ["client","A las 8 de la noche."],
      ["bot","Podemos registrar tu solicitud; la disponibilidad se confirmaría al consultar el sistema del restaurante."]
    ]
  },
  taller:{
    label:"Taller automotriz · Solicitud de servicio",
    title:"Recibir cada cita con los datos del vehículo desde el primer mensaje.",
    intro:"Una solicitud de cita más completa puede ahorrar aclaraciones y preparar la recepción del vehículo.",
    chat:[
      ["client","Hola, quiero agendar un servicio para mi auto."],
      ["bot","Con gusto. ¿Qué marca, modelo y año tiene tu vehículo?"],
      ["client","Es un Nissan Versa 2019. Quiero revisar los frenos."],
      ["bot","Perfecto. Podemos registrar el problema y tu horario preferido para que el taller confirme la disponibilidad."]
    ]
  },
  plomeria:{
    label:"Electricidad y plomería · Cotización guiada",
    title:"Solicitudes de servicio más claras desde el primer contacto.",
    intro:"Identificar tipo de trabajo, zona y tipo de inmueble antes de cotizar agiliza la primera respuesta.",
    chat:[
      ["client","Hola, necesito que revisen una fuga de agua."],
      ["bot","Claro. ¿En qué colonia y tipo de inmueble se necesita el servicio?"],
      ["client","En Coapa, en un departamento."],
      ["bot","Gracias. La idea es organizar estos datos para que el equipo valore el servicio y te contacte."]
    ]
  },
  generico:{
    label:"Negocios · Atención de prospectos",
    title:"Responder con más claridad y dar seguimiento a cada solicitud.",
    intro:"Una conversación guiada permite entender qué necesita el cliente y canalizarlo.",
    chat:[
      ["client","Hola, necesito información y una cotización."],
      ["bot","¡Con gusto! ¿Qué servicio necesitas y en qué zona te encuentras?"],
      ["client","Quiero conocer las opciones y costos."],
      ["bot","Podemos organizar tu solicitud y derivarla con los datos necesarios para responderte."]
    ]
  }
};
const giroMap = (giro) => {
  const g=normalize(giro);
  if(g.includes("taller")||g.includes("automotriz")||g.includes("mecanico")) return "taller";
  if(g.includes("plomer")||g.includes("electric")) return "plomeria";
  if(g.includes("inmobil")||g.includes("bien_raiz")) return "inmobiliaria";
  if(g.includes("consul")||g.includes("clinic")||g.includes("medic")||g.includes("odont")||g.includes("dental")) return "consultorio";
  if(g.includes("restaur")||g.includes("alimento")||g.includes("cafe")||g.includes("gastron")) return "restaurante";
  if(g.includes("tecnico")||g.includes("repar")||g.includes("mantenimiento")||g.includes("clima")||g.includes("instalac")) return "servicio_tecnico";
  if(g.includes("despacho")||g.includes("contab")||g.includes("jurid")||g.includes("legal")||g.includes("profesion")) return "despacho";
  return "generico";
};
function parseCSV(input) {
  const out=[];let row=[],cell="",quoted=false;
  const s=String(input||"").replace(/^\uFEFF/,"");
  for(let i=0;i<s.length;i++){
    const ch=s[i];
    if(quoted){
      if(ch==='"'&&s[i+1]==='"'){cell+='"';i++;}
      else if(ch==='"') quoted=false;
      else cell+=ch;
    }else if(ch==='"'&&cell==="") quoted=true;
    else if(ch===","){row.push(cell);cell="";}
    else if(ch==="\n"){row.push(cell.replace(/\r$/,""));if(row.some(v=>v!==""))out.push(row);row=[];cell="";}
    else cell+=ch;
  }
  row.push(cell.replace(/\r$/,""));if(row.some(v=>v!==""))out.push(row);
  return out;
}
function showError(message) {
  $("content").hidden=true;
  $("error-text").textContent=message;
  $("error").hidden=false;
}
function addBullets(target,items) {
  target.replaceChildren();
  items.forEach(item=>{
    if(!item)return;
    const li=document.createElement("li");li.textContent=item;target.appendChild(li);
  });
}
function render(row, demo=false) {
  const company=clean(row.empresa,100);
  const key=giroMap(row.giro);
  const t=templates[key];
  if(!company||!clean(row.hallazgo_titulo)||!clean(row.antes_1)||!clean(row.despues_1))return showError("El contenido de esta propuesta todavía no ha sido validado.");
  $("notice").textContent=(demo?"DEMOSTRACIÓN FICTICIA. ":"")+"Propuesta conceptual elaborada por SOSIALIZARTE para "+company+". No es un sitio oficial ni un servicio conectado al negocio.";
  if(demo)$("notice").classList.add("demo");
  $("empresa-eyebrow").textContent=company;
  $("hero-title").textContent=t.title;
  $("hero-text").textContent=t.intro;
  $("giro-pill").textContent=t.label;
  $("hallazgo-titulo").textContent=clean(row.hallazgo_titulo,200);
  $("hallazgo-detalle").textContent=clean(row.hallazgo_detalle,700)||"Una oportunidad para simplificar la recepción y el seguimiento de solicitudes.";
  $("empresa-chat").textContent=company;
  $("chat").replaceChildren();
  t.chat.forEach(([role,msg])=>{
    const el=document.createElement("div");el.className="msg "+role;el.textContent=msg;$("chat").appendChild(el);
  });
  addBullets($("antes"),[row.antes_1,row.antes_2,row.antes_3].map(x=>clean(x,220)));
  addBullets($("despues"),[row.despues_1,row.despues_2,row.despues_3].map(x=>clean(x,220)));
  const url=new URL("https://wa.me/525540509093");
  url.searchParams.set("text","Hola, vi la propuesta conceptual de SOSIALIZARTE preparada para "+company+". Me gustaría conocer alcance y precio.");
  $("cta").href=url.href;
  document.title="Propuesta para "+company+" | SOSIALIZARTE";
  $("error").hidden=true;$("content").hidden=false;
}
function demoRow(nicho){
  const type=templates[nicho]?nicho:"inmobiliaria";
  const a={
    inmobiliaria:"Inmobiliaria de ejemplo",consultorio:"Consultorio de ejemplo",
    servicio_tecnico:"Servicio técnico de ejemplo",despacho:"Despacho de ejemplo",
    restaurante:"Restaurante de ejemplo",generico:"Empresa de ejemplo"
  };
  return {empresa:a[type],giro:type,
    hallazgo_titulo:"Ejemplo ilustrativo: oportunidad de mejorar el seguimiento fuera de horario",
    hallazgo_detalle:"Situación hipotética creada únicamente para mostrar el diseño. No representa un diagnóstico real de ninguna empresa.",
    antes_1:"Las solicitudes requieren revisión manual",antes_2:"Se piden datos en varios mensajes",antes_3:"El seguimiento depende de tareas repetitivas",
    despues_1:"La conversación guía la solicitud",despues_2:"Los datos necesarios quedan organizados",despues_3:"El equipo recibe un resumen para responder"
  };
}
function records(csv){
  const table=parseCSV(csv);
  if(table.length<2)throw new Error("La hoja de Previews no contiene registros.");
  const headers=table.shift().map(normalize);
  for(const required of ["clave_preview","empresa","giro","hallazgo_titulo","estado","validado_por"]){
    if(!headers.includes(required))throw new Error("Falta una columna requerida: "+required);
  }
  return table.map(c=>Object.fromEntries(headers.map((h,i)=>[h,c[i]||""])));
}
async function main(){
  const p=new URLSearchParams(location.search);
  const demo=p.get("demo");
  if(demo!==null){render(demoRow(demo==="1"?"inmobiliaria":demo),true);return;}
  const clave=clean(p.get("c"),65);
  if(!/^[a-zA-Z0-9-]{6,60}$/.test(clave)){showError("El enlace no contiene una clave de propuesta válida.");return;}
  const csvUrl=clean(window.SOS_PREVIEW_CSV_URL,500);
  if(!csvUrl){showError("La publicación de previews todavía está en preparación. Por favor, solicita la propuesta por correo.");return;}
  let u;
  try{
    u=new URL(csvUrl);
    if(u.protocol!=="https:"||u.hostname!=="docs.google.com"||!u.pathname.includes("/pub")||u.searchParams.get("output")!=="csv")
      throw new Error("URL no autorizada.");
  }catch(e){showError("La fuente de datos de propuestas no está configurada correctamente.");return;}
  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    let response;
    try{response=await fetch(u.href,{signal:controller.signal,cache:"no-store"});}
    finally{clearTimeout(timeout);}
    if(!response.ok)throw new Error("No se pudo cargar la información pública.");
    const rows=records(await response.text());
    const matches=rows.filter(r=>clean(r.clave_preview,65)===clave);
    if(matches.length!==1)throw new Error("La propuesta no se encuentra disponible.");
    const row=matches[0];
    if(normalize(row.estado)!=="listo"||!clean(row.validado_por))throw new Error("Esta propuesta está pendiente de validación.");
    render(row);
  }catch(err){showError("No pudimos cargar esta propuesta. Verifica el enlace o contáctanos para recibirla directamente.");}
}
main();
})();