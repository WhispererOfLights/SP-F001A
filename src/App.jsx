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
const canCloseWorkItems = user => !!user?.trigram&&normalizeRole(user)!=="Consultation";
const canManageUsers = user => isAdminManager(user);
const canManageLists = user => isAdminManager(user);
const canControlRework = user => ["Admin","Manager","Contrôleur"].includes(normalizeRole(user));
const canTraceability = user => ["Admin","Manager","Logistique"].includes(normalizeRole(user));
const LOGISTICS_DIRECTORY_RECIPIENT = "CH - NHL - Logistique CH";
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
const formatOpenWorkNumber = value => {
  const raw=String(value||"").trim();
  if(!raw) return "";
  const suffix=raw.replace(/^OW[\s-]*/i,"");
  return /^\d+$/.test(suffix)?`OW${suffix.padStart(3,"0")}`:`OW${suffix}`;
};
const nextOpenWorkNumber = rows => {
  const max=(rows||[]).filter(row=>String(row?.type||"").toUpperCase()==="OW").reduce((current,row)=>{
    const match=formatOpenWorkNumber(row.numero||row.nOW).match(/^OW(\d+)$/i);
    return match?Math.max(current,Number(match[1])):current;
  },0);
  return `OW${String(max+1).padStart(3,"0")}`;
};
const technicalFollowUpLabel = fact => String(fact?.type||"").toUpperCase()==="OW"
  ? formatOpenWorkNumber(fact?.numero)||"OW"
  : [fact?.type,fact?.numero].filter(Boolean).join(" ")||"Fait";
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
const Input = ({value,onChange,onBlur,onKeyDown,placeholder,displayPlaceholder,title,style={},small,type="text",readOnly,required,entryField,ariaLabel}) => {
  const empty = !value||value==="";
  const borderCol = required&&empty ? C.yellow : style.borderColor || C.border;
  return (
  <input data-entry-field={entryField} aria-label={ariaLabel} type={type} value={value||""} onChange={e=>onChange&&onChange(e.target.value)}
    onBlur={e=>onBlur&&onBlur(e)} onKeyDown={e=>onKeyDown&&onKeyDown(e)}
    placeholder={title?.startsWith("Filtrer")?"Filtrer…":displayPlaceholder||""} title={title||(placeholder?`Attendu : ${placeholder}`:undefined)} readOnly={readOnly}
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
const copyRichToClipboard = async ({plain,html}) => {
  const text=String(plain||"").trimEnd();
  if(!text) return false;
  try{
    if(navigator.clipboard?.write&&typeof ClipboardItem!=="undefined"){
      await navigator.clipboard.write([new ClipboardItem({
        "text/plain":new Blob([text],{type:"text/plain"}),
        "text/html":new Blob([String(html||"")],{type:"text/html"})
      })]);
      return true;
    }
  }catch{}
  try{
    let copied=false;
    const onCopy=event=>{
      event.clipboardData?.setData("text/plain",text);
      event.clipboardData?.setData("text/html",String(html||""));
      event.preventDefault();
      copied=true;
    };
    document.addEventListener("copy",onCopy);
    const accepted=document.execCommand("copy");
    document.removeEventListener("copy",onCopy);
    if(accepted&&copied) return true;
  }catch{}
  copyToClipboard(text);
  return false;
};
const escapeClipboardHtml = value => String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const buildClipboardTableData = (headers,rows) => {
  const cellStyle="border:1px solid #000;padding:5px 7px;text-align:left;vertical-align:top;";
  const headerStyle=`${cellStyle}background:#e8edf3;font-weight:bold;`;
  const html=`<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:11pt;">`
    +`<thead><tr>${headers.map(value=>`<th style="${headerStyle}">${escapeClipboardHtml(value)}</th>`).join("")}</tr></thead>`
    +`<tbody>${rows.map((cells,index)=>`<tr style="background:${index%2?"#f3f4f6":"#ffffff"};">${cells.map(value=>`<td style="${cellStyle}">${escapeClipboardHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  return {plain:[headers,...rows].map(cells=>cells.join("\t")).join("\n"),html};
};
const buildTrackedUnitsClipboardData = rows => {
  const values=(rows||[]).map(row=>{
    const rawSn=cleanSn(row?.sn);
    const rawLot=cleanSn(row?.lot);
    const lotOnly=row?.unitKind==="lot";
    return {
      of:row?.of||"N/A",
      articleDescription:row?.articleDescription||"N/A",
      sn:lotOnly?"":rawSn,
      lot:rawLot||(lotOnly?rawSn:""),
      quantity:row?.quantity,
      otp:row?.otp||"N/A",
    };
  });
  const hasSn=values.some(row=>!!row.sn);
  const hasLot=values.some(row=>!!row.lot);
  const showSn=hasSn||!hasLot;
  const headers=["N° OF","Article - Description",...(showSn?["SN"]:[]),...(hasLot?["LOT","Qté"]:[]),"OTP"];
  const tableRows=values.map(row=>[
    row.of,
    row.articleDescription,
    ...(showSn?[row.sn||(hasLot?"":"N/A")]:[]),
    ...(hasLot?[row.lot||"",row.lot?(String(row.quantity??"").trim()||"N/A"):""]:[]),
    row.otp,
  ]);
  return buildClipboardTableData(headers,tableRows);
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
const buildOfClipboardData = (header,units=[]) => {
  const sourceUnits=(units||[]).filter(unit=>unit&&!unit.deleted&&(cleanSn(unit.sn)||cleanSn(unit.lot)));
  const rows=(sourceUnits.length?sourceUnits:[{sn:header?.sn||"",lot:header?.lot||"",unitKind:header?.lot?"lot":"sn",qteInitiale:header?.qte||header?.qty||""}]).map(unit=>{
    const article=compactArticleCode(header?.codeArticle||header?.articleNo)||"N/A";
    const description=String(header?.description||"N/A").trim()||"N/A";
    return {
      of:header?.of||"N/A",articleDescription:`${article} - ${description}`,
      sn:unit.sn,lot:unit.lot,unitKind:unit.unitKind,
      quantity:trackedLotQty(unit),otp:header?.otp||header?.projet||"N/A",
    };
  });
  return buildTrackedUnitsClipboardData(rows);
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
const weekendOvenStartInputValue = (reference=Date.now()) => {
  const date=new Date(reference);
  date.setHours(20,0,0,0);
  const daysUntilSunday=(7-date.getDay())%7;
  date.setDate(date.getDate()+daysUntilSunday);
  if(date.getTime()<reference) date.setDate(date.getDate()+7);
  return operationDateInputValue(`${String(date.getDate()).padStart(2,"0")}/${String(date.getMonth()+1).padStart(2,"0")}/${date.getFullYear()} 20:00`);
};
const ovenRequiredMissing = row => [
  !String(row?.duree||"").trim()&&"Durée [H]",
  !String(row?.temp||"").trim()&&"Temp [°C]",
].filter(Boolean);
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

const WeekendOvenModal = ({onConfirm,onCancel}) => {
  const [start,setStart]=useState(()=>weekendOvenStartInputValue());
  const formatted=operationDateFromInput(start);
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:340,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.surface,border:`2px solid ${C.blue}`,borderRadius:8,
        padding:22,width:440,maxWidth:"100%",boxShadow:"0 12px 40px #0008"}}>
        <div style={{fontWeight:800,color:C.blue,fontSize:15,marginBottom:6}}>Démarrage week-end</div>
        <div style={{color:C.muted,fontSize:12,lineHeight:1.5,marginBottom:16}}>
          Le prochain dimanche à 20:00 est proposé. Modifiez l'heure prévue si nécessaire : le compteur de 72 h partira de cette date.
        </div>
        <label style={{display:"block",fontSize:10,color:C.muted,textTransform:"uppercase",marginBottom:6}}>Date et heure d'entrée</label>
        <input type="datetime-local" autoFocus value={start}
          onChange={event=>setStart(event.target.value)}
          style={{width:"100%",boxSizing:"border-box",background:C.input,color:C.text,border:`1px solid ${C.blue}`,
            borderRadius:4,padding:"8px 10px",fontFamily:"monospace",fontSize:13,marginBottom:18}}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn onClick={onCancel} color={C.border}>Annuler</Btn>
          <Btn onClick={()=>formatted&&onConfirm(formatted)} color={C.blue} disabled={!formatted}>▶ Démarrer à cette date</Btn>
        </div>
      </div>
    </div>
  );
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
// @include modules/reporting.jsx

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
const snCompactTitle = u => cleanSn(u?.sn)||cleanSn(u?.lot)||"SN / LOT ?";
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
const snScopeCompactLabel = (row, snRows=[]) => {
  const scope=snScope(row,snRows);
  const excluded=(row?.snExcludeIds||[]).filter(id=>snRows.some(s=>s.id===id));
  if(scope.mode==="all") return excluded.length?`Tous sauf ${excluded.length}`:"Tous";
  const labels=scope.ids.map(id=>snRows.find(s=>s.id===id)).filter(Boolean).map(snCompactTitle);
  return labels.length>2?`${labels.length} SN / LOT`:labels.join(" + ")||"SN / LOT ?";
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
const SAP_IB52_HEADERS = ["","","Article","","N° série","Qté","","","Lot"];
const SAP_CO02_HEADERS = ["Article","","Qté","","Type","Opération","Séquence","Division","Magasin","","","Lot"];
const SAP_FULL_HEADERS = ["Source","Date","Visa","SN cible","LOT cible","Fiche suiveuse","OP","Repère / Type","Action / Statut","Qté","N° échantillon / Fait","Code article","Valeur / Désignation","LOT / N° fait","DC / DP","CTRL","TRAÇA","Date ouverture","Visa ouverture","Date clôture","Visa clôture","Lien","Commentaires","Annulée","Annulée le","Annulée par","Motif annulation"];
const sapExcelDocumentHeader = ({ofData={},selectedSnIds=null}) => {
  const header=ofData.header||{};
  const units=(ofData.units?.rows||[]).map(normalizeTrackedUnit).filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const selectedSet=new Set(selectedSnIds?.length?selectedSnIds:units.map(unit=>unit.id));
  const selected=units.filter(unit=>selectedSet.has(unit.id));
  const identities=(selected.length?selected:units).map(unit=>unit.sn||unit.lot).filter(Boolean);
  const dossierSn=[...new Set(identities)].join(" ; ")||header.sn||header.lot||"";
  return [
    ["N° OF","N° article","Description","SN du dossier export"],
    [header.of||"",header.codeArticle||"",header.description||"",dossierSn],
    [],
  ];
};
const factSapArticle = type => ({NC:"2920000656",DM:"2920000657",ISS:"2920000656"})[String(type||"").trim().toUpperCase()]||"";
const buildSapExcelRows = ({ofData={},consommables=[],selectedSnIds=null}) => {
  const header=ofData.header||{};
  const allUnits=(ofData.units?.rows||[]).map(normalizeTrackedUnit).filter(unit=>!unit.deleted&&hasUnitIdentity(unit));
  const selectedSet=new Set(selectedSnIds?.length?selectedSnIds:allUnits.map(unit=>unit.id));
  const selectedUnits=allUnits.filter(unit=>selectedSet.has(unit.id));
  const targets=selectedUnits.length?selectedUnits:[{id:"__of__",sn:header.sn||"",lot:header.lot||"",unitKind:header.lot?"lot":"sn"}];
  const consoById=Object.fromEntries((consommables||[]).map(item=>[item.id,item]));
  const exportable=row=>!!row&&!row.deleted&&row.validated!==false;
  const targetRows=row=>targets.filter(target=>target.id==="__of__"||rowMatchesSn(row,target,allUnits));
  const rework=(ofData.rework?.rows||[]).filter(exportable);
  const consoLines=(ofData.consommables?.ops||[]).filter(exportable).flatMap(op=>(op.items||[])
    .filter(exportable).map(item=>({op,item,conso:consoById[item.consoId]||{}})));
  const facts=(ofData.faits?.rows||[]).filter(exportable);
  const qty=(value,fallback="1")=>String(value??"").trim()||fallback;
  const consoQty=value=>qty(value,"1");
  const article=value=>compactArticleCode(value);
  const comments=value=>(value||[]).map(comment=>[comment.dt,comment.visa,comment.text].filter(Boolean).join(" - ")).join(" | ");
  const deletedInfo=row=>[
    row?.deleted?"X":"",row?.deletedDate||"",row?.deletedVisa||"",row?.deletedReason||"",
  ];
  const ib52=[];
  const co02=[];
  const full=[];

  // IB52 : tous les consommables.
  consoLines.forEach(({op,item,conso})=>targetRows(op).forEach(()=>ib52.push([
    "","",article(conso.sap||conso.code||item.consoId),"","",consoQty(item.qty||item.qte||op.qty||op.qte),"","",String(item.lot||""),
  ])));

  // IB52 : état final de chaque repère TOPO pour chaque SN / LOT sélectionné.
  targets.forEach(target=>{
    const finalByRepere=new Map();
    rework
      .filter(row=>target.id==="__of__"||rowMatchesSn(row,target,allUnits))
      .filter(row=>["S","D","P","M"].includes(row.action1)&&String(row.repere||"").trim())
      .map((row,index)=>({row,index,time:appDateTimestamp(row.createdDT)}))
      .sort((a,b)=>a.time-b.time||a.index-b.index)
      .forEach(({row})=>finalByRepere.set(String(row.repere).trim().toUpperCase(),row));
    [...finalByRepere.values()].filter(row=>["S","P","M"].includes(row.action1)).forEach(row=>ib52.push([
      "","",article(row.codeERP),"",String(row.sn||""),qty(row.qty),"","",String(row.lot||""),
    ]));
  });

  // IB52 : faits techniques actifs.
  facts.forEach(row=>targetRows(row).forEach(()=>ib52.push([
    "","",factSapArticle(row.type),"","","1","","",String(row.numero||""),
  ])));

  // CO02 : composants montés, puis consommables.
  rework.filter(row=>["S","M","P"].includes(row.action1)).forEach(row=>targetRows(row).forEach(()=>co02.push([
    article(row.codeERP),"",qty(row.qty),"","L","0010","0","7700","PRD3","","",String(row.lot||""),
  ])));
  consoLines.forEach(({op,item,conso})=>targetRows(op).forEach(()=>co02.push([
    article(conso.sap||conso.code||item.consoId),"",consoQty(item.qty||item.qte||op.qty||op.qte),"","L","0010","0","7700","PRD3","","",String(item.lot||""),
  ])));

  // CO02 : une seule sortie par article + lot dans l'OF, avec somme des quantités.
  const groupedCo02=[];
  const groupedCo02ByKey=new Map();
  co02.forEach(row=>{
    const value=Number(String(row[2]||"").replace(",","."));
    const key=`${String(row[0]||"").trim()}\u0000${String(row[11]||"").trim()}`;
    const existing=groupedCo02ByKey.get(key);
    if(!existing||!Number.isFinite(value)){
      const copy=[...row];
      groupedCo02.push(copy);
      if(Number.isFinite(value)) groupedCo02ByKey.set(key,copy);
      return;
    }
    const current=Number(String(existing[2]||"").replace(",","."));
    existing[2]=String(Math.round((current+value)*1000000)/1000000);
  });

  // Export complet : reprend toutes les informations, y compris brouillons et annulations.
  (ofData.rework?.rows||[]).forEach(row=>targetRows(row).forEach(target=>full.push([
    "Adjust/Rework",row.createdDT||"",row.createdVisa||"",target.sn||"",target.lot||"",row.fiche||"",row.etape||"",
    row.repere||"",ACTION_LABELS[row.action1]||row.action1||"",row.action1==="O"?"":row.qty||"",row.action1==="O"?"":row.sn||"",row.action1==="O"?"":article(row.codeERP),row.action1==="O"?"":row.valeur||"",row.action1==="O"?"":row.lot||"",row.action1==="O"?"":row.dc||"",
    row.action1==="O"?"":visaStamp(row.visaCtrl,row.dateCtrl),row.action1==="O"?"":visaStamp(row.visaTraca,row.dateTraca),"","","","","",[row.remarques||"",comments(row.comments)].filter(Boolean).join(" | "),...deletedInfo(row),
  ])));
  (ofData.consommables?.ops||[]).forEach(op=>(op.items||[]).forEach(item=>{
    const conso=consoById[item.consoId]||{};
    targetRows(op).forEach(target=>full.push([
      "Consommable",item.createdDT||op.createdDT||"",item.createdVisa||op.createdVisa||"",target.sn||"",target.lot||"",op.fiche||"",op.op||"",
      consoDescriptionForCsv(conso,item.consoId),"",consoQty(item.qty||item.qte||op.qty||op.qte),item.echantillon||"",article(conso.sap||conso.code||item.consoId),
      consoDescriptionForCsv(conso,item.consoId),item.lot||"",item.dp||"","",visaStamp(item.visaTraca,item.dateTraca),"","","","","",comments(item.comments),
      ...deletedInfo(item.deleted?item:op),
    ]));
  }));
  (ofData.faits?.rows||[]).forEach(row=>targetRows(row).forEach(target=>full.push([
    "Fait technique",row.createdDT||"",row.createdVisa||"",target.sn||"",target.lot||"","","",row.type||"",row.closedDate?"Clôturé":"Ouvert","1",
    row.numero||"",factSapArticle(row.type),row.commentaires||"",row.numero||"","","","",row.date||"",row.visa||"",row.closedDate||"",row.closedVisa||"",
    row.lien||"",[row.commentaires||"",comments(row.comments)].filter(Boolean).join(" | "),...deletedInfo(row),
  ])));
  return {IB52:ib52,CO02:groupedCo02,FULL:full};
};
const SnFilter = ({value,onChange,header,title="Filtrer SN cible"}) => {
  const rows=snRowsFromHeader(header);
  if(!rows.length) return null;
  return <MultiFilter value={value} onChange={onChange} label="Tous" title={title}
    options={[{value:"scope-all",label:"Cible Tous"},...rows.map(s=>({value:s.id,label:snCompactTitle(s)}))]}/>;
};

const SnScopePicker = ({row,header,onChange,disabled=false}) => {
  const rows=snRowsFromHeader(header);
  const scope=snScope(row,rows);
  const label=snScopeLabel(row,rows);
  const compactLabel=snScopeCompactLabel(row,rows);
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
  if(disabled) return <span title={label} style={{fontFamily:"monospace",fontSize:10,color:scope.mode==="all"?C.green:C.blue}}>{compactLabel}</span>;
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
        {compactLabel}
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
  const oldOpenWorks=Array.isArray(data.openwork?.rows)?data.openwork.rows:[];
  if(oldOpenWorks.length){
    const facts=Array.isArray(data.faits?.rows)?data.faits.rows:[];
    const migratedIds=new Set(facts.map(row=>row.migratedFromOpenWorkId).filter(Boolean));
    const migrated=oldOpenWorks.filter(row=>!migratedIds.has(row.id)).map(row=>{
      const legacyText=String(row.commentaires||"").trim();
      const legacyCommentId=`ow-comment-${row.id}`;
      const comments=[...(row.comments||[])];
      if(legacyText&&!comments.some(comment=>comment.id===legacyCommentId)) comments.push({
        id:legacyCommentId,dt:row.createdDT||row.openDate||"",visa:row.createdVisa||row.openVisa||"",text:legacyText,replyTo:null
      });
      return {
        ...row,id:`ow-${row.id}`,migratedFromOpenWorkId:row.id,type:"OW",
        numero:formatOpenWorkNumber(row.nOW||row.numero),commentaires:row.description||"",
        visa:row.openVisa||row.visa||row.createdVisa||"",date:row.openDate||row.date||"",comments
      };
    });
    data={...data,faits:{...(data.faits||{}),rows:[...facts,...migrated]},openwork:{...(data.openwork||{}),rows:[]}};
  }
  if(Array.isArray(data.faits?.rows)) data={...data,faits:{...data.faits,rows:data.faits.rows.map(row=>
    String(row?.type||"").toUpperCase()==="OW"?{...row,numero:formatOpenWorkNumber(row.numero||row.nOW)}:row
  )}};
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

const trackedLotQty = row => [row?.qteActuelle,row?.qteInitiale,row?.qte]
  .find(value=>String(value??"").trim()!=="")??"";
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
  const validLotQuantity=row=>/^[1-9]\d*$/.test(String(trackedLotQty(row)).trim())&&Number.isSafeInteger(Number(trackedLotQty(row)));
  const needsValidation=row=>row.validated===false||(isTrackedLot(row)&&!validLotQuantity(row));
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
    validated:false,
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
    emit({rows:rows.map(r=>r.id===id?{...r,lot,unitKind:r.sn?"sn":lot?"lot":"",snError:"",qtyError:"",
      ...(!r.sn&&lot&&!validLotQuantity(r)?{validated:false}:{})}:r)});
  };
  const updInitialLotQuantity=(id,value)=>{
    const qty=cleanImportQty(value);
    emit({rows:rows.map(r=>r.id===id?{...r,qteInitiale:qty,qteActuelle:"",qte:"",validated:false,qtyError:""}:r)});
  };
  const validateUnit=id=>{
    const row=rows.find(r=>r.id===id);
    if(!row) return;
    if(!hasUnitIdentity(row)){
      emit({rows:rows.map(r=>r.id===id?{...r,snError:"Renseignez un SN ou un LOT"}:r)});
      return;
    }
    if(row.snError) return;
    if(isTrackedLot(row)&&!validLotQuantity(row)){
      emit({rows:rows.map(r=>r.id===id?{...r,validated:false,qtyError:"Quantité entière strictement positive requise"}:r)});
      return;
    }
    const qty=isTrackedLot(row)?String(Number(trackedLotQty(row))):"";
    emit({rows:rows.map(r=>r.id===id?{...r,validated:true,snError:"",qtyError:"",
      ...(isTrackedLot(r)?{qteInitiale:qty,qteActuelle:qty,qte:qty}:{})}:r)});
  };
  const dup=id=>{
    const r=rows.find(x=>x.id===id); if(!r) return;
    if(mode==="single"&&visible.length>=1) return;
    emit({rows:[...rows,{...r,id:uid(),sn:"",lot:"",unitKind:"",parentUnitId:undefined,splitId:undefined,quantityHistory:[],snProduitFini:"",status:"en_cours",snError:"",qtyError:"",validated:false,createdVisa:user?.trigram||"",createdDT:nowDT(),deleted:false}]});
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
                  {showQty&&<TD><Input ariaLabel={`Quantité ${r.lot||r.sn||"nouveau lot"}`} readOnly={!editable||(isTrackedLot(r)&&!needsValidation(r))} value={trackedLotQty(r)}
                    onChange={v=>isTrackedLot(r)?updInitialLotQuantity(r.id,v):upd(r.id,"qteInitiale",cleanImportQty(v))} small
                    style={{fontFamily:"monospace",textAlign:"center",...((isTrackedLot(r)&&needsValidation(r)&&!validLotQuantity(r))?{borderColor:C.red,background:C.red+"10"}:{})}}/>
                    {r.qtyError&&<div style={{fontSize:9,color:C.red,marginTop:2,fontFamily:"monospace"}}>{r.qtyError}</div>}
                    {isTrackedLot(r)&&!needsValidation(r)&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>Initiale : {r.qteInitiale||r.qte||"-"}</div>}</TD>}
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
                      {editable&&needsValidation(r)&&<IconBtn onClick={()=>validateUnit(r.id)} color={C.green} title="Valider le SN / lot">✓</IconBtn>}
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
              <span role="button" aria-label="Fermer les commentaires" onClick={close}
                style={{cursor:"pointer",color:C.muted,fontSize:20,lineHeight:1}}>×</span>
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

// @include modules/rework.jsx

// @include modules/consumables.jsx

// @include modules/test-equipment.jsx

// @include modules/technical-follow-up.jsx

// @include modules/ovens.jsx

// @include modules/mating.jsx

// @include modules/legacy-open-work.jsx

// @include modules/auth.jsx

// @include modules/home.jsx

// ─── APP ───────────────────────────────────────────────────────────────────
const TABS=[
  {id:"rework",        label:"Adjust/Rework",  short:"RWK"},
  {id:"consommables",  label:"Consommables",   short:"CSO"},
  {id:"etuvage",       label:"Étuvages",       short:"ETV"},
  {id:"testequip",     label:"Test Équipement", short:"TST"},
  {id:"demating",      label:"Mating",         short:"MTG"},
  {id:"faits",         label:"Suivi technique", short:"SUIVI"},
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
  const [faitTypes,setFaitTypes]           = useState(()=>ensureOpenWorkFactType(DEFAULT_FAIT_TYPES));
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
  const [ofListReady,setOfListReady] = useState(false);
  const [openHistory,setOpenHistory] = useState([]); // IDs des OF récemment ouverts
  const [showAdminUsers,setShowAdminUsers] = useState(false);
  const [copyAcrossRow,setCopyAcrossRow] = useState(null);
  const [copiedOfInfo,setCopiedOfInfo] = useState(false);
  const [copiedFolderLink,setCopiedFolderLink] = useState(false);
  const [printAll,setPrintAll]       = useState(false);
  const [pdfIncludeHistory,setPdfIncludeHistory] = useState(false);
  const [showPdfOptions,setShowPdfOptions] = useState(false);
  const [showLabelOptions,setShowLabelOptions] = useState(false);
  const [activeUnitId,setActiveUnitId] = useState("all");
  const [entryUnitId,setEntryUnitId] = useState("");
  const [headerPanel,setHeaderPanel] = useState("dossier");
  const pendingFolderLink=React.useRef(parseFolderLink());
  const folderLinkHandled=React.useRef(false);
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
        try{const r=await window.storage.get("fait-types",true);if(r)setFaitTypes(ensureOpenWorkFactType(JSON.parse(r.value)));}catch{}
        try{const r=await window.storage.get("status-types",true);if(r){const list=applyStatusTypes(JSON.parse(r.value));setStatusTypes(list);}}catch{}
        try{const r=await window.storage.get("of-list",true);if(r)setOfList(JSON.parse(r.value));}catch{}
        setOfListReady(true);
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
    try{const r=await window.storage.get("fait-types",true);if(r)setFaitTypes(ensureOpenWorkFactType(JSON.parse(r.value)));}catch{}
    try{const r=await window.storage.get("status-types",true);if(r){const list=applyStatusTypes(JSON.parse(r.value));setStatusTypes(list);}}catch{}
    try{const r=await window.storage.get("of-list",true);if(r)setOfList(JSON.parse(r.value));}catch{}
    setOfListReady(true);
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
    setShowProfile(false);setShowAdminUsers(false);setShowConsoEditor(false);setShowFaitTypes(false);setShowStatusTypes(false);setShowPdfOptions(false);setShowLabelOptions(false);
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

  const selectOf=async (id,selectedUnitId=null,selectedTab="rework",selectedUnitIdentity=null)=>{
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
        const businessUnit=selectedUnitIdentity&&available.find(unit=>(selectedUnitIdentity.sn&&unit.sn===selectedUnitIdentity.sn)||(selectedUnitIdentity.lot&&unit.lot===selectedUnitIdentity.lot));
        setActiveUnitId(selectedUnitId==="all"?"all":available.find(u=>u.id===selectedUnitId)?.id||businessUnit?.id||available[0]?.id||"all");
        setOpenHistory(prev=>[id,...prev.filter(x=>x!==id)].slice(0,20));
      }
    }catch(e){console.error("selectOf error",e);}
  };

  useEffect(()=>{
    if(!user||!ofListReady||folderLinkHandled.current) return;
    const target=pendingFolderLink.current;
    if(!target) return;
    folderLinkHandled.current=true;
    const targetOf=ofList.find(item=>item.id===target.ofId)||ofList.find(item=>String(item.of||"").trim()===target.ofNumber);
    if(!targetOf){
      window.alert("Le dossier demandé par ce lien est introuvable ou n'est pas accessible.");
      return;
    }
    selectOf(targetOf.id,target.unitId||null,target.tab,{sn:target.sn,lot:target.lot});
  },[user?.trigram,ofListReady,ofList]);

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
  const applyHomeDocument=(id,data)=>{
    const normalized=withUnitMetadata(data);
    setOfList(list=>list.map(entry=>entry.id===id
      ? {...entry,...normalized.header,_snRows:normalized.units?.rows||[]}
      : entry));
    return normalized;
  };
  const updateHomeUnit=(id,unitId,fields)=>enqueueHomeSave(async()=>{
    if(!isAdminManager(user)) return;
    if(window.storage.updateWorkOrderSummary){
      const data=await window.storage.updateWorkOrderSummary(`of:${id}`,{units:[{id:unitId,...fields}]});
      if(!data) throw new Error("Modification non enregistrée");
      applyHomeDocument(id,data);
      return;
    }
    const r=await window.storage.get(`of:${id}`,true);
    if(!r) throw new Error("OF introuvable");
    await persistHomeData(id,patchTrackedUnit(JSON.parse(r.value),unitId,fields));
  });
  const updateHomeUnitsStatus=(rows,status)=>enqueueHomeSave(async()=>{
    if(!isAdminManager(user)) return;
    const groups=new Map();
    (rows||[]).filter(row=>row.id&&row._homeUnitId).forEach(row=>{
      if(!groups.has(row.id)) groups.set(row.id,new Set());
      groups.get(row.id).add(row._homeUnitId);
    });
    if(!groups.size) return;
    if(window.storage.updateWorkOrderSummary){
      const records=await Promise.all([...groups].map(async([id,unitIds])=>({
        id,
        data:await window.storage.updateWorkOrderSummary(`of:${id}`,{
          units:[...unitIds].map(unitId=>({id:unitId,status}))
        })
      })));
      records.forEach(record=>applyHomeDocument(record.id,record.data));
      return;
    }
    const records=await Promise.all([...groups].map(async([id,unitIds])=>{
      const record=await window.storage.get(`of:${id}`,true);
      if(!record) throw new Error(`OF ${id} introuvable`);
      let data=JSON.parse(record.value);
      unitIds.forEach(unitId=>{data=patchTrackedUnit(data,unitId,{status});});
      return {id,data:withUnitMetadata(data)};
    }));
    await Promise.all(records.map(record=>window.storage.set(`of:${record.id}`,JSON.stringify(record.data),true)));
    const stored=await window.storage.get("of-list",true);
    const list=stored?JSON.parse(stored.value):ofList;
    const byId=Object.fromEntries(records.map(record=>[record.id,record.data]));
    const nextList=list.map(entry=>byId[entry.id]?{...entry,...byId[entry.id].header}:entry);
    await window.storage.set("of-list",JSON.stringify(nextList),true);
    setOfList(nextList);
  });
  const updateHomeStatus=(id,status)=>enqueueHomeSave(async()=>{
    if(!isAdminManager(user)) return;
    try{
      if(window.storage.updateWorkOrderSummary){
        const data=await window.storage.updateWorkOrderSummary(`of:${id}`,{header:{status}});
        if(!data) throw new Error("Modification non enregistrée");
        applyHomeDocument(id,data);
        return;
      }
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

  const closeWorkItem=useCallback(async (tab,rowId,closed)=>{
    if(!currentId||!canCloseWorkItems(user)) return;
    setSaving(true);
    try{
      const stored=await window.storage.closeWorkItem(`of:${currentId}`,tab,rowId,closed);
      if(!stored) throw new Error("La clôture n'a pas été enregistrée.");
      setOfData(withUnitMetadata(stored));
      setSaveError("");setPendingSave(null);
      setLastSaved(new Date().toLocaleTimeString("fr-FR"));
    }catch(error){
      setSaveError(error?.message||"La clôture n'a pas été enregistrée.");
    }
    setSaving(false);
  },[currentId,user]);

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
    const normalized=ensureOpenWorkFactType(list);
    try{await window.storage.set("fait-types",JSON.stringify(normalized),true);}catch{}
    setFaitTypes(normalized);
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

  const saveSections=async (tabs,updated)=>{
    const names=[...new Set(tabs)].filter(name=>Object.hasOwn(updated,name));
    if(!currentId||!names.length||!window.storage.updateWorkOrderSections){save(updated);return;}
    setSaving(true);
    try{
      const sections=Object.fromEntries(names.map(name=>[name,updated[name]]));
      await window.storage.updateWorkOrderSections(`of:${currentId}`,sections);
      setSaveError("");setPendingSave(null);
      setLastSaved(new Date().toLocaleTimeString("fr-FR"));
      if(names.includes("units")) setOfList(list=>list.map(entry=>entry.id===currentId
        ? {...entry,_snRows:updated.units?.rows||[]} : entry));
      if(names.includes("etuvage")){
        const rows=effectiveEtuvageRows(updated).filter(row=>row.entreeDT);
        const sortable=value=>String(value||"").replace(/^(\d{2})\/(\d{2})\/(\d{4})/,"$3-$2-$1");
        const last=rows.length?rows.reduce((a,b)=>sortable(b.entreeDT)>sortable(a.entreeDT)?b:a).entreeDT:null;
        setOfList(list=>list.map(entry=>entry.id===currentId?{...entry,lastEtuvageDT:last}:entry));
      }
    }catch(error){
      setPendingSave(updated);
      setSaveError(error?.message||"La modification n'a pas été enregistrée.");
    }
    setSaving(false);
  };
  const saveSection=(tab,updated)=>saveSections([tab],updated);

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
    setOfData(updated);saveSection(tab,updated);
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
          if(window.storage.updateWorkOrderSections){
            await window.storage.updateWorkOrderSections(`of:${ofId}`,{
              [tab]:next[tab],
              ...(copiedOvens.length?{testequip:next.testequip}:{})
            });
          }else await window.storage.set(`of:${ofId}`,JSON.stringify(next),true);
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
      if(!user||user.mustChangePassword||!currentId||!ofData||saving||switching||showProfile||showPdfOptions||showLabelOptions||copyAcrossRow||printAll) return;
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
  },[user,currentId,ofData,ofList,saving,showProfile,showPdfOptions,showLabelOptions,copyAcrossRow,printAll,activeTab]);

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
  const exportSapExcel=(options={})=>{
    const rows=buildSapExcelRows({ofData,consommables,selectedSnIds:options.selectedSnIds||null});
    const documentHeader=sapExcelDocumentHeader({ofData,selectedSnIds:options.selectedSnIds||null});
    const sheetRows=(columns,data)=>[...documentHeader,columns,...data];
    const workbook=buildExcelWorkbook([
      {name:"IB52",rows:sheetRows(SAP_IB52_HEADERS,rows.IB52),headerRows:[0,3]},
      {name:"CO02",rows:sheetRows(SAP_CO02_HEADERS,rows.CO02),headerRows:[0,3]},
      {name:"Toutes les infos",rows:sheetRows(SAP_FULL_HEADERS,rows.FULL),headerRows:[0,3]},
    ]);
    downloadBlob(workbook,`${reportFileBaseName(options.selectedSnIds||null)} - SAP IB52 CO02.xlsx`);
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
    if(options.includeExcel) exportSapExcel(options);
    setShowPdfOptions(false);
  };
  const downloadOperationalLabels=async options=>{
    try{
      const types=options.types?.length?options.types:["binder"];
      const entries=[{ofData,selectedUnitIds:options.selectedSnIds||null}];
      const blobs=types.map(type=>buildOperationalLabelsPdf({type,entries,consommables}));
      const blob=await mergeGeneratedPdfBlobs(blobs);
      const label=types.length===1
        ? OPERATIONAL_LABEL_TYPES.find(item=>item.id===types[0])?.label||"Etiquettes"
        : "Lot d'étiquettes";
      downloadBlob(blob,fileSafeName(`${label} - OF ${ofData?.header?.of||"OF"}`)+".pdf");
      setShowLabelOptions(false);
    }catch(error){window.alert(`Impression impossible : ${error?.message||error}`);}
  };

  if(!loaded) return <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement…</div>;
  if(!user)   return <LoginScreen onLogin={handleLogin}/>;
  if(user.mustChangePassword) return <RequiredPasswordChange user={user} onDone={handleLogin} onLogout={handleLogout}/>;
  if(!currentId||!ofData) return (
    <>
      <OFSelector ofList={ofList} consommables={consommables} onSelect={selectOf} onCreate={createOf} onDelete={deleteOf} onImportOFs={importOFs}
        onFinishedSnChange={(id,unitId,value)=>updateHomeUnit(id,unitId,{snProduitFini:value})}
        onUnitStatusChange={(id,unitId,status)=>updateHomeUnit(id,unitId,{status})}
        onBulkUnitStatusChange={updateHomeUnitsStatus}
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
  const ows = scopedFaits.filter(r=>r.type==="OW"&&!r.closedDate).length;
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
          <Btn onClick={()=>setShowLabelOptions(true)} color={C.blue} small>Étiquettes</Btn>
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
      {showLabelOptions&&<LabelOptionsModal
        snRows={snRows}
        defaultSelectedIds={activeUnit?[activeUnit.id]:null}
        ofData={ofData}
        consommables={consommables}
        onCancel={()=>setShowLabelOptions(false)}
        onConfirm={downloadOperationalLabels}
      />}
      {/* Tabs */}
      <div className="sticky-tabs" style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
        display:"flex",overflowX:"auto",padding:"0 12px",position:"sticky",top:68,zIndex:95}}>
        {TABS.map(t=>{
          const active=activeTab===t.id;
          const dot=(t.id==="faits"&&(faitsOpen>0||ows>0))||(t.id==="testequip"&&horsCalib>0);
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
              <button type="button" className="no-print" title="Copier les informations sous forme de tableau" aria-label="Copier les informations du dossier dans le presse-papier" onClick={async()=>{
                await copyRichToClipboard(buildOfClipboardData(h,activeUnit?[activeUnit]:snRows));
                setCopiedOfInfo(true);setTimeout(()=>setCopiedOfInfo(false),1800);
              }} style={{width:28,height:24,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:0,borderRadius:4,background:copiedOfInfo?C.green:C.blue,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:800}}>{copiedOfInfo?"✓":"📋"}</button>
              <button type="button" className="no-print" title={activeUnit?`Copier le lien vers ${snTitle(activeUnit)}`:"Copier le lien vers ce dossier"} aria-label="Copier le lien vers ce dossier" onClick={()=>{
                copyToClipboard(buildFolderLink({ofId:currentId,unitId:activeUnit?.id||"all",ofNumber:h.of,sn:activeUnit?.sn||"",lot:activeUnit?.lot||"",tab:activeTab}));
                setCopiedFolderLink(true);setTimeout(()=>setCopiedFolderLink(false),1800);
              }} style={{width:28,height:24,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:0,borderRadius:4,background:copiedFolderLink?C.green:C.blue,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:800}}>{copiedFolderLink?"✓":"🔗"}</button>
            </div>
            {perms.canWrite&&entryUnit&&<div className="no-print" style={{display:"flex",alignItems:"center",gap:8,fontSize:12,flexWrap:"wrap"}}>
              <label htmlFor="entry-target-sn" style={{fontWeight:700,color:C.accent}}>Nouvelle ligne pour</label>
              {activeUnitChoice==="all"?<select id="entry-target-sn" value={entryUnit.id} onChange={e=>setEntryUnitId(e.target.value)} style={{background:C.input,color:C.text,border:`1px solid ${C.blue}`,borderRadius:4,padding:"4px 8px",fontSize:12,maxWidth:260}}>
                {snRows.map(unit=><option key={unit.id} value={unit.id}>{snTitle(unit)}</option>)}
              </select>:<strong>{snTitle(entryUnit)}</strong>}
            </div>}
          </div>
          {headerPanel==="dossier" ? (
            <Header of={workHeader} onUpdate={updateHeader} user={user} onCommentsChange={v=>{const u={...ofData,header:{...ofData.header,comments:v}};setOfData(u);save(u);}} onUpdateStatus={async status=>{
              if(!isAdminManager(user)) return;
              try{
                if(window.storage.updateWorkOrderSummary){
                  const stored=await window.storage.updateWorkOrderSummary(`of:${currentId}`,{header:{status}});
                  const updated=applyHomeDocument(currentId,stored);
                  setOfData(updated);
                  setLastSaved(new Date().toLocaleTimeString("fr-FR"));
                  return;
                }
                const updated={...ofData,header:{...ofData.header,status}};
                setOfData(updated);save(updated);
              }catch(error){setSaveError(error?.message||"Le statut n'a pas été enregistré.");}
            }}/>
          ) : (
            <TrackedSNs data={ofData.units||{}} onChange={d=>updateTab("units",d)}
              splitHistory={ofData.lotSplits||[]} onSplitLot={(id,remaining,destinations)=>{const updated=splitTrackedLot(ofData,id,remaining,destinations,user);setOfData(updated);saveSections(["units","lotSplits","rework","consommables","testequip","faits","etuvage","demating","openwork"],updated);}}
              onLotQuantity={(id,qty)=>{const updated=changeTrackedLotQuantity(ofData,id,qty,user);setOfData(updated);saveSections(["units"],updated);}}
              onConvertUnit={(id,kind)=>{const updated=convertTrackedUnitKind(ofData,id,kind,user);setOfData(updated);saveSections(["units"],updated);}}
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
            <ReportHead tab="Suivi technique"/>
            <SectionTitle>Suivi technique</SectionTitle>
            <TabFaits data={ofData.faits||{}} onChange={d=>updateTab("faits",d)} user={user} perms={perms} faitTypes={faitTypes} onEditTypes={()=>setShowFaitTypes(true)} header={workHeader} forceShowDeleted={printAll} onCopyAcross={row=>setCopyAcrossRow({tab:"faits",row})} onCloseRow={(rowId,closed)=>closeWorkItem("faits",rowId,closed)}/>
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
