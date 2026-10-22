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
  if(effectiveScopedRows(data,"faits").some(r=>r.type!=="OW"&&!r.closedDate)) messages.push("Suivi technique ouvert");
  if(effectiveScopedRows(data,"faits").some(r=>r.type==="OW"&&!r.closedDate)) messages.push("Open Work ouvert");
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
const homeClipboardData = rows => {
  const seen=new Set();
  const values=(rows||[]).filter(row=>{
    const key=homeRowKey(row);
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(row=>{
    const article=compactArticleCode(row.codeArticle||row.articleNo)||"N/A";
    const description=String(row.description||"N/A").trim()||"N/A";
    return {
      of:row.of||"N/A",articleDescription:`${article} - ${description}`,
      sn:row.sn,lot:row.lot,unitKind:row._homeUnitKind,
      quantity:row._homeQty,otp:row.otp||row.projet||"N/A",
    };
  });
  return buildTrackedUnitsClipboardData(values);
};
const homeOtpName = row => String(row.otp||row.projet||"Non renseigné").trim()||"Non renseigné";
const hasSingleMeetingOtp = rows => new Set(rows.map(homeOtpName)).size===1;
const FOLDER_LINK_TABS=new Set(["rework","consommables","etuvage","testequip","demating","faits"]);
const appBaseHref = () => {
  if(typeof window==="undefined") return "http://neu-jgr-sp:5181/";
  return String(window.SP_F001A_PUBLIC_URL||"").trim()||window.location?.href||"http://neu-jgr-sp:5181/";
};
const currentBrowserHref = () => typeof window!=="undefined"&&window.location?.href
  ? window.location.href
  : "http://neu-jgr-sp:5181/";
const buildFolderLink = ({ofId,unitId="",ofNumber="",sn="",lot="",tab="rework"},baseHref=appBaseHref()) => {
  const url=new URL(baseHref);
  url.search="";
  url.hash="";
  url.searchParams.set("dossier",String(ofId||"").trim());
  if(String(unitId||"").trim()) url.searchParams.set("piece",String(unitId).trim());
  if(String(ofNumber||"").trim()) url.searchParams.set("of",String(ofNumber).trim());
  if(String(sn||"").trim()) url.searchParams.set("sn",String(sn).trim());
  else if(String(lot||"").trim()) url.searchParams.set("lot",String(lot).trim());
  if(FOLDER_LINK_TABS.has(tab)) url.searchParams.set("onglet",tab);
  return url.toString();
};
const parseFolderLink = (href=currentBrowserHref()) => {
  try{
    const url=new URL(href);
    const ofId=String(url.searchParams.get("dossier")||"").trim();
    const ofNumber=String(url.searchParams.get("of")||"").trim();
    if(!ofId&&!ofNumber) return null;
    const requestedTab=String(url.searchParams.get("onglet")||"").trim();
    return {
      ofId,
      unitId:String(url.searchParams.get("piece")||"").trim(),
      ofNumber,
      sn:String(url.searchParams.get("sn")||"").trim(),
      lot:String(url.searchParams.get("lot")||"").trim(),
      tab:FOLDER_LINK_TABS.has(requestedTab)?requestedTab:"rework"
    };
  }catch{return null;}
};
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
const closureFactLabel = fact => String(fact?.type||"").toUpperCase()==="OW"
  ? technicalFollowUpLabel(fact)
  : fact.numero||fact.commentaires||"Fait";
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
const folderLinksForMail = (groups,tab="rework") => [
  "Accès aux dossiers :",
  ...groups.map(group=>{
    const unitIds=[...new Set(group.rows.map(row=>row._homeUnitId).filter(Boolean))];
    const unitId=unitIds.length===1?unitIds[0]:"all";
    const unit=unitIds.length===1?group.rows[0]:null;
    return `OF ${group.of} : ${buildFolderLink({ofId:group.id,unitId,ofNumber:group.of,sn:unit?.sn||"",lot:unit?.lot||"",tab})}`;
  }),
  ""
];
const buildClosureRequest = ({rows,user}) => {
  const groups=groupHomeMailRows(rows);
  const otps=[...new Set(groups.map(group=>group.otp).filter(Boolean))];
  const intro="Merci de clôturer et mettre en stock les sous-ensembles suivants :";
  return {
    subject:`Clôture | OF ${compactOfRanges(groups.map(group=>group.of))}${otps.length?` | OTP ${otps.join("; ")}`:""}`,
    body:["Bonjour,","",intro,"",...closureMailTable(groups),...folderLinksForMail(groups),"Merci,",[user.prenom,user.nom].filter(Boolean).join(" ")||user.trigram,user.trigram].join("\n")
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
    body:["Bonjour,","",intro,"",...closureMailTable(groups),...folderLinksForMail(groups),"Merci,",[user.prenom,user.nom].filter(Boolean).join(" ")||user.trigram,user.trigram].join("\n")
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
  const [recipient,setRecipient]=useState(isIp?"":LOGISTICS_DIRECTORY_RECIPIENT);
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
  const [draftOpened,setDraftOpened]=useState(false);
  const [sending,setSending]=useState(false);
  useEffect(()=>{if(isIp)setDraft(buildIpInvitation({rows,user,ipName}));},[ipName]);
  const color=isIp?C.yellow:C.green;
  const copy=async()=>{
    const text=`Objet : ${draft.subject}\n\n${draft.body}`;
    try{await navigator.clipboard.writeText(text);setMessage("Brouillon copié");}
    catch{setMessage("Copie impossible");}
  };
  const closeModal=async()=>{
    if(isIp||!draftOpened||!onMarkForClosure){onClose();return;}
    if(!window.confirm(`Mettre les ${rows.length} SN / LOT sélectionné${rows.length>1?"s":""} au statut « À clôturer » ?`)){onClose();return;}
    setSending(true);
    setMessage("Mise à jour des statuts en cours…");
    try{
      await onMarkForClosure(rows);
      onClose();
    }catch(error){
      setMessage(`Mise à jour impossible : ${error?.message||error}`);
      setSending(false);
    }
  };
  return <div style={{position:"fixed",inset:0,zIndex:340,background:"#000000aa",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div role="dialog" aria-modal="true" aria-labelledby="home-mail-title" style={{width:850,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",background:C.surface,color:C.text,border:`2px solid ${color}`,borderRadius:6,padding:18,boxShadow:`0 0 0 4px ${color}18`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <h2 id="home-mail-title" style={{margin:0,fontSize:16,color}}>{isIp?"Séance IP":"Clôture logistique"} — {rows.length} sous-ensemble{rows.length>1?"s":""}</h2>
        <button type="button" aria-label="Fermer" title="Fermer" disabled={sending} onClick={closeModal} style={{border:0,background:"transparent",color:C.muted,fontSize:20,cursor:sending?"wait":"pointer"}}>×</button>
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
          style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:7,background:C.input,color:C.blue,fontWeight:700,border:`1px solid ${C.blue}`,borderRadius:4}}/>
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
      <label style={{display:"block",marginBottom:10,fontSize:12}}>Objet
        <input aria-label="Objet" value={draft.subject} onChange={e=>setDraft(d=>({...d,subject:e.target.value}))}
          style={{width:"100%",boxSizing:"border-box",marginTop:4,padding:7,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
      </label>
      <label style={{display:"block",fontSize:12}}>Message
        <textarea aria-label="Message" value={draft.body} onChange={e=>setDraft(d=>({...d,body:e.target.value}))}
          style={{display:"block",width:"100%",boxSizing:"border-box",marginTop:4,height:330,maxHeight:"50vh",resize:"vertical",padding:10,fontFamily:"system-ui,sans-serif",fontSize:13,lineHeight:1.5,background:C.input,color:C.text,border:`1px solid ${C.border}`,borderRadius:4}}/>
      </label>
      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <span role="status" style={{fontSize:12,color:message.includes("impossible")?C.red:C.green}}>{message}</span>
        <Btn onClick={closeModal} disabled={sending} color={C.border} small>{sending?"Mise à jour…":"Fermer"}</Btn>
        <Btn onClick={copy} color={C.border} small>Copier le brouillon</Btn>
        {isIp?<Btn disabled={!ipName.trim()||!meetingDate||!meetingTime||!projectMeetingEmails.length||!assuranceMeetingEmails.length||!draft.subject.trim()||!draft.body.trim()} onClick={()=>{
          downloadOutlookMeeting({draft,date:meetingDate,time:meetingTime,duration:meetingDuration,location:[meetingRoom,meetingPlace].map(value=>value.trim()).filter(Boolean).join(" "),requiredRecipients:requiredMeetingEmails,optionalRecipients:optionalMeetingEmails,user});
          setMessage("Brouillon Outlook créé : ouvrez-le, modifiez-le puis cliquez sur Inviter des participants pour l’envoyer.");
        }} color={color} small>Créer le brouillon Outlook</Btn>:<Btn disabled={sending||!recipient.trim()||!draft.subject.trim()||!draft.body.trim()} onClick={()=>{
          const cc=ccEmails.length?`&cc=${encodeURIComponent(ccEmails.join(","))}`:"";
          window.location.href=`mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(draft.subject)}${cc}&body=${encodeURIComponent(draft.body)}`;
          setDraftOpened(true);
          setMessage("Brouillon Outlook ouvert. Le statut sera proposé à la fermeture.");
        }} color={color} small>Ouvrir la messagerie</Btn>}
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
const homeFactSearchText = facts => (facts||[]).map(fact=>[
  fact.type,fact.numero,fact.commentaires,fact.date,fact.visa,fact.closedDate,fact.closedVisa,
].filter(Boolean).join(" ")).join(" ");
const OFSelector = ({ofList,consommables,onSelect,onCreate,onDelete,onImportOFs,user,onLogout,openHistory,onUpdateStatus,onUnitStatusChange,onBulkUnitStatusChange,onFinishedSnChange,onSaveProfile,onManageUsers,onManageStatuses}) => {
  const blankForm = {of:"",sn:"",snLines:"",lot:"",snProduitFini:"",codeArticle:"",description:"",otp:"",ofRework:"non",typeOF:"production",status:"en_cours"};
  const [search,setSearch]          = useState("");
  const [page,setPage]               = useState(0);
  const [pageSize,setPageSize]=useState(25);
  const [columnFilters,setColumnFilters]=useState({});
  const [dataById,setDataById]=useState({});
  const [sort,setSort]               = useState("opens");
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
  const [expandedOfIds,setExpandedOfIds] = useState([]);
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
          data=withUnitMetadata(data);
          return {id:o.id,data,worked:workedOnOf(data,user.trigram)||workedOnOf(o,user.trigram),warnings:ofWarnings(data,consommables),openOW:effectiveScopedRows(data,"faits").filter(r=>r.type==="OW"&&!r.closedDate).length,etuvages:effectiveEtuvageRows(data),snLabels:(data.units?.rows||snRowsFromHeader(data.header)).filter(u=>!u.deleted&&hasUnitIdentity(u)).map(snTitle)};
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
    if(key==="followup") return `${o._homeFactSearch||""} ${(warningsById[o.id]||[]).join(" ")} ${openOWById[o.id]?`OW ${openOWById[o.id]}`:""}`;
    return String(o[key]||"");
  };
  const homeSortValue=(o,key)=>{
    if(key==="nextEtuvage") return nextEtuvageForRow(o).nextAt||"";
    if(key==="facts") return (o._homeFacts||[]).map(closureFactLabel).filter(Boolean).join(" ");
    if(key==="tracking") return `${warningsById[o.id]?.length||0} ${openOWById[o.id]||0} ${pendingHomePolymerization(dataById[o.id],consommables,o._homeUnitId,homeNow)?1:0}`;
    if(key==="followup") return `${(o._homeFacts||[]).map(closureFactLabel).filter(Boolean).join(" ")} ${warningsById[o.id]?.length||0} ${openOWById[o.id]||0} ${pendingHomePolymerization(dataById[o.id],consommables,o._homeUnitId,homeNow)?1:0}`;
    return columnValue(o,key);
  };
  const baseHomeRows=sorted.flatMap(o=>homeRowsForOf(o,dataById[o.id])).map(row=>{
    const facts=homeFactsForUnit(dataById[row.id],row._homeUnitId);
    return {...row,_homeFacts:facts,_homeFactSearch:homeFactSearchText(facts)};
  });
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
    return !q||[o.of,o.sn,o.lot,o.snProduitFini,o.description,o.otp,o.projet,o.ofRework,o.codeArticle,
      STATUTS[o.status||"en_cours"]?.label,STATUTS[o.unitStatus||"en_cours"]?.label,
      o._homeFactSearch
    ].some(v=>String(v||"").toLowerCase().includes(q));
  });
  const searchActive=!!search.trim()||Object.values(columnFilters).some(value=>String(value).trim());
  const workedFilter=homeWorkedFilter(matching,workedIds,onlyWorked,searchActive);
  const filtered=workedFilter.rows;
  const revealMatchingUnits=searchActive||filterStatus.length>0||onlyWarnings;
  const visibleRows=revealMatchingUnits?filtered:filtered.filter((row,index,rows)=>
    expandedOfIds.includes(row.id)||rows.findIndex(item=>item.id===row.id)===index
  );
  const totalPages=Math.ceil(visibleRows.length/pageSize);
  const currentPage=Math.min(page,Math.max(0,totalPages-1));
  const paged=visibleRows.slice(currentPage*pageSize,(currentPage+1)*pageSize);
  const selectedRows=allHomeRows.filter(row=>selectedKeys.includes(homeRowKey(row)));
  const selectionMode=selectedRows.length>0;
  const mixedMeetingOtp=selectedRows.length>0&&!hasSingleMeetingOtp(selectedRows);
  const isCollapsedHomeRow=row=>!revealMatchingUnits&&!expandedOfIds.includes(row.id)&&allHomeRows.filter(item=>item.id===row.id).length>1;
  const pageSelectionKeys=[...new Set(paged.flatMap(row=>isCollapsedHomeRow(row)
    ? allHomeRows.filter(item=>item.id===row.id).map(homeRowKey)
    : [homeRowKey(row)]))];
  const allPageSelected=!!pageSelectionKeys.length&&pageSelectionKeys.every(key=>selectedKeys.includes(key));
  const toggleSelected=row=>setSelectedKeys(keys=>keys.includes(homeRowKey(row))?keys.filter(key=>key!==homeRowKey(row)):[...keys,homeRowKey(row)]);
  const toggleOfSelection=id=>setSelectedKeys(keys=>{
    const groupKeys=allHomeRows.filter(row=>row.id===id).map(homeRowKey);
    const allSelected=groupKeys.length&&groupKeys.every(key=>keys.includes(key));
    return allSelected?keys.filter(key=>!groupKeys.includes(key)):[...new Set([...keys,...groupKeys])];
  });
  const toggleOfExpanded=id=>{setExpandedOfIds(ids=>ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]);setPage(0);};
  const togglePageSelection=checked=>setSelectedKeys(keys=>checked
    ? [...new Set([...keys,...pageSelectionKeys])]
    : keys.filter(key=>!pageSelectionKeys.includes(key)));
  const copyHomeRows=async(rows,key)=>{
    await copyRichToClipboard(homeClipboardData(rows));
    setCopiedTeamsKey(key);
    setTimeout(()=>setCopiedTeamsKey(current=>current===key?"":current),1800);
  };
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
          <Input value={search} onChange={v=>{setSearch(v);setPage(0);}} title="Rechercher un OF, SN ou lot" placeholder="🔍  OF, SN, LOT, OTP, NC, DM, ISS…"/>
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

      {selectionMode&&<div role="toolbar" aria-label="Actions sur la sélection" style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:12,padding:"8px 10px",background:C.blue+"10",border:`1px solid ${C.blue}`,borderRadius:6}}>
        <strong style={{color:C.blue,fontSize:12,minWidth:105}}>{selectedRows.length} sélectionnée{selectedRows.length>1?"s":""}</strong>
        <Btn onClick={()=>copyHomeRows(selectedRows,"selection")} color={copiedTeamsKey==="selection"?C.green:C.blue} small>{copiedTeamsKey==="selection"?"✓ Copié":"📋 Copier la sélection"}</Btn>
        <Btn onClick={()=>setShowBulkPdf(true)} color={C.blue} small>Imprimer les dossiers</Btn>
        <Btn onClick={exportBulkComponentSheets} color={C.blue} small>Feuilles composants</Btn>
        {isAdminManager(user)&&<>
          <Btn onClick={()=>setHomeMailKind("closure")} color={C.green} small>Clôture logistique</Btn>
          <Btn onClick={()=>setHomeMailKind("ip")} color={C.yellow} small disabled={mixedMeetingOtp}>Inspection IP</Btn>
        </>}
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
                <TH w={34}><input aria-label="Sélectionner les lignes de la page" type="checkbox" checked={allPageSelected} onChange={e=>togglePageSelection(e.target.checked)}/></TH>
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
                {sortableTh("followup","Suivi technique",330)}
                <TH w={isAdminManager(user)?140:80}></TH>
              </tr>
              <tr style={{background:C.raised}}>
                <td/>
                <td><button type="button" title="Effacer les filtres de colonne" aria-label="Effacer les filtres de colonne" onClick={()=>{setColumnFilters({});setFilterStatus([]);setPage(0);}} style={{border:0,background:"transparent",color:C.muted,cursor:"pointer"}}>×</button></td>
                {[['of','OF'],['codeArticle','N° Article'],['sn','SN'],['lot','LOT'],['description','Description'],['otp','OTP'],['snProduitFini','SN Produit Fini'],['reprise','Reprise'],['status','Statut OF'],['unitStatus','Statut SN'],['nextEtuvage','Prochain étuvage']].map(([key,label])=><td key={key} style={{padding:"4px 5px"}}>{columnFilter(key,label)}</td>)}
                <td style={{padding:"4px 5px"}}>{columnFilter("followup","Suivi technique")}</td>
                <td/>
              </tr>
            </thead>
            <tbody>
              {paged.map((o,i)=>{
                const isFav=favs.includes(o.id);
                const snLabels=snLabelsById[o.id]||snRowsFromHeader(o).map(snTitle);
                const ofRows=allHomeRows.filter(row=>row.id===o.id);
                const multiSn=ofRows.length>1;
                const collapsed=multiSn&&!revealMatchingUnits&&!expandedOfIds.includes(o.id);
                const selected=collapsed?ofRows.every(row=>selectedKeys.includes(homeRowKey(row))):selectedKeys.includes(homeRowKey(o));
                const groupStart=i===0||paged[i-1].id!==o.id;
                const displayUnitId=collapsed?null:o._homeUnitId;
                const polymerization=pendingHomePolymerization(dataById[o.id],consommables,displayUnitId,homeNow);
                const facts=[...(collapsed?ofRows.flatMap(row=>row._homeFacts||[]):o._homeFacts||[])]
                  .filter((fact,index,list)=>list.findIndex(item=>(item.id&&item.id===fact.id)||(!item.id&&item.type===fact.type&&item.numero===fact.numero))===index);
                const snCount=ofRows.filter(row=>row.sn).length;
                const lotCount=ofRows.filter(row=>row.lot).length;
                const snSummary=snCount?`${snCount} SN`:"—";
                const lotSummary=lotCount?`${lotCount} LOT`:"—";
                const summaryName=[snCount&&`${snCount} SN`,lotCount&&`${lotCount} LOT`].filter(Boolean).join(" / ")||`${ofRows.length} élément(s)`;
                const groupStatuses=[...new Set(ofRows.map(row=>row.unitStatus||"en_cours"))];
                const actionKey=collapsed?`${o.id}:all`:homeRowKey(o);
                return (
                  <tr key={`${o.id}:${o._homeUnitId||"global"}`}
                    onClick={()=>selectionMode?(collapsed?toggleOfSelection(o.id):toggleSelected(o)):onSelect(o.id,collapsed?null:o._homeUnitId)}
                    title={selectionMode?"Ajouter ou retirer cette ligne de la sélection":"Ouvrir ce dossier"}
                    style={{background:selected?C.yellow+"20":isFav?"#e05c0008":i%2===0?"transparent":C.stripe,cursor:selectionMode?"cell":"pointer",transition:"background .1s",borderTop:groupStart?`2px solid ${C.border}`:undefined}}
                    onMouseEnter={e=>e.currentTarget.style.background=selectionMode?C.blue+"14":"#e05c0015"}
                    onMouseLeave={e=>e.currentTarget.style.background=selected?C.yellow+"20":isFav?"#e05c0008":i%2===0?"transparent":C.stripe}>
                    <TD center onClick={e=>{e.stopPropagation();collapsed?toggleOfSelection(o.id):toggleSelected(o);}}><input type="checkbox" aria-label={collapsed?`Sélectionner les ${summaryName} - OF ${o.of}`:`Sélectionner ${homeUnitName(o)} - OF ${o.of}`} checked={selected} onClick={e=>e.stopPropagation()} onChange={()=>collapsed?toggleOfSelection(o.id):toggleSelected(o)} style={{width:17,height:17,cursor:"pointer"}}/></TD>
                    <TD center>
                      <span onClick={e=>{e.stopPropagation();toggleFav(o.id);}}
                        style={{cursor:"pointer",fontSize:14,opacity:isFav?1:.3,transition:"opacity .15s"}}
                        title={isFav?"Retirer des favoris":"Ajouter aux favoris"}>
                        ⭐
                      </span>
                    </TD>
                    <TD>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        {multiSn&&groupStart&&<button type="button" aria-label={`${collapsed?"Déplier":"Replier"} les ${summaryName} de OF ${o.of}`} title={collapsed?"Afficher les SN / LOT":"Replier les SN / LOT"} onClick={e=>{e.stopPropagation();toggleOfExpanded(o.id);}}
                          style={{width:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:`1px solid ${C.blue}`,borderRadius:4,background:C.blue+"12",color:C.blue,fontSize:13,fontWeight:900,cursor:"pointer",flexShrink:0}}>{collapsed?"+":"−"}</button>}
                        <span style={{fontWeight:700,fontFamily:"monospace",color:C.text}}>{o.of}</span>
                        {multiSn&&groupStart&&<span title={`${snLabels.length} SN / LOT : ${snLabels.join(", ")}`}><Badge label={summaryName} color={C.blue}/></span>}
                      </div>
                    </TD>
                    <TD><span style={{fontFamily:"monospace",color:C.muted}}>{o.codeArticle||o.articleNo||"—"}</span></TD>
                    <TD><span style={{fontFamily:"monospace",color:collapsed||o.sn?C.blue:C.muted,fontWeight:700}}>{collapsed?snSummary:(o.sn||"—")}</span></TD>
                    <TD><span style={{fontFamily:"monospace",color:C.muted,fontWeight:collapsed?700:400}}>{collapsed?lotSummary:(o.lot||"—")}</span></TD>
                    <TD><span style={{color:C.text}}>{o.description||"—"}</span></TD>
                    <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{o.otp||o.projet||"—"}</span></TD>
                    <TD onClick={e=>e.stopPropagation()}>{collapsed?<span style={{color:C.muted}}>—</span>:<FinishedProductSn of={o} user={user} onSave={onFinishedSnChange}/>}</TD>
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
                      {collapsed?<Badge label={groupStatuses.length===1?(UNIT_STATUTS[groupStatuses[0]]?.label||groupStatuses[0]):"Statuts mixtes"} color={groupStatuses.length===1?(UNIT_STATUTS[groupStatuses[0]]?.color||C.border):C.yellow}/>:o._homeUnitId?<select aria-label={`Statut SN ${o.sn||o.lot} - OF ${o.of}`} disabled={!isAdminManager(user)} value={o.unitStatus||"en_cours"}
                        onChange={e=>onUnitStatusChange(o.id,o._homeUnitId,e.target.value).catch(error=>window.alert(`Enregistrement impossible : ${error?.message||error}`))}
                        style={{width:"100%",background:UNIT_STATUTS[o.unitStatus||"en_cours"]?.color+"18",color:UNIT_STATUTS[o.unitStatus||"en_cours"]?.color,border:`1px solid ${UNIT_STATUTS[o.unitStatus||"en_cours"]?.color}`,borderRadius:4,padding:"3px 5px",fontSize:12}}>
                        {Object.entries(UNIT_STATUTS).map(([value,s])=><option key={value} value={value}>{s.label}</option>)}
                      </select>:"—"}
                    </TD>
                    <TD center onClick={e=>e.stopPropagation()}>{(()=>{
                      try{
                        const nei=nextEtuvageForRow(collapsed?{...o,_homeUnitId:null}:o);
                        if(!nei.count) return <span style={{color:C.muted,fontSize:10}}>—</span>;
                        return <span style={{fontFamily:"monospace",fontSize:10,color:nei.overdue?C.red:C.blue,fontWeight:nei.overdue?700:400}}>
                          {nei.overdue?"🔴 ":"🕐 "}{nei.label}
                        </span>;
                      }catch(e){return <span style={{color:C.muted,fontSize:10}}>—</span>;}
                    })()}</TD>
                    <TD style={{minWidth:330,maxWidth:420}}>
                      <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"nowrap",overflowX:"auto",padding:"1px 0"}}>
                        {facts.map(fact=>{
                          const label=technicalFollowUpLabel(fact);
                          const closed=!!fact.closedDate;
                          const detail=[label,fact.commentaires,closed?`Clôturé ${fact.closedDate}`:"Ouvert"].filter(Boolean).join(" — ");
                          return <span key={fact.id||detail} title={detail} style={{display:"inline-block",padding:"2px 5px",borderRadius:3,whiteSpace:"nowrap",fontSize:10,fontWeight:700,flexShrink:0,
                            border:`1px solid ${closed?C.green:C.yellow}`,background:(closed?C.green:C.yellow)+"14",color:closed?C.green:C.yellow}}>{label}</span>;
                        })}
                        {polymerization&&<span title={`Sous vide dès le ${formatAvailabilityDT(polymerization.readyAt)}`} style={{flexShrink:0}}><Badge label={`POLY ${formatAvailabilityDT(polymerization.readyAt)}`} color={C.yellow}/></span>}
                        {!!warningsById[o.id]?.length&&<span role="img" aria-label="OF à surveiller" title={warningsById[o.id].join("\n")} style={{color:C.yellow,fontSize:18,fontWeight:900,flexShrink:0}}>⚠</span>}
                        {!facts.length&&!polymerization&&!warningsById[o.id]?.length&&<span style={{color:C.muted}}>—</span>}
                      </div>
                    </TD>
                    <TD center>
                      <button title="Copier toutes les lignes SN / LOT de cet OF" aria-label={`Copier toutes les lignes de l'OF ${o.of} dans le presse-papier`}
                        onClick={e=>{e.stopPropagation();copyHomeRows(ofRows,actionKey);}}
                        style={{background:copiedTeamsKey===actionKey?C.green:C.blue,border:"none",borderRadius:4,color:"#fff",padding:"4px 7px",cursor:"pointer",marginRight:6,fontWeight:800}}>
                        {copiedTeamsKey===actionKey?"✓":"📋"}
                      </button>
                      {isAdminManager(user)&&<button title="Supprimer cet OF" aria-label={`Supprimer l'OF ${o.of}`}
                        onClick={e=>{e.stopPropagation();onDelete(o.id);}}
                        style={{background:C.red,border:"none",borderRadius:4,color:"#fff",padding:"4px 8px",cursor:"pointer",marginRight:6}}>×</button>}
                      <button aria-label={collapsed?`Ouvrir OF ${o.of}`:`Ouvrir OF ${o.of} - ${homeUnitName(o)}`} title="Ouvrir le dossier" onClick={e=>{e.stopPropagation();onSelect(o.id,collapsed?null:o._homeUnitId);}}
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
        <span>{visibleRows.length} ligne(s) affichée(s){visibleRows.length!==filtered.length?` · ${filtered.length} SN / LOT`:""}</span>
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
      {showBulkPdf&&<BulkPdfOptionsModal rows={selectedRows} onCancel={()=>setShowBulkPdf(false)} onConfirm={exportBulkPdf}/>}
      {homeMailKind&&isAdminManager(user)&&<HomeMailModal kind={homeMailKind} rows={selectedRows} user={user} onClose={()=>setHomeMailKind(null)}
        onMarkForClosure={rows=>onBulkUnitStatusChange
          ? onBulkUnitStatusChange(rows,"a_cloturer")
          : Promise.all(rows.filter(row=>row._homeUnitId).map(row=>onUnitStatusChange(row.id,row._homeUnitId,"a_cloturer")))}/>}
    </div>
  );
};
