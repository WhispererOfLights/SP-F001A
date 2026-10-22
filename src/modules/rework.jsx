// ─── 1. Adjust / Rework — auto-visa Opér. ──────────────────────────────────
const ACTIONS = ["S","D","P","M","R","O"];
const ACTION_LABELS = {S:"Soudé",D:"Désoudé",P:"Pointé",M:"Matière",R:"Rework",O:"Observation"};
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
  {key:"remarques",label:"Remarque / observation"},
];
const reworkRequiredFields = action => action==="O"
  ? [{key:"repere",label:"Repère TOPO"},{key:"action1",label:"Action"},{key:"remarques",label:"Observation"}]
  : [
      {key:"repere",label:"Repère TOPO"},
      {key:"action1",label:"Action"},
      {key:"qty",label:"QTÉ"},
      {key:"fiche",label:"Fiche suiveuse"},
      {key:"etape",label:"OP"},
      ...(["S","D","P"].includes(action)?[{key:"valeur",label:"Valeur"}]:[]),
      ...(["S","P","M"].includes(action)?[{key:"codeERP",label:"Code article"}]:[]),
    ];
const REWORK_IMPORT_TEMPLATE = [
  "Repère topo","Qté","ADJ","Act.","Code article","Valeur - description","LOT","DC","SN composant","Fiche suiveuse","OP","Remarque"
].join("\t");
const normalizeReworkImportHeader = value => String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .toLowerCase().replace(/[°№]/g,"n").replace(/[^a-z0-9]+/g," ").trim();
const REWORK_IMPORT_HEADER_ALIASES = new Map([
  ["repere","repere"],["repere topo","repere"],["topo","repere"],
  ["qte","qty"],["quantite","qty"],["quantity","qty"],
  ["adj","isAdjust"],["adjust","isAdjust"],["ajustement","isAdjust"],
  ["act","action1"],["action","action1"],
  ["code article","codeERP"],["article","codeERP"],["code erp","codeERP"],["sap","codeERP"],["n article","codeERP"],
  ["valeur","valeur"],["valeur description","valeur"],["description","valeur"],
  ["lot","lot"],["dc","dc"],["date code","dc"],["datecode","dc"],
  ["sn","sn"],["sn composant","sn"],["n serie","sn"],["numero serie","sn"],
  ["fiche","fiche"],["fiche suiveuse","fiche"],["fiche suiveuse fait","fiche"],["document","fiche"],
  ["op","etape"],["n op","etape"],["operation","etape"],["etape","etape"],
  ["observation","remarques"],["observations","remarques"],["remarque","remarques"],["remarques","remarques"],
  ["remarque observation","remarques"],["commentaire","remarques"],
]);
const normalizeImportedReworkAction = value => {
  const raw=String(value||"").trim().toUpperCase();
  if(ACTIONS.includes(raw)) return raw;
  const text=normalizeReworkImportHeader(value);
  if(/^soud/.test(text)) return "S";
  if(/^desoud/.test(text)) return "D";
  if(/^point/.test(text)) return "P";
  if(/^matier/.test(text)) return "M";
  if(/^rework|^retouche/.test(text)) return "R";
  if(/^observ|^information/.test(text)) return "O";
  return raw;
};
const parseImportedAdjust = value => /^(1|x|oui|o|yes|true)$/i.test(String(value||"").trim());
const parseReworkClipboard = text => {
  const source=String(text||"").replace(/\r/g,"");
  const lines=source.split("\n").filter(line=>line.trim());
  if(!lines.length) return {rows:[],errors:[],unknownHeaders:[],hasHeader:false};
  const delimiter=lines.some(line=>line.includes("\t"))?"\t":lines.some(line=>line.includes(";"))?";":null;
  const split=line=>delimiter?line.split(delimiter).map(cell=>cell.trim()):[line.trim()];
  const first=split(lines[0]);
  const mapped=first.map(cell=>REWORK_IMPORT_HEADER_ALIASES.get(normalizeReworkImportHeader(cell))||"");
  const hasHeader=mapped.includes("repere");
  if(first.length>1&&!hasHeader) return {
    rows:[],unknownHeaders:[],hasHeader:false,
    errors:["La première ligne doit contenir les en-têtes, notamment « Repère topo »."],
  };
  const fieldMap=hasHeader?mapped:["repere"];
  const unknownHeaders=hasHeader?first.filter((cell,index)=>cell&&!mapped[index]):[];
  const rows=[];
  const errors=[];
  const dataLines=hasHeader?lines.slice(1):lines;
  dataLines.slice(0,250).forEach((line,index)=>{
    const cells=split(line);
    const row={};
    fieldMap.forEach((field,column)=>{if(field) row[field]=cells[column]||"";});
    row.repere=String(row.repere||"").trim().toUpperCase();
    row.action1=normalizeImportedReworkAction(row.action1);
    row.isAdjust=parseImportedAdjust(row.isAdjust);
    row.qty=String(row.qty||"").trim();
    row.codeERP=String(row.codeERP||"").trim();
    row.valeur=String(row.valeur||"").trim();
    row.lot=String(row.lot||"").trim().toUpperCase();
    row.dc=String(row.dc||"").trim().toUpperCase();
    row.sn=String(row.sn||"").trim();
    row.fiche=String(row.fiche||"").trim().toUpperCase();
    row.etape=String(row.etape||"").trim();
    row.remarques=String(row.remarques||"").trim();
    if(row.action1==="O"&&!row.remarques&&row.valeur){row.remarques=row.valeur;row.valeur="";}
    const lineNumber=index+(hasHeader?2:1);
    if(!row.repere) errors.push(`Ligne ${lineNumber} : repère topo manquant.`);
    else rows.push({...row,lineNumber});
  });
  if(dataLines.length>250) errors.push("L'import est limité à 250 lignes par opération.");
  return {rows,errors,unknownHeaders,hasHeader};
};
const IMPORTED_REWORK_COMPARE_FIELDS = REWORK_EDIT_FIELDS.filter(field=>field.key!=="createdDT");
const importedReworkChanges = row => row?.importOrigin?.originalFields
  ? changedFields(row.importOrigin.originalFields,row,IMPORTED_REWORK_COMPARE_FIELDS)
  : [];
