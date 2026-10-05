import { useState, useEffect, useCallback } from "react";

const C = {
  bg:"#0d1117", surface:"#161b22", border:"#30363d",
  accent:"#e05c00", blue:"#1f6feb", green:"#238636",
  red:"#da3633", yellow:"#d29922", text:"#e6edf3", muted:"#8b949e",
  purple:"#8957e5",
  input:"#0d1117", raised:"#1c2128", stripe:"#ffffff06", hover:"#ffffff08",
};
const DARK_PALETTE = {...C};
const LIGHT_PALETTE = {...C,bg:"#f3f5f7",surface:"#ffffff",input:"#ffffff",raised:"#e9edf1",border:"#c4ccd5",
  text:"#202830",muted:"#536170",accent:"#b84a00",blue:"#155ac4",green:"#197035",red:"#c52828",yellow:"#916600",
  stripe:"#20283006",hover:"#2028300c"};
let currentTheme="dark";
try{if(localStorage.getItem("sp-f001-theme")==="light") currentTheme="light";}catch{}
const applyTheme = theme => {
  currentTheme=theme;
  Object.assign(C,theme==="light"?LIGHT_PALETTE:DARK_PALETTE);
  document.documentElement.style.colorScheme=theme;
  document.body.style.background=C.bg;
  document.body.style.color=C.text;
};
applyTheme(currentTheme);
const ThemeButton = () => <button type="button" aria-label={currentTheme==="dark"?"Passer en mode clair":"Passer en mode sombre"}
  title={currentTheme==="dark"?"Mode clair":"Mode sombre"} onClick={()=>{
    applyTheme(currentTheme==="dark"?"light":"dark");
    try{localStorage.setItem("sp-f001-theme",currentTheme);}catch{}
    window.dispatchEvent(new Event("sp-f001-theme-change"));
  }} style={{background:C.raised,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,width:30,height:28,
    display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,flexShrink:0}}>
  {currentTheme==="dark"?"☀":"☾"}
</button>;
const QuickOfSearch = ({ofList,currentId,onSelect,disabled}) => {
  const [query,setQuery]=useState("");
  const [error,setError]=useState("");
  const [focused,setFocused]=useState(false);
  const [highlight,setHighlight]=useState(-1);
  const normalize=value=>value.trim().replace(/^OF\s*[:#-]?\s*/i,"").toUpperCase();
  useEffect(()=>{setQuery(ofList.find(o=>o.id===currentId)?.of||"");setError("");setFocused(false);},[currentId]);
  const choose=o=>{
    if(disabled) return;
    setQuery(o.of);setError("");setFocused(false);setHighlight(-1);
    if(o.id!==currentId) onSelect(o.id);
  };
  const submit=()=>{
    const number=normalize(query);
    const matches=ofList.filter(o=>String(o.of||"").trim().toUpperCase()===number);
    if(matches.length!==1){setError(matches.length?"Plusieurs dossiers portent ce numéro d'OF":"OF introuvable");return;}
    choose(matches[0]);
  };
  useEffect(()=>{
    if(!focused||disabled||!query.trim()) return;
    const matches=ofList.filter(o=>normalize(String(o.of||""))===normalize(query));
    if(matches.length!==1||matches[0].id===currentId) return;
    const timer=setTimeout(()=>choose(matches[0]),300);
    return ()=>clearTimeout(timer);
  },[query,focused,disabled,currentId,ofList]);
  const suggestions=ofList.filter(o=>query.trim()&&String(o.of||"").toUpperCase().includes(normalize(query))).slice(0,12);
  return <div style={{position:"relative",width:240,maxWidth:"24vw"}}>
    <input aria-label="Rechercher ou scanner un numéro d'OF" aria-expanded={focused&&suggestions.length>0} aria-controls="quick-of-search" value={query} disabled={disabled}
      autoComplete="off" onFocus={e=>{e.target.select();setFocused(true);}} onBlur={()=>setFocused(false)}
      onChange={e=>{setQuery(e.target.value);setError("");setFocused(true);setHighlight(-1);}}
      onKeyDown={e=>{
        if(e.key==="Escape"){setFocused(false);setHighlight(-1);return;}
        if((e.key==="ArrowDown"||e.key==="ArrowUp")&&suggestions.length){e.preventDefault();setFocused(true);setHighlight(i=>e.key==="ArrowDown"?Math.min(i+1,suggestions.length-1):Math.max(i-1,0));return;}
        if((e.key==="Enter"||e.key==="Tab")&&query.trim()&&!disabled){if(e.key==="Enter") e.preventDefault();if(focused&&highlight>=0&&suggestions[highlight]) choose(suggestions[highlight]);else submit();}
      }}
      placeholder="N° OF" style={{width:"100%",background:C.input,color:C.text,border:`1px solid ${error?C.red:C.border}`,borderRadius:4,padding:"7px 8px",fontSize:14,fontWeight:700}}/>
    {focused&&suggestions.length>0&&<div id="quick-of-search" style={{position:"absolute",top:"100%",left:0,width:360,maxWidth:"80vw",maxHeight:300,overflowY:"auto",background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,zIndex:120,boxShadow:"0 4px 12px #0003"}}>
      {suggestions.map((o,i)=><button key={o.id} type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>choose(o)}
        style={{display:"block",width:"100%",textAlign:"left",padding:"7px 10px",border:0,borderBottom:`1px solid ${C.border}`,background:highlight===i?C.blue+"20":C.surface,color:C.text,cursor:"pointer"}}>
        <strong style={{fontFamily:"monospace"}}>{o.of}</strong>
        <span style={{display:"block",fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.description||""}</span>
      </button>)}
    </div>}
    {error&&<span role="alert" style={{position:"absolute",top:"100%",left:0,background:C.surface,color:C.red,fontSize:11,padding:4,whiteSpace:"nowrap"}}>{error}</span>}
  </div>;
};
const HeaderClock = () => {
  const [date,setDate]=useState(()=>new Date());
  useEffect(()=>{const timer=setInterval(()=>setDate(new Date()),1000);return ()=>clearInterval(timer);},[]);
  const iso=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  iso.setUTCDate(iso.getUTCDate()+4-(iso.getUTCDay()||7));
  const week=Math.ceil((((iso-new Date(Date.UTC(iso.getUTCFullYear(),0,1)))/86400000)+1)/7);
  return <div aria-label="Date, heure et semaine" style={{display:"flex",alignItems:"center",gap:12,color:C.text,whiteSpace:"nowrap",fontFamily:"monospace"}}>
    <span style={{fontSize:17,fontWeight:700}}>S{String(week).padStart(2,"0")}</span>
    <span style={{fontSize:16}}>{date.toLocaleDateString("fr-FR")}</span>
    <time style={{fontSize:23,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{date.toLocaleTimeString("fr-FR")}</time>
  </div>;
};

const ROLES = ["Consultation","Opérateur","Contrôleur","Logistique","Product Assurance","Chef de projet","Manager","Admin"];
const normalizeRole = user => {
  const role = String(user?.role||"Opérateur").toLowerCase();
  if(user?.trigram==="ADMIN" || role==="admin") return "Admin";
  if(role==="manager" || role==="chef d'équipe" || role==="chef d’equipe" || role==="chef d’équipe") return "Manager";
  if(role==="chef de projet" || role==="project manager" || role==="project leader") return "Chef de projet";
  if(role==="product assurance" || role==="assurance produit" || role==="pa") return "Product Assurance";
  if(role==="contrôleur" || role==="controleur") return "Contrôleur";
  if(role==="logistique" || role==="logisticien" || role==="logisticienne") return "Logistique";
  if(role==="consultation" || role==="lecteur seul" || role==="lecture seule" || role==="lecteur") return "Consultation";
  return "Opérateur";
};
const accountSearchText = account => `${account?.role||""} ${account?.service||""}`.toLowerCase();
const isProductAssuranceAccount = account => normalizeRole(account)==="Product Assurance"||/product assurance|assurance produit/.test(accountSearchText(account));
const isProjectLeadAccount = account => normalizeRole(account)==="Chef de projet"||/chef de projet|project manager|project leader/.test(accountSearchText(account));
const isAdminManager = user => ["Admin","Manager"].includes(normalizeRole(user));
const canWriteData = user => ["Opérateur","Contrôleur","Logistique","Manager","Admin"].includes(normalizeRole(user));
const canManageUsers = user => isAdminManager(user);
const canManageLists = user => isAdminManager(user);
const canControlRework = user => ["Admin","Manager","Contrôleur"].includes(normalizeRole(user));
const canTraceability = user => ["Admin","Manager","Logistique"].includes(normalizeRole(user));
const canRecordMating = (user,connector) => !!user?.trigram&&["Opérateur","Contrôleur","Manager","Admin"].includes(normalizeRole(user))&&!!connector?.validated&&!connector.deleted;
const canComment = user => !!user?.trigram;
const canEditLine = (user,row={}) => {
  if(isAdminManager(user)) return true;
  if(!canWriteData(user)) return false;
  const owner = row.createdVisa || row.createdBy || row.visa || row.openVisa || "";
  return !owner || owner===user?.trigram;
};

const OF_TYPES = {
  production:{label:"Production"},
  reprise:{label:"Reprise / Rework"},
};

const DEFAULT_STATUS_TYPES = [
  {id:"a_faire",label:"À faire",color:"#8b949e",closed:false},
  {id:"en_cours",label:"En cours",color:"#1f6feb",closed:false},
  {id:"ip",label:"IP",color:"#d29922",closed:false},
  {id:"a_cloturer",label:"À clôturer",color:"#e05c00",closed:false},
  {id:"bloque",label:"Bloqué",color:"#d29922",closed:false},
  {id:"termine",label:"Terminé",color:"#238636",closed:true},
  {id:"cloture",label:"Clôturé",color:"#238636",closed:true},
];
const STATUTS = {};
const UNIT_STATUTS = STATUTS;
const normalizeStatusTypes = list => {
  const seen=new Set();
  const clean=(Array.isArray(list)?list:DEFAULT_STATUS_TYPES).map((item,index)=>{
    const id=String(item?.id||"").trim().toLowerCase().replace(/[^a-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"");
    if(!id||seen.has(id)) return null;
    seen.add(id);
    return {id,label:String(item.label||id).trim(),color:/^#[0-9a-f]{6}$/i.test(item.color||"")?item.color:"#8b949e",closed:!!item.closed,order:index};
  }).filter(Boolean);
  return clean.length?clean:DEFAULT_STATUS_TYPES.map((item,index)=>({...item,order:index}));
};
const applyStatusTypes = list => {
  const clean=normalizeStatusTypes(list);
  Object.keys(STATUTS).forEach(key=>delete STATUTS[key]);
  clean.forEach(item=>{STATUTS[item.id]={label:item.label,color:item.color,closed:item.closed};});
  return clean;
};
applyStatusTypes(DEFAULT_STATUS_TYPES);

const now   = () => new Date().toLocaleDateString("fr-FR");
const nowDT = () => { const d=new Date(); return d.toLocaleDateString("fr-FR")+" "+d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}); };
const uid   = () => Math.random().toString(36).slice(2,8).toUpperCase();
const fmtSAP = v => {
  return String(v??"").replace(/[^0-9]/g,"");
};
const fmtCodeERP = v => {
  const d = v.replace(/[^0-9]/g,"").slice(0,9);
  if(d.length<=3) return d;
  if(d.length<=6) return d.slice(0,3)+" "+d.slice(3);
  return d.slice(0,3)+" "+d.slice(3,6)+" "+d.slice(6);
};

// ─── UI ────────────────────────────────────────────────────────────────────
const Input = ({value,onChange,onBlur,onKeyDown,placeholder,title,style={},small,type="text",readOnly,required,entryField}) => {
  const empty = !value||value==="";
  const borderCol = required&&empty ? C.yellow : style.borderColor || C.border;
  return (
  <input data-entry-field={entryField} type={type} value={value||""} onChange={e=>onChange&&onChange(e.target.value)}
    onBlur={e=>onBlur&&onBlur(e)} onKeyDown={e=>onKeyDown&&onKeyDown(e)}
    placeholder={title?.startsWith("Filtrer")?"Filtrer…":""} title={title||(placeholder?`Attendu : ${placeholder}`:undefined)} readOnly={readOnly}
    style={{width:"100%",fontFamily:"monospace",outline:"none",padding:small?"3px 5px":"5px 8px",fontSize:small?11:13,
      ...style,
      background:style.background||(readOnly?C.raised:C.input),
      color:style.color||(readOnly?C.muted:C.text),
      border:`1px solid ${borderCol}`,borderRadius:4,
      cursor:readOnly?"default":"text",borderColor:borderCol}}/>
  );
};
const Select = ({value,onChange,options,disabled,style={},entryField}) => (
  <select data-entry-field={entryField} value={value||""} disabled={disabled} onChange={e=>onChange(e.target.value)}
    style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
      color:disabled?C.muted:C.text,padding:"4px 6px",fontSize:11,fontFamily:"monospace",outline:"none",
      cursor:disabled?"default":"pointer",opacity:disabled?.7:1,...style}}>
    <option value="">-</option>
    {options.map(o=><option key={o} value={o}>{o}</option>)}
  </select>
);
const Btn = ({onClick,children,color=C.accent,small,disabled,full}) => (
  <button className="no-print" onClick={onClick} disabled={disabled} style={{
    background:disabled?C.border:color,color:"#fff",border:"none",borderRadius:4,
    padding:small?"3px 8px":"6px 14px",fontSize:small?11:13,cursor:disabled?"default":"pointer",
    fontWeight:600,letterSpacing:.5,opacity:disabled?.5:1,whiteSpace:"nowrap",
    width:full?"100%":undefined}}>
    {children}
  </button>
);
const MultiFilter = ({value,onChange,options,label="Tous",title="Filtre"}) => {
  const [position,setPosition]=useState(null);
  const selected=Array.isArray(value)?value:(!value||value==="all"?[]:[value]);
  const caption=selected.length===0?label:selected.length===1?(options.find(o=>o.value===selected[0])?.label||selected[0]):`${selected.length} choix`;
  return <details onToggle={e=>{if(e.currentTarget.open){const r=e.currentTarget.getBoundingClientRect();setPosition({top:r.bottom+3,left:Math.max(8,Math.min(r.left,window.innerWidth-210))});}else setPosition(null);}} style={{position:"relative",fontWeight:400,minWidth:0}}>
    <summary title={title} aria-label={title} style={{listStyle:"none",cursor:"pointer",background:C.input,border:`1px solid ${selected.length?C.blue:C.border}`,
      borderRadius:4,color:selected.length?C.blue:C.text,padding:"4px 5px",fontSize:11,whiteSpace:"nowrap"}}>{caption} ▾</summary>
    <div style={{position:"fixed",top:position?.top||0,left:position?.left||0,visibility:position?"visible":"hidden",zIndex:350,minWidth:180,maxHeight:260,overflowY:"auto",background:C.surface,
      color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:8,boxShadow:"0 4px 12px #00000022"}}>
      <button type="button" onClick={()=>onChange([])} style={{background:"none",border:0,color:C.blue,cursor:"pointer",padding:"3px 0 7px"}}>{label}</button>
      {options.map(o=><label key={o.value} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 0",fontSize:12,whiteSpace:"nowrap"}}>
        <input type="checkbox" checked={selected.includes(o.value)} onChange={e=>onChange(e.target.checked?[...selected,o.value]:selected.filter(v=>v!==o.value))}/>{o.label}
      </label>)}
    </div>
  </details>;
};
const filterHasValue = value => Array.isArray(value)?value.length>0:!!value;
const filterMatches = (filter,value) => !filterHasValue(filter)||filter==="all"||(Array.isArray(filter)?filter.includes(value):filter===value);
const workedOnOf = (data,visa) => {
  if(!data||typeof data!=="object") return false;
  return Object.entries(data).some(([key,value])=>
    typeof value==="object"?workedOnOf(value,visa):(/visa|createdBy/i.test(key)&&String(value||"").toUpperCase()===visa));
};
const deletedLineIds = data => {
  if(!data||typeof data!=="object") return [];
  return [...(data.deleted&&data.id?[data.id]:[]),...Object.values(data).flatMap(v=>deletedLineIds(v))];
};
const purgeDeletedLines = (data,ids=null) => {
  if(Array.isArray(data)) return data.filter(v=>!(v?.deleted&&(!ids||ids.has(v.id)))).map(v=>purgeDeletedLines(v,ids));
  if(data&&typeof data==="object") return Object.fromEntries(Object.entries(data).map(([k,v])=>[k,purgeDeletedLines(v,ids)]));
  return data;
};
const IconBtn = ({onClick,title,children,color=C.accent,disabled}) => (
  <button className="no-print" onClick={onClick} disabled={disabled} title={title} style={{
    width:22,height:22,display:"inline-flex",alignItems:"center",justifyContent:"center",
    background:disabled?C.border:color,color:"#fff",border:"none",borderRadius:4,
    cursor:disabled?"default":"pointer",fontSize:12,fontWeight:800,opacity:disabled?.45:1,
    lineHeight:1,padding:0,flexShrink:0}}>
    {children}
  </button>
);
const PurgeLineButton = ({user,data,onChange,id,label="cette ligne annulée"}) => {
  if(!isAdminManager(user)) return null;
  return <button type="button" title="Effacer définitivement cette ligne annulée" onClick={e=>{
    e.stopPropagation();
    if(!deletedLineIds(data).includes(id)) return;
    if(!window.confirm(`Effacer définitivement ${label}, ses remarques et son historique ? Cette action est irréversible.`)) return;
    onChange(purgeDeletedLines(data,new Set([id])));
  }} style={{background:C.red+"15",border:`1px solid ${C.red}`,borderRadius:4,color:C.red,cursor:"pointer",padding:"3px 7px",fontSize:11,marginLeft:8,pointerEvents:"all"}}>Effacer définitivement</button>;
};
const MiniIconBtn = ({onClick,title,children,color=C.accent,disabled}) => (
  <button className="no-print" onClick={onClick} disabled={disabled} title={title} style={{
    width:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",
    background:disabled?C.border:color,color:"#fff",border:"none",borderRadius:4,
    cursor:disabled?"default":"pointer",fontSize:10,fontWeight:800,opacity:disabled?.45:1,
    lineHeight:1,padding:0,flexShrink:0}}>
    {children}
  </button>
);
const copyToClipboard = text => {
  const v=String(text||"").trim();
  if(!v) return;
  try{
    if(navigator.clipboard?.writeText){ navigator.clipboard.writeText(v); return; }
  }catch{}
  try{
    const ta=document.createElement("textarea");
    ta.value=v;
    ta.setAttribute("readonly","");
    ta.style.position="fixed";
    ta.style.left="-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }catch{}
};
const buildTeamsOfText = (header,units=[]) => {
  const article=String(header?.codeArticle||header?.articleNo||"N/A").trim()||"N/A";
  const description=String(header?.description||"N/A").trim()||"N/A";
  const sourceUnits=(units||[]).filter(unit=>unit&&!unit.deleted&&(cleanSn(unit.sn)||cleanSn(unit.lot)));
  const fallback=cleanSn(header?.sn)||(cleanSn(header?.lot)?`LOT ${cleanSn(header.lot)}`:"N/A");
  const identities=sourceUnits.length
    ? sourceUnits.map(unit=>cleanSn(unit.sn)||`LOT ${cleanSn(unit.lot)}`)
    : [fallback];
  return [...new Set(identities)].map(identity=>`${article} - ${description} - ${identity}`).join("\n");
};
const normLot = v => {
  const s=String(v??"").trim().toUpperCase();
  if(/^\d+$/.test(s)) return s.padStart(10,"0").slice(-10);
  return s;
};
const CopyBtn = ({value,title="Copier"}) => {
  const disabled=!String(value||"").trim();
  return <IconBtn onClick={e=>{e?.stopPropagation?.();copyToClipboard(value);}} color={C.border} title={title} disabled={disabled}>⎘</IconBtn>;
};
const CopyCell = ({value,children,title}) => (
  <div onDoubleClick={e=>{e.stopPropagation();copyToClipboard(value);}}
    title={`${title||"Copier"} : double-clic`}
    style={{display:"flex",alignItems:"center",gap:0,minWidth:0,cursor:String(value||"").trim()?"copy":"default"}}>
    <div style={{flex:1,minWidth:0}}>{children}</div>
  </div>
);
const StampStatus = ({done,visa,date,color,label,onStamp,onClear,canClear=false,clearTitle="Annuler en mode modification",onDateChange,disabled=false}) => (
  done
    ? <div style={{display:"flex",flexDirection:"column",gap:0,alignItems:"center"}}>
        <div style={{display:"flex",gap:3,alignItems:"center"}}>
          <span style={{fontFamily:"monospace",fontWeight:700,fontSize:10,color}}>{visa}</span>
          {canClear&&<button type="button" onClick={onClear} title={clearTitle} aria-label={clearTitle} style={{cursor:"pointer",color:C.muted,fontSize:12,background:"none",border:0,padding:"0 2px"}}>↺</button>}
        </div>
        {onDateChange
          ? <Input value={date||""} onChange={onDateChange} small
              title="Corriger la date/heure du tampon"
              style={{width:86,fontSize:8,fontFamily:"monospace",textAlign:"center",padding:"1px 3px"}}/>
          : <span style={{fontFamily:"monospace",fontSize:8,color:C.muted}}>{date}</span>}
      </div>
    : <button onClick={disabled?undefined:onStamp} disabled={disabled}
        style={{background:(disabled?C.border:color)+"22",border:`1px solid ${disabled?C.border:color}`,borderRadius:3,
          color:disabled?C.muted:color,fontSize:9,padding:"1px 4px",cursor:disabled?"not-allowed":"pointer",fontWeight:700,whiteSpace:"nowrap",opacity:disabled?.55:1}}>
        {label}
      </button>
);
const ActionGroup = ({children}) => (
  <div className="no-print" style={{display:"inline-flex",gap:2,alignItems:"center",justifyContent:"center",pointerEvents:"all"}}>
    {children}
  </div>
);
const Badge = ({label,color}) => (
  <span style={{background:color+"22",border:`1px solid ${color}`,color,borderRadius:3,
    padding:"1px 6px",fontSize:10,fontWeight:700,letterSpacing:.5,fontFamily:"monospace",whiteSpace:"nowrap"}}>
    {label}
  </span>
);




// ─── Prochain étuvage ─────────────────────────────────────────────────────
// Cycle fixe : dernier étuvage + 72h
const nextEtuvageInfo = (etuvageRows) => {
  const done = (etuvageRows||[]).filter(r=>!r.deleted&&r.entreeDT);

  // Parse "DD/MM/YYYY HH:MM"
  const parseDT = s => {
    if(!s) return null;
    const [datePart, timePart] = s.split(" ");
    const [dd,mm,yyyy] = datePart.split("/");
    const [hh,mn] = (timePart||"00:00").split(":");
    return new Date(parseInt(yyyy),parseInt(mm)-1,parseInt(dd),parseInt(hh),parseInt(mn));
  };

  // Find most recent
  const last = done.reduce((a,b)=>{
    const da = parseDT(a?.entreeDT)||new Date(0);
    const db = parseDT(b.entreeDT)||new Date(0);
    return db>da?b:a;
  }, null);

  const lastDT = last ? parseDT(last.entreeDT) : null;

  const fmtDt = d => {
    const dd=String(d.getDate()).padStart(2,"0");
    const mm=String(d.getMonth()+1).padStart(2,"0");
    const yy=String(d.getFullYear()).slice(2);
    const hh=String(d.getHours()).padStart(2,"0");
    const mn=String(d.getMinutes()).padStart(2,"0");
    return `${dd}/${mm}/${yy} ${hh}:${mn}`;
  };

  const dayNames=["dim","lun","mar","mer","jeu","ven","sam"];

  if(!lastDT) {
    return { label:"Aucun étuvage enregistré", overdue:false, diffDays:0, diffH:0, lastLabel:null, count:0 };
  }

  // Next = last + 72h exactly
  const next = new Date(lastDT.getTime() + 72*3600*1000);
  const now  = new Date();
  const diffMs   = next - now;
  const overdue  = diffMs < 0;
  const absDiff  = Math.abs(diffMs);
  const diffDays = Math.floor(absDiff/86400000);
  const diffH    = Math.floor((absDiff%86400000)/3600000);
  const diffMin  = Math.floor((absDiff%3600000)/60000);

  return {
    label: dayNames[next.getDay()]+" "+fmtDt(next),
    nextAt: next.getTime(),
    overdue,
    diffDays,
    diffH,
    diffMin,
    lastLabel: fmtDt(lastDT),
    count: done.length,
  };
};
// ─── Validation de ligne ──────────────────────────────────────────────────
// Chaque ligne a un état validated:bool + validError:str
// Tant que non validée : éditable + bouton ✓ Valider
// Validée : verrouillée + bouton ✎ Modifier
// Suppression : brouillon → suppression directe; validée → soft-delete

const ROW_LOCKED_STYLE = {
  pointerEvents: "none",
  opacity: 1,
};
const LOCKED_INPUT_STYLE = {
  get background(){return currentTheme==="light"?"#f0f3f6":C.raised;},
  get color(){return currentTheme==="light"?C.text:C.muted;},
  cursor: "default",
};

// Vérifie les champs requis, retourne liste des labels manquants
const checkRequired = (row, requiredFields) =>
  requiredFields.filter(({key}) => !row[key] || String(row[key]).trim()==="").map(({label})=>label);

const duplicateRow = (row, user, extra={}) => ({
  ...row,
  id: uid(),
  createdVisa: user?.trigram||"",
  createdDT: nowDT(),
  validated: false,
  validError: "",
  deleted: false,
  deletedReason: "",
  deletedVisa: "",
  deletedDate: "",
  editBase: undefined,
  editHistory: [],
  comments: row.comments ? [...row.comments] : [],
  ...extra,
});

const appDateTimestamp = value => {
  const match=String(value||"").match(/^(\d{2})[/.](\d{2})[/.](\d{4}|\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if(!match) return 0;
  const year=match[3].length===2?2000+Number(match[3]):Number(match[3]);
  return new Date(year,Number(match[2])-1,Number(match[1]),Number(match[4]||0),Number(match[5]||0),Number(match[6]||0)).getTime();
};
const operationDateInputValue = value => {
  const timestamp=appDateTimestamp(value);
  if(!timestamp) return "";
  const date=new Date(timestamp);
  const pad=value=>String(value).padStart(2,"0");
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const operationDateFromInput = value => {
  const match=String(value||"").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  return match?`${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}`:"";
};
const isFutureOperationDate = (value,reference=Date.now()) => {
  const timestamp=appDateTimestamp(value);
  return !!timestamp&&timestamp>reference;
};
const OperationDateCell = ({value,editing,onChange}) => {
  if(!editing) return <span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{value||"—"}</span>;
  const max=operationDateInputValue(nowDT());
  return <input type="datetime-local" aria-label="Date de l'opération" value={operationDateInputValue(value)} max={max}
    title="Corriger la date et l'heure de l'opération"
    onChange={event=>{
      const next=operationDateFromInput(event.target.value);
      if(!next) return;
      if(isFutureOperationDate(next)){window.alert("La date de l'opération ne peut pas être dans le futur.");return;}
      onChange(next);
    }}
    style={{width:"100%",minWidth:112,background:C.input,color:C.text,border:`1px solid ${C.yellow}`,
      borderRadius:4,padding:"3px 4px",fontFamily:"monospace",fontSize:9}}/>;
};
const sortByNewestOperation = (items,getDate=item=>item?.createdDT,getDraft=item=>!item?.validated&&!item?.deleted) =>
  [...(items||[])].map((item,index)=>({item,index,time:appDateTimestamp(getDate(item)),draft:getDraft(item)}))
    .sort((a,b)=>Number(b.draft)-Number(a.draft)||b.time-a.time||b.index-a.index).map(entry=>entry.item);
const copyOriginTitle = origin => origin ? [
  `Copié depuis OF ${origin.sourceOf||"N/A"} · ${origin.sourceArticle||"Article N/A"} · ${origin.sourceUnits||"SN/LOT N/A"}`,
  `Copié le ${origin.copiedAt||"N/A"} par ${origin.copiedBy||"N/A"}`,
  origin.mode==="same"?"Même opération sur plusieurs SN/OF":"Nouvelle opération à partir de la ligne source"
].join("\n") : "";
const CopyOriginMark = ({origin}) => origin?<span aria-label="Provenance de la copie" title={copyOriginTitle(origin)}
  style={{display:"inline-flex",alignItems:"center",justifyContent:"center",marginLeft:4,color:C.blue,fontSize:12,fontWeight:800,cursor:"help"}}>⧉</span>:null;

const snapshotFields = (row, fields) =>
  fields.reduce((a,f)=>({...a,[f.key]:row?.[f.key]??""}),{});

const changedFields = (before, after, fields) =>
  fields
    .map(f=>({label:f.label,from:String(before?.[f.key]??""),to:String(after?.[f.key]??"")}))
    .filter(c=>c.from!==c.to);

const withEditHistory = (row, user, fields) => {
  const changes = row.editBase ? changedFields(row.editBase,row,fields) : [];
  return {
    ...row,
    validated:true,
    validError:"",
    editBase:undefined,
    _scopeEditConfirmed:undefined,
    editHistory:changes.length
      ? [...(row.editHistory||[]),{id:uid(),dt:nowDT(),visa:user?.trigram||"?",changes}]
      : (row.editHistory||[])
  };
};

const HistoryNote = ({row,open=false}) => (row?.editHistory||[]).length>0&&(
  <details className="edit-history" open={open} style={{color:C.blue,fontSize:10,fontFamily:"monospace"}}>
    <summary style={{cursor:"pointer",fontWeight:800,listStyle:"none",display:"inline-flex",
      alignItems:"center",gap:5,border:`1px solid ${C.blue}`,borderRadius:6,padding:"2px 6px",
      background:C.blue+"12"}}>
      ✎ Historique modifs ({(row.editHistory||[]).length})
    </summary>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginTop:4}}>
      {[...(row.editHistory||[])].slice(-3).reverse().map(h=>(
        <span key={h.id} style={{color:C.muted}}>
          le <strong>{h.dt}</strong> par <strong>{h.visa}</strong> — {(h.changes||[]).map(c=>`${c.label} "${c.from||"—"}" → "${c.to||"—"}"`).join(" ; ")}
        </span>
      ))}
    </div>
  </details>
);

const HistoryTrail = () => null;
const HistoryBtn = ({row, mini=false}) => {
  const hist=row?.editHistory||[];
  const disabled=hist.length===0;
  const show=e=>{
    e?.stopPropagation?.();
    if(disabled) return;
    window.alert(hist.slice().reverse().map(h=>
      `${h.dt} - ${h.visa}\n`+
      (h.changes||[]).map(c=>`• ${c.label}: "${c.from||"—"}" → "${c.to||"—"}"`).join("\n")
    ).join("\n\n"));
  };
  const BtnCmp=mini?MiniIconBtn:IconBtn;
  return <BtnCmp onClick={show} color={disabled?C.border:C.blue} title={disabled?"Historique : aucune modification":"Historique des modifications"} disabled={disabled}>◷{hist.length||""}</BtnCmp>;
};

const pdfAscii = v => String(v??"")
  .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .replace(/[^\x20-\x7E\n]/g," ")
  .replace(/\s+/g," ")
  .trim() || "-";
const pdfText = v => String(v??"")
  .replace(/[’‘]/g,"'").replace(/[–—]/g,"-").replace(/œ/g,"oe").replace(/Œ/g,"OE")
  .replace(/[^\x20-\x7E\xA0-\xFF\n]/g," ").replace(/\s+/g," ").trim()||"-";
const pdfEsc = v => [...pdfText(v)].map(character=>{
  if(character==="\\") return "\\\\";
  if(character==="(") return "\\(";
  if(character===")") return "\\)";
  const code=character.charCodeAt(0);
  return code>=128?`\\${code.toString(8).padStart(3,"0")}`:character;
}).join("");
const HELVETICA_WIDTHS={
  " ":278,"!":278,'"':355,"#":556,"$":556,"%":889,"&":667,"'":191,
  "(":333,")":333,"*":389,"+":584,",":278,"-":333,".":278,"/":278,
  ":":278,";":278,"<":584,"=":584,">":584,"?":556,"@":1015,
  "A":667,"B":667,"C":722,"D":722,"E":667,"F":611,"G":778,"H":722,"I":278,"J":500,"K":667,"L":556,"M":833,
  "N":722,"O":778,"P":667,"Q":778,"R":722,"S":667,"T":611,"U":722,"V":667,"W":944,"X":667,"Y":667,"Z":611,
  "[":278,"\\":278,"]":278,"^":469,"_":556,"`":333,
  "a":556,"b":556,"c":500,"d":556,"e":556,"f":278,"g":556,"h":556,"i":222,"j":222,"k":500,"l":222,"m":833,
  "n":556,"o":556,"p":556,"q":556,"r":333,"s":500,"t":278,"u":556,"v":500,"w":722,"x":500,"y":500,"z":500,
  "{":334,"|":260,"}":334,"~":584,
};
"0123456789".split("").forEach(character=>{HELVETICA_WIDTHS[character]=556;});
const pdfHelveticaTextWidth=(value,size)=>[...pdfText(value).normalize("NFD").replace(/[\u0300-\u036f]/g,"")]
  .reduce((sum,character)=>sum+(HELVETICA_WIDTHS[character]||556),0)*size/1000;
const pdfSafeName = v => pdfAscii(v).replace(/[^a-zA-Z0-9_-]+/g,"_").replace(/^_+|_+$/g,"") || "rapport";
const fileSafeName = v => pdfAscii(v).replace(/#/g,"SN").replace(/[<>:"/\\|?*\x00-\x1F]+/g," ").replace(/\s+/g," ").trim().replace(/[ .]+$/,"") || "export";
const csvCell = v => `"${String(v??"").replace(/"/g,'""')}"`;
const strikeText = v => String(v??"").split("").map(ch=>ch+"\u0336").join("");
const compactArticleCode = v => String(v??"").replace(/\s+/g,"").trim();
const consoDescriptionForCsv = (conso={}, fallback="") => {
  const code = compactArticleCode(conso.sap||conso.code||"");
  const label = String(conso.label||fallback||"").trim();
  return code
    ? label.replace(new RegExp("^"+code.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\s*[-–—]?\\s*","i"),"").trim()
    : label;
};
const visaStamp = (visa,dt) => [visa,dt].filter(Boolean).join(" - ");
const isFourEquip = r => !!(r?.isFour||r?.four||r?.isOven);
const uniqueOvenChoices = rows => {
  const seen=new Set();
  return (rows||[]).filter(row=>{
    if(row.deleted||!isFourEquip(row)) return false;
    const key=String(row.nInv||row.designation||"").trim().toLowerCase();
    if(!key||seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const computeReworkWarnings = (rows=[], snRows=[], filter="all") => {
  const repereKey = r => (r?.repere||"").trim().toUpperCase();
  const units = snRows.length ? snRows.map(s=>({id:s.id,label:snTitle(s)})) : [{id:"all",label:"Tous"}];
  const unitIdsForRow = row => {
    const scope=snScope(row,snRows);
    const excluded=(row?.snExcludeIds||[]).filter(id=>units.some(u=>u.id===id));
    const ids=scope.mode==="all"
      ? units.map(u=>u.id).filter(id=>!excluded.includes(id))
      : scope.ids.filter(id=>units.some(u=>u.id===id));
    if(filter && filter!=="all" && filter!=="scope-all") return ids.includes(filter) ? [filter] : [];
    if(filter==="scope-all") return scope.mode==="all" ? ids : [];
    return ids;
  };
  const unitLabel = id => units.find(u=>u.id===id)?.label || "Tous";
  const state={installed:{},openD:{},first:[],pointed:[],mismatch:[],sequence:[]};
  const lastAction={};
  const valueKey=r=>String(r.valeur||"").replace(/\s+/g,"").toUpperCase();
  const addMismatch=(previous,current,kind,repere,uid)=>{
    const fromValue=valueKey(previous),toValue=valueKey(current);
    if(fromValue&&toValue&&fromValue!==toValue&&!previous.isAdjust&&!current.isAdjust){
      state.mismatch.push({repere,previous,current,d:previous.action1==="D"?previous:current,s:current.action1==="D"?previous:current,
        kind,unitId:uid,snLabel:unitLabel(uid)});
    }
  };
  const ordered=rows.map((r,index)=>({r,index})).sort((a,b)=>{
    const stamp=r=>String(r.createdDT||"").replace(/^(\d{2})\/(\d{2})\/(\d{4})/,"$3-$2-$1");
    return a.r.createdDT&&b.r.createdDT?(stamp(a.r).localeCompare(stamp(b.r))||a.index-b.index):a.index-b.index;
  });
  ordered.forEach(({r})=>{
    if(r.deleted) return;
    const key=repereKey(r);
    if(!key||!["S","D","P"].includes(r.action1)) return;
    unitIdsForRow(r).forEach(uid=>{
      const k=`${uid}::${key}`;
      const previous=lastAction[k];
      if(previous&&(previous.action1===r.action1||(previous.action1==="S"&&r.action1==="P")))
        state.sequence.push({repere:key,row:r,previous,unitId:uid,snLabel:unitLabel(uid)});
      if(r.action1==="S"){
        const d=state.openD[k]?.d;
        if(d){
          addMismatch(d,r,"resolder",key,uid);
          delete state.openD[k];
        }else if(state.installed[k]?.action1==="P"){
          addMismatch(state.installed[k],r,"finish-point",key,uid);
        }
        state.installed[k]=r;
      }
      if(r.action1==="D"){
        const installed=state.installed[k];
        if(installed) addMismatch(installed,r,"desolder",key,uid);
        state.openD[k]={repere:key,d:r,initial:!installed,unitId:uid,snLabel:unitLabel(uid)};
        delete state.installed[k];
      }
      if(r.action1==="P"){
        const d=state.openD[k]?.d;
        if(d){
          addMismatch(d,r,"repoint",key,uid);
          delete state.openD[k];
        }
        state.installed[k]=r;
      }
      lastAction[k]=r;
    });
  });
  state.first=Object.values(state.openD).filter(w=>w.initial);
  state.pointed=Object.entries(state.installed).filter(([,r])=>r.action1==="P").map(([k,row])=>{
    const [unitId,repere]=k.split("::");
    return {repere,row,unitId,snLabel:unitLabel(unitId)};
  });
  return state;
};
const computeOpenDesoudes = (rows=[]) => Object.values(rows.reduce((open,r)=>{
  if(r?.deleted) return open;
  const key=(r?.repere||"").trim().toUpperCase();
  if(!key) return open;
  if(["S","P"].includes(r.action1)) delete open[key];
  else if(r.action1==="D") open[key]=r;
  return open;
},{}));
const REWORK_CTRL_ALLOWED_ACTIONS = new Set(["S","R","P"]);
const REWORK_CTRL_REQUIRED_ACTIONS = new Set(["S","R"]);
const canActionReceiveCtrl = action => REWORK_CTRL_ALLOWED_ACTIONS.has(action);
const computeMissingReworkControls = (rows=[]) => rows.filter(r=>
  !r?.deleted &&
  REWORK_CTRL_REQUIRED_ACTIONS.has(r?.action1) &&
  !r?.visaCtrl
);
const connectorSortKey = v => String(v||"").trim().toUpperCase().replace(/^([A-Z]+)(\d+)$/,(_,a,n)=>`${a}${String(n).padStart(6,"0")}`);
const normalizeMatingAction = action => action==="Matting"?"Mating":action==="Dematting"?"Demating":action;
const buildMatingCycles = c => {
  const events=(c?.events||[]).filter(e=>!e.deleted&&e.action).map(e=>({...e,action:normalizeMatingAction(e.action)}));
  const cycles=[];
  for(let i=0;i<events.length;i++){
    const ev=events[i];
    const next=events[i+1];
    if(ev.action==="Mating"){
      const row={mat:ev,dem:null};
      if(next?.action==="Demating"){
        row.dem=next;
        i++;
      }
      cycles.push(row);
    }else if(ev.action==="Demating"){
      cycles.push({mat:null,dem:ev});
    }
  }
  return cycles;
};
const cycleLastDt = cycle => cycle?.dem?.dt || cycle?.mat?.dt || "";
const connectorStateTone = lastAction => lastAction==="Mating"
  ? {fill:"0.88 0.96 0.90",stroke:"0.14 0.45 0.21",text:"0.14 0.45 0.21"}
  : lastAction==="Demating"
    ? {fill:"0.99 0.91 0.91",stroke:"0.85 0.21 0.20",text:"0.85 0.21 0.20"}
    : {fill:"0.90 0.93 0.97",stroke:"0.78 0.82 0.87",text:"0.00 0.27 0.57"};

const REPORT_SECTIONS=[
  {id:"rework",label:"Adjust/Rework",title:"Adjust / Rework"},
  {id:"consommables",label:"Consommables",title:"Consommables"},
  {id:"etuvage",label:"Étuvages",title:"Etuvages"},
  {id:"testequip",label:"Test Équipement",title:"Test Equip."},
  {id:"demating",label:"Mating/Demating",title:"Mating / Demating"},
  {id:"faits",label:"Faits techniques",title:"Faits"},
  {id:"openwork",label:"Open Work",title:"Open Work"},
];

const buildSimplePdf = ({width,height,pages,logoImage=null}) => {
  const objects=[
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [] /Count 0 >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];
  const logoObjId=logoImage?objects.length+1:null;
  if(logoImage){
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logoImage.width} /Height ${logoImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${logoImage.data.length+1} >>\nstream\n${logoImage.data}>\nendstream`);
  }
  const pageIds=[];
  pages.forEach(ops=>{
    const pageId=objects.length+1;
    const contentId=pageId+1;
    pageIds.push(pageId);
    const xobj=logoObjId?`/XObject << /Logo ${logoObjId} 0 R >> `:"";
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width.toFixed(2)} ${height.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ${xobj}>> /Contents ${contentId} 0 R >>`);
    const stream=ops.join("\n");
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects[1]=`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let pdf="%PDF-1.4\n";
  const offsets=[0];
  objects.forEach((object,index)=>{offsets[index+1]=pdf.length;pdf+=`${index+1} 0 obj\n${object}\nendobj\n`;});
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let id=1;id<=objects.length;id++) pdf+=String(offsets[id]).padStart(10,"0")+" 00000 n \n";
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
};

const componentLabelUnits = (ofData,row,selectedUnitIds=null) => {
  const header=ofData?.header||{};
  const units=(ofData?.units?.rows||snRowsFromHeader(header)).filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const selected=selectedUnitIds?.length ? units.filter(unit=>selectedUnitIds.includes(unit.id)) : units;
  const matched=selected.filter(unit=>rowMatchesSn(row,unit,units));
  if(matched.length) return matched;
  if(units.length) return [];
  return [{id:"of-global",sn:header.sn||"",lot:header.lot||""}];
};

const buildComponentLabelPdf = ({ofData,row,selectedUnitIds=null}) => {
  const MM=72/25.4;
  const width=76*MM, height=50.8*MM;
  const header=ofData?.header||{};
  const units=componentLabelUnits(ofData,row,selectedUnitIds);
  if(!units.length) throw new Error("Cette ligne ne concerne pas le SN sélectionné.");
  const clipped=(value,max)=>{const text=pdfText(value||"N/A");return text.length>max?text.slice(0,Math.max(1,max-3))+"...":text;};
  const txt=(value,x,y,size=7,bold=false,color="0.08 0.10 0.14")=>`BT /${bold?"F2":"F1"} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEsc(value)}) Tj ET`;
  const line=(x1,y1,x2,y2,color="0.70 0.73 0.77",lineWidth=.45)=>`q ${color} RG ${lineWidth} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`;
  const rect=(x,y,w,h,color="0.20 0.24 0.30",lineWidth=.55)=>`q ${color} RG ${lineWidth} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S Q`;
  const pages=units.map(unit=>{
    const identity=unit.sn||unit.lot||"N/A";
    const description=clipped(header.description,58);
    const madeArticle=compactArticleCode(header.codeArticle||header.articleNo)||"N/A";
    const componentArticle=compactArticleCode(row?.codeERP)||"N/A";
    const ofAndSn=`${header.of||"N/A"} - ${identity}`;
    const articleLine=`${madeArticle} - ${description}`;
    const mainLine=`${row?.repere||"N/A"} - ${row?.valeur||"N/A"}`;
    const componentLine=`(${componentArticle})`;
    const footerLine=`Dessoudé le ${row?.createdDT||"N/A"} | Visa : ${row?.createdVisa||"N/A"}`;
    const fit=(value,max,min,maxWidth)=>Math.max(min,Math.min(max,maxWidth/Math.max(1,pdfHelveticaTextWidth(value,1))));
    const centered=(value,y,size,bold=false,color="0.08 0.10 0.14")=>txt(value,(width-pdfHelveticaTextWidth(value,size))/2,y,size,bold,color);
    const ofSize=fit(ofAndSn,12,8,width-12);
    const articleSize=fit(articleLine,9.5,6.2,width-12);
    const mainSize=fit(mainLine,16,9,width-8);
    const componentSize=fit(componentLine,8.5,6,width-10);
    const footerSize=fit(footerLine,7.2,5.3,width-10);
    const ops=[
      `q 0.02 0.02 0.02 rg 0 ${(height-42).toFixed(2)} ${width.toFixed(2)} 42 re f Q`,
      centered(ofAndSn,height-17,ofSize,false,"1 1 1"),
      centered(articleLine,height-35,articleSize,false,"1 1 1"),
      centered(mainLine,height-61,mainSize,false),
      centered(componentLine,height-79,componentSize,false),
      line(0,height-86,width,height-86,"0.08 0.10 0.14",1.15),
      line(0,19,width,19,"0.08 0.10 0.14",1.15),
      centered(footerLine,7,footerSize,false),
    ];
    return ops;
  });
  return buildSimplePdf({width,height,pages});
};

const buildComponentRetentionSheetsPdf = ({ofData,selectedUnitIds=null,logoImage=null,exportedAt="",exportedBy=""}) => {
  const MM=72/25.4;
  const width=297*MM, height=210*MM;
  const header=ofData?.header||{};
  const allUnits=(ofData?.units?.rows||snRowsFromHeader(header)).filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const units=selectedUnitIds?.length ? allUnits.filter(unit=>selectedUnitIds.includes(unit.id)) : allUnits;
  const targets=units.length?units:[{id:"of-global",sn:header.sn||"",lot:header.lot||""}];
  const rows=(ofData?.rework?.rows||[]).filter(row=>!row.deleted&&row.validated&&row.action1==="D");
  const labelsPerPage=9;
  const labelW=76*MM,labelH=50.8*MM,gapX=8*MM,gapY=3*MM;
  const startX=(width-(labelW*3+gapX*2))/2;
  const gridTop=height-39*MM;
  const textWidth=(value,size,bold=false)=>pdfText(value).length*size*(bold?.54:.48);
  const pages=[];
  targets.forEach(unit=>{
    const unitRows=rows.filter(row=>unit.id==="of-global"||rowMatchesSn(row,unit,allUnits));
    const requiredPages=Math.max(2,Math.ceil(unitRows.length/labelsPerPage));
    const pageCount=requiredPages%2===0?requiredPages:requiredPages+1;
    for(let sheet=0;sheet<pageCount;sheet++){
      const ops=[];
      const title="COMPOSANTS DESSOUDÉS CONSERVÉS";
      const margin=28,top=height-margin;
      if(logoImage){
        const logoW=113.39;
        const logoH=Math.min(32,logoW*logoImage.height/logoImage.width);
        ops.push(`q ${logoW.toFixed(2)} 0 0 ${logoH.toFixed(2)} ${margin.toFixed(2)} ${(top-logoH+2).toFixed(2)} cm /Logo Do Q`);
      }
      ops.push(`BT /F2 14 Tf 0.12 0.43 0.92 rg 1 0 0 1 ${((width-textWidth(title,14,true))/2).toFixed(2)} ${(top-7).toFixed(2)} Tm (${pdfEsc(title)}) Tj ET`);
      ops.push(`BT /F2 7 Tf 0.00 0.27 0.57 rg 1 0 0 1 ${(width-margin-textWidth("SP-F001A",7,true)).toFixed(2)} ${(top-8).toFixed(2)} Tm (SP-F001A) Tj ET`);
      const exportText=pdfText(`${exportedAt}${exportedBy?` - ${exportedBy}`:""}`);
      ops.push(`BT /F1 6 Tf 0.31 0.35 0.41 rg 1 0 0 1 ${(width-margin-textWidth(exportText,6)).toFixed(2)} ${(top-20).toFixed(2)} Tm (${pdfEsc(exportText)}) Tj ET`);
      const lineY=top-34;
      ops.push(`q 0.00 0.27 0.57 RG .6 w ${margin.toFixed(2)} ${lineY.toFixed(2)} m ${(width-margin).toFixed(2)} ${lineY.toFixed(2)} l S Q`);
      const identity=snTitle(unit);
      const article=`${compactArticleCode(header.codeArticle||header.articleNo)||"N/A"} - ${header.description||"N/A"}`;
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${margin.toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(header.otp||header.projet||"N/A")}) Tj ET`);
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${((width-textWidth(header.of||"N/A",8.5,true))/2-170).toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(header.of||"N/A")}) Tj ET`);
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${((width-textWidth(article,8.5,true))/2).toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(article)}) Tj ET`);
      ops.push(`BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ${(width-margin-textWidth(identity,8.5,true)).toFixed(2)} ${(lineY-14).toFixed(2)} Tm (${pdfEsc(identity)}) Tj ET`);
      for(let slot=0;slot<labelsPerPage;slot++){
        const col=slot%3,rowIndex=Math.floor(slot/3);
        const x=startX+col*(labelW+gapX);
        const y=gridTop-(rowIndex+1)*labelH-rowIndex*gapY;
        const number=sheet*labelsPerPage+slot+1;
        ops.push(`q 0.55 0.58 0.63 RG .6 w [3 2] 0 d ${x.toFixed(2)} ${y.toFixed(2)} ${labelW.toFixed(2)} ${labelH.toFixed(2)} re S Q`);
        const slotText=String(number);
        ops.push(`BT /F2 30 Tf 0.72 0.74 0.78 rg 1 0 0 1 ${(x+(labelW-textWidth(slotText,30,true))/2).toFixed(2)} ${(y+labelH/2-10).toFixed(2)} Tm (${pdfEsc(slotText)}) Tj ET`);
      }
      const footerY=14;
      const footerLeft="Composants dessoudés conservés";
      const confidentiality="Document confidentiel - diffusion limitee aux personnes autorisees.";
      ops.push(`q 0.00 0.27 0.57 RG .55 w ${margin.toFixed(2)} 28 m ${(width-margin).toFixed(2)} 28 l S Q`);
      ops.push(`BT /F1 5.8 Tf 0.31 0.35 0.41 rg 1 0 0 1 ${margin.toFixed(2)} ${footerY} Tm (${pdfEsc(footerLeft)}) Tj ET`);
      ops.push(`BT /F1 5.8 Tf 0.31 0.35 0.41 rg 1 0 0 1 ${((width-textWidth(confidentiality,5.8))/2).toFixed(2)} ${footerY} Tm (${pdfEsc(confidentiality)}) Tj ET`);
      pages.push(ops);
    }
  });
  return buildSimplePdf({width,height,pages,logoImage});
};

const buildDirectReportPdf = ({ofData, lists, exportedAt, exportedBy, includeHistory=false, includeDeleted=true, skipEmptyReports=false, selectedSections=null, selectedSnIds=null, logoImage=null}) => {
  ofData=withUnitMetadata(ofData);
  const includeSection=title=>!selectedSections||REPORT_SECTIONS.some(s=>s.title===title&&selectedSections.includes(s.id));
  const h = ofData?.header||{};
  const W=841.89,H=595.28,M=28;
  const usable=W-M*2;
  const pages=[];
  const newPage=()=>{const p={ops:[],y:H-M,context:"",section:""};pages.push(p);return p;};
  let page=newPage();
  const color={ink:"0.07 0.09 0.13",muted:"0.31 0.35 0.41",line:"0.78 0.82 0.87",head:"0.90 0.92 0.95",soft:"0.96 0.97 0.98",orange:"0.12 0.43 0.92",blue:"0.00 0.27 0.57",green:"0.14 0.45 0.21",red:"0.85 0.21 0.20",warn:"0.95 0.56 0.00"};
  const PDF_CONFIDENTIALITY = "Document confidentiel - diffusion limitee aux personnes autorisees.";
  const PDF_LOGO_WIDTH_PT = 113.39; // 40 mm
  const setFill=c=>`${c} rg`;
  const setStroke=c=>`${c} RG`;
  const text=(txt,x,y,size=7,bold=false,c=color.ink)=>{
    page.ops.push(`BT /${bold?"F2":"F1"} ${size} Tf ${setFill(c)} 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEsc(txt)}) Tj ET`);
  };
  const line=(x1,y1,x2,y2,c=color.line,w=.35)=>page.ops.push(`q ${setStroke(c)} ${w} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`);
  const rect=(x,y,w,h,fill=null,stroke=color.line,lineWidth=.35)=>{
    page.ops.push(`q ${stroke?setStroke(stroke):""} ${fill?setFill(fill):""} ${lineWidth} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill&&stroke?"B":fill?"f":"S"} Q`);
  };
  const image=(name,x,y,w,h)=>{
    page.ops.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /${name} Do Q`);
  };
  const wrap=(txt,w,size=7)=>{
    const max=Math.max(3,Math.floor(w/(size*.48)));
    const words=pdfText(txt).split(" ");
    const lines=[]; let cur="";
    words.forEach(word=>{
      if((cur+" "+word).trim().length>max){ if(cur) lines.push(cur); cur=word; }
      else cur=(cur+" "+word).trim();
    });
    if(cur) lines.push(cur);
    return lines.length?lines:["-"];
  };
  const wrapped=(txt,x,y,w,size=6.4,maxLines=4,c=color.ink,bold=false)=>{
    wrap(txt,w,size).slice(0,maxLines).forEach((ln,i)=>text(ln,x,y-i*(size+1.3),size,bold,c));
  };
  const textW=(txt,size=7,bold=false)=>pdfText(txt).length*size*(bold ? .54 : .48);
  const wrappedRight=(txt,x,y,w,size=6.4,maxLines=4,c=color.ink,bold=false)=>{
    wrap(txt,w,size).slice(0,maxLines).forEach((ln,i)=>text(ln,x+w-textW(ln,size,bold),y-i*(size+1.3),size,bold,c));
  };
  const wrappedCenter=(txt,x,y,w,size=6.4,maxLines=4,c=color.ink,bold=false)=>{
    wrap(txt,w,size).slice(0,maxLines).forEach((ln,i)=>text(ln,x+(w-textW(ln,size,bold))/2,y-i*(size+1.3),size,bold,c));
  };
  const statusLabel=s=>STATUTS?.[s]?.label||UNIT_STATUTS?.[s]?.label||s||"-";
  const ofTypeLabel=t=>OF_TYPES?.[t]?.label||t||"Production";
  const unitLabel = u => snTitle(u);
  const activeUnits=(ofData?.units?.rows||[]).filter(u=>!u.deleted&&hasUnitIdentity(u));
  const fallbackUnit={
    id:"of-global",
    sn:h.sn||h.snProduitFini||"",
    lot:h.lot||"",
    status:"en_cours",
    remarque:"",
  };
  const packUnits=activeUnits.length?activeUnits:[fallbackUnit];
  const selectedSet = selectedSnIds&&selectedSnIds.length ? new Set(selectedSnIds) : new Set(packUnits.map(u=>u.id).filter(Boolean));
  const selectedUnits = activeUnits.length ? activeUnits.filter(u=>selectedSet.has(u.id)) : packUnits;
  const selectedSnLabel = selectedUnits.length
    ? selectedUnits.map(snTitle).join(" ; ")
    : "Tous les SN";
  const rowInSelectedSn = row => {
    if(!activeUnits.length || !selectedSet.size) return true;
    const scope=snScope(row,activeUnits);
    if(scope.mode==="all") return true;
    return scope.ids.some(id=>selectedSet.has(id));
  };
  const unitMatches=(row,unit)=>!unit||unit.id==="of-global" ? true : rowMatchesSn(row,unit,activeUnits);
  const trace = r => {
    const hist=(r?.editHistory||[]).flatMap(e=>(e.changes||[]).map(c=>`Modifie ${e.dt} ${e.visa}: ${c.label} "${c.from||"-"}" -> "${c.to||"-"}"`));
    if(r?.remarque) hist.push(`Remarque: ${r.remarque}`);
    if(r?.deleted) hist.push(`Annule ${r.deletedDate||""} ${r.deletedVisa||""}: ${r.deletedReason||""}`);
    if(r?.restoredReason) hist.push(`Reactive ${r.restoredDate||""} ${r.restoredVisa||""}: ${r.restoredReason||""}`);
    return hist.join(" | ");
  };
  const commentsForPdf = r => (r?.comments||[])
    .filter(c=>String(c?.text||"").trim())
    .map(c=>`${c.visa||"-"} - ${c.dt||"-"} - ${c.text||""}`);
  const headerBlock=(title,unit=null,sectionName=title)=>{
    page.context=title;
    page.section=sectionName;
    const logoH=logoImage?.width&&logoImage?.height
      ? Math.min(32,PDF_LOGO_WIDTH_PT*logoImage.height/logoImage.width)
      : 20;
    const top=page.y;
    const sectionTitle=pdfText(REPORT_SECTIONS.find(section=>String(title).includes(section.title))?.title||String(title).replace(/ - suite$/,""));
    const sectionSize=14;
    if(logoImage){
      image("Logo",M,top-logoH+2,PDF_LOGO_WIDTH_PT,logoH);
    }else{
      rect(M,top-29,PDF_LOGO_WIDTH_PT,22,null,color.line);
      text("LOGO",M+PDF_LOGO_WIDTH_PT/2-10,top-21,7,true,color.muted);
    }
    text(sectionTitle,(W-textW(sectionTitle,sectionSize,true))/2,top-7,sectionSize,true,color.orange);
    const exportText=pdfAscii(`${exportedAt} - ${exportedBy}`);
    text("SP-F001A",W-M-textW("SP-F001A",7,true),top-8,7,true,color.blue);
    text(exportText,W-M-textW(exportText,6),top-20,6,false,color.muted);
    const lineY=top-34;
    line(M,lineY,W-M,lineY,color.orange,.6);
    const article=h.codeArticle||h.articleNo||"-";
    const unitIdentity=current=>{
      const identity=[current?.sn||"",current?.lot||""].filter(Boolean).join(" / ")||"-";
      const quantity=current?.lot?trackedLotQty(current):"";
      return `${identity}${String(quantity||"").trim()?` - Qté ${quantity}`:""}`;
    };
    const meta=[
      [h.otp||h.projet||"-",1.1,"left"],
      [h.of||"-",.85,"center"],
      [`${article} - ${h.description||"-"}`,3,"center"],
      [unit?unitIdentity(unit):selectedUnits.map(unitIdentity).join(" ; ")||"-",1.35,"right"],
    ];
    page.y=lineY-15;
    const totalWeight=meta.reduce((sum,item)=>sum+item[1],0);
    let metaX=M;
    meta.forEach(m=>{
      const cw=usable*m[1]/totalWeight;
      const contentWidth=cw-8;
      if(m[2]==="right"){
        wrappedRight(m[0],metaX,page.y,contentWidth,9.5,2,color.ink,true);
      }else if(m[2]==="center"){
        wrappedCenter(m[0],metaX,page.y,contentWidth,9.5,2,color.ink,true);
      }else{
        wrapped(m[0],metaX,page.y,contentWidth,9.5,2,color.ink,true);
      }
      metaX+=cw;
    });
    page.y-=24;
  };
  const table=(headers,rows,widths,sectionTitle,unit=null)=>{
    const tableLine="0.18 0.20 0.22";
    const sum=widths.reduce((a,b)=>a+b,0);
    widths=widths.map(w=>w/sum*usable);
    const drawHead=()=>{
      let x=M; rect(x,page.y-19,usable,19,color.head,tableLine,.22);
      headers.forEach((hd,i)=>{wrapped(hd,x+2,page.y-9,widths[i]-4,5.6,2,color.ink,true); x+=widths[i]; if(i) line(x-widths[i],page.y,x-widths[i],page.y-19,tableLine,.22);});
      page.y-=19;
    };
    drawHead();
    rows.forEach((row,rowIndex)=>{
      const rowObj=Array.isArray(row)?{cells:row}:row;
      if(rowObj?.fullText){
        const fullLines=wrap(rowObj.fullText,usable-8,6.4).slice(0,2);
        const rh=Math.max(15,fullLines.length*7.8+6);
        if(page.y-rh<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
        rect(M,page.y-rh,usable,rh,rowObj.fill||"0.90 0.93 0.97",rowObj.stroke||color.line);
        fullLines.forEach((ln,i)=>text(ln,M+4,page.y-9-i*7.8,6.4,true,rowObj.color||color.blue));
        page.y-=rh;
        return;
      }
      const cells=headers.map((_,i)=>rowObj?.cells?.[i]??"");
      const lineCounts=cells.map((cell,i)=>wrap(cell,widths[i]-4,6.1).slice(0,5).length);
      const rh=Math.max(13,Math.max(...lineCounts)*7.5+5);
      if(page.y-rh<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
      let x=M; rect(x,page.y-rh,usable,rh,rowIndex%2===1?"0.94 0.95 0.96":null,tableLine,.22);
      const rowColor=rowObj?.deleted?color.red:color.ink;
      cells.forEach((cell,i)=>{
        const style=rowObj?.cellStyles?.[i];
        if(style?.fill) rect(x,page.y-rh,widths[i],rh,style.fill,tableLine,.22);
        const cellLines=wrap(cell,widths[i]-4,6.1).slice(0,5);
        cellLines.forEach((cellLine,lineIndex)=>{
          const baseline=page.y-8-lineIndex*7.4;
          text(cellLine,x+2,baseline,6.1,!!style?.bold,style?.color||rowColor);
          if(rowObj?.deleted) line(x+2,baseline+2,x+2+Math.min(widths[i]-4,textW(cellLine,6.1,!!style?.bold)),baseline+2,color.red,.55);
        });
        x+=widths[i];
        if(i) line(x-widths[i],page.y,x-widths[i],page.y-rh,tableLine,.22);
      });
      page.y-=rh;
      if(rowObj?.deleted&&rowObj?.deleteText){
        const reasonLines=wrap(rowObj.deleteText,usable-12,5.8).slice(0,3);
        const dh=Math.max(11,reasonLines.length*6.5+5);
        if(page.y-dh<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
        rect(M,page.y-dh,usable,dh,"0.99 0.91 0.91",color.red);
        reasonLines.forEach((ln,i)=>text(ln,M+4,page.y-8-i*6.5,5.8,true,color.red));
        page.y-=dh;
      }
      if(rowObj?.comments?.length){
        rowObj.comments.slice(0,8).forEach(item=>{
          const commentLines=wrap(item,usable-12,5.8).slice(0,3);
          const ch=Math.max(11,commentLines.length*6.5+5);
          if(page.y-ch<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
          rect(M,page.y-ch,usable,ch,"0.90 0.95 1.00",color.blue);
          commentLines.forEach((ln,i)=>text(ln,M+4,page.y-8-i*6.5,5.8,false,color.blue));
          page.y-=ch;
        });
      }
      if(includeHistory&&rowObj?.trace){
        const items=String(rowObj.trace||"").split(" | ").filter(Boolean).slice(0,6);
        items.forEach(item=>{
          const traceLines=wrap(item,usable-12,5.8).slice(0,3);
          const th=Math.max(11,traceLines.length*6.5+5);
          if(page.y-th<M+28){ page=newPage(); headerBlock(`${sectionTitle} - suite`,unit,sectionTitle); drawHead(); }
          rect(M,page.y-th,usable,th,"0.91 0.93 0.96",color.line);
          traceLines.forEach((ln,i)=>text(ln,M+4,page.y-8-i*6.5,5.8,false,color.muted));
          page.y-=th;
        });
      }
    });
  };
  const section=(title,headers,rows,widths,unit)=> {
    if(!includeSection(title)) return;
    if(skipEmptyReports&&!rows.length) return;
    page=newPage();
    const displayTitle=unit&&unit.id!=="of-global" ? `${unitLabel(unit)} - ${title}` : title;
    headerBlock(displayTitle,unit,displayTitle);
    const body=rows.length?rows:[headers.map((_,i)=>i===0?"Aucune ligne":"")];
    table(headers,body,widths,displayTitle,unit);
  };
  const warningBlock=(title,items,tone,sectionTitle,unit)=>{
    if(!items.length) return;
    const c=tone==="red"?color.red:color.warn;
    const fill=tone==="red"?"0.99 0.91 0.91":"1.00 0.96 0.84";
    const lines=items.flatMap(item=>wrap(item,usable-18,6.1).slice(0,2));
    while(lines.length){
      let capacity=Math.floor((page.y-M-28-25)/7);
      if(capacity<1){page=newPage();headerBlock(`${sectionTitle} - suite`,unit,sectionTitle);capacity=Math.floor((page.y-M-28-25)/7);}
      const chunk=lines.splice(0,capacity);
      const h=Math.max(20,chunk.length*7+17);
      rect(M,page.y-h,usable,h,fill,c);
      text(title,M+6,page.y-10,6.6,true,c);
      chunk.forEach((ln,i)=>text(ln,M+12,page.y-19-i*7,6.1,false,c));
      page.y-=h+8;
    }
  };
  const infoBlock=(pairs,x,y,w)=>{
    const col=w/2;
    pairs.forEach((m,i)=>{
      const px=x+(i%2)*col;
      const py=y-Math.floor(i/2)*22;
      text(m[0],px,py,6,false,color.muted);
      wrapped(m[1],px,py-8,col-12,7.2,2,color.ink);
    });
  };

  const consoById=Object.fromEntries((lists?.consommables||[]).map(c=>[c.id,c]));
  const rowPdf=(cells,row,extraTrace="")=>({
    cells,
    deleted:!!row?.deleted,
    deleteText:row?.deleted
      ? `Annulé le ${row.deletedDate||"-"} par ${row.deletedVisa||"-"} - Motif : ${row.deletedReason||"-"}`
      : "",
    comments:commentsForPdf(row),
    trace:[trace(row),extraTrace].filter(Boolean).join(" | ")
  });
  const rowPdfWithComments=(cells,row,extraComments=[],extraTrace="")=>({
    ...rowPdf(cells,row,extraTrace),
    comments:[...commentsForPdf(row),...extraComments.filter(Boolean)]
  });

  selectedUnits.forEach(unit=>{
    const inUnit = row => unitMatches(row,unit) && rowInSelectedSn(row) && (includeDeleted || !row?.deleted);

    const reworkRowsForUnit = (ofData?.rework?.rows||[]).filter(inUnit);
    const reworkWarnings = computeReworkWarnings(reworkRowsForUnit);
    const openDesoudes = computeOpenDesoudes(reworkRowsForUnit);
    const openPointes = reworkWarnings.pointed;
    const hdArticles=reworkRowsForUnit.filter(r=>{
      const dc=dcCheck(r.dc,r.createdDT);
      return !r.deleted&&["S","P","M"].includes(r.action1)&&dc?.max!==undefined&&!dc.ok;
    });
    const actionName=code=>ACTION_LABELS?.[code]||code||"action";
    const warningEntries=[
      ...hdArticles.map(row=>({row,tone:"red",problem:`Date code ${row.dc||"-"} hors validité à la date de l’opération`})),
      ...openPointes.map(item=>({row:item.row,tone:"red",repere:item.repere,problem:`Composant pointé${item.row.valeur?` (valeur ${item.row.valeur})`:""} : un soudage final est requis`})),
      ...openDesoudes.map(row=>({row,tone:"yellow",problem:`Composant dessoudé${row.valeur?` (valeur ${row.valeur})`:""} : aucun soudage ultérieur enregistré`})),
      ...reworkWarnings.sequence.map(item=>({row:item.row,tone:"red",repere:item.repere,problem:`Deux actions ${actionName(item.row.action1)} consécutives : une alternance soudage / dessoudage est attendue`})),
      ...reworkWarnings.mismatch.map(item=>({row:item.current,tone:"red",repere:item.repere,problem:`Valeur incohérente : ${actionName(item.previous.action1)} ${item.previous.valeur||"-"}, puis ${actionName(item.current.action1)} ${item.current.valeur||"-"}`})),
      ...reworkWarnings.first.map(item=>({row:item.d,tone:"red",repere:item.repere,problem:"L’historique commence par un dessoudage sans soudage initial enregistré"})),
    ];
    const warningSeen=new Set();
    const warningRows=warningEntries
      .map(entry=>({repere:String(entry.repere||entry.row?.repere||"N/A").trim()||"N/A",problem:entry.problem,operator:entry.row?.createdVisa||"N/A",date:entry.row?.createdDT||"N/A",tone:entry.tone}))
      .filter(item=>{const key=[item.repere,item.problem,item.operator,item.date].join("|");if(warningSeen.has(key)) return false;warningSeen.add(key);return true;})
      .sort((a,b)=>a.repere.localeCompare(b.repere,undefined,{numeric:true})||a.problem.localeCompare(b.problem))
      .map(item=>({cells:[item.repere,item.problem,item.operator,item.date],cellStyles:{0:{bold:true}}}));

    const pdfValue=value=>String(value??"").trim()?value:"N/A";
    const rework=(ofData?.rework?.rows||[])
      .filter(inUnit)
      .map(r=>{
        const quantity=String(r.qty||r.qte||"").trim();
        const repere=quantity&&Number(quantity)!==1?`${quantity}x ${pdfValue(r.repere)}`:pdfValue(r.repere);
        const controlRequired=["S","R"].includes(r.action1);
        const controlVisa=r.visaCtrl|| (controlRequired?"Contrôle à faire":"N/A");
        return {...rowPdf([repere,r.isAdjust?"Oui":"Non",pdfValue(r.action1),pdfValue(r.codeERP),pdfValue(r.valeur),pdfValue(r.lot),pdfValue(r.dc),pdfValue(r.sn),pdfValue(r.fiche),pdfValue(r.etape),pdfValue(r.createdVisa),pdfValue(r.createdDT),controlVisa,pdfValue(r.dateCtrl)],r),
        cellStyles:{
          ...(hdArticles.some(hd=>hd.id===r.id)?{6:{color:color.red,bold:true}}:{}),
          ...(!r.deleted&&missingReworkTrace(r,true).includes("LOT")?{5:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}:{}),
          ...(!r.deleted&&missingReworkTrace(r,true).includes("DC")?{6:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}:{}),
          ...(controlRequired&&!r.visaCtrl?{12:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}:{})
        }};
      });
    if(includeSection("Adjust / Rework")&&(!skipEmptyReports||rework.length||warningRows.length)){
      const title="Adjust / Rework";
      const displayTitle=unit&&unit.id!=="of-global" ? `${unitLabel(unit)} - ${title}` : title;
      page=newPage();
      headerBlock(displayTitle,unit,displayTitle);
      if(warningRows.length){
        text("Points à vérifier",M,page.y-1,7.2,true,color.red);
        page.y-=10;
        table(["Repère TOPO","Problème","Opérateur","Date / heure"],warningRows,[19,70,18,27],displayTitle,unit);
        page.y-=8;
      }
      table(["Repère TOPO","ADJ","Act.","Code article","Valeur - description","LOT","Date code","SN composant","Fiche suiveuse / fait","N° OP","VISA","Date","CTRL","CTRL le"],rework.length?rework:[["N/A"]],[22,9,9,27,55,19,17,17,39,11,15,24,36,24],displayTitle,unit);
    }

    const cons=(ofData?.consommables?.ops||[])
      .filter(inUnit)
      .flatMap(op=>(op.items||[{}]).filter(it=>includeDeleted||!it?.deleted).map(it=>{
        const conso=consoById[it.consoId]||{};
        const code=compactArticleCode(conso.sap||conso.code||it.consoId);
        const desc=consoDescriptionForCsv(conso,it.consoId);
        const status=dpStatus(it.dp,it.createdDT||op.createdDT);
        const polymerization=polymerizationStatus(conso,it.createdDT||op.createdDT);
        const polymerizationTrace=polymerization
          ? `Polymérisation ${polymerization.hours} h - sous vide dès le ${formatAvailabilityDT(polymerization.readyAt)}`
          : "";
        const invalid=!!it.dp&&!isValidDMY(it.dp);
        const row=rowPdfWithComments([
          it.createdDT||op.createdDT,
          it.createdVisa||op.createdVisa,
          op.fiche,
          op.op,
          code,
          desc,
          it.echantillon||"",
          it.lot,
          `${it.dp||""}${invalid?" - DATE INVALIDE":status&&status.label!=="OK"?` - ${status.label}`:""}`
        ],it,commentsForPdf(op),[trace(op),polymerizationTrace].filter(Boolean).join(" | "));
        return {...row,cellStyles:{
          ...(invalid||status?.label==="PÉRIMÉ"?{8:{fill:"0.99 0.91 0.91",color:color.red,bold:true}}:{}),
          ...(status?.label==="BIENTÔT"?{8:{fill:"0.99 0.96 0.84",bold:true}}:{})
        }};
      }));
    section("Consommables",["Date","Visa","Fiche suiveuse","OP","Code article","Description","N ech.","LOT","DP"],cons,[23,12,26,11,34,88,22,30,20],unit);

    const testEquipRows=(ofData?.testequip?.rows||[])
      .filter(inUnit)
      .sort((a,b)=>(isFourEquip(b)?1:0)-(isFourEquip(a)?1:0))
      .map(r=>rowPdf([r.createdDT,r.createdVisa,isFourEquip(r)?"FOUR":"-",r.nInv,r.type,r.designation,r.dateExpiration,r.checkDate],r));
    section("Test Equip.",["Date","Visa","Four","N INV","Type","Designation","Date calib","Ctrl"],testEquipRows,[23,13,18,30,26,79,25,24],unit);

    section("Faits",["Date","Visa","Type","Numero","Date ouv.","Lien","Commentaires"],(ofData?.faits?.rows||[]).filter(inUnit).map(r=>rowPdf([r.createdDT,r.createdVisa,r.type,r.numero,r.date,r.lien,r.commentaires],r)),[24,14,18,32,24,72,86],unit);

    section("Etuvages",["Date","Visa","Four","Duree","Temp","Entree","Visa E","Sortie","Visa S"],(ofData?.etuvage?.rows||[]).filter(inUnit).map(r=>rowPdf([r.createdDT,r.createdVisa,r.fourN,r.duree,r.temp,r.entreeDT,r.entreeVisa,r.sortieDT,r.sortieVisa],r)),[23,13,26,16,16,36,14,36,14],unit);

    const demConnectors=(ofData?.demating?.connectors||[]).filter(c=>!c.deleted&&inUnit(c))
      .sort((a,b)=>connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect)));
    const demRows=demConnectors.flatMap(c=>{
      const events=(c.events||[]).filter(e=>!e.deleted&&e.action);
      const last=events.slice(-1)[0]||{};
      const cycles=buildMatingCycles(c);
      const state=last.action==="Mating" ? "Matte" : last.action==="Demating" ? "Dematte" : "-";
      const lastText=last.action ? `${last.action} ${last.dt||"-"} ${last.visa||"-"}` : "Aucune action";
      const tone=connectorStateTone(last.action);
      const group={fullText:`${c.nConect||"Connecteur ?"} - Etat actuel : ${state} - Derniere action : ${lastText} - ${cycles.length} cycle${cycles.length>1?"s":""}`,fill:tone.fill,stroke:tone.stroke,color:tone.text};
      if(!cycles.length) return [group,rowPdf(["","0","-","-","-","-"],c)];
      const sortedCycles=cycles
        .map((cy,i)=>({cy,n:i+1}))
        .sort((a,b)=>String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))) || b.n-a.n);
      return [group,...sortedCycles.map(({cy,n})=>rowPdf([
        "",
        String(n),
        cy.mat?.dt||"-",
        cy.mat?.visa||"-",
        cy.dem?.dt||"-",
        cy.dem?.visa||"-"
      ],c))];
    });
    section("Mating / Demating",["","Cycle","Mating date","Visa M","Demating date","Visa D"],demRows,[8,14,44,18,44,18],unit);

    section("Open Work",["Date","Visa","N OW","Description","Ouverture","Cloture","Commentaires"],(ofData?.openwork?.rows||[]).filter(inUnit).map(r=>rowPdf([r.createdDT,r.createdVisa,r.nOW,r.description,`${r.openDate||"-"} / ${r.openVisa||"-"}`,`${r.closedDate||"-"} / ${r.closedVisa||"-"}`,r.commentaires],r)),[23,13,15,86,38,38,83],unit);
  });

  const printablePages=pages.filter(p=>p.ops.length);
  if(!printablePages.length) throw new Error("Aucun rapport non vide pour les SN sélectionnés.");
  const sectionCounts={};
  printablePages.forEach(p=>{
    const key=p.section||p.context||"Rapport";
    sectionCounts[key]=(sectionCounts[key]||0)+1;
  });
  const sectionSeen={};
  const objects=["<< /Type /Catalog /Pages 2 0 R >>"];
  const pageKids=[];
  const font1=3, font2=4;
  objects.push("<< /Type /Pages /Kids [] /Count 0 >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const logoObjId=logoImage ? objects.length+1 : null;
  if(logoImage){
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logoImage.width} /Height ${logoImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${logoImage.data.length+1} >>\nstream\n${logoImage.data}>\nendstream`);
  }
  printablePages.forEach((p,i)=>{
    const sectionKey=p.section||p.context||"Rapport";
    sectionSeen[sectionKey]=(sectionSeen[sectionKey]||0)+1;
    const footerY=14;
    const actionLegend="Actions : S = Soudé | D = Dessoudé | P = Pointé | M = Matière | R = Rework";
    const showActionLegend=String(p.section||p.context||"").includes("Adjust / Rework");
    const pageText=`Page ${sectionSeen[sectionKey]} / ${sectionCounts[sectionKey]}`;
    p.ops.push(`q ${setStroke(color.blue)} .55 w ${M.toFixed(2)} 28 m ${(W-M).toFixed(2)} 28 l S Q`);
    if(showActionLegend) p.ops.push(`BT /F1 5.8 Tf ${setFill(color.muted)} 1 0 0 1 ${M.toFixed(2)} ${footerY} Tm (${pdfEsc(actionLegend)}) Tj ET`);
    p.ops.push(`BT /F1 5.8 Tf ${setFill(color.muted)} 1 0 0 1 ${((W-textW(PDF_CONFIDENTIALITY,5.8))/2).toFixed(2)} ${footerY} Tm (${pdfEsc(PDF_CONFIDENTIALITY)}) Tj ET`);
    p.ops.push(`BT /F2 7 Tf ${setFill(color.muted)} 1 0 0 1 ${(W-M-textW(pageText,7,true)).toFixed(2)} ${footerY} Tm (${pdfEsc(pageText)}) Tj ET`);
    const stream=p.ops.join("\n");
    const contentId=objects.length+2;
    const pageId=objects.length+1;
    pageKids.push(`${pageId} 0 R`);
    const xobj=logoObjId ? `/XObject << /Logo ${logoObjId} 0 R >> ` : "";
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> ${xobj}>> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects[1]=`<< /Type /Pages /Kids [${pageKids.join(" ")}] /Count ${printablePages.length} >>`;
  let pdf="%PDF-1.4\n";
  const offsets=[0];
  objects.forEach((obj,i)=>{offsets[i+1]=pdf.length; pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<=objects.length;i++) pdf+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
};

const loadPdfLogoImage = src => new Promise(resolve=>{
  const raw=String(src||"").trim();
  if(!raw){ resolve(null); return; }
  const url=raw.replace(/\\/g,"/");
  if(/^[a-zA-Z]:\//.test(url)){ resolve(null); return; }
  const img=new Image();
  img.crossOrigin="anonymous";
  img.onload=()=>{
    try{
      const canvas=document.createElement("canvas");
      canvas.width=img.naturalWidth||img.width;
      canvas.height=img.naturalHeight||img.height;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle="#ffffff";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
      const dataUrl=canvas.toDataURL("image/jpeg",0.92);
      const b64=dataUrl.split(",")[1]||"";
      const bin=atob(b64);
      let hex="";
      for(let i=0;i<bin.length;i++) hex+=bin.charCodeAt(i).toString(16).padStart(2,"0");
      resolve({width:canvas.width,height:canvas.height,data:hex});
    }catch{
      resolve(null);
    }
  };
  img.onerror=()=>resolve(null);
  img.src=url;
});

const mergeGeneratedPdfBlobs = async blobs => {
  const sources=await Promise.all(blobs.map(blob=>blob.text()));
  const merged=[];
  const pageIds=[];
  let nextId=3;
  sources.forEach(source=>{
    const parsed=[...source.matchAll(/(?:^|\n)(\d+) 0 obj\n([\s\S]*?)\nendobj/g)].map(match=>({oldId:Number(match[1]),body:match[2]}));
    const idMap=new Map([[1,1],[2,2]]);
    parsed.filter(object=>object.oldId>2).forEach(object=>idMap.set(object.oldId,nextId++));
    parsed.filter(object=>object.oldId>2).forEach(object=>{
      const id=idMap.get(object.oldId);
      const body=object.body.replace(/(\d+) 0 R/g,(_,raw)=>`${idMap.get(Number(raw))||raw} 0 R`);
      merged.push({id,body});
      if(/\/Type \/Page\b/.test(body)) pageIds.push(id);
    });
  });
  if(!pageIds.length) throw new Error("Aucune page à imprimer.");
  const objects=[
    {id:1,body:"<< /Type /Catalog /Pages 2 0 R >>"},
    {id:2,body:`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`},
    ...merged
  ].sort((a,b)=>a.id-b.id);
  let pdf="%PDF-1.4\n";
  const offsets=[0];
  objects.forEach(object=>{offsets[object.id]=pdf.length;pdf+=`${object.id} 0 obj\n${object.body}\nendobj\n`;});
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let id=1;id<=objects.length;id++) pdf+=String(offsets[id]||0).padStart(10,"0")+" 00000 n \n";
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:"application/pdf"});
};

const downloadBrowserBlob = (blob,name) => {
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};

// ─── Modale d'annulation de ligne (soft-delete) ───────────────────────────
const DeleteModal = ({onConfirm, onCancel, godMode=false}) => {
  const [reason, setReason] = useState("");
  useEffect(()=>{if(godMode) onConfirm("");},[godMode]);
  if(godMode) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`2px solid ${C.red}`,borderRadius:10,
        padding:24,width:460,maxWidth:"100%"}}>
        <div style={{fontWeight:700,color:C.red,fontSize:15,marginBottom:6}}>
          ✕ Annuler cette ligne
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:16,lineHeight:1.6}}>
          La ligne sera <strong style={{color:C.text}}>barrée et conservée</strong> dans l'historique.
          L'annulation est tracée (visa + date) et réversible.
        </div>
        <div style={{marginBottom:18}}>
          <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",
            letterSpacing:.8,marginBottom:6}}>Motif de l'annulation *</div>
          <Input value={reason} onChange={setReason}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn onClick={onCancel} color={C.border}>Annuler</Btn>
          <Btn onClick={()=>reason.trim()&&onConfirm(reason.trim())} color={C.red}
            disabled={!reason.trim()}>✕ Confirmer</Btn>
        </div>
      </div>
    </div>
  );
};

const PdfOptionsModal = ({snRows, defaultSelectedIds=null, includeHistoryDefault=false, onCancel, onConfirm}) => {
  const [includeHistory,setIncludeHistory] = useState(includeHistoryDefault);
  const [includeDeleted,setIncludeDeleted] = useState(true);
  const [skipEmptyReports,setSkipEmptyReports] = useState(true);
  const [includePdf,setIncludePdf] = useState(true);
  const [includeCsv,setIncludeCsv] = useState(false);
  const [selectedSections,setSelectedSections]=useState(()=>REPORT_SECTIONS.map(s=>s.id));
  const [selected,setSelected] = useState(()=>defaultSelectedIds?.length ? defaultSelectedIds : snRows.map(u=>u.id));
  const toggle=id=>setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const selectAll=()=>setSelected(snRows.map(u=>u.id));
  const selectNone=()=>setSelected([]);
  const canGenerate=(!snRows.length || selected.length>0) && (includePdf||includeCsv) && (!includePdf||selectedSections.length>0);
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:320,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`2px solid ${C.blue}`,borderRadius:10,
        padding:20,width:520,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 40px #0008"}}>
        <div style={{fontWeight:800,color:C.blue,fontSize:15,marginBottom:6,textTransform:"uppercase"}}>
          Export rapport
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14,lineHeight:1.5}}>
          Export rapport de production
        </div>
        <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
          <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={includePdf} onChange={e=>setIncludePdf(e.target.checked)}
              style={{accentColor:C.blue}}/>
            PDF
          </label>
          <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={includeCsv} onChange={e=>setIncludeCsv(e.target.checked)}
              style={{accentColor:C.blue}}/>
            CSV Adjust/Rework + Consommables
          </label>
        </div>
        {includePdf&&<fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 14px"}}>
          <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Pages du PDF</legend>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <Btn small color={C.border} onClick={()=>setSelectedSections(REPORT_SECTIONS.map(s=>s.id))}>Tout cocher</Btn>
            <Btn small color={C.border} onClick={()=>setSelectedSections([])}>Tout décocher</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {REPORT_SECTIONS.map(s=><label key={s.id} style={{display:"flex",alignItems:"center",gap:6,color:C.text,fontSize:12,cursor:"pointer"}}>
              <input type="checkbox" checked={selectedSections.includes(s.id)} onChange={()=>setSelectedSections(prev=>prev.includes(s.id)?prev.filter(id=>id!==s.id):[...prev,s.id])}/>{s.label}
            </label>)}
          </div>
        </fieldset>}
        {snRows.length>0 ? (
          <>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <Btn onClick={selectAll} color={C.blue} small>Tout cocher</Btn>
              <Btn onClick={selectNone} color={C.border} small>Tout decocher</Btn>
            </div>
            <div style={{maxHeight:220,overflow:"auto",border:`1px solid ${C.border}`,borderRadius:6,
              padding:8,marginBottom:12}}>
              {snRows.map(u=>(
                <label key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 4px",
                  borderBottom:`1px solid ${C.border}55`,cursor:"pointer",fontFamily:"monospace",fontSize:12}}>
                  <input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggle(u.id)}
                    style={{accentColor:C.blue}}/>
                  <span style={{color:C.text}}>{snTitle(u)}</span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:10,color:C.muted,marginBottom:12}}>
            Aucun SN dans la table SN : le rapport exportera les lignes globales de l'OF.
          </div>
        )}
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:16,cursor:"pointer"}}>
          <input type="checkbox" checked={includeHistory} onChange={e=>setIncludeHistory(e.target.checked)}
            style={{accentColor:C.blue}}/>
          Inclure les historiques de modification des lignes
        </label>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:16,cursor:"pointer"}}>
          <input type="checkbox" checked={includeDeleted} onChange={e=>setIncludeDeleted(e.target.checked)}
            style={{accentColor:C.blue}}/>
          Inclure les lignes annulées barrées
        </label>
        <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:16,cursor:"pointer"}}>
          <input type="checkbox" checked={skipEmptyReports} onChange={e=>setSkipEmptyReports(e.target.checked)} style={{accentColor:C.blue}}/>
          Ne pas exporter les rapports vides
        </label>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn onClick={onCancel} color={C.border} small>Annuler</Btn>
          <Btn disabled={!canGenerate} onClick={()=>canGenerate&&onConfirm({selectedSnIds:selected,selectedSections,includeHistory,includeDeleted,skipEmptyReports,includePdf,includeCsv})}
            color={canGenerate?C.green:C.border} small>Generer</Btn>
        </div>
      </div>
    </div>
  );
};

const BulkPdfOptionsModal = ({rows,onCancel,onConfirm}) => {
  const [includeHistory,setIncludeHistory]=useState(false);
  const [includeDeleted,setIncludeDeleted]=useState(true);
  const [skipEmptyReports,setSkipEmptyReports]=useState(true);
  const [selectedSections,setSelectedSections]=useState(()=>REPORT_SECTIONS.map(section=>section.id));
  const [running,setRunning]=useState(false);
  const [error,setError]=useState("");
  const ofCount=new Set(rows.map(row=>row.id)).size;
  const run=async()=>{
    setRunning(true);setError("");
    try{await onConfirm({selectedSections,includeHistory,includeDeleted,skipEmptyReports});}
    catch(reason){setError(reason?.message||String(reason));setRunning(false);}
  };
  return <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:320,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div role="dialog" aria-modal="true" aria-labelledby="bulk-pdf-title" style={{background:C.surface,border:`2px solid ${C.blue}`,borderRadius:8,padding:20,width:520,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 12px 40px #0008"}}>
      <h2 id="bulk-pdf-title" style={{margin:"0 0 6px",fontSize:16,color:C.blue}}>Impression en masse</h2>
      <div style={{color:C.muted,fontSize:12,marginBottom:14}}>{ofCount} dossier{ofCount>1?"s":""} · {rows.length} SN/lot{rows.length>1?"s":""} sélectionné{rows.length>1?"s":""}</div>
      <fieldset style={{border:`1px solid ${C.border}`,borderRadius:4,padding:10,margin:"0 0 14px"}}>
        <legend style={{color:C.text,fontSize:12,fontWeight:700}}>Pages du PDF groupé</legend>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Btn small color={C.border} onClick={()=>setSelectedSections(REPORT_SECTIONS.map(section=>section.id))}>Tout cocher</Btn>
          <Btn small color={C.border} onClick={()=>setSelectedSections([])}>Tout décocher</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {REPORT_SECTIONS.map(section=><label key={section.id} style={{display:"flex",alignItems:"center",gap:6,color:C.text,fontSize:12,cursor:"pointer"}}>
            <input type="checkbox" checked={selectedSections.includes(section.id)} onChange={()=>setSelectedSections(previous=>previous.includes(section.id)?previous.filter(id=>id!==section.id):[...previous,section.id])}/>{section.label}
          </label>)}
        </div>
      </fieldset>
      <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:12,cursor:"pointer"}}><input type="checkbox" checked={includeHistory} onChange={event=>setIncludeHistory(event.target.checked)}/>Inclure les historiques de modification</label>
      <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:12,cursor:"pointer"}}><input type="checkbox" checked={includeDeleted} onChange={event=>setIncludeDeleted(event.target.checked)}/>Inclure les lignes annulées barrées</label>
      <label style={{display:"flex",alignItems:"center",gap:8,color:C.text,fontSize:12,marginBottom:14,cursor:"pointer"}}><input type="checkbox" checked={skipEmptyReports} onChange={event=>setSkipEmptyReports(event.target.checked)}/>Ne pas exporter les rapports vides</label>
      {error&&<div role="alert" style={{color:C.red,fontSize:12,marginBottom:10}}>{error}</div>}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn onClick={onCancel} disabled={running} color={C.border} small>Annuler</Btn>
        <Btn onClick={run} disabled={running||!selectedSections.length} color={C.blue} small>{running?"Génération…":"Créer le PDF à imprimer"}</Btn>
      </div>
    </div>
  </div>;
};

const RestoreModal = ({onConfirm, onCancel}) => {
  const [reason, setReason] = useState("");
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`2px solid ${C.yellow}`,borderRadius:10,
        padding:24,width:460,maxWidth:"100%"}}>
        <div style={{fontWeight:700,color:C.yellow,fontSize:15,marginBottom:6}}>
          ↩ Réactiver cette ligne
        </div>
        <div style={{color:C.muted,fontSize:12,marginBottom:16,lineHeight:1.6}}>
          La réactivation sera tracée avec visa, date et motif.
        </div>
        <div style={{marginBottom:18}}>
          <div style={{color:C.muted,fontSize:10,textTransform:"uppercase",
            letterSpacing:.8,marginBottom:6}}>Motif de la réactivation *</div>
          <Input value={reason} onChange={setReason}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn onClick={onCancel} color={C.border}>Annuler</Btn>
          <Btn onClick={()=>reason.trim()&&onConfirm(reason.trim())} color={C.yellow}
            disabled={!reason.trim()}>↩ Confirmer</Btn>
        </div>
      </div>
    </div>
  );
};

const TH = ({children,w,color}) => (
  <th style={{background:C.raised,color:color||C.muted,fontSize:10,fontWeight:700,letterSpacing:.8,
    textTransform:"uppercase",padding:"4px 5px",textAlign:"left",
    borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",width:w}}>
    {children}
  </th>
);
const TD = ({children,center,style,onClick}) => (
  <td onClick={onClick} style={{padding:"3px 5px",borderBottom:`1px solid ${C.border}20`,
    fontSize:12,textAlign:center?"center":"left",verticalAlign:"middle",...style}}>
    {children}
  </td>
);
const SectionTitle = ({children}) => (
  <div style={{fontWeight:700,fontSize:13,color:C.accent,letterSpacing:.5,marginBottom:14,
    textTransform:"uppercase",borderBottom:`1px solid ${C.border}`,paddingBottom:10}}>
    {children}
  </div>
);

// ─── Header OF — éditable ──────────────────────────────────────────────────
const Header = ({of:h, onUpdate, onUpdateStatus, user, onCommentsChange}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({});
  const [copiedField,setCopiedField] = useState("");

  const startEdit = () => { if(!isAdminManager(user)) return; setDraft({...h}); setEditing(true); };
  const save      = () => {
    const {_snRows,_defaultSnIds,...cleanDraft}=draft;
    onUpdate(cleanDraft);
    setEditing(false);
  };
  const cancel    = () => setEditing(false);
  const headerSnRows = snRowsFromHeader(h);
  const headerSnFull = headerSnRows.map(snTitle).join(" · ")||h.sn||"—";
  const headerSnDisplay = headerSnRows.length>4 ? `${headerSnRows.length} SN` : headerSnFull;
  const copyHeaderField=(label,value)=>{
    copyToClipboard(value);
    setCopiedField(label);
    setTimeout(()=>setCopiedField(current=>current===label?"":current),1400);
  };

  const FIELDS = [
    {key:"of",          label:"OF"},
    {key:"codeArticle",    label:"N° Article"},
    {key:"description",    label:"Description"},
    {key:"otp",            label:"OTP"},
  ];

  if(editing) return (
    <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:6,padding:12,marginBottom:16}}>
      <div style={{fontSize:11,color:C.accent,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:.8}}>
        ✎ Modifier les informations du dossier
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
        {FIELDS.map(({key,label})=>(
          <div key={key}>
            <div style={{color:C.muted,fontSize:9,letterSpacing:.8,textTransform:"uppercase",marginBottom:3}}>{label}</div>
            <Input value={draft[key]||""} onChange={v=>setDraft(d=>({...d,[key]:v}))} small/>
          </div>
        ))}
        <div>
          <div style={{color:C.muted,fontSize:9,letterSpacing:.8,textTransform:"uppercase",marginBottom:3}}>OF reprise</div>
          <select value={draft.ofRework||"non"} onChange={e=>setDraft(d=>({...d,ofRework:e.target.value}))}
            style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
              color:C.text,padding:"4px 6px",fontSize:11,fontFamily:"monospace",outline:"none"}}>
            <option value="non">Non</option>
            <option value="oui">Oui</option>
          </select>
        </div>
        <div>
          <div style={{color:C.muted,fontSize:9,letterSpacing:.8,textTransform:"uppercase",marginBottom:3}}>Statut OF</div>
          <select value={draft.status||"en_cours"} onChange={e=>setDraft(d=>({...d,status:e.target.value}))}
            style={{width:"100%",background:STATUTS[draft.status||"en_cours"]?.color+"22",
              border:`1px solid ${STATUTS[draft.status||"en_cours"]?.color}`,borderRadius:4,
              color:STATUTS[draft.status||"en_cours"]?.color,padding:"4px 6px",fontSize:11,fontFamily:"monospace",fontWeight:700,outline:"none"}}>
            {Object.entries(STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={save}   color={C.green}  small>✓ Enregistrer</Btn>
        <Btn onClick={cancel} color={C.border} small>Annuler</Btn>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",alignItems:"stretch",gap:1,marginBottom:8}}>
      <div style={{display:"grid",gridTemplateColumns:"0.9fr 1fr 1.9fr .7fr 1fr .7fr .85fr .7fr",gap:1,flex:1,
        background:C.border,border:`1px solid ${C.border}`,borderRadius:"6px 0 0 6px",
        overflow:"hidden",fontSize:11}}>
        {[
          ["OF",                h.of||"—"],
          ["Article",           h.codeArticle||"—"],
          ["Description",       h.description||"—"],
          ["SN",                headerSnDisplay, headerSnFull],
          ["OTP",               h.otp||h.projet||"—"],
          ["OF reprise",        (String(h.ofRework||"non").toLowerCase()==="oui"||String(h.ofRework||"").toLowerCase()==="true")?"Oui":"Non"],
        ].map(([label,val,title])=>{
          const copyValue=title||val,copied=copiedField===label;
          return <div key={label} role="button" tabIndex={0}
            aria-label={copied?`${label} copié`:`${label} : ${copyValue}. Double-cliquer pour copier`}
            onDoubleClick={()=>copyHeaderField(label,copyValue)}
            onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();copyHeaderField(label,copyValue);}}}
            style={{background:copied?C.green+"20":C.surface,padding:"4px 10px",minWidth:0,cursor:"copy",outline:"none",boxShadow:copied?`inset 0 0 0 1px ${C.green}`:undefined}}>
            <div style={{color:C.muted,fontSize:8,letterSpacing:1,textTransform:"uppercase",marginBottom:1}}>{label}</div>
            <div title={`${copyValue} — double-cliquer pour copier`} style={{color:copied?C.green:C.text,fontWeight:700,fontFamily:"monospace",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{copied?"✓ ":""}{val}</div>
          </div>
        })}
        {/* Photo folder */}
        {h.of&&(
          <div style={{background:C.surface,padding:"4px 10px",minWidth:0}}>
            <div style={{color:C.muted,fontSize:8,letterSpacing:1,textTransform:"uppercase",marginBottom:1}}>Photos</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:11}}>📁</span>
              <span style={{fontFamily:"monospace",fontSize:9,color:C.muted,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:70}}
                title={`S:\\OP_SPACE\\Photos_OF\\${h.of}`}>
                OF
              </span>
              <span onClick={e=>{
                e.stopPropagation();
                const path=`S:\\OP_SPACE\\Photos_OF\\${h.of}`;
                try{
                  const ta=document.createElement("textarea");
                  ta.value=path;ta.style.position="fixed";ta.style.opacity="0";
                  document.body.appendChild(ta);ta.select();
                  document.execCommand("copy");
                  document.body.removeChild(ta);
                }catch{window.prompt("Copier (Ctrl+C):",path);}
              }} style={{cursor:"pointer",color:C.blue,fontSize:9,flexShrink:0,
                background:C.blue+"22",border:`1px solid ${C.blue}`,borderRadius:3,
                padding:"1px 5px",whiteSpace:"nowrap"}} title="Copier le chemin">
                ⎘
              </span>
            </div>
          </div>
        )}
        {/* Statut */}
        <div style={{background:C.surface,padding:"4px 10px",display:"flex",flexDirection:"column",justifyContent:"center",minWidth:0}}>
          <div style={{color:C.muted,fontSize:8,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Statut OF</div>
          <select disabled={!isAdminManager(user)} value={h.status||"en_cours"} onChange={e=>onUpdateStatus&&onUpdateStatus(e.target.value)}
            style={{background:STATUTS[h.status||"en_cours"]?.color+"22",
              border:`1px solid ${STATUTS[h.status||"en_cours"]?.color}`,
              borderRadius:14,padding:"2px 8px",fontSize:10,fontWeight:700,
              color:STATUTS[h.status||"en_cours"]?.color,outline:"none",cursor:"pointer",width:"100%"}}>
            {Object.entries(STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <button disabled={!isAdminManager(user)} onClick={startEdit} title="Modifier les informations du dossier (Admin / Manager)"
          style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"0 6px 0 0",
            color:C.muted,cursor:"pointer",padding:"0 12px",fontSize:14,flex:1,
            borderLeft:"none",transition:"color .15s"}}
          onMouseEnter={e=>e.target.style.color=C.accent}
          onMouseLeave={e=>e.target.style.color=C.muted}>
          ✎
        </button>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"0 0 6px 0",
          borderLeft:"none",borderTop:"none",display:"flex",alignItems:"center",justifyContent:"center",padding:"4px 12px"}}>
          <CommentBtn comments={h.comments||[]} onChange={v=>onCommentsChange&&onCommentsChange(v)} user={user}/>
        </div>
      </div>
    </div>
  );
};

const cleanSn = v => String(v??"").trim().toUpperCase();
const hasUnitIdentity = u => !!(cleanSn(u.sn)||cleanSn(u.lot));
const isTrackedLot = row => row.unitKind ? row.unitKind==="lot" : !cleanSn(row.sn)&&!!cleanSn(row.lot);
const normalizeTrackedUnit = row => isTrackedLot(row)?{...row,sn:"",lot:cleanSn(row.lot||row.sn),unitKind:"lot"}:row;
const snTitle = u => [u?.sn||"",u?.lot?`LOT ${u.lot}`:""].filter(Boolean).join(" · ")||"SN / lot ?";
const snRowsFromHeader = header => (header?._snRows||[]).map(normalizeTrackedUnit).filter(r=>!r.deleted&&hasUnitIdentity(r));
const snScope = (row, snRows=[]) => {
  let ids = Array.isArray(row?.snIds) ? row.snIds.filter(Boolean) : [];
  if(!ids.length&&row?.unitId) ids=[row.unitId];
  ids=[...new Set(ids)].filter(id=>snRows.some(s=>s.id===id));
  if(row?.snScope==="custom"||ids.length) return {mode:"custom",ids};
  return {mode:"all",ids:[]};
};
const snScopeLabel = (row, snRows=[]) => {
  const scope=snScope(row,snRows);
  const excluded=(row?.snExcludeIds||[]).filter(id=>snRows.some(s=>s.id===id));
  if(scope.mode==="all"){
    if(excluded.length) return `Tous sauf ${excluded.length} SN`;
    return "Tous";
  }
  const labels=scope.ids.map(id=>snRows.find(s=>s.id===id)).filter(Boolean).map(snTitle);
  return labels.length>2 ? `${labels.length} SN` : labels.join(" + ") || "SN ?";
};
const defaultSnScope = header => {
  const rows=snRowsFromHeader(header);
  const ids=(header?._entrySnIds||header?._defaultSnIds||[]).filter(id=>rows.some(s=>s.id===id));
  return ids.length
    ? {snScope:"custom",snIds:ids,unitId:ids[0]}
    : {snScope:"all",snIds:[],unitId:""};
};
const rowMatchesSn = (row, snRow, snRows=[]) => {
  if(!snRow) return true;
  const scope=snScope(row,snRows);
  const excluded=(row?.snExcludeIds||[]).filter(id=>snRows.some(s=>s.id===id));
  if(scope.mode==="all") return !excluded.includes(snRow.id);
  return scope.ids.includes(snRow.id);
};
const workSnFilter = header => {
  const rows=snRowsFromHeader(header);
  const id=(header?._defaultSnIds||[]).find(x=>rows.some(s=>s.id===x));
  return id||"all";
};
const scopeDecisionForEdit = (row, header) => {
  if(!row?.validated&&!row?.editBase) return {};
  const active=workSnFilter(header);
  if(active==="all") return {};
  const snRows=snRowsFromHeader(header);
  const scope=snScope(row,snRows);
  const targets=snRows.filter(u=>rowMatchesSn(row,u,snRows));
  if(targets.length<2||!targets.some(u=>u.id===active)) return {};
  if(row?._scopeEditConfirmed) return {};
  const unit=snRowsFromHeader(header).find(s=>s.id===active);
  const choice=window.prompt(
    `Cette ligne concerne ${scope.mode==="all"?"tous les SN":`${targets.length} SN`}.\n\n1 = isoler et modifier uniquement ce SN (${unit?snTitle(unit):"SN courant"})\n2 = modifier pour tous les SN de cette ligne\n3 = annuler l'operation\n\nVotre choix :`,
    "1"
  );
  if(choice===null || String(choice).trim()==="3") return null;
  if(String(choice).trim()==="2") return {_scopeEditConfirmed:true};
  return {snScope:"custom",snIds:[active],unitId:active,__scopeAction:"split",__scopeActiveId:active};
};
const scopeDecisionForDelete = (row, header) => {
  const active=workSnFilter(header);
  if(active==="all") return {};
  if(snScope(row,snRowsFromHeader(header)).mode!=="all") return {};
  const unit=snRowsFromHeader(header).find(s=>s.id===active);
  const choice=window.prompt(
    `Cette ligne est ciblee "Tous les SN".\n\n1 = annuler uniquement pour ce SN (${unit?snTitle(unit):"SN courant"})\n2 = annuler pour tous les SN\n3 = annuler l'operation\n\nVotre choix :`,
    "1"
  );
  if(choice===null || String(choice).trim()==="3") return null;
  if(String(choice).trim()==="2") return {};
  return {__scopeAction:"split",__scopeActiveId:active};
};
const scopedPatch = (row, header, fields) => {
  const decision=scopeDecisionForEdit(row,header);
  if(decision===null) return row;
  const {__scopeAction,__scopeActiveId,...patch}=decision;
  return {...row,...patch,...fields};
};
const remainingSnScope = (row,active) => {
  if(row.snScope==="custom"||(row.snIds||[]).length||row.unitId){
    const ids=(row.snIds?.length?row.snIds:[row.unitId]).filter(id=>id&&id!==active);
    return {snScope:"custom",snIds:ids,unitId:ids[0]||""};
  }
  return {snExcludeIds:[...new Set([...(row.snExcludeIds||[]),active])]};
};
const scopedRowsPatch = (rows, id, header, fieldsForRow, cloneExtra={}) => {
  let inserted=null;
  const independent=[];
  const next=rows.map(r=>{
    if(r.id!==id) return r;
    const fields=typeof fieldsForRow==="function" ? fieldsForRow(r) : fieldsForRow;
    const decision=scopeDecisionForEdit(r,header);
    if(decision===null) return r;
    if(decision.__scopeAction==="split"){
      const active=decision.__scopeActiveId;
      const excluded=[...new Set([...(r.snExcludeIds||[]),active])];
      inserted={...r,...fields,...cloneExtra,id:uid(),snScope:"custom",snIds:[active],unitId:active,snExcludeIds:[],_scopeEditConfirmed:undefined};
      return {...r,...remainingSnScope(r,active),_scopeEditConfirmed:undefined};
    }
    const {__scopeAction,__scopeActiveId,...patch}=decision;
    const result={...r,...patch,...fields};
    const newlyValidated=!r.validated&&result.validated||(result.items||[]).some(item=>item.validated&&!(r.items||[]).find(old=>old.id===item.id)?.validated);
    if(newlyValidated&&header?._confirmMultiSn){
      const units=snRowsFromHeader(header);
      const targets=units.filter(unit=>rowMatchesSn(result,unit,units));
      if(targets.length>1){
        if(!window.confirm(`Créer ${targets.length} lignes indépendantes, une par SN / LOT ?\n\n${targets.map(snTitle).join("\n")}\n\nChaque ligne pourra être modifiée ou annulée séparément.`)) return r;
        const clone=(value,newIds)=>Array.isArray(value)?value.map(item=>clone(item,newIds)):value&&typeof value==="object"
          ? Object.fromEntries(Object.entries(value).map(([key,item])=>[key,key==="id"&&newIds?uid():clone(item,newIds)])) : value;
        const copies=targets.map((unit,index)=>({...clone(result,index>0),snScope:"custom",snIds:[unit.id],unitId:unit.id,snExcludeIds:[],_scopeEditConfirmed:undefined}));
        independent.push(...copies.slice(1));
        return copies[0];
      }
    }
    return result;
  });
  return [...next,...(inserted?[inserted]:[]),...independent];
};
const scopedRowsDelete = (rows, id, header, fieldsForRow) => {
  let inserted=null;
  const next=rows.map(r=>{
    if(r.id!==id) return r;
    const fields=typeof fieldsForRow==="function" ? fieldsForRow(r) : fieldsForRow;
    const decision=scopeDecisionForDelete(r,header);
    if(decision===null) return r;
    if(decision.__scopeAction==="split"){
      const active=decision.__scopeActiveId;
      const excluded=[...new Set([...(r.snExcludeIds||[]),active])];
      if(!snRowsFromHeader(header).some(u=>!excluded.includes(u.id))) return {...r,...fields};
      inserted={...r,...fields,id:uid(),snScope:"custom",snIds:[active],unitId:active,snExcludeIds:[],_scopeEditConfirmed:undefined};
      return {...r,...remainingSnScope(r,active),_scopeEditConfirmed:undefined};
    }
    return {...r,...fields};
  });
  return inserted?[...next,inserted]:next;
};
const rowMatchesSnFilter = (row, filter, header) => {
  if(Array.isArray(filter)) return !filter.length||filter.some(f=>rowMatchesSnFilter(row,f,header));
  if(!filter||filter==="all") return true;
  const rows=snRowsFromHeader(header);
  const scope=snScope(row,rows);
  if(filter==="scope-all") return scope.mode==="all";
  const snRow=rows.find(s=>s.id===filter);
  return snRow ? rowMatchesSn(row,snRow,rows) : scope.ids.includes(filter);
};
const effectiveScopedRows = (data,tab) => {
  const units=(data?.units?.rows||snRowsFromHeader(data?.header||{})).filter(u=>!u.deleted&&hasUnitIdentity(u));
  return (data?.[tab]?.rows||[]).filter(r=>!r.deleted&&(!units.length||units.some(u=>rowMatchesSn(r,u,units))));
};
const effectiveEtuvageRows = data => effectiveScopedRows(data,"etuvage");
const SnFilter = ({value,onChange,header,title="Filtrer SN cible"}) => {
  const rows=snRowsFromHeader(header);
  if(!rows.length) return null;
  return <MultiFilter value={value} onChange={onChange} label="Tous" title={title}
    options={[{value:"scope-all",label:"Cible Tous"},...rows.map(s=>({value:s.id,label:snTitle(s)}))]}/>;
};

const SnScopePicker = ({row,header,onChange,disabled=false}) => {
  const rows=snRowsFromHeader(header);
  const scope=snScope(row,rows);
  const label=snScopeLabel(row,rows);
  const [open,setOpen]=useState(false);
  const [pos,setPos]=useState({top:0,left:0});
  const btnRef=React.useRef(null);
  const panelRef=React.useRef(null);
  const place=()=>{
    const r=btnRef.current?.getBoundingClientRect();
    if(!r) return;
    const w=230;
    setPos({
      top:Math.min(r.bottom+4,window.innerHeight-40),
      left:Math.max(8,Math.min(r.left,window.innerWidth-w-8))
    });
  };
  useEffect(()=>{
    if(!open) return;
    place();
    const close=e=>{
      if(btnRef.current?.contains(e.target)||panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const key=e=>{ if(e.key==="Escape") setOpen(false); };
    window.addEventListener("mousedown",close);
    window.addEventListener("keydown",key);
    window.addEventListener("scroll",place,true);
    window.addEventListener("resize",place);
    return ()=>{
      window.removeEventListener("mousedown",close);
      window.removeEventListener("keydown",key);
      window.removeEventListener("scroll",place,true);
      window.removeEventListener("resize",place);
    };
  },[open]);
  if(!rows.length) return <span style={{fontFamily:"monospace",fontSize:10,color:C.muted}}>Tous</span>;
  if(disabled) return <span style={{fontFamily:"monospace",fontSize:10,color:scope.mode==="all"?C.green:C.blue}}>{label}</span>;
  const setAll=()=>{onChange({snScope:"custom",snIds:rows.map(s=>s.id),unitId:rows[0]?.id||"",snExcludeIds:[]});setOpen(false);};
  const setCustom=ids=>onChange({snScope:"custom",snIds:ids,unitId:ids[0]||"",snExcludeIds:[]});
  const toggle=id=>{
    const next=scope.ids.includes(id) ? scope.ids.filter(x=>x!==id) : [...scope.ids,id];
    setCustom(next.length?next:[id]);
  };
  return (
    <span className="no-print" style={{display:"inline-block"}}>
      <button ref={btnRef} onClick={e=>{e.stopPropagation();place();setOpen(o=>!o);}}
        title={`Appliquer cette opération à : ${label}`}
        style={{background:C.input,cursor:"pointer",fontFamily:"monospace",fontSize:10,
          color:scope.mode==="all"?C.green:C.blue,border:`1px solid ${scope.mode==="all"?C.green:C.blue}`,
          borderRadius:4,padding:"2px 5px",whiteSpace:"nowrap",maxWidth:72,overflow:"hidden",textOverflow:"ellipsis"}}>
        {label}
      </button>
      {open&&(
        <div ref={panelRef} style={{position:"fixed",top:pos.top,left:pos.left,zIndex:600,background:C.surface,
          border:`1px solid ${C.border}`,borderRadius:6,padding:8,width:230,boxShadow:"0 14px 34px #000b"}}>
          <label style={{display:"flex",alignItems:"center",gap:6,color:C.text,fontSize:11,marginBottom:5,cursor:"pointer"}}>
            <input type="radio" checked={scope.mode==="all"||scope.ids.length===rows.length} onChange={setAll} style={{accentColor:C.green}}/>
            Appliquer à tous les SN / LOT
          </label>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:5,maxHeight:220,overflowY:"auto"}}>
            {rows.map(s=>(
              <label key={s.id} style={{display:"flex",alignItems:"center",gap:6,color:C.text,fontSize:11,marginBottom:4,cursor:"pointer"}}>
                <input type="checkbox" checked={scope.mode==="custom"&&scope.ids.includes(s.id)}
                  onChange={()=>toggle(s.id)} style={{accentColor:C.blue}}/>
                <span style={{fontFamily:"monospace"}}>{snTitle(s)}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </span>
  );
};

const unitsFromHeader = (h={}, visa="") => (h._snRows||[]).length ? {mode:(h._snRows||[]).length>1?"multi":"single",rows:(h._snRows||[]).map(r=>({
  ...r,
  id:r.id||uid(),
  sn:r.sn||"",
  lot:r.lot||h.lot||"",
  status:r.status||"en_cours",
  snProduitFini:r.snProduitFini??((h._snRows||[]).filter(u=>!u.deleted).length===1?h.snProduitFini||"":""),
  qteInitiale:r.qteInitiale||r.qte||"",
  unitKind:r.unitKind||r.kind||"",
  remarque:r.remarque||"",
  createdVisa:r.createdVisa||visa||h.createdBy||"",
  createdDT:r.createdDT||h.createdAt||nowDT(),
  deleted:!!r.deleted,
}))} : (h.sn||h.lot) ? {mode:"single",rows:[{
  id:uid(),
  sn:h.sn||"",
  lot:h.lot||"",
  status:"en_cours",
  snProduitFini:h.snProduitFini||"",
  qteInitiale:h.qteInitiale||h.qte||"",
  unitKind:h.unitKind||"",
  remarque:"",
  createdVisa:visa||h.createdBy||"",
  createdDT:h.createdAt||nowDT(),
  deleted:false,
}]} : {mode:"single",rows:[]};
const withUnitMetadata = data => {
  if(Array.isArray(data.demating?.connectors)) data={...data,demating:{...data.demating,connectors:data.demating.connectors.map(c=>({...c,events:(c.events||[]).map(e=>({...e,action:normalizeMatingAction(e.action)}))}))}};
  const units=Array.isArray(data.units?.rows)?data.units:unitsFromHeader(data.header);
  const active=units.rows.filter(u=>!u.deleted);
  const rows=units.rows.map(u=>({...normalizeTrackedUnit(u),status:u.status||"en_cours",
    snProduitFini:u.snProduitFini??(active.length===1?data.header?.snProduitFini||"":"")}));
  return {...data,units:{...units,rows},header:{...data.header,_snRows:rows}};
};
const patchTrackedUnit = (data,unitId,fields) => {
  const normalized=withUnitMetadata(data);
  if(!normalized.units.rows.some(u=>u.id===unitId&&!u.deleted)) throw new Error("Pièce introuvable dans cet OF.");
  const allowed={};
  if(Object.hasOwn(fields,"snProduitFini")) allowed.snProduitFini=String(fields.snProduitFini||"").trim();
  if(Object.hasOwn(fields,"status")){
    if(!Object.hasOwn(UNIT_STATUTS,fields.status)) throw new Error("Statut SN invalide.");
    allowed.status=fields.status;
  }
  const rows=normalized.units.rows.map(u=>u.id===unitId?{...u,...allowed}:u);
  return {...normalized,units:{...normalized.units,rows},header:{...normalized.header,_snRows:rows}};
};

const trackedLotQty = row => row.qteActuelle??row.qteInitiale??row.qte??"";
const convertTrackedUnitKind = (data,unitId,targetKind,user) => {
  const normalized=withUnitMetadata(data);
  const source=normalized.units.rows.find(unit=>unit.id===unitId&&!unit.deleted);
  if(!source) throw new Error("SN / lot introuvable.");
  if(!["sn","lot"].includes(targetKind)) throw new Error("Type de pièce invalide.");
  if(targetKind==="sn"){
    const value=cleanSn(source.sn||source.lot);
    if(!value) throw new Error("Numéro de série vide.");
    if(normalized.units.rows.some(unit=>unit.id!==unitId&&!unit.deleted&&cleanSn(unit.sn)===value)) throw new Error(`SN ${value} déjà présent dans cet OF.`);
    return {...normalized,units:{...normalized.units,rows:normalized.units.rows.map(unit=>unit.id===unitId?{
      ...unit,sn:value,lot:"",unitKind:"sn",qteInitiale:"",qteActuelle:"",qte:"",
      kindHistory:[...(unit.kindHistory||[]),{from:isTrackedLot(source)?"lot":"sn",to:"sn",dt:nowDT(),visa:user?.trigram||""}]
    }:unit)}};
  }
  const value=cleanSn(source.lot||source.sn);
  if(!value) throw new Error("Numéro de lot vide.");
  if(normalized.units.rows.some(unit=>unit.id!==unitId&&!unit.deleted&&isTrackedLot(unit)&&cleanSn(unit.lot)===value)) throw new Error(`Lot ${value} déjà présent dans cet OF.`);
  return {...normalized,units:{...normalized.units,rows:normalized.units.rows.map(unit=>unit.id===unitId?{
    ...unit,sn:"",lot:value,unitKind:"lot",qteInitiale:unit.qteInitiale||"1",qteActuelle:unit.qteActuelle||unit.qteInitiale||"1",
    kindHistory:[...(unit.kindHistory||[]),{from:isTrackedLot(source)?"lot":"sn",to:"lot",dt:nowDT(),visa:user?.trigram||""}]
  }:unit)}};
};
const changeTrackedLotQuantity = (data,sourceId,value,user) => {
  if(!isAdminManager(user)) throw new Error("Seuls Admin et Manager peuvent modifier les quantités.");
  const normalized=withUnitMetadata(data),source=normalized.units.rows.find(u=>u.id===sourceId&&!u.deleted);
  if(!source||!isTrackedLot(source)) throw new Error("Lot introuvable.");
  if(!/^[1-9]\d*$/.test(String(value).trim())||!Number.isSafeInteger(Number(value))) throw new Error("La quantité doit être un entier strictement positif.");
  const qty=String(Number(value));
  if(qty===String(trackedLotQty(source))) return normalized;
  const event={id:uid(),before:trackedLotQty(source),after:qty,dt:nowDT(),visa:user.trigram};
  return withUnitMetadata({...normalized,units:{...normalized.units,rows:normalized.units.rows.map(u=>u.id===sourceId
    ? {...u,qteInitiale:u.qteInitiale||u.qte||qty,qteActuelle:qty,quantityHistory:[...(u.quantityHistory||[]),event]}:u)}});
};
const splitTrackedLot = (data,sourceId,remaining,destinations,user) => {
  if(!isAdminManager(user)) throw new Error("Seuls Admin et Manager peuvent scinder un lot.");
  const normalized=withUnitMetadata(data),units=normalized.units.rows;
  const source=units.find(u=>u.id===sourceId&&!u.deleted);
  if(!source||!isTrackedLot(source)) throw new Error("Lot source introuvable.");
  const quantity=value=>{
    if(!/^[1-9]\d*$/.test(String(value).trim())||!Number.isSafeInteger(Number(value))) throw new Error("Les quantités doivent être des entiers strictement positifs.");
    return Number(value);
  };
  const initial=quantity(trackedLotQty(source)),left=quantity(remaining);
  if(!Array.isArray(destinations)||!destinations.length) throw new Error("Ajoutez au moins un lot destination.");
  const labels=new Set(units.filter(u=>!u.deleted).flatMap(u=>[cleanSn(u.sn),cleanSn(u.lot)]).filter(Boolean));
  const targets=destinations.map(d=>{
    const lot=cleanSn(d.lot);
    if(!lot||["N/A","NA","-"].includes(lot)||labels.has(lot)) throw new Error("Chaque nouveau lot doit avoir un numéro unique dans cet OF.");
    labels.add(lot);
    return {lot,qty:quantity(d.qty)};
  });
  if(left+targets.reduce((sum,d)=>sum+d.qty,0)!==initial) throw new Error(`La somme des quantités doit être égale à ${initial}.`);
  const dt=nowDT(),visa=user.trigram,splitId=uid();
  const children=targets.map(d=>({...source,id:uid(),sn:"",lot:d.lot,unitKind:"lot",
    qteInitiale:String(d.qty),qteActuelle:String(d.qty),qte:String(d.qty),parentUnitId:source.id,splitId,splitDate:dt,
    createdVisa:visa,createdDT:dt,snError:"",quantityHistory:[],deleted:false}));
  const result={...normalized,units:{...normalized.units,mode:"multi",rows:[...units.map(u=>u.id===source.id?{...u,qteActuelle:String(left),quantityHistory:[...(u.quantityHistory||[]),{id:uid(),before:String(initial),after:String(left),dt,visa,splitId}]}:u),...children]},
    lotSplits:[...(normalized.lotSplits||[]),{id:splitId,sourceId,sourceLot:source.sn||source.lot,initialQty:initial,remainingQty:left,
      destinations:children.map(u=>({id:u.id,lot:u.lot,qty:Number(u.qteInitiale)})),dt,visa}]};
  const active=units.filter(u=>!u.deleted&&hasUnitIdentity(u));
  const inherit=row=>{
    const ids=active.filter(u=>rowMatchesSn(row,u,active)).map(u=>u.id);
    if(ids.includes(source.id)) ids.push(...children.map(u=>u.id));
    return {...row,snScope:"custom",snIds:ids,unitId:ids[0]||"",snExcludeIds:[]};
  };
  for(const [tab,key] of [["rework","rows"],["consommables","ops"],["testequip","rows"],["faits","rows"],["etuvage","rows"],["demating","connectors"],["openwork","rows"]]){
    if(Array.isArray(result[tab]?.[key])) result[tab]={...result[tab],[key]:result[tab][key].map(inherit)};
  }
  return withUnitMetadata(result);
};
const SplitLotModal = ({source,onConfirm,onClose}) => {
  const [remaining,setRemaining]=useState(trackedLotQty(source));
  const [destinations,setDestinations]=useState([{lot:"",qty:""}]);
  const [error,setError]=useState("");
  const total=Number(remaining||0)+destinations.reduce((sum,d)=>sum+Number(d.qty||0),0);
  const inputStyle={width:"100%",boxSizing:"border-box",padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4};
  const patch=(index,key,value)=>{setError("");setDestinations(ds=>ds.map((d,i)=>i===index?{...d,[key]:value}:d));};
  return <div style={{position:"fixed",inset:0,zIndex:500,background:"#0009",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div role="dialog" aria-modal="true" aria-label="Scinder le lot" style={{width:640,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:20}}>
      <h3 style={{margin:"0 0 16px",fontSize:18}}>Scinder le lot</h3>
      <div style={{marginBottom:16}}>Lot source : <strong>{source.sn||source.lot}</strong> — Qté actuelle : <strong>{trackedLotQty(source)||"Non renseignée"}</strong></div>
      <label>Qté conservée dans le lot source<input aria-label="Qté conservée" type="number" min="1" step="1" value={remaining} onChange={e=>{setError("");setRemaining(e.target.value);}} style={{...inputStyle,marginTop:5,marginBottom:16}}/></label>
      <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr><TH>Nouveau lot</TH><TH w={90}>Qté</TH><TH w={36}/></tr></thead><tbody>
        {destinations.map((d,i)=><tr key={i}><TD><input aria-label={`Lot destination ${i+1}`} value={d.lot} onChange={e=>patch(i,"lot",e.target.value)} style={inputStyle}/></TD>
          <TD><input aria-label={`Qté destination ${i+1}`} type="number" min="1" step="1" value={d.qty} onChange={e=>patch(i,"qty",e.target.value)} style={inputStyle}/></TD>
          <TD><IconBtn title="Retirer ce lot destination" disabled={destinations.length===1} color={C.red} onClick={()=>setDestinations(ds=>ds.filter((_,index)=>index!==i))}>×</IconBtn></TD></tr>)}
      </tbody></table>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginTop:12}}><Btn small onClick={()=>setDestinations(ds=>[...ds,{lot:"",qty:""}])}>+ Lot destination</Btn><strong style={{color:total===Number(trackedLotQty(source))?C.green:C.red}}>Total : {total} / {trackedLotQty(source)||"?"}</strong></div>
      {error&&<div role="alert" style={{color:C.red,marginTop:12}}>{error}</div>}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20}}><Btn small onClick={onClose}>Annuler</Btn><Btn small color={C.blue} onClick={()=>{try{onConfirm(remaining,destinations);}catch(e){setError(e.message);}}}>Confirmer le split</Btn></div>
    </div>
  </div>;
};
const TrackedSNs = ({data,onChange,onSplitLot,onLotQuantity,onConvertUnit,splitHistory=[],header,user,activeUnitId,onActiveUnitChange}) => {
  const [splitSource,setSplitSource]=useState(null);
  const editable=isAdminManager(user);
  const rows=data?.rows||[];
  const mode=data?.mode||((rows.filter(r=>!r.deleted).length>1)?"multi":"single");
  const visible=rows.filter(r=>!r.deleted);
  const showQty=visible.some(r=>isTrackedLot(r)||String(r.qteInitiale||r.qte||"").trim());
  const emit=next=>{if(editable) onChange({...data,mode,...next});};
  const add=()=>{
    if(mode==="single"&&visible.length>=1) return;
    emit({rows:[...rows,{
    id:uid(),
    sn:"",
    lot:"",
    qteInitiale:"",
    unitKind:"",
    status:"en_cours",
    snProduitFini:"",
    remarque:"",
    createdVisa:user?.trigram||"",
    createdDT:nowDT(),
    deleted:false,
  }]}); };
  const setMode=m=>{
    if(!editable) return;
    if(m==="single"&&visible.length>1){ window.alert("Mode 1 OF / 1 SN impossible tant que plusieurs SN sont présents."); return; }
    onChange({...data,mode:m,rows});
    if(m==="single"&&visible[0]) onActiveUnitChange(visible[0].id);
  };
  const upd=(id,f,v)=>emit({rows:rows.map(r=>r.id===id?{...r,[f]:v}:r)});
  const updSn=(id,v)=>{
    const sn=cleanSn(v);
    if(sn&&visible.some(r=>r.id!==id&&cleanSn(r.sn)===sn)){
      emit({rows:rows.map(r=>r.id===id?{...r,snError:`SN ${sn} déjà présent dans cet OF`}:r)});
      return;
    }
    emit({rows:rows.map(r=>r.id===id?{...r,sn,unitKind:sn?"sn":r.lot?"lot":"",snError:""}:r)});
  };
  const updLot=(id,value)=>{
    const lot=cleanSn(value),row=rows.find(r=>r.id===id);
    if(!row) return;
    if(lot&&!row.sn&&visible.some(r=>r.id!==id&&!r.sn&&cleanSn(r.lot)===lot)){
      emit({rows:rows.map(r=>r.id===id?{...r,snError:`Lot ${lot} déjà présent dans cet OF`}:r)});
      return;
    }
    emit({rows:rows.map(r=>r.id===id?{...r,lot,unitKind:r.sn?"sn":lot?"lot":"",snError:""}:r)});
  };
  const dup=id=>{
    const r=rows.find(x=>x.id===id); if(!r) return;
    if(mode==="single"&&visible.length>=1) return;
    emit({rows:[...rows,{...r,id:uid(),sn:"",lot:"",unitKind:"",parentUnitId:undefined,splitId:undefined,quantityHistory:[],snProduitFini:"",status:"en_cours",snError:"",createdVisa:user?.trigram||"",createdDT:nowDT(),deleted:false}]});
  };
  const del=id=>{
    if(!editable) return;
    const next=rows.filter(r=>r.id!==id);
    if(activeUnitId===id) onActiveUnitChange("all");
    emit({rows:next});
  };

  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:12,color:C.accent,fontWeight:800,textTransform:"uppercase",letterSpacing:.8}}>Pièces de l'OF</div>
          <div style={{fontSize:10,color:C.muted}}>Article et description restent fixes : {header?.codeArticle||header?.description||"article OF non renseigné"}.</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <select disabled={!editable} value={mode} onChange={e=>setMode(e.target.value)}
            style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,
              padding:"5px 8px",fontSize:11,fontFamily:"monospace",outline:"none"}}>
            <option value="single">1 OF / 1 SN ou lot</option>
            <option value="multi">1 OF / plusieurs SN ou lots</option>
          </select>
          {editable&&<Btn onClick={add} small disabled={mode==="single"&&visible.length>=1}>+ SN / lot</Btn>}
        </div>
      </div>
      {visible.length===0?(
        <div style={{color:C.muted,fontSize:11,padding:"8px 0"}}>Aucun SN suivi - ajoutez le ou les SN concernés par cet OF.</div>
      ):(
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:620}}>
            <thead>
              <tr>
                <TH w={150}>SN</TH><TH w={150}>LOT</TH>{showQty&&<TH w={90}>Qté actuelle</TH>}<TH w={150}>SN produit fini</TH><TH w={120}>Statut SN</TH><TH>Remarque</TH><TH w={240}></TH>
              </tr>
            </thead>
            <tbody>
              {visible.map((r,i)=>(
                <tr key={r.id} style={{background:activeUnitId===r.id?C.blue+"12":i%2===0?"transparent":C.stripe}}>

                  <TD>
                    <Input readOnly={!editable||isTrackedLot(r)} value={r.sn} onChange={v=>updSn(r.id,v)} small style={{fontFamily:"monospace",textTransform:"uppercase",borderColor:r.snError?C.red:undefined}}/>
                    {r.snError&&<div style={{fontSize:9,color:C.red,marginTop:2,fontFamily:"monospace"}}>{r.snError}</div>}
                  </TD>
                  <TD><Input readOnly={!editable} value={r.lot} onChange={v=>updLot(r.id,v)} small style={{fontFamily:"monospace"}}/>{r.parentUnitId&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>Issu de {rows.find(u=>u.id===r.parentUnitId)?.lot||r.parentUnitId}</div>}</TD>
                  {showQty&&<TD><Input readOnly={!editable||isTrackedLot(r)} value={trackedLotQty(r)} onChange={v=>upd(r.id,"qteInitiale",cleanImportQty(v))} small style={{fontFamily:"monospace",textAlign:"center"}}/>{isTrackedLot(r)&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>Initiale : {r.qteInitiale||r.qte||"-"}</div>}</TD>}
                  <TD><Input readOnly={!editable} value={r.snProduitFini||""} onChange={v=>upd(r.id,"snProduitFini",v)} small title="Produit final dans lequel cette pièce est montée"/></TD>
                  <TD>
                    <select disabled={!editable} value={r.status||"en_cours"} onChange={e=>upd(r.id,"status",e.target.value)}
                      style={{background:UNIT_STATUTS[r.status||"en_cours"]?.color+"22",
                        border:`1px solid ${UNIT_STATUTS[r.status||"en_cours"]?.color}`,
                        borderRadius:4,color:UNIT_STATUTS[r.status||"en_cours"]?.color,
                        padding:"4px 6px",fontSize:11,fontFamily:"monospace",fontWeight:700,outline:"none",width:"100%"}}>
                      {Object.entries(UNIT_STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </TD>
                  <TD><Input readOnly={!editable} value={r.remarque} onChange={v=>upd(r.id,"remarque",v)} small/></TD>
                  <TD center>
                    <ActionGroup>
                      <IconBtn onClick={()=>onActiveUnitChange(r.id)} color={C.blue} title="Travailler sur ce SN" disabled={!hasUnitIdentity(r)}>●</IconBtn>
                      {editable&&<IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer" disabled={mode==="single"}>⧉</IconBtn>}
                      {editable&&<IconBtn onClick={()=>del(r.id)} color={C.red} title="Supprimer">×</IconBtn>}
                      {editable&&onSplitLot&&isTrackedLot(r)&&<Btn small color={C.blue} onClick={()=>setSplitSource(r)}>Scinder</Btn>}
                      {editable&&onLotQuantity&&isTrackedLot(r)&&<Btn small color={C.blue} onClick={()=>{const value=window.prompt(`Nouvelle quantité du lot ${r.sn||r.lot}`,trackedLotQty(r));if(value!==null){try{onLotQuantity(r.id,value);}catch(e){window.alert(e.message);}}}}>Qté</Btn>}
                      {editable&&onConvertUnit&&isTrackedLot(r)&&<Btn small color={C.yellow} onClick={()=>{const qty=Number(trackedLotQty(r));if(qty>1&&!window.confirm(`Le lot ${r.lot} contient ${qty} pièces. Le convertir tout de même en un seul SN ?`)) return;try{onConvertUnit(r.id,"sn");}catch(e){window.alert(e.message);}}}>→ SN</Btn>}
                      {editable&&onConvertUnit&&!isTrackedLot(r)&&<Btn small color={C.yellow} onClick={()=>{try{onConvertUnit(r.id,"lot");}catch(e){window.alert(e.message);}}}>→ LOT</Btn>}
                    </ActionGroup>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {splitSource&&<SplitLotModal source={rows.find(u=>u.id===splitSource.id)||splitSource} onClose={()=>setSplitSource(null)} onConfirm={(remaining,destinations)=>{onSplitLot(splitSource.id,remaining,destinations);setSplitSource(null);}}/>}
      {(splitHistory.length>0||visible.some(u=>u.quantityHistory?.length))&&<details style={{marginTop:12}}><summary style={{cursor:"pointer",color:C.blue}}>Historique des lots</summary>
        {splitHistory.map(event=><div key={event.id} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>{event.dt} - {event.visa} : {event.sourceLot} ({event.initialQty}) → {event.sourceLot} ({event.remainingQty}) + {event.destinations.map(d=>`${d.lot} (${d.qty})`).join(" + ")}</div>)}
        {visible.flatMap(u=>(u.quantityHistory||[]).filter(e=>!e.splitId).map(e=><div key={`${u.id}-${e.id}`} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:12}}>{e.dt} - {e.visa} : {u.sn||u.lot} - Qté {e.before||"non renseignée"} → {e.after}</div>))}
      </details>}
    </div>
  );
};

// ─── Système de commentaires threadés ────────────────────────────────────
// comments = [{id, dt, visa, text, replyTo}]
const CommentBtn = ({comments, onChange, user, disabled=false}) => {
  const [open, setOpen]     = React.useState(false);
  const [draft, setDraft]   = React.useState("");
  const [replyTo, setReplyTo] = React.useState(null); // {id, visa, text}
  const [editId, setEditId] = React.useState(null);
  const inputRef = React.useRef(null);
  const listRef  = React.useRef(null);

  const list = comments||[];
  const count = list.length;

  const openModal = e => { e.stopPropagation(); setOpen(true); };
  const close     = () => { setOpen(false); setDraft(""); setReplyTo(null); setEditId(null); };

  const post = () => {
    if(disabled) return;
    if(!draft.trim()) return;
    if(editId){
      onChange(list.map(c=>c.id===editId&&(c.visa===user?.trigram||isAdminManager(user))
        ? {...c,text:draft.trim(),editedDT:nowDT()}
        : c));
      setDraft(""); setReplyTo(null); setEditId(null);
      return;
    }
    const c = {id:uid(), dt:nowDT(), visa:user?.trigram||"?", text:draft.trim(),
      replyTo: replyTo ? replyTo.id : null};
    onChange([...list, c]);
    setDraft(""); setReplyTo(null);
    setTimeout(()=>{ if(listRef.current) listRef.current.scrollTop=listRef.current.scrollHeight; },50);
  };

  const del = id => {
    if(disabled) return;
    onChange(list.filter(c=>c.id!==id || !(c.visa===user?.trigram||isAdminManager(user))));
  };
  const startEdit = c => {
    if(disabled || !(c.visa===user?.trigram||isAdminManager(user))) return;
    setReplyTo(null);
    setEditId(c.id);
    setDraft(c.text||"");
    setTimeout(()=>inputRef.current?.focus(),50);
  };

  const startReply = c => {
    if(disabled) return;
    setEditId(null);
    setReplyTo(c);
    setTimeout(()=>inputRef.current?.focus(),50);
  };

  React.useEffect(()=>{ if(open&&listRef.current) listRef.current.scrollTop=listRef.current.scrollHeight; },[open]);

  return (
    <>
      <span onClick={openModal} title={count?`${count} commentaire${count>1?"s":""}` : "Ajouter un commentaire"}
        style={{cursor:"pointer",fontSize:15,opacity:count?1:.35,userSelect:"none",
          position:"relative",display:"inline-block"}}>
        💬
        {count>0&&<span style={{position:"absolute",top:-5,right:-7,
          background:C.accent,color:"#fff",borderRadius:10,fontSize:8,fontWeight:700,
          padding:"1px 4px",minWidth:14,textAlign:"center",lineHeight:"14px"}}>
          {count>9?"9+":count}
        </span>}
      </span>

      {open&&(
        <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,
          display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
          onClick={e=>{if(e.target===e.currentTarget)close();}}>
          <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:10,
            width:"100%",maxWidth:560,maxHeight:"82vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>

            {/* Header */}
            <div style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`,
              display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <span style={{fontWeight:700,color:C.accent,fontSize:13}}>
                💬 Commentaires {count>0&&<span style={{color:C.muted,fontWeight:400}}>({count})</span>}
              </span>
              <span onClick={close} style={{cursor:"pointer",color:C.muted,fontSize:20,lineHeight:1}}>×</span>
            </div>

            {/* Thread */}
            <div ref={listRef} style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
              {list.length===0&&(
                <div style={{textAlign:"center",color:C.muted,padding:32,fontSize:12}}>
                  Aucun commentaire — soyez le premier !
                </div>
              )}
              {list.map(c=>{
                const parent = c.replyTo ? list.find(x=>x.id===c.replyTo) : null;
                const isOwn  = c.visa===user?.trigram;
                const canManage = isOwn || isAdminManager(user);
                return (
                  <div key={c.id} style={{
                    display:"flex",flexDirection:"column",gap:4,
                    alignItems: isOwn ? "flex-end" : "flex-start"}}>
                    {/* Reply context */}
                    {parent&&(
                      <div style={{background:"#0d111780",border:`1px solid ${C.border}`,borderRadius:4,
                        padding:"3px 10px",fontSize:10,color:C.muted,maxWidth:"80%",
                        borderLeft:`3px solid ${C.blue}`}}>
                        ↩ <strong style={{color:C.blue}}>{parent.visa}</strong> : {parent.text.slice(0,60)}{parent.text.length>60?"…":""}
                      </div>
                    )}
                    {/* Bubble */}
                    <div style={{
                      background: isOwn ? C.accent+"22" : C.raised,
                      border:`1px solid ${isOwn ? C.accent+"66" : C.border}`,
                      borderRadius: isOwn ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      padding:"8px 12px",maxWidth:"80%",
                      borderLeft: isOwn ? undefined : `3px solid ${C.blue}`}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                        <span style={{fontFamily:"monospace",fontWeight:700,fontSize:11,
                          color: isOwn ? C.accent : C.blue}}>{c.visa}</span>
                        <span style={{fontFamily:"monospace",fontSize:9,color:C.muted}}>{c.dt}</span>
                        {c.editedDT&&<span style={{fontFamily:"monospace",fontSize:8,color:C.muted}}>modifié {c.editedDT}</span>}
                      </div>
                      <div style={{fontSize:12,color:C.text,lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                        {c.text}
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{display:"flex",gap:10,paddingLeft:6,paddingRight:6}}>
                      {!disabled&&<span onClick={()=>startReply(c)}
                        style={{cursor:"pointer",color:C.muted,fontSize:10,display:"flex",alignItems:"center",gap:3}}>
                        ↩ Répondre
                      </span>}
                      {canManage&&!disabled&&<span onClick={()=>startEdit(c)}
                        style={{cursor:"pointer",color:C.blue,fontSize:10}}>
                        ✎ Éditer
                      </span>}
                      {canManage&&!disabled&&<span onClick={()=>del(c.id)}
                        style={{cursor:"pointer",color:"#da3633",fontSize:10}}>
                        🗑️ Supprimer
                      </span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compose */}
            <div style={{borderTop:`1px solid ${C.border}`,padding:"10px 14px",flexShrink:0,background:C.input}}>
              {replyTo&&(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  background:C.raised,borderLeft:`3px solid ${C.blue}`,borderRadius:4,
                  padding:"4px 10px",marginBottom:8,fontSize:10,color:C.muted}}>
                  <span>↩ Réponse à <strong style={{color:C.blue}}>{replyTo.visa}</strong> : {replyTo.text.slice(0,50)}{replyTo.text.length>50?"…":""}</span>
                  <span onClick={()=>setReplyTo(null)} style={{cursor:"pointer",color:C.muted,fontSize:14,marginLeft:8}}>×</span>
                </div>
              )}
              {editId&&(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  background:C.blue+"18",borderLeft:`3px solid ${C.blue}`,borderRadius:4,
                  padding:"4px 10px",marginBottom:8,fontSize:10,color:C.muted}}>
                  <span>✎ Modification de votre remarque</span>
                  <span onClick={()=>{setEditId(null);setDraft("");}} style={{cursor:"pointer",color:C.muted,fontSize:14,marginLeft:8}}>×</span>
                </div>
              )}
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <textarea ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
                    readOnly={disabled}
                    onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey))post();}}
                    placeholder={disabled?"Lecture seule":editId?"Modifier votre remarque…":replyTo?"Votre réponse…":"Nouvelle remarque… (Ctrl+↵ pour envoyer)"}
                    rows={2}
                    style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,
                      borderRadius:6,color:C.text,fontSize:12,fontFamily:"system-ui",
                      padding:"8px 10px",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.5}}/>
                </div>
                <Btn onClick={post} color={C.accent} small disabled={disabled||!draft.trim()}>
                  {editId?"✓ Modifier":replyTo?"↩ Répondre":"💬 Envoyer"}
                </Btn>
              </div>
              <div style={{color:C.muted,fontSize:9,marginTop:4}}>Ctrl+↵ pour envoyer rapidement</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── 1. Adjust / Rework — auto-visa Opér. ──────────────────────────────────
const ACTIONS = ["S","D","P","M","R"];
const ACTION_LABELS = {S:"Soudé",D:"Désoudé",P:"Pointé",M:"Matière",R:"Rework"};
const REWORK_EDIT_FIELDS = [
  {key:"createdDT",label:"Date de l'opération"},
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"repere",label:"Repère TOPO"},
  {key:"action1",label:"Action"},
  {key:"isAdjust",label:"Adjust"},
  {key:"qty",label:"QTÉ"},
  {key:"codeERP",label:"Code article"},
  {key:"valeur",label:"Valeur"},
  {key:"lot",label:"LOT"},
  {key:"dc",label:"DC"},
  {key:"sn",label:"SN"},
  {key:"fiche",label:"Fiche suiveuse"},
  {key:"etape",label:"OP"},
];
const parseActivityDate = raw => {
  if(raw instanceof Date&&!Number.isNaN(raw.getTime())) return raw;
  const value=String(raw||"").trim();
  if(!value) return null;
  const local=value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if(local){
    const d=new Date(Number(local[3]),Number(local[2])-1,Number(local[1]),Number(local[4]||0),Number(local[5]||0));
    if(d.getFullYear()===Number(local[3])&&d.getMonth()===Number(local[2])-1&&d.getDate()===Number(local[1])) return d;
    return null;
  }
  const parsed=new Date(value);
  return Number.isNaN(parsed.getTime())?null:parsed;
};
const currentYYWW = referenceDate => {
  const d = parseActivityDate(referenceDate)||new Date();
  const utc = new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(),0,1));
  const week = Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
  return (utc.getUTCFullYear()%100)*100 + week;
};
const dcCheck = (raw,referenceDate) => {
  const value = String(raw||"").trim().toUpperCase().replace(/\s+/g,"");
  if(!value) return null;
  if(value==="N/A"||value==="NA") return {ok:true,na:true,label:"N/A"};
  const m = value.match(/^(\d{2})(\d{2})(?:R(\d+))?$/);
  if(!m) return {ok:false,label:"DC invalide"};
  const base = Number(m[1])*100 + Number(m[2]);
  const week = Number(m[2]);
  const relief = Number(m[3]||0);
  if(week<1||week>53) return {ok:false,label:"Semaine DC invalide"};
  const max = base - (relief?300:0) + 700 + relief*400;
  const limit = currentYYWW(referenceDate);
  return {
    ok:max>=limit,
    max,
    limit,
    label:max>=limit ? `OK jusqu'à ${String(max).padStart(4,"0")}` : `Hors date depuis ${String(max).padStart(4,"0")}`
  };
};

const missingReworkTrace = (row,includePointed=false) => (includePointed?["S","P","M"]:["S","M"]).includes(row?.action1)
  ? [{key:"lot",label:"LOT"},{key:"dc",label:"DC"}].filter(f=>!String(row[f.key]||"").trim()).map(f=>f.label) : [];
const buildMaterialRequest = ({header,rows,user}) => {
  const units=snRowsFromHeader(header);
  const requested=rows.filter(r=>!r.deleted&&["S","M"].includes(r.action1)&&(!units.length||units.some(u=>rowMatchesSn(r,u,units))));
  const concerned=units.filter(u=>requested.some(r=>rowMatchesSn(r,u,units)));
  const materialLine=(r,i)=>{
    const fields=[`${i+1}. Repère TOPO : ${r.repere||"Non renseigné"}`,
      `Qté : ${r.qty||"Non renseignée"}`,
      `Code article : ${compactArticleCode(r.codeERP)||"Non renseigné"}`,
      `Valeur : ${r.valeur||"Non renseignée"}`];
    const available=value=>{
      const text=String(value||"").trim();
      return text&&!["N/A","NA","-"].includes(text.toUpperCase())?text:"";
    };
    const lot=available(r.lot),dc=available(r.dc);
    if(lot) fields.push(`Lot préférentiel : ${lot}`);
    if(dc&&!lot) fields.push("Lot selon disponibilité");
    if(dc&&!lot) fields.push(`DC min : ${dc}`);
    if(!lot&&!dc) fields.push("LOT / DC : Selon disponibilité");
    return fields.join(" | ");
  };
  const groups=concerned.length?concerned.map(u=>({label:snTitle(u),rows:requested.filter(r=>rowMatchesSn(r,u,units))}))
    : [{label:header.sn||header.lot||"Non renseigné",rows:requested}];
  const lines=groups.flatMap(group=>[`Demande pour SN / LOT : ${group.label}`,...group.rows.map(materialLine),""]);
  return {subject:`Demande matière - OF ${header.of||"Non renseigné"}`,
    body:["Bonjour,","","Merci de préparer les matières suivantes :","",
      `OF : ${header.of||"Non renseigné"}`,
      `Article OF : ${compactArticleCode(header.codeArticle)||"Non renseigné"} - ${header.description||""}`,
      `SN / LOT concernés : ${concerned.map(snTitle).join(", ")||header.sn||header.lot||"Non renseigné"}`,
      `OTP : ${header.otp||header.projet||"Non renseigné"}`,"",...lines,"",
      "Merci,",[user.prenom,user.nom].filter(Boolean).join(" ")||user.trigram,user.trigram].join("\n")};
};
const materialCcRequired = user => !isAdminManager(user);
const selectedManagerEmails = (managers,copyTo) => [...new Set(managers
  .filter(manager=>copyTo.includes(manager.trigram)&&manager.email)
  .map(manager=>manager.email))];
const useUserAccounts = (enabled=true) => {
  const [accounts,setAccounts]=useState([]);
  const [error,setError]=useState("");
  useEffect(()=>{
    if(!enabled){setAccounts([]);setError("");return;}
    let active=true;
    (async()=>{
      const index=await getUserIndex();
      const loaded=await Promise.all(index.map(async trigram=>{
        const result=await window.storage.get(`user:${trigram}`,true);
        return result?JSON.parse(result.value):null;
      }));
      if(active) setAccounts(loaded.filter(Boolean).sort((a,b)=>a.trigram.localeCompare(b.trigram)));
    })().catch(()=>{if(active)setError("Impossible de charger les utilisateurs");});
    return ()=>{active=false;};
  },[enabled]);
  return {accounts,error};
};
const useCcManagers = (enabled=true) => {
  const {accounts,error}=useUserAccounts(enabled);
  return {managers:accounts.filter(account=>normalizeRole(account)==="Manager"),error};
};
const ManagerCcPicker = ({managers,copyTo,onChange,required=false,error="",legend="CC manager",mode="cc"}) => {
  const usable=managers.filter(manager=>manager.email);
  return <fieldset style={{border:`1px solid ${required&&!selectedManagerEmails(managers,copyTo).length?C.yellow:C.border}`,borderRadius:4,margin:"0 0 10px",padding:8}}>
    <legend style={{fontSize:12}}>{legend}{required?" (obligatoire)":" (facultatif)"}</legend>
    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
      {managers.map(manager=>{
        const name=[manager.prenom,manager.nom].filter(Boolean).join(" ")||manager.trigram;
        const selected=copyTo.includes(manager.trigram);
        return <label key={manager.trigram} title={`${name}${manager.email?` - ${manager.email}`:" - E-mail manquant"}`}
          style={{position:"relative",display:"inline-flex",alignItems:"center",cursor:manager.email?"pointer":"not-allowed"}}>
          <input type="checkbox" aria-label={mode==="to"?`Ajouter ${manager.trigram} aux destinataires`:`Mettre ${manager.trigram} en copie`} disabled={!manager.email} checked={selected}
            onChange={event=>onChange(ids=>event.target.checked?[...ids,manager.trigram]:ids.filter(id=>id!==manager.trigram))}
            style={{position:"absolute",inset:0,width:"100%",height:"100%",margin:0,opacity:0,cursor:manager.email?"pointer":"not-allowed"}}/>
          <span style={{fontFamily:"monospace",fontWeight:800,fontSize:12,padding:"4px 8px",borderRadius:4,
            border:`1px solid ${selected?C.blue:C.border}`,background:selected?C.blue+"20":C.input,
            color:manager.email?(selected?C.blue:C.text):C.muted,opacity:manager.email?1:.55,pointerEvents:"none"}}>{manager.trigram}</span>
        </label>;
      })}
      {!managers.length&&!error&&<span style={{fontSize:11,color:C.muted}}>Aucun utilisateur correspondant</span>}
    </div>
    {required&&!usable.length&&<div role="alert" style={{fontSize:11,color:C.red,marginTop:6}}>Aucun utilisateur correspondant avec une adresse e-mail n’est disponible.</div>}
    {required&&usable.length>0&&!selectedManagerEmails(managers,copyTo).length&&<div style={{fontSize:11,color:C.yellow,marginTop:6}}>Sélectionnez au moins un trigramme {mode==="to"?"destinataire":"en copie"}.</div>}
    {error&&<div role="alert" style={{fontSize:11,color:C.red,marginTop:6}}>{error}</div>}
  </fieldset>;
};
const MaterialRequestModal = ({header,rows,user,onClose}) => {
  const [draft,setDraft]=useState(()=>buildMaterialRequest({header,rows,user}));
  const [recipient,setRecipient]=useState("logistique.ch@safran-timing.safrangroup.com");
  const [copyTo,setCopyTo]=useState([]);
  const {managers,error:ccError}=useCcManagers();
  const ccRequired=materialCcRequired(user);
  const ccEmails=selectedManagerEmails(managers,copyTo);
  const [message,setMessage]=useState("");
  const copy=async()=>{
    const text=`Objet : ${draft.subject}\n\n${draft.body}`;
    try{
      if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else throw new Error("Clipboard unavailable");
      setMessage("Brouillon copié");
    }catch{
      const area=document.createElement("textarea");
      area.value=text;area.style.position="fixed";area.style.opacity="0";
      document.body.appendChild(area);area.select();
      try{setMessage(document.execCommand("copy")?"Brouillon copié":"Copie impossible");}
      finally{document.body.removeChild(area);}
    }
  };
  return <div style={{position:"fixed",inset:0,zIndex:330,background:"#000000aa",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div role="dialog" aria-modal="true" aria-labelledby="material-request-title" style={{width:850,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",background:C.surface,color:C.text,border:`1px solid ${C.blue}`,borderRadius:6,padding:18}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <h2 id="material-request-title" style={{margin:0,fontSize:16}}>Demande matière - Logistique</h2>
        <button type="button" aria-label="Fermer" title="Fermer" onClick={onClose} style={{border:0,background:"transparent",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button>
      </div>
      <label style={{display:"block",marginBottom:10,fontSize:12}}>Destinataire<input aria-label="Destinataire" value={recipient} onChange={e=>setRecipient(e.target.value)} style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/></label>
      <ManagerCcPicker managers={managers} copyTo={copyTo} onChange={setCopyTo} required={ccRequired} error={ccError}/>
      <label style={{display:"block",marginBottom:10,fontSize:12}}>Objet<input aria-label="Objet" value={draft.subject} onChange={e=>setDraft(d=>({...d,subject:e.target.value}))} style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/></label>
      <label style={{display:"block",fontSize:12}}>Message<textarea aria-label="Message" value={draft.body} onChange={e=>setDraft(d=>({...d,body:e.target.value}))} style={{display:"block",width:"100%",boxSizing:"border-box",marginTop:4,height:320,maxHeight:"55vh",resize:"vertical",padding:10,fontFamily:"monospace",fontSize:13,lineHeight:1.5,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/></label>
      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <span role="status" style={{fontSize:12,color:message.startsWith("Statut non modifié")?C.red:C.green}}>{message}</span>
        <Btn onClick={onClose} color={C.border} small>Fermer</Btn>
        <Btn onClick={copy} color={C.border} small>Copier le brouillon</Btn>
        <Btn disabled={!draft.subject.trim()||!draft.body.trim()||(ccRequired&&!ccEmails.length)} onClick={()=>{
          window.location.href=`mailto:${encodeURIComponent(recipient.trim())}?cc=${encodeURIComponent(ccEmails.join(","))}&subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        }} color={C.blue} small>Ouvrir la messagerie</Btn>
      </div>
    </div>
  </div>;
};
const latestSharedFicheOp = (data,header) => {
  const active=header?._entrySnIds?.[0]||workSnFilter(header);
  const timestamp=row=>{
    if(Number(row.ficheOpUpdatedAt)>0) return Number(row.ficheOpUpdatedAt);
    const match=String(row.createdDT||"").match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
    return match?new Date(+match[3],+match[2]-1,+match[1],+match[4],+match[5],+(match[6]||0)).getTime():0;
  };
  const candidates=[
    ...(data?.rework?.rows||[]).map(row=>({...row,op:row.etape})),
    ...(data?.consommables?.ops||[]).filter(row=>!row.items?.length||row.items.some(item=>!item.deleted))
  ].filter(row=>!row.deleted&&String(row.fiche||"").trim()&&String(row.op||"").trim()&&rowMatchesSnFilter(row,active,header));
  const latest=candidates.map((row,index)=>({row,index,time:timestamp(row)})).sort((a,b)=>b.time-a.time||b.index-a.index)[0]?.row;
  return {fiche:latest?.fiche||"",op:latest?.op||""};
};
const copyReworkToUnit = (row,user,unit,includeChecks=false,copyMode="new",copyOrigin=null) => {
  const sameOperation=copyMode==="same";
  const effectiveChecks=sameOperation||includeChecks;
  if(!canWriteData(user)) throw new Error("Accès en écriture requis");
  if(includeChecks&&!sameOperation&&(!canControlRework(user)||!canTraceability(user))) throw new Error("Droits CTRL et TRA requis");
  if(includeChecks&&!sameOperation&&row.visaCtrl===user.trigram&&!isAdminManager(user)) throw new Error("Autocontrôle interdit");
  const fields=["repere","qty","action1","codeERP","valeur","lot","dc","sn","fiche","etape","isAdjust"];
  const copied=duplicateRow({},user,{
    ...Object.fromEntries(fields.map(key=>[key,row[key]??(key==="isAdjust"?false:"")])),
    snScope:"custom",snIds:[unit.id],unitId:unit.id,snExcludeIds:[],comments:[],
    validated:true,visaOper:user.trigram,dateOper:now(),sortieVisa:"",remarques:"",copyOrigin,
    visaCtrl:effectiveChecks?row.visaCtrl||"":"",dateCtrl:effectiveChecks?row.dateCtrl||"":"",
    tracaOk:effectiveChecks?!!row.tracaOk:false,visaTraca:effectiveChecks?row.visaTraca||"":"",dateTraca:effectiveChecks?row.dateTraca||"":""
  });
  if(sameOperation) Object.assign(copied,{
    createdVisa:row.createdVisa||user.trigram,
    createdDT:row.createdDT||nowDT(),
    visaOper:row.visaOper||row.createdVisa||user.trigram,
    dateOper:row.dateOper||row.createdDT||now()
  });
  return copied;
};
const normalizeCopySearch = value => String(value??"")
  .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .toLowerCase().replace(/\s+/g," ").trim();
const copyTableLineToUnit = (tab,row,user,unit,includeChecks=false,copyMode="new",reuseSample=false,copyOrigin=null) => {
  const sameOperation=copyMode==="same";
  const effectiveChecks=sameOperation||includeChecks;
  if(tab==="rework") return copyReworkToUnit(row,user,unit,includeChecks,copyMode,copyOrigin);
  if(!canWriteData(user)) throw new Error("Accès en écriture requis");
  if(includeChecks&&!sameOperation&&(!canControlRework(user)||!canTraceability(user))) throw new Error("Droits CTRL et TRA requis");
  const fields={
    consommables:["fiche","op"],
    testequip:["isFour","nInv","type","designation","dateExpiration"],
    faits:["type","numero","lien"],
    etuvage:["fourN","duree","temp"],
    openwork:["description"],
    demating:["nConect"]
  }[tab];
  if(!fields) throw new Error("Tableau non pris en charge");
  const scope={snScope:"custom",snIds:[unit.id],unitId:unit.id,snExcludeIds:[],comments:[]};
  const copied=duplicateRow({},user,{...Object.fromEntries(fields.map(key=>[key,row[key]??""])),...scope,validated:true,copyOrigin});
  if(tab==="consommables") copied.items=(row.items||[]).map(item=>duplicateRow({},user,{
    ...Object.fromEntries(["consoId","lot","dp"].map(key=>[key,item[key]||""])),echantillon:sameOperation||reuseSample?(item.echantillon||""):"",comments:[],copyOrigin,
    validated:true,tracaOk:effectiveChecks?!!item.tracaOk:false,visaTraca:effectiveChecks?item.visaTraca||"":"",dateTraca:effectiveChecks?item.dateTraca||"":""
  }));
  if(sameOperation){
    Object.assign(copied,{createdVisa:row.createdVisa||user.trigram,createdDT:row.createdDT||nowDT()});
    if(tab==="consommables") copied.items=copied.items.map((item,index)=>({...item,
      createdVisa:row.items?.[index]?.createdVisa||row.createdVisa||user.trigram,
      createdDT:row.items?.[index]?.createdDT||row.createdDT||nowDT()}));
  }
  if(tab==="testequip") Object.assign(copied,{visa:sameOperation?(row.visa||row.createdVisa||user.trigram):user.trigram,checkDate:sameOperation?(row.checkDate||now()):now()});
  if(tab==="faits") Object.assign(copied,{visa:sameOperation?(row.visa||row.createdVisa||user.trigram):user.trigram,date:sameOperation?(row.date||now()):now(),closedVisa:sameOperation?(row.closedVisa||""):"",closedDate:sameOperation?(row.closedDate||""):""});
  if(tab==="etuvage") Object.assign(copied,{entreeVisa:sameOperation?(row.entreeVisa||""):"",entreeDT:sameOperation?(row.entreeDT||""):"",sortieVisa:sameOperation?(row.sortieVisa||""):"",sortieDT:sameOperation?(row.sortieDT||""):"",comments:sameOperation?(row.comments||[]).map(comment=>({...comment,id:uid()})):[]});
  if(tab==="openwork") Object.assign(copied,{openVisa:sameOperation?(row.openVisa||row.createdVisa||user.trigram):user.trigram,openDate:sameOperation?(row.openDate||now()):now(),closedVisa:sameOperation?(row.closedVisa||""):"",closedDate:sameOperation?(row.closedDate||""):""});
  if(tab==="demating") Object.assign(copied,{validated:true,events:sameOperation?(row.events||[]).map(event=>({...event,id:uid()})):[],connError:""});
  return copied;
};
const copySourceKey = (tab,row) => row?._copyKey||(tab==="consommables"&&row?.items?.[0]?.id
  ?`consommables:${row.id}:${row.items[0].id}`
  :`${tab}:${row?.id||""}`);
const copySourceLabel = (tab,row) => ({
  rework:[row.repere,row.action1,row.codeERP,row.valeur],
  consommables:[row.fiche,row.op,row.items?.[0]?.consoId,row.items?.[0]?.lot],
  testequip:[row.nInv,row.type,row.designation],
  faits:[row.type,row.numero],
  etuvage:[row.fourN,row.duree&&`${row.duree} h`,row.temp&&`${row.temp} °C`],
  openwork:[row.nOW,row.description],
  demating:[row.nConect]
}[tab]||[row.repere,row.numero,row.description]).filter(Boolean).join(" · ")||"Ligne";
const copySourcesForTab = (tab,data,header,filter="all") => {
  if(!data) return [];
  if(tab==="consommables") return (data.consommables?.ops||[]).flatMap(op=>
    op.deleted?[]:(op.items||[]).filter(item=>!item.deleted).map(item=>({...op,items:[item],_copyKey:`consommables:${op.id}:${item.id}`}))
  ).filter(row=>rowMatchesSnFilter(row,filter,header));
  const collection=tab==="demating"?data.demating?.connectors:data[tab]?.rows;
  return (collection||[]).filter(row=>!row.deleted&&rowMatchesSnFilter(row,filter,header)).map(row=>({...row,_copyKey:`${tab}:${row.id}`}));
};
const CopyReworkModal = ({row,sourceRows=[],ofList,user,onCopy,onClose,busy,sourceOfId,sourceHeader,defaultUnitIds,tab="rework"}) => {
  const [targets,setTargets]=useState([]);
  const [selected,setSelected]=useState([]);
  const [selectedSources,setSelectedSources]=useState(()=>[copySourceKey(tab,row)]);
  const [search,setSearch]=useState("");
  const [includeChecks,setIncludeChecks]=useState(false);
  const [copyMode,setCopyMode]=useState(()=>tab==="etuvage"?"same":"new");
  const [reuseSample,setReuseSample]=useState(false);
  const [loading,setLoading]=useState(true);
  const [running,setRunning]=useState(false);
  const [message,setMessage]=useState("");
  const [completed,setCompleted]=useState([]);
  const checksAllowed=canControlRework(user)&&canTraceability(user);
  const availableSources=sourceRows.length?sourceRows:[row];
  const chosenSources=availableSources.filter(source=>selectedSources.includes(copySourceKey(tab,source)));
  const sourceUnits=snRowsFromHeader(sourceHeader);
  const sourceUnitLabels=sourceUnits.filter(unit=>chosenSources.some(source=>rowMatchesSn(source,unit,sourceUnits))).map(snTitle);
  const sourceUnitText=sourceUnitLabels.join(" + ")||sourceHeader?.sn||sourceHeader?.lot||"Non renseigné";
  useEffect(()=>{
    let active=true;
    (async()=>{
      const results=await Promise.all(ofList.filter(entry=>!entry.deleted).map(async entry=>{
        try{
          const record=await window.storage.get(`of:${entry.id}`,true);
          if(!record) return {destinations:[],failed:0};
          const data=withUnitMetadata(JSON.parse(record.value));
          if(data.header?.deleted) return {destinations:[],failed:0};
          const destinations=[];
          for(const unit of data.units.rows.filter(u=>!u.deleted&&hasUnitIdentity(u))){
            destinations.push({
              key:JSON.stringify([entry.id,unit.id]),ofId:entry.id,unitId:unit.id,
              of:data.header.of||entry.of,label:snTitle(unit),sn:unit.sn||"",lot:unit.lot||"",
              article:data.header.codeArticle||"",description:data.header.description||""
            });
          }
          return {destinations,failed:0};
        }catch{return {destinations:[],failed:1};}
      }));
      const destinations=results.flatMap(result=>result.destinations);
      const failed=results.reduce((sum,result)=>sum+result.failed,0);
      if(active){
        destinations.sort((a,b)=>
          Number(b.ofId===sourceOfId&&defaultUnitIds.includes(b.unitId))-Number(a.ofId===sourceOfId&&defaultUnitIds.includes(a.unitId))||
          Number(b.ofId===sourceOfId)-Number(a.ofId===sourceOfId)||
          String(a.of).localeCompare(String(b.of),undefined,{numeric:true})||a.label.localeCompare(b.label,undefined,{numeric:true})
        );
        setTargets(destinations);setSelected([]);setLoading(false);
        if(failed)setMessage(`${failed} OF non chargé(s). Fermez puis réessayez pour actualiser.`);
      }
    })();
    return ()=>{active=false;};
  },[]);
  const query=normalizeCopySearch(search);
  const tokens=query.split(" ").filter(Boolean);
  const matches=targets.filter(target=>{
    if(!query) return target.ofId===sourceOfId;
    const haystack=normalizeCopySearch(`${target.of} ${target.article} ${compactArticleCode(target.article)} ${target.description} ${target.label} ${target.sn} ${target.lot}`);
    return tokens.every(token=>haystack.includes(token));
  });
  const limit=query?80:12;
  const visible=matches.slice(0,limit);
  const copy=async()=>{
    setRunning(true);setMessage("");
    try{
      const result=await onCopy(chosenSources,targets.filter(t=>selected.includes(t.key)),includeChecks,copyMode,reuseSample);
      setCompleted(ids=>[...ids,...result.copied]);
      setSelected(ids=>ids.filter(id=>!result.copied.includes(id)));
      setMessage(`${result.copyCount||0} ligne(s) copiée(s). ${result.errors.join(" ; ")}`);
    }catch(error){setMessage(error.message||"Copie impossible");}
    finally{setRunning(false);}
  };
  return <div style={{position:"fixed",inset:0,zIndex:340,background:"#000000aa",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div role="dialog" aria-modal="true" aria-label="Copier vers OF / SN" style={{width:800,maxWidth:"100%",maxHeight:"90vh",overflow:"auto",padding:18,background:C.surface,color:C.text,border:`1px solid ${C.blue}`,borderRadius:6}}>
      <h2 style={{margin:"0 0 12px",fontSize:18}}>Copier vers OF / SN / LOT — {row.repere||"Ligne"}</h2>
      <div aria-label="Source de la copie" style={{display:"grid",gridTemplateColumns:"auto minmax(90px,.7fr) minmax(180px,1.6fr) minmax(130px,1fr)",gap:12,alignItems:"center",padding:"8px 10px",marginBottom:10,background:C.raised,borderLeft:`3px solid ${C.blue}`,fontSize:12}}>
        <strong style={{color:C.blue}}>COPIE DE</strong>
        <span><span style={{display:"block",color:C.muted,fontSize:10}}>OF</span><strong>{sourceHeader?.of||sourceOfId||"—"}</strong></span>
        <span style={{minWidth:0,overflowWrap:"anywhere"}}><span style={{display:"block",color:C.muted,fontSize:10}}>ARTICLE</span><strong>{sourceHeader?.codeArticle||"N/A"}</strong>{sourceHeader?.description&&<span style={{display:"block",color:C.muted,marginTop:1}}>{sourceHeader.description}</span>}</span>
        <span style={{minWidth:0,overflowWrap:"anywhere"}}><span style={{display:"block",color:C.muted,fontSize:10}}>SN / LOT</span><strong>{sourceUnitText}</strong></span>
      </div>
      <details style={{marginBottom:10,border:`1px solid ${C.border}`,background:C.surface}}>
        <summary style={{padding:"7px 10px",cursor:"pointer",fontSize:12,fontWeight:700,color:C.text}}>
          Lignes à copier : {chosenSources.length} sélectionnée(s) sur {availableSources.length}
        </summary>
        <div style={{maxHeight:170,overflow:"auto",borderTop:`1px solid ${C.border}`}}>
          {availableSources.map(source=>{
            const key=copySourceKey(tab,source),checked=selectedSources.includes(key);
            return <label key={key} style={{display:"grid",gridTemplateColumns:"24px minmax(0,1fr) auto",gap:8,alignItems:"center",padding:"6px 10px",borderBottom:`1px solid ${C.border}`,fontSize:12}}>
              <input type="checkbox" aria-label={`Copier la source ${copySourceLabel(tab,source)}`} checked={checked} disabled={running||(checked&&chosenSources.length===1)} onChange={e=>setSelectedSources(keys=>e.target.checked?[...new Set([...keys,key])]:keys.filter(value=>value!==key))}/>
              <span style={{overflowWrap:"anywhere"}}>{copySourceLabel(tab,source)}</span>
              <span style={{color:C.muted,fontSize:11}}>{snScopeLabel(source,sourceUnits)}</span>
            </label>;
          })}
        </div>
      </details>
      <input autoFocus aria-label="Rechercher les destinations" placeholder="Rechercher : OF, N° article, description, SN ou LOT" value={search} disabled={running} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:8,marginBottom:6,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
      <div style={{fontSize:12,color:C.muted,marginBottom:10}}>
        {loading?"Chargement des destinations…":query
          ?`${matches.length} destination(s) trouvée(s)${matches.length>limit?` — ${limit} affichées, précisez la recherche`:""}`
          :`SN / LOT de l'OF actuel affichés. Tapez pour rechercher dans les ${targets.length} destinations.`}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:10}}>
        <Btn small color={C.border} disabled={loading||running} onClick={()=>setSelected(ids=>[...new Set([...ids,...visible.filter(t=>!completed.includes(t.key)).map(t=>t.key)])])}>Tout sélectionner</Btn>
        <Btn small color={C.border} disabled={running} onClick={()=>setSelected([])}>Tout désélectionner</Btn>
      </div>
      <div style={{maxHeight:320,overflow:"auto",border:`1px solid ${C.border}`}}>
        {loading?<div style={{padding:10}}>Chargement…</div>:visible.length?visible.map(t=><label key={t.key} style={{display:"grid",gridTemplateColumns:"24px 110px minmax(130px,1fr) minmax(130px,1.4fr)",gap:8,padding:"7px 10px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
          <input type="checkbox" aria-label={`OF ${t.of} — ${t.label}`} checked={selected.includes(t.key)} disabled={running||completed.includes(t.key)} onChange={e=>setSelected(ids=>e.target.checked?[...ids,t.key]:ids.filter(id=>id!==t.key))}/>
          <span>{t.of}</span><span>{t.label}{completed.includes(t.key)?" — Copié":""}</span><span style={{minWidth:0,overflowWrap:"anywhere"}}>{t.article}<span style={{display:"block",color:C.muted,fontSize:12,marginTop:2}}>{t.description||"—"}</span></span>
        </label>):<div style={{padding:10}}>{query?"Aucune destination trouvée":"Aucun SN / LOT dans l'OF actuel"}</div>}
      </div>
      <fieldset style={{border:`1px solid ${C.border}`,padding:"9px 10px",margin:"12px 0 8px"}}>
        <legend style={{fontSize:11,color:C.muted,padding:"0 5px"}}>Type de copie</legend>
        <label style={{display:"flex",gap:7,alignItems:"flex-start",fontSize:12,marginBottom:8}}>
          <input type="radio" name="copy-mode" value="same" checked={copyMode==="same"} disabled={running} onChange={()=>setCopyMode("same")}/>
          <span><strong>Même opération sur plusieurs SN/OF</strong><span style={{display:"block",color:C.muted,marginTop:2}}>Conserve l’auteur, les dates, les visas, CTRL et TRA.</span></span>
        </label>
        <label style={{display:"flex",gap:7,alignItems:"flex-start",fontSize:12}}>
          <input type="radio" name="copy-mode" value="new" checked={copyMode==="new"} disabled={running||tab==="etuvage"} onChange={()=>setCopyMode("new")}/>
          <span><strong>Nouvelle opération à partir de cette ligne</strong><span style={{display:"block",color:C.muted,marginTop:2}}>La personne qui copie devient l’auteur ; les informations techniques sont reprises.</span>{tab==="etuvage"&&<span style={{display:"block",color:C.yellow,marginTop:2}}>Un étuvage réalisé est toujours recopié comme la même opération.</span>}</span>
        </label>
      </fieldset>
      {copyMode==="new"&&["rework","consommables"].includes(tab)&&<label style={{display:"flex",gap:6,alignItems:"center",margin:"8px 0",fontSize:12}}><input type="checkbox" checked={includeChecks} disabled={!checksAllowed||running} onChange={e=>setIncludeChecks(e.target.checked)}/>Inclure {tab==="rework"?"le contrôle et la traçabilité":"la traçabilité"}{!checksAllowed?" (Admin / Manager)":""}</label>}
      {copyMode==="new"&&includeChecks&&<div style={{color:C.yellow,fontSize:12,marginBottom:8}}>CTRL / TRA repris avec leurs visas et dates d’origine.</div>}
      {tab==="consommables"&&copyMode==="new"&&<label style={{display:"flex",gap:6,alignItems:"center",margin:"8px 0",fontSize:12}}><input type="checkbox" checked={reuseSample} disabled={running} onChange={e=>setReuseSample(e.target.checked)}/>Reprendre le N° d’échantillon source</label>}
      <div role="status" style={{fontSize:12,marginBottom:10}}>{message}</div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <Btn small onClick={onClose} color={C.border} disabled={running}>Fermer</Btn>
        <Btn small onClick={copy} color={C.blue} disabled={loading||running||busy||!selected.length||!chosenSources.length}>{running?"Copie…":`Copier ${chosenSources.length} ligne(s) vers ${selected.length} destination(s)`}</Btn>
      </div>
    </div>
  </div>;
};
const TabRework = ({data,onChange,user,perms={},header,forceShowDeleted=false,onCopyAcross,contextData}) => {
  const rows = data.rows||[];
  const [requestIds,setRequestIds]=useState([]);
  const tableRef=React.useRef(null);
  const [focusNewId,setFocusNewId]=useState(null);
  useEffect(()=>{
    if(!focusNewId) return;
    const row=Array.from(tableRef.current?.querySelectorAll('[data-rework-row]')||[]).find(el=>el.dataset.reworkRow===focusNewId);
    const field=row?.querySelector('[data-entry-field="repere"]');
    if(field){field.focus();setFocusNewId(null);}
  },[focusNewId,rows]);
  const navigateEntry=e=>{
    if(e.key!=="Tab") return;
    const fields=Array.from(e.currentTarget.querySelectorAll('[data-entry-field]:not([readonly]):not(:disabled)'));
    const index=fields.indexOf(e.target);
    const validate=e.currentTarget.querySelector('button[title="Valider"]');
    const next=index>=0?(e.shiftKey?fields[index-1]:fields[index+1]||validate):e.shiftKey&&e.target===validate?fields[fields.length-1]:null;
    if(next){e.preventDefault();next.focus();}
  };
  const [showMaterialDraft,setShowMaterialDraft]=useState(false);
  useEffect(()=>{setRequestIds([]);setShowMaterialDraft(false);},[header?.of,header?._defaultSnIds?.join("|")]);
  const canEdit = row => canEditLine(user,row);
  const canCommentRow = () => perms.canComment!==false;
  const snRows = snRowsFromHeader(header);
  const warnSn = row => snScopeLabel(row,snRows);
  const selectedUnitIds=header?._defaultSnIds?.length?header._defaultSnIds:null;
  const printRetentionSheets=async()=>{
    try{
      const logoImage=await loadPdfLogoImage("assets/logo.png");
      const blob=buildComponentRetentionSheetsPdf({ofData:contextData,selectedUnitIds,logoImage,exportedAt:nowDT(),exportedBy:user?.trigram||""});
      downloadBrowserBlob(blob,fileSafeName(`Feuille composants dessoudés - OF ${header?.of||"OF"} - ${selectedUnitIds?.length===1?snTitle(snRows.find(unit=>unit.id===selectedUnitIds[0])):"Tous les SN"}`)+".pdf");
    }catch(error){window.alert(`Impression impossible : ${error?.message||error}`);}
  };
  const printComponentLabel=row=>{
    try{
      const blob=buildComponentLabelPdf({ofData:contextData,row,selectedUnitIds});
      downloadBrowserBlob(blob,fileSafeName(`Étiquette composant dessoudé - OF ${header?.of||"OF"} - ${row.repere||"Repère"}`)+".pdf");
    }catch(error){window.alert(`Étiquette impossible : ${error?.message||error}`);}
  };
  const labelPrintButton=row=>row.action1==="D"&&row.validated&&!row.deleted&&(
    <button type="button" className="no-print" onClick={()=>printComponentLabel(row)} title="Imprimer l’étiquette composant 50 × 75 mm"
      style={{height:22,minWidth:31,padding:"0 4px",border:0,borderRadius:4,background:C.accent,color:"#fff",fontSize:9,fontWeight:900,cursor:"pointer",lineHeight:1}}>ETQ</button>
  );
  const rowsInWorkScope = rows.filter(r=>rowMatchesSnFilter(r,workSnFilter(header),header));
  const requestRows=rowsInWorkScope.filter(r=>!r.deleted&&["S","M"].includes(r.action1)&&requestIds.includes(r.id));
  useEffect(()=>{setRequestIds(ids=>{const next=ids.filter(id=>rows.some(r=>r.id===id&&!r.deleted&&["S","M"].includes(r.action1)));return next.length===ids.length?ids:next;});},[rows]);
  const repereKey = r => (r?.repere||"").trim().toUpperCase();
  const priorAdjust = (row,key) => rows.some(previous=>previous.id!==row.id&&!previous.deleted&&previous.isAdjust&&repereKey(previous)===key&&snRows.some(unit=>rowMatchesSn(previous,unit,snRows)&&rowMatchesSn(row,unit,snRows)));
  const isAdjustRow = r => !!r?.isAdjust;
  const desoudes = computeOpenDesoudes(rowsInWorkScope);
  const desoudageChecks = computeReworkWarnings(rows, snRows, workSnFilter(header));
  const missingControls = computeMissingReworkControls(rowsInWorkScope);
  const add = () => {
    if(!perms.canWrite) return;
    const last = latestSharedFicheOp(contextData||{rework:data},header);
    const id=uid();
    setFilters({snTarget:workSnFilter(header),repere:"",action1:"",codeERP:"",valeur:"",lot:"",dc:"",sn:"",fiche:"",etape:"",adjust:"all"});
    setFocusNewId(id);
    onChange({rows:[...rows,{
      id,createdVisa:user.trigram,createdDT:nowDT(),
      ...defaultSnScope(header),
      sortieVisa:"",repere:"",qty:"",action1:"",
      codeERP:"",valeur:"",lot:"",dc:"",sn:"",
      fiche:last.fiche, etape:last.op,ficheOpUpdatedAt:Date.now(),
      isAdjust:false,
      visaOper:"",dateOper:"",
      visaCtrl:"",dateCtrl:"",
      remarques:"",editHistory:[],
      tracaOk:false,visaTraca:"",dateTraca:""
    }]});
  };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const [hideAchevees,setHideAchevees] = useState(true);
  const [filters,setFilters] = useState({snTarget:workSnFilter(header), repere:"", action1:"", codeERP:"", valeur:"", lot:"", dc:"", sn:"", fiche:"", etape:"", adjust:"all"});
  useEffect(()=>setFilters(s=>({...s,snTarget:workSnFilter(header)})),[header?._defaultSnIds?.join("|"),header?._snRows?.length]);
  const upd=(id,f,v)=>{
    const r=rows.find(x=>x.id===id);
    if(f==="comments" ? !canCommentRow() : !canEdit(r)) return;
    onChange({rows:scopedRowsPatch(rows,id,header,{[f]:v,...(["fiche","etape"].includes(f)?{ficheOpUpdatedAt:Date.now()}:{})})});
  };
  const updAction=(id,nextAction)=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)||r.action1===nextAction) return;
    if(r.visaCtrl&&!canActionReceiveCtrl(nextAction)){
      const actionLabel=ACTION_LABELS[nextAction]||nextAction;
      if(!window.confirm(`L'action ${actionLabel} ne permet pas de contrôle. Retirer le CTRL existant avant de changer l'action ?`)) return;
      onChange({rows:scopedRowsPatch(rows,id,header,{
        action1:nextAction,
        visaCtrl:"",
        dateCtrl:"",
        ctrlCancellationHistory:[...(r.ctrlCancellationHistory||[]),{
          visaCtrl:r.visaCtrl,
          dateCtrl:r.dateCtrl,
          cancelledVisa:user.trigram,
          cancelledDT:nowDT(),
          reason:`Action modifiée de ${r.action1||"N/A"} vers ${nextAction}`,
        }],
      })});
      return;
    }
    upd(id,"action1",nextAction);
  };
  const patchRow=(id,fields)=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const updRepere=(id,v)=>{
    const row=rows.find(x=>x.id===id);
    if(!canEdit(row)) return;
    onChange({rows:scopedRowsPatch(rows,id,header,r=>{
    const nextKey=String(v||"").trim().toUpperCase();
    return {
      repere:String(v||"").toUpperCase(),
      qty:nextKey&&r.qty===""&&r.action1!=="M"?"1":r.qty,
      isAdjust:priorAdjust(r,nextKey)||!!r.isAdjust
    };
  })});
  };
  const updAdjust=(id,checked)=>{
    const row=rows.find(r=>r.id===id);
    if(!canEdit(row)) return;
    onChange({rows:scopedRowsPatch(rows,id,header,{isAdjust:checked})});
  };
  const dup=id=>{ const r=rows.find(x=>x.id===id); if(!r||!perms.canWrite) return; if(onCopyAcross&&!r.deleted){onCopyAcross(r);return;} onChange({rows:[...rows,duplicateRow(r,user,{
    visaOper:"",dateOper:"",visaCtrl:"",dateCtrl:"",tracaOk:false,visaTraca:"",dateTraca:""
  })]}); };
  // Un brouillon neuf disparaît; une ligne déjà validée garde sa trace d'annulation.
  const del=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    const isFreshDraft=!r?.validated&&!r?.editBase&&!r?.visaOper&&!r?.dateOper&&!r?.visaCtrl&&!r?.dateCtrl&&!r?.tracaOk;
    if(isFreshDraft) onChange({rows:rows.filter(x=>x.id!==id)});
    else if(!r.validated) onChange({rows:scopedRowsDelete(rows,id,header,{deleted:true,deletedReason:"",deletedVisa:user.trigram,deletedDate:nowDT()})});
    else setDeleteTarget(id);
  };
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ const r=rows.find(x=>x.id===deleteTarget); if(canEdit(r)) onChange({rows:scopedRowsDelete(rows,deleteTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()})}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;
  const isAchevee = r => r.action1!=="P" && (!["S","R"].includes(r.action1)||!!r.visaCtrl) && !!r.tracaOk && missingReworkTrace(r,true).length===0;
  const acheveesCount = rows.filter(r=>!r.deleted&&isAchevee(r)).length;
  const visibleRows = sortByNewestOperation(rows).filter(r=>{
    if(r.deleted&&!showDeleted&&!forceShowDeleted) return false;
    if(!r.deleted&&hideAchevees&&!forceShowDeleted&&isAchevee(r)) return false;
    const txt = key => String(r[key]||"").toUpperCase();
    if(!rowMatchesSnFilter(r,filters.snTarget,header)) return false;
    if(filters.repere&& !txt("repere").includes(filters.repere.toUpperCase())) return false;
    if(!filterMatches(filters.action1,r.action1)) return false;
    if(filters.codeERP&& !txt("codeERP").includes(filters.codeERP.toUpperCase())) return false;
    if(filters.valeur&& !txt("valeur").includes(filters.valeur.toUpperCase())) return false;
    if(filters.lot&& !txt("lot").includes(filters.lot.toUpperCase())) return false;
    if(filters.dc&& !txt("dc").includes(filters.dc.toUpperCase())) return false;
    if(filters.sn&& !txt("sn").includes(filters.sn.toUpperCase())) return false;
    if(filters.fiche&& !txt("fiche").includes(filters.fiche.toUpperCase())) return false;
    if(filters.etape&& !txt("etape").includes(filters.etape.toUpperCase())) return false;
    if(filters.adjust==="yes"&&!isAdjustRow(r)) return false;
    if(filters.adjust==="no"&&isAdjustRow(r)) return false;
    return true;
  });
  const hasFilters = Object.entries(filters).some(([k,v])=>v!=="all"&&filterHasValue(v));
  const fset = (k,v) => setFilters(s=>({...s,[k]:v}));
  const stampTraca=id=>{ const r=rows.find(x=>x.id===id); if(r&&!r.deleted&&perms.canTraceability) onChange({rows:scopedRowsPatch(rows,id,header,{tracaOk:true,visaTraca:user.trigram,dateTraca:nowDT()})}); };
  const clearTraca=id=>{
    const r=rows.find(x=>x.id===id);
    if(!r||r.deleted||!r.tracaOk||!perms.canTraceability) return;
    if(!window.confirm("Annuler la validation de traçabilité de cette ligne ?")) return;
    onChange({rows:scopedRowsPatch(rows,id,header,{tracaOk:false,visaTraca:"",dateTraca:"",tracaCancellationHistory:[...(r.tracaCancellationHistory||[]),{visaTraca:r.visaTraca,dateTraca:r.dateTraca,cancelledVisa:user.trigram,cancelledDT:nowDT()}]})});
  };
  const setTracaDate=(id,v)=>{ const r=rows.find(x=>x.id===id); if(r&&!r.deleted&&perms.canTraceability) onChange({rows:scopedRowsPatch(rows,id,header,{dateTraca:v})}); };
  const stampOper=id=>onChange({rows:scopedRowsPatch(rows,id,header,{visaOper:user.trigram,dateOper:now(),validated:true,validError:""})});
  const clearOper=id=>onChange({rows:scopedRowsPatch(rows,id,header,{visaOper:"",dateOper:""})});
  const ctrlOwner = r => r?.visaOper || r?.createdVisa || r?.visa || "";
  const canCtrlRow = r => !!r && !r.deleted && canActionReceiveCtrl(r.action1) && perms.canControlRework && (isAdminManager(user) || ctrlOwner(r)!==user?.trigram);
  const stampCtrl=id=>{ const r=rows.find(x=>x.id===id); if(canCtrlRow(r)) onChange({rows:scopedRowsPatch(rows,id,header,{visaCtrl:user.trigram,dateCtrl:nowDT()})}); };
  const clearCtrl=id=>{
    const r=rows.find(x=>x.id===id);
    if(!r||r.deleted||!r.visaCtrl||!perms.canControlRework) return;
    if(!window.confirm(`Dévalider le contrôle de ${r.repere||"cette ligne"} (${r.visaCtrl} - ${r.dateCtrl||""}) ?`)) return;
    onChange({rows:scopedRowsPatch(rows,id,header,{
      visaCtrl:"",dateCtrl:"",ctrlCancellationHistory:[...(r.ctrlCancellationHistory||[]),{
        visaCtrl:r.visaCtrl,dateCtrl:r.dateCtrl,cancelledVisa:user.trigram,cancelledDT:nowDT(),
      }],
    })});
  };
  const setCtrlDate=(id,v)=>{ const r=rows.find(x=>x.id===id); if(canCtrlRow(r)) onChange({rows:scopedRowsPatch(rows,id,header,{dateCtrl:v})}); };

  const REQUIRED = [
    {key:"repere", label:"Repère TOPO"},
    {key:"action1",label:"Action"},
    {key:"qty",    label:"QTÉ"},
    {key:"fiche",  label:"Fiche suiveuse"},
    {key:"etape",  label:"OP"},
  ];
  const validateRow=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    const refuse=message=>{
      upd(id,"validError",message);
      window.alert(`Ligne non validée :\n\n${message}`);
    };
    const required = [
      ...REQUIRED,
      ...(["S","D","P"].includes(r?.action1)?[{key:"valeur",label:"Valeur"}]:[]),
      ...(["S","P","M"].includes(r?.action1)?[{key:"codeERP",label:"Code article"}]:[])
    ];
    const miss=checkRequired(r,required);
    if(miss.length) { refuse("Champs requis manquants : "+miss.join(", ")); }
    else {
      const checks=computeReworkWarnings(rows.filter(x=>x.validated||x.id===id),snRows);
      const sequence=checks.sequence.filter(w=>w.row.id===id||w.previous.id===id);
      if(sequence.length){
        refuse(sequence.map(w=>`${w.snLabel} - ${w.repere} : ${w.previous.action1} → ${w.row.action1} interdit`).join(" ; "));
        return;
      }
      onChange({rows:scopedRowsPatch(rows,id,header,x=>withEditHistory(x,user,REWORK_EDIT_FIELDS))});
    }
  };
  const unlockRow=id=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:rows.map(r=>r.id===id?{...r,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(r,REWORK_EDIT_FIELDS)}:r)}); };
  return (
    <div style={{maxWidth:1520}}>
      {desoudes.length>0&&(
        <div style={{background:C.yellow+"18",border:`1px solid ${C.yellow}`,borderRadius:6,
          padding:"9px 14px",marginBottom:12,display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{color:C.yellow,fontSize:16,lineHeight:1}}>⚠</span>
          <div>
            <div style={{color:C.yellow,fontWeight:800,fontSize:12,marginBottom:4}}>
              {desoudes.length} composant{desoudes.length>1?"s":""} désoudé{desoudes.length>1?"s":""} à surveiller
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {desoudes.map(r=>(
                <Badge key={r.id} label={`${warnSn(r)} - ${r.repere||"repère ?"} - valeur D ${r.valeur||"?"} - Fiche suiveuse ${r.fiche||"?"} - OP ${r.etape||"?"}`} color={C.yellow}/>
              ))}
            </div>
          </div>
        </div>
      )}
      {(desoudageChecks.sequence.length>0||desoudageChecks.mismatch.length>0||desoudageChecks.first.length>0||desoudageChecks.pointed.length>0||missingControls.length>0)&&(
        <div style={{background:C.red+"18",border:`1px solid ${C.red}`,borderRadius:6,
          padding:"9px 14px",marginBottom:12,display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{color:C.red,fontSize:16,lineHeight:1}}>⚠</span>
          <div>
            <div style={{color:C.red,fontWeight:800,fontSize:12,marginBottom:4}}>
              Contrôle soudage / dessoudage / pointage
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {desoudageChecks.sequence.map(w=><Badge key={`seq-${w.unitId}-${w.row.id}`} label={`${w.snLabel} - ${w.repere} - ${w.previous.action1} → ${w.row.action1} interdit`} color={C.red}/>)}
              {desoudageChecks.mismatch.map(w=>(
                <Badge key={`${w.unitId||"all"}-${w.repere}-${w.previous.id}-${w.current.id}`} label={`${w.snLabel||warnSn(w.current)} - ${w.repere} - valeur ${w.previous.action1} ${w.previous.valeur||"?"} ≠ ${w.current.action1} ${w.current.valeur||"?"}`} color={C.red}/>
              ))}
              {desoudageChecks.first.map(w=>(
                <Badge key={`${w.unitId||"all"}-${w.repere}-${w.d.id}`} label={`${w.snLabel||warnSn(w.d)} - ${w.repere} - 1er désoudage`} color={C.yellow}/>
              ))}
              {desoudageChecks.pointed.map(w=>(
                <Badge key={`point-${w.unitId||"all"}-${w.repere}-${w.row.id}`} label={`${w.snLabel||warnSn(w.row)} - ${w.repere} - pointé non soudé (S requis)`} color={C.red}/>
              ))}
              {missingControls.map(r=>(
                <Badge key={`ctrl-${r.id}`} label={`${warnSn(r)} - ${r.repere||"repère ?"} - ${ACTION_LABELS[r.action1]||r.action1} sans CTRL`} color={C.red}/>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{color:C.muted,fontSize:11,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          {perms.canWrite&&<Btn onClick={add} small>+ Ligne</Btn>}
          {perms.canWrite&&<Btn onClick={()=>setShowMaterialDraft(true)} color={C.blue} disabled={!requestRows.length} small>Demande matière ({requestRows.length})</Btn>}
          <Btn onClick={printRetentionSheets} color={C.blue} small>Feuille composants</Btn>
          {ACTIONS.map(a=><span key={a}><Badge label={a} color={C.accent}/> {ACTION_LABELS[a]}&nbsp;&nbsp;</span>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          {acheveesCount>0&&<Btn onClick={()=>setHideAchevees(s=>!s)} color={hideAchevees?"#23863666":C.border} small>
            {hideAchevees?`▼ Opérations achevées (${acheveesCount})`:"▲ Masquer achevées"}
          </Btn>}
          {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
          </Btn>}
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table ref={tableRef} style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",fontSize:12}}>
          <thead>
            <tr>
              <TH w={118}>Date / Heure</TH><TH w={48} color={C.accent}>Visa</TH>
              <TH w={82}>N° SN</TH>
              <TH w={66}>Repère TOPO</TH>
              <TH w={58}>Adj</TH>
              <TH w={38}>QTÉ</TH>
              <TH w={62}>Action</TH>
              <TH w={92}>Code article</TH>
              <TH w={92}>Valeur</TH>
              <TH w={118}>LOT</TH>
              <TH w={68}>DC</TH>
              <TH w={104}>SN</TH>
              <TH w={124}>Fiche suiveuse</TH>
              <TH w={56}>OP</TH>
              <TH w={48}>Ctrl</TH>
              <TH w={46} color={C.green}>TRA</TH>
              {perms.canWrite&&!forceShowDeleted&&<TH w={38}>DEM</TH>}
              <TH w={28}>💬</TH>
              <TH w={145}></TH>
            </tr>
            <tr style={{background:C.blue+"0c",borderBottom:`2px solid ${C.border}`}}>
              <th colSpan={2} style={{color:C.blue,fontSize:11,textAlign:"left",padding:"6px 5px"}}>⌕ Filtres</th>
              <th style={{padding:"3px 4px"}}><SnFilter value={filters.snTarget} onChange={v=>fset("snTarget",v)} header={header}/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.repere} onChange={v=>fset("repere",v)} small title="Filtrer repère topo"/></th>
              <th style={{padding:"3px 4px"}}>
                <select value={filters.adjust} onChange={e=>fset("adjust",e.target.value)}
                  style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                    color:C.text,padding:"4px 3px",fontSize:10,fontFamily:"monospace",outline:"none"}}>
                  <option value="all">Tous</option>
                  <option value="yes">Oui</option>
                  <option value="no">Non</option>
                </select>
              </th>
              <th></th>
              <th style={{padding:"3px 4px"}}>
                <MultiFilter value={filters.action1} onChange={v=>fset("action1",v)} title="Filtrer les actions" options={ACTIONS.map(a=>({value:a,label:ACTION_LABELS[a]||a}))}/>
              </th>
              <th style={{padding:"3px 4px"}}><Input value={filters.codeERP} onChange={v=>fset("codeERP",v)} small title="Filtrer code article"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.valeur} onChange={v=>fset("valeur",v)} small title="Filtrer valeur"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.lot} onChange={v=>fset("lot",v)} small title="Filtrer lot"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.dc} onChange={v=>fset("dc",v)} small title="Filtrer DC"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.sn} onChange={v=>fset("sn",v)} small title="Filtrer SN"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.fiche} onChange={v=>fset("fiche",v)} small title="Filtrer fiche suiveuse"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.etape} onChange={v=>fset("etape",v)} small title="Filtrer OP"/></th>
              <th></th><th></th>{perms.canWrite&&!forceShowDeleted&&<th/>}<th></th>
              <th style={{padding:"3px 4px",textAlign:"center"}}>
                {hasFilters&&<button onClick={()=>setFilters({snTarget:workSnFilter(header), repere:"", action1:"", codeERP:"", valeur:"", lot:"", dc:"", sn:"", fiche:"", etape:"", adjust:"all"})}
                  title="Effacer les filtres"
                  style={{background:C.border,border:"none",borderRadius:4,color:C.text,width:26,height:22,cursor:"pointer",fontWeight:800}}>×</button>}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.flatMap((r,i)=>{
              const dc = ["S","P","M"].includes(r.action1) ? dcCheck(r.dc,r.createdDT) : null;
              const traceMissing=missingReworkTrace(r,true);
              const missingStyle={background:C.red+"12",borderColor:C.red+"66",color:C.red};
              const coherenceIssues=desoudageChecks.mismatch.filter(w=>w.previous.id===r.id||w.current.id===r.id);
              const coherenceStyle=coherenceIssues.length?{background:C.red+"18",borderColor:C.red,color:C.red,fontWeight:800}:{};
              const editable = canEdit(r);
              const locked = !!r.validated || !editable;
              return [
              <tr key={r.id} data-rework-row={r.id} onKeyDown={navigateEntry} style={{background:r.deleted?"#da363318":r.tracaOk?"#23863610":i%2===0?"transparent":C.stripe,
                textDecoration:r.deleted?"line-through":undefined,
                opacity:r.deleted?.6:1,
                pointerEvents:r.deleted?"none":undefined,
                borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
                <TD><OperationDateCell value={r.createdDT} editing={!!r.editBase&&editable&&!r.deleted} onChange={value=>upd(r.id,"createdDT",value)}/></TD>
                <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span><CopyOriginMark origin={r.copyOrigin}/></TD>
                <TD style={{pointerEvents:r.deleted?"none":"all"}}><SnScopePicker row={r} header={header} onChange={fields=>patchRow(r.id,fields)} disabled={locked}/></TD>
                <TD><Input entryField="repere" value={r.repere} onChange={v=>updRepere(r.id,v)} small readOnly={locked} style={{...(locked?LOCKED_INPUT_STYLE:{}),textTransform:"uppercase"}}/></TD>
                <TD center style={{pointerEvents:r.deleted?"none":"all"}}>
                  <input data-entry-field="isAdjust" type="checkbox" checked={isAdjustRow(r)} disabled={locked}
                    onChange={e=>updAdjust(r.id,e.target.checked)}
                    title="Composant adjust : appliqué à toutes les lignes du même repère"
                      style={{width:16,height:16,accentColor:C.accent,cursor:locked?"default":"pointer"}}/>
                </TD>
                <TD>
                  {(r.action1==="M"||!r.repere)
                    ? <Input entryField="qty" value={r.qty} onChange={v=>upd(r.id,"qty",v)} small readOnly={locked} style={{...(locked?LOCKED_INPUT_STYLE:{})}}/>
                    : <span style={{fontFamily:"monospace",fontSize:11,color:C.muted,padding:"0 4px"}}>—</span>}
                </TD>
                <TD><Select entryField="action1" value={r.action1} onChange={v=>updAction(r.id,v)} options={ACTIONS} disabled={locked} style={{width:"100%",padding:"4px 3px"}}/></TD>
                <TD><CopyCell value={r.codeERP} title="Copier code article">
                  <Input entryField="codeERP" value={r.codeERP} onChange={v=>upd(r.id,"codeERP",v)} small readOnly={locked} style={{width:"100%",fontFamily:"monospace",...(locked?LOCKED_INPUT_STYLE:{})}} title="Code article ou texte libre" placeholder="Code article"/>
                </CopyCell></TD>
                <TD><Input entryField="valeur" value={r.valeur} onChange={v=>upd(r.id,"valeur",v)} small readOnly={locked}
                  title={coherenceIssues.length?coherenceIssues.map(w=>`Cohérence valeur : ${w.previous.action1} ${w.previous.valeur||"?"} ≠ ${w.current.action1} ${w.current.valeur||"?"}`).join("\n"):"Valeur du composant"}
                  style={{width:"100%",...(locked?LOCKED_INPUT_STYLE:{}),...coherenceStyle}}/></TD>
                <TD><CopyCell value={r.lot} title="Copier LOT">
                  <Input entryField="lot" value={r.lot} onChange={v=>upd(r.id,"lot",v.toUpperCase().slice(0,12))} onBlur={e=>upd(r.id,"lot",normLot(e.target.value))} small readOnly={locked} title="Lot : numérique sur 10 chiffres, ou texte libre / N/A" style={{width:"100%",fontFamily:"monospace",...(locked?LOCKED_INPUT_STYLE:{}),...(traceMissing.includes("LOT")?missingStyle:{})}}/>
                </CopyCell></TD>
                <TD>
                  <div style={{display:"flex",alignItems:"center",gap:2,minWidth:0}}>
                    <div style={{flex:1,minWidth:0}}><Input entryField="dc" value={r.dc} onChange={v=>upd(r.id,"dc",v.toUpperCase().slice(0,6))}
                      small readOnly={locked} title={dc&&!dc.ok?`Anomalie : DC ${r.dc} — ${dc.label} à la date de la ligne`:dc?.label||"DC (ex: 2552R1) ou N/A si non disponible"}
                      style={{width:"100%",fontFamily:"monospace",...(locked?LOCKED_INPUT_STYLE:{}),
                        borderColor:dc&&!dc.ok?C.red:dc?.ok?C.green:undefined,
                        color:dc&&!dc.ok?C.red:dc?.ok?C.green:undefined,
                        ...(traceMissing.includes("DC")?missingStyle:{})}}/></div>
                  </div>
                </TD>
                <TD><CopyCell value={r.sn} title="Copier SN">
                  <Input entryField="sn" value={r.sn} onChange={v=>upd(r.id,"sn",v)} small readOnly={locked} style={{width:"100%",...(locked?LOCKED_INPUT_STYLE:{})}}/>
                </CopyCell></TD>
                <TD><Input entryField="fiche" value={r.fiche} onChange={v=>upd(r.id,"fiche",v.toUpperCase())} small required readOnly={locked}
                  title="Fiche suiveuse / FT / NC / DM (ex: R4B-Q001, FT-042)"
                  placeholder="R4B-Q001"
                  style={{fontFamily:"monospace",width:"100%",textTransform:"uppercase",...(locked?LOCKED_INPUT_STYLE:{})}}/></TD>
                <TD><Input entryField="etape" value={r.etape||""} onChange={v=>upd(r.id,"etape",v)} small required readOnly={locked}
                  title="OP (ex: 10, 20, 30...)"
                  placeholder="Et."
                  style={{textAlign:"center",width:"100%",...(locked?LOCKED_INPUT_STYLE:{})}}/></TD>

                <TD center>
                  {!r.visaCtrl&&!canActionReceiveCtrl(r.action1)
                    ? <span title="Contrôle non applicable à cette action" style={{fontFamily:"monospace",fontSize:10,color:C.muted}}>N/A</span>
                    : <StampStatus done={!!r.visaCtrl} visa={r.visaCtrl} date={r.dateCtrl}
                        color={C.blue} label="Ctrl" onStamp={()=>stampCtrl(r.id)}
                        onClear={()=>clearCtrl(r.id)} canClear={!r.deleted&&perms.canControlRework} clearTitle="Dévalider le contrôle"
                        onDateChange={r.editBase&&canCtrlRow(r)?v=>setCtrlDate(r.id,v):null}
                        disabled={!canCtrlRow(r)}/>}
                </TD>
                <TD center>
                  <StampStatus done={!!r.tracaOk} visa={r.visaTraca} date={r.dateTraca}
                    color={C.green} label="Traça" onStamp={()=>stampTraca(r.id)}
                    onClear={()=>clearTraca(r.id)} canClear={!r.deleted&&perms.canTraceability} clearTitle="Dévalider la traçabilité"
                    onDateChange={r.editBase&&!r.deleted&&perms.canTraceability?v=>setTracaDate(r.id,v):null}
                    disabled={r.deleted||!perms.canTraceability}/>
                </TD>
                {perms.canWrite&&!forceShowDeleted&&<TD center><input type="checkbox" aria-label={`Demander la matière ${r.repere||"ligne"} ${r.codeERP||""}`} title={["S","M"].includes(r.action1)?"Sélectionner pour la demande matière":"Demande matière réservée aux actions S et M"} disabled={!!r.deleted||!["S","M"].includes(r.action1)} checked={!r.deleted&&["S","M"].includes(r.action1)&&requestIds.includes(r.id)} onChange={()=>{if(!r.deleted&&["S","M"].includes(r.action1)) setRequestIds(ids=>ids.includes(r.id)?ids.filter(id=>id!==r.id):[...ids,r.id]);}}/></TD>}
                <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user} disabled={!canCommentRow()}/></TD>
                <TD center style={{pointerEvents:"all"}}>
                  {!r.deleted&&!r.validated&&editable&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                      <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&r.validated&&editable&&(
                    <ActionGroup>
                      {labelPrintButton(r)}
                      <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                      <IconBtn onClick={()=>del(r.id)} color={C.red} title="Annuler">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&!editable&&perms.canWrite&&(
                    <ActionGroup>
                      {labelPrintButton(r)}
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                    </ActionGroup>
                  )}
                </TD>
              </tr>,
              <HistoryTrail key={r.id+"_hist"} row={r} open={forceShowDeleted}/>,
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        {r.deletedReason&&<>&nbsp;—&nbsp;Motif : {r.deletedReason}</>}
                      </span>
                      <PurgeLineButton user={user} data={data} onChange={onChange} id={r.id}/>
                      <span onClick={e=>{e.stopPropagation();setRestoreTarget(r.id);}}
                        style={{color:"#d29922",fontSize:11,cursor:"pointer",fontWeight:700,
                          pointerEvents:"all",marginLeft:16,flexShrink:0}}>
                        ↩ Réactiver
                      </span>
                    </div>
                  </td>
                </tr>
              )
              ];
            })}
          </tbody>
        </table>
        {rows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Aucune ligne</div>}
      </div>
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>✦ Visa Opér. pré-rempli · ✓ Valider pour verrouiller · × Annuler sur ligne validée = barre et conserve la traçabilité</div>
      {showMaterialDraft&&perms.canWrite&&requestRows.length>0&&<MaterialRequestModal header={header} rows={requestRows} user={user} onClose={()=>setShowMaterialDraft(false)}/>}
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

const DEFAULT_CONSOMMABLES = [
  {id:"fx1",label:"Flux ELSOLD AP-10",   sap:"", code:"FX-ELSOLD-TYPAP10-A1317", cat:"Flux"},
  {id:"fx2",label:"Flux ELSOLD 045",     code:"FX-ELSOLD-TYPE045-A0653", cat:"Flux"},
  {id:"fx3",label:"Flux basse temp ST",  code:"FX-ST-FSW11-A0023",       cat:"Flux"},
  {id:"sd1",label:"Sn63Pb37 AP10 pâte",  code:"SD-SN63PB37-AP10-A1125",  cat:"Soudure"},
  {id:"sd2",label:"Sn63Pb37",            code:"SD-SN63PB37-FX-03-A0021", cat:"Soudure"},
  {id:"sd3",label:"Sn63Pb37 barre",      code:"SD-SN63PB37P-FX-8X10-A0594",cat:"Soudure"},
  {id:"sd4",label:"Sn96Ag4 0.35mm",      code:"SD-SN96AG4-03-A0022",     cat:"Soudure"},
  {id:"sd5",label:"Sn96Ag4 1mm",         code:"SD-SN96AG4-1-A0022",      cat:"Soudure"},
  {id:"k1", label:"Kapton 3M",           code:"ADH-KAPTON-3M92-A0066",   cat:"Kapton"},
  {id:"k2", label:"2216B/A Gray 3M",     code:"COL-2216B/A-GRAY-A0367",  cat:"Colle"},
  {id:"k3", label:"CAB-O-SIL M5",        code:"COL-CAB-O-SIL-M5-A1226",  cat:"Colle"},
  {id:"k4", label:"HYSOL FP4323",        code:"COL-HYSOL-FP4323-A1364",  cat:"Colle"},
  {id:"k5", label:"Epoxy H20s",          code:"COL-EPOTEK-H20S-A0020",   cat:"Colle"},
  {id:"k6", label:"CV-1152",             code:"SIL-CV-1152-A1124",       cat:"Silicone"},
  {id:"k7", label:"RTV Silicone",        code:"SIL-CV-2646-A0763",       cat:"Silicone"},
  {id:"k8", label:"DC6-1104",            code:"SIL-DC6-1104-A0087",      cat:"Silicone"},
  {id:"k9", label:"R-2930 Thermal",      code:"SIL-R-2930-A0291",        cat:"Silicone"},
  {id:"p1", label:"Primer EC2646",       code:"PRM-EC2646-A0101",        cat:"Primer"},
  {id:"p2", label:"Primer 1200",         code:"PRM-1200-A0102",          cat:"Primer"},
];
const CAT_COLORS = {Flux:C.blue, Soudure:C.accent, Kapton:C.purple, Colle:C.green, Coating:C.blue, Silicone:C.yellow, Primer:"#e879a0", Autre:C.muted};
const catalogFingerprint = items => items===null?null:JSON.stringify(items.map(item=>Object.keys(item).sort().map(key=>[key,item[key]])));

// ─── Gestionnaire de la liste consommables (stockage partagé global) ────────
const ConsommableListManager = ({items,onClose,onSave}) => {
  const [list,setList] = useState(items.map(i=>({...i})));
  const [newItem,setNewItem] = useState({label:"",sap:"",code:"",cat:"Flux",polymerizationHours:""});
  const CATS = ["Flux","Soudure","Kapton","Colle","Coating","Silicone","Primer","Autre"];
  const hasPolymerization = item => supportsPolymerization(item);

  const add = () => {
    if(!newItem.label.trim()) return;
    setList(l=>[...l,{id:uid(),...newItem}]);
    setNewItem({label:"",sap:"",code:"",cat:newItem.cat,polymerizationHours:""});
  };
  const del = id => setList(l=>l.filter(i=>i.id!==id));
  const upd = (id,f,v) => setList(l=>l.map(i=>i.id===id?{...i,[f]:v}:i));
  const move = (id,dir) => {
    const idx=list.findIndex(i=>i.id===id);
    if(idx<0)return;
    const nl=[...list];
    const t=nl[idx+dir]; nl[idx+dir]=nl[idx]; nl[idx]=t;
    setList(nl);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:10,width:"100%",maxWidth:940,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>⚙ Gérer la liste des consommables</div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>onSave(list)} color={C.green} small>✓ Enregistrer</Btn>
            <Btn onClick={onClose} color={C.border} small>Annuler</Btn>
          </div>
        </div>

        {/* Formulaire ajout */}
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.input}}>
          <div style={{color:C.muted,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Ajouter un consommable</div>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto 100px auto",gap:8,alignItems:"end"}}>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>N° SAP</div>
              <Input value={newItem.sap||""} onChange={v=>setNewItem(n=>({...n,sap:fmtSAP(v)}))} placeholder="1600000046" small style={{width:118,fontFamily:"monospace"}}/>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>DÉSIGNATION</div>
              <Input value={newItem.label} onChange={v=>setNewItem(n=>({...n,label:v}))} placeholder="ex: Flux ELSOLD AP-10" small/>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>CATÉGORIE</div>
              <select value={newItem.cat} onChange={e=>setNewItem(n=>({...n,cat:e.target.value}))}
                style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"4px 8px",fontSize:11,fontFamily:"monospace",outline:"none"}}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>POLYMÉRISATION [H]</div>
              <Input value={newItem.polymerizationHours||""} onChange={v=>setNewItem(n=>({...n,polymerizationHours:v}))}
                type="number" small readOnly={!hasPolymerization(newItem)} title={hasPolymerization(newItem)?"Durée avant mise sous vide, en heures":"Non applicable aux flux et soudures"}
                style={{width:92,textAlign:"center",...(!hasPolymerization(newItem)?LOCKED_INPUT_STYLE:{})}}/>
            </div>
            <Btn onClick={add} color={C.accent} small>+ Ajouter</Btn>
          </div>
        </div>

        {/* Liste */}
        <div style={{overflow:"auto",flex:1}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr><TH w={30}>#</TH><TH w={120}>N° SAP</TH><TH>Désignation</TH><TH w={110}>Catégorie</TH><TH w={95}>Polym. [h]</TH><TH w={60}>Ordre</TH><TH w={30}></TH></tr>
            </thead>
            <tbody>
              {list.map((item,i)=>(
                <tr key={item.id} style={{background:i%2===0?"transparent":C.stripe}}>
                  <TD center><span style={{color:C.muted,fontSize:10}}>{i+1}</span></TD>
                  <TD><Input value={item.sap||""} onChange={v=>upd(item.id,"sap",fmtSAP(v))} small style={{fontFamily:"monospace",fontSize:11,width:118}} placeholder="1600000046"/></TD>
                  <TD><Input value={item.label} onChange={v=>upd(item.id,"label",v)} small/></TD>
                  <TD>
                    <select value={item.cat||"Autre"} onChange={e=>upd(item.id,"cat",e.target.value)}
                      style={{background:C.input,border:`1px solid ${CAT_COLORS[item.cat||"Autre"]}`,borderRadius:4,
                        color:CAT_COLORS[item.cat||"Autre"],padding:"3px 6px",fontSize:10,fontFamily:"monospace",outline:"none"}}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </TD>
                  <TD center>
                    {hasPolymerization(item)
                      ? <Input value={item.polymerizationHours||""} onChange={v=>upd(item.id,"polymerizationHours",v)} type="number" small
                          title="Durée avant mise sous vide, en heures" style={{width:78,textAlign:"center"}}/>
                      : <span style={{color:C.muted}}>—</span>}
                  </TD>
                  <TD center>
                    <div style={{display:"flex",gap:3,justifyContent:"center"}}>
                      <button onClick={()=>move(item.id,-1)} disabled={i===0}
                        style={{background:"none",border:"none",color:i===0?C.border:C.muted,cursor:i===0?"default":"pointer",fontSize:12,padding:"2px 4px"}}>▲</button>
                      <button onClick={()=>move(item.id,+1)} disabled={i===list.length-1}
                        style={{background:"none",border:"none",color:i===list.length-1?C.border:C.muted,cursor:i===list.length-1?"default":"pointer",fontSize:12,padding:"2px 4px"}}>▼</button>
                    </div>
                  </TD>
                  <TD center><span onClick={()=>del(item.id)} style={{cursor:"pointer",color:C.red,fontSize:14,fontWeight:700}}>×</span></TD>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Liste vide</div>}
        </div>
      </div>
    </div>
  );
};

// ─── Onglet Consommables (matrice dynamique) ────────────────────────────────
// DP date status
// ─── Helpers date JJ.MM.AA ─────────────────────────────────────────────────
const normDP = s => {
  if(!s) return s;
  s = s.trim();
  // Already formatted JJ.MM.AA
  if(/^\d{2}\.\d{2}\.\d{2}$/.test(s)) return s;
  // Digits only JJMMAA "270126" → "27.01.26"
  const d = s.replace(/\D/g,"");
  if(d.length===6) return d.slice(0,2)+"."+d.slice(2,4)+"."+d.slice(4,6);
  // JJ/MM/AA or JJ-MM-AA
  const m = s.match(/^(\d{2})[/\-](\d{2})[/\-](\d{2})$/);
  if(m) return m[1]+"."+m[2]+"."+m[3];
  return s;
};
const parseDMY = s => {
  if(!s)return null;
  const n=normDP(s);
  const m=n.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if(!m)return null;
  const [,dd,mm,yy]=m;
  const year=2000+Number(yy),month=Number(mm)-1,day=Number(dd);
  const date=new Date(year,month,day);
  return date.getFullYear()===year&&date.getMonth()===month&&date.getDate()===day?date:null;
};
const isValidDMY = s => !s || !!parseDMY(normDP(s));
const dateDayNumber = d => Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000;
const dpStatus = (s,referenceDate) => {
  const d=parseDMY(normDP(s)); if(!d)return null;
  const reference=parseActivityDate(referenceDate)||new Date();
  const diff=dateDayNumber(d)-dateDayNumber(reference);
  if(diff<0) return{color:C.red,   label:"PÉRIMÉ",  bg:"#da363340",days:diff};
  if(diff===0)return{color:C.green,label:"OK",       bg:"transparent",days:diff};
  if(diff<30)return{color:C.yellow,label:"BIENTÔT", bg:"#d2992230",days:diff};
  return      {color:C.green, label:"OK",           bg:"transparent",days:diff};
};
const NON_POLYMERIZING_CATEGORIES = new Set(["FLUX","SOUDURE"]);
const supportsPolymerization = consumable => {
  const category=String(consumable?.cat||"").trim().toUpperCase();
  return !!category&&!NON_POLYMERIZING_CATEGORIES.has(category);
};
const polymerizationStatus = (consumable,lineDate,referenceDate=new Date()) => {
  if(!supportsPolymerization(consumable)) return null;
  const hours=Number(String(consumable?.polymerizationHours??"").replace(",","."));
  const start=parseActivityDate(lineDate);
  const reference=parseActivityDate(referenceDate)||new Date();
  if(!start||!Number.isFinite(hours)||hours<=0) return null;
  const readyAt=new Date(start.getTime()+hours*3600000);
  return {hours,start,readyAt,done:reference>=readyAt};
};
const formatAvailabilityDT = value => value instanceof Date&&!Number.isNaN(value.getTime())
  ? `${value.toLocaleDateString("fr-FR")} à ${value.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`
  : "date inconnue";

// ─── Onglet Consommables — 1 ligne par consommable, liste déroulante ─────────
// Custom dropdown for consommables — colored by category
const ConsoDropdown = ({value, onChange, consommables, cats,display="label"}) => {
  const [open, setOpen]       = React.useState(false);
  const [query, setQuery]     = React.useState("");
  const ref    = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(()=>{
    const close = e => { if(ref.current && !ref.current.contains(e.target)){ setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", close);
    return ()=>document.removeEventListener("mousedown", close);
  },[]);

  // Focus search input when opening
  React.useEffect(()=>{ if(open && inputRef.current) inputRef.current.focus(); },[open]);

  const selected = consommables.find(c=>c.id===value);
  const selColor = selected ? (CAT_COLORS[selected.cat||"Autre"]||C.muted) : C.muted;

  const q = query.trim().toLowerCase();
  const itemCode = c => compactArticleCode(c?.sap || c?.code || "");
  // If searching: flat filtered list; else: grouped by cat
  const filtered = q
    ? consommables.filter(c=>
        (c.sap||"").replace(/\s/g,"").includes(q.replace(/\s/g,"")) ||
        (c.code||"").toLowerCase().includes(q) ||
        (c.label||"").toLowerCase().includes(q) ||
        (c.cat||"").toLowerCase().includes(q))
    : null;
  const firstMatch = (filtered||consommables)[0];
  const displayValue = open||query ? query : selected ? display==="code"?itemCode(selected):selected.label : "";

  const handleSelect = id => { onChange(id); setOpen(false); setQuery(""); };
  const handleKeyDown = e => {
    if(e.key==="Enter"&&firstMatch){
      e.preventDefault();
      handleSelect(firstMatch.id);
    }
    if(e.key==="Escape"){
      e.preventDefault();
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={ref} style={{position:"relative",width:"100%"}}>
      <input ref={inputRef} value={displayValue}
        aria-label={display==="code"?"Code SAP du consommable":"Désignation du consommable"}
        onFocus={()=>setOpen(true)}
        onClick={e=>{e.stopPropagation();setOpen(true);}}
        onChange={e=>{setQuery(e.target.value);setOpen(true);}}
        onKeyDown={handleKeyDown}
        placeholder="Taper SAP ou désignation..."
        title="Taper un N° SAP ou une désignation, Entrée sélectionne le premier résultat"
        style={{width:"100%",background:C.input,border:`1px solid ${!value?C.yellow:selColor}`,borderRadius:4,
          padding:"4px 8px",fontSize:11,fontFamily:"monospace",outline:"none",boxSizing:"border-box",
          color:selected&&!open&&!query?selColor:C.text}}/>

      {/* Dropdown — uses fixed positioning to escape table overflow clipping */}
      {open&&(
        <div style={{position:"fixed",zIndex:9999,background:C.surface,
          border:`1px solid ${C.border}`,borderRadius:4,boxShadow:"0 8px 32px #000c",
          width:280,maxHeight:320,display:"flex",flexDirection:"column",marginTop:2}}
          ref={el=>{
            if(el && ref.current){
              const rect=ref.current.getBoundingClientRect();
              const spaceBelow=window.innerHeight-rect.bottom;
              const h=Math.min(320,el.scrollHeight||320);
              el.style.left=rect.left+"px";
              el.style.width=Math.max(320,rect.width)+"px";
              if(spaceBelow>h+8){ el.style.top=(rect.bottom+2)+"px"; el.style.bottom=""; }
              else { el.style.bottom=(window.innerHeight-rect.top+2)+"px"; el.style.top=""; }
            }
          }}>

          {/* Clear option */}
          <div onClick={()=>handleSelect("")}
            style={{padding:"5px 10px",fontSize:11,color:C.muted,cursor:"pointer",
              borderBottom:`1px solid ${C.border}`,flexShrink:0}}
            onMouseEnter={e=>e.currentTarget.style.background=C.hover}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            — aucun —
          </div>

          {/* Results */}
          <div style={{overflowY:"auto",flex:1}}>
            {filtered
              ? filtered.length===0
                  ? <div style={{padding:"12px",textAlign:"center",color:C.muted,fontSize:11}}>Aucun résultat</div>
                  : filtered.map(c=>{
                      const catCol=CAT_COLORS[c.cat||"Autre"]||C.muted;
                      return (
                        <div key={c.id} onClick={()=>handleSelect(c.id)}
                          style={{padding:"5px 14px",fontSize:11,fontFamily:"monospace",cursor:"pointer",
                            color:catCol,borderLeft:`3px solid ${catCol}`,borderBottom:`1px solid ${C.border}22`}}
                          onMouseEnter={e=>e.currentTarget.style.background=catCol+"22"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <span style={{fontWeight:700}}>{itemCode(c)||"—"}</span>
                          <span style={{color:C.muted,marginLeft:6}}>— {c.label}</span>
                          <span style={{color:catCol,opacity:.6,fontSize:9,marginLeft:6}}>[{c.cat}]</span>
                        </div>
                      );
                    })
              : cats.map(cat=>{
                  const items=consommables.filter(c=>(c.cat||"Autre")===cat);
                  if(!items.length) return null;
                  const catCol=CAT_COLORS[cat]||C.muted;
                  return (
                    <div key={cat}>
                      <div style={{padding:"4px 10px",fontSize:9,fontWeight:700,letterSpacing:1,
                        color:catCol,background:C.input,textTransform:"uppercase",
                        borderBottom:`1px solid ${C.border}33`,position:"sticky",top:0}}>
                        {cat}
                      </div>
                      {items.map(c=>(
                        <div key={c.id} onClick={()=>handleSelect(c.id)}
                          style={{padding:"5px 14px",fontSize:11,fontFamily:"monospace",cursor:"pointer",
                            color:catCol,borderLeft:`3px solid ${catCol}`,borderBottom:`1px solid ${C.border}22`}}
                          onMouseEnter={e=>e.currentTarget.style.background=catCol+"22"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <span style={{fontWeight:700}}>{itemCode(c)||"—"}</span>
                          <span style={{color:C.muted,marginLeft:6}}>— {c.label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}
    </div>
  );
};

const CONSO_OP_EDIT_FIELDS = [
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"fiche",label:"Fiche suiveuse"},
  {key:"op",label:"OP"},
];

const CONSO_ITEM_EDIT_FIELDS = [
  {key:"createdDT",label:"Date de l'opération"},
  {key:"consoId",label:"Consommable"},
  {key:"echantillon",label:"N° échantillon"},
  {key:"lot",label:"LOT"},
  {key:"dp",label:"DP"},
  {key:"tracaOk",label:"Traça"},
  {key:"comments",label:"Commentaires"},
];

const TabConsommables = ({data,onChange,user,perms={},consommables,onEditList,header,forceShowDeleted=false,contextData,onCopyAcross}) => {
  // Stockage conserve opérations → consommables, mais l'interface affiche une ligne plate par consommable.
  const ops = data.ops||[];
  const canEditOp = op => canEditLine(user,op);
  const canEditItem = (op,it) => canEditLine(user,it)&&canEditLine(user,op);
  const [deleteOpTarget,  setDeleteOpTarget]  = useState(null);
  const [deleteItemTarget,setDeleteItemTarget] = useState(null); // {oid, iid}
  const [restoreOpTarget, setRestoreOpTarget] = useState(null);
  const [restoreItemTarget,setRestoreItemTarget] = useState(null); // {oid, iid}
  const [showDeleted, setShowDeleted] = useState(false);
  const [filters,setFilters] = useState({snTarget:workSnFilter(header), date:"", visa:"", fiche:"", op:"", sap:"", conso:"", echantillon:"", lot:"", dp:"", traca:"all", remarque:""});
  const [polymerizationNow,setPolymerizationNow] = useState(()=>new Date());
  useEffect(()=>{const timer=setInterval(()=>setPolymerizationNow(new Date()),60000);return ()=>clearInterval(timer);},[]);
  useEffect(()=>setFilters(s=>({...s,snTarget:workSnFilter(header)})),[header?._defaultSnIds?.join("|"),header?._snRows?.length]);

  const cats     = [...new Set(consommables.map(i=>i.cat||"Autre"))];
  const getConso = id => consommables.find(c=>c.id===id);

  const makeItem = () => ({id:uid(),createdDT:nowDT(),createdVisa:user.trigram,
    consoId:"",echantillon:"",lot:"",dp:"",remarque:"",tracaOk:false,visaTraca:"",dateTraca:"",
    comments:[],deleted:false,deletedReason:"",deletedVisa:"",deletedDate:""});
  const makeOp = (scope,last,item) => ({
    id:uid(), createdDT:nowDT(), createdVisa:user.trigram,
    ...scope,
    fiche:last?.fiche||"", op:last?.op||"",
    ficheOpUpdatedAt:Date.now(),
    validated:false, connError:"", deleted:false,
    deletedReason:"",deletedVisa:"",deletedDate:"",
    items:[item||makeItem()]
  });
  const lastContext = () => {
    const scope=defaultSnScope(header);
    const last = latestSharedFicheOp(contextData||{consommables:data},header);
    return {scope,last};
  };

  // ── Opérations ──────────────────────────────────────────────
  const addOp = () => {
    if(!perms.canWrite) return;
    const {scope,last}=lastContext();
    onChange({ops:[...ops,makeOp(scope,last)]});
  };
  const dupLine = (oid,iid) => {
    if(!perms.canWrite) return;
    const o=ops.find(x=>x.id===oid); if(!o) return;
    const it=(o.items||[]).find(x=>x.id===iid);
    if(onCopyAcross&&it&&!o.deleted&&!it.deleted){onCopyAcross({...o,items:[it]});return;}
    const clone=makeItem();
    const clonedItem=it?{...clone,
      consoId:it.consoId||"",echantillon:it.echantillon||"",lot:it.lot||"",dp:it.dp||"",remarque:it.remarque||"",
      comments:it.comments?[...it.comments]:[],
      tracaOk:false,visaTraca:"",dateTraca:""}:clone;
    const newOp=makeOp({snScope:o.snScope,snIds:[...(o.snIds||[])]},o,clonedItem);
    onChange({ops:[...ops,newOp]});
  };
  const updOp = (oid,f,v) => { const o=ops.find(x=>x.id===oid); if(canEditOp(o)) onChange({ops:scopedRowsPatch(ops,oid,header,{[f]:v,...(["fiche","op"].includes(f)?{ficheOpUpdatedAt:Date.now()}:{})})}); };
  const patchOp = (oid,fields) => { const o=ops.find(x=>x.id===oid); if(canEditOp(o)) onChange({ops:scopedRowsPatch(ops,oid,header,fields)}); };
  const validateOp = oid => {
    const o=ops.find(x=>x.id===oid);
    if(!canEditOp(o)) return;
    if(!o?.fiche?.trim()||!o?.op?.trim()){
      onChange({ops:ops.map(x=>x.id===oid?{...x,connError:"Fiche suiveuse et OP requis"}:x)});
      return;
    }
    onChange({ops:scopedRowsPatch(ops,oid,header,o=>withEditHistory({...o,connError:""},user,CONSO_OP_EDIT_FIELDS))});
  };
  const unlockOp = oid => { const o=ops.find(x=>x.id===oid); if(canEditOp(o)) onChange({ops:ops.map(o=>o.id===oid?{...o,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(o,CONSO_OP_EDIT_FIELDS)}:o)}); };
  const confirmDelOp = reason => {
    const o=ops.find(x=>x.id===deleteOpTarget);
    if(canEditOp(o)) onChange({ops:scopedRowsDelete(ops,deleteOpTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()})});
    setDeleteOpTarget(null);
  };
  const restoreOp = reason => {
    onChange({ops:ops.map(o=>o.id===restoreOpTarget?{...o,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:o)});
    setRestoreOpTarget(null);
  };
  const dupOp = oid => {
    const o=ops.find(x=>x.id===oid); if(!o) return;
    if(!perms.canWrite) return;
    const clone={...o,
      id:uid(), createdDT:nowDT(), createdVisa:user.trigram,
      validated:false, connError:"", deleted:false,
      deletedReason:"",deletedVisa:"",deletedDate:"",
      items:[]
    };
    onChange({ops:[...ops,clone]});
  };

  // ── Items (consommables) ─────────────────────────────────────
  const addItem = oid => {
    const o=ops.find(x=>x.id===oid); if(!o) return;
    if(!canEditOp(o)) return;
    onChange({ops:ops.map(x=>x.id!==oid?x:{...x,items:[...(x.items||[]),makeItem()]})});
  };
  const updItem = (oid,iid,f,v) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(f==="comments" ? !perms.canComment : !canEditItem(o,it)) return;
    onChange({ops:scopedRowsPatch(ops,oid,header,o=>({
    items:o.items.map(it=>it.id===iid?{...it,[f]:v}:it)
  }))});
  };
  const delItem = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    if(!canEditOp(o)) return;
    if(iid==="__empty_"+oid){
      onChange({ops:ops.filter(x=>x.id!==oid)});
      return;
    }
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!canEditItem(o,it)) return;
    if(!it) return;
    const isDraft=!it.validated&&!o?.validated&&!it.editBase&&!o?.editBase&&!it.tracaOk&&!it.deleted&&!o?.deleted;
    if(isDraft){
      const isOnlyDraft=(o.items||[]).length<=1;
      onChange({ops:isOnlyDraft
        ? ops.filter(x=>x.id!==oid)
        : ops.map(x=>x.id!==oid?x:{...x,items:(x.items||[]).filter(i=>i.id!==iid)})});
    }
    else if(!it.validated||!o.validated){
      onChange({ops:scopedRowsDelete(ops,oid,header,op=>({
        items:op.items.map(item=>item.id===iid?{...item,deleted:true,deletedReason:"",deletedVisa:user.trigram,deletedDate:nowDT()}:item)
      }))});
    } else setDeleteItemTarget({oid,iid});
  };
  const confirmDelItem = reason => {
    const {oid,iid}=deleteItemTarget;
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(canEditItem(o,it)) onChange({ops:scopedRowsDelete(ops,oid,header,o=>({
      items:o.items.map(it=>it.id===iid
        ?{...it,deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()}:it)
    }))});
    setDeleteItemTarget(null);
  };
  const restoreItem = reason => {
    const {oid,iid}=restoreItemTarget;
    onChange({ops:ops.map(o=>o.id!==oid?o:{
      ...o,items:o.items.map(it=>it.id===iid?{...it,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:it)
    })});
    setRestoreItemTarget(null);
  };
  const stampTraca = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!o||!it||o.deleted||it.deleted||!perms.canTraceability) return;
    onChange({ops:scopedRowsPatch(ops,oid,header,o=>({
    items:o.items.map(it=>it.id===iid?{...it,tracaOk:true,visaTraca:user.trigram,dateTraca:nowDT()}:it)
  }))});
  };
  const clearTraca = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!o||!it||o.deleted||it.deleted||!it.tracaOk||!perms.canTraceability) return;
    if(!window.confirm("Annuler la validation de traçabilité de ce consommable ?")) return;
    onChange({ops:scopedRowsPatch(ops,oid,header,o=>({
    items:o.items.map(it=>it.id===iid?{...it,tracaOk:false,visaTraca:"",dateTraca:"",tracaCancellationHistory:[...(it.tracaCancellationHistory||[]),{visaTraca:it.visaTraca,dateTraca:it.dateTraca,cancelledVisa:user.trigram,cancelledDT:nowDT()}]}:it)
  }))});
  };
  const setTracaDate = (oid,iid,v) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!o||!it||o.deleted||it.deleted||!perms.canTraceability) return;
    onChange({ops:scopedRowsPatch(ops,oid,header,o=>({
      items:o.items.map(it=>it.id===iid?{...it,dateTraca:v}:it)
    }))});
  };
  const validateItem = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!canEditItem(o,it)) return;
    if(!it) return;
    const miss=[];
    if(!it.consoId) miss.push("Consommable");
    if(!it.lot)     miss.push("LOT");
    if(!it.dp)      miss.push("DP");
    if(it.dp&&!isValidDMY(it.dp)) miss.push("DP invalide (JJ.MM.AA)");
    if(miss.length){
      onChange({ops:ops.map(x=>x.id!==oid?x:{...x,items:x.items.map(i=>i.id===iid?{...i,validError:"Requis : "+miss.join(", ")}:i)})});
      return;
    }
    onChange({ops:scopedRowsPatch(ops,oid,header,o=>({
      items:o.items.map(i=>i.id===iid?withEditHistory({...i,validError:""},user,CONSO_ITEM_EDIT_FIELDS):i)
    }))});
  };
  const unlockItem = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!canEditItem(o,it)) return;
    onChange({ops:ops.map(o=>o.id!==oid?o:{
    ...o,items:o.items.map(it=>it.id===iid?{...it,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(it,CONSO_ITEM_EDIT_FIELDS)}:it)
  })});
  };
  const validateLine = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!canEditItem(o,it)) return;
    if(!o||!it) return;
    const opMissing=[];
    if(!o.fiche?.trim()) opMissing.push("Fiche suiveuse");
    if(!o.op?.trim()) opMissing.push("OP");
    const itemMissing=[];
    if(!it.consoId) itemMissing.push("Consommable");
    if(!it.lot) itemMissing.push("LOT");
    if(!it.dp) itemMissing.push("DP");
    if(it.dp&&!isValidDMY(it.dp)) itemMissing.push("DP invalide (JJ.MM.AA)");
    if(opMissing.length||itemMissing.length){
      onChange({ops:ops.map(x=>x.id!==oid?x:{
        ...x,
        connError:opMissing.length?"Requis : "+opMissing.join(", "):"",
        items:(x.items||[]).map(i=>i.id===iid?{...i,validError:itemMissing.length?"Requis : "+itemMissing.join(", "):""}:i)
      })});
      return;
    }
    onChange({ops:scopedRowsPatch(ops,oid,header,x=>withEditHistory({
      ...x,connError:"",
      items:(x.items||[]).map(i=>i.id===iid?withEditHistory({...i,validError:""},user,CONSO_ITEM_EDIT_FIELDS):i)
    },user,CONSO_OP_EDIT_FIELDS))});
  };
  const unlockLine = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!canEditItem(o,it)) return;
    onChange({ops:ops.map(o=>o.id!==oid?o:{
    ...o,
    validated:false,
    _scopeEditConfirmed:false,
    editBase:snapshotFields(o,CONSO_OP_EDIT_FIELDS),
    items:(o.items||[]).map(it=>it.id===iid?{...it,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(it,CONSO_ITEM_EDIT_FIELDS)}:it)
  })});
  };

  const totalDelOps = ops.filter(o=>o.deleted).length;
  const flatRows = ops.flatMap(o=>{
    const realItems=(o.items||[]);
    return (realItems.length?realItems:[{id:"__empty_"+o.id,empty:true,createdDT:o.createdDT,createdVisa:o.createdVisa,consoId:"",echantillon:"",lot:"",dp:"",remarque:""}])
      .map(it=>({o,it,oid:o.id,iid:it.id}));
  });
  const visibleRows=sortByNewestOperation(flatRows.filter(({o,it})=>{
    if(o.deleted&&!showDeleted&&!forceShowDeleted) return false;
    if(it.deleted&&!showDeleted&&!forceShowDeleted) return false;
    if(!rowMatchesSnFilter(o,filters.snTarget,header)) return false;
    const conso=getConso(it.consoId);
    const consoText=[conso?.sap,conso?.label,conso?.cat,it.consoId].filter(Boolean).join(" ");
    const txt = v => String(v||"").toUpperCase();
    if(filters.date&& !txt(it.createdDT||o.createdDT).includes(txt(filters.date))) return false;
    if(filters.visa&& !txt(it.createdVisa||o.createdVisa).includes(txt(filters.visa))) return false;
    if(filters.fiche&& !txt(o.fiche).includes(txt(filters.fiche))) return false;
    if(filters.op&& !txt(o.op).includes(txt(filters.op))) return false;
    if(filters.sap&&!compactArticleCode(conso?.sap||conso?.code||"").toUpperCase().includes(compactArticleCode(filters.sap).toUpperCase())) return false;
    if(filters.conso&& !txt(consoText).includes(txt(filters.conso))) return false;
    if(filters.echantillon&& !txt(it.echantillon).includes(txt(filters.echantillon))) return false;
    if(filters.lot&& !txt(it.lot).includes(txt(filters.lot))) return false;
    if(filters.dp&& !txt(it.dp).includes(txt(filters.dp))) return false;
    const commentText=(it.comments||[]).map(c=>c.text).join(" ");
    if(filters.remarque&& !txt([it.remarque,commentText].filter(Boolean).join(" ")).includes(txt(filters.remarque))) return false;
    if(filters.traca==="yes"&&!it.tracaOk) return false;
    if(filters.traca==="no"&&it.tracaOk) return false;
    return true;
  }),entry=>entry.it?.createdDT||entry.o?.createdDT,entry=>!(entry.it?.validated??entry.o?.validated)&&!entry.it?.deleted&&!entry.o?.deleted);
  const hasFilters=Object.entries(filters).some(([k,v])=>v!=="all"&&filterHasValue(v));
  const clearFilters=()=>setFilters({snTarget:workSnFilter(header), date:"", visa:"", fiche:"", op:"", sap:"", conso:"", echantillon:"", lot:"", dp:"", traca:"all", remarque:""});
  const expirySummary=visibleRows.reduce((summary,{o,it})=>{
    if(it.dp&&!isValidDMY(it.dp)) summary.invalid++;
    else {
      const status=dpStatus(it.dp,it.createdDT||o.createdDT);
      if(status?.label==="PÉRIMÉ") summary.expired++;
      if(status?.label==="BIENTÔT") summary.soon++;
    }
    return summary;
  },{expired:0,soon:0,invalid:0});
  const expiryParts=[
    expirySummary.expired&&`${expirySummary.expired} périmé${expirySummary.expired>1?"s":""}`,
    expirySummary.soon&&`${expirySummary.soon} bientôt`,
    expirySummary.invalid&&`${expirySummary.invalid} date${expirySummary.invalid>1?"s":""} invalide${expirySummary.invalid>1?"s":""}`
  ].filter(Boolean);
  const polymerizations=visibleRows.flatMap(({o,it})=>{
    if(!o.validated||!it.validated) return [];
    const consumable=getConso(it.consoId);
    const status=polymerizationStatus(consumable,it.createdDT||o.createdDT,polymerizationNow);
    return status?[{...status,consumable,o,it}]:[];
  });
  const vacuumReadyAt=polymerizations.reduce((latest,p)=>!latest||p.readyAt>latest?p.readyAt:latest,null);
  const vacuumPending=polymerizations.some(p=>!p.done);
  const vacuumTitle=polymerizations.map(p=>`${snScopeLabel(p.o,snRowsFromHeader(header))} — ${p.consumable.label||p.consumable.sap||"Consommable"} : sous vide dès le ${formatAvailabilityDT(p.readyAt)}`).join("\n");

  return (
    <div style={{maxWidth:1500}}>
      {/* Toolbar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:8,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {perms.canWrite&&<Btn onClick={addOp} small>+ Ligne</Btn>}
          {expiryParts.length>0&&<span title="Anomalies de péremption des consommables affichés"
            style={{display:"inline-flex",alignItems:"center",padding:"6px 10px",borderRadius:4,
              border:`2px solid ${expirySummary.expired||expirySummary.invalid?C.red:C.yellow}`,
              background:(expirySummary.expired||expirySummary.invalid?C.red:C.yellow)+"20",
              color:expirySummary.expired||expirySummary.invalid?C.red:C.yellow,
              fontSize:12,fontWeight:900,fontFamily:"monospace",whiteSpace:"nowrap"}}>
            ⚠ {expiryParts.join(" · ")}
          </span>}
          {vacuumReadyAt&&<span title={vacuumTitle}
            style={{display:"inline-flex",alignItems:"center",padding:"6px 10px",borderRadius:4,
              border:`2px solid ${vacuumPending?C.yellow:C.green}`,
              background:(vacuumPending?C.yellow:C.green)+"20",color:vacuumPending?C.yellow:C.green,
              fontSize:12,fontWeight:900,fontFamily:"monospace",whiteSpace:"nowrap"}}>
            {vacuumPending?"◷ POLYMÉRISATION — SOUS VIDE DÈS LE":"✓ SOUS VIDE POSSIBLE DEPUIS LE"} {formatAvailabilityDT(vacuumReadyAt)}
          </span>}
        </div>
        <div style={{display:"flex",gap:8}}>
          {perms.canManageLists&&<Btn onClick={onEditList} color={C.border} small>⚙ Gérer la liste</Btn>}
          {totalDelOps>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées"}
          </Btn>}
        </div>
      </div>
      <div style={{overflowY:"auto",overflowX:"auto",border:`1px solid ${C.border}`,borderRadius:8,maxHeight:"calc(100vh - 330px)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",fontSize:12}}>
          <thead>
            <tr style={{background:C.raised}}>
              <TH w={118}>Date / Heure</TH>
              <TH w={34} color={C.accent}>Visa</TH>
              <TH w={82}>SN(s)</TH>
              <TH w={82}>Fiche suiveuse</TH>
              <TH w={34}>OP</TH>
              <TH w={118}>Code SAP</TH>
              <TH w={180}>Désignation</TH>
              <TH w={132}>LOT</TH>
              <TH w={62}>DP</TH>
              <TH w={68}>N° échant.</TH>
              <TH w={145}>Sous vide dès</TH>
              <TH w={52} color={C.green}>Traça</TH>
              <TH w={28}>💬</TH>
              <th style={{position:"sticky",right:0,zIndex:3,background:C.raised,color:C.muted,fontSize:10,fontWeight:700,
                letterSpacing:.8,textTransform:"uppercase",padding:"6px 8px",textAlign:"center",
                borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",width:110}}></th>
            </tr>
            <tr style={{background:C.blue+"0c",borderBottom:`2px solid ${C.border}`}}>
              <th style={{padding:"3px 4px"}}><Input value={filters.date} onChange={v=>setFilters(f=>({...f,date:v}))} small title="Filtrer date"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.visa} onChange={v=>setFilters(f=>({...f,visa:v}))} small title="Filtrer visa"/></th>
              <th style={{padding:"3px 4px"}}><SnFilter value={filters.snTarget} onChange={v=>setFilters(f=>({...f,snTarget:v}))} header={header}/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.fiche} onChange={v=>setFilters(f=>({...f,fiche:v}))} small title="Filtrer fiche suiveuse"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.op} onChange={v=>setFilters(f=>({...f,op:v}))} small title="Filtrer OP"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.sap} onChange={v=>setFilters(f=>({...f,sap:v}))} small title="Filtrer code SAP"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.conso} onChange={v=>setFilters(f=>({...f,conso:v}))} small title="Filtrer consommable"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.lot} onChange={v=>setFilters(f=>({...f,lot:v}))} small title="Filtrer LOT"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.dp} onChange={v=>setFilters(f=>({...f,dp:v}))} small title="Filtrer DP"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.echantillon} onChange={v=>setFilters(f=>({...f,echantillon:v}))} small title="Filtrer N° échantillon"/></th>
              <th style={{padding:"3px 4px"}}></th>
              <th style={{padding:"3px 4px"}}>
                <select value={filters.traca} onChange={e=>setFilters(f=>({...f,traca:e.target.value}))}
                  style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,
                    padding:"4px 6px",fontSize:10,fontFamily:"monospace",outline:"none",width:"100%"}}>
                  <option value="all">*</option>
                  <option value="yes">Oui</option>
                  <option value="no">Non</option>
                </select>
              </th>
              <th style={{padding:"3px 4px"}}><Input value={filters.remarque} onChange={v=>setFilters(f=>({...f,remarque:v}))} small title="Filtrer remarque"/></th>
              <th style={{position:"sticky",right:0,zIndex:3,background:C.raised,padding:"3px 4px",textAlign:"center"}}>
                {hasFilters&&<IconBtn onClick={clearFilters} color={C.border} title="Effacer les filtres">×</IconBtn>}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.flatMap(({o,it,oid,iid},idx)=>{
              const conso=getConso(it.consoId);
              const consoCode=compactArticleCode(conso?.sap||conso?.code||"");
              const catColor=CAT_COLORS[conso?.cat||"Autre"]||C.muted;
              const lineDate=it.createdDT||o.createdDT;
              const st=dpStatus(it.dp,lineDate);
              const polymerization=polymerizationStatus(conso,lineDate,polymerizationNow);
              const inv=it.dp&&!isValidDMY(it.dp);
              const opDeleted=o.deleted;
              const rowDeleted=opDeleted||it.deleted;
              const valid=!!o.validated&&!!it.validated;
              const editable = canEditItem(o,it);
              const locked = valid || !editable;
              const rowKey=`${oid}_${iid}`;
              return [
                <tr key={rowKey} style={{background:rowDeleted?"#da363318":it.tracaOk?"#23863610":idx%2===0?"transparent":C.stripe,
                  borderLeft:`3px solid ${rowDeleted?C.red:it.tracaOk?C.green:valid?C.green:conso?catColor:C.border}`,
                  textDecoration:rowDeleted?"line-through":undefined,opacity:rowDeleted?.6:1,pointerEvents:rowDeleted?"none":undefined}}>
                  <TD><OperationDateCell value={it.createdDT||o.createdDT} editing={!!it.editBase&&editable&&!rowDeleted} onChange={value=>updItem(oid,iid,"createdDT",value)}/></TD>
                  <TD><span style={{fontFamily:"monospace",fontWeight:800,fontSize:12,color:C.accent}}>{it.createdVisa||o.createdVisa||"—"}</span><CopyOriginMark origin={it.copyOrigin||o.copyOrigin}/></TD>
                  <TD style={{pointerEvents:rowDeleted?"none":"all"}}><CopyCell value={snScopeLabel(o,snRowsFromHeader(header))} title="Copier SN cible">
                    <SnScopePicker row={o} header={header} onChange={fields=>patchOp(oid,fields)} disabled={locked}/>
                  </CopyCell></TD>
                  <TD><Input value={o.fiche} onChange={v=>updOp(oid,"fiche",v)} small readOnly={locked} style={{fontFamily:"monospace",...(locked?LOCKED_INPUT_STYLE:{borderColor:!o.fiche?C.yellow:C.border})}}/></TD>
                  <TD><Input value={o.op} onChange={v=>updOp(oid,"op",v)} small readOnly={locked} style={{textAlign:"center",...(locked?LOCKED_INPUT_STYLE:{borderColor:!o.op?C.yellow:C.border})}}/></TD>
                  <TD><CopyCell value={consoCode} title="Copier code article">
                    {locked
                      ? <Input value={consoCode} small readOnly title={`Code SAP : ${consoCode||"—"}`} style={{fontFamily:"monospace",...LOCKED_INPUT_STYLE}}/>
                      : <ConsoDropdown display="code" value={it.consoId||""} onChange={v=>updItem(oid,iid,"consoId",v)} consommables={consommables} cats={cats}/>}
                  </CopyCell></TD>
                  <TD><CopyCell value={conso?.label||""} title="Copier désignation">
                    <Input value={conso?.label||""} small readOnly title={`Désignation : ${conso?.label||"—"}`} style={LOCKED_INPUT_STYLE}/>
                  </CopyCell></TD>
                  <TD><CopyCell value={it.lot} title="Copier LOT">
                    <Input value={it.lot} onChange={v=>updItem(oid,iid,"lot",v.toUpperCase())}
                      onBlur={e=>updItem(oid,iid,"lot",normLot(e.target.value))}
                      small readOnly={locked}
                      placeholder="0000020516" style={{fontFamily:"monospace",...(locked?LOCKED_INPUT_STYLE:{borderColor:!it.lot?C.yellow:C.border})}}/>
                  </CopyCell></TD>
                  <TD>
                    <div style={{display:"flex",alignItems:"center",gap:2,minWidth:0}}>
                      <div style={{flex:1,minWidth:0}}><Input value={it.dp} onChange={v=>updItem(oid,iid,"dp",v)} placeholder="JJ.MM.AA" small readOnly={locked}
                        title={inv?"Date invalide — format JJ.MM.AA":st?.label==="PÉRIMÉ"?`Anomalie : consommable périmé à la date de la ligne (${lineDate||"date inconnue"})`:st?.label==="BIENTÔT"?"Date de péremption proche":"Date de péremption"}
                        onBlur={e=>!locked&&updItem(oid,iid,"dp",normDP(e.target.value))}
                        style={{...(locked?LOCKED_INPUT_STYLE:{}),borderColor:inv?C.red:(!it.dp)?C.yellow:st?st.color:C.border,background:inv?C.red+"12":st?.bg,color:inv?C.red:st?.color,fontWeight:st?.label==="PÉRIMÉ"?800:undefined}}/></div>
                    </div>
                  </TD>
                  <TD><CopyCell value={it.echantillon} title="Copier N° échantillon">
                    <Input value={it.echantillon||""} onChange={v=>updItem(oid,iid,"echantillon",v)} small readOnly={locked}
                      placeholder="N° ech." style={{fontFamily:"monospace",...(locked?LOCKED_INPUT_STYLE:{})}}/>
                  </CopyCell></TD>
                  <TD>
                    {polymerization
                      ? <span title={`${polymerization.done?"Sous vide possible depuis le":"Sous vide dès le"} ${formatAvailabilityDT(polymerization.readyAt)}`}
                          style={{display:"block",padding:"3px 5px",borderRadius:4,textAlign:"center",fontFamily:"monospace",
                            border:`1px solid ${polymerization.done?C.green:C.yellow}`,
                            background:(polymerization.done?C.green:C.yellow)+"18",color:polymerization.done?C.green:C.yellow,
                            fontSize:9,fontWeight:900,lineHeight:1.25}}>
                          <span style={{display:"block",fontSize:10}}>{polymerization.done?"✓ PRÊT":"◷ ATTENTE"}</span>
                          {formatAvailabilityDT(polymerization.readyAt)}
                        </span>
                      : <span style={{display:"block",textAlign:"center",color:C.muted}}>—</span>}
                  </TD>
                  <TD style={{pointerEvents:"all"}}>
                    <StampStatus done={!!it.tracaOk} visa={it.visaTraca} date={it.dateTraca}
                      color={C.green} label="Traça" onStamp={()=>stampTraca(oid,iid)}
                      onClear={()=>clearTraca(oid,iid)} canClear={!rowDeleted&&perms.canTraceability} clearTitle="Dévalider la traçabilité"
                      onDateChange={(it.editBase||o.editBase)&&!rowDeleted&&perms.canTraceability?v=>setTracaDate(oid,iid,v):null}
                      disabled={rowDeleted||!perms.canTraceability}/>
                  </TD>
                  <TD center>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <CommentBtn comments={it.comments||[]} onChange={v=>updItem(oid,iid,"comments",v)} user={user} disabled={!perms.canComment}/>
                      {it.remarque&&<span title={it.remarque} style={{fontSize:10,color:C.muted,fontFamily:"monospace",maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.remarque}</span>}
                    </div>
                  </TD>
                  <td style={{position:"sticky",right:0,zIndex:2,background:rowDeleted?"#2b1719":it.tracaOk?"#14231b":idx%2===0?C.surface:C.raised,
                    padding:"5px 8px",borderBottom:`1px solid ${C.border}20`,fontSize:12,textAlign:"center",verticalAlign:"middle",
                    pointerEvents:"all",width:110}}>
                    {!rowDeleted&&!valid&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>validateLine(oid,iid)} color={C.green} title="Valider">✓</IconBtn>
                        <IconBtn onClick={()=>dupLine(oid,iid)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={{editHistory:[...(o.editHistory||[]),...(it.editHistory||[])]}}/>
                        <IconBtn onClick={()=>delItem(oid,iid)} color={C.border} title="Supprimer">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!rowDeleted&&valid&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>unlockLine(oid,iid)} color={C.yellow} title="Modifier">✎</IconBtn>
                        <IconBtn onClick={()=>dupLine(oid,iid)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={{editHistory:[...(o.editHistory||[]),...(it.editHistory||[])]}}/>
                        <IconBtn onClick={()=>delItem(oid,iid)} color={C.red} title="Annuler">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!rowDeleted&&!editable&&perms.canWrite&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>dupLine(oid,iid)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={{editHistory:[...(o.editHistory||[]),...(it.editHistory||[])]}}/>
                      </ActionGroup>
                    )}
                    {rowDeleted&&<IconBtn onClick={()=>opDeleted?setRestoreOpTarget(oid):setRestoreItemTarget({oid,iid})} color={C.yellow} title="Réactiver">↩</IconBtn>}
                  </td>
                </tr>,
                <HistoryTrail key={rowKey+"_ophist"} row={o} open={forceShowDeleted}/>,
                <HistoryTrail key={rowKey+"_hist"} row={it} open={forceShowDeleted}/>,
                rowDeleted&&(
                  <tr key={rowKey+"_ann"}>
                    <td colSpan={99} style={{padding:"3px 10px 5px",background:"#da363325",borderBottom:"1px solid #da363355"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace"}}>
                          ✕ Annulé le <strong>{it.deletedDate||o.deletedDate}</strong> par <strong>{it.deletedVisa||o.deletedVisa}</strong> — {it.deletedReason||o.deletedReason}
                        </span>
                        <PurgeLineButton user={user} data={data} onChange={onChange} id={opDeleted?oid:iid}/>
                        <span onClick={e=>{e.stopPropagation();opDeleted?setRestoreOpTarget(oid):setRestoreItemTarget({oid,iid});}}
                          style={{color:"#d29922",fontSize:11,cursor:"pointer",fontWeight:700,pointerEvents:"all",marginLeft:16}}>
                          ↩ Réactiver
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              ];
            })}
          </tbody>
        </table>
        {ops.length===0&&<div style={{textAlign:"center",color:C.muted,padding:32}}>Cliquez <strong>+ Ligne</strong> pour commencer</div>}
      </div>
      {deleteOpTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDelOp} onCancel={()=>setDeleteOpTarget(null)}/>}
      {deleteItemTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDelItem} onCancel={()=>setDeleteItemTarget(null)}/>}
      {restoreOpTarget&&<RestoreModal onConfirm={restoreOp} onCancel={()=>setRestoreOpTarget(null)}/>}
      {restoreItemTarget&&<RestoreModal onConfirm={restoreItem} onCancel={()=>setRestoreItemTarget(null)}/>}
    </div>
  );
};

// ─── 4. Test Equipment — format AAAA-MM + détection hors calibration ───────
const normCalib = s => {
  if(!s) return s;
  const d=s.replace(/\D/g,"");
  // AAMM "2506" → "2025-06"
  if(d.length===4) return "20"+d.slice(0,2)+"-"+d.slice(2,4);
  return s;
};
const parseCalibDate = s => {
  if(!s)return null;
  s=normCalib(s);
  if(!s.includes("-"))return null;
  const [yyyy,mm]=s.split("-");
  if(!yyyy||!mm)return null;
  // fin du mois indiqué
  return new Date(parseInt(yyyy),parseInt(mm),0); // jour 0 du mois suivant = dernier jour du mois
};
const isValidCalibDate = s => {
  if(!s) return true;
  const n=normCalib(s);
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(n)) return false;
  return true;
};
const calibStatus = s => {
  const d=parseCalibDate(normCalib(s));
  if(!d)return null;
  const diff=(d-new Date())/86400000;
  if(diff<0)return{label:"HORS CALIBRATION",color:C.red,bg:"#da363322"};
  if(diff<=30)return{label:"EXPIRE BIENTÔT",color:C.yellow,bg:"#d2992222"};
  return{label:"OK",color:C.green,bg:"#23863622"};
};

const TEST_EQUIP_EDIT_FIELDS = [
  {key:"createdDT",label:"Date de l'opération"},
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"isFour",label:"Four"},
  {key:"nInv",label:"N° INV"},
  {key:"type",label:"Type"},
  {key:"designation",label:"Désignation"},
  {key:"dateExpiration",label:"Date calibration"},
  {key:"checkDate",label:"Date contrôle"},
];

const TabTestEquip = ({data,onChange,user,perms={},header,forceShowDeleted=false,onCopyAcross}) => {
  const rows=data.rows||[];
  const canEdit = row => canEditLine(user,row);
  const add=()=>{ if(!perms.canWrite) return; onChange({rows:[...rows,{
    id:uid(),...defaultSnScope(header),nInv:"",type:"",designation:"",
    dateExpiration:"",
    isFour:false,
    visa:user.trigram,
    checkDate:now(),
    createdVisa:user.trigram,
    createdDT:nowDT(),
    commentaires:""
  }]}); };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const snFilter=workSnFilter(header);
  const upd=(id,f,v)=>{ const r=rows.find(x=>x.id===id); if(f==="comments" ? !perms.canComment : !canEdit(r)) return; onChange({rows:scopedRowsPatch(rows,id,header,{[f]:v})}); };
  const patchRow=(id,fields)=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const dup=id=>{ const r=rows.find(x=>x.id===id); if(!r||!perms.canWrite) return; if(onCopyAcross&&!r.deleted){onCopyAcross(r);return;} onChange({rows:[...rows,duplicateRow(r,user,{
    visa:user.trigram,checkDate:now()
  })]}); };
  const del=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r.validated&&!r.editBase) onChange({rows:rows.filter(x=>x.id!==id)});
    else if(!r.validated) onChange({rows:scopedRowsDelete(rows,id,header,{deleted:true,deletedReason:"",deletedVisa:user.trigram,deletedDate:nowDT()})});
    else setDeleteTarget(id);
  };
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ onChange({rows:scopedRowsDelete(rows,deleteTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()})}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  const REQUIRED = [
    {key:"nInv",          label:"N° INV"},
    {key:"type",          label:"Type"},
    {key:"designation",   label:"Désignation"},
    {key:"dateExpiration",label:"Date calibration"},
  ];
  const validateRow=id=>{ const r=rows.find(x=>x.id===id); if(!canEdit(r)) return; const miss=checkRequired(r,REQUIRED); if(miss.length) { upd(id,"validError","Champs requis : "+miss.join(", ")); } else { onChange({rows:scopedRowsPatch(rows,id,header,x=>withEditHistory(x,user,TEST_EQUIP_EDIT_FIELDS))}); } };
  const unlockRow=id=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:rows.map(r=>r.id===id?{...r,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(r,TEST_EQUIP_EDIT_FIELDS)}:r)}); };
  const horsCalib=effectiveScopedRows({header,testequip:{rows}},"testequip").filter(r=>rowMatchesSnFilter(r,snFilter,header)&&calibStatus(r.dateExpiration)?.color===C.red);
  const visibleRows=sortByNewestOperation(rows).filter(r=>
    (!r.deleted||showDeleted||forceShowDeleted) && rowMatchesSnFilter(r,snFilter,header)
  );
  return (
    <div style={{maxWidth:1450}}>
      {horsCalib.length>0&&(
        <div style={{background:"#da363322",border:`1px solid ${C.red}`,borderRadius:6,padding:"10px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{color:C.red,fontSize:16}}>⚠</span>
          <span style={{color:C.red,fontWeight:700,fontSize:13}}>
            {horsCalib.length} appareil{horsCalib.length>1?"s":""} hors calibration :&nbsp;
            {horsCalib.map(r=>r.designation||r.nInv||"?").join(", ")}
          </span>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:12}}>
        {perms.canWrite&&<div style={{marginRight:"auto"}}><Btn onClick={add} small>+ Équipement</Btn></div>}
        <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>Filtre SN : {snFilter==="all"?"TRAVAIL = Tous":snScopeLabel({snScope:"custom",snIds:[snFilter]},snRowsFromHeader(header))}</span>
        {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
          {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
        </Btn>}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
          <thead>
            <tr>
              <TH w={118}>Date / Heure</TH><TH w={46} color={C.accent}>Visa</TH>
              <TH w={78}>N° SN</TH>
              <TH w={48}>Four</TH>
              <TH>N° INV</TH>
              <TH>TYPE</TH>
              <TH>DÉSIGNATION</TH>
              <TH w={105}>Date calib</TH>
              <TH w={95}>Statut</TH>
              <TH w={96}>Date contrôle</TH>
              <TH w={36}>💬</TH>
              <TH w={104}></TH>
            </tr>
          </thead>
          <tbody>
            {visibleRows.flatMap((r,i)=>{
              const st=calibStatus(r.dateExpiration);
              const invalid=r.dateExpiration&&!isValidCalibDate(r.dateExpiration);
              const editable = canEdit(r);
              const locked = !!r.validated || !editable;
              return [
                <tr key={r.id} style={{background:r.deleted?"#da363318":st?.bg||(i%2===0?"transparent":C.stripe),
                  textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:1,
                  pointerEvents:r.deleted?"none":undefined,
                  borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
                  <TD><OperationDateCell value={r.createdDT} editing={!!r.editBase&&editable&&!r.deleted} onChange={value=>upd(r.id,"createdDT",value)}/></TD>
                  <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span><CopyOriginMark origin={r.copyOrigin}/></TD>
                  <TD style={{pointerEvents:r.deleted?"none":"all"}}><SnScopePicker row={r} header={header} onChange={fields=>patchRow(r.id,fields)} disabled={locked}/></TD>
                  <TD center style={{pointerEvents:r.deleted?"none":"all"}}>
                    <input type="checkbox" checked={!!r.isFour} disabled={locked}
                      onChange={e=>upd(r.id,"isFour",e.target.checked)}
                      title="Définir cet équipement comme four pour le proposer dans l'onglet Étuvages"
                      style={{width:16,height:16,accentColor:C.accent,cursor:locked?"default":"pointer"}}/>
                  </TD>
                  <TD><Input value={r.nInv} onChange={v=>upd(r.id,"nInv",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.type}        onChange={v=>upd(r.id,"type",v)}        small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.designation} onChange={v=>upd(r.id,"designation",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD>
                    <Input value={r.dateExpiration} onChange={v=>upd(r.id,"dateExpiration",v)}
                      placeholder="2026-06 ou AAMM" small readOnly={locked}
                      onBlur={e=>!locked&&upd(r.id,"dateExpiration",normCalib(e.target.value))}
                      style={{...(locked?LOCKED_INPUT_STYLE:{borderColor:invalid?C.red:undefined,color:invalid?C.red:undefined})}}/>
                    {invalid&&!locked&&<div style={{color:C.red,fontSize:9,marginTop:2}}>Format AAAA-MM, mois 01-12</div>}
                  </TD>
                  <TD center>
                    {st
                      ? <Badge label={st.label} color={st.color}/>
                      : <span style={{color:C.muted,fontSize:10}}>—</span>
                    }
                  </TD>

                  <TD>
                    <Input value={r.checkDate} onChange={v=>upd(r.id,"checkDate",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/>
                  </TD>
                  <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user} disabled={!perms.canComment}/></TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!r.deleted&&!r.validated&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={r}/>
                        <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                      </ActionGroup>
                    )}
                  {!r.deleted&&r.validated&&editable&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                      <IconBtn onClick={()=>setDeleteTarget(r.id)} color={C.red} title="Annuler">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&!editable&&perms.canWrite&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                    </ActionGroup>
                  )}
                  </TD>
                </tr>,
              <HistoryTrail key={r.id+"_hist"} row={r} open={forceShowDeleted}/>,
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
                      <PurgeLineButton user={user} data={data} onChange={onChange} id={r.id}/>
                      <span onClick={e=>{e.stopPropagation();setRestoreTarget(r.id);}}
                        style={{color:"#d29922",fontSize:11,cursor:"pointer",fontWeight:700,
                          pointerEvents:"all",textDecoration:"none",marginLeft:16,flexShrink:0}}>
                        ↩ Réactiver
                      </span>
                    </div>
                  </td>
                </tr>
              )
              ];
            })}
          </tbody>
        </table>
      </div>
      {rows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Aucun équipement</div>}
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>
        ✦ Visa pré-rempli · × annule et barre la ligne · Format date calibration : AAAA-MM (ex: 2026-06 = juin 2026)
      </div>
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

// ─── 5. DM ─────────────────────────────────────────────────────────────────
// ─── Types de faits par défaut ─────────────────────────────────────────────
const DEFAULT_FAIT_TYPES = [
  {id:"NC",  label:"NC — Non-Conformité",    color:C.red},
  {id:"DM",  label:"DM — Demande de Modif.", color:C.blue},
  {id:"ISS", label:"ISS — Fait Technique",   color:C.yellow},
];

const FaitTypeColor = {NC:C.red, DM:C.blue, ISS:C.yellow};
const getFaitColor = (typeId, types) => {
  const t = types.find(t=>t.id===typeId);
  return t?.color || FaitTypeColor[typeId] || C.muted;
};

// ─── Gestionnaire types de faits ───────────────────────────────────────────
const FaitTypesManager = ({types, onClose, onSave}) => {
  const [list, setList] = useState(types.map(t=>({...t})));
  const [newT, setNewT] = useState({id:"", label:"", color:C.purple});
  const COLORS = [C.red, C.blue, C.yellow, C.green, C.purple, C.accent, C.muted];

  const add = () => {
    if(!newT.id.trim()||!newT.label.trim()) return;
    if(list.find(t=>t.id===newT.id.toUpperCase())) return;
    setList(l=>[...l,{...newT, id:newT.id.toUpperCase()}]);
    setNewT({id:"", label:"", color:newT.color});
  };
  const del = id => setList(l=>l.filter(t=>t.id!==id));
  const upd = (id,f,v) => setList(l=>l.map(t=>t.id===id?{...t,[f]:v}:t));

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:10,width:"100%",maxWidth:560,maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>⚙ Types de faits</div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>onSave(list)} color={C.green} small>✓ Enregistrer</Btn>
            <Btn onClick={onClose} color={C.border} small>Annuler</Btn>
          </div>
        </div>
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.input}}>
          <div style={{color:C.muted,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Ajouter un type</div>
          <div style={{display:"grid",gridTemplateColumns:"80px 1fr auto auto",gap:8,alignItems:"end"}}>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>CODE</div>
              <Input value={newT.id} onChange={v=>setNewT(n=>({...n,id:v.toUpperCase()}))} small/>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>LIBELLÉ</div>
              <Input value={newT.label} onChange={v=>setNewT(n=>({...n,label:v}))} small/>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>COULEUR</div>
              <div style={{display:"flex",gap:4}}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setNewT(n=>({...n,color:c}))}
                    style={{width:18,height:18,borderRadius:3,background:c,border:newT.color===c?`2px solid #fff`:"2px solid transparent",cursor:"pointer"}}/>
                ))}
              </div>
            </div>
            <Btn onClick={add} color={C.accent} small>+ Ajouter</Btn>
          </div>
        </div>
        <div style={{overflow:"auto",flex:1,padding:"8px 0"}}>
          {list.map(t=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 20px",borderBottom:`1px solid ${C.border}20`}}>
              <Badge label={t.id} color={t.color}/>
              <div style={{flex:1,fontSize:12,color:C.text}}>{t.label}</div>
              <div style={{display:"flex",gap:3}}>
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>upd(t.id,"color",c)}
                    style={{width:14,height:14,borderRadius:2,background:c,border:t.color===c?`2px solid #fff`:"1px solid transparent",cursor:"pointer"}}/>
                ))}
              </div>
              <span onClick={()=>del(t.id)} style={{cursor:"pointer",color:C.red,fontSize:14,fontWeight:700}}>×</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusTypesManager = ({types,onClose,onSave}) => {
  const [list,setList]=useState(()=>normalizeStatusTypes(types));
  const [label,setLabel]=useState("");
  const [color,setColor]=useState("#8957e5");
  const [error,setError]=useState("");
  const makeId=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()
    .replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,32);
  const add=()=>{
    const id=makeId(label);
    if(!id||!label.trim()){setError("Libellé requis");return;}
    if(list.some(item=>item.id===id)){setError("Ce statut existe déjà");return;}
    setList(current=>[...current,{id,label:label.trim(),color,closed:false,order:current.length}]);
    setLabel("");setError("");
  };
  const update=(id,field,value)=>setList(current=>current.map(item=>item.id===id?{...item,[field]:value}:item));
  return <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:350,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
    onClick={event=>{if(event.target===event.currentTarget) onClose();}}>
    <div style={{width:"100%",maxWidth:720,maxHeight:"84vh",overflow:"hidden",display:"flex",flexDirection:"column",background:C.surface,border:`1px solid ${C.accent}`,borderRadius:8}}>
      <div style={{padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,borderBottom:`1px solid ${C.border}`}}>
        <div>
          <div style={{fontSize:14,fontWeight:800,color:C.text}}>Statuts OF et SN/LOT</div>
          <div style={{fontSize:11,color:C.muted}}>Cette liste est commune aux deux niveaux.</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>onSave(normalizeStatusTypes(list))} color={C.green} small>Enregistrer</Btn>
          <Btn onClick={onClose} color={C.border} small>Annuler</Btn>
        </div>
      </div>
      <div style={{padding:14,display:"grid",gridTemplateColumns:"1fr 70px auto",gap:8,alignItems:"end",borderBottom:`1px solid ${C.border}`,background:C.input}}>
        <div>
          <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Nouveau statut</div>
          <Input value={label} onChange={value=>{setLabel(value);setError("");}} onKeyDown={event=>{if(event.key==="Enter")add();}} placeholder="Ex. En attente qualité" small/>
        </div>
        <div>
          <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Couleur</div>
          <input aria-label="Couleur du nouveau statut" type="color" value={color} onChange={event=>setColor(event.target.value)}
            style={{width:"100%",height:28,padding:1,background:C.input,border:`1px solid ${C.border}`,borderRadius:4}}/>
        </div>
        <Btn onClick={add} color={C.accent} small>+ Ajouter</Btn>
        {error&&<div style={{gridColumn:"1 / -1",fontSize:11,color:C.red}}>{error}</div>}
      </div>
      <div style={{overflow:"auto",padding:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr><TH w={130}>Code</TH><TH>Libellé</TH><TH w={90}>Couleur</TH><TH w={130}>État final</TH></tr></thead>
          <tbody>{list.map(item=><tr key={item.id}>
            <TD><span style={{fontFamily:"monospace",color:C.muted}}>{item.id}</span></TD>
            <TD><Input value={item.label} onChange={value=>update(item.id,"label",value)} small/></TD>
            <TD center><input aria-label={`Couleur ${item.label}`} type="color" value={item.color} onChange={event=>update(item.id,"color",event.target.value)}
              style={{width:42,height:24,padding:1,background:C.input,border:`1px solid ${C.border}`,borderRadius:4}}/></TD>
            <TD center><label style={{display:"inline-flex",alignItems:"center",gap:6,color:C.text}}>
              <input type="checkbox" checked={!!item.closed} onChange={event=>update(item.id,"closed",event.target.checked)}/> Oui
            </label></TD>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  </div>;
};

// ─── 5+6. Faits (NC / DM / ISS / …) ───────────────────────────────────────
const FAITS_EDIT_FIELDS = [
  {key:"createdDT",label:"Date de l'opération"},
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"type",label:"Type"},
  {key:"numero",label:"N°"},
  {key:"visa",label:"Visa ouverture"},
  {key:"date",label:"Date ouverture"},
  {key:"lien",label:"Lien"},
  {key:"commentaires",label:"Commentaires"},
  {key:"closedDate",label:"Date clôture"},
  {key:"closedVisa",label:"Visa clôture"},
];

const TabFaits = ({data,onChange,user,perms={},faitTypes,onEditTypes,header,forceShowDeleted=false,onCopyAcross}) => {
  const rows     = data.rows||[];
  const types    = faitTypes;
  const isClosed = r => !!r.closedDate;
  const canEdit = row => canEditLine(user,row);

  const add  = () => { if(!perms.canWrite) return; onChange({rows:[...rows,{
    id:uid(), createdVisa:user.trigram, createdDT:nowDT(),
    ...defaultSnScope(header),
    type:"", numero:"", visa:user.trigram, date:now(),
    lien:"", commentaires:"", closedVisa:"", closedDate:""
  }]}); };
  const upd   = (id,f,v) => { const r=rows.find(x=>x.id===id); if((f==="comments"||f==="commentaires") ? !perms.canComment : !canEdit(r)) return; onChange({rows:scopedRowsPatch(rows,id,header,{[f]:v})}); };
  const patchRow = (id,fields) => { const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const dup=id=>{ const r=rows.find(x=>x.id===id); if(!r||!perms.canWrite) return; if(onCopyAcross&&!r.deleted){onCopyAcross(r);return;} onChange({rows:[...rows,duplicateRow(r,user,{
    visa:user.trigram,date:now(),closedVisa:"",closedDate:""
  })]}); };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const [copiedLien,setCopiedLien]     = useState(null);
  const snFilter=workSnFilter(header);
  const del=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r.validated&&!r.editBase&&!r.closedDate&&!r.closedVisa) onChange({rows:rows.filter(x=>x.id!==id)});
    else if(!r.validated) onChange({rows:scopedRowsDelete(rows,id,header,{deleted:true,deletedReason:"",deletedVisa:user.trigram,deletedDate:nowDT()})});
    else setDeleteTarget(id);
  };
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ const r=rows.find(x=>x.id===deleteTarget); if(canEdit(r)) onChange({rows:scopedRowsDelete(rows,deleteTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()})}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  const REQUIRED = [
    {key:"type",   label:"Type"},
    {key:"numero", label:"N° (référence)"},
    {key:"visa",   label:"Visa"},
    {key:"date",   label:"Date ouverture"},
  ];
  const validateRow=id=>{ const r=rows.find(x=>x.id===id); if(!canEdit(r)) return; const miss=checkRequired(r,REQUIRED); if(miss.length) { upd(id,"validError","Champs requis : "+miss.join(", ")); } else { onChange({rows:scopedRowsPatch(rows,id,header,x=>withEditHistory(x,user,FAITS_EDIT_FIELDS))}); } };
  const unlockRow=id=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:rows.map(r=>r.id===id?{...r,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(r,FAITS_EDIT_FIELDS)}:r)}); };
  const close = id => { const row=rows.find(x=>x.id===id); if(canEdit(row)) onChange({rows:scopedRowsPatch(rows,id,header,r=>withEditHistory({...r,closedVisa:user.trigram,closedDate:now(),editBase:r.editBase||snapshotFields(r,FAITS_EDIT_FIELDS)},user,FAITS_EDIT_FIELDS))}); };
  const reopen= id => { const row=rows.find(x=>x.id===id); if(canEdit(row)) onChange({rows:scopedRowsPatch(rows,id,header,r=>withEditHistory({...r,closedVisa:"",closedDate:"",editBase:r.editBase||snapshotFields(r,FAITS_EDIT_FIELDS)},user,FAITS_EDIT_FIELDS))}); };

  const activeRows=effectiveScopedRows({header,faits:{rows}},"faits").filter(r=>rowMatchesSnFilter(r,snFilter,header));
  const open   = activeRows.filter(r=>!isClosed(r)).length;
  const closed = activeRows.filter(isClosed).length;

  // Compteurs par type
  const typeCounts = types.map(t=>({...t, n:activeRows.filter(r=>r.type===t.id).length}));
  const visibleRows=sortByNewestOperation(rows).filter(r=>
    (!r.deleted||showDeleted||forceShowDeleted) && rowMatchesSnFilter(r,snFilter,header)
  );

  return (
    <div style={{maxWidth:1500}}>
      {/* En-tête stats + boutons */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:8,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {perms.canWrite&&<Btn onClick={add} small>+ Fait</Btn>}
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 14px",textAlign:"center"}}>
            <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Total</div>
            <div style={{color:C.text,fontSize:20,fontWeight:900,fontFamily:"monospace",lineHeight:1}}>{activeRows.length}</div>
          </div>
          {typeCounts.filter(t=>t.n>0).map(t=>(
            <Badge key={t.id} label={`${t.n} ${t.id}`} color={t.color}/>
          ))}
          <Badge label={`${open} ouvert${open>1?"s":""}`}   color={C.yellow}/>
          <Badge label={`${closed} clôturé${closed>1?"s":""}`} color={C.green}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>Filtre SN : {snFilter==="all"?"TRAVAIL = Tous":snScopeLabel({snScope:"custom",snIds:[snFilter]},snRowsFromHeader(header))}</span>
          {perms.canManageLists&&<Btn onClick={onEditTypes} color={C.border} small>⚙ Types</Btn>}
          {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
          </Btn>}
        </div>
      </div>

      <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
        <thead>
          <tr>
            <TH w={118}>Date / Heure</TH><TH w={46} color={C.accent}>Visa</TH>
            <TH w={78}>N° SN</TH>
            <TH w={76}>Type</TH>
            <TH w={105}>N° (saisi)</TH>
            <TH w={66} color={C.accent}>Visa ✦</TH>
            <TH w={82}>Date ouv.</TH>
            <TH w={180}>Lien / Chemin réseau</TH>
            <TH>Commentaires</TH>
            <TH w={82}>Date clôt.</TH>
            <TH w={70}>Visa clôt.</TH>
            <TH w={108}>Action</TH>
            <TH w={104}></TH>
          </tr>
        </thead>
        <tbody>
          {visibleRows.flatMap((r,i)=>{
            const typeColor = getFaitColor(r.type, types);
            const closed_r  = isClosed(r);
            const editable = canEdit(r);
            const locked = !!r.validated || !editable;
            return [
              <tr key={r.id} style={{background:r.deleted?"#da363318":closed_r?"#23863612":i%2===0?"transparent":C.stripe,
                textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:closed_r?.85:1,
                pointerEvents:r.deleted?"none":undefined,
                borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>

                <TD><OperationDateCell value={r.createdDT} editing={!!r.editBase&&editable&&!r.deleted} onChange={value=>upd(r.id,"createdDT",value)}/></TD>
                <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span><CopyOriginMark origin={r.copyOrigin}/></TD>
                <TD style={{pointerEvents:r.deleted?"none":"all"}}><SnScopePicker row={r} header={header} onChange={fields=>patchRow(r.id,fields)} disabled={locked}/></TD>

                {/* Type — liste déroulante */}
                <TD>

                  {locked
                    ? <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:typeColor,background:typeColor+"22",padding:"2px 8px",borderRadius:4}}>{r.type||"—"}</span>
                    : <><select value={r.type||""} onChange={e=>upd(r.id,"type",e.target.value)}
                        style={{background:C.input,border:`1px solid ${r.type?typeColor:C.yellow}`,borderRadius:4,
                          color:r.type?typeColor:C.muted,padding:"4px 6px",fontSize:11,
                          fontFamily:"monospace",fontWeight:700,outline:"none",width:"100%"}}>
                        <option value="">— type —</option>
                        {types.map(t=>(<option key={t.id} value={t.id}>{t.id}</option>))}
                      </select>
                      {r.type&&<div style={{fontSize:9,color:C.muted,marginTop:2}}>{types.find(t=>t.id===r.type)?.label||r.type}</div>}
                    </>}
                </TD>

                {/* N° saisi manuellement */}
                <TD>
                  <Input value={r.numero} onChange={v=>upd(r.id,"numero",v)} small required readOnly={locked}
                    title="Numéro du fait (ex: NC-2024-001, DM-0042…)"
                    style={{fontFamily:"monospace",fontWeight:700,...(locked?LOCKED_INPUT_STYLE:{color:r.numero?typeColor:undefined})}}/>
                </TD>

                {/* Visa ouverture */}
                <TD>
                  <Input value={r.visa} onChange={v=>upd(r.id,"visa",v)} small readOnly={locked}
                    style={locked?LOCKED_INPUT_STYLE:{background:"#e05c0015",borderColor:C.accent,color:C.accent,fontWeight:700}}/>
                </TD>

                {/* Date ouverture */}
                <TD>
                  <Input value={r.date} onChange={v=>upd(r.id,"date",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/>
                </TD>

                {/* Lien / chemin réseau */}
                <TD>
                  {(()=>{
                    const isHttp = r.lien && (r.lien.startsWith("http")||r.lien.startsWith("www.")||/^[a-zA-Z0-9-]+\./.test(r.lien.split("/")[0]));
                    const href = r.lien ? (r.lien.startsWith("http") ? r.lien : "https://"+r.lien) : "";
                    const isPath = r.lien && !isHttp;
                    const copied = copiedLien===r.id;
                    const copyPath=e=>{
                      e.stopPropagation();
                      try{
                        const ta=document.createElement("textarea");
                        ta.value=r.lien; ta.style.position="fixed"; ta.style.opacity="0";
                        document.body.appendChild(ta); ta.select();
                        document.execCommand("copy");
                        document.body.removeChild(ta);
                        setCopiedLien(r.id); setTimeout(()=>setCopiedLien(null),2000);
                      }catch{
                        window.prompt("Copier ce chemin (Ctrl+C):",r.lien);
                      }
                    };
                    if(locked&&r.lien) return (
                      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"nowrap"}}>
                        {isHttp
                          ? <a href={href} target="_blank" rel="noreferrer"
                              style={{color:C.blue,fontSize:11,fontFamily:"monospace",
                                textDecoration:"none",display:"flex",alignItems:"center",gap:4,minWidth:0,cursor:"pointer"}}
                              onClick={e=>e.stopPropagation()}>
                              🔗 <span style={{textDecoration:"underline",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{r.lien}</span>
                            </a>
                          : <span onClick={copyPath}
                              style={{color:copied?"#238636":C.blue,fontSize:10,fontFamily:"monospace",
                                display:"flex",alignItems:"center",gap:4,cursor:"pointer",minWidth:0}}
                              title="Cliquer pour copier le chemin">
                              {copied?"✓ Copié !":"📁"}
                              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160,textDecoration:"underline"}}>{r.lien}</span>
                            </span>}
                      </div>
                    );
                    return (
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>
                        <Input value={r.lien||""} onChange={v=>upd(r.id,"lien",v)} small readOnly={locked}
                          title="URL (https://…) ou chemin réseau (\\\\serveur\\dossier)"
                          style={{flex:1,fontSize:10,...(locked?LOCKED_INPUT_STYLE:{})}}/>
                        {isHttp&&<a href={href} target="_blank" rel="noreferrer"
                          style={{color:C.blue,fontSize:14,textDecoration:"none",flexShrink:0,cursor:"pointer"}}
                          onClick={e=>e.stopPropagation()}
                          title="Ouvrir le lien">🔗</a>}
                        {isPath&&<span onClick={copyPath}
                          style={{color:copied?"#238636":C.muted,fontSize:12,flexShrink:0,cursor:"pointer"}}
                          title="Copier le chemin">📁</span>}
                      </div>
                    );
                  })()}
                </TD>

                {/* Commentaires */}
                <TD>
                  <Input value={r.commentaires} onChange={v=>upd(r.id,"commentaires",v)} small readOnly={!perms.canComment} style={!perms.canComment?LOCKED_INPUT_STYLE:{}}/>
                </TD>

                {/* Date clôture */}
                <TD>
                  <Input value={r.closedDate} onChange={v=>upd(r.id,"closedDate",v)} small readOnly={!editable}
                    style={{...(editable?{}:LOCKED_INPUT_STYLE),background:closed_r?"#23863620":undefined,color:closed_r?C.green:undefined}}/>
                </TD>

                {/* Visa clôture */}
                <TD>
                  <Input value={r.closedVisa} onChange={v=>upd(r.id,"closedVisa",v)} small readOnly={!editable}
                    style={{...(editable?{}:LOCKED_INPUT_STYLE),background:closed_r?"#23863620":undefined,color:closed_r?C.green:undefined,fontWeight:closed_r?700:400}}/>
                </TD>

                {/* Action */}
                <TD center>
                  {editable&&<ActionGroup>
                    <button onClick={()=>closed_r?reopen(r.id):close(r.id)}
                      title={closed_r?"Réouvrir ce fait":"Clore ce fait"}
                      style={{background:(closed_r?C.yellow:C.green)+"22",border:`1px solid ${closed_r?C.yellow:C.green}`,
                        borderRadius:3,color:closed_r?C.yellow:C.green,fontSize:9,padding:"2px 7px",
                        cursor:"pointer",fontWeight:800,whiteSpace:"nowrap"}}>
                      {closed_r?"Ouvrir":"Clore"}
                    </button>
                  </ActionGroup>}
                </TD>

                <TD center style={{pointerEvents:"all"}}>
                  {!r.deleted&&!r.validated&&editable&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                      <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&r.validated&&editable&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                      <IconBtn onClick={()=>del(r.id)} color={C.red} title="Annuler">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&!editable&&perms.canWrite&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <HistoryBtn row={r}/>
                    </ActionGroup>
                  )}
                </TD>
              </tr>,
              r.validError&&!r.validated&&(
                <tr key={r.id+"_err"}>
                  <td colSpan={99} style={{padding:"3px 10px 5px",background:"#da363315",borderBottom:"1px solid #da363340"}}>
                    <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace"}}>⚠ {r.validError}</span>
                  </td>
                </tr>
              ),
              <HistoryTrail key={r.id+"_hist"} row={r} open={forceShowDeleted}/>,
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
                      <PurgeLineButton user={user} data={data} onChange={onChange} id={r.id}/>
                      <span onClick={e=>{e.stopPropagation();setRestoreTarget(r.id);}}
                        style={{color:"#d29922",fontSize:11,cursor:"pointer",fontWeight:700,
                          pointerEvents:"all",textDecoration:"none",marginLeft:16,flexShrink:0}}>
                        ↩ Réactiver
                      </span>
                    </div>
                  </td>
                </tr>
              )
            ];
          })}
        </tbody>
      </table>
      {rows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Aucun fait enregistré</div>}
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>
        ✦ Visa pré-rempli · N° saisi manuellement · 🔗 lien cliquable si http · 📁 chemin réseau · × annule et barre la ligne
      </div>
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

// ─── 7. Étuvages ───────────────────────────────────────────────────────────
const ETUVAGE_EDIT_FIELDS = [
  {key:"createdDT",label:"Date de l'opération"},
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"fourN",label:"Four N°"},
  {key:"duree",label:"Durée"},
  {key:"temp",label:"Temp"},
  {key:"entreeDT",label:"Entrée four"},
  {key:"entreeVisa",label:"Visa entrée"},
  {key:"sortieDT",label:"Sortie four"},
  {key:"sortieVisa",label:"Visa sortie"},
];

const TabEtuvage = ({data,onChange,user,perms={},allRows,tstRows,header,forceShowDeleted=false,onCopyAcross}) => {
  const rows=data.rows||[];
  const canEdit = row => canEditLine(user,row);
  const fours=uniqueOvenChoices(tstRows);
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const snFilter=workSnFilter(header);
  const add=()=>{ if(!perms.canWrite) return; onChange({rows:[...rows,{id:uid(),...defaultSnScope(header),createdVisa:user?.trigram||"",createdDT:nowDT(),fourN:"",duree:"",temp:"",entreeVisa:"",entreeDT:"",sortieVisa:"",sortieDT:"",comments:[]}]}); };
  const upd=(id,f,v)=>{ const r=rows.find(x=>x.id===id); if(f==="comments" ? !perms.canComment : !canEdit(r)) return; onChange({rows:scopedRowsPatch(rows,id,header,{[f]:v})}); };
  const patchRow=(id,fields)=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const dup=id=>{ const r=rows.find(x=>x.id===id); if(!r||!perms.canWrite) return; if(onCopyAcross&&!r.deleted){onCopyAcross(r);return;} onChange({rows:[...rows,duplicateRow(r,user,{
    entreeVisa:"",entreeDT:"",sortieVisa:"",sortieDT:""
  })]}); };
  const del=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r.validated&&!r.editBase&&!r.entreeDT&&!r.sortieDT) onChange({rows:rows.filter(x=>x.id!==id)});
    else if(!r.validated) onChange({rows:scopedRowsDelete(rows,id,header,{deleted:true,deletedReason:"",deletedVisa:user?.trigram||"?",deletedDate:nowDT()})});
    else setDeleteTarget(id);
  };
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ const r=rows.find(x=>x.id===deleteTarget); if(canEdit(r)) onChange({rows:scopedRowsDelete(rows,deleteTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()})}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  // validateAndEnter: check required fields then stamp entrée atomically
  const validateAndEnter=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r) return;
    const miss=[];
    if(!r.fourN) miss.push("Four N°");
    if(!r.duree) miss.push("Durée [H]");
    if(!r.temp)  miss.push("Temp [°C]");
    if(miss.length){
      onChange({rows:rows.map(x=>x.id===id?{...x,validError:"Requis avant entrée : "+miss.join(", ")}:x)});
      return;
    }
    onChange({rows:scopedRowsPatch(rows,id,header,x=>{
      const next={...x,entreeDT:x.entreeDT||nowDT(),entreeVisa:x.entreeVisa||user?.trigram||"",validated:true,validError:""};
      return withEditHistory(next,user,ETUVAGE_EDIT_FIELDS);
    })});
  };
  const validateRow=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r) return;
    const miss=[];
    if(!r.fourN) miss.push("Four N°");
    if(!r.duree) miss.push("Durée [H]");
    if(!r.temp)  miss.push("Temp [°C]");
    if(miss.length){
      onChange({rows:rows.map(x=>x.id===id?{...x,validError:"Requis : "+miss.join(", ")}:x)});
      return;
    }
    onChange({rows:scopedRowsPatch(rows,id,header,x=>withEditHistory({...x,validated:true,validError:""},user,ETUVAGE_EDIT_FIELDS))});
  };
  const unlockRow=id=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:rows.map(x=>x.id===id?{...x,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(x,ETUVAGE_EDIT_FIELDS)}:x)}); };
  const stamp=(id,field)=>{
    const row=rows.find(x=>x.id===id);
    if(!canEdit(row)) return;
    const extra = field==="entreeDT"
      ? {entreeVisa:user?.trigram||"", validated:true, validError:""}
      : field==="sortieDT"
      ? {sortieVisa:user?.trigram||""}
      : {};
    onChange({rows:scopedRowsPatch(rows,id,header,{[field]:nowDT(),...extra})});
  };
  const patchEtuvageStamp=(id,fields)=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const nei = nextEtuvageInfo((allRows||rows).filter(r=>rowMatchesSnFilter(r,snFilter,header)));
  const visibleRows=sortByNewestOperation(rows,r=>r.entreeDT||r.createdDT).filter(r=>
    (!r.deleted||showDeleted||forceShowDeleted) && rowMatchesSnFilter(r,snFilter,header)
  );
  return (
    <div style={{maxWidth:1500}}>
      <datalist id="fours-etuvage">
        {fours.map(f=><option key={f.id} value={String(f.nInv||f.designation).trim()}>{[f.nInv,f.designation].filter(Boolean).join(" — ")}</option>)}
      </datalist>
      {/* Prochain étuvage */}
      <div style={{background:nei.overdue?"#da363318":"#1f6feb12",border:`1px solid ${nei.overdue?C.red:C.blue}`,
        borderRadius:6,padding:"8px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <span style={{fontSize:16}}>{nei.overdue?"🔴":"🕐"}</span>
        <div>
          <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.8}}>Prochain étuvage</div>
          <div style={{fontFamily:"monospace",fontWeight:700,fontSize:13,color:nei.overdue?C.red:C.blue}}>{nei.label}</div>
        </div>
        {!nei.overdue&&<div style={{color:C.muted,fontSize:11}}>
          dans {nei.diffDays>0?`${nei.diffDays}j `:""}{nei.diffH>0?`${nei.diffH}h `:""}{ nei.diffMin||0}min
        </div>}
        {nei.overdue&&<div style={{color:C.red,fontSize:11,fontWeight:700}}>EN RETARD</div>}
        {nei.lastLabel&&<div style={{color:C.muted,fontSize:10,marginLeft:"auto"}}>
          Dernier : <span style={{fontFamily:"monospace"}}>{nei.lastLabel}</span>
          &nbsp;·&nbsp;{nei.count} étuvage{nei.count>1?"s":""} au total
        </div>}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:12}}>
        {perms.canWrite&&<div style={{marginRight:"auto"}}><Btn onClick={add} small>+ Étuvage</Btn></div>}
        <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>Filtre SN : {snFilter==="all"?"TRAVAIL = Tous":snScopeLabel({snScope:"custom",snIds:[snFilter]},snRowsFromHeader(header))}</span>
        {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
          {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
        </Btn>}
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
          <thead>
            <tr>
              <TH w={118}>Date / Heure</TH><TH w={46} color={C.accent}>Visa</TH>
              <TH w={78}>N° SN</TH>
              <TH w={70}>Four N°</TH><TH w={58}>Durée [H]</TH><TH w={58}>Temp [°C]</TH>
              <TH w={96}>▶ Entrée</TH><TH w={122}>Date/Heure entrée</TH>
              <TH w={96}>■ Sortie</TH><TH w={122}>Date/Heure sortie</TH>
              <TH w={34}>💬</TH>
              <TH w={104}></TH>
            </tr>
          </thead>
          <tbody>
            {visibleRows.flatMap((r,i)=>{
              const inFour=!!r.entreeDT,outFour=!!r.sortieDT;
              const editable = canEdit(r);
              const locked = !!r.validated || !editable;
              const fourVal=r.fourN.trim().toLowerCase();
              const fourOk=!r.fourN||fours.some(t=>
                (t.nInv||"").trim().toLowerCase()===fourVal ||
                (t.designation||"").trim().toLowerCase()===fourVal
              );
              return [
                <tr key={r.id} style={{background:r.deleted?"#da363318":outFour?"#23863610":inFour?"#1f6feb10":i%2===0?"transparent":C.stripe,
                  textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:1,
                  pointerEvents:r.deleted?"none":undefined,
                  borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
                  <TD><OperationDateCell value={r.createdDT} editing={!!r.editBase&&editable&&!r.deleted} onChange={value=>upd(r.id,"createdDT",value)}/></TD>
                  <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span><CopyOriginMark origin={r.copyOrigin}/></TD>
                  <TD style={{pointerEvents:r.deleted?"none":"all"}}><SnScopePicker row={r} header={header} onChange={fields=>patchRow(r.id,fields)} disabled={locked}/></TD>
                  <TD>
                    {locked?(
                      <Input value={r.fourN} small readOnly style={LOCKED_INPUT_STYLE}/>
                    ):(
                      <>
                        <input list="fours-etuvage" value={r.fourN||""} onChange={e=>upd(r.id,"fourN",e.target.value)}
                          placeholder={fours.length?"Choisir four":"Aucun four"}
                          style={{width:"100%",fontFamily:"monospace",outline:"none",padding:"4px 6px",fontSize:11,
                            background:C.input,color:r.fourN&&!fourOk?C.yellow:C.text,
                            border:`1px solid ${r.fourN&&!fourOk?C.yellow:C.border}`,borderRadius:4}}/>
                      </>
                    )}
                    {r.fourN&&!fourOk&&!locked&&<div style={{color:C.yellow,fontSize:9,marginTop:1,whiteSpace:"nowrap"}}>⚠ non coché four</div>}
                    {!r.fourN&&!fours.length&&!locked&&<div style={{color:C.muted,fontSize:9,marginTop:1,whiteSpace:"nowrap"}}>Cochez un four dans Test Equip.</div>}
                  </TD>
                  <TD><Input value={r.duree} onChange={v=>upd(r.id,"duree",v)} small placeholder="h" readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.temp}  onChange={v=>upd(r.id,"temp",v)}  small placeholder="°C" readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!inFour
                      ? (editable&&<Btn onClick={()=>validateAndEnter(r.id)} color={C.blue} small>▶ Entrée four</Btn>)
                      : <div style={{display:"flex",flexDirection:"column",gap:1,alignItems:"center"}}>
                          <Badge label="▶ EN FOUR" color={C.blue}/>
                          {!locked
                            ? <Input value={r.entreeVisa||""} onChange={v=>patchEtuvageStamp(r.id,{entreeVisa:v})} small
                                title="Corriger le visa entrée"
                                style={{width:48,fontSize:9,fontFamily:"monospace",textAlign:"center",padding:"1px 3px",color:C.blue}}/>
                            : <span style={{fontFamily:"monospace",fontSize:9,color:C.blue}}>{r.entreeVisa}</span>}
                        </div>}
                  </TD>
                  <TD>
                    {!locked
                      ? <Input value={r.entreeDT||""} onChange={v=>patchEtuvageStamp(r.id,{entreeDT:v,entreeVisa:v?(r.entreeVisa||user?.trigram||""):"",...(v?{}:{sortieDT:"",sortieVisa:""})})}
                          small title="Corriger la date/heure d'entrée. Vider retire l'état entrée four."
                          readOnly={!editable}
                          style={{fontFamily:"monospace",fontSize:11,color:r.entreeDT?C.blue:C.muted}}/>
                      : <span style={{fontFamily:"monospace",fontSize:11,color:inFour?C.blue:C.muted}}>{r.entreeDT||"—"}</span>}
                  </TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!outFour
                      ? (editable&&<Btn onClick={()=>stamp(r.id,"sortieDT")} color={C.green} small disabled={!inFour}>■ Sortie</Btn>)
                      : <div style={{display:"flex",flexDirection:"column",gap:1,alignItems:"center"}}>
                          <Badge label="■ SORTI" color={C.green}/>
                          {!locked
                            ? <Input value={r.sortieVisa||""} onChange={v=>patchEtuvageStamp(r.id,{sortieVisa:v})} small
                                title="Corriger le visa sortie"
                                style={{width:48,fontSize:9,fontFamily:"monospace",textAlign:"center",padding:"1px 3px",color:C.green}}/>
                            : <span style={{fontFamily:"monospace",fontSize:9,color:C.green}}>{r.sortieVisa}</span>}
                        </div>}
                  </TD>
                  <TD>
                    {!r.validated
                      ? <Input value={r.sortieDT||""} onChange={v=>patchEtuvageStamp(r.id,{sortieDT:v,sortieVisa:v?(r.sortieVisa||user?.trigram||""):""})}
                          small title="Corriger la date/heure de sortie. Vider retire l'état sortie four."
                          readOnly={!editable}
                          style={{fontFamily:"monospace",fontSize:11,color:r.sortieDT?C.green:C.muted}}/>
                      : <span style={{fontFamily:"monospace",fontSize:11,color:outFour?C.green:C.muted}}>{r.sortieDT||"—"}</span>}
                  </TD>
                  <TD center style={{pointerEvents:"all"}}>
                    <CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user} disabled={!perms.canComment}/>
                  </TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!r.deleted&&!inFour&&!r.editBase&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={r}/>
                        <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!r.deleted&&!inFour&&r.editBase&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider les modifications">✓</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={r}/>
                        <IconBtn onClick={()=>del(r.id)} color={C.red} title="Annuler">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!r.deleted&&inFour&&r.validated&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={r}/>
                        <IconBtn onClick={()=>del(r.id)} color={C.red} title="Annuler">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!r.deleted&&inFour&&!r.validated&&editable&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider les modifications">✓</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={r}/>
                        <IconBtn onClick={()=>del(r.id)} color={C.red} title="Annuler">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!r.deleted&&!editable&&perms.canWrite&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <HistoryBtn row={r}/>
                      </ActionGroup>
                    )}
                  </TD>
                </tr>,
              r.validError&&!r.validated&&(
                <tr key={r.id+"_err"}>
                  <td colSpan={99} style={{padding:"2px 10px 4px",background:"#da363315",borderBottom:"1px solid #da363340"}}>
                    <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace"}}>⚠ {r.validError}</span>
                  </td>
                </tr>
              ),
              <HistoryTrail key={r.id+"_hist"} row={r} open={forceShowDeleted}/>,
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
                      <PurgeLineButton user={user} data={data} onChange={onChange} id={r.id}/>
                      <span onClick={e=>{e.stopPropagation();setRestoreTarget(r.id);}}
                        style={{color:"#d29922",fontSize:11,cursor:"pointer",fontWeight:700,
                          pointerEvents:"all",textDecoration:"none",marginLeft:16,flexShrink:0}}>
                        ↩ Réactiver
                      </span>
                    </div>
                  </td>
                </tr>
              )
              ];
            })}
          </tbody>
        </table>
        {rows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Aucun étuvage</div>}
      </div>
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

// ─── 8. Mating / Demating ────────────────────────────────────────────────
// Modèle : journal d'actions par connecteur
// events = [{id, dt, visa, action:"Mating"|"Demating", remarque:"", comments:[]}]
// Cycles = events.length / 2  (décimal : 0.5, 1, 1.5, 2…)
// Alternance stricte après la première action (libre)
// Suppression avec motif sur chaque événement
const CONNECTOR_EDIT_FIELDS = [
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"nConect",label:"Connecteur"},
];
const ConnectorActionButton = ({action,connector,disabled,title,onClick}) => {
  const mating=action==="Mating",tone=mating?C.green:C.red;
  const half={width:6,height:10,border:"2px solid currentColor",borderRadius:2,display:"inline-block"};
  return <button type="button" aria-label={`${action} ${connector}`} disabled={disabled} title={title} onClick={onClick}
    style={{height:34,minWidth:0,width:"100%",padding:"2px",border:`1px solid ${disabled?C.border:tone}`,borderRadius:4,
      background:disabled?C.raised:tone+"18",color:disabled?C.muted:tone,cursor:disabled?"default":"pointer",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,fontFamily:"system-ui,sans-serif",fontSize:11,lineHeight:"13px",fontWeight:700}}>
    <span aria-hidden="true" style={{display:"flex",alignItems:"center",justifyContent:"center",height:12,gap:2,opacity:disabled?.5:1}}>
      <span style={half}/><span style={{width:23,textAlign:"center",fontSize:13,lineHeight:1}}>{mating?"→←":"←→"}</span><span style={half}/>
    </span>
    <span>{action}</span>
  </button>;
};

const TabDeMating = ({data,onChange,user,perms={},header,forceShowDeleted=false,onCopyAcross}) => {
  const connectors = data.connectors||[];
  const canEdit = row => canEditLine(user,row);
  const [deleteEvTarget,   setDeleteEvTarget]   = useState(null); // {cid,eid}
  const [deleteConnTarget, setDeleteConnTarget] = useState(null); // cid
  const [restoreEvTarget,   setRestoreEvTarget]   = useState(null); // {cid,eid}
  const [restoreConnTarget, setRestoreConnTarget] = useState(null); // cid
  const [showDeleted, setShowDeleted] = useState(false);
  const [historyConnector,setHistoryConnector] = useState("all");
  const snFilter=workSnFilter(header);

  const scopeIds = row => {
    const snRows=snRowsFromHeader(header);
    if(!snRows.length) return ["__of__"];
    const scope=snScope(row,snRows);
    const excluded=(row?.snExcludeIds||[]).filter(id=>snRows.some(s=>s.id===id));
    return scope.mode==="all"
      ? snRows.map(s=>s.id).filter(id=>!excluded.includes(id))
      : scope.ids;
  };
  const makeConnector = (scope,nConect="") => ({
    id:uid(), ...scope, nConect, validated:true, connError:"",
    deleted:false, deletedReason:"", deletedVisa:"", deletedDate:"",
    createdVisa:user?.trigram||"",
    createdDT:nowDT(),
    comments:[],
    events:[]
  });
  const appendConnectors = additions => {
    for(const c of additions){
      const ids=scopeIds(c);
      const duplicate=connectors.some(x=>!x.deleted&&String(x.nConect||"").trim().toUpperCase()===c.nConect&&scopeIds(x).some(id=>ids.includes(id)));
      if(duplicate){window.alert(`Connecteur ${c.nConect} déjà existant pour le SN ou lot concerné.`);return;}
    }
    onChange({connectors:[...connectors,...additions]});
  };

  // ── Connecteurs ─────────────────────────────────────────────
  const addC = () => {
    if(!perms.canWrite) return;
    const snRows=snRowsFromHeader(header);
    const active=header?._entrySnIds?.[0]||workSnFilter(header);
    const name=window.prompt("Nom du connecteur à créer (ex: J4)", "");
    if(name===null) return;
    const nConect=String(name||"").trim().toUpperCase();
    if(!nConect){window.alert("Nom du connecteur requis (ex: J4).");return;}
    if(snRows.length>1){
      const createAll=window.confirm(
        `Créer ${nConect||"ce connecteur"} pour tous les SN / LOT ?\n\n${snRows.map(snTitle).join("\n")}\n\nOK = créer un connecteur indépendant par SN / LOT.\nAnnuler = créer uniquement pour le SN de saisie.`
      );
      if(createAll){
        appendConnectors(snRows.map(sn=>makeConnector({snScope:"custom",snIds:[sn.id],unitId:sn.id},nConect)));
        return;
      }
      if(active==="all"){
        window.alert("Sélectionne d'abord un SN dans TRAVAIL pour créer un connecteur sur un seul SN.");
        return;
      }
      appendConnectors([makeConnector({snScope:"custom",snIds:[active],unitId:active},nConect)]);
      return;
    }
    appendConnectors([makeConnector(defaultSnScope(header),nConect)]);
  };
  const updC = (cid,f,v) => {
    const c=connectors.find(x=>x.id===cid);
    if(f==="comments" ? !perms.canComment : !canEdit(c)) return;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,{[f]:v})});
  };
  const patchC = (cid,fields) => {
    const c=connectors.find(x=>x.id===cid);
    if(canEdit(c)) onChange({connectors:scopedRowsPatch(connectors,cid,header,fields)});
  };
  const validateConn = cid => {
    const c=connectors.find(x=>x.id===cid);
    if(!canEdit(c)) return;
    if(!c?.nConect?.trim()){ onChange({connectors:connectors.map(x=>x.id===cid?{...x,connError:"Nom du connecteur requis (ex: J13)"}:x)}); return; }
    const snRows=snRowsFromHeader(header);
    const currentIds=scopeIds(c);
    const same=String(c.nConect||"").trim().toUpperCase();
    const duplicate=connectors.find(x=>x.id!==cid&&!x.deleted&&String(x.nConect||"").trim().toUpperCase()===same&&
      scopeIds(x).some(id=>currentIds.includes(id)));
    if(duplicate){
      const dupIds=scopeIds(duplicate).filter(id=>currentIds.includes(id));
      const label=dupIds.includes("__of__")
        ? "cet OF"
        : dupIds.slice(0,3).map(id=>snTitle(snRows.find(s=>s.id===id))).join(" + ")+(dupIds.length>3?` + ${dupIds.length-3} SN`:"");
      onChange({connectors:connectors.map(x=>x.id===cid?{...x,connError:`Connecteur ${same} déjà existant sur ${label}`}:x)});
      return;
    }
    onChange({connectors:scopedRowsPatch(connectors,cid,header,x=>withEditHistory({...x,connError:""},user,CONNECTOR_EDIT_FIELDS))});
  };
  const unlockConn = cid => {
    const c=connectors.find(x=>x.id===cid);
    if(canEdit(c)) onChange({connectors:connectors.map(c=>c.id===cid?{...c,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(c,CONNECTOR_EDIT_FIELDS)}:c)});
  };
  const restoreC   = reason => {
    onChange({connectors:connectors.map(c=>c.id===restoreConnTarget?{...c,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:c)});
    setRestoreConnTarget(null);
  };
  const confirmDelConn = reason => {
    const c=connectors.find(x=>x.id===deleteConnTarget);
    if(canEdit(c)) onChange({connectors:scopedRowsDelete(connectors,deleteConnTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()})});
    setDeleteConnTarget(null);
  };
  const delConn = cid => {
    const c=connectors.find(x=>x.id===cid);
    if(!canEdit(c)) return;
    if(!c.validated&&!c.editBase&&!(c.events||[]).length) onChange({connectors:connectors.filter(x=>x.id!==cid)});
    else if(!c.validated) onChange({connectors:scopedRowsDelete(connectors,cid,header,{deleted:true,deletedReason:"",deletedVisa:user?.trigram||"?",deletedDate:nowDT()})});
    else setDeleteConnTarget(cid);
  };

  // ── Événements ───────────────────────────────────────────────
  // Dernier événement actif (non supprimé)
  const lastActive = c => [...(c.events||[])].filter(e=>!e.deleted).slice(-1)[0]||null;

  // Prochaine action attendue : "either" si aucun event, sinon opposé du dernier
  const nextExpected = c => {
    const last = lastActive(c);
    if(!last) return "either";
    return last.action==="Mating" ? "Demating" : "Mating";
  };

  // Compteur de cycles (décimal)
  const cycleCount = c => {
    const n = (c.events||[]).filter(e=>!e.deleted).length;
    return n/2;
  };

  // Statut
  const connStatus = c => {
    const last = lastActive(c);
    if(!last) return {label:"Aucune action", color:C.muted};
    return last.action==="Mating"
      ? {label:"⚡ MATÉ", color:C.green}
      : {label:"✓ DÉMATÉ", color:C.red};
  };

  const addEvent = (cid, action) => {
    const c = connectors.find(x=>x.id===cid); if(!c) return;
    if(!canRecordMating(user,c)) return;
    const ne = nextExpected(c);
    if(ne!=="either"&&ne!==action) return; // should not happen (button disabled)
    const ev = {id:uid(), dt:nowDT(), visa:user?.trigram||"", action, remarque:"", comments:[], deleted:false, deletedReason:"", deletedVisa:"", deletedDate:""};
    const ids=scopeIds(c);
    if(ids.length>1){
      const active=workSnFilter(header);
      const snRows=snRowsFromHeader(header);
      const activeRow=snRows.find(s=>s.id===active);
      if(!activeRow||!rowMatchesSn(c,activeRow,snRows)){
        window.alert("Choisis d'abord le SN de travail avant d'enregistrer un Mating/Demating.");
        return;
      }
      let inserted=null;
      const next=connectors.map(x=>{
        if(x.id!==cid) return x;
        const excluded=[...new Set([...(x.snExcludeIds||[]),active])];
        inserted={...x,id:uid(),snScope:"custom",snIds:[active],unitId:active,snExcludeIds:[],events:[...(x.events||[]),ev],_scopeEditConfirmed:undefined};
        return {...x,...remainingSnScope(x,active),_scopeEditConfirmed:undefined};
      });
      onChange({connectors:[...next,inserted]});
      return;
    }
    onChange({connectors:scopedRowsPatch(connectors,cid,header,{events:[...(c.events||[]),ev]})});
  };
  const requestEventFromTile = (c,chosenAction) => {
    if(!canRecordMating(user,c)) return;
    const expected=nextExpected(c);
    let action=chosenAction||expected;
    if(chosenAction&&expected!=="either"&&chosenAction!==expected) return;
    if(expected==="either"&&!chosenAction){
      const choice=window.prompt(
        `${c.nConect||"Connecteur"} : première action à enregistrer\n\n1 = Mating\n2 = Demating\n3 = annuler`,
        "1"
      );
      if(choice===null||String(choice).trim()==="3") return;
      action=String(choice).trim()==="2" ? "Demating" : "Mating";
    }
    const label = action==="Mating" ? "Mating" : "Demating";
    if(window.confirm(`${c.nConect||"Connecteur"} : enregistrer ${label} maintenant ?`)) {
      addEvent(c.id, action);
    }
  };

  const updEv = (cid,eid,f,v) => {
    const c=connectors.find(x=>x.id===cid);
    if(f==="comments" ? !perms.canComment : !canEdit(c)) return;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,c=>({
      events:c.events.map(e=>e.id===eid?{...e,[f]:v}:e)
    }))});
  };
  const updEvDate = (cid,eid,value) => {
    const c=connectors.find(x=>x.id===cid);
    if(!c?.editBase||!canEdit(c)) return;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,current=>({
      events:(current.events||[]).map(event=>event.id!==eid?event:{
        ...event,
        dt:value,
        editHistory:[...(event.editHistory||[]),{
          id:uid(),dt:nowDT(),visa:user?.trigram||"?",
          changes:[{label:"Date de l'opération",from:event.dt||"",to:value}],
        }],
      }),
    }))});
  };

  const confirmDelEv = reason => {
    const {cid,eid}=deleteEvTarget;
    const c=connectors.find(x=>x.id===cid);
    if(canEdit(c)) onChange({connectors:scopedRowsPatch(connectors,cid,header,c=>({
      events:c.events.map(e=>e.id===eid?{...e,deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()}:e)
    }))});
    setDeleteEvTarget(null);
  };
  const restoreEv = reason => {
    const {cid,eid}=restoreEvTarget;
    onChange({connectors:scopedRowsPatch(connectors,cid,header,c=>({
      events:c.events.map(e=>e.id===eid?{...e,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:e)
    }))});
    setRestoreEvTarget(null);
  };

  const totalDeleted = connectors.filter(c=>c.deleted).length;
  const visibleConnectors = connectors.filter(c=>
    (!c.deleted||showDeleted||forceShowDeleted) && rowMatchesSnFilter(c,snFilter,header)
  );
  const snRows=snRowsFromHeader(header);
  const connectorGroups = snFilter==="all" && snRows.length
    ? snRows.map(sn=>({
        id:sn.id,
        label:snTitle(sn),
        rows:visibleConnectors.filter(c=>rowMatchesSn(c,sn,snRows))
      })).filter(g=>g.rows.length)
    : [{id:"active",label:null,rows:visibleConnectors}];
  const historyRows = connectors.flatMap(c=>(c.events||[]).map((ev,idx)=>({
    c, ev, cycle:(idx+1)/2
  }))).filter(x=>
    (!x.c.deleted||showDeleted||forceShowDeleted) &&
    (!x.ev.deleted||showDeleted||forceShowDeleted) &&
    rowMatchesSnFilter(x.c,snFilter,header) &&
    (historyConnector==="all" || x.c.id===historyConnector)
  ).reverse();
  const activeVisibleConnectors = visibleConnectors.filter(c=>!c.deleted);
  const summaryStats = {
    total: activeVisibleConnectors.length,
    mattes: activeVisibleConnectors.filter(c=>lastActive(c)?.action==="Mating").length,
    demattes: activeVisibleConnectors.filter(c=>lastActive(c)?.action==="Demating").length,
    sansAction: activeVisibleConnectors.filter(c=>!lastActive(c)).length,
    cycles: activeVisibleConnectors.reduce((s,c)=>s+cycleCount(c),0)
  };
  const cycleRows = visibleConnectors
    .filter(c=>!c.deleted && (historyConnector==="all" || c.id===historyConnector))
    .sort((a,b)=>connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect)))
    .flatMap(c=>{
      const status=connStatus(c);
      const cycles=buildMatingCycles(c);
      if(!cycles.length) return [{c,status,idx:0,mat:null,dem:null,empty:true}];
      return cycles
        .map((cy,i)=>({cy,idx:i+1}))
        .sort((a,b)=>String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))))
        .map(({cy,idx})=>({c,status,idx,mat:cy.mat,dem:cy.dem,empty:false}));
    });
  const cycleGroups = visibleConnectors
    .filter(c=>!c.deleted && (historyConnector==="all" || c.id===historyConnector))
    .sort((a,b)=>connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect)))
    .map(c=>{
      const status=connStatus(c);
      const last=lastActive(c);
      const cycles=buildMatingCycles(c)
        .map((cy,i)=>({cy,n:i+1}))
        .sort((a,b)=>String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))) || b.n-a.n)
        .map(({cy},i)=>({idx:i+1,mat:cy.mat,dem:cy.dem,empty:false}));
      return {c,status,last,cycles:cycles.length?cycles:[{idx:0,mat:null,dem:null,empty:true}]};
    });

  return (
    <div style={{maxWidth:1500}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          {perms.canWrite&&<Btn onClick={addC} small>+ Connecteur</Btn>}
          <Badge label={`${summaryStats.total} connecteur${summaryStats.total>1?"s":""}`} color={C.border}/>
          <Badge label={`${summaryStats.mattes} maté${summaryStats.mattes>1?"s":""}`} color={C.green}/>
          <Badge label={`${summaryStats.demattes} dématé${summaryStats.demattes>1?"s":""}`} color={C.red}/>
          <Badge label={`${summaryStats.sansAction} sans action`} color={C.muted}/>
          <Badge label={`${summaryStats.cycles} cycles`} color={C.blue}/>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>
            Filtre SN : {snFilter==="all"?"TRAVAIL = Tous":snScopeLabel({snScope:"custom",snIds:[snFilter]},snRows)}
          </span>
          {totalDeleted>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulés":"▼ Voir annulés"}
          </Btn>}
        </div>
      </div>

      {connectors.length===0&&(
        <div style={{textAlign:"center",color:C.muted,padding:48,fontSize:13}}>
          Cliquez <strong>+ Connecteur</strong> pour ajouter un connecteur (J13, J15…)
        </div>
      )}

      {connectors.length>0&&connectorGroups.map(group=>(
        <div key={group.id} style={{marginBottom:16}}>
          {group.label&&(
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"8px 0 7px"}}>
              <Badge label={group.label} color={C.blue}/>
              <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>
                {group.rows.length} connecteur{group.rows.length>1?"s":""}
              </span>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(156px,1fr))",
            gap:8}}>
          {group.rows.map(c=>{
            const st=connStatus(c);
            const cy=cycleCount(c);
            const ne=nextExpected(c);
            const editable=canEdit(c);
            const last=lastActive(c);
            return (
              <div key={c.id} role="group" aria-label={`Connecteur ${c.nConect||"sans nom"}`}
                style={{minHeight:124,border:`1px solid ${c.deleted?C.red:st.color}`,
                  background:c.deleted?"#da363318":st.color+"16",borderRadius:6,padding:6,
                  display:"flex",flexDirection:"column",
                  justifyContent:"space-between",boxShadow:c.validated&&!c.deleted?`0 0 0 1px ${st.color}22 inset`:undefined}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                  {!c.validated?(
                    <div onClick={e=>e.stopPropagation()} style={{width:62}}>
                      <Input value={c.nConect} onChange={v=>updC(c.id,"nConect",v.toUpperCase())}
                        placeholder="J13" small readOnly={!editable}
                        style={{fontWeight:900,fontSize:12,textTransform:"uppercase",padding:"2px 4px",...(!editable?LOCKED_INPUT_STYLE:{})}}/>
                    </div>
                  ):(
                    <div style={{fontFamily:"monospace",fontSize:16,fontWeight:900,color:C.text,lineHeight:1}}>
                      {c.nConect||"J?"}<CopyOriginMark origin={c.copyOrigin}/>
                    </div>
                  )}
                  <span style={{fontSize:10,fontFamily:"monospace",color:st.color,fontWeight:800}}>
                    {cy}
                  </span>
                </div>
                {c.connError&&<div style={{fontSize:9,color:C.yellow,fontFamily:"monospace"}}>{c.connError}</div>}
                {!c.validated&&<div onClick={e=>e.stopPropagation()} style={{pointerEvents:"all"}}>
                  <SnScopePicker row={c} header={header} onChange={fields=>patchC(c.id,fields)} disabled={!!c.validated||!editable}/>
                </div>}
                <div>
                  <div style={{fontSize:9,color:st.color,fontWeight:800,textTransform:"uppercase",letterSpacing:.2}}>
                    {st.label.replace("⚡ ","").replace("✓ ","")}
                  </div>
                  <div style={{fontSize:8,color:C.muted,fontFamily:"monospace",marginTop:1}}>
                    {last?`${last.visa||"?"} · ${last.dt||""}`:"aucune action"}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:4}}>
                  {["Mating","Demating"].map(action=><ConnectorActionButton key={action} action={action} connector={c.nConect||"Connecteur"}
                    disabled={!canRecordMating(user,c)||(ne!=="either"&&ne!==action)}
                    title={!c.validated?"Valider le connecteur avant action":!canRecordMating(user,c)?"Action non autorisée":ne!=="either"&&ne!==action?`${action} déjà enregistré`:`Enregistrer ${action} sur ${c.nConect||"ce connecteur"}`}
                    onClick={()=>requestEventFromTile(c,action)}/>)}
                </div>
                <div onClick={e=>e.stopPropagation()}
                  style={{display:"flex",gap:2,alignItems:"center",justifyContent:"flex-end",marginTop:4,pointerEvents:"all",flexWrap:"wrap"}}>
                  <CommentBtn comments={c.comments||[]} onChange={v=>updC(c.id,"comments",v)} user={user} disabled={!perms.canComment}/>
                  {!c.deleted&&perms.canWrite&&onCopyAcross&&<MiniIconBtn onClick={()=>onCopyAcross(c)} color={C.blue} title="Copier vers OF / SN">⧉</MiniIconBtn>}
                  {!c.deleted&&!c.validated&&editable&&<>
                    <MiniIconBtn onClick={()=>validateConn(c.id)} color={C.green} title="Valider">✓</MiniIconBtn>
                    <HistoryBtn row={c} mini/>
                    <MiniIconBtn onClick={()=>delConn(c.id)} color={C.border} title="Supprimer">×</MiniIconBtn>
                  </>}
                  {!c.deleted&&c.validated&&editable&&<>
                    <MiniIconBtn onClick={()=>unlockConn(c.id)} color={C.yellow} title="Modifier">✎</MiniIconBtn>
                    <HistoryBtn row={c} mini/>
                    <MiniIconBtn onClick={()=>delConn(c.id)} color={C.red} title="Annuler">×</MiniIconBtn>
                  </>}
                  {!c.deleted&&!editable&&perms.canWrite&&<>
                    <HistoryBtn row={c} mini/>
                  </>}
                  {c.deleted&&<PurgeLineButton user={user} data={data} onChange={onChange} id={c.id}/> }
                  {c.deleted&&editable&&<MiniIconBtn onClick={()=>setRestoreConnTarget(c.id)} color={C.yellow} title="Réactiver">↩</MiniIconBtn>}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ))}

      {connectors.length>0&&(
        <div style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginBottom:16}}>
          <div style={{background:C.raised,padding:"8px 12px",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
            <div>
              <div style={{color:C.accent,fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:.8}}>Cycles Mating/Demating</div>
              <div style={{color:C.muted,fontSize:10}}>Une ligne par cycle, triée par connecteur</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>Connecteur</span>
              <select value={historyConnector} onChange={e=>setHistoryConnector(e.target.value)}
                style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                  color:C.text,padding:"4px 8px",fontSize:11,fontFamily:"monospace",outline:"none",minWidth:120}}>
                <option value="all">Tous</option>
                {visibleConnectors.map(c=><option key={c.id} value={c.id}>{c.nConect||"J?"}</option>)}
              </select>
            </div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",fontSize:12}}>
              <thead>
                <tr>
                  <TH w={88}>Connecteur</TH><TH w={94}>État actuel</TH><TH w={48}>Cycle</TH>
                  <TH w={122}>Mating date</TH><TH w={52} color={C.accent}>Visa M</TH>
                  <TH w={122}>Demating date</TH><TH w={52} color={C.accent}>Visa D</TH>
                  <TH w={78}>N° SN</TH><TH w={42}>💬</TH><TH w={112}>Actions</TH>
                </tr>
              </thead>
              <tbody>
                {cycleGroups.flatMap(({c,status,last,cycles},gi)=>{
                  const tone=connectorStateTone(last?.action);
                  return [
                  <tr key={`${c.id}_group`} style={{background:last?.action==="Mating"?C.green+"1f":last?.action==="Demating"?C.red+"1f":C.blue+"12",borderLeft:`3px solid ${tone.stroke}`}}>
                    <td colSpan={10} style={{padding:"7px 10px",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontFamily:"monospace",fontSize:13,fontWeight:900,color:C.text}}>{c.nConect||"J?"}</span>
                        <Badge label={status.label.replace("⚡ ","").replace("✓ ","")} color={status.color}/>
                        <span style={{fontFamily:"monospace",fontSize:10,color:C.muted}}>
                          Dernière action : {last?.action||"aucune"} {last?.dt||""} {last?.visa||""}
                        </span>
                        <span style={{fontFamily:"monospace",fontSize:10,color:C.blue}}>
                          {snScopeLabel(c,snRowsFromHeader(header))}
                        </span>
                        <CommentBtn comments={c.comments||[]} onChange={v=>updC(c.id,"comments",v)} user={user} disabled={!perms.canComment}/>
                      </div>
                    </td>
                  </tr>,
                  ...cycles.map(({idx,mat,dem,empty},i)=>(
                    <tr key={`${c.id}_${idx||"empty"}_${i}`} style={{background:(gi+i)%2===0?"transparent":C.stripe}}>
                      <TD></TD>
                      <TD></TD>
                      <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{empty?"—":idx}</span></TD>
                      <TD><OperationDateCell value={mat?.dt} editing={!!mat&&!!c.editBase&&canEdit(c)&&!mat.deleted} onChange={value=>updEvDate(c.id,mat.id,value)}/></TD>
                      <TD><span style={{fontFamily:"monospace",fontWeight:800,fontSize:12,color:mat?C.accent:C.muted}}>{mat?.visa||"—"}</span></TD>
                      <TD><OperationDateCell value={dem?.dt} editing={!!dem&&!!c.editBase&&canEdit(c)&&!dem.deleted} onChange={value=>updEvDate(c.id,dem.id,value)}/></TD>
                      <TD><span style={{fontFamily:"monospace",fontWeight:800,fontSize:12,color:dem?C.accent:C.muted}}>{dem?.visa||"—"}</span></TD>
                      <TD></TD>
                      <TD></TD>
                      <TD center style={{pointerEvents:"all"}}>
                        {canEdit(c)&&<ActionGroup>
                          {mat&&<button onClick={()=>setDeleteEvTarget({cid:c.id,eid:mat.id})}
                            title="Annuler l'action Mating"
                            style={{background:C.green+"22",border:`1px solid ${C.green}`,borderRadius:4,
                              color:C.green,fontSize:9,padding:"2px 5px",cursor:"pointer",fontWeight:800,whiteSpace:"nowrap"}}>
                            Annuler M
                          </button>}
                          {dem&&<button onClick={()=>setDeleteEvTarget({cid:c.id,eid:dem.id})}
                            title="Annuler l'action Demating"
                            style={{background:C.blue+"22",border:`1px solid ${C.blue}`,borderRadius:4,
                              color:C.blue,fontSize:9,padding:"2px 5px",cursor:"pointer",fontWeight:800,whiteSpace:"nowrap"}}>
                            Annuler D
                          </button>}
                        </ActionGroup>}
                      </TD>
                    </tr>
                  ))
                ]})}
              </tbody>
            </table>
            {cycleGroups.length===0&&<div style={{textAlign:"center",color:C.muted,padding:14,fontSize:12}}>Aucun connecteur actif</div>}
          </div>
        </div>
      )}

      {deleteEvTarget  &&<DeleteModal godMode={perms.godMode} onConfirm={confirmDelEv}   onCancel={()=>setDeleteEvTarget(null)}/>}
      {deleteConnTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDelConn} onCancel={()=>setDeleteConnTarget(null)}/>}
      {restoreEvTarget  &&<RestoreModal onConfirm={restoreEv}   onCancel={()=>setRestoreEvTarget(null)}/>}
      {restoreConnTarget&&<RestoreModal onConfirm={restoreC} onCancel={()=>setRestoreConnTarget(null)}/>}
    </div>
  );
};
// ─── 9. Open Work ──────────────────────────────────────────────────────────
const OPENWORK_EDIT_FIELDS = [
  {key:"createdDT",label:"Date de l'opération"},
  {key:"snScope",label:"Mode SN"},
  {key:"snIds",label:"N° SN"},
  {key:"nOW",label:"N° OW"},
  {key:"description",label:"Description"},
  {key:"openVisa",label:"Visa ouverture"},
  {key:"openDate",label:"Date ouverture"},
  {key:"closedVisa",label:"Visa clôture"},
  {key:"closedDate",label:"Date clôture"},
  {key:"commentaires",label:"Commentaires"},
];

const TabOpenWork = ({data,onChange,user,perms={},header,forceShowDeleted=false,onCopyAcross}) => {
  const rows=data.rows||[];
  const canEdit = row => canEditLine(user,row);
  const add=()=>{ if(!perms.canWrite) return; onChange({rows:[...rows,{id:uid(),...defaultSnScope(header),createdVisa:user.trigram,createdDT:nowDT(),nOW:String(rows.length+1).padStart(3,"0"),description:"",openVisa:user.trigram,openDate:now(),closedVisa:"",closedDate:"",commentaires:""}]}); };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const snFilter=workSnFilter(header);
  const upd=(id,f,v)=>{ const r=rows.find(x=>x.id===id); if(f==="comments" ? !perms.canComment : !canEdit(r)) return; onChange({rows:scopedRowsPatch(rows,id,header,{[f]:v})}); };
  const patchRow=(id,fields)=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const dup=id=>{ const r=rows.find(x=>x.id===id); if(!r||!perms.canWrite) return; if(onCopyAcross&&!r.deleted){onCopyAcross(r);return;} onChange({rows:[...rows,duplicateRow(r,user,{
    nOW:String(rows.length+1).padStart(3,"0"),openVisa:user.trigram,openDate:now(),closedVisa:"",closedDate:""
  })]}); };
  const del=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r.validated&&!r.editBase&&!r.closedDate&&!r.closedVisa) onChange({rows:rows.filter(x=>x.id!==id)});
    else if(!r.validated) onChange({rows:scopedRowsDelete(rows,id,header,{deleted:true,deletedReason:"",deletedVisa:user.trigram,deletedDate:nowDT()})});
    else setDeleteTarget(id);
  };
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ const r=rows.find(x=>x.id===deleteTarget); if(canEdit(r)) onChange({rows:scopedRowsDelete(rows,deleteTarget,header,{deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()})}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  const REQUIRED = [
    {key:"description", label:"Description"},
    {key:"openVisa",    label:"Visa"},
  ];
  const validateRow=id=>{ const r=rows.find(x=>x.id===id); if(!canEdit(r)) return; const miss=checkRequired(r,REQUIRED); if(miss.length) { upd(id,"validError","Champs requis : "+miss.join(", ")); } else { onChange({rows:scopedRowsPatch(rows,id,header,x=>withEditHistory(x,user,OPENWORK_EDIT_FIELDS))}); } };
  const unlockRow=id=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:rows.map(r=>r.id===id?{...r,validated:false,_scopeEditConfirmed:false,editBase:snapshotFields(r,OPENWORK_EDIT_FIELDS)}:r)}); };
  const close=id=>{ const row=rows.find(x=>x.id===id); if(canEdit(row)) onChange({rows:scopedRowsPatch(rows,id,header,r=>withEditHistory({...r,closedVisa:user.trigram,closedDate:now(),editBase:r.editBase||snapshotFields(r,OPENWORK_EDIT_FIELDS)},user,OPENWORK_EDIT_FIELDS))}); };
  const reopen=id=>{ const row=rows.find(x=>x.id===id); if(canEdit(row)) onChange({rows:scopedRowsPatch(rows,id,header,r=>withEditHistory({...r,closedVisa:"",closedDate:"",editBase:r.editBase||snapshotFields(r,OPENWORK_EDIT_FIELDS)},user,OPENWORK_EDIT_FIELDS))}); };
  const isClosed=r=>!!r.closedDate;
  const activeRows=effectiveScopedRows({header,openwork:{rows}},"openwork").filter(r=>rowMatchesSnFilter(r,snFilter,header));
  const open=activeRows.filter(r=>!isClosed(r)).length;
  const closed=activeRows.filter(isClosed).length;
  const visibleRows=sortByNewestOperation(rows,r=>r.openDate||r.createdDT).filter(r=>
    (!r.deleted||showDeleted||forceShowDeleted) && rowMatchesSnFilter(r,snFilter,header)
  );
  return (
    <div style={{maxWidth:1450}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {perms.canWrite&&<Btn onClick={add} small>+ Open Work</Btn>}
          <Badge label={`${open} OPEN`}                          color={C.yellow}/>
          <Badge label={`${closed} CLÔTURÉ${closed>1?"S":""}`}  color={C.green}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>Filtre SN : {snFilter==="all"?"TRAVAIL = Tous":snScopeLabel({snScope:"custom",snIds:[snFilter]},snRowsFromHeader(header))}</span>
          {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
          </Btn>}
        </div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
        <thead>
          <tr>
            <TH w={118}>Date / Heure</TH><TH w={46} color={C.accent}>Visa</TH>
            <TH w={78}>N° SN</TH>
            <TH w={52}>N° OW</TH>
            <TH>Description</TH>
            <TH w={76}>Visa clôt.</TH>
            <TH w={104}>Date clôt.</TH>
            <TH>Commentaires</TH>
            <TH w={104}>Action</TH>
            <TH w={104}></TH>
          </tr>
        </thead>
        <tbody>
          {visibleRows.flatMap((r,i)=>{
            const editable = canEdit(r);
            const locked = !!r.validated || !editable;
            return [
            <tr key={r.id} style={{background:r.deleted?"#da363318":isClosed(r)?"#23863612":i%2===0?"transparent":C.stripe,
              textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:isClosed(r)?.8:1,
              pointerEvents:r.deleted?"none":undefined,
              borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
              <TD><OperationDateCell value={r.createdDT} editing={!!r.editBase&&editable&&!r.deleted} onChange={value=>upd(r.id,"createdDT",value)}/></TD>
              <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span><CopyOriginMark origin={r.copyOrigin}/></TD>
              <TD style={{pointerEvents:r.deleted?"none":"all"}}><SnScopePicker row={r} header={header} onChange={fields=>patchRow(r.id,fields)} disabled={locked}/></TD>
              <TD center><Badge label={r.nOW} color={isClosed(r)?C.green:C.yellow}/></TD>
              <TD><Input value={r.description} onChange={v=>upd(r.id,"description",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/></TD>
              <TD>
                <Input value={r.closedVisa} onChange={v=>upd(r.id,"closedVisa",v)} small readOnly={!editable}
                  style={{...(!editable?LOCKED_INPUT_STYLE:{}),background:isClosed(r)?"#23863620":undefined}}/>
              </TD>
              <TD>
                {/* Champ date clôture — auto-rempli par le bouton, modifiable manuellement */}
                <Input value={r.closedDate} onChange={v=>upd(r.id,"closedDate",v)} small readOnly={!editable}
                  placeholder="—"
                  style={{...(!editable?LOCKED_INPUT_STYLE:{}),background:isClosed(r)?"#23863620":undefined,color:isClosed(r)?C.green:undefined,fontWeight:isClosed(r)?700:400}}/>
              </TD>
              <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user} disabled={!perms.canComment}/></TD>
              <TD center>
                {editable&&<ActionGroup>
                  <button onClick={()=>isClosed(r)?reopen(r.id):close(r.id)}
                    title={isClosed(r)?"Réouvrir cet Open Work":"Clore cet Open Work"}
                    style={{background:(isClosed(r)?C.yellow:C.green)+"22",border:`1px solid ${isClosed(r)?C.yellow:C.green}`,
                      borderRadius:3,color:isClosed(r)?C.yellow:C.green,fontSize:9,padding:"2px 7px",
                      cursor:"pointer",fontWeight:800,whiteSpace:"nowrap"}}>
                    {isClosed(r)?"Ouvrir":"Clore"}
                  </button>
                  <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                  <HistoryBtn row={r}/>
                </ActionGroup>}
                {!editable&&perms.canWrite&&(
                  <ActionGroup>
                    <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                    <HistoryBtn row={r}/>
                  </ActionGroup>
                )}
              </TD>
              <TD center style={{pointerEvents:"all"}}>
                {!r.deleted&&!r.validated&&editable&&(
                  <ActionGroup>
                    <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                    <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                    <HistoryBtn row={r}/>
                    <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                  </ActionGroup>
                )}
                {!r.deleted&&r.validated&&editable&&(
                  <ActionGroup>
                    <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                    <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                    <HistoryBtn row={r}/>
                    <IconBtn onClick={()=>del(r.id)} color={C.red} title="Annuler">×</IconBtn>
                  </ActionGroup>
                )}
              </TD>
            </tr>,
            r.validError&&!r.validated&&(
              <tr key={r.id+"_err"}>
                <td colSpan={99} style={{padding:"3px 10px 5px",background:"#da363315",borderBottom:"1px solid #da363340"}}>
                  <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace"}}>⚠ {r.validError}</span>
                </td>
              </tr>
            ),
              <HistoryTrail key={r.id+"_hist"} row={r} open={forceShowDeleted}/>,
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",
                    borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
                      <PurgeLineButton user={user} data={data} onChange={onChange} id={r.id}/>
                      <span onClick={e=>{e.stopPropagation();setRestoreTarget(r.id);}}
                        style={{color:"#d29922",fontSize:11,cursor:"pointer",fontWeight:700,
                          pointerEvents:"all",textDecoration:"none",marginLeft:16,flexShrink:0}}>
                        ↩ Réactiver
                      </span>
                    </div>
                  </td>
                </tr>
              )
            ];
          })}
        </tbody>
      </table>
      {rows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Aucun open work</div>}
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>
        Le bouton "✓ Clôturer" remplit automatiquement la date du jour — × annule et barre la ligne
      </div>
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

// @include modules/auth.jsx

// ─── ACCUEIL : vue tableur + favs par user ──────────────────────────────────
const homeRowsForOf = (entry,data) => {
  const units=withUnitMetadata(data||{header:entry}).units.rows.filter(u=>!u.deleted&&(cleanSn(u.sn)||cleanSn(u.lot)));
  return units.length?units.map(u=>({...entry,sn:u.sn||"",lot:u.lot||entry.lot||"",snProduitFini:u.snProduitFini||"",unitStatus:u.status||"en_cours",_homeUnitId:u.id,_homeUnitKind:u.unitKind||((u.lot||entry.lot)?"lot":"sn"),_homeSnCount:units.length,_homeQty:trackedLotQty(u)})):[{...entry,sn:"",lot:"",snProduitFini:"",_homeUnitKind:"sn",_homeQty:""}];
};
const SORT_OPTS=[
  {id:"fav",  label:"⭐ Favoris d'abord"},
  {id:"opens",label:"Derniers ouverts"},
  {id:"of",   label:"N° OF"},
  {id:"projet",label:"OTP"},
];

const parseSnList = text => [...new Set(String(text||"").split(/\r?\n|;|,/).map(cleanSn).filter(Boolean))];
const cleanImportArticle = v => String(v||"").replace(/\s+/g,"").trim();
const cleanImportQty = v => {
  const s=String(v||"").trim();
  if(!s || s==="-" || /^n\/?a$/i.test(s)) return "";
  return s.replace(",",".");
};
const isDashCell = v => /^:?-{2,}:?$/.test(String(v||"").trim());
const splitImportLine = line => {
  const txt=String(line||"").trim();
  if(!txt) return [];
  if(txt.includes("|")){
    return txt.split("|").map(v=>v.trim()).filter((v,i,a)=>v || (i>0&&i<a.length-1));
  }
  if(txt.includes("\t")) return txt.split("\t").map(v=>v.trim());
  if(txt.includes(";")) return txt.split(";").map(v=>v.trim());
  const cells=[]; let cur="", quoted=false;
  for(let i=0;i<txt.length;i++){
    const c=txt[i], next=txt[i+1];
    if(c==='"'&&next==='"'){cur+='"';i++;continue;}
    if(c==='"'){quoted=!quoted;continue;}
    if(c===","&&!quoted){cells.push(cur.trim());cur="";continue;}
    cur+=c;
  }
  cells.push(cur.trim());
  return cells;
};
const parseImportSnLot = (snLot, qty) => {
  const raw=String(snLot||"").trim();
  const value=cleanSn(raw);
  if(!value || value==="-") return null;
  const qtyNumber=Number(String(qty??"").replace(",","."));
  const explicitLot=/^(?:N\/?A|NA|-|LOT[\s_-]?\w+)/i.test(value);
  const isSn = value.startsWith("#") || /^SN[\s_-]?\w+/i.test(value) || (!explicitLot&&qtyNumber===1);
  return {
    sn:isSn?value:"",
    lot:isSn?"":value,
    qteInitiale:cleanImportQty(qty),
    unitKind:isSn ? "sn" : "lot",
  };
};
const importUnitKey = item => `${item?.unitKind||""}|${cleanSn(item?.sn)}|${cleanSn(item?.lot)}`;
const parseOfImportPaste = text => {
  const groups=new Map();
  parseImportRows(text).forEach(cells=>{
    if(cells.length<6 || !cells.some(Boolean)) return;
    if(cells.every(c=>!String(c||"").trim() || isDashCell(c))) return;
    const lower=cells.map(c=>String(c||"").toLowerCase());
    if(lower.some(c=>c.includes("projet")) && lower.some(c=>c.includes("of"))) return;
    const hasQtyCols=cells.length>=8;
    const [qtyRaw,projet,articleNo,articleSap,description,snLot,ofRaw,repriseRaw] = hasQtyCols
      ? cells
      : ["",...cells,""];
    const of=String(ofRaw||"").trim();
    if(!of) return;
    const key=of.toUpperCase();
    const item=parseImportSnLot(snLot, qtyRaw);
    const isReprise=/x/i.test(String(repriseRaw||""));
    if(!groups.has(key)){
      groups.set(key,{
        of,
        projet:String(projet||"").trim(),
        articleNo:String(articleNo||"").trim(),
        codeArticle:cleanImportArticle(articleSap||articleNo),
        description:String(description||"").trim(),
        ofRework:isReprise?"oui":"non",
        typeOF:isReprise?"reprise":"production",
        items:[],
        duplicateItems:0,
      });
    }
    const g=groups.get(key);
    if(!g.projet) g.projet=String(projet||"").trim();
    if(!g.articleNo) g.articleNo=String(articleNo||"").trim();
    if(!g.codeArticle) g.codeArticle=cleanImportArticle(articleSap||articleNo);
    if(!g.description) g.description=String(description||"").trim();
    if(isReprise){g.ofRework="oui";g.typeOF="reprise";}
    if(item){
      const itemKey=importUnitKey(item);
      const existing=g.items.find(x=>importUnitKey(x)===itemKey);
      if(existing){
        g.duplicateItems++;
        if(!existing.qteInitiale && item.qteInitiale) existing.qteInitiale=item.qteInitiale;
      }else{
        g.items.push(item);
      }
    }
  });
  return [...groups.values()];
};
const ofWarnings = (data,consommables=[]) => {
  const messages=[];
  const rows=effectiveScopedRows(data,"rework");
  const checks=computeReworkWarnings(rows,data?.units?.rows||data?.header?._snRows||[]);
  if(checks.sequence.length) messages.push("Actions soudage/dessoudage consécutives incohérentes");
  if(checks.mismatch.length||checks.first.length) messages.push("Dessoudage / cohérence valeur à vérifier");
  if(checks.pointed.length) messages.push("Composants pointés non soudés");
  if(computeOpenDesoudes(rows).length) messages.push("Composants dessoudés à surveiller");
  if(computeMissingReworkControls(rows).length) messages.push("Contrôles manquants");
  if(rows.some(r=>["S","P","M"].includes(r.action1)&&dcCheck(r.dc,r.createdDT)?.ok===false)) messages.push("DC non conforme / article hors date");
  if(rows.some(r=>missingReworkTrace(r,true).length>0)) messages.push("Traçabilité à compléter (LOT/DC)");
  const consoRows=(data?.consommables?.ops||[]).filter(o=>!o.deleted).flatMap(o=>(o.items||[]).filter(it=>!it.deleted).map(it=>({it,status:dpStatus(it.dp,it.createdDT||o.createdDT)})));
  if(consoRows.some(({it})=>it.dp&&!isValidDMY(it.dp))) messages.push("Date de péremption consommable invalide");
  if(consoRows.some(({status})=>status?.label==="PÉRIMÉ")) messages.push("Consommable périmé à la date d'utilisation");
  if(consoRows.some(({status})=>status?.label==="BIENTÔT")) messages.push("Consommable bientôt périmé à la date d'utilisation");
  const consoById=Object.fromEntries(consommables.map(item=>[item.id,item]));
  const pendingPolymerizations=(data?.consommables?.ops||[])
    .filter(o=>!o.deleted&&o.validated)
    .flatMap(o=>(o.items||[])
      .filter(it=>!it.deleted&&it.validated)
      .map(it=>polymerizationStatus(consoById[it.consoId],it.createdDT||o.createdDT))
      .filter(status=>status&&!status.done));
  if(pendingPolymerizations.length){
    const readyAt=pendingPolymerizations.reduce((latest,status)=>!latest||status.readyAt>latest?status.readyAt:latest,null);
    messages.push(`Polymérisation en cours — sous vide dès le ${formatAvailabilityDT(readyAt)}`);
  }
  if(effectiveScopedRows(data,"testequip").some(r=>calibStatus(r.dateExpiration)?.color===C.red)) messages.push("Équipement hors calibration");
  if(effectiveScopedRows(data,"faits").some(r=>!r.closedDate)) messages.push("Fait technique ouvert");
  if(effectiveScopedRows(data,"openwork").some(r=>!r.closedDate)) messages.push("Open Work ouvert");
  if(nextEtuvageInfo(effectiveEtuvageRows(data)).overdue) messages.push("Étuvage à renouveler");
  if(data?.header?.status==="bloque") messages.push("OF bloqué");
  return messages;
};
const FinishedProductSn = ({of,user,onSave}) => {
  const [draft,setDraft]=useState(of.snProduitFini||"");
  useEffect(()=>{setDraft(of.snProduitFini||"");},[of.snProduitFini]);
  const commit=async()=>{
    const value=draft.trim();
    if(value===(of.snProduitFini||"")||!isAdminManager(user)) return;
    try{await onSave(of.id,of._homeUnitId,value);}catch(e){window.alert(`Enregistrement impossible : ${e?.message||e}`);setDraft(of.snProduitFini||"");}
  };
  if(!isAdminManager(user)||!of._homeUnitId) return <span style={{fontFamily:"monospace",color:C.text}}>{of.snProduitFini||"—"}</span>;
  return <input aria-label={`SN produit fini de ${of.sn||of.lot} - OF ${of.of}`} title="SN du produit final dans lequel cette pièce est montée"
    value={draft} onClick={e=>e.stopPropagation()} onChange={e=>setDraft(e.target.value)} onBlur={commit}
    onKeyDown={e=>{if(e.key==="Enter") e.currentTarget.blur();if(e.key==="Escape") setDraft(of.snProduitFini||"");}}
    style={{width:"100%",minWidth:100,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"5px 7px",fontSize:12,fontFamily:"monospace"}}/>;
};
const homeWorkedFilter = (rows,workedIds,onlyWorked,searchActive) => {
  const worked=new Set(workedIds);
  const active=onlyWorked&&!searchActive&&rows.some(row=>worked.has(row.id));
  return {active,rows:active?rows.filter(row=>worked.has(row.id)):rows};
};
const homeRowKey = row => `${row.id}:${row._homeUnitId||"of"}`;
const homeUnitName = row => row.sn||row.lot||"Sans SN / LOT";
const homeOtpName = row => String(row.otp||row.projet||"Non renseigné").trim()||"Non renseigné";
const hasSingleMeetingOtp = rows => new Set(rows.map(homeOtpName)).size===1;
const groupHomeMailRows = rows => {
  const groups=new Map();
  rows.forEach(row=>{
    if(!groups.has(row.id)) groups.set(row.id,{id:row.id,of:row.of||"Non renseigné",otp:row.otp||row.projet||"",codeArticle:compactArticleCode(row.codeArticle||row.articleNo)||"",description:row.description||"",rows:[]});
    const group=groups.get(row.id);
    if(!group.rows.some(item=>homeRowKey(item)===homeRowKey(row))) group.rows.push(row);
  });
  return [...groups.values()];
};
const homeMailSummary = groups => groups.flatMap(group=>[
  `OF ${group.of}${group.otp?` | OTP ${group.otp}`:""}`,
  `Article : ${group.codeArticle||"Non renseigné"}${group.description?` - ${group.description}`:""}`,
  ...group.rows.map(row=>`- ${row.sn||(row.lot?`LOT ${row.lot}`:"Sans SN / LOT")}`),
  ""
]);
const compactOfRanges = values => {
  const unique=[...new Set(values.map(value=>String(value||"").trim()).filter(Boolean))];
  const numeric=unique.filter(value=>/^\d+$/.test(value)).sort((a,b)=>Number(a)-Number(b));
  const other=unique.filter(value=>!/^\d+$/.test(value));
  const ranges=[];
  for(let index=0;index<numeric.length;){
    let end=index;
    while(end+1<numeric.length&&Number(numeric[end+1])===Number(numeric[end])+1) end++;
    ranges.push(end>index?`${numeric[index]}-${numeric[end]}`:numeric[index]);
    index=end+1;
  }
  return [...ranges,...other].join("; ");
};
const closureFactLabel = fact => fact.numero||fact.commentaires||"Fait";
const closureMailTable = groups => {
  const rows=groups.flatMap(group=>group.rows.map(row=>({
    ...row,
    _mailOf:group.of,
    _mailArticle:group.codeArticle||"-",
    _mailDescription:group.description||"-"
  })));
  rows.sort((a,b)=>a._mailArticle.localeCompare(b._mailArticle,undefined,{numeric:true,sensitivity:"base"})
    ||a._mailOf.localeCompare(b._mailOf,undefined,{numeric:true,sensitivity:"base"}));
  const lines=[];
  let previousArticle="";
  rows.forEach(row=>{
    if(previousArticle&&previousArticle!==row._mailArticle) lines.push("");
    const isLot=row._homeUnitKind==="lot";
    const quantity=isLot&&String(row._homeQty||"").trim()?`${row._homeQty}x`:"";
    const facts=(row._homeFacts||[]).map(closureFactLabel).filter(Boolean);
    const columns=[
      row._mailOf,
      row._mailArticle,
      row._mailDescription,
      `${isLot?"LOT":"SN"} : ${homeUnitName(row)}`
    ];
    if(String(row.snProduitFini||"").trim()) columns.push(`SN produit fini : ${String(row.snProduitFini).trim()}`);
    if(quantity) columns.push(quantity);
    if(facts.length) columns.push(`Faits : ${facts.join(" ; ")}`);
    lines.push(columns.join(" | "));
    previousArticle=row._mailArticle;
  });
  return [...lines,""];
};
const buildClosureRequest = ({rows,user}) => {
  const groups=groupHomeMailRows(rows);
  const otps=[...new Set(groups.map(group=>group.otp).filter(Boolean))];
  const intro="Merci de clôturer et mettre en stock les sous-ensembles suivants :";
  return {
    subject:`Clôture | OF ${compactOfRanges(groups.map(group=>group.of))}${otps.length?` | OTP ${otps.join("; ")}`:""}`,
    body:["Bonjour,","",intro,"",...closureMailTable(groups),"Merci,",[user.prenom,user.nom].filter(Boolean).join(" ")||user.trigram,user.trigram].join("\n")
  };
};
const buildIpInvitation = ({rows,user,ipName}) => {
  const groups=groupHomeMailRows(rows);
  const otps=[...new Set(groups.map(group=>group.otp||"Non renseigné"))];
  const articles=[...new Set(groups.map(group=>`${group.codeArticle||"Non renseigné"}${group.description?` - ${group.description}`:""}`))];
  const units=[...new Set(rows.map(homeUnitName))];
  const finishedUnits=[...new Set(rows.map(row=>String(row.snProduitFini||"").trim()).filter(Boolean))];
  const name=String(ipName||"").trim()||"IP";
  const intro=`Voici le résumé des sous-ensembles prévus pour l’inspection ${name} :`;
  const subjectParts=[name,articles.join(" / "),units.join(", "),`OTP ${otps.join(" / ")}`];
  if(finishedUnits.length) subjectParts.push(`SN produit fini ${finishedUnits.join(", ")}`);
  return {
    subject:subjectParts.join(" | "),
    body:["Bonjour,","",intro,"",...closureMailTable(groups),"Merci,",[user.prenom,user.nom].filter(Boolean).join(" ")||user.trigram,user.trigram].join("\n")
  };
};
const defaultMeetingSlot = () => {
  const date=new Date();
  date.setSeconds(0,0);
  date.setMinutes(date.getMinutes()<30?30:0);
  if(date.getMinutes()===0) date.setHours(date.getHours()+1);
  const pad=value=>String(value).padStart(2,"0");
  return {date:`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`,time:`${pad(date.getHours())}:${pad(date.getMinutes())}`};
};
const parseMeetingRecipients = value => [...new Set(String(value||"").split(/[;,\s]+/).map(item=>item.trim()).filter(item=>/^\S+@\S+\.\S+$/.test(item)))];
const escapeIcsText = value => String(value||"").replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;");
const formatIcsLocal = date => {
  const pad=value=>String(value).padStart(2,"0");
  return `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
};
const buildOutlookMeetingIcs = ({subject,body,date,time,duration=60,location="",recipients=[],requiredRecipients=recipients,optionalRecipients=[],organizer={}}) => {
  const matchDate=String(date||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const matchTime=String(time||"").match(/^(\d{2}):(\d{2})$/);
  if(!matchDate||!matchTime) throw new Error("Date ou heure de réunion invalide");
  const start=new Date(+matchDate[1],+matchDate[2]-1,+matchDate[3],+matchTime[1],+matchTime[2]);
  const end=new Date(start.getTime()+Math.max(15,Number(duration)||60)*60000);
  const stamp=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
  const organizerName=[organizer.prenom,organizer.nom].filter(Boolean).join(" ")||organizer.trigram||"SP-F001A";
  const lines=[
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Safran Timing Technologies SA//SP-F001A//FR","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    "BEGIN:VEVENT",`UID:${Date.now()}-${uid()}@sp-f001a`,`DTSTAMP:${stamp}`,
    `DTSTART:${formatIcsLocal(start)}`,`DTEND:${formatIcsLocal(end)}`,
    `SUMMARY:${escapeIcsText(subject)}`,`DESCRIPTION:${escapeIcsText(body)}`,
    "CATEGORIES:IP","COLOR:#FFD966","X-APPLE-CALENDAR-COLOR:#FFD966",
    "STATUS:CONFIRMED","TRANSP:OPAQUE","X-MICROSOFT-CDO-BUSYSTATUS:BUSY"
  ];
  if(String(location||"").trim()) lines.push(`LOCATION:${escapeIcsText(String(location).trim())}`);
  if(organizer.email) lines.push(`ORGANIZER;CN=${escapeIcsText(organizerName)}:mailto:${organizer.email}`);
  requiredRecipients.forEach(email=>lines.push(`ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${email}`));
  optionalRecipients.forEach(email=>lines.push(`ATTENDEE;ROLE=OPT-PARTICIPANT;RSVP=TRUE:mailto:${email}`));
  lines.push("END:VEVENT","END:VCALENDAR","");
  return lines.join("\r\n");
};
const downloadOutlookMeeting = ({draft,date,time,duration,location,requiredRecipients,optionalRecipients,user}) => {
  const content=buildOutlookMeetingIcs({subject:draft.subject,body:draft.body,date,time,duration,location,requiredRecipients,optionalRecipients,organizer:user});
  const blob=new Blob([content],{type:"text/calendar;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=`Invitation-IP-${String(draft.subject||"reunion").replace(/[^a-z0-9_-]+/gi,"-").replace(/^-|-$/g,"").slice(0,80)}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};
const HomeMailModal = ({kind,rows,user,onClose,onMarkForClosure}) => {
  const isIp=kind==="ip";
  const [ipName,setIpName]=useState("");
  const [recipient,setRecipient]=useState(isIp?"":"logistique.ch@safran-timing.safrangroup.com");
  const [meetingSlot]=useState(defaultMeetingSlot);
  const [meetingDate,setMeetingDate]=useState(meetingSlot.date);
  const [meetingTime,setMeetingTime]=useState(meetingSlot.time);
  const [meetingDuration,setMeetingDuration]=useState("60");
  const [meetingRoom,setMeetingRoom]=useState("");
  const [meetingPlace,setMeetingPlace]=useState("");
  const [copyTo,setCopyTo]=useState([]);
  const [inviteProjectTo,setInviteProjectTo]=useState([]);
  const [inviteAssuranceTo,setInviteAssuranceTo]=useState([]);
  const [inviteCc,setInviteCc]=useState([]);
  const {managers,error:ccError}=useCcManagers(!isIp);
  const {accounts:inviteAccounts,error:inviteAccountsError}=useUserAccounts(isIp);
  const assuranceAccounts=inviteAccounts.filter(isProductAssuranceAccount);
  const projectAccounts=inviteAccounts.filter(account=>account.trigram!==user.trigram&&isProjectLeadAccount(account));
  const invitationCcAccounts=inviteAccounts.filter(account=>account.trigram!==user.trigram&&normalizeRole(account)==="Manager");
  const ccEmails=selectedManagerEmails(managers,copyTo);
  const projectMeetingEmails=selectedManagerEmails(projectAccounts,inviteProjectTo);
  const assuranceMeetingEmails=selectedManagerEmails(assuranceAccounts,inviteAssuranceTo);
  const requiredMeetingEmails=[...new Set([...projectMeetingEmails,...assuranceMeetingEmails])];
  const optionalMeetingEmails=selectedManagerEmails(invitationCcAccounts,inviteCc).filter(email=>!requiredMeetingEmails.includes(email));
  const makeDraft=()=>isIp?buildIpInvitation({rows,user,ipName}):buildClosureRequest({rows,user});
  const [draft,setDraft]=useState(makeDraft);
  const [message,setMessage]=useState("");
  const [markForClosure,setMarkForClosure]=useState(!isIp);
  const [sending,setSending]=useState(false);
  useEffect(()=>{if(isIp)setDraft(buildIpInvitation({rows,user,ipName}));},[ipName]);
  const color=isIp?C.yellow:C.green;
  const copy=async()=>{
    const text=`Objet : ${draft.subject}\n\n${draft.body}`;
    try{await navigator.clipboard.writeText(text);setMessage("Brouillon copié");}
    catch{setMessage("Copie impossible");}
  };
  return <div style={{position:"fixed",inset:0,zIndex:340,background:"#000000aa",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div role="dialog" aria-modal="true" aria-labelledby="home-mail-title" style={{width:850,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",background:C.surface,color:C.text,border:`2px solid ${color}`,borderRadius:6,padding:18,boxShadow:`0 0 0 4px ${color}18`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <h2 id="home-mail-title" style={{margin:0,fontSize:16,color}}>{isIp?"Séance IP":"Clôture logistique"} — {rows.length} sous-ensemble{rows.length>1?"s":""}</h2>
        <button type="button" aria-label="Fermer" title="Fermer" onClick={onClose} style={{border:0,background:"transparent",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button>
      </div>
      {isIp&&<label style={{display:"block",marginBottom:10,fontSize:12,fontWeight:700,color:C.yellow}}>Nom de l’IP
        <input aria-label="Nom de l’IP" autoFocus value={ipName} onChange={e=>setIpName(e.target.value)} placeholder="Ex. RX-IP-800 (selon fiche suiveuse)"
          style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:8,background:C.input,color:C.text,border:`2px solid ${C.yellow}`,borderRadius:4}}/>
      </label>}
      {isIp&&<div style={{display:"grid",gridTemplateColumns:"minmax(150px,1fr) minmax(120px,.7fr) minmax(150px,.8fr)",gap:8,marginBottom:10}}>
        <label style={{fontSize:12}}>Date
          <input type="date" aria-label="Date de la réunion" value={meetingDate} onChange={event=>setMeetingDate(event.target.value)}
            style={{display:"block",width:"100%",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
        </label>
        <label style={{fontSize:12}}>Heure
          <input type="time" aria-label="Heure de la réunion" value={meetingTime} onChange={event=>setMeetingTime(event.target.value)}
            style={{display:"block",width:"100%",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
        </label>
        <label style={{fontSize:12}}>Durée
          <select aria-label="Durée de la réunion" value={meetingDuration} onChange={event=>setMeetingDuration(event.target.value)}
            style={{display:"block",width:"100%",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}>
            {[30,45,60,90,120].map(minutes=><option key={minutes} value={minutes}>{minutes<60?`${minutes} min`:`${minutes/60} h`}</option>)}
          </select>
        </label>
      </div>}
      {isIp&&<div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(160px,1fr))",gap:8,marginBottom:10}}>
        <label style={{fontSize:12}}>Salle
          <input aria-label="Salle de la réunion" value={meetingRoom} onChange={event=>setMeetingRoom(event.target.value)} placeholder="#512"
            style={{display:"block",width:"100%",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
        </label>
        <label style={{fontSize:12}}>Table / place
          <input aria-label="Table ou place de la réunion" value={meetingPlace} onChange={event=>setMeetingPlace(event.target.value)} placeholder="P17"
            style={{display:"block",width:"100%",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
        </label>
      </div>}
      {!isIp&&<label style={{display:"block",marginBottom:10,fontSize:12}}>Destinataire
        <input aria-label="Destinataire" value={recipient} onChange={e=>setRecipient(e.target.value)}
          style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
      </label>}
      {isIp&&<>
        <ManagerCcPicker managers={projectAccounts} copyTo={inviteProjectTo} onChange={setInviteProjectTo} required error={inviteAccountsError}
          legend="À - Chefs de projet" mode="to"/>
        <ManagerCcPicker managers={assuranceAccounts} copyTo={inviteAssuranceTo} onChange={setInviteAssuranceTo} required
          legend="À - Product Assurance" mode="to"/>
        <ManagerCcPicker managers={invitationCcAccounts} copyTo={inviteCc} onChange={setInviteCc}
          legend="CC - Managers"/>
      </>}
      {!isIp&&<ManagerCcPicker managers={managers} copyTo={copyTo} onChange={setCopyTo} error={ccError}/>}
      {!isIp&&<label style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"8px 10px",fontSize:12,fontWeight:700,color:markForClosure?C.green:C.muted,background:C.green+"0d",border:`1px solid ${markForClosure?C.green:C.border}`,borderRadius:4,cursor:"pointer"}}>
        <input type="checkbox" checked={markForClosure} onChange={e=>setMarkForClosure(e.target.checked)}/>
        Passer les éléments sélectionnés au statut « À clôturer »
      </label>}
      <label style={{display:"block",marginBottom:10,fontSize:12}}>Objet
        <input aria-label="Objet" value={draft.subject} onChange={e=>setDraft(d=>({...d,subject:e.target.value}))}
          style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
      </label>
      <label style={{display:"block",fontSize:12}}>Message
        <textarea aria-label="Message" value={draft.body} onChange={e=>setDraft(d=>({...d,body:e.target.value}))}
          style={{display:"block",width:"100%",boxSizing:"border-box",marginTop:4,height:330,maxHeight:"50vh",resize:"vertical",padding:10,fontFamily:"system-ui,sans-serif",fontSize:13,lineHeight:1.5,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
      </label>
      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <span role="status" style={{fontSize:12,color:C.green}}>{message}</span>
        <Btn onClick={onClose} color={C.border} small>Fermer</Btn>
        <Btn onClick={copy} color={C.border} small>Copier le brouillon</Btn>
        {isIp?<Btn disabled={!ipName.trim()||!meetingDate||!meetingTime||!projectMeetingEmails.length||!assuranceMeetingEmails.length||!draft.subject.trim()||!draft.body.trim()} onClick={()=>{
          downloadOutlookMeeting({draft,date:meetingDate,time:meetingTime,duration:meetingDuration,location:[meetingRoom,meetingPlace].map(value=>value.trim()).filter(Boolean).join(" "),requiredRecipients:requiredMeetingEmails,optionalRecipients:optionalMeetingEmails,user});
          setMessage("Brouillon Outlook créé : ouvrez-le, modifiez-le puis cliquez sur Inviter des participants pour l’envoyer.");
        }} color={color} small>Créer le brouillon Outlook</Btn>:<Btn disabled={sending||!recipient.trim()||!draft.subject.trim()||!draft.body.trim()} onClick={async()=>{
          setMessage("");
          setSending(true);
          try{
            if(markForClosure&&onMarkForClosure) await onMarkForClosure(rows);
            const cc=ccEmails.length?`&cc=${encodeURIComponent(ccEmails.join(","))}`:"";
            window.location.href=`mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(draft.subject)}${cc}&body=${encodeURIComponent(draft.body)}`;
          }catch(error){
            setMessage(`Statut non modifié : ${error?.message||error}`);
          }finally{
            setSending(false);
          }
        }} color={color} small>{sending?"Mise à jour…":"Ouvrir la messagerie"}</Btn>}
      </div>
    </div>
  </div>;
};
const pendingHomePolymerization = (data,consommables,unitId,referenceDate) => {
  const units=data?.units?.rows||snRowsFromHeader(data?.header||{});
  const unit=units.find(item=>item.id===unitId&&!item.deleted);
  const byId=Object.fromEntries((consommables||[]).map(item=>[item.id,item]));
  const pending=(data?.consommables?.ops||[])
    .filter(op=>!op.deleted&&op.validated&&(!unit||rowMatchesSn(op,unit,units)))
    .flatMap(op=>(op.items||[]).filter(item=>!item.deleted&&item.validated).map(item=>polymerizationStatus(byId[item.consoId],item.createdDT||op.createdDT,referenceDate)))
    .filter(status=>status&&!status.done);
  return pending.reduce((latest,status)=>!latest||status.readyAt>latest.readyAt?status:latest,null);
};
const homeFactsForUnit = (data,unitId) => {
  const units=data?.units?.rows||snRowsFromHeader(data?.header||{});
  const unit=units.find(item=>item.id===unitId&&!item.deleted);
  return effectiveScopedRows(data,"faits").filter(row=>!unit||rowMatchesSn(row,unit,units));
};
const OFSelector = ({ofList,consommables,onSelect,onCreate,onDelete,onImportOFs,user,onLogout,openHistory,onUpdateStatus,onUnitStatusChange,onFinishedSnChange,onSaveProfile,onManageUsers,onManageStatuses}) => {
  const blankForm = {of:"",sn:"",snLines:"",lot:"",snProduitFini:"",codeArticle:"",description:"",otp:"",ofRework:"non",typeOF:"production",status:"en_cours"};
  const [search,setSearch]          = useState("");
  const [page,setPage]               = useState(0);
  const [pageSize,setPageSize]=useState(25);
  const [columnFilters,setColumnFilters]=useState({});
  const [dataById,setDataById]=useState({});
  const [sort,setSort]               = useState("fav");
  const [columnSort,setColumnSort]   = useState({key:"",direction:"asc"});
  const [filterStatus,setFilterStatus] = useState([]);
  const [onlyWorked,setOnlyWorked] = useState(true);
  const [onlyWarnings,setOnlyWarnings] = useState(false);
  const [workedIds,setWorkedIds] = useState([]);
  const [warningsById,setWarningsById] = useState({});
  const [openOWById,setOpenOWById] = useState({});
  const [etuvagesById,setEtuvagesById] = useState({});
  const [snLabelsById,setSnLabelsById] = useState({});
  const [loadingWorked,setLoadingWorked] = useState(true);
  const [selectedKeys,setSelectedKeys] = useState([]);
  const [homeMailKind,setHomeMailKind] = useState(null);
  const [showBulkPdf,setShowBulkPdf] = useState(false);
  const [copiedTeamsKey,setCopiedTeamsKey] = useState("");
  const [homeNow,setHomeNow] = useState(()=>new Date());
  useEffect(()=>{const timer=setInterval(()=>setHomeNow(new Date()),60000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{
    let cancelled=false;setLoadingWorked(true);
    (async()=>{
      let grouped=null;
      try{if(window.storage.homeDocuments) grouped=await window.storage.homeDocuments();}catch{}
      const results=await Promise.all(ofList.map(async o=>{
        try{
          let data=grouped&&Object.prototype.hasOwnProperty.call(grouped,o.id)?grouped[o.id]:null;
          if(!data){
            const r=await window.storage.get(`of:${o.id}`,true);
            data=JSON.parse(r.value);
          }
          return {id:o.id,data,worked:workedOnOf(data,user.trigram)||workedOnOf(o,user.trigram),warnings:ofWarnings(data,consommables),openOW:effectiveScopedRows(data,"openwork").filter(r=>!r.closedDate).length,etuvages:effectiveEtuvageRows(data),snLabels:(data.units?.rows||snRowsFromHeader(data.header)).filter(u=>!u.deleted&&hasUnitIdentity(u)).map(snTitle)};
        }catch{return {id:o.id,worked:workedOnOf(o,user.trigram),warnings:o.status==="bloque"?["OF bloqué"]:[]};}
      }));
      if(!cancelled){setWorkedIds(results.filter(r=>r.worked).map(r=>r.id));setWarningsById(Object.fromEntries(results.map(r=>[r.id,r.warnings])));setOpenOWById(Object.fromEntries(results.map(r=>[r.id,r.openOW||0])));setEtuvagesById(Object.fromEntries(results.map(r=>[r.id,r.etuvages||[]])));setSnLabelsById(Object.fromEntries(results.filter(r=>r.snLabels).map(r=>[r.id,r.snLabels])));setDataById(Object.fromEntries(results.filter(r=>r.data).map(r=>[r.id,r.data])));setLoadingWorked(false);}
    })();
    return ()=>{cancelled=true;};
  },[ofList,user.trigram,consommables]);
  const [hideCloture,setHideCloture]   = useState(true);
  const [showNew,setShowNew] = useState(false);
  const [showProfile,setShowProfile] = useState(false);
  const [favs,setFavs]       = useState([]);
  const [form,setForm]       = useState(blankForm);
  const [importText,setImportText] = useState("");
  const [importMsg,setImportMsg] = useState("");

  // Charger les favs de cet user
  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.get(`favs:${user.trigram}`,false);if(r)setFavs(JSON.parse(r.value));}catch{}
    })();
  },[user.trigram]);

  const toggleFav=async id=>{
    const nf=favs.includes(id)?favs.filter(f=>f!==id):[...favs,id];
    setFavs(nf);
    try{await window.storage.set(`favs:${user.trigram}`,JSON.stringify(nf),false);}catch{}
  };

  // Tri
  const sorted=[...ofList].sort((a,b)=>{
    if(sort==="fav"){
      const fa=favs.includes(a.id)?1:0, fb=favs.includes(b.id)?1:0;
      if(fa!==fb)return fb-fa;
    }
    if(sort==="opens"){
      const ia=openHistory.indexOf(a.id), ib=openHistory.indexOf(b.id);
      const ra=ia===-1?9999:ia, rb=ib===-1?9999:ib;
      if(ra!==rb)return ra-rb;
    }
    if(sort==="of") return (a.of||"").localeCompare(b.of||"");
    if(sort==="projet") return (a.otp||a.projet||"").localeCompare(b.otp||b.projet||"");
    return 0;
  });

  const nextEtuvageForRow=o=>{
    const data=dataById[o.id];
    const units=data?.units?.rows||o._snRows||[];
    const unit=units.find(u=>u.id===o._homeUnitId);
    return nextEtuvageInfo((etuvagesById[o.id]||[]).filter(r=>!unit||rowMatchesSn(r,unit,units)));
  };
  const columnValue=(o,key)=>{
    if(key==="reprise") return ["oui","true"].includes(String(o.ofRework||"").toLowerCase())?"Oui":"Non";
    if(key==="status") return STATUTS[o.status||"en_cours"]?.label||"";
    if(key==="unitStatus") return UNIT_STATUTS[o.unitStatus]?.label||"";
    if(key==="otp") return o.otp||o.projet||"";
    if(key==="nextEtuvage"){const n=nextEtuvageForRow(o);return n.count?n.label:"";}
    return String(o[key]||"");
  };
  const homeSortValue=(o,key)=>{
    if(key==="nextEtuvage") return nextEtuvageForRow(o).nextAt||"";
    if(key==="facts") return homeFactsForUnit(dataById[o.id],o._homeUnitId).map(closureFactLabel).filter(Boolean).join(" ");
    if(key==="tracking") return `${warningsById[o.id]?.length||0} ${openOWById[o.id]||0} ${pendingHomePolymerization(dataById[o.id],consommables,o._homeUnitId,homeNow)?1:0}`;
    if(key==="followup") return `${homeFactsForUnit(dataById[o.id],o._homeUnitId).map(closureFactLabel).filter(Boolean).join(" ")} ${warningsById[o.id]?.length||0} ${openOWById[o.id]||0} ${pendingHomePolymerization(dataById[o.id],consommables,o._homeUnitId,homeNow)?1:0}`;
    return columnValue(o,key);
  };
  const baseHomeRows=sorted.flatMap(o=>homeRowsForOf(o,dataById[o.id]));
  const allHomeRows=columnSort.key?[...baseHomeRows].sort((a,b)=>{
    const av=homeSortValue(a,columnSort.key),bv=homeSortValue(b,columnSort.key);
    const aBlank=av===null||av===undefined||String(av).trim()==="",bBlank=bv===null||bv===undefined||String(bv).trim()==="";
    if(aBlank!==bBlank) return aBlank?1:-1;
    const comparison=typeof av==="number"&&typeof bv==="number"
      ? av-bv
      : String(av).localeCompare(String(bv),"fr",{numeric:true,sensitivity:"base"});
    if(comparison) return columnSort.direction==="asc"?comparison:-comparison;
    return String(a.of||"").localeCompare(String(b.of||""),"fr",{numeric:true,sensitivity:"base"})||String(a.sn||a.lot||"").localeCompare(String(b.sn||b.lot||""),"fr",{numeric:true,sensitivity:"base"});
  }):baseHomeRows;
  const matching=allHomeRows.filter(o=>{
    const q=search.toLowerCase().trim();
    if(hideCloture&&STATUTS[o.status||"en_cours"]?.closed) return false;
    if(onlyWarnings&&!warningsById[o.id]?.length) return false;
    if(filterStatus.length&&!filterStatus.includes(o.status||"en_cours")&&!filterStatus.includes(o.unitStatus||"en_cours")) return false;
    if(Object.entries(columnFilters).some(([key,value])=>value&&!columnValue(o,key).toLowerCase().includes(value.toLowerCase().trim()))) return false;
    return !q||[o.of,o.sn,o.lot,o.snProduitFini,o.description,o.otp,o.projet,o.ofRework,o.codeArticle,STATUTS[o.status||"en_cours"]?.label,STATUTS[o.unitStatus||"en_cours"]?.label].some(v=>v?.toLowerCase().includes(q));
  });
  const searchActive=!!search.trim()||Object.values(columnFilters).some(value=>String(value).trim());
  const workedFilter=homeWorkedFilter(matching,workedIds,onlyWorked,searchActive);
  const filtered=workedFilter.rows;
  const totalPages=Math.ceil(filtered.length/pageSize);
  const currentPage=Math.min(page,Math.max(0,totalPages-1));
  const paged=filtered.slice(currentPage*pageSize,(currentPage+1)*pageSize);
  const selectedRows=allHomeRows.filter(row=>selectedKeys.includes(homeRowKey(row))).map(row=>({
    ...row,
    _homeFacts:homeFactsForUnit(dataById[row.id],row._homeUnitId)
  }));
  const selectionMode=selectedRows.length>0;
  const mixedMeetingOtp=selectedRows.length>0&&!hasSingleMeetingOtp(selectedRows);
  const allPageSelected=!!paged.length&&paged.every(row=>selectedKeys.includes(homeRowKey(row)));
  const toggleSelected=row=>setSelectedKeys(keys=>keys.includes(homeRowKey(row))?keys.filter(key=>key!==homeRowKey(row)):[...keys,homeRowKey(row)]);
  const togglePageSelection=checked=>setSelectedKeys(keys=>checked
    ? [...new Set([...keys,...paged.map(homeRowKey)])]
    : keys.filter(key=>!paged.some(row=>homeRowKey(row)===key)));
  const exportBulkPdf=async options=>{
    const logoImage=await loadPdfLogoImage("assets/logo.png");
    const grouped=new Map();
    selectedRows.forEach(row=>{
      const group=grouped.get(row.id)||{row,unitIds:[]};
      if(row._homeUnitId&&!group.unitIds.includes(row._homeUnitId)) group.unitIds.push(row._homeUnitId);
      grouped.set(row.id,group);
    });
    const blobs=[];
    for(const [id,group] of grouped){
      let data=dataById[id];
      if(!data){
        const stored=await window.storage.get(`of:${id}`,true);
        data=JSON.parse(stored.value);
      }
      try{
        blobs.push(buildDirectReportPdf({
          ofData:data,
          lists:{consommables},
          exportedAt:nowDT(),
          exportedBy:user?.trigram||"",
          includeHistory:!!options.includeHistory,
          includeDeleted:options.includeDeleted!==false,
          skipEmptyReports:!!options.skipEmptyReports,
          selectedSections:options.selectedSections,
          selectedSnIds:group.unitIds.length?group.unitIds:null,
          logoImage
        }));
      }catch(error){
        if(!options.skipEmptyReports||!String(error?.message||error).includes("Aucun rapport non vide")) throw error;
      }
    }
    const merged=await mergeGeneratedPdfBlobs(blobs);
    const ofNumbers=[...grouped.values()].map(group=>group.row.of).filter(Boolean);
    const suffix=ofNumbers.length===1?`OF ${ofNumbers[0]}`:`${ofNumbers.length} OF`;
    downloadBrowserBlob(merged,fileSafeName(`SP-F001A - Impression groupée - ${suffix} - ${nowDT().replace(/[/:]/g,"-")} - ${user?.trigram||"VISA"}`)+".pdf");
    setShowBulkPdf(false);
  };
  const exportBulkComponentSheets=async()=>{
    const grouped=new Map();
    selectedRows.forEach(row=>{
      const group=grouped.get(row.id)||{row,unitIds:[]};
      if(row._homeUnitId&&!group.unitIds.includes(row._homeUnitId)) group.unitIds.push(row._homeUnitId);
      grouped.set(row.id,group);
    });
    try{
      const logoImage=await loadPdfLogoImage("assets/logo.png");
      const blobs=[];
      for(const [id,group] of grouped){
        let data=dataById[id];
        if(!data){
          const stored=await window.storage.get(`of:${id}`,true);
          data=JSON.parse(stored.value);
        }
        blobs.push(buildComponentRetentionSheetsPdf({ofData:data,selectedUnitIds:group.unitIds.length?group.unitIds:null,logoImage,exportedAt:nowDT(),exportedBy:user?.trigram||""}));
      }
      const merged=await mergeGeneratedPdfBlobs(blobs);
      const ofNumbers=[...grouped.values()].map(group=>group.row.of).filter(Boolean);
      const suffix=ofNumbers.length===1?`OF ${ofNumbers[0]}`:`${ofNumbers.length} OF`;
      downloadBrowserBlob(merged,fileSafeName(`Feuilles composants dessoudés - ${suffix}`)+".pdf");
    }catch(error){window.alert(`Impression impossible : ${error?.message||error}`);}
  };
  const columnFilter=(key,label)=>["status","unitStatus"].includes(key)?<MultiFilter value={filterStatus} onChange={v=>{setFilterStatus(v);setPage(0);}} label="Tous" title="Filtrer les statuts OF et SN/LOT" options={Object.entries(STATUTS).map(([value,s])=>({value,label:s.label}))}/>:key==="reprise"?<select aria-label="Filtrer Reprise" value={columnFilters.reprise||""} onChange={e=>{setColumnFilters(prev=>({...prev,reprise:e.target.value}));setPage(0);}} style={{width:"100%",background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"5px 6px",fontSize:12}}><option value="">Tous</option><option>Oui</option><option>Non</option></select>:<input aria-label={`Filtrer ${label}`} placeholder="Filtrer…" value={columnFilters[key]||""}
    onChange={e=>{setColumnFilters(prev=>({...prev,[key]:e.target.value}));setPage(0);}}
    style={{width:"100%",minWidth:0,boxSizing:"border-box",padding:"5px 6px",fontSize:12,color:C.text,background:C.input,border:`1px solid ${C.border}`,borderRadius:4}}/>;
  const toggleColumnSort=key=>{setColumnSort(current=>current.key===key?{key,direction:current.direction==="asc"?"desc":"asc"}:{key,direction:"asc"});setPage(0);};
  const sortableTh=(key,label,w)=>{
    const active=columnSort.key===key;
    const order=columnSort.direction==="asc"?"A-Z":"Z-A";
    return <TH w={w}><button type="button" onClick={()=>toggleColumnSort(key)}
      aria-label={active?`Trier ${label}, ordre ${order}`:`Trier ${label} de A à Z`}
      title={active?`Tri ${order} — cliquer pour inverser`:`Trier ${label} de A à Z`}
      style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:5,padding:0,border:0,background:"transparent",color:active?C.blue:C.muted,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:0,cursor:"pointer",whiteSpace:"nowrap"}}>
      <span>{label}</span><span aria-hidden="true" style={{fontSize:9,color:active?C.blue:C.border}}>{active?order:"↕"}</span>
    </button></TH>;
  };

  const create=async()=>{
    if(!isAdminManager(user)) return;
    if(!form.of)return;
    const snList=parseSnList(form.snLines||form.sn);
    if(snList.length>1){
      const first=snList[0], last=snList[snList.length-1];
      if(!window.confirm(`Créer ${snList.length} SN dans l'OF ${form.of} de ${first} à ${last} ?`)) return;
    }
    const snRows=snList.map(sn=>({id:uid(),sn,lot:form.lot||"",status:"en_cours",remarque:"",createdVisa:user.trigram,createdDT:nowDT(),deleted:false}));
    onCreate({...form,sn:snList[0]||form.sn,projet:form.otp,ofRework:form.ofRework||"non",_snRows:snRows,createdBy:user.trigram,createdAt:now()});
    setForm({...blankForm});
    setShowNew(false);
  };

  const importPaste=async()=>{
    if(!isAdminManager(user)||!onImportOFs) return;
    const groups=parseOfImportPaste(importText);
    const itemCount=groups.reduce((n,g)=>n+(g.items||[]).length,0);
    if(!groups.length){setImportMsg("Aucun OF détecté dans le collage.");return;}
    if(!window.confirm(`Importer ${groups.length} OF et ${itemCount} ligne(s) SN/LOT depuis ce copier-coller ?`)) return;
    try{
      const msg=await onImportOFs(groups);
      setImportMsg(msg||"Import terminé.");
      setImportText("");
    }catch(e){
      setImportMsg(`Erreur import : ${e?.message||e}`);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"system-ui,sans-serif",padding:20}}>
      {/* Top bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <img src="assets/logo.png" alt="Safran" style={{width:100,height:32,objectFit:"contain",background:"#ffffff",borderRadius:4}}/>
            <span style={{fontSize:12,color:C.muted}}>Safran Timing Technologies SA</span>
          </div>
          <div style={{fontSize:20,fontWeight:900,color:C.text,fontFamily:"monospace"}}>SP-F001A7</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <ThemeButton/>
          {canManageLists(user)&&<Btn onClick={onManageStatuses} color={C.border} small>Statuts</Btn>}
          {canManageUsers(user)&&<Btn onClick={onManageUsers} color={C.blue} small>Utilisateurs</Btn>}
          <div style={{background:C.accent+"22",border:`1px solid ${C.accent}`,borderRadius:20,padding:"4px 14px",
            fontFamily:"monospace",fontWeight:700,color:C.accent,fontSize:14,cursor:"pointer"}}
            title="Mon profil" onClick={e=>{e.stopPropagation();setShowProfile(true);}}>
            {user.trigram}
            {(user.nom||user.prenom)&&<span style={{fontSize:11,fontWeight:400,color:C.muted,fontFamily:"system-ui",marginLeft:6}}>
              {[user.prenom,user.nom].filter(Boolean).join(" ")}
            </span>}
          </div>
          <Btn onClick={onLogout} color={C.border} small>Déconnexion</Btn>
        </div>
      </div>

      {/* Barre d'actions */}
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
        {/* Compteur */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 14px",textAlign:"center",flexShrink:0}}>
          <div style={{color:C.muted,fontSize:9,textTransform:"uppercase"}}>Dossiers</div>
          <div style={{color:C.text,fontSize:18,fontWeight:900,fontFamily:"monospace",lineHeight:1}}>{ofList.length}</div>
        </div>
        {/* Recherche */}
        <div style={{flex:1,minWidth:180}}>
          <Input value={search} onChange={v=>{setSearch(v);setPage(0);}} title="Rechercher un OF, SN ou lot" placeholder="🔍  OF, SN, LOT, SN Produit Fini, OTP…"/>
        </div>
        {/* Tri */}
        <select value={sort} onChange={e=>{setSort(e.target.value);setColumnSort({key:"",direction:"asc"});setPage(0);}}
          style={{background:C.input,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"6px 10px",fontSize:12,fontFamily:"monospace",outline:"none"}}>
          {SORT_OPTS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {/* Filtre statut */}
        <label style={{display:"flex",alignItems:"center",gap:6,color:C.text,fontSize:12}}><input type="checkbox" checked={workedFilter.active} disabled={loadingWorked||searchActive||!matching.some(o=>workedIds.includes(o.id))} onChange={e=>{setOnlyWorked(e.target.checked);setPage(0);}}/>Mes OF travaillés</label>
        <label style={{display:"flex",alignItems:"center",gap:6,color:onlyWarnings?C.yellow:C.text,fontSize:12}}><input type="checkbox" checked={onlyWarnings} onChange={e=>{setOnlyWarnings(e.target.checked);setPage(0);}}/>OF à surveiller</label>
        <MultiFilter value={filterStatus} onChange={v=>{setFilterStatus(v);setPage(0);}} label="Tous statuts OF/SN" title="Filtrer les statuts OF et SN/LOT" options={Object.entries(STATUTS).map(([value,s])=>({value,label:s.label}))}/>
        {/* Filtre créateur */}
        {/* Masquer clôturés */}
        <button onClick={()=>setHideCloture(v=>!v)}
          style={{background:hideCloture?"#23863622":"transparent",border:`1px solid ${hideCloture?"#238636":C.border}`,
            borderRadius:4,color:hideCloture?"#238636":C.muted,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"monospace",whiteSpace:"nowrap"}}>
          {hideCloture?"✓ États finaux masqués":"Afficher états finaux"}
        </button>
        {isAdminManager(user)&&(
          <Btn onClick={()=>setShowNew(v=>!v)} color={showNew?C.border:C.accent}>
            {showNew?"✕ Annuler":"+ Nouveau dossier"}
          </Btn>
        )}
      </div>

      {isAdminManager(user)&&selectionMode&&<div role="toolbar" aria-label="Actions sur la sélection" style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:12,padding:"8px 10px",background:C.blue+"10",border:`1px solid ${C.blue}`,borderRadius:6}}>
        <strong style={{color:C.blue,fontSize:12,minWidth:105}}>{selectedRows.length} sélectionnée{selectedRows.length>1?"s":""}</strong>
        <Btn onClick={()=>setShowBulkPdf(true)} color={C.blue} small>Imprimer les dossiers</Btn>
        <Btn onClick={exportBulkComponentSheets} color={C.blue} small>Feuilles composants</Btn>
        <Btn onClick={()=>setHomeMailKind("closure")} color={C.green} small>Clôture logistique</Btn>
        <Btn onClick={()=>setHomeMailKind("ip")} color={C.yellow} small disabled={mixedMeetingOtp}>Inspection IP</Btn>
        <Btn onClick={()=>setSelectedKeys([])} color={C.border} small>Annuler la sélection</Btn>
        <span style={{color:C.muted,fontSize:11,marginLeft:"auto"}}>Cliquez sur une ligne pour l’ajouter. La flèche ouvre toujours le dossier.</span>
        {mixedMeetingOtp&&<span role="alert" style={{width:"100%",fontSize:11,color:C.yellow,fontWeight:700}}>Une invitation IP ne peut contenir qu’un seul OTP.</span>}
      </div>}

      {/* Formulaire nouveau */}
      {showNew&&(
        <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:8,padding:16,marginBottom:14}}>
          <div style={{color:C.muted,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Nouveau dossier</div>
          <div style={{marginBottom:12}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:4,textTransform:"uppercase"}}>SN (un par ligne)</div>
            <textarea value={form.snLines||form.sn||""} onChange={e=>setForm(f=>({...f,snLines:e.target.value,sn:parseSnList(e.target.value)[0]||""}))}
              placeholder={"SN181\nSN182\nSN183"}
              rows={4}
              style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                color:C.text,fontSize:13,fontFamily:"monospace",padding:"8px 10px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
            <div style={{fontSize:10,color:C.muted,marginTop:4}}>
              {parseSnList(form.snLines||form.sn).length||0} SN détecté{parseSnList(form.snLines||form.sn).length>1?"s":""}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
            {[
              ["OF *","of","454545","N° de l'ordre de fabrication"],
              ["LOT","lot","SP-J12345","Lot"],
              ["N° Article","codeArticle","R4B-S001A","Référence SAP"],
              ["OTP","otp","7400-SPA-IRNS-MAI","OTP / programme"],
            ].map(([label,key,ph,title])=>(
              <div key={key}>
                <div style={{color:C.muted,fontSize:10,marginBottom:4,textTransform:"uppercase"}}>{label}</div>
                <Input value={form[key]||""} onChange={v=>setForm(f=>({...f,[key]:v}))} placeholder={ph} title={title}/>
              </div>
            ))}
          </div>
          <div style={{marginBottom:12}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:4,textTransform:"uppercase"}}>Description</div>
            <Input value={form.description||""} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="Carte électronique haute tension"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:12}}>
            <div>
              <div style={{color:C.muted,fontSize:10,marginBottom:4,textTransform:"uppercase"}}>OF reprise</div>
              <select value={form.ofRework||"non"} onChange={e=>setForm(f=>({...f,ofRework:e.target.value}))}
                style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                  color:C.text,padding:"6px 10px",fontSize:13,fontFamily:"monospace",outline:"none"}}>
                <option value="non">Non</option>
                <option value="oui">Oui</option>
              </select>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:10,marginBottom:4,textTransform:"uppercase"}}>Statut OF</div>
              <select value={form.status||"en_cours"} onChange={e=>setForm(f=>({...f,status:e.target.value}))}
                style={{width:"100%",background:STATUTS[form.status||"en_cours"]?.color+"22",
                  border:`1px solid ${STATUTS[form.status||"en_cours"]?.color}`,borderRadius:4,
                  color:STATUTS[form.status||"en_cours"]?.color,padding:"6px 10px",fontSize:13,
                  fontFamily:"monospace",fontWeight:700,outline:"none"}}>
                {Object.entries(STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <Btn onClick={create} color={form.of?C.green:C.border} disabled={!form.of.trim()}>✓ Créer le dossier</Btn>
          <div style={{borderTop:`1px solid ${C.border}`,marginTop:16,paddingTop:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:12,marginBottom:8}}>
              <div>
                <div style={{color:C.muted,fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>Importer depuis copier-coller</div>
                <div style={{color:C.muted,fontSize:10}}>Ordre colonnes : Qté initiale, Projet, Article N°, Article N°SAP, Description, SN / LOT, OF, reprise</div>
              </div>
              <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>
                {parseOfImportPaste(importText).length||0} OF
              </span>
            </div>
            <textarea value={importText} onChange={e=>{setImportText(e.target.value);setImportMsg("");}}
              placeholder={"Qté initiale;Projet;Article N°;Article N°SAP;Description;SN / LOT;OF;reprise\n1;7400-SPA-PHM2-MAI;A1I3-S100D;250 000 465;MO Core PCB ajust. et Q monté;#11601;1000043;X"}
              rows={5}
              style={{width:"100%",background:C.input,border:`1px solid ${C.border}`,borderRadius:4,
                color:C.text,fontSize:12,fontFamily:"monospace",padding:"8px 10px",outline:"none",resize:"vertical",boxSizing:"border-box",marginBottom:8}}/>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <ImportCsvFile onText={text=>{setImportText(text);setImportMsg("");}} onError={setImportMsg}/>
              <Btn onClick={importPaste} color={importText.trim()?C.green:C.border} disabled={!importText.trim()} small>Importer le collage</Btn>
              {importMsg&&<span style={{fontSize:11,color:importMsg.startsWith("Erreur")?C.red:importMsg.includes("Attention :")?C.yellow:C.muted}}>{importMsg}</span>}
            </div>
          </div>
        </div>
      )}

      {/* TABLE des dossiers */}
      {filtered.length===0&&(
        <div style={{textAlign:"center",color:C.muted,padding:40,fontSize:14}}>
          {(onlyWorked||onlyWarnings)&&loadingWorked?"Chargement des OF…":onlyWarnings?"Aucun OF à surveiller avec ces filtres":search?"Aucun résultat":onlyWorked?"Aucun OF travaillé":"Aucun dossier"}
        </div>
      )}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead style={{position:"sticky",top:0,zIndex:6}}>
              <tr>
                {isAdminManager(user)&&<TH w={34}><input aria-label="Sélectionner les lignes de la page" type="checkbox" checked={allPageSelected} onChange={e=>togglePageSelection(e.target.checked)}/></TH>}
                <TH w={30}>⭐</TH>
                {sortableTh("of","OF",120)}
                {sortableTh("codeArticle","N° Article",110)}
                {sortableTh("sn","SN",90)}
                {sortableTh("lot","LOT",110)}
                {sortableTh("description","Description")}
                {sortableTh("otp","OTP",190)}
                {sortableTh("snProduitFini","SN Prod. Fini",140)}
                {sortableTh("reprise","Reprise",78)}
                {sortableTh("status","Statut OF",105)}
                {sortableTh("unitStatus","Statut SN",110)}
                {sortableTh("nextEtuvage","Prochain étuvage",150)}
                {sortableTh("followup","Faits / Suivi",330)}
                <TH w={isAdminManager(user)?140:80}></TH>
              </tr>
              <tr style={{background:C.raised}}>
                {isAdminManager(user)&&<td/>}
                <td><button type="button" title="Effacer les filtres de colonne" aria-label="Effacer les filtres de colonne" onClick={()=>{setColumnFilters({});setFilterStatus([]);setPage(0);}} style={{border:0,background:"transparent",color:C.muted,cursor:"pointer"}}>×</button></td>
                {[['of','OF'],['codeArticle','N° Article'],['sn','SN'],['lot','LOT'],['description','Description'],['otp','OTP'],['snProduitFini','SN Produit Fini'],['reprise','Reprise'],['status','Statut OF'],['unitStatus','Statut SN'],['nextEtuvage','Prochain étuvage']].map(([key,label])=><td key={key} style={{padding:"4px 5px"}}>{columnFilter(key,label)}</td>)}
                <td/>
                <td/>
              </tr>
            </thead>
            <tbody>
              {paged.map((o,i)=>{
                const isFav=favs.includes(o.id);
                const isRecent=openHistory[0]===o.id;
                const snLabels=snLabelsById[o.id]||snRowsFromHeader(o).map(snTitle);
                const multiSn=snLabels.length>1;
                const selected=selectedKeys.includes(homeRowKey(o));
                const groupStart=i===0||paged[i-1].id!==o.id;
                const polymerization=pendingHomePolymerization(dataById[o.id],consommables,o._homeUnitId,homeNow);
                const facts=homeFactsForUnit(dataById[o.id],o._homeUnitId);
                return (
                  <tr key={`${o.id}:${o._homeUnitId||"global"}`}
                    onClick={()=>selectionMode?toggleSelected(o):onSelect(o.id,o._homeUnitId)}
                    title={selectionMode?"Ajouter ou retirer cette ligne de la sélection":"Ouvrir ce dossier"}
                    style={{background:selected?C.yellow+"20":isFav?"#e05c0008":i%2===0?"transparent":C.stripe,cursor:selectionMode?"cell":"pointer",transition:"background .1s",borderTop:groupStart?`2px solid ${C.border}`:undefined}}
                    onMouseEnter={e=>e.currentTarget.style.background=selectionMode?C.blue+"14":"#e05c0015"}
                    onMouseLeave={e=>e.currentTarget.style.background=selected?C.yellow+"20":isFav?"#e05c0008":i%2===0?"transparent":C.stripe}>
                    {isAdminManager(user)&&<TD center onClick={e=>{e.stopPropagation();toggleSelected(o);}}><input type="checkbox" aria-label={`Sélectionner ${homeUnitName(o)} - OF ${o.of}`} checked={selected} onClick={e=>e.stopPropagation()} onChange={()=>toggleSelected(o)} style={{width:17,height:17,cursor:"pointer"}}/></TD>}
                    <TD center>
                      <span onClick={e=>{e.stopPropagation();toggleFav(o.id);}}
                        style={{cursor:"pointer",fontSize:14,opacity:isFav?1:.3,transition:"opacity .15s"}}
                        title={isFav?"Retirer des favoris":"Ajouter aux favoris"}>
                        ⭐
                      </span>
                    </TD>
                    <TD>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontFamily:"monospace",color:groupStart?C.text:C.muted}}>{groupStart?o.of:`↳ ${o.of}`}</span>
                        {multiSn&&groupStart&&<span title={`${snLabels.length} SN : ${snLabels.join(", ")}`}><Badge label="Multi-SN" color={C.blue}/></span>}
                        {isRecent&&<Badge label="récent" color={C.purple}/>}
                      </div>
                    </TD>
                    <TD><span style={{fontFamily:"monospace",color:C.muted}}>{groupStart?(o.codeArticle||o.articleNo||"—"):""}</span></TD>
                    <TD><span style={{fontFamily:"monospace",color:o.sn?C.blue:C.muted,fontWeight:700}}>{o.sn||"—"}</span></TD>
                    <TD><span style={{fontFamily:"monospace",color:C.muted}}>{o.lot||"—"}</span></TD>
                    <TD><span style={{color:C.text}}>{groupStart?(o.description||"—"):""}</span></TD>
                    <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{groupStart?(o.otp||o.projet||"—"):""}</span></TD>
                    <TD onClick={e=>e.stopPropagation()}><FinishedProductSn of={o} user={user} onSave={onFinishedSnChange}/></TD>
                    <TD center><Badge label={(String(o.ofRework||"non").toLowerCase()==="oui"||String(o.ofRework||"").toLowerCase()==="true")?"Oui":"Non"} color={String(o.ofRework||"").toLowerCase()==="oui"?C.yellow:C.border}/></TD>
                    <TD center>
                      <select disabled={!isAdminManager(user)} value={o.status||"en_cours"}
                        onClick={e=>e.stopPropagation()}
                        onChange={e=>{e.stopPropagation();onUpdateStatus(o.id,e.target.value);}}
                        style={{background:STATUTS[o.status||"en_cours"]?.color+"22",
                          border:`1px solid ${STATUTS[o.status||"en_cours"]?.color}`,
                          borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,
                          color:STATUTS[o.status||"en_cours"]?.color,outline:"none",cursor:"pointer"}}>
                        {Object.entries(STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </TD>
                    <TD onClick={e=>e.stopPropagation()}>
                      {o._homeUnitId?<select aria-label={`Statut SN ${o.sn||o.lot} - OF ${o.of}`} disabled={!isAdminManager(user)} value={o.unitStatus||"en_cours"}
                        onChange={e=>onUnitStatusChange(o.id,o._homeUnitId,e.target.value).catch(error=>window.alert(`Enregistrement impossible : ${error?.message||error}`))}
                        style={{width:"100%",background:UNIT_STATUTS[o.unitStatus||"en_cours"]?.color+"18",color:UNIT_STATUTS[o.unitStatus||"en_cours"]?.color,border:`1px solid ${UNIT_STATUTS[o.unitStatus||"en_cours"]?.color}`,borderRadius:4,padding:"3px 5px",fontSize:12}}>
                        {Object.entries(UNIT_STATUTS).map(([value,s])=><option key={value} value={value}>{s.label}</option>)}
                      </select>:"—"}
                    </TD>
                    <TD center onClick={e=>e.stopPropagation()}>{(()=>{
                      try{
                        const nei=nextEtuvageForRow(o);
                        if(!nei.count) return <span style={{color:C.muted,fontSize:10}}>—</span>;
                        return <span style={{fontFamily:"monospace",fontSize:10,color:nei.overdue?C.red:C.blue,fontWeight:nei.overdue?700:400}}>
                          {nei.overdue?"🔴 ":"🕐 "}{nei.label}
                        </span>;
                      }catch(e){return <span style={{color:C.muted,fontSize:10}}>—</span>;}
                    })()}</TD>
                    <TD style={{minWidth:330,maxWidth:420}}>
                      <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"nowrap",overflowX:"auto",padding:"1px 0"}}>
                        {facts.map(fact=>{
                          const label=[fact.type,fact.numero].filter(Boolean).join(" ")||"Fait";
                          const closed=!!fact.closedDate;
                          const detail=[label,fact.commentaires,closed?`Clôturé ${fact.closedDate}`:"Ouvert"].filter(Boolean).join(" — ");
                          return <span key={fact.id||detail} title={detail} style={{display:"inline-block",padding:"2px 5px",borderRadius:3,whiteSpace:"nowrap",fontSize:10,fontWeight:700,flexShrink:0,
                            border:`1px solid ${closed?C.green:C.yellow}`,background:(closed?C.green:C.yellow)+"14",color:closed?C.green:C.yellow}}>{label}</span>;
                        })}
                        {polymerization&&<span title={`Sous vide dès le ${formatAvailabilityDT(polymerization.readyAt)}`} style={{flexShrink:0}}><Badge label={`POLY ${formatAvailabilityDT(polymerization.readyAt)}`} color={C.yellow}/></span>}
                        {openOWById[o.id]>0&&<span title={`${openOWById[o.id]} Open Work non clôturé(s)`} style={{flexShrink:0}}><Badge label="OW" color={C.yellow}/></span>}
                        {!!warningsById[o.id]?.length&&<span role="img" aria-label="OF à surveiller" title={warningsById[o.id].join("\n")} style={{color:C.yellow,fontSize:18,fontWeight:900,flexShrink:0}}>⚠</span>}
                        {!facts.length&&!polymerization&&!openOWById[o.id]&&!warningsById[o.id]?.length&&<span style={{color:C.muted}}>—</span>}
                      </div>
                    </TD>
                    <TD center>
                      <button title="Copier N° article, description et SN dans le presse-papier" aria-label={`Copier les informations de l'OF ${o.of} - ${homeUnitName(o)} dans le presse-papier`}
                        onClick={e=>{e.stopPropagation();const key=homeRowKey(o);copyToClipboard(buildTeamsOfText(o,[o]));setCopiedTeamsKey(key);setTimeout(()=>setCopiedTeamsKey(current=>current===key?"":current),1800);}}
                        style={{background:copiedTeamsKey===homeRowKey(o)?C.green:C.blue,border:"none",borderRadius:4,color:"#fff",padding:"4px 7px",cursor:"pointer",marginRight:6,fontWeight:800}}>
                        {copiedTeamsKey===homeRowKey(o)?"✓":"📋"}
                      </button>
                      {isAdminManager(user)&&<button title="Supprimer cet OF" aria-label={`Supprimer l'OF ${o.of}`}
                        onClick={e=>{e.stopPropagation();onDelete(o.id);}}
                        style={{background:C.red,border:"none",borderRadius:4,color:"#fff",padding:"4px 8px",cursor:"pointer",marginRight:6}}>×</button>}
                      <button aria-label={`Ouvrir OF ${o.of} - ${homeUnitName(o)}`} title="Ouvrir le dossier" onClick={e=>{e.stopPropagation();onSelect(o.id,o._homeUnitId);}}
                        style={{background:C.accent,border:"none",borderRadius:4,color:"#fff",
                          padding:"4px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}>
                        →
                      </button>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      {/* Pagination */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:14,color:C.muted,fontSize:12}}>
        <span>{filtered.length} ligne(s)</span>
        <label>Lignes par page <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value));setPage(0);}} style={{background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:4}}>{[25,50,100].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
      </div>
      {totalPages>1&&(
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginTop:14}}>
          <Btn onClick={()=>setPage(Math.max(0,currentPage-1))} disabled={currentPage===0} small color={C.border}>‹ Préc.</Btn>
          <span style={{color:C.muted,fontSize:12,fontFamily:"monospace"}}>{currentPage+1} / {totalPages}</span>
          <Btn onClick={()=>setPage(Math.min(totalPages-1,currentPage+1))} disabled={currentPage===totalPages-1} small color={C.border}>Suiv. ›</Btn>
        </div>
      )}
      {showProfile&&<ProfileModal user={user} onClose={()=>setShowProfile(false)} onSave={v=>{onSaveProfile&&onSaveProfile(v);setShowProfile(false);}}/> }
      {showBulkPdf&&isAdminManager(user)&&<BulkPdfOptionsModal rows={selectedRows} onCancel={()=>setShowBulkPdf(false)} onConfirm={exportBulkPdf}/>}
      {homeMailKind&&isAdminManager(user)&&<HomeMailModal kind={homeMailKind} rows={selectedRows} user={user} onClose={()=>setHomeMailKind(null)}
        onMarkForClosure={rows=>Promise.all(rows.filter(row=>row._homeUnitId).map(row=>onUnitStatusChange(row.id,row._homeUnitId,"a_cloturer")))}/>}
    </div>
  );
};

// ─── APP ───────────────────────────────────────────────────────────────────
const TABS=[
  {id:"rework",        label:"Adjust/Rework",  short:"RWK"},
  {id:"consommables",  label:"Consommables",   short:"CSO"},
  {id:"etuvage",       label:"Étuvages",       short:"ETV"},
  {id:"testequip",     label:"Test Équipement", short:"TST"},
  {id:"demating",      label:"Mating",         short:"MTG"},
  {id:"faits",         label:"Faits",          short:"FAITS"},
  {id:"openwork",      label:"Open Work",      short:"OW"},
];

export default function App(){
  const [,setThemeRevision] = useState(0);
  useEffect(()=>{
    const refresh=()=>setThemeRevision(n=>n+1);
    window.addEventListener("sp-f001-theme-change",refresh);
    return ()=>window.removeEventListener("sp-f001-theme-change",refresh);
  },[]);
  const [user,setUser]               = useState(null);
  const homeSaveQueue=React.useRef(Promise.resolve());
  const [ofList,setOfList]           = useState([]);
  const [currentId,setCurrentId]     = useState(null);
  const [consommables,setConsommables]     = useState(DEFAULT_CONSOMMABLES);
  const [showConsoEditor,setShowConsoEditor] = useState(false);
  const catalogRead=React.useRef(null);
  const catalogEditBase=React.useRef(null);
  const readConsommables=useCallback(()=>{
    if(!catalogRead.current){
      catalogRead.current=(async()=>{
        try{
          const record=await window.storage.get("consommables-list",true);
          if(!record) return null;
          const list=JSON.parse(record.value);
          if(!Array.isArray(list)) throw new Error("Catalogue consommables invalide");
          return list;
        }catch(error){if(/not.?found/i.test(error.message||""))return null;throw error;}
      })().finally(()=>{catalogRead.current=null;});
    }
    return catalogRead.current;
  },[]);
  const [faitTypes,setFaitTypes]           = useState(DEFAULT_FAIT_TYPES);
  const [showFaitTypes,setShowFaitTypes]   = useState(false);
  const [statusTypes,setStatusTypes]       = useState(()=>normalizeStatusTypes(DEFAULT_STATUS_TYPES));
  const [showStatusTypes,setShowStatusTypes] = useState(false);
  const [ofData,setOfData]           = useState(null);
  const [activeTab,setActiveTab]     = useState("rework");
  const [saving,setSaving]           = useState(false);
  const [godMode,setGodMode] = useState(false);
  const [lastSaved,setLastSaved]     = useState(null);
  const [saveError,setSaveError]     = useState("");
  const [pendingSave,setPendingSave] = useState(null);
  const [loaded,setLoaded]           = useState(false);
  const [openHistory,setOpenHistory] = useState([]); // IDs des OF récemment ouverts
  const [showAdminUsers,setShowAdminUsers] = useState(false);
  const [copyAcrossRow,setCopyAcrossRow] = useState(null);
  const [copiedOfInfo,setCopiedOfInfo] = useState(false);
  const [printAll,setPrintAll]       = useState(false);
  const [pdfIncludeHistory,setPdfIncludeHistory] = useState(false);
  const [showPdfOptions,setShowPdfOptions] = useState(false);
  const [activeUnitId,setActiveUnitId] = useState("all");
  const [entryUnitId,setEntryUnitId] = useState("");
  const [headerPanel,setHeaderPanel] = useState("dossier");
  const perms = {
    godMode:godMode&&isAdminManager(user),
    role: normalizeRole(user),
    canWrite: canWriteData(user),
    canManageUsers: canManageUsers(user),
    canManageLists: canManageLists(user),
    canControlRework: canControlRework(user),
    canTraceability: canTraceability(user),
    canComment: canComment(user),
  };

  useEffect(()=>{
    (async()=>{
      let authenticated=false;
      if(window.authApi){
        try{const account=await window.authApi.session();setUser(account);authenticated=true;}
        catch{if(window.authApi?.unsupported) window.authApi=null;}
      }
      if(!window.authApi){
        try{await ensureDefaultAdmin();}catch{}
        try{
          const s=await window.storage.get("session",false);
          const lastActivity=Number(localStorage.getItem("sp-f001-last-activity"));
          if(s&&lastActivity&&Date.now()-lastActivity<15*60*1000){
            const session=JSON.parse(s.value);
            const account=await window.storage.get(`user:${session.trigram}`,true);
            setUser(account?{...session,...JSON.parse(account.value),pwd:undefined}:session);
            authenticated=true;
          }
          else if(s) await window.storage.delete("session",false);
        }catch{}
      }
      if(authenticated){
        try{const list=await readConsommables();if(list)setConsommables(list);}catch{}
        try{const r=await window.storage.get("fait-types",true);if(r)setFaitTypes(JSON.parse(r.value));}catch{}
        try{const r=await window.storage.get("status-types",true);if(r){const list=applyStatusTypes(JSON.parse(r.value));setStatusTypes(list);}}catch{}
        try{const r=await window.storage.get("of-list",true);if(r)setOfList(JSON.parse(r.value));}catch{}
      }
      setLoaded(true);
    })();
  },[]);

  const handleLogin=async u=>{
    // Load full profile if exists
    if(!window.authApi){
      try{
        const r=await window.storage.get(`user:${u.trigram}`,true);
        if(r){ const stored=JSON.parse(r.value); u={...u,...stored,pwd:undefined}; }
      }catch{}
    }
    localStorage.setItem("sp-f001-last-activity",String(Date.now()));
    setUser(u);
    try{await window.storage.set("session",JSON.stringify(u),false);}catch{}
    try{const list=await readConsommables();if(list)setConsommables(list);}catch{}
    try{const r=await window.storage.get("fait-types",true);if(r)setFaitTypes(JSON.parse(r.value));}catch{}
    try{const r=await window.storage.get("status-types",true);if(r){const list=applyStatusTypes(JSON.parse(r.value));setStatusTypes(list);}}catch{}
    try{const r=await window.storage.get("of-list",true);if(r)setOfList(JSON.parse(r.value));}catch{}
  };
  const handleSaveProfile=async profile=>{
    if(window.authApi){
      try{
        const updated=await window.authApi.saveProfile(profile);
        setUser(updated);
        await window.storage.set("session",JSON.stringify(updated),false);
      }catch(error){window.alert(error?.message||"Profil non enregistré");}
      return;
    }
    setUser(prev=>({...prev,...profile}));
    try{
      const key=`user:${profile.trigram||profile.trigram}`;
      const r=await window.storage.get(key,true);
      const stored=r?JSON.parse(r.value):{trigram:user.trigram,pwd:""};
      await window.storage.set(key,JSON.stringify({...stored,...profile,pwd:stored.pwd}),true);
      await window.storage.set("session",JSON.stringify({...user,...profile}),false);
    }catch{}
  };
  const [showProfile,setShowProfile] = useState(false);
  const handleLogout=async()=>{
    if(window.authApi){try{await window.authApi.logout();}catch{}}
    setGodMode(false);
    setShowProfile(false);setShowAdminUsers(false);setShowConsoEditor(false);setShowFaitTypes(false);setShowStatusTypes(false);setShowPdfOptions(false);
    setUser(null);setCurrentId(null);setOfData(null);setActiveUnitId("all");
    setCopyAcrossRow(null);
    localStorage.removeItem("sp-f001-last-activity");
    try{await window.storage.delete("session",false);}catch{}
  };

  useEffect(()=>{
    const expired=()=>handleLogout();
    window.addEventListener("sp-f001-session-expired",expired);
    return ()=>window.removeEventListener("sp-f001-session-expired",expired);
  },[]);

  useEffect(()=>{
    if(!user) return;
    const timeout=15*60*1000;
    let lastActivity=Number(localStorage.getItem("sp-f001-last-activity"))||Date.now();
    let expired=false;
    const check=()=>{
      if(expired) return true;
      if(Date.now()-lastActivity>=timeout){expired=true;handleLogout();return true;}
      return false;
    };
    const activity=()=>{
      if(check()) return;
      const now=Date.now();
      if(now-lastActivity>=1000){lastActivity=now;localStorage.setItem("sp-f001-last-activity",String(now));}
    };
    const events=["pointerdown","pointermove","keydown","wheel","touchstart"];
    events.forEach(name=>window.addEventListener(name,activity,{passive:true}));
    window.addEventListener("focus",check);
    document.addEventListener("visibilitychange",check);
    const timer=window.setInterval(check,1000);
    return ()=>{
      window.clearInterval(timer);
      events.forEach(name=>window.removeEventListener(name,activity));
      window.removeEventListener("focus",check);
      document.removeEventListener("visibilitychange",check);
    };
  },[user?.trigram]);

  const selectOf=async (id,selectedUnitId=null,selectedTab="rework")=>{
    try{
      const r=await window.storage.get(`of:${id}`,true);
      if(r){
        const parsed=JSON.parse(r.value);
        // Ensure all required keys exist
        let safe={header:{},units:{},rework:{},consommables:{},testequip:{},faits:{},etuvage:{},demating:{},openwork:{},...parsed};
        if(!Array.isArray(safe.units?.rows)) safe.units=unitsFromHeader(safe.header,user?.trigram||"");
        safe=withUnitMetadata(safe);
        setSaveError("");setPendingSave(null);
        setOfData(safe);setCurrentId(id);setActiveTab(selectedTab);
        setEntryUnitId("");
        const available=(safe.units?.rows||[]).filter(u=>!u.deleted&&hasUnitIdentity(u));
        setActiveUnitId(available.find(u=>u.id===selectedUnitId)?.id||available[0]?.id||"all");
        setOpenHistory(prev=>[id,...prev.filter(x=>x!==id)].slice(0,20));
      }
    }catch(e){console.error("selectOf error",e);}
  };

  const createOf=async header=>{
    if(!isAdminManager(user)) return;
    const id=uid();
    const entry={id,...header,typeOF:header.typeOF||"production",status:header.status||"en_cours",lastEtuvageDT:null};
    const newList=[...ofList,entry];
    const initialUnits=unitsFromHeader(entry,user?.trigram||entry.createdBy||"");
    const newData={header:entry,units:initialUnits,rework:{},flux:{},colles:{},testequip:{},dm:{},ncr:{},etuvage:{},demating:{},openwork:{}};
    try{
      await window.storage.set("of-list",JSON.stringify(newList),true);
      await window.storage.set(`of:${id}`,JSON.stringify(newData),true);
      setOfList(newList);setOfData(newData);setCurrentId(id);setActiveTab("rework");
      setActiveUnitId(initialUnits.rows?.find(u=>!u.deleted&&hasUnitIdentity(u))?.id||"all");
      setOpenHistory(prev=>[id,...prev].slice(0,20));
    }catch(e){console.error(e);}
  };

  const deleteOf=async id=>{
    if(!isAdminManager(user)) return;
    const entry=ofList.find(o=>o.id===id);
    if(!entry||!window.confirm(`Supprimer l'OF ${entry.of} et le retirer de la liste des dossiers ?`)) return;
    try{
      const record=await window.storage.get(`of:${id}`,true);
      const data=record?JSON.parse(record.value):{header:entry};
      const archived={...data,header:{...data.header,deleted:true,deletedVisa:user.trigram,deletedDT:nowDT()}};
      await window.storage.set(`of:${id}`,JSON.stringify(archived),true);
      const next=ofList.filter(o=>o.id!==id);
      await window.storage.set("of-list",JSON.stringify(next),true);
      setOfList(next);setOpenHistory(prev=>prev.filter(x=>x!==id));
      if(currentId===id){setCurrentId(null);setOfData(null);}
    }catch(e){window.alert(`Suppression impossible : ${e?.message||e}`);}
  };

  const persistHomeData=async(id,data)=>{
    const normalized=withUnitMetadata(data);
    await window.storage.set(`of:${id}`,JSON.stringify(normalized),true);
    const stored=await window.storage.get("of-list",true);
    const list=stored?JSON.parse(stored.value):ofList;
    const nextList=list.map(o=>o.id===id?{...o,...normalized.header}:o);
    await window.storage.set("of-list",JSON.stringify(nextList),true);
    setOfList(nextList);
  };
  const enqueueHomeSave=task=>{
    const pending=homeSaveQueue.current.catch(()=>{}).then(task);
    homeSaveQueue.current=pending;
    return pending;
  };
  const updateHomeUnit=(id,unitId,fields)=>enqueueHomeSave(async()=>{
    if(!isAdminManager(user)) return;
    const r=await window.storage.get(`of:${id}`,true);
    if(!r) throw new Error("OF introuvable");
    await persistHomeData(id,patchTrackedUnit(JSON.parse(r.value),unitId,fields));
  });
  const updateHomeStatus=(id,status)=>enqueueHomeSave(async()=>{
    if(!isAdminManager(user)) return;
    try{
      const r=await window.storage.get(`of:${id}`,true);
      if(!r) throw new Error("OF introuvable");
      const data=JSON.parse(r.value);
      await persistHomeData(id,{...data,header:{...data.header,status}});
    }catch(e){window.alert(`Enregistrement impossible : ${e?.message||e}`);}
  });
  const importOFs=async groups=>{
    if(!isAdminManager(user)) return "Accès refusé.";
    const valid=(groups||[]).filter(g=>String(g?.of||"").trim());
    if(!valid.length) return "Aucun OF importable.";
    let nextList=[...ofList];
    let created=0, updated=0, addedItems=0;
    let duplicates=valid.reduce((total,g)=>total+(Number(g.duplicateItems)||0),0);
    const stamp=now();
    const stampDT=nowDT();
    const makeUnitRow=item=>({
      id:uid(),
      sn:cleanSn(item?.sn),
      lot:item?.lot||"",
      qteInitiale:item?.qteInitiale||"",
      unitKind:item?.unitKind||"",
      status:"en_cours",
      snProduitFini:"",
      remarque:"",
      createdVisa:user.trigram,
      createdDT:stampDT,
      deleted:false,
    });
    const baseHeader=g=>({
      of:String(g.of||"").trim(),
      sn:g.items?.[0]?.sn||"",
      snProduitFini:"",
      lot:"",
      codeArticle:cleanImportArticle(g.codeArticle||g.articleNo||""),
      articleNo:g.articleNo||"",
      description:g.description||g.articleNo||"",
      otp:g.projet||"",
      projet:g.projet||"",
      ofRework:g.ofRework||"non",
      typeOF:g.typeOF||((g.ofRework==="oui")?"reprise":"production"),
      status:"en_cours",
      createdBy:user.trigram,
      createdAt:stamp,
    });
    const fillMissing=(target,source)=>{
      ["of","codeArticle","articleNo","description","otp","projet","ofRework","typeOF","status"].forEach(k=>{
        if((target[k]===undefined||target[k]===null||target[k]==="")&&source[k]) target[k]=source[k];
      });
      if(source.ofRework==="oui"){target.ofRework="oui";target.typeOF="reprise";}
      return target;
    };
    for(const group of valid){
      const headerBase=baseHeader(group);
      const existing=nextList.find(o=>String(o.of||"").trim().toUpperCase()===headerBase.of.toUpperCase());
      if(existing){
        let data=null;
        try{
          const r=await window.storage.get(`of:${existing.id}`,true);
          data=r?JSON.parse(r.value):null;
        }catch{}
        if(!data) data={header:{...existing},units:unitsFromHeader(existing,user?.trigram||existing.createdBy||""),rework:{},flux:{},colles:{},testequip:{},dm:{},ncr:{},etuvage:{},demating:{},openwork:{}};
        data=withUnitMetadata(data);
        const units=(data.units?.rows||[]).length ? data.units : unitsFromHeader(data.header||existing,user?.trigram||existing.createdBy||"");
        const rows=[...(units.rows||[])];
        const liveRows=new Set(rows.filter(r=>!r.deleted).map(importUnitKey).filter(Boolean));
        let addedHere=0;
        (group.items||[]).forEach(item=>{
          const row=makeUnitRow(item);
          if(!hasUnitIdentity(row)) return;
          const key=importUnitKey(row);
          if(liveRows.has(key)){duplicates++;return;}
          rows.push(row);
          liveRows.add(key);
          addedHere++;
          addedItems++;
        });
        const activeRows=rows.filter(r=>!r.deleted);
        const header=fillMissing({...data.header},headerBase);
        header.sn=header.sn||activeRows[0]?.sn||"";
        header._snRows=rows;
        const updatedData={...data,header,units:{...units,mode:activeRows.length>1?"multi":"single",rows}};
        await window.storage.set(`of:${existing.id}`,JSON.stringify(updatedData),true);
        nextList=nextList.map(o=>{
          if(o.id!==existing.id) return o;
          const next=fillMissing({...o},headerBase);
          next.sn=header.sn;
          next.snProduitFini=header.snProduitFini;
          next._snRows=rows;
          return next;
        });
        if(addedHere>0) updated++;
      }else{
        const id=uid();
        const snRows=(group.items||[]).map(item=>makeUnitRow(item)).filter(hasUnitIdentity);
        const entry={id,...headerBase,sn:snRows[0]?.sn||"",snProduitFini:"",_snRows:snRows,lastEtuvageDT:null};
        const newData={header:entry,units:unitsFromHeader(entry,user?.trigram||entry.createdBy||""),rework:{},flux:{},colles:{},testequip:{},dm:{},ncr:{},etuvage:{},demating:{},openwork:{}};
        await window.storage.set(`of:${id}`,JSON.stringify(newData),true);
        nextList=[...nextList,entry];
        created++;
        addedItems+=snRows.length;
      }
    }
    await window.storage.set("of-list",JSON.stringify(nextList),true);
    setOfList(nextList);
    const parts=[`${created} OF créé${created>1?"s":""}`];
    if(updated) parts.push(`${updated} OF complété${updated>1?"s":""}`);
    parts.push(`${addedItems} ligne${addedItems>1?"s":""} SN/LOT ajoutée${addedItems>1?"s":""}`);
    const result=`Import terminé : ${parts.join(", ")}.`;
    return duplicates
      ? `${result} Attention : ${duplicates} ligne${duplicates>1?"s":""} déjà présente${duplicates>1?"s":""} dans le même OF, ignorée${duplicates>1?"s":""}.`
      : result;
  };

  const save=useCallback(async data=>{
    if(!currentId)return;
    data=withUnitMetadata(data);
    setSaving(true);
    try{
      await window.storage.set(`of:${currentId}`,JSON.stringify(data),true);
      setSaveError("");setPendingSave(null);
      setLastSaved(new Date().toLocaleTimeString("fr-FR"));
      // Update ofList summary for home screen
      const etvRows=effectiveEtuvageRows(data).filter(r=>r.entreeDT);
      const lastEtv=etvRows.length>0?etvRows.reduce((a,b)=>{
        const sortable=s=>s.replace(/^(\d{2})\/(\d{2})\/(\d{4})/,"$3-$2-$1");
        const pa=sortable(a.entreeDT),pb=sortable(b.entreeDT);
        return pb>pa?b:a;
      }).entreeDT:null;
      setOfList(prev=>{
        const updated=prev.map(o=>o.id===currentId?{...o,...(data.header||{}),lastEtuvageDT:lastEtv,status:data.header?.status||o.status||"en_cours"}:o);
        if(!window.storage.relational) window.storage.set("of-list",JSON.stringify(updated),true).catch(()=>{});
        return updated;
      });
    }catch(error){
      setPendingSave(data);
      setSaveError(error?.message||"La modification n'a pas été enregistrée.");
    }
    setSaving(false);
  },[currentId]);

  useEffect(()=>{
    if(!user||showConsoEditor) return;
    let active=true;
    const refresh=async()=>{
      if(document.visibilityState==="hidden") return;
      try{
        const list=await readConsommables();
        if(active&&list)setConsommables(previous=>catalogFingerprint(previous)===catalogFingerprint(list)?previous:list);
      }catch{}
    };
    if(activeTab==="consommables") refresh();
    window.addEventListener("focus",refresh);
    document.addEventListener("visibilitychange",refresh);
    const timer=window.setInterval(refresh,30000);
    return()=>{active=false;window.clearInterval(timer);window.removeEventListener("focus",refresh);document.removeEventListener("visibilitychange",refresh);};
  },[user?.trigram,activeTab,showConsoEditor,readConsommables]);

  const openConsommablesEditor=async()=>{
    if(!canManageLists(user)) return;
    try{
      const list=await readConsommables();
      catalogEditBase.current=catalogFingerprint(list);
      if(list)setConsommables(list);
      setShowConsoEditor(true);
    }catch(error){window.alert(`Ouverture de la liste impossible : ${error.message||error}`);}
  };
  const saveConsommables=async list=>{
    if(!canManageLists(user)) return;
    try{
      const current=await readConsommables();
      if(catalogFingerprint(current)!==catalogEditBase.current) throw new Error("La liste a été modifiée par un autre utilisateur. Fermez puis rouvrez la liste avant de refaire vos modifications.");
      await window.storage.set("consommables-list",JSON.stringify(list),true);
      setConsommables(list);
      setShowConsoEditor(false);
    }catch(error){window.alert(`Liste non enregistrée : ${error.message||error}`);}
  };

  const saveFaitTypes=async list=>{
    if(!canManageLists(user)) return;
    try{await window.storage.set("fait-types",JSON.stringify(list),true);}catch{}
    setFaitTypes(list);
    setShowFaitTypes(false);
  };

  const saveStatusTypes=async list=>{
    if(!canManageLists(user)) return;
    const clean=normalizeStatusTypes(list);
    try{
      await window.storage.set("status-types",JSON.stringify(clean),true);
      applyStatusTypes(clean);
      setStatusTypes(clean);
      setShowStatusTypes(false);
    }catch(error){window.alert(`Statuts non enregistrés : ${error.message||error}`);}
  };

  const updateTab=(tab,tabData)=>{
    if(!canWriteData(user)) return;
    if(tab==="units"&&!isAdminManager(user)) return;
    if(godMode&&isAdminManager(user)&&tab!=="units"){
      const previous=new Set(deletedLineIds(ofData[tab]));
      const newlyDeleted=new Set(deletedLineIds(tabData).filter(id=>!previous.has(id)));
      if(newlyDeleted.size){
        if(!window.confirm(`Effacer définitivement ${newlyDeleted.size} ligne(s), avec leurs remarques et historiques ? Cette action est irréversible.`)) return;
        tabData=purgeDeletedLines(tabData,newlyDeleted);
      }
    }
    const updated=withUnitMetadata({...ofData,[tab]:tabData});
    setOfData(updated);save(updated);
  };

  const copyReworkAcross = async (requestedRows,targets,includeChecks,copyMode="new",reuseSample=false) => {
    if(!canWriteData(user)) throw new Error("Accès en écriture requis");
    if(saving) throw new Error("Attendez la fin de l'enregistrement en cours");
    const tab=copyAcrossRow.tab;
    const collection=tab==="consommables"?"ops":tab==="demating"?"connectors":"rows";
    const requested=Array.isArray(requestedRows)?requestedRows:[requestedRows];
    const sources=requested.map(selectedRow=>{
      let source=ofData?.[tab]?.[collection]?.find(r=>r.id===selectedRow.id&&!r.deleted);
      if(source&&tab==="consommables") source={...source,items:(source.items||[]).filter(item=>!item.deleted&&selectedRow.items.some(selected=>selected.id===item.id))};
      return tab==="consommables"&&!source?.items.length?null:source;
    }).filter(Boolean);
    if(!sources.length||sources.length!==requested.length) throw new Error("Une ou plusieurs lignes source ne sont plus disponibles");
    const copied=[],errors=[];let copyCount=0;
    const grouped=new Map();
    for(const target of targets){
      if(!grouped.has(target.ofId)) grouped.set(target.ofId,[]);
      grouped.get(target.ofId).push(target);
    }
    setSaving(true);
    try{
      for(const [ofId,destinations] of grouped){
        try{
          const stored=await window.storage.get(`of:${ofId}`,true);
          if(!stored) throw new Error("OF introuvable");
          const destination=withUnitMetadata(JSON.parse(stored.value));
          if(destination.header?.deleted) throw new Error("OF supprimé");
          const additions=destinations.flatMap(target=>{
            const unit=destination.units.rows.find(u=>u.id===target.unitId&&!u.deleted&&hasUnitIdentity(u));
            if(!unit) throw new Error(`SN / LOT ${target.label} indisponible`);
            return sources.map(source=>{
              if(tab==="demating"&&(destination.demating?.connectors||[]).some(c=>!c.deleted&&String(c.nConect).trim().toUpperCase()===String(source.nConect).trim().toUpperCase()&&rowMatchesSnFilter(c,unit.id,{...destination.header,_snRows:destination.units.rows}))) throw new Error(`Connecteur ${source.nConect} déjà présent sur ${target.label}`);
              const sourceUnits=ofData.units?.rows||snRowsFromHeader(ofData.header);
              const sourceLabels=sourceUnits.filter(sourceUnit=>!sourceUnit.deleted&&rowMatchesSn(source,sourceUnit,sourceUnits)).map(snTitle);
              const copyOrigin={
                sourceOfId:currentId,sourceOf:ofData.header?.of||"",sourceArticle:ofData.header?.codeArticle||"",
                sourceDescription:ofData.header?.description||"",sourceUnits:sourceLabels.join(" + ")||ofData.header?.sn||ofData.header?.lot||"",
                sourceRowId:source.id||"",copiedAt:nowDT(),copiedBy:user.trigram,mode:tab==="etuvage"?"same":copyMode
              };
              return copyTableLineToUnit(tab,source,user,unit,includeChecks,tab==="etuvage"?"same":copyMode,reuseSample,copyOrigin);
            });
          });
          if(tab==="openwork") additions.forEach((r,index)=>{r.nOW=String((destination.openwork?.rows||[]).length+index+1).padStart(3,"0");});
          let copiedOvens=[];
          if(tab==="etuvage"){
            const existingRows=destination.testequip?.rows||[];
            const sourceOvens=uniqueOvenChoices(ofData.testequip?.rows||[]);
            const ovenExists=(rows,value)=>{
              const wanted=String(value||"").trim().toLowerCase();
              return rows.some(oven=>[oven.nInv,oven.designation].some(field=>String(field||"").trim().toLowerCase()===wanted));
            };
            for(const source of sources){
              if(!source.fourN||ovenExists([...existingRows,...copiedOvens],source.fourN)) continue;
              const sourceOven=sourceOvens.find(oven=>[oven.nInv,oven.designation].some(field=>String(field||"").trim().toLowerCase()===String(source.fourN).trim().toLowerCase()));
              if(sourceOven) copiedOvens.push({...sourceOven,id:uid(),snScope:"all",snIds:[],unitId:"",snExcludeIds:[],deleted:false,deletedReason:"",deletedVisa:"",deletedDate:""});
            }
          }
          const next={...destination,
            [tab]:{...destination[tab],[collection]:[...(destination[tab]?.[collection]||[]),...additions]},
            ...(copiedOvens.length?{testequip:{...destination.testequip,rows:[...(destination.testequip?.rows||[]),...copiedOvens]}}:{})
          };
          await window.storage.set(`of:${ofId}`,JSON.stringify(next),true);
          copied.push(...destinations.map(t=>t.key));
          copyCount+=additions.length;
          if(ofId===currentId) setOfData(next);
        }catch(error){errors.push(`OF ${destinations[0].of} : ${error.message||"Copie impossible"}`);}
      }
    }finally{setSaving(false);}
    return {copied,errors,copyCount};
  };

  const updateHeader=(fields)=>{
    if(!isAdminManager(user)) return;
    const newHeader={...ofData.header,...fields};
    const newSE = fields.codeArticle||fields.description
      ? (fields.codeArticle||fields.description||"")
      : null;

    // Cascade sousEnsemble to all rows that still had the OLD default value
    const oldDefault = ofData.header?.codeArticle||ofData.header?.description||"";
    const cascadeUnits = arr => arr||[];
    const cascadeRows = arr => (arr||[]).map(r=>
      (!r.sousEnsemble||r.sousEnsemble===oldDefault)&&newSE
        ? {...r,sousEnsemble:newSE.toUpperCase()} : r);
    const cascadeOps  = arr => (arr||[]).map(o=>
      (!o.sousEnsemble||o.sousEnsemble===oldDefault)&&newSE
        ? {...o,sousEnsemble:newSE.toUpperCase()} : o);
    const cascadeConns= arr => (arr||[]).map(c=>
      (!c.sousEnsemble||c.sousEnsemble===oldDefault)&&newSE
        ? {...c,sousEnsemble:newSE.toUpperCase()} : c);

    const updated={
      ...ofData,
      header: newHeader,
      units:       {...ofData.units,       rows:     cascadeUnits(ofData.units?.rows)},
      rework:      {...ofData.rework,      rows:     cascadeRows(ofData.rework?.rows)},
      testequip:   {...ofData.testequip,   rows:     cascadeRows(ofData.testequip?.rows)},
      faits:       {...ofData.faits,       rows:     cascadeRows(ofData.faits?.rows)},
      etuvage:     {...ofData.etuvage,     rows:     cascadeRows(ofData.etuvage?.rows)},
      openwork:    {...ofData.openwork,    rows:     cascadeRows(ofData.openwork?.rows)},
      consommables:{...ofData.consommables,ops:      cascadeOps(ofData.consommables?.ops)},
      demating:    {...ofData.demating,    connectors:cascadeConns(ofData.demating?.connectors)},
    };

    // Update home screen list entry
    const newList=ofList.map(o=>o.id===currentId?{...o,...fields}:o);
    setOfList(newList);
    try{window.storage.set("of-list",JSON.stringify(newList),true);}catch{}
    setOfData(updated);save(updated);
  };

  useEffect(()=>{
    const done=()=>setPrintAll(false);
    window.addEventListener("afterprint",done);
    return()=>window.removeEventListener("afterprint",done);
  },[]);

  useEffect(()=>{
    const onKey=e=>{
      if(!currentId||!ofData||!e.ctrlKey||!e.shiftKey) return;
      if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft") return;
      const tag=String(e.target?.tagName||"").toLowerCase();
      if(["input","textarea","select"].includes(tag)||e.target?.isContentEditable) return;
      const rows=(ofData.units?.rows||[]).filter(u=>!u.deleted&&hasUnitIdentity(u));
      if(!rows.length) return;
      e.preventDefault();
      setActiveUnitId(prev=>{
        const idx=rows.findIndex(u=>u.id===prev);
        if(e.key==="ArrowRight"){
          return idx<0 ? rows[0].id : rows[(idx+1)%rows.length].id;
        }
        return idx<0 ? rows[rows.length-1].id : rows[(idx-1+rows.length)%rows.length].id;
      });
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[currentId,ofData]);

  useEffect(()=>{
    let switching=false;
    const onKey=async event=>{
      if(!["PageUp","PageDown"].includes(event.key)||event.defaultPrevented||event.repeat||event.ctrlKey||event.shiftKey||event.altKey||event.metaKey) return;
      if(!user||user.mustChangePassword||!currentId||!ofData||saving||switching||showProfile||showPdfOptions||copyAcrossRow||printAll) return;
      const target=event.target;
      if(target?.isContentEditable||["input","textarea","select"].includes(String(target?.tagName||"").toLowerCase())||document.querySelector('[role="dialog"], [aria-modal="true"]')) return;
      const entries=ofList.filter(entry=>!entry.deleted);
      const index=entries.findIndex(entry=>entry.id===currentId);
      if(index<0) return;
      event.preventDefault();
      const next=entries[index+(event.key==="PageDown"?1:-1)];
      if(!next) return;
      switching=true;
      try{await selectOf(next.id,null,activeTab);}finally{switching=false;}
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[user,currentId,ofData,ofList,saving,showProfile,showPdfOptions,copyAcrossRow,printAll,activeTab]);

  const printReport=()=>{
    setPrintAll(true);
    setTimeout(()=>window.print(),150);
  };
  const reportFileBaseName=(selectedSnIds=null)=>{
    const units=(ofData?.units?.rows||[]).filter(u=>!u.deleted&&hasUnitIdentity(u));
    const selected=selectedSnIds&&selectedSnIds.length
      ? units.filter(u=>selectedSnIds.includes(u.id))
      : units;
    const snPart=selected.length>1
      ? `${selected[0]?.sn||selected[0]?.lot||"SN"}-${selected[selected.length-1]?.sn||selected[selected.length-1]?.lot||"SN"}`
      : (selected[0]?.sn||selected[0]?.lot||h?.sn||h?.lot||"SN");
    const stamp=nowDT().replace(/[/:]/g,"-").replace(/\s+/g,"_");
    return fileSafeName(`${h?.codeArticle||"Article"} - ${h?.description||"Description"} - ${snPart} - OF ${h?.of||"OF"} - ${stamp} - ${user?.trigram||"VISA"}`);
  };
  const downloadBlob=(blob,name)=>{
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const exportReportJson=()=>{
    const payload={
      schema:"sp-f001a-report-v1",
      exportedAt:nowDT(),
      exportedBy:user?.trigram||"",
      ofData,
      lists:{consommables,faitTypes}
    };
    const name=`SP-F001A_${(h?.of||"OF").replace(/[^a-zA-Z0-9_-]+/g,"_")}_rapport.json`;
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});
    downloadBlob(blob,name);
  };
  const exportSapCsv=(options={})=>{
    const snRows=(ofData?.units?.rows||[]).filter(u=>!u.deleted&&hasUnitIdentity(u));
    const selectedIds=options.selectedSnIds&&options.selectedSnIds.length ? options.selectedSnIds : snRows.map(u=>u.id);
    const selectedSnRows=snRows.length ? snRows.filter(u=>selectedIds.includes(u.id)) : [];
    const consoById=Object.fromEntries((consommables||[]).map(c=>[c.id,c]));
    const headers=["Source","Date","Visa","SN","LOT","Fiche","OP","Repere/Conso","Action","Qte","N echantillon","Code article","Valeur","LOT comp./conso","DC/DP","CTRL","TRACA","Annulee","Annule le","Annule par","Motif annulation"];
    const fmt=(v,deleted)=>deleted?strikeText(v):String(v??"");
    const targetsFor=row=>{
      if(!snRows.length) return [{sn:h?.sn||h?.snProduitFini||"",lot:h?.lot||"", label:snScopeLabel(row,[])}];
      return selectedSnRows
        .filter(sn=>rowMatchesSn(row,sn,snRows))
        .map(sn=>({sn:sn.sn||"",lot:sn.lot||"",label:snTitle(sn)}));
    };
    const rows=[];
    (ofData?.rework?.rows||[]).forEach(r=>{
      const deleted=!!r.deleted;
      targetsFor(r).forEach(target=>rows.push([
        "Adjust/Rework",
        fmt(r.createdDT,deleted),
        fmt(r.createdVisa,deleted),
        fmt(target.sn,deleted),
        fmt(target.lot,deleted),
        fmt(r.fiche,deleted),
        fmt(r.etape,deleted),
        fmt(r.repere,deleted),
        fmt(ACTION_LABELS[r.action1]||r.action1,deleted),
        fmt(r.qty||"",deleted),
        "",
        fmt(compactArticleCode(r.codeERP),deleted),
        fmt(r.valeur,deleted),
        fmt(r.lot,deleted),
        fmt(r.dc,deleted),
        fmt(visaStamp(r.visaCtrl,r.dateCtrl),deleted),
        fmt(visaStamp(r.visaTraca,r.dateTraca),deleted),
        deleted?"X":"",
        r.deletedDate||"",
        r.deletedVisa||"",
        r.deletedReason||""
      ]));
    });
    (ofData?.consommables?.ops||[]).forEach(op=>{
      const items=(op.items||[]).length?op.items:[{}];
      items.forEach(it=>{
        const conso=consoById[it.consoId]||{};
        const consoCode=compactArticleCode(conso.sap||conso.code||it.consoId);
        const consoDesc=consoDescriptionForCsv(conso,it.consoId);
        const deleted=!!op.deleted||!!it.deleted;
        targetsFor(op).forEach(target=>rows.push([
          "Consommable",
          fmt(it.createdDT||op.createdDT,deleted),
          fmt(it.createdVisa||op.createdVisa,deleted),
          fmt(target.sn,deleted),
          fmt(target.lot,deleted),
          fmt(op.fiche,deleted),
          fmt(op.op,deleted),
          fmt(consoDesc,deleted),
          "",
          fmt(it.qty||it.qte||op.qty||op.qte||"1",deleted),
          fmt(it.echantillon,deleted),
          fmt(consoCode,deleted),
          "",
          fmt(it.lot,deleted),
          fmt(it.dp,deleted),
          "",
          fmt(visaStamp(it.visaTraca,it.dateTraca),deleted),
          deleted?"X":"",
          it.deletedDate||op.deletedDate||"",
          it.deletedVisa||op.deletedVisa||"",
          it.deletedReason||op.deletedReason||""
        ]));
      });
    });
    const csv="\uFEFF"+[headers,...rows].map(r=>r.map(csvCell).join(";")).join("\r\n");
    downloadBlob(new Blob([csv],{type:"text/csv;charset=utf-8"}),`${reportFileBaseName(options.selectedSnIds||null)} - Adjust-Rework Consommables.csv`);
  };
  const downloadReportPdf=async (options={})=>{
    const includeHistory = !!options.includeHistory;
    setPdfIncludeHistory(includeHistory);
    const logoImage = await loadPdfLogoImage("assets/logo.png");
    const blob=buildDirectReportPdf({
      ofData,
      lists:{consommables,faitTypes},
      exportedAt:nowDT(),
      exportedBy:user?.trigram||"",
      includeHistory,
      includeDeleted: options.includeDeleted!==false,
      skipEmptyReports: !!options.skipEmptyReports,
      selectedSections:options.selectedSections||null,
      selectedSnIds:options.selectedSnIds||null,
      logoImage
    });
    downloadBlob(blob,`${reportFileBaseName(options.selectedSnIds||null)}.pdf`);
    if(!options.keepModal) setShowPdfOptions(false);
  };
  const exportReportPack=async (options={})=>{
    if(options.includePdf) await downloadReportPdf({...options,keepModal:true});
    if(options.includeCsv) exportSapCsv(options);
    setShowPdfOptions(false);
  };

  if(!loaded) return <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement…</div>;
  if(!user)   return <LoginScreen onLogin={handleLogin}/>;
  if(user.mustChangePassword) return <RequiredPasswordChange user={user} onDone={handleLogin} onLogout={handleLogout}/>;
  if(!currentId||!ofData) return (
    <>
      <OFSelector ofList={ofList} consommables={consommables} onSelect={selectOf} onCreate={createOf} onDelete={deleteOf} onImportOFs={importOFs}
        onFinishedSnChange={(id,unitId,value)=>updateHomeUnit(id,unitId,{snProduitFini:value})}
        onUnitStatusChange={(id,unitId,status)=>updateHomeUnit(id,unitId,{status})}
        user={user} onLogout={handleLogout} openHistory={openHistory}
        onSaveProfile={handleSaveProfile}
        onManageUsers={()=>setShowAdminUsers(true)}
        onManageStatuses={()=>setShowStatusTypes(true)}
        onUpdateStatus={updateHomeStatus}/>
      {showAdminUsers&&canManageUsers(user)&&<AdminUsersModal onClose={()=>setShowAdminUsers(false)}/>}
      {showStatusTypes&&canManageLists(user)&&<StatusTypesManager types={statusTypes} onClose={()=>setShowStatusTypes(false)} onSave={saveStatusTypes}/>}
    </>
  );

  const h    = ofData.header;
  const unitRows = ofData.units?.rows||[];
  const snRows = unitRows.filter(u=>!u.deleted&&hasUnitIdentity(u));
  const activeUnitChoice = snRows.some(u=>u.id===activeUnitId) ? activeUnitId : "all";
  const activeUnit = snRows.find(u=>u.id===activeUnitId) || null;
  const entryUnit=activeUnit||snRows.find(u=>u.id===entryUnitId)||snRows[0]||null;
  const snSummary = snRows.length ? `${snRows.length} SN` : (h.sn ? `SN ${h.sn}` : "aucun SN");
  const workHeader = {
    ...h,
    _snRows:snRows,
    _defaultSnIds:activeUnit?[activeUnit.id]:[],
    _entrySnIds:entryUnit?[entryUnit.id]:[],
    _confirmMultiSn:true,
  };
  const scopedFaits=effectiveScopedRows(ofData,"faits").filter(r=>rowMatchesSnFilter(r,activeUnitChoice,workHeader));
  const faits = scopedFaits.length;
  const faitsOpen = scopedFaits.filter(r=>!r.closedDate).length;
  const ows = effectiveScopedRows(ofData,"openwork").filter(r=>!r.closedDate&&rowMatchesSnFilter(r,activeUnitChoice,workHeader)).length;
  // Alerte calibration
  const horsCalib = effectiveScopedRows(ofData,"testequip").filter(r=>rowMatchesSnFilter(r,activeUnitChoice,workHeader)&&calibStatus(r.dateExpiration)?.color===C.red).length;
  // Prochain étuvage
  let nei = {label:"—",overdue:false};
  try{ nei = nextEtuvageInfo(effectiveEtuvageRows(ofData).filter(r=>rowMatchesSnFilter(r,activeUnitChoice,workHeader))); }catch{}
  const reportSous = h.codeArticle||h.description||"—";
  const reportSn = snRows.length ? snRows.map(snTitle).join(" ; ") : `${h.sn||"—"} / ${h.lot||"—"}`;
  const ReportTitle = () => printAll ? (
    <div style={{borderBottom:`3px solid ${C.accent}`,paddingBottom:10,marginBottom:14}}>
      <div style={{fontSize:22,fontWeight:900,fontFamily:"monospace",color:C.text}}>Rapport complet SP-F001A7</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginTop:10,fontSize:11}}>
        <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>OF</div><strong>{h.of||"—"}</strong></div>
        <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>OTP</div><strong>{h.otp||h.projet||"—"}</strong></div>
        <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>SN suivis</div><strong>{reportSn}</strong></div>
        <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Statut OF</div><strong>{STATUTS[h.status||"en_cours"]?.label||"—"}</strong></div>
        <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Édité</div><strong>{nowDT()} - {user.trigram}</strong></div>
      </div>
    </div>
  ) : null;
  const ReportHead = ({tab}) => printAll ? (
    <div style={{border:`1px solid ${C.border}`,background:C.input,borderRadius:6,
      padding:"8px 12px",margin:"0 0 12px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>OF</div><div style={{fontFamily:"monospace",fontWeight:800}}>{h.of||"—"}</div></div>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Article OF</div><div style={{fontFamily:"monospace",fontWeight:800}}>{reportSous}</div></div>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>SN suivis</div><div style={{fontFamily:"monospace",fontWeight:800}}>{reportSn}</div></div>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Onglet</div><div style={{fontFamily:"monospace",fontWeight:800,color:C.accent}}>{tab}</div></div>
    </div>
  ) : null;

  return (
    <div className={`${printAll?"print-report ":""}compact-ui`} style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"system-ui,sans-serif"}}>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          body { background: #fff !important; color: #111 !important; }
          .no-print, .sticky-tabs, .sticky-of-header > div button { display: none !important; }
          .print-report, .print-report * {
            color: #111 !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          .print-report {
            background: #fff !important;
            font-size: 9px !important;
          }
          .print-report > div:first-of-type,
          .print-report .sticky-tabs,
          .print-report .sticky-of-header {
            position: static !important;
            display: none !important;
          }
          .print-report table {
            width: 100% !important;
            min-width: 0 !important;
            border-collapse: collapse !important;
            page-break-inside: auto;
          }
          .print-report tr { page-break-inside: avoid; page-break-after: auto; }
          .print-report th {
            background: #e9edf2 !important;
            color: #111 !important;
            border: 1px solid #9aa4af !important;
            padding: 3px !important;
          }
          .print-report td {
            background: #fff !important;
            color: #111 !important;
            border: 1px solid #c3cad1 !important;
            padding: 3px !important;
          }
          .print-report input,
          .print-report select,
          .print-report textarea {
            border: 0 !important;
            background: transparent !important;
            color: #111 !important;
            padding: 0 !important;
            font-size: 9px !important;
            min-height: 0 !important;
          }
          .print-report details.edit-history {
            display: block !important;
            background: #eef5ff !important;
            border-left: 3px solid #1f6feb !important;
            padding: 3px 6px !important;
          }
          .print-report details.edit-history summary {
            color: #174ea6 !important;
            font-weight: 800 !important;
          }
        }
        .compact-ui table td { padding-top: 4px !important; padding-bottom: 4px !important; }
        .compact-ui table th { padding-top: 5px !important; padding-bottom: 5px !important; }
        .compact-ui *,
        .compact-ui *::before,
        .compact-ui *::after {
          box-sizing: border-box;
        }
        .compact-ui table {
          max-width: 100%;
        }
        .compact-ui th,
        .compact-ui td {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .compact-ui input,
        .compact-ui select,
        .compact-ui textarea {
          min-height: 0 !important;
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }
        .compact-ui td:first-child,
        .compact-ui td:first-child span {
          white-space: nowrap !important;
        }
      `}</style>
      {/* Top bar */}
      <div style={{background:perms.godMode?C.red+"28":C.surface,borderBottom:`2px solid ${perms.godMode?C.red:C.border}`,padding:"10px 20px",
        display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,height:68,boxSizing:"border-box",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>{setCurrentId(null);setActiveUnitId("all");}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>←</button>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <QuickOfSearch ofList={ofList} currentId={currentId} onSelect={selectOf} disabled={saving}/>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <label htmlFor="active-work-sn" style={{fontSize:11,fontWeight:700,color:C.muted}}>Vue SN</label>
              <select id="active-work-sn" value={activeUnitChoice} onChange={e=>{if(activeUnit)setEntryUnitId(activeUnit.id);setActiveUnitId(e.target.value);}}
                title="SN affiché - Ctrl + Shift + ← / → pour changer de SN"
                style={{background:activeUnitChoice==="all"?C.yellow+"20":C.input,
                  border:`1px solid ${activeUnitChoice==="all"?C.yellow:C.blue}`,borderRadius:4,color:C.text,
                  padding:"4px 8px",fontSize:12,fontWeight:700,fontFamily:"monospace",outline:"none",width:220,maxWidth:"100%"}}>
                <option value="all">Voir tous les SN ({snRows.length})</option>
                {snRows.map(u=><option key={u.id} value={u.id}>{snTitle(u)}</option>)}
              </select>
              {activeUnitChoice==="all"&&<span style={{color:C.yellow,fontSize:11,fontWeight:800,whiteSpace:"nowrap"}}>VUE TOUS LES SN</span>}
            </div>
          </div>
        </div>
        <HeaderClock/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span title={lastSaved?`Dernier enregistrement : ${lastSaved}`:""} style={{fontSize:11,color:C.muted}}>{saving?"⟳ …":lastSaved?"✓":""}</span>
          <ThemeButton/>
          <Btn onClick={()=>setShowPdfOptions(true)} color={C.green} small>Rapport</Btn>
          {isAdminManager(user)&&<>
            <label title="Suppression définitive des prochaines lignes annulées" style={{display:"flex",alignItems:"center",gap:4,color:godMode?C.red:C.muted,fontSize:11}}>
              <input type="checkbox" checked={godMode} onChange={e=>setGodMode(e.target.checked)}/>God mode
            </label>
          </>}
          <Btn onClick={exportReportJson} color={C.border} small>Export JSON</Btn>
          <Btn onClick={handleLogout} color={C.border} small>Déconnexion</Btn>
          <div onClick={()=>setShowProfile(true)}
            style={{background:C.accent+"22",border:`1px solid ${C.accent}`,borderRadius:20,padding:"3px 12px",
              fontFamily:"monospace",fontWeight:700,color:C.accent,fontSize:12,cursor:"pointer",
              display:"flex",alignItems:"center",gap:6}}
            title="Mon profil">
            {user.trigram}
            {(user.nom||user.prenom)&&<span style={{fontSize:10,fontWeight:400,color:C.muted,fontFamily:"system-ui"}}>
              {[user.prenom,user.nom].filter(Boolean).join(" ")}
            </span>}
            ✎
          </div>
        </div>
      </div>

      {saveError&&<div role="alert" style={{background:C.red+"18",borderBottom:`1px solid ${C.red}`,color:C.red,
        padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,fontSize:12,fontWeight:700}}>
        <span>⚠ Enregistrement interrompu : {saveError}</span>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          <Btn onClick={()=>pendingSave&&save(pendingSave)} color={C.red} small disabled={!pendingSave||saving}>Réessayer</Btn>
          <Btn onClick={()=>selectOf(currentId,activeUnitId,activeTab)} color={C.border} small disabled={saving}>Recharger le dossier</Btn>
        </div>
      </div>}

      {showProfile&&<ProfileModal user={user} onClose={()=>setShowProfile(false)} onSave={handleSaveProfile}/>}
      {copyAcrossRow&&<CopyReworkModal row={copyAcrossRow.row} sourceRows={copySourcesForTab(copyAcrossRow.tab,ofData,workHeader,activeUnitChoice)} tab={copyAcrossRow.tab} ofList={ofList} user={user} busy={saving} sourceOfId={currentId} sourceHeader={ofData.header} defaultUnitIds={entryUnit?[entryUnit.id]:[]} onCopy={copyReworkAcross} onClose={()=>setCopyAcrossRow(null)}/>}
      {showPdfOptions&&<PdfOptionsModal
        snRows={snRows}
        defaultSelectedIds={activeUnit ? [activeUnit.id] : null}
        includeHistoryDefault={pdfIncludeHistory}
        onCancel={()=>setShowPdfOptions(false)}
        onConfirm={exportReportPack}
      />}
      {/* Tabs */}
      <div className="sticky-tabs" style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
        display:"flex",overflowX:"auto",padding:"0 12px",position:"sticky",top:68,zIndex:95}}>
        {TABS.map(t=>{
          const active=activeTab===t.id;
          const dot=(t.id==="faits"&&faitsOpen>0)||(t.id==="openwork"&&ows>0)||(t.id==="testequip"&&horsCalib>0);
          const dotColor=t.id==="ncr"?C.red:t.id==="dm"?C.blue:t.id==="testequip"?C.red:C.yellow;
          return (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              background:"none",border:"none",
              borderBottom:active?`2px solid ${C.accent}`:"2px solid transparent",
              color:active?C.text:C.muted,padding:"10px 12px",fontSize:12,
              fontWeight:active?700:400,cursor:"pointer",whiteSpace:"nowrap",
              display:"flex",alignItems:"center",gap:5}}>
              {t.label}
              {dot&&<span style={{width:6,height:6,borderRadius:"50%",background:dotColor}}/>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{padding:20,maxWidth:1560}}>
        <div className="sticky-of-header" style={{position:"sticky",top:111,zIndex:90,background:C.bg,paddingTop:4,paddingBottom:2,maxWidth:1520}}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",
            marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {[
                ["dossier","Dossier"],
                ["sn","Pièces de l'OF"]
              ].map(([id,label])=>(
                <button key={id} onClick={()=>setHeaderPanel(id)}
                  style={{background:headerPanel===id?C.accent+"22":"transparent",
                    border:`1px solid ${headerPanel===id?C.accent:C.border}`,borderRadius:4,
                    color:headerPanel===id?C.accent:C.muted,padding:"4px 10px",
                    fontSize:11,fontWeight:800,cursor:"pointer",textTransform:"uppercase",letterSpacing:.6}}>
                  {label}
                </button>
              ))}
              <button type="button" className="no-print" title="Copier N° article, description et SN dans le presse-papier" aria-label="Copier les informations du dossier dans le presse-papier" onClick={()=>{
                copyToClipboard(buildTeamsOfText(h,activeUnit?[activeUnit]:snRows));
                setCopiedOfInfo(true);setTimeout(()=>setCopiedOfInfo(false),1800);
              }} style={{width:28,height:24,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:0,borderRadius:4,background:copiedOfInfo?C.green:C.blue,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:800}}>{copiedOfInfo?"✓":"📋"}</button>
            </div>
            {perms.canWrite&&entryUnit&&<div className="no-print" style={{display:"flex",alignItems:"center",gap:8,fontSize:12,flexWrap:"wrap"}}>
              <label htmlFor="entry-target-sn" style={{fontWeight:700,color:C.accent}}>Nouvelle ligne pour</label>
              {activeUnitChoice==="all"?<select id="entry-target-sn" value={entryUnit.id} onChange={e=>setEntryUnitId(e.target.value)} style={{background:C.input,color:C.text,border:`1px solid ${C.blue}`,borderRadius:4,padding:"4px 8px",fontSize:12,maxWidth:260}}>
                {snRows.map(unit=><option key={unit.id} value={unit.id}>{snTitle(unit)}</option>)}
              </select>:<strong>{snTitle(entryUnit)}</strong>}
            </div>}
          </div>
          {headerPanel==="dossier" ? (
            <Header of={workHeader} onUpdate={updateHeader} user={user} onCommentsChange={v=>{const u={...ofData,header:{...ofData.header,comments:v}};setOfData(u);save(u);}} onUpdateStatus={status=>{
              if(!isAdminManager(user)) return;
              const updated={...ofData,header:{...ofData.header,status}};
              const newList=ofList.map(o=>o.id===currentId?{...o,status}:o);
              setOfList(newList);
              try{window.storage.set("of-list",JSON.stringify(newList),true);}catch{}
              setOfData(updated);save(updated);
            }}/>
          ) : (
            <TrackedSNs data={ofData.units||{}} onChange={d=>updateTab("units",d)}
              splitHistory={ofData.lotSplits||[]} onSplitLot={(id,remaining,destinations)=>{const updated=splitTrackedLot(ofData,id,remaining,destinations,user);setOfData(updated);save(updated);}}
              onLotQuantity={(id,qty)=>{const updated=changeTrackedLotQuantity(ofData,id,qty,user);setOfData(updated);save(updated);}}
              onConvertUnit={(id,kind)=>{const updated=convertTrackedUnitKind(ofData,id,kind,user);setOfData(updated);save(updated);}}
              header={h} user={user} activeUnitId={activeUnitId} onActiveUnitChange={setActiveUnitId}/>
          )}
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:16,maxWidth:1520}}>
          <ReportTitle/>
          {(printAll||activeTab==="rework")&&<>
            <ReportHead tab="Adjust/Rework"/>
            <SectionTitle>Adjust/Rework</SectionTitle>
            <TabRework data={ofData.rework} contextData={ofData} onChange={d=>updateTab("rework",d)} user={user} perms={perms} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"rework",row})}/>
          </>}
          {(!printAll&&activeTab==="consommables"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Consommables"/>
            <SectionTitle>Consommables</SectionTitle>
            <TabConsommables data={ofData.consommables||{}} contextData={ofData} onChange={d=>updateTab("consommables",d)} user={user} perms={perms} consommables={consommables} onEditList={openConsommablesEditor} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"consommables",row})}/>
          </div>}
          {(!printAll&&activeTab==="testequip"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Test Equip."/>
            <SectionTitle>Test Equip.</SectionTitle>
            <TabTestEquip data={ofData.testequip} onChange={d=>updateTab("testequip",d)} user={user} perms={perms} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"testequip",row})}/>
          </div>}
          {(!printAll&&activeTab==="faits"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Faits"/>
            <SectionTitle>Faits</SectionTitle>
            <TabFaits data={ofData.faits||{}} onChange={d=>updateTab("faits",d)} user={user} perms={perms} faitTypes={faitTypes} onEditTypes={()=>setShowFaitTypes(true)} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"faits",row})}/>
          </div>}
          {(!printAll&&activeTab==="etuvage"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Étuvages"/>
            <SectionTitle>Étuvages</SectionTitle>
            <TabEtuvage data={ofData.etuvage} onChange={d=>updateTab("etuvage",d)} user={user} perms={perms} allRows={ofData.etuvage?.rows} tstRows={ofData.testequip?.rows} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"etuvage",row})}/>
          </div>}
          {(!printAll&&activeTab==="demating"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Mating"/>
            <SectionTitle>Mating</SectionTitle>
            <TabDeMating data={ofData.demating} onChange={d=>updateTab("demating",d)} user={user} perms={perms} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"demating",row})}/>
          </div>}
          {(!printAll&&activeTab==="openwork"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Open Work"/>
            <SectionTitle>Open Work</SectionTitle>
            <TabOpenWork data={ofData.openwork} onChange={d=>updateTab("openwork",d)} user={user} perms={perms} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"openwork",row})}/>
          </div>}
        </div>
      </div>

      {/* Éditeur liste consommables (modal) */}
      {showConsoEditor&&canManageLists(user)&&(
        <ConsommableListManager
          items={consommables}
          onClose={()=>setShowConsoEditor(false)}
          onSave={saveConsommables}
        />
      )}
      {showFaitTypes&&canManageLists(user)&&(
        <FaitTypesManager
          types={faitTypes}
          onClose={()=>setShowFaitTypes(false)}
          onSave={saveFaitTypes}
        />
      )}
      {showStatusTypes&&canManageLists(user)&&(
        <StatusTypesManager
          types={statusTypes}
          onClose={()=>setShowStatusTypes(false)}
          onSave={saveStatusTypes}
        />
      )}
    </div>
  );
}
