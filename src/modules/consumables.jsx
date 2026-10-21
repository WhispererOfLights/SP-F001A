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
              <TH w={150}>Fiche suiveuse</TH>
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
                  <TD><Input value={o.fiche} onChange={v=>updOp(oid,"fiche",v)} small readOnly={locked}
                    title="Fiche suiveuse (ex : DOC-0013405_Rev.1)"
                    displayPlaceholder="Ex. DOC-0013405_Rev.1"
                    style={{fontFamily:"monospace",...(locked?LOCKED_INPUT_STYLE:{borderColor:!o.fiche?C.yellow:C.border})}}/></TD>
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