const ImportOriginMark = ({row}) => {
  if(!row?.importOrigin) return null;
  const modified=importedReworkChanges(row).length>0;
  const origin=row.importOrigin;
  const title=[`Importé le ${origin.importedAt||"N/A"} par ${origin.importedBy||"N/A"}`,
    modified?`Modifié le ${origin.modifiedAt||"N/A"} par ${origin.modifiedBy||"N/A"}`:"Aucune modification depuis l'import"].join("\n");
  return <span aria-label={modified?"Importé, modifié":"Importé"} title={title}
    style={{display:"inline-block",marginTop:3,padding:"1px 4px",border:`1px solid ${modified?C.yellow:C.blue}`,
      borderRadius:3,color:modified?C.yellow:C.blue,fontSize:8,fontWeight:800,whiteSpace:"nowrap"}}>
    {modified?"Importé · modifié":"Importé"}
  </span>;
};
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
  const [recipient,setRecipient]=useState(LOGISTICS_DIRECTORY_RECIPIENT);
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
      <label style={{display:"block",marginBottom:10,fontSize:12}}>Destinataire<input aria-label="Destinataire" value={recipient} onChange={e=>setRecipient(e.target.value)} style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:7,background:C.input,color:C.blue,fontWeight:700,border:`1px solid ${C.blue}`,borderRadius:4}}/></label>
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
  const fields=["repere","qty","action1","codeERP","valeur","lot","dc","sn","fiche","etape","isAdjust","remarques"];
  const copied=duplicateRow({},user,{
    ...Object.fromEntries(fields.map(key=>[key,row[key]??(key==="isAdjust"?false:"")])),
    snScope:"custom",snIds:[unit.id],unitId:unit.id,snExcludeIds:[],comments:[],
    validated:true,visaOper:user.trigram,dateOper:now(),sortieVisa:"",copyOrigin,
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
    faits:["type","numero","commentaires"],
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
  rework:[row.repere,row.action1,row.codeERP,row.valeur,row.remarques],
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
const ReworkImportModal = ({header,existingRows=[],onImport,onClose}) => {
  const units=snRowsFromHeader(header);
  const preferred=(header?._entrySnIds||header?._defaultSnIds||[]).find(id=>units.some(unit=>unit.id===id));
  const [targetId,setTargetId]=useState(preferred||units[0]?.id||"all");
  const [text,setText]=useState("");
  const parsed=React.useMemo(()=>parseReworkClipboard(text),[text]);
  const unknownActions=parsed.rows.filter(row=>row.action1&&!ACTIONS.includes(row.action1));
  const existingKeys=new Set(existingRows.filter(row=>!row.deleted).map(row=>`${String(row.repere||"").trim().toUpperCase()}|${row.action1||""}`));
  const importKeyCounts=parsed.rows.reduce((counts,row)=>{
    const key=`${row.repere}|${row.action1||""}`;
    counts.set(key,(counts.get(key)||0)+1);
    return counts;
  },new Map());
  const isDuplicate=row=>existingKeys.has(`${row.repere}|${row.action1||""}`)||(importKeyCounts.get(`${row.repere}|${row.action1||""}`)||0)>1;
  const duplicateCount=parsed.rows.filter(isDuplicate).length;
  const canImport=parsed.rows.length>0&&!parsed.errors.length;
  return <div style={{position:"fixed",inset:0,zIndex:360,background:"#000000bb",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div role="dialog" aria-modal="true" aria-labelledby="rework-import-title"
      style={{width:1120,maxWidth:"100%",maxHeight:"92vh",overflowY:"auto",background:C.surface,color:C.text,border:`1px solid ${C.blue}`,borderRadius:6,padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start",marginBottom:12}}>
        <div>
          <h2 id="rework-import-title" style={{margin:0,fontSize:16}}>Importer un plan de travail ADJ/Rework</h2>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>Les lignes seront créées en brouillon. Le visa opérateur sera attribué uniquement lors de leur validation.</div>
        </div>
        <Btn small onClick={onClose} color={C.border}>Fermer</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 270px",gap:12,alignItems:"end",marginBottom:10}}>
        <label style={{display:"block",fontSize:11,color:C.muted}}>
          Tableau copié depuis Excel
          <textarea autoFocus aria-label="Tableau ADJ/Rework à importer" value={text} onChange={event=>setText(event.target.value)}
            placeholder={`${REWORK_IMPORT_TEMPLATE}\nR12\t1\tOui\tS\t250001234\t10K\t0000012345\t2642\tSN-COMP-01\tDOC-0013405_1\t30`}
            style={{display:"block",width:"100%",height:145,boxSizing:"border-box",marginTop:5,resize:"vertical",background:C.input,color:C.text,border:`1px solid ${parsed.errors.length?C.red:C.border}`,borderRadius:4,padding:9,fontFamily:"monospace",fontSize:11}}/>
        </label>
        <div>
          <label style={{display:"block",fontSize:11,color:C.muted,marginBottom:10}}>
            Destination des brouillons
            <select aria-label="Destination des brouillons importés" value={targetId} onChange={event=>setTargetId(event.target.value)}
              style={{display:"block",width:"100%",marginTop:5,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4,padding:"7px 8px",fontSize:11}}>
              {units.length>1&&<option value="all">Tous les SN / LOT</option>}
              {units.map(unit=><option key={unit.id} value={unit.id}>{snTitle(unit)}</option>)}
              {!units.length&&<option value="all">Dossier complet</option>}
            </select>
          </label>
          <Btn small color={C.blue} onClick={()=>copyToClipboard(REWORK_IMPORT_TEMPLATE)}>Copier les en-têtes</Btn>
        </div>
      </div>
      {parsed.errors.map(error=><div key={error} role="alert" style={{color:C.red,fontSize:11,marginBottom:4}}>{error}</div>)}
      {!!parsed.unknownHeaders.length&&<div style={{color:C.yellow,fontSize:11,marginBottom:6}}>Colonnes ignorées : {parsed.unknownHeaders.join(", ")}</div>}
      {!!unknownActions.length&&<div style={{color:C.yellow,fontSize:11,marginBottom:6}}>Certaines actions ne sont pas reconnues. Elles resteront à corriger dans les brouillons.</div>}
      {!!duplicateCount&&<div style={{color:C.yellow,fontSize:11,marginBottom:6}}>{duplicateCount} ligne{duplicateCount>1?"s":""} possède{duplicateCount>1?"nt":""} déjà le même repère et la même action. L'import reste autorisé.</div>}
      {!!parsed.rows.length&&<div style={{overflowX:"auto",border:`1px solid ${C.border}`,borderRadius:4,marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
          <thead><tr style={{background:C.raised}}>
            {["État","Ligne","Repère topo","Qté","ADJ","Act.","Code article","Valeur - description","LOT","DC","SN composant","Fiche suiveuse","OP","Remarque"].map(label=><TH key={label}>{label}</TH>)}
          </tr></thead>
          <tbody>{parsed.rows.slice(0,40).map((row,index)=><tr key={`${row.lineNumber}-${index}`} style={{background:index%2?C.stripe:"transparent"}}>
            <TD><span style={{color:isDuplicate(row)?C.yellow:C.green,fontWeight:800}}>{isDuplicate(row)?"Doublon possible":"Prêt"}</span></TD>
            {[row.lineNumber,row.repere,row.qty,row.isAdjust?"Oui":"Non",row.action1,row.codeERP,row.valeur,row.lot,row.dc,row.sn,row.fiche,row.etape,row.remarques].map((value,column)=><TD key={column}>{value||""}</TD>)}
          </tr>)}</tbody>
        </table>
        {parsed.rows.length>40&&<div style={{padding:7,color:C.muted,fontSize:10}}>Aperçu limité aux 40 premières lignes sur {parsed.rows.length}.</div>}
      </div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginTop:14}}>
        <span style={{fontSize:11,color:parsed.rows.length?C.green:C.muted}}>{parsed.rows.length} brouillon{parsed.rows.length>1?"s":""} prêt{parsed.rows.length>1?"s":""} à importer</span>
        <div style={{display:"flex",gap:8}}>
          <Btn small onClick={onClose} color={C.border}>Annuler</Btn>
          <Btn small onClick={()=>canImport&&onImport(parsed.rows,targetId)} color={C.blue} disabled={!canImport}>Importer {parsed.rows.length||""} brouillon{parsed.rows.length>1?"s":""}</Btn>
        </div>
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
  const [showImport,setShowImport]=useState(false);
  useEffect(()=>{setRequestIds([]);setShowMaterialDraft(false);setShowImport(false);},[header?.of,header?._defaultSnIds?.join("|")]);
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
  const importDrafts=(importRows,targetId)=>{
    if(!perms.canWrite||!importRows.length) return;
    const last=latestSharedFicheOp(contextData||{rework:data},header);
    const importedAt=nowDT();
    const batchId=uid();
    const scope=targetId&&targetId!=="all"
      ? {snScope:"custom",snIds:[targetId],unitId:targetId}
      : {snScope:"all",snIds:[],unitId:""};
    const drafts=importRows.map(source=>{
      const row={
        id:uid(),createdVisa:"",createdDT:"",...scope,
        sortieVisa:"",repere:source.repere||"",
        qty:source.action1==="O"?"":source.qty||(source.repere&&source.action1!=="M"?"1":""),
        action1:ACTIONS.includes(source.action1)?source.action1:"",
        codeERP:source.action1==="O"?"":source.codeERP||"",
        valeur:source.action1==="O"?"":source.valeur||"",
        lot:source.action1==="O"?"":normLot(source.lot||""),
        dc:source.action1==="O"?"":source.dc||"",
        sn:source.action1==="O"?"":source.sn||"",
        fiche:source.fiche||last.fiche||"",etape:source.etape||last.op||"",ficheOpUpdatedAt:Date.now(),
        isAdjust:source.action1==="O"?false:!!source.isAdjust,
        visaOper:"",dateOper:"",visaCtrl:"",dateCtrl:"",
        remarques:source.remarques||"",editHistory:[],validated:false,validError:"",deleted:false,
        tracaOk:false,visaTraca:"",dateTraca:"",
      };
      return {...row,importOrigin:{source:"clipboard",batchId,rowNumber:source.lineNumber,
        importedBy:user?.trigram||"",importedAt,modifiedBy:"",modifiedAt:"",
        originalFields:snapshotFields(row,REWORK_EDIT_FIELDS)}};
    });
    setFilters({snTarget:workSnFilter(header),repere:"",action1:"",codeERP:"",valeur:"",lot:"",dc:"",sn:"",fiche:"",etape:"",adjust:"all"});
    setShowImport(false);
    setFocusNewId(drafts[0]?.id||null);
    onChange({rows:[...rows,...drafts.slice().reverse()]});
  };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const [hideAchevees,setHideAchevees] = useState(true);
  const [filters,setFilters] = useState({snTarget:workSnFilter(header), repere:"", action1:"", codeERP:"", valeur:"", lot:"", dc:"", sn:"", fiche:"", etape:"", adjust:"all"});
  useEffect(()=>setFilters(s=>({...s,snTarget:workSnFilter(header)})),[header?._defaultSnIds?.join("|"),header?._snRows?.length]);
  const importAwarePatch=(row,patch)=>{
    const fields=typeof patch==="function"?patch(row):patch;
    if(!row?.importOrigin) return fields;
    const next={...row,...fields};
    const changed=IMPORTED_REWORK_COMPARE_FIELDS.some(field=>String(row?.[field.key]??"")!==String(next?.[field.key]??""));
    return changed?{...fields,importOrigin:{...row.importOrigin,modifiedBy:user?.trigram||"",modifiedAt:nowDT()}}:fields;
  };
  const upd=(id,f,v)=>{
    const r=rows.find(x=>x.id===id);
    if(f==="comments" ? !canCommentRow() : !canEdit(r)) return;
    onChange({rows:scopedRowsPatch(rows,id,header,current=>importAwarePatch(current,{[f]:v,...(["fiche","etape"].includes(f)?{ficheOpUpdatedAt:Date.now()}:{})}))});
  };
  const updAction=(id,nextAction)=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)||r.action1===nextAction) return;
    if(r.visaCtrl&&!canActionReceiveCtrl(nextAction)){
      const actionLabel=ACTION_LABELS[nextAction]||nextAction;
      if(!window.confirm(`L'action ${actionLabel} ne permet pas de contrôle. Retirer le CTRL existant avant de changer l'action ?`)) return;
      onChange({rows:scopedRowsPatch(rows,id,header,current=>importAwarePatch(current,{
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
      }))});
      return;
    }
    upd(id,"action1",nextAction);
  };
  const patchRow=(id,fields)=>{ const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,current=>importAwarePatch(current,fields))}); };
  const updRepere=(id,v)=>{
    const row=rows.find(x=>x.id===id);
    if(!canEdit(row)) return;
    onChange({rows:scopedRowsPatch(rows,id,header,r=>{
      const nextKey=String(v||"").trim().toUpperCase();
      return importAwarePatch(r,{
        repere:String(v||"").toUpperCase(),
        qty:nextKey&&r.qty===""&&r.action1!=="M"?"1":r.qty,
        isAdjust:priorAdjust(r,nextKey)||!!r.isAdjust
      });
    })});
  };
  const updAdjust=(id,checked)=>{
    const row=rows.find(r=>r.id===id);
    if(!canEdit(row)) return;
    onChange({rows:scopedRowsPatch(rows,id,header,current=>importAwarePatch(current,{isAdjust:checked}))});
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
  const isAchevee = r => r.action1==="O"
    ? !!r.validated
    : r.action1!=="P" && (!["S","R"].includes(r.action1)||!!r.visaCtrl) && !!r.tracaOk && missingReworkTrace(r,true).length===0;
  const acheveesCount = rows.filter(r=>!r.deleted&&isAchevee(r)).length;
  const visibleRows = sortByNewestOperation(rows).filter(r=>{
    if(r.deleted&&!showDeleted&&!forceShowDeleted) return false;
    if(!r.deleted&&hideAchevees&&!forceShowDeleted&&isAchevee(r)) return false;
    const txt = key => String(r[key]||"").toUpperCase();
    if(!rowMatchesSnFilter(r,filters.snTarget,header)) return false;
    if(filters.repere&& !txt("repere").includes(filters.repere.toUpperCase())) return false;
    if(!filterMatches(filters.action1,r.action1)) return false;
    if(filters.codeERP&& !txt("codeERP").includes(filters.codeERP.toUpperCase())) return false;
    if(filters.valeur&& !`${txt("valeur")} ${txt("remarques")}`.includes(filters.valeur.toUpperCase())) return false;
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

  const validateRow=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    const refuse=message=>{
      upd(id,"validError",message);
      window.alert(`Ligne non validée :\n\n${message}`);
    };
    const required = reworkRequiredFields(r?.action1);
    const miss=checkRequired(r,required);
    if(miss.length) { refuse("Champs requis manquants : "+miss.join(", ")); }
    else {
      const checks=computeReworkWarnings(rows.filter(x=>x.validated||x.id===id),snRows);
      const sequence=checks.sequence.filter(w=>w.row.id===id||w.previous.id===id);
      if(sequence.length){
        refuse(sequence.map(w=>`${w.snLabel} - ${w.repere} : ${w.previous.action1} → ${w.row.action1} interdit`).join(" ; "));
        return;
      }
      onChange({rows:scopedRowsPatch(rows,id,header,x=>{
        const finalized=withEditHistory(x,user,REWORK_EDIT_FIELDS);
        return x.importOrigin?{...finalized,createdVisa:user?.trigram||"",createdDT:nowDT()}:finalized;
      })});
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
          {perms.canWrite&&<Btn onClick={()=>setShowImport(true)} color={C.blue} small>Importer un plan de travail</Btn>}
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
              <TH w={82}>SN / LOT</TH>
              <TH w={66}>Repère TOPO</TH>
              <TH w={58}>Adj</TH>
              <TH w={38}>QTÉ</TH>
              <TH w={62}>Action</TH>
              <TH w={92}>Code article</TH>
              <TH w={92}>Valeur</TH>
              <TH w={118}>LOT</TH>
              <TH w={68}>DC</TH>
              <TH w={104}>SN</TH>
              <TH w={170}>Fiche suiveuse</TH>
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
              const isObservation=r.action1==="O";
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
                <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span><CopyOriginMark origin={r.copyOrigin}/><ImportOriginMark row={r}/></TD>
                <TD style={{pointerEvents:r.deleted?"none":"all"}}><SnScopePicker row={r} header={header} onChange={fields=>patchRow(r.id,fields)} disabled={locked}/></TD>
                <TD><Input entryField="repere" value={r.repere} onChange={v=>updRepere(r.id,v)} small readOnly={locked} style={{...(locked?LOCKED_INPUT_STYLE:{}),textTransform:"uppercase"}}/></TD>
                <TD center style={{pointerEvents:r.deleted?"none":"all"}}>
                  <input data-entry-field="isAdjust" type="checkbox" checked={isAdjustRow(r)} disabled={locked||isObservation}
                    onChange={e=>updAdjust(r.id,e.target.checked)}
                    title="Composant adjust : appliqué à toutes les lignes du même repère"
                      style={{width:16,height:16,accentColor:C.accent,cursor:locked?"default":"pointer"}}/>
                </TD>
                <TD>
                  {!isObservation&&(r.action1==="M"||!r.repere)
                    ? <Input entryField="qty" value={r.qty} onChange={v=>upd(r.id,"qty",v)} small readOnly={locked} style={{...(locked?LOCKED_INPUT_STYLE:{})}}/>
                    : <span style={{fontFamily:"monospace",fontSize:11,color:C.muted,padding:"0 4px"}}>—</span>}
                </TD>
                <TD><Select entryField="action1" value={r.action1} onChange={v=>updAction(r.id,v)} options={ACTIONS} disabled={locked} style={{width:"100%",padding:"4px 3px"}}/></TD>
                <TD><CopyCell value={r.codeERP} title="Copier code article">
                  <Input entryField="codeERP" value={isObservation?"":r.codeERP} onChange={v=>upd(r.id,"codeERP",v)} small readOnly={locked||isObservation} style={{width:"100%",fontFamily:"monospace",...((locked||isObservation)?LOCKED_INPUT_STYLE:{})}} title={isObservation?"Non applicable à une observation":"Code article ou texte libre"} placeholder={isObservation?"N/A":"Code article"}/>
                </CopyCell></TD>
                <TD><Input entryField="valeur" value={isObservation?"":r.valeur} onChange={v=>upd(r.id,"valeur",v)} small readOnly={locked||isObservation}
                  title={coherenceIssues.length?coherenceIssues.map(w=>`Cohérence valeur : ${w.previous.action1} ${w.previous.valeur||"?"} ≠ ${w.current.action1} ${w.current.valeur||"?"}`).join("\n"):"Valeur du composant"}
                  placeholder={isObservation?"N/A":""} style={{width:"100%",...((locked||isObservation)?LOCKED_INPUT_STYLE:{}),...coherenceStyle}}/></TD>
                <TD><CopyCell value={r.lot} title="Copier LOT">
                  <Input entryField="lot" value={isObservation?"":r.lot} onChange={v=>upd(r.id,"lot",v.toUpperCase().slice(0,12))} onBlur={e=>upd(r.id,"lot",normLot(e.target.value))} small readOnly={locked||isObservation} placeholder={isObservation?"N/A":""} title={isObservation?"Non applicable à une observation":"Lot : numérique sur 10 chiffres, ou texte libre / N/A"} style={{width:"100%",fontFamily:"monospace",...((locked||isObservation)?LOCKED_INPUT_STYLE:{}),...(traceMissing.includes("LOT")?missingStyle:{})}}/>
                </CopyCell></TD>
                <TD>
                  <div style={{display:"flex",alignItems:"center",gap:2,minWidth:0}}>
                    <div style={{flex:1,minWidth:0}}><Input entryField="dc" value={isObservation?"":r.dc} onChange={v=>upd(r.id,"dc",v.toUpperCase().slice(0,6))}
                      small readOnly={locked||isObservation} placeholder={isObservation?"N/A":""} title={isObservation?"Non applicable à une observation":dc&&!dc.ok?`Anomalie : DC ${r.dc} — ${dc.label} à la date de la ligne`:dc?.label||"DC (ex: 2552R1) ou N/A si non disponible"}
                      style={{width:"100%",fontFamily:"monospace",...((locked||isObservation)?LOCKED_INPUT_STYLE:{}),
                        borderColor:dc&&!dc.ok?C.red:dc?.ok?C.green:undefined,
                        color:dc&&!dc.ok?C.red:dc?.ok?C.green:undefined,
                        ...(traceMissing.includes("DC")?missingStyle:{})}}/></div>
                  </div>
                </TD>
                <TD><CopyCell value={r.sn} title="Copier SN">
                  <Input entryField="sn" value={isObservation?"":r.sn} onChange={v=>upd(r.id,"sn",v)} small readOnly={locked||isObservation} placeholder={isObservation?"N/A":""} style={{width:"100%",...((locked||isObservation)?LOCKED_INPUT_STYLE:{})}}/>
                </CopyCell></TD>
                <TD><Input entryField="fiche" value={r.fiche} onChange={v=>upd(r.id,"fiche",v.toUpperCase())} small required readOnly={locked}
                  title="Fiche suiveuse / FT / NC / DM (ex : DOC-0013405_Rev.1)"
                  displayPlaceholder="Ex. DOC-0013405_Rev.1"
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
                  {isObservation
                    ? <span title="Traçabilité composant non applicable à une observation" style={{fontFamily:"monospace",fontSize:10,color:C.muted}}>N/A</span>
                    : <StampStatus done={!!r.tracaOk} visa={r.visaTraca} date={r.dateTraca}
                        color={C.green} label="Traça" onStamp={()=>stampTraca(r.id)}
                        onClear={()=>clearTraca(r.id)} canClear={!r.deleted&&perms.canTraceability} clearTitle="Dévalider la traçabilité"
                        onDateChange={r.editBase&&!r.deleted&&perms.canTraceability?v=>setTracaDate(r.id,v):null}
                        disabled={r.deleted||!perms.canTraceability}/>}
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
              (isObservation||String(r.remarques||"").trim())&&(
                <tr key={r.id+"_observation"} style={{background:r.deleted?"#da363318":i%2===0?C.blue+"08":C.stripe,borderLeft:r.validated?`3px solid ${C.green}`:`3px solid ${C.border}`}}>
                  <td colSpan={99} style={{padding:"4px 8px 7px",textDecoration:r.deleted?"line-through":undefined,color:r.deleted?C.red:undefined}}>
                    <div style={{display:"grid",gridTemplateColumns:"110px minmax(240px,1fr)",alignItems:"center",gap:8}}>
                      <strong style={{fontSize:10,color:C.blue,textTransform:"uppercase",letterSpacing:.5}}>{isObservation?"Observation":"Remarque"}</strong>
                      <Input entryField="remarques" value={r.remarques||""} onChange={v=>upd(r.id,"remarques",v)} small required={isObservation} readOnly={locked}
                        placeholder={isObservation?"Ex. C100 : constat vérifié, laissé en l’état":"Remarque associée à cette opération"}
                        title={isObservation?"Observation liée au repère TOPO":"Remarque associée à cette opération"}
                        style={{width:"100%",...(!r.remarques&&!locked?missingStyle:{}),...(locked?LOCKED_INPUT_STYLE:{})}}/>
                    </div>
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
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>✦ Visa Opér. pré-rempli hors import · ✓ Valider pour verrouiller · × Annuler sur ligne validée = barre et conserve la traçabilité</div>
      {showImport&&perms.canWrite&&<ReworkImportModal header={header} existingRows={rows} onImport={importDrafts} onClose={()=>setShowImport(false)}/>}
      {showMaterialDraft&&perms.canWrite&&requestRows.length>0&&<MaterialRequestModal header={header} rows={requestRows} user={user} onClose={()=>setShowMaterialDraft(false)}/>}
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};
