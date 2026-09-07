/* @jsxRuntime classic */
const { useState, useEffect, useCallback } = React;

const C = {
  bg:"#0d1117", surface:"#161b22", border:"#30363d",
  accent:"#e05c00", blue:"#1f6feb", green:"#238636",
  red:"#da3633", yellow:"#d29922", text:"#e6edf3", muted:"#8b949e",
  purple:"#8957e5",
};

const now   = () => new Date().toLocaleDateString("fr-FR");
const nowDT = () => { const d=new Date(); return d.toLocaleDateString("fr-FR")+" "+d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}); };
const uid   = () => Math.random().toString(36).slice(2,8).toUpperCase();
const fmtSAP = v => {
  const d = v.replace(/[^0-9]/g,'').slice(0,9);
  if(d.length<=3) return d;
  if(d.length<=6) return d.slice(0,3)+' '+d.slice(3);
  return d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6);
};
const fmtCodeERP = v => {
  const d = v.replace(/[^0-9]/g,"").slice(0,9);
  if(d.length<=3) return d;
  if(d.length<=6) return d.slice(0,3)+" "+d.slice(3);
  return d.slice(0,3)+" "+d.slice(3,6)+" "+d.slice(6);
};

// ─── UI ────────────────────────────────────────────────────────────────────
const Input = ({value,onChange,placeholder,title,style={},small,type="text",readOnly,required}) => {
  const empty = !value||value==="";
  const borderCol = required&&empty ? C.yellow : style.borderColor || C.border;
  return (
  <input type={type} value={value||""} onChange={e=>onChange&&onChange(e.target.value)}
    placeholder="" title={title||(placeholder?`Attendu : ${placeholder}`:undefined)} readOnly={readOnly}
    style={{width:"100%",fontFamily:"monospace",outline:"none",padding:small?"4px 6px":"6px 10px",fontSize:small?11:13,
      ...style,
      background:style.background||(readOnly?"#1c2128":"#0d1117"),
      color:style.color||(readOnly?"#8b949e":C.text),
      border:`1px solid ${borderCol}`,borderRadius:4,
      cursor:readOnly?"default":"text",borderColor:borderCol}}/>
  );
};
const Select = ({value,onChange,options}) => (
  <select value={value||""} onChange={e=>onChange(e.target.value)}
    style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,
      color:C.text,padding:"4px 6px",fontSize:11,fontFamily:"monospace",outline:"none"}}>
    <option value="">-</option>
    {options.map(o=><option key={o} value={o}>{o}</option>)}
  </select>
);
const Btn = ({onClick,children,color=C.accent,small,disabled,full}) => (
  <button onClick={onClick} disabled={disabled} style={{
    background:disabled?C.border:color,color:"#fff",border:"none",borderRadius:4,
    padding:small?"4px 10px":"7px 16px",fontSize:small?11:13,cursor:disabled?"default":"pointer",
    fontWeight:600,letterSpacing:.5,opacity:disabled?.5:1,whiteSpace:"nowrap",
    width:full?"100%":undefined}}>
    {children}
  </button>
);
const IconBtn = ({onClick,title,children,color=C.accent,disabled}) => (
  <button onClick={onClick} disabled={disabled} title={title} style={{
    width:26,height:26,display:"inline-flex",alignItems:"center",justifyContent:"center",
    background:disabled?C.border:color,color:"#fff",border:"none",borderRadius:4,
    cursor:disabled?"default":"pointer",fontSize:13,fontWeight:800,opacity:disabled?.45:1,
    lineHeight:1,padding:0,flexShrink:0}}>
    {children}
  </button>
);
const ActionGroup = ({children}) => (
  <div style={{display:"inline-flex",gap:4,alignItems:"center",justifyContent:"center",pointerEvents:"all"}}>
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
  background: "#1c2128",
  color: "#8b949e",
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
  comments: row.comments ? [...row.comments] : [],
  ...extra,
});

// ─── Modale d'annulation de ligne (soft-delete) ───────────────────────────
const DeleteModal = ({onConfirm, onCancel}) => {
  const [reason, setReason] = useState("");
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
  <th style={{background:"#1c2128",color:color||C.muted,fontSize:10,fontWeight:700,letterSpacing:.8,
    textTransform:"uppercase",padding:"6px 8px",textAlign:"left",
    borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",width:w}}>
    {children}
  </th>
);
const TD = ({children,center}) => (
  <td style={{padding:"5px 8px",borderBottom:`1px solid ${C.border}20`,
    fontSize:12,textAlign:center?"center":"left",verticalAlign:"middle"}}>
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

  const startEdit = () => { setDraft({...h}); setEditing(true); };
  const save      = () => { onUpdate(draft); setEditing(false); };
  const cancel    = () => setEditing(false);

  const FIELDS = [
    {key:"of",          label:"OF"},
    {key:"sn",          label:"SN Composant"},
    {key:"lot",         label:"LOT"},
    {key:"codeArticle",    label:"N° Article"},
    {key:"ancienArticle",  label:"Ancien N° Article"},
    {key:"description",    label:"Description"},
    {key:"snProduitFini",  label:"SN Produit Fini"},
    {key:"otp",            label:"N° OTP"},
    {key:"ofRework",       label:"OF Rework"},
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
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={save}   color={C.green}  small>✓ Enregistrer</Btn>
        <Btn onClick={cancel} color={C.border} small>Annuler</Btn>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",alignItems:"stretch",gap:1,marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,flex:1,
        background:C.border,border:`1px solid ${C.border}`,borderRadius:"6px 0 0 6px",
        overflow:"hidden",fontSize:12}}>
        {[
          ["OF",                h.of||"—"],
          ["SN Composant / LOT",`${h.sn||"—"} / ${h.lot||"—"}`],
          ["N° Article",        h.codeArticle||h.description||"—"],
          ["Ancien N° Article", h.ancienArticle||"—"],
          ["Description",       h.codeArticle?h.description||"—":"—"],
          ["SN Produit Fini",   h.snProduitFini||"—"],
          ["N° OTP",            h.otp||"—"],
          ["OF Rework",         h.ofRework||"—"],
        ].map(([label,val])=>(
          <div key={label} style={{background:C.surface,padding:"6px 12px"}}>
            <div style={{color:C.muted,fontSize:9,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{label}</div>
            <div style={{color:C.text,fontWeight:600,fontFamily:"monospace"}}>{val}</div>
          </div>
        ))}
        {/* Photo folder */}
        {h.of&&(
          <div style={{background:C.surface,padding:"6px 12px"}}>
            <div style={{color:C.muted,fontSize:9,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Photos OF</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:11}}>📁</span>
              <span style={{fontFamily:"monospace",fontSize:9,color:C.muted,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140}}
                title={`S:\\OP_SPACE\\Photos_OF\\${h.of}`}>
                {`S:\OP_SPACE\Photos_OF\${h.of}`}
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
                ⎘ Copier
              </span>
            </div>
          </div>
        )}
        {/* Statut */}
        <div style={{background:C.surface,padding:"6px 12px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{color:C.muted,fontSize:9,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Statut</div>
          <select value={h.status||"en_cours"} onChange={e=>onUpdateStatus&&onUpdateStatus(e.target.value)}
            style={{background:STATUTS[h.status||"en_cours"]?.color+"22",
              border:`1px solid ${STATUTS[h.status||"en_cours"]?.color}`,
              borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,
              color:STATUTS[h.status||"en_cours"]?.color,outline:"none",cursor:"pointer"}}>
            {Object.entries(STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <button onClick={startEdit} title="Modifier les informations du dossier"
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

// ─── Système de commentaires threadés ────────────────────────────────────
// comments = [{id, dt, visa, text, replyTo}]
const CommentBtn = ({comments, onChange, user}) => {
  const [open, setOpen]     = React.useState(false);
  const [draft, setDraft]   = React.useState("");
  const [replyTo, setReplyTo] = React.useState(null); // {id, visa, text}
  const inputRef = React.useRef(null);
  const listRef  = React.useRef(null);

  const list = comments||[];
  const count = list.length;

  const openModal = e => { e.stopPropagation(); setOpen(true); };
  const close     = () => { setOpen(false); setDraft(""); setReplyTo(null); };

  const post = () => {
    if(!draft.trim()) return;
    const c = {id:uid(), dt:nowDT(), visa:user?.trigram||"?", text:draft.trim(),
      replyTo: replyTo ? replyTo.id : null};
    onChange([...list, c]);
    setDraft(""); setReplyTo(null);
    setTimeout(()=>{ if(listRef.current) listRef.current.scrollTop=listRef.current.scrollHeight; },50);
  };

  const del = id => onChange(list.filter(c=>c.id!==id));

  const startReply = c => {
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
          <div style={{background:"#161b22",border:`1px solid ${C.accent}`,borderRadius:10,
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
                      background: isOwn ? C.accent+"22" : "#1c2128",
                      border:`1px solid ${isOwn ? C.accent+"66" : C.border}`,
                      borderRadius: isOwn ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      padding:"8px 12px",maxWidth:"80%",
                      borderLeft: isOwn ? undefined : `3px solid ${C.blue}`}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                        <span style={{fontFamily:"monospace",fontWeight:700,fontSize:11,
                          color: isOwn ? C.accent : C.blue}}>{c.visa}</span>
                        <span style={{fontFamily:"monospace",fontSize:9,color:C.muted}}>{c.dt}</span>
                      </div>
                      <div style={{fontSize:12,color:C.text,lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                        {c.text}
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{display:"flex",gap:10,paddingLeft:6,paddingRight:6}}>
                      <span onClick={()=>startReply(c)}
                        style={{cursor:"pointer",color:C.muted,fontSize:10,display:"flex",alignItems:"center",gap:3}}>
                        ↩ Répondre
                      </span>
                      {isOwn&&<span onClick={()=>del(c.id)}
                        style={{cursor:"pointer",color:"#da3633",fontSize:10}}>
                        🗑️ Supprimer
                      </span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compose */}
            <div style={{borderTop:`1px solid ${C.border}`,padding:"10px 14px",flexShrink:0,background:"#0d1117"}}>
              {replyTo&&(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  background:"#1c2128",borderLeft:`3px solid ${C.blue}`,borderRadius:4,
                  padding:"4px 10px",marginBottom:8,fontSize:10,color:C.muted}}>
                  <span>↩ Réponse à <strong style={{color:C.blue}}>{replyTo.visa}</strong> : {replyTo.text.slice(0,50)}{replyTo.text.length>50?"…":""}</span>
                  <span onClick={()=>setReplyTo(null)} style={{cursor:"pointer",color:C.muted,fontSize:14,marginLeft:8}}>×</span>
                </div>
              )}
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <textarea ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey))post();}}
                    placeholder={replyTo?"Votre réponse…":"Nouveau commentaire… (Ctrl+↵ pour envoyer)"}
                    rows={2}
                    style={{width:"100%",background:"#161b22",border:`1px solid ${C.border}`,
                      borderRadius:6,color:C.text,fontSize:12,fontFamily:"system-ui",
                      padding:"8px 10px",resize:"none",outline:"none",boxSizing:"border-box",lineHeight:1.5}}/>
                </div>
                <Btn onClick={post} color={C.accent} small disabled={!draft.trim()}>
                  {replyTo?"↩ Répondre":"💬 Envoyer"}
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

const TabRework = ({data,onChange,user,header,forceShowDeleted=false}) => {
  const rows = data.rows||[];
  const desoudes = Object.values(rows.reduce((open,r)=>{
    if(r.deleted) return open;
    const key=(r.repere||"").trim().toUpperCase();
    if(!key) return open;
    const actions=[r.action1].filter(Boolean);
    if(actions.includes("S")) delete open[key];
    else if(actions.includes("D")) open[key]=r;
    return open;
  },{}));
  const valueWarnings = Object.values(rows.reduce((state,r)=>{
    if(r.deleted) return state;
    const key=(r.repere||"").trim().toUpperCase();
    if(!key || r.isAdjust) return state;
    const actions=[r.action1].filter(Boolean);
    if(actions.includes("D")) state[key]={...state[key], d:r};
    if(actions.includes("S")&&state[key]?.d){
      const dVal=(state[key].d.valeur||"").trim().toUpperCase();
      const sVal=(r.valeur||"").trim().toUpperCase();
      if(dVal && sVal && dVal!==sVal) state[key]={...state[key], mismatch:{repere:key,d:state[key].d,s:r}};
      else delete state[key].mismatch;
    }
    return state;
  },{})).map(v=>v.mismatch).filter(Boolean);
  const add = () => {
    const last = rows.filter(r=>!r.deleted).slice(-1)[0];
    onChange({rows:[...rows,{
      id:uid(),createdVisa:user.trigram,createdDT:nowDT(),
      sousEnsemble:last?.sousEnsemble||(header?.codeArticle||header?.description||""),
      sortieVisa:"",repere:"",qty:"",action1:"",
      codeERP:"",valeur:"",lot:"",dc:"",sn:"",
      fiche:last?.fiche||"", etape:last?.etape||"",
      isAdjust:false,
      visaOper:"",dateOper:"",
      visaCtrl:"",dateCtrl:"",
      remarques:"",
      tracaOk:false,visaTraca:"",dateTraca:""
    }]});
  };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const [hideAchevees,setHideAchevees] = useState(true);
  const [filters,setFilters] = useState({repere:"", sousEnsemble:"", action1:"", codeERP:"", valeur:"", lot:"", dc:"", sn:"", fiche:"", etape:"", adjust:"all"});
  const upd=(id,f,v)=>onChange({rows:rows.map(r=>r.id===id?{...r,[f]:v}:r)});
  const dup=id=>onChange({rows:[...rows,duplicateRow(rows.find(r=>r.id===id),user,{
    visaOper:"",dateOper:"",visaCtrl:"",dateCtrl:"",tracaOk:false,visaTraca:"",dateTraca:""
  })]});
  // Brouillon → suppression directe; Validée → soft-delete avec motif
  const del=id=>{ const r=rows.find(x=>x.id===id); if(!r?.validated) onChange({rows:rows.filter(x=>x.id!==id)}); else setDeleteTarget(id); };
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ onChange({rows:rows.map(r=>r.id===deleteTarget?{...r,deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()}:r)}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;
  const isAchevee = r => !!r.visaCtrl && !!r.tracaOk;
  const acheveesCount = rows.filter(r=>!r.deleted&&isAchevee(r)).length;
  const visibleRows = [...rows].reverse().filter(r=>{
    if(r.deleted&&!showDeleted&&!forceShowDeleted) return false;
    if(!r.deleted&&hideAchevees&&!forceShowDeleted&&isAchevee(r)) return false;
    const txt = key => String(r[key]||"").toUpperCase();
    if(filters.repere&& !txt("repere").includes(filters.repere.toUpperCase())) return false;
    if(filters.sousEnsemble&& !txt("sousEnsemble").includes(filters.sousEnsemble.toUpperCase())) return false;
    if(filters.action1&& r.action1!==filters.action1) return false;
    if(filters.codeERP&& !txt("codeERP").includes(filters.codeERP.toUpperCase())) return false;
    if(filters.valeur&& !txt("valeur").includes(filters.valeur.toUpperCase())) return false;
    if(filters.lot&& !txt("lot").includes(filters.lot.toUpperCase())) return false;
    if(filters.dc&& !txt("dc").includes(filters.dc.toUpperCase())) return false;
    if(filters.sn&& !txt("sn").includes(filters.sn.toUpperCase())) return false;
    if(filters.fiche&& !txt("fiche").includes(filters.fiche.toUpperCase())) return false;
    if(filters.etape&& !txt("etape").includes(filters.etape.toUpperCase())) return false;
    if(filters.adjust==="yes"&&!r.isAdjust) return false;
    if(filters.adjust==="no"&&r.isAdjust) return false;
    return true;
  });
  const hasFilters = Object.entries(filters).some(([k,v])=>k==="adjust"?v!=="all":!!v);
  const fset = (k,v) => setFilters(s=>({...s,[k]:v}));
  const stampTraca=id=>onChange({rows:rows.map(r=>r.id===id?{...r,tracaOk:true,visaTraca:user.trigram,dateTraca:now()}:r)});
  const clearTraca=id=>onChange({rows:rows.map(r=>r.id===id?{...r,tracaOk:false,visaTraca:"",dateTraca:""}:r)});
  const stampOper=id=>onChange({rows:rows.map(r=>r.id===id?{...r,visaOper:user.trigram,dateOper:now(),validated:true,validError:""}:r)});
  const clearOper=id=>onChange({rows:rows.map(r=>r.id===id?{...r,visaOper:"",dateOper:""}:r)});
  const stampCtrl=id=>onChange({rows:rows.map(r=>r.id===id?{...r,visaCtrl:user.trigram,dateCtrl:now()}:r)});
  const clearCtrl=id=>onChange({rows:rows.map(r=>r.id===id?{...r,visaCtrl:"",dateCtrl:""}:r)});

  const REQUIRED = [
    {key:"repere", label:"Repère TOPO"},
    {key:"qty",    label:"QTÉ"},
    {key:"fiche",  label:"Fiche Suiveuse"},
    {key:"etape",  label:"N° Étape"},
  ];
  const validateRow=id=>{
    const r=rows.find(x=>x.id===id);
    const required = r?.action1==="S"
      ? [...REQUIRED,{key:"lot",label:"LOT"},{key:"dc",label:"DC"}]
      : REQUIRED;
    const miss=checkRequired(r,required);
    if(miss.length) { upd(id,"validError","Champs requis manquants : "+miss.join(", ")); }
    else { upd(id,"validError",""); upd(id,"validated",true); }
  };
  const unlockRow=id=>upd(id,"validated",false);
  return (
    <div>
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
                <Badge key={r.id} label={`${r.repere||"repère ?"} - LOT ${r.lot||"?"} - Fiche ${r.fiche||"?"} - étape ${r.etape||"?"}`} color={C.yellow}/>
              ))}
            </div>
          </div>
        </div>
      )}
      {valueWarnings.length>0&&(
        <div style={{background:C.red+"18",border:`1px solid ${C.red}`,borderRadius:6,
          padding:"9px 14px",marginBottom:12,display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{color:C.red,fontSize:16,lineHeight:1}}>⚠</span>
          <div>
            <div style={{color:C.red,fontWeight:800,fontSize:12,marginBottom:4}}>
              Valeur différente entre désoudage et soudage sur composant non adjust
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {valueWarnings.map(w=>(
                <Badge key={w.repere} label={`${w.repere} - D ${w.d.valeur||"?"} / S ${w.s.valeur||"?"}`} color={C.red}/>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{color:C.muted,fontSize:11}}>
          {ACTIONS.map(a=><span key={a}><Badge label={a} color={C.accent}/> {ACTION_LABELS[a]}&nbsp;&nbsp;</span>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          {acheveesCount>0&&<Btn onClick={()=>setHideAchevees(s=>!s)} color={hideAchevees?"#23863666":C.border} small>
            {hideAchevees?`▼ Opérations achevées (${acheveesCount})`:"▲ Masquer achevées"}
          </Btn>}
          {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
          </Btn>}
          <Btn onClick={add} small>+ Ligne</Btn>
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:900,fontSize:12}}>
          <thead>
            <tr>
              <TH w={125}>Date / Heure</TH><TH w={52} color={C.accent}>Visa</TH>
              <TH w={140}>Sous-ensemble</TH>
              <TH w={80}>Repère TOPO</TH>
              <TH w={55}>Adjust</TH>
              <TH w={45}>QTÉ</TH>
              <TH w={38}>A1</TH>
              <TH w={100}>Code ERP</TH>
              <TH w={110}>Valeur</TH>
              <TH w={75}>LOT</TH>
              <TH w={75}>DC</TH>
              <TH w={65}>SN</TH>
              <TH w={155}>Fiche/FT/NC/DM · Étape</TH>
              <TH w={95}>✓ Ctrl</TH>
              <TH w={80} color={C.green}>☑ Traça</TH>
              <TH w={40}>💬</TH>
              <TH w={68}></TH>
            </tr>
            <tr>
              <th></th><th></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.sousEnsemble} onChange={v=>fset("sousEnsemble",v)} small title="Filtrer sous-ensemble"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.repere} onChange={v=>fset("repere",v)} small title="Filtrer repère topo"/></th>
              <th style={{padding:"3px 4px"}}>
                <select value={filters.adjust} onChange={e=>fset("adjust",e.target.value)}
                  style={{width:"100%",background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,
                    color:C.text,padding:"4px 3px",fontSize:10,fontFamily:"monospace",outline:"none"}}>
                  <option value="all">Tous</option>
                  <option value="yes">Oui</option>
                  <option value="no">Non</option>
                </select>
              </th>
              <th></th>
              <th style={{padding:"3px 4px"}}>
                <select value={filters.action1} onChange={e=>fset("action1",e.target.value)}
                  style={{width:"100%",background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,
                    color:C.text,padding:"4px 3px",fontSize:10,fontFamily:"monospace",outline:"none"}}>
                  <option value="">*</option>
                  {ACTIONS.map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </th>
              <th style={{padding:"3px 4px"}}><Input value={filters.codeERP} onChange={v=>fset("codeERP",v)} small title="Filtrer code ERP"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.valeur} onChange={v=>fset("valeur",v)} small title="Filtrer valeur"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.lot} onChange={v=>fset("lot",v)} small title="Filtrer lot"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.dc} onChange={v=>fset("dc",v)} small title="Filtrer DC"/></th>
              <th style={{padding:"3px 4px"}}><Input value={filters.sn} onChange={v=>fset("sn",v)} small title="Filtrer SN"/></th>
              <th style={{padding:"3px 4px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 42px",gap:3}}>
                  <Input value={filters.fiche} onChange={v=>fset("fiche",v)} small title="Filtrer fiche"/>
                  <Input value={filters.etape} onChange={v=>fset("etape",v)} small title="Filtrer étape"/>
                </div>
              </th>
              <th></th><th></th><th></th>
              <th style={{padding:"3px 4px",textAlign:"center"}}>
                {hasFilters&&<button onClick={()=>setFilters({repere:"", sousEnsemble:"", action1:"", codeERP:"", valeur:"", lot:"", dc:"", sn:"", fiche:"", etape:"", adjust:"all"})}
                  title="Effacer les filtres"
                  style={{background:C.border,border:"none",borderRadius:4,color:C.text,width:26,height:22,cursor:"pointer",fontWeight:800}}>×</button>}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.flatMap((r,i)=>{
              return [
              <tr key={r.id} style={{background:r.deleted?"#da363318":r.tracaOk?"#23863610":i%2===0?"transparent":"#ffffff06",
                textDecoration:r.deleted?"line-through":undefined,
                opacity:r.deleted?.6:1,
                pointerEvents:r.deleted?"none":undefined,
                borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
                <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{r.createdDT||"—"}</span></TD>
                <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span></TD>
                <TD>
                  <Input value={r.sousEnsemble||""} onChange={v=>upd(r.id,"sousEnsemble",v.toUpperCase())}
                    small readOnly={!!r.validated}
                    placeholder={header?.codeArticle||header?.description||"N° Article"}
                    title="Sous-ensemble SAP (par défaut = article du dossier)"
                    style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",
                      ...(r.validated?LOCKED_INPUT_STYLE:{}),
                      borderColor:r.sousEnsemble&&r.sousEnsemble!==(header?.codeArticle||header?.description)?C.blue:undefined,
                      color:r.sousEnsemble&&r.sousEnsemble!==(header?.codeArticle||header?.description)?C.blue:undefined}}/>
                  {r.sousEnsemble&&r.sousEnsemble!==(header?.codeArticle||header?.description)&&(
                    <div style={{fontSize:8,color:C.blue,marginTop:1,fontFamily:"monospace"}}>≠ dossier</div>
                  )}
                </TD>
                <TD><Input value={r.repere} onChange={v=>{
                  upd(r.id,"repere",v.toUpperCase());
                  if(v.trim()&&r.qty===""&&r.action1!=="M") upd(r.id,"qty","1");
                }} small readOnly={!!r.validated} style={{...(r.validated?LOCKED_INPUT_STYLE:{}),textTransform:"uppercase"}}/></TD>
                <TD center style={{pointerEvents:r.deleted?"none":"all"}}>
                  <input type="checkbox" checked={!!r.isAdjust} disabled={!!r.validated}
                    onChange={e=>upd(r.id,"isAdjust",e.target.checked)}
                    title="Composant adjust : le contrôle de valeur D/S est ignoré"
                    style={{width:16,height:16,accentColor:C.accent,cursor:r.validated?"default":"pointer"}}/>
                </TD>
                <TD>
                  {(r.action1==="M"||!r.repere)
                    ? <Input value={r.qty} onChange={v=>upd(r.id,"qty",v)} small readOnly={!!r.validated} style={{...(r.validated?LOCKED_INPUT_STYLE:{})}}/>
                    : <span style={{fontFamily:"monospace",fontSize:11,color:C.muted,padding:"0 4px"}}>—</span>}
                </TD>
                <TD><Select value={r.action1} onChange={v=>upd(r.id,"action1",v)} options={ACTIONS}/></TD>
                <TD><Input value={r.codeERP} onChange={v=>upd(r.id,"codeERP",fmtCodeERP(v))} small readOnly={!!r.validated} style={{width:90,fontFamily:"monospace",letterSpacing:1,...(r.validated?LOCKED_INPUT_STYLE:{})}} title="9 chiffres — format 123 456 789" placeholder="___ ___ ___"/></TD>
                <TD><Input value={r.valeur} onChange={v=>upd(r.id,"valeur",v)} small readOnly={!!r.validated} style={{minWidth:100,...(r.validated?LOCKED_INPUT_STYLE:{})}}/></TD>
                <TD><Input value={r.lot}     onChange={v=>upd(r.id,"lot",v.toUpperCase().slice(0,10))} small readOnly={!!r.validated} title="Lot (ex: SP-J123)" style={{width:85,fontFamily:"monospace",...(r.validated?LOCKED_INPUT_STYLE:{})}}/></TD>
                <TD><Input value={r.dc}      onChange={v=>upd(r.id,"dc",v.toUpperCase().slice(0,6))} small readOnly={!!r.validated} title="2552R1 = année 25, sem. 52, relief 1" style={{width:68,fontFamily:"monospace",...(r.validated?LOCKED_INPUT_STYLE:{})}}/></TD>
                <TD><Input value={r.sn}      onChange={v=>upd(r.id,"sn",v)}      small readOnly={!!r.validated} style={{width:68,...(r.validated?LOCKED_INPUT_STYLE:{})}}/></TD>
                <TD>
                  <div style={{display:"flex",gap:3,alignItems:"center",flexWrap:"nowrap"}}>
                    <Input value={r.fiche} onChange={v=>upd(r.id,"fiche",v.toUpperCase())} small required readOnly={!!r.validated}
                      title="Fiche / FT / NC / DM (ex: R4B-Q001, FT-042)"
                      placeholder="R4B-Q001"
                      style={{fontFamily:"monospace",width:100,textTransform:"uppercase",...(r.validated?LOCKED_INPUT_STYLE:{})}}/>
                    <Input value={r.etape||""} onChange={v=>upd(r.id,"etape",v)} small required readOnly={!!r.validated}
                      title="N° étape (ex: 10, 20, 30…)"
                      placeholder="étape"
                      style={{textAlign:"center",width:45,...(r.validated?LOCKED_INPUT_STYLE:{})}}/>
                  </div>
                </TD>

                <TD center style={{minWidth:75}}>
                  {r.visaCtrl
                    ? <div style={{display:"flex",flexDirection:"column",gap:0,alignItems:"center"}}>
                        <div style={{display:"flex",gap:3,alignItems:"center"}}>
                          <span style={{fontFamily:"monospace",fontWeight:700,fontSize:10,color:C.blue}}>{r.visaCtrl}</span>
                          <span onClick={()=>clearCtrl(r.id)} title="Annuler" style={{cursor:"pointer",color:C.muted,fontSize:11}}>↺</span>
                        </div>
                        <span style={{fontFamily:"monospace",fontSize:8,color:C.muted}}>{r.dateCtrl}</span>
                      </div>
                    : <button onClick={()=>stampCtrl(r.id)}
                        style={{background:C.blue+"22",border:`1px solid ${C.blue}`,borderRadius:3,
                          color:C.blue,fontSize:9,padding:"2px 5px",cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>
                        ✓ Ctrl
                      </button>}
                </TD>
                <TD center style={{minWidth:65}}>
                  {r.tracaOk
                    ? <div style={{display:"flex",flexDirection:"column",gap:0,alignItems:"center"}}>
                        <div style={{display:"flex",gap:3,alignItems:"center"}}>
                          <span style={{fontFamily:"monospace",fontWeight:700,fontSize:10,color:C.green}}>{r.visaTraca}</span>
                          <span onClick={()=>clearTraca(r.id)} title="Annuler" style={{cursor:"pointer",color:C.muted,fontSize:11}}>↺</span>
                        </div>
                        <span style={{fontFamily:"monospace",fontSize:8,color:C.muted}}>{r.dateTraca}</span>
                      </div>
                    : <button onClick={()=>stampTraca(r.id)}
                        style={{background:C.green+"22",border:`1px solid ${C.green}`,borderRadius:3,
                          color:C.green,fontSize:9,padding:"2px 5px",cursor:"pointer",fontWeight:700,whiteSpace:"nowrap"}}>
                        ☑ Traça
                      </button>}
                </TD>
                <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user}/></TD>
                <TD center style={{pointerEvents:"all",minWidth:110}}>
                  {!r.deleted&&!r.validated&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                      <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&r.validated&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
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
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
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
      {deleteTarget&&<DeleteModal onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
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
const CAT_COLORS = {Flux:C.blue, Soudure:C.accent, Kapton:C.purple, Colle:C.green, Silicone:C.yellow, Primer:"#e879a0", Autre:C.muted};

// ─── Gestionnaire de la liste consommables (stockage partagé global) ────────
const ConsommableListManager = ({items,onClose,onSave}) => {
  const [list,setList] = useState(items.map(i=>({...i})));
  const [newItem,setNewItem] = useState({label:"",sap:"",code:"",cat:"Flux"});
  const CATS = ["Flux","Soudure","Kapton","Colle","Silicone","Primer","Autre"];

  const add = () => {
    if(!newItem.label.trim()) return;
    setList(l=>[...l,{id:uid(),...newItem}]);
    setNewItem({label:"",sap:"",code:"",cat:newItem.cat});
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
      <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:10,width:"100%",maxWidth:760,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>⚙ Gérer la liste des consommables</div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>onSave(list)} color={C.green} small>✓ Enregistrer</Btn>
            <Btn onClick={onClose} color={C.border} small>Annuler</Btn>
          </div>
        </div>

        {/* Formulaire ajout */}
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:"#0d1117"}}>
          <div style={{color:C.muted,fontSize:10,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Ajouter un consommable</div>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto",gap:8,alignItems:"end"}}>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>N° SAP</div>
              <Input value={newItem.sap||""} onChange={v=>setNewItem(n=>({...n,sap:fmtSAP(v)}))} placeholder="___ ___ ___" small style={{width:110,fontFamily:"monospace",letterSpacing:1}}/>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>DÉSIGNATION</div>
              <Input value={newItem.label} onChange={v=>setNewItem(n=>({...n,label:v}))} placeholder="ex: Flux ELSOLD AP-10" small/>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,marginBottom:3}}>CATÉGORIE</div>
              <select value={newItem.cat} onChange={e=>setNewItem(n=>({...n,cat:e.target.value}))}
                style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"4px 8px",fontSize:11,fontFamily:"monospace",outline:"none"}}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <Btn onClick={add} color={C.accent} small>+ Ajouter</Btn>
          </div>
        </div>

        {/* Liste */}
        <div style={{overflow:"auto",flex:1}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr><TH w={30}>#</TH><TH w={120}>N° SAP</TH><TH>Désignation</TH><TH w={110}>Catégorie</TH><TH w={60}>Ordre</TH><TH w={30}></TH></tr>
            </thead>
            <tbody>
              {list.map((item,i)=>(
                <tr key={item.id} style={{background:i%2===0?"transparent":"#ffffff06"}}>
                  <TD center><span style={{color:C.muted,fontSize:10}}>{i+1}</span></TD>
                  <TD><Input value={item.sap||""} onChange={v=>upd(item.id,"sap",fmtSAP(v))} small style={{fontFamily:"monospace",fontSize:11,width:110,letterSpacing:1}} placeholder="___ ___ ___"/></TD>
                  <TD><Input value={item.label} onChange={v=>upd(item.id,"label",v)} small/></TD>
                  <TD>
                    <select value={item.cat||"Autre"} onChange={e=>upd(item.id,"cat",e.target.value)}
                      style={{background:"#0d1117",border:`1px solid ${CAT_COLORS[item.cat||"Autre"]}`,borderRadius:4,
                        color:CAT_COLORS[item.cat||"Autre"],padding:"3px 6px",fontSize:10,fontFamily:"monospace",outline:"none"}}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
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
  return new Date(2000+parseInt(yy),parseInt(mm)-1,parseInt(dd));
};
const isValidDMY = s => !s || !!parseDMY(normDP(s));
const dpStatus = s => {
  const d=parseDMY(normDP(s)); if(!d)return null;
  const diff=(d-new Date())/86400000;
  if(diff<0) return{color:C.red,   label:"PÉRIMÉ",  bg:"#da363340"};
  if(diff<30)return{color:C.yellow,label:"BIENTÔT", bg:"#d2992230"};
  return      {color:C.green, label:"OK",           bg:"transparent"};
};

// ─── Onglet Consommables — 1 ligne par consommable, liste déroulante ─────────
// Custom dropdown for consommables — colored by category
const ConsoDropdown = ({value, onChange, consommables, cats}) => {
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
  // If searching: flat filtered list; else: grouped by cat
  const filtered = q
    ? consommables.filter(c=>
        (c.sap||"").replace(/\s/g,"").includes(q.replace(/\s/g,"")) ||
        (c.label||"").toLowerCase().includes(q))
    : null;

  const handleSelect = id => { onChange(id); setOpen(false); setQuery(""); };

  return (
    <div ref={ref} style={{position:"relative",width:"100%"}}>
      {/* Trigger */}
      <div onClick={()=>setOpen(o=>!o)}
        style={{background:"#0d1117",border:`1px solid ${!value?C.yellow:selColor}`,borderRadius:4,
          padding:"4px 8px",fontSize:11,fontFamily:"monospace",cursor:"pointer",
          color:selected?selColor:C.muted,display:"flex",justifyContent:"space-between",alignItems:"center",userSelect:"none"}}>
        <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {selected ? (selected.sap||"—")+" — "+selected.label : "— choisir —"}
        </span>
        <span style={{marginLeft:6,fontSize:9,flexShrink:0}}>{open?"▲":"▼"}</span>
      </div>

      {/* Dropdown — uses fixed positioning to escape table overflow clipping */}
      {open&&(
        <div style={{position:"fixed",zIndex:9999,background:"#161b22",
          border:`1px solid ${C.border}`,borderRadius:4,boxShadow:"0 8px 32px #000c",
          width:320,maxHeight:320,display:"flex",flexDirection:"column",marginTop:2}}
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

          {/* Search box */}
          <div style={{padding:"6px 8px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
            <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="🔍 Rechercher N° SAP ou désignation…"
              style={{width:"100%",background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,
                color:C.text,fontSize:11,fontFamily:"monospace",padding:"4px 8px",outline:"none",boxSizing:"border-box"}}
              onClick={e=>e.stopPropagation()}/>
          </div>

          {/* Clear option */}
          <div onClick={()=>handleSelect("")}
            style={{padding:"5px 10px",fontSize:11,color:C.muted,cursor:"pointer",
              borderBottom:`1px solid ${C.border}`,flexShrink:0}}
            onMouseEnter={e=>e.currentTarget.style.background="#ffffff08"}
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
                          <span style={{fontWeight:700}}>{c.sap||"—"}</span>
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
                        color:catCol,background:"#0d1117",textTransform:"uppercase",
                        borderBottom:`1px solid ${C.border}33`,position:"sticky",top:0}}>
                        {cat}
                      </div>
                      {items.map(c=>(
                        <div key={c.id} onClick={()=>handleSelect(c.id)}
                          style={{padding:"5px 14px",fontSize:11,fontFamily:"monospace",cursor:"pointer",
                            color:catCol,borderLeft:`3px solid ${catCol}`,borderBottom:`1px solid ${C.border}22`}}
                          onMouseEnter={e=>e.currentTarget.style.background=catCol+"22"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <span style={{fontWeight:700}}>{c.sap||"—"}</span>
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

const TabConsommables = ({data,onChange,user,consommables,onEditList,header,forceShowDeleted=false}) => {
  // Structure hiérarchique : opérations → items consommables
  // ops = [{id, createdDT, createdVisa, fiche, op, validated, connError, deleted, …, items:[]}]
  const ops = data.ops||[];
  const [deleteOpTarget,  setDeleteOpTarget]  = useState(null);
  const [deleteItemTarget,setDeleteItemTarget] = useState(null); // {oid, iid}
  const [restoreOpTarget, setRestoreOpTarget] = useState(null);
  const [restoreItemTarget,setRestoreItemTarget] = useState(null); // {oid, iid}
  const [showDeleted, setShowDeleted] = useState(false);

  const cats     = [...new Set(consommables.map(i=>i.cat||"Autre"))];
  const getConso = id => consommables.find(c=>c.id===id);

  // ── Opérations ──────────────────────────────────────────────
  const addOp = () => {
    const last = ops.length>0?ops[ops.length-1]:null;
    onChange({ops:[...ops,{
      id:uid(), createdDT:nowDT(), createdVisa:user.trigram,
      sousEnsemble:last?.sousEnsemble||(header?.codeArticle||header?.description||""),
      fiche:last?.fiche||"", op:"",
      validated:false, connError:"", deleted:false,
      deletedReason:"",deletedVisa:"",deletedDate:"",
      items:[]
    }]});
  };
  const updOp = (oid,f,v) => onChange({ops:ops.map(o=>o.id===oid?{...o,[f]:v}:o)});
  const validateOp = oid => {
    const o=ops.find(x=>x.id===oid);
    if(!o?.fiche?.trim()||!o?.op?.trim()){
      onChange({ops:ops.map(x=>x.id===oid?{...x,connError:"Fiche et N° Opération requis"}:x)});
      return;
    }
    onChange({ops:ops.map(x=>x.id===oid?{...x,connError:"",validated:true}:x)});
  };
  const unlockOp = oid => updOp(oid,"validated",false);
  const confirmDelOp = reason => {
    onChange({ops:ops.map(o=>o.id===deleteOpTarget
      ?{...o,deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()}:o)});
    setDeleteOpTarget(null);
  };
  const restoreOp = reason => {
    onChange({ops:ops.map(o=>o.id===restoreOpTarget?{...o,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:o)});
    setRestoreOpTarget(null);
  };
  const dupOp = oid => {
    const o=ops.find(x=>x.id===oid); if(!o) return;
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
    const newItem={id:uid(),createdDT:nowDT(),createdVisa:user.trigram,
      consoId:"",lot:"",dp:"",remarque:"",tracaOk:false,visaTraca:"",dateTraca:"",
      deleted:false,deletedReason:"",deletedVisa:"",deletedDate:""};
    onChange({ops:ops.map(x=>x.id!==oid?x:{...x,items:[...x.items,newItem]})});
  };
  const updItem = (oid,iid,f,v) => onChange({ops:ops.map(o=>o.id!==oid?o:{
    ...o,items:o.items.map(it=>it.id===iid?{...it,[f]:v}:it)
  })});
  const delItem = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!it) return;
    if(!it.consoId&&!it.lot) onChange({ops:ops.map(x=>x.id!==oid?x:{...x,items:x.items.filter(i=>i.id!==iid)})});
    else setDeleteItemTarget({oid,iid});
  };
  const confirmDelItem = reason => {
    const {oid,iid}=deleteItemTarget;
    onChange({ops:ops.map(o=>o.id!==oid?o:{
      ...o,items:o.items.map(it=>it.id===iid
        ?{...it,deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()}:it)
    })});
    setDeleteItemTarget(null);
  };
  const restoreItem = reason => {
    const {oid,iid}=restoreItemTarget;
    onChange({ops:ops.map(o=>o.id!==oid?o:{
      ...o,items:o.items.map(it=>it.id===iid?{...it,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:it)
    })});
    setRestoreItemTarget(null);
  };
  const stampTraca = (oid,iid) => onChange({ops:ops.map(o=>o.id!==oid?o:{
    ...o,items:o.items.map(it=>it.id===iid?{...it,tracaOk:true,visaTraca:user.trigram,dateTraca:now()}:it)
  })});
  const clearTraca = (oid,iid) => onChange({ops:ops.map(o=>o.id!==oid?o:{
    ...o,items:o.items.map(it=>it.id===iid?{...it,tracaOk:false,visaTraca:"",dateTraca:""}:it)
  })});
  const validateItem = (oid,iid) => {
    const o=ops.find(x=>x.id===oid);
    const it=(o?.items||[]).find(x=>x.id===iid);
    if(!it) return;
    const miss=[];
    if(!it.consoId) miss.push("Consommable");
    if(!it.lot)     miss.push("LOT");
    if(!it.dp)      miss.push("DP");
    if(miss.length){
      onChange({ops:ops.map(x=>x.id!==oid?x:{...x,items:x.items.map(i=>i.id===iid?{...i,validError:"Requis : "+miss.join(", ")}:i)})});
      return;
    }
    onChange({ops:ops.map(x=>x.id!==oid?x:{...x,items:x.items.map(i=>i.id===iid?{...i,validated:true,validError:""}:i)})});
  };
  const unlockItem = (oid,iid) => onChange({ops:ops.map(o=>o.id!==oid?o:{
    ...o,items:o.items.map(it=>it.id===iid?{...it,validated:false}:it)
  })});

  // Collapsed: all validated ops collapsed except the last active one
  const lastActiveId = [...ops].filter(o=>!o.deleted).slice(-1)[0]?.id;
  const [collapsed, setCollapsed] = useState({});
  const isCollapsed = oid => {
    if(oid in collapsed) return collapsed[oid];
    // default: collapse validated ops that are not the last active
    const o = ops.find(x=>x.id===oid);
    return !!(o?.validated && oid!==lastActiveId);
  };
  const toggleCollapse = oid => setCollapsed(s=>({...s,[oid]:!isCollapsed(oid)}));

  const totalDelOps = ops.filter(o=>o.deleted).length;

  return (
    <div>
      {/* Toolbar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:8,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {cats.map(c=>{
            const n=ops.flatMap(o=>o.items).filter(it=>!it.deleted&&(getConso(it.consoId)?.cat||"Autre")===c).length;
            return <Badge key={c} label={`${n} ${c}`} color={CAT_COLORS[c]||C.muted}/>;
          })}
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={onEditList} color={C.border} small>⚙ Gérer la liste</Btn>
          {totalDelOps>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées"}
          </Btn>}
          <Btn onClick={addOp} small>+ Opération</Btn>
        </div>
      </div>

      {ops.length===0&&<div style={{textAlign:"center",color:C.muted,padding:32}}>Cliquez <strong>+ Opération</strong> pour commencer</div>}

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[...ops].filter(o=>!o.deleted||showDeleted||forceShowDeleted).reverse().map(o=>(
          <div key={o.id} style={{border:`1px solid ${o.deleted?"#da3633":C.border}`,borderRadius:8,overflow:"hidden",opacity:o.deleted?.65:1}}>

            {/* ── Header opération ── */}
            <div style={{background:o.deleted?"#da363315":"#1c2128",padding:"8px 14px",
              display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>

              <div style={{display:"flex",flexDirection:"column",gap:0,minWidth:120}}>
                <span style={{fontFamily:"monospace",fontSize:11,color:C.accent,fontWeight:700}}>{o.createdVisa||"—"}</span>
                <span style={{fontFamily:"monospace",fontSize:9,color:C.muted}}>{o.createdDT||""}</span>
              </div>

              {!o.validated&&<><span style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>Sous-ens.</span><Input value={o.sousEnsemble||""} onChange={v=>updOp(o.id,"sousEnsemble",v.toUpperCase())} small placeholder={header?.codeArticle||header?.description||"N° Article"} style={{width:110,fontFamily:"monospace",fontSize:10}}/></>}
              {o.validated&&o.sousEnsemble&&<span style={{fontFamily:"monospace",fontSize:10,color:C.muted}}>📦 {o.sousEnsemble}</span>}
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>Fiche</span>
                <Input value={o.fiche} onChange={v=>updOp(o.id,"fiche",v)} readOnly={!!o.validated}
                  placeholder="R4B-Q002" small style={{width:130,fontFamily:"monospace",fontWeight:700,
                    background:o.validated?"transparent":"#0d1117",
                    borderColor:o.validated?C.border:(!o.fiche?C.yellow:C.accent),
                    color:o.validated?C.muted:C.text}}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>Opération</span>
                <Input value={o.op} onChange={v=>updOp(o.id,"op",v)} readOnly={!!o.validated}
                  placeholder="10" small style={{width:65,textAlign:"center",
                    background:o.validated?"transparent":"#0d1117",
                    borderColor:o.validated?C.border:(!o.op?C.yellow:C.accent),
                    color:o.validated?C.muted:C.text}}/>
              </div>

              {o.validated&&(
                <span onClick={()=>toggleCollapse(o.id)}
                  style={{fontSize:11,color:C.muted,cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:4}}>
                  {isCollapsed(o.id)?"▶":"▼"}
                  {o.items.filter(it=>!it.deleted).length} consommable{o.items.filter(it=>!it.deleted).length!==1?"s":""}
                </span>
              )}
              {o.connError&&<span style={{color:"#d29922",fontSize:10,fontFamily:"monospace"}}>⚠ {o.connError}</span>}
              {o.deleted&&<span style={{color:"#da3633",fontSize:10,fontFamily:"monospace"}}>
                ✕ Annulé le {o.deletedDate} par {o.deletedVisa} — {o.deletedReason}
              </span>}

              <div style={{display:"flex",gap:8,marginLeft:"auto",alignItems:"center"}}>
                {!o.deleted&&!o.validated&&<ActionGroup>
                  <IconBtn onClick={()=>validateOp(o.id)} color={C.green} title="Valider">✓</IconBtn>
                  <IconBtn onClick={()=>onChange({ops:ops.filter(x=>x.id!==o.id)})} color={C.border} title="Supprimer">×</IconBtn>
                </ActionGroup>}
                {!o.deleted&&o.validated&&<>
                  <Btn onClick={()=>addItem(o.id)} color={C.blue} small>+ Consommable</Btn>
                  <ActionGroup>
                    <IconBtn onClick={()=>unlockOp(o.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                    <IconBtn onClick={()=>dupOp(o.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                    <IconBtn onClick={()=>setDeleteOpTarget(o.id)} color={C.red} title="Annuler">×</IconBtn>
                  </ActionGroup>
                </>}
                {o.deleted&&<span onClick={()=>setRestoreOpTarget(o.id)} style={{cursor:"pointer",color:"#d29922",fontSize:12,fontWeight:700,padding:"2px 6px",border:"1px solid #d29922",borderRadius:4}}>↩ Réactiver</span>}
              </div>
            </div>

            {/* ── Table consommables ── */}
            {o.validated&&!isCollapsed(o.id)&&(
              <div style={{overflowX:"auto"}}>
                {o.items.filter(it=>!it.deleted||showDeleted||forceShowDeleted).length===0?(
                  <div style={{textAlign:"center",color:C.muted,padding:14,fontSize:12}}>
                    Aucun consommable — cliquez <strong style={{color:C.blue}}>+ Consommable</strong>
                  </div>
                ):(
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{background:"#0d1117"}}>
                        <TH w={130}>Date / Heure</TH>
                        <TH w={65} color={C.accent}>Visa</TH>
                        <TH>Consommable</TH>
                        <TH w={100}>LOT</TH>
                        <TH w={95}>DP</TH>
                        <TH w={80}>Statut</TH>
                        <TH w={80} color={C.green}>☑ Traça</TH>
                        <TH w={130}>Remarque</TH>
                        <TH w={80}></TH>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items.filter(it=>!it.deleted||showDeleted||forceShowDeleted).map((it,idx)=>{
                        const conso    = getConso(it.consoId);
                        const catColor = CAT_COLORS[conso?.cat||"Autre"]||C.muted;
                        const st       = dpStatus(it.dp);
                        const inv      = it.dp && !isValidDMY(it.dp);
                        return [
                          <tr key={it.id} style={{
                            background:it.deleted?"#da363318":it.tracaOk?"#23863610":idx%2===0?"transparent":"#ffffff06",
                            borderLeft:`3px solid ${it.deleted?"#da3633":it.tracaOk?C.green:it.validated?C.green:conso?catColor:C.border}`,
                            textDecoration:it.deleted?"line-through":undefined,
                            opacity:it.deleted?.6:1,
                            pointerEvents:it.deleted?"none":undefined}}>
                            <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{it.createdDT||"—"}</span></TD>
                            <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{it.createdVisa||"—"}</span></TD>
                            <TD style={{minWidth:220}}>
                              {it.validated
                                ? <div style={{background:"#1c2128",border:`1px solid ${C.border}`,borderRadius:4,
                                    padding:"4px 8px",fontSize:11,fontFamily:"monospace",color:C.muted,
                                    pointerEvents:"none",opacity:.8}}>
                                    {(()=>{const c=getConso(it.consoId);return c?(c.sap||"—")+" — "+c.label:"—";})()}
                                  </div>
                                : <ConsoDropdown value={it.consoId||""} onChange={v=>updItem(o.id,it.id,"consoId",v)} consommables={consommables} cats={cats}/>}
                            </TD>
                            <TD>
                              <Input value={it.lot} onChange={v=>updItem(o.id,it.id,"lot",v)} small
                                readOnly={!!it.validated} style={{width:90,...(it.validated?LOCKED_INPUT_STYLE:{})}}/>
                            </TD>
                            <TD>
                              <Input value={it.dp} onChange={v=>updItem(o.id,it.id,"dp",v)}
                                placeholder="JJ.MM.AA" small readOnly={!!it.validated}
                                onBlur={e=>!it.validated&&updItem(o.id,it.id,"dp",normDP(e.target.value))}
                                style={{width:83,...(it.validated?LOCKED_INPUT_STYLE:{borderColor:inv?C.red:(!it.dp)?C.yellow:st?st.color:undefined,background:st?.bg,color:inv?C.red:st?.color})}}/> 
                              {inv&&!it.validated&&<div style={{color:C.red,fontSize:9,marginTop:1}}>JJ.MM.AA</div>}
                            </TD>
                            <TD center>
                              {inv?<Badge label="FORMAT?" color={C.red}/>
                                :st?<Badge label={st.label} color={st.color}/>
                                :<span style={{color:C.muted,fontSize:10}}>—</span>}
                            </TD>
                            <TD>
                              {it.tracaOk
                                ?<div style={{display:"flex",flexDirection:"column",gap:1}}>
                                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                                      <span style={{fontFamily:"monospace",fontWeight:700,fontSize:11,color:C.green,background:"#23863620",padding:"1px 6px",borderRadius:4}}>{it.visaTraca}</span>
                                      <span onClick={()=>clearTraca(o.id,it.id)} style={{cursor:"pointer",color:C.muted,fontSize:12}} title="Annuler traça">↺</span>
                                    </div>
                                    <span style={{fontFamily:"monospace",fontSize:9,color:C.muted}}>{it.dateTraca}</span>
                                  </div>
                                :<Btn onClick={()=>stampTraca(o.id,it.id)} color={C.green} small>☑ Traça</Btn>}
                            </TD>
                            <TD center><CommentBtn comments={it.comments||[]} onChange={v=>updItem(o.id,it.id,"comments",v)} user={user}/></TD>
                            <TD center style={{pointerEvents:"all"}}>
                              {!it.deleted&&!it.validated&&(
                                <ActionGroup>
                                  <IconBtn onClick={()=>validateItem(o.id,it.id)} color={C.green} title="Valider">✓</IconBtn>
                                  <IconBtn onClick={()=>onChange({ops:ops.map(x=>x.id!==o.id?x:{...x,items:x.items.filter(i=>i.id!==it.id)})})} color={C.border} title="Supprimer">×</IconBtn>
                                </ActionGroup>
                              )}
                              {!it.deleted&&it.validated&&(
                                <ActionGroup>
                                  <IconBtn onClick={()=>unlockItem(o.id,it.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                                  <IconBtn onClick={()=>delItem(o.id,it.id)} color={C.red} title="Annuler">×</IconBtn>
                                </ActionGroup>
                              )}
                            </TD>
                          </tr>,
                          it.deleted&&(
                            <tr key={it.id+"_ann"}>
                              <td colSpan={99} style={{padding:"3px 10px 5px",background:"#da363325",borderBottom:"1px solid #da363355"}}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                  <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace"}}>
                                    ✕ Annulé le <strong>{it.deletedDate}</strong> par <strong>{it.deletedVisa}</strong> — {it.deletedReason}
                                  </span>
                                  <span onClick={e=>{e.stopPropagation();setRestoreItemTarget({oid:o.id,iid:it.id});}}
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {deleteOpTarget&&<DeleteModal onConfirm={confirmDelOp} onCancel={()=>setDeleteOpTarget(null)}/>}
      {deleteItemTarget&&<DeleteModal onConfirm={confirmDelItem} onCancel={()=>setDeleteItemTarget(null)}/>}
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


const TabTestEquip = ({data,onChange,user,header,forceShowDeleted=false}) => {
  const rows=data.rows||[];
  const add=()=>onChange({rows:[...rows,{
    id:uid(),sousEnsemble:header?.codeArticle||header?.description||"",nInv:"",type:"",designation:"",
    dateExpiration:"",
    isFour:false,
    visa:user.trigram,
    checkDate:now(),
    createdVisa:user.trigram,
    createdDT:nowDT(),
    commentaires:""
  }]});
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const upd=(id,f,v)=>onChange({rows:rows.map(r=>r.id===id?{...r,[f]:v}:r)});
  const dup=id=>onChange({rows:[...rows,duplicateRow(rows.find(r=>r.id===id),user,{
    visa:user.trigram,checkDate:now()
  })]});
  const del=id=>setDeleteTarget(id);
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ onChange({rows:rows.map(r=>r.id===deleteTarget?{...r,deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()}:r)}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  const REQUIRED = [
    {key:"nInv",          label:"N° INV"},
    {key:"type",          label:"Type"},
    {key:"designation",   label:"Désignation"},
    {key:"dateExpiration",label:"Date calibration"},
  ];
  const validateRow=id=>{ const r=rows.find(x=>x.id===id); const miss=checkRequired(r,REQUIRED); if(miss.length) { upd(id,"validError","Champs requis : "+miss.join(", ")); } else { upd(id,"validError",""); upd(id,"validated",true); } };
  const unlockRow=id=>upd(id,"validated",false);
  const horsCalib=rows.filter(r=>!r.deleted&&(()=>{const s=calibStatus(r.dateExpiration);return s&&s.color===C.red;})());
  return (
    <div>
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
        {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
          {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
        </Btn>}
        <Btn onClick={add} small>+ Équipement</Btn>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
          <thead>
            <tr>
              <TH w={130}>Date / Heure</TH><TH w={65} color={C.accent}>Visa</TH>
              <TH w={130}>Sous-ensemble</TH>
              <TH w={58}>Four</TH>
              <TH>N° INV</TH>
              <TH>TYPE</TH>
              <TH>DÉSIGNATION</TH>
              <TH w={130}>Date calib</TH>
              <TH w={120}>Statut</TH>
              <TH>COMMENTAIRES</TH>
              <TH w={30}></TH>
            </tr>
          </thead>
          <tbody>
            {[...rows].reverse().flatMap((r,i)=>{
              if(r.deleted&&!showDeleted&&!forceShowDeleted) return [];
              const st=calibStatus(r.dateExpiration);
              const invalid=r.dateExpiration&&!isValidCalibDate(r.dateExpiration);
              return [
                <tr key={r.id} style={{background:r.deleted?"#da363318":st?.bg||(i%2===0?"transparent":"#ffffff06"),
                  textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:1,
                  pointerEvents:r.deleted?"none":undefined,
                  borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
                  <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{r.createdDT||"—"}</span></TD>
                  <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span></TD>
                  <TD><Input value={r.sousEnsemble||""} onChange={v=>upd(r.id,"sousEnsemble",v.toUpperCase())} small readOnly={!!r.validated} placeholder={header?.codeArticle||header?.description||"N° Article"} style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",...(r.validated?LOCKED_INPUT_STYLE:{})}} /></TD>
                  <TD center style={{pointerEvents:r.deleted?"none":"all"}}>
                    <input type="checkbox" checked={!!r.isFour} disabled={!!r.validated}
                      onChange={e=>upd(r.id,"isFour",e.target.checked)}
                      title="Définir cet équipement comme four pour le proposer dans l'onglet Étuvages"
                      style={{width:16,height:16,accentColor:C.accent,cursor:r.validated?"default":"pointer"}}/>
                  </TD>
                  <TD><Input value={r.nInv} onChange={v=>upd(r.id,"nInv",v)} small readOnly={!!r.validated} style={r.validated?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.type}        onChange={v=>upd(r.id,"type",v)}        small readOnly={!!r.validated} style={r.validated?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.designation} onChange={v=>upd(r.id,"designation",v)} small readOnly={!!r.validated} style={r.validated?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD>
                    <Input value={r.dateExpiration} onChange={v=>upd(r.id,"dateExpiration",v)}
                      placeholder="2026-06 ou AAMM" small readOnly={!!r.validated}
                      onBlur={e=>!r.validated&&upd(r.id,"dateExpiration",normCalib(e.target.value))}
                      style={{...(r.validated?LOCKED_INPUT_STYLE:{borderColor:invalid?C.red:undefined,color:invalid?C.red:undefined})}}/>
                    {invalid&&!r.validated&&<div style={{color:C.red,fontSize:9,marginTop:2}}>Format AAAA-MM, mois 01-12</div>}
                  </TD>
                  <TD center>
                    {st
                      ? <Badge label={st.label} color={st.color}/>
                      : <span style={{color:C.muted,fontSize:10}}>—</span>
                    }
                  </TD>

                  <TD>
                    <Input value={r.checkDate} onChange={v=>upd(r.id,"checkDate",v)} small/>
                  </TD>
                  <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user}/></TD>
                  <TD center style={{pointerEvents:"all",minWidth:110}}>
                    {!r.deleted&&!r.validated&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <IconBtn onClick={()=>onChange({rows:rows.filter(x=>x.id!==r.id)})} color={C.border} title="Supprimer">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!r.deleted&&r.validated&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <IconBtn onClick={()=>setDeleteTarget(r.id)} color={C.red} title="Annuler">×</IconBtn>
                      </ActionGroup>
                    )}
                  </TD>
                </tr>,
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
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
      {deleteTarget&&<DeleteModal onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
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
        <div style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:"#0d1117"}}>
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

// ─── 5+6. Faits (NC / DM / ISS / …) ───────────────────────────────────────
const TabFaits = ({data,onChange,user,faitTypes,onEditTypes,header,forceShowDeleted=false}) => {
  const rows     = data.rows||[];
  const types    = faitTypes;
  const isClosed = r => !!r.closedDate;

  const add  = () => onChange({rows:[...rows,{
    id:uid(), createdVisa:user.trigram, createdDT:nowDT(),
    sousEnsemble:header?.codeArticle||header?.description||"",
    type:"", numero:"", visa:user.trigram, date:now(),
    lien:"", commentaires:"", closedVisa:"", closedDate:""
  }]});
  const upd   = (id,f,v) => onChange({rows:rows.map(r=>r.id===id?{...r,[f]:v}:r)});
  const dup=id=>onChange({rows:[...rows,duplicateRow(rows.find(r=>r.id===id),user,{
    visa:user.trigram,date:now(),closedVisa:"",closedDate:""
  })]});
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const [copiedLien,setCopiedLien]     = useState(null);
  const del   = id => setDeleteTarget(id);
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ onChange({rows:rows.map(r=>r.id===deleteTarget?{...r,deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()}:r)}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  const REQUIRED = [
    {key:"type",   label:"Type"},
    {key:"numero", label:"N° (référence)"},
    {key:"visa",   label:"Visa"},
    {key:"date",   label:"Date ouverture"},
  ];
  const validateRow=id=>{ const r=rows.find(x=>x.id===id); const miss=checkRequired(r,REQUIRED); if(miss.length) { upd(id,"validError","Champs requis : "+miss.join(", ")); } else { upd(id,"validError",""); upd(id,"validated",true); } };
  const unlockRow=id=>upd(id,"validated",false);
  const close = id => onChange({rows:rows.map(r=>r.id===id?{...r,closedVisa:user.trigram,closedDate:now()}:r)});
  const reopen= id => onChange({rows:rows.map(r=>r.id===id?{...r,closedVisa:"",closedDate:""}:r)});

  const open   = rows.filter(r=>!r.deleted&&!isClosed(r)).length;
  const closed = rows.filter(r=>!r.deleted&&isClosed(r)).length;

  // Compteurs par type
  const typeCounts = types.map(t=>({...t, n:rows.filter(r=>r.type===t.id).length}));

  return (
    <div>
      {/* En-tête stats + boutons */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:8,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 14px",textAlign:"center"}}>
            <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Total</div>
            <div style={{color:C.text,fontSize:20,fontWeight:900,fontFamily:"monospace",lineHeight:1}}>{rows.length}</div>
          </div>
          {typeCounts.filter(t=>t.n>0).map(t=>(
            <Badge key={t.id} label={`${t.n} ${t.id}`} color={t.color}/>
          ))}
          <Badge label={`${open} ouvert${open>1?"s":""}`}   color={C.yellow}/>
          <Badge label={`${closed} clôturé${closed>1?"s":""}`} color={C.green}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={onEditTypes} color={C.border} small>⚙ Types</Btn>
          {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
          </Btn>}
          <Btn onClick={add} small>+ Fait</Btn>
        </div>
      </div>

      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <TH w={130}>Date / Heure</TH><TH w={65} color={C.accent}>Visa</TH>
            <TH w={130}>Sous-ensemble</TH>
            <TH w={90}>Type</TH>
            <TH w={130}>N° (saisi)</TH>
            <TH w={80} color={C.accent}>Visa ✦</TH>
            <TH w={95}>Date ouv.</TH>
            <TH w={240}>Lien / Chemin réseau</TH>
            <TH>Commentaires</TH>
            <TH w={95}>Date clôt.</TH>
            <TH w={80}>Visa clôt.</TH>
            <TH w={110}>Action</TH>
            <TH w={30}></TH>
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().flatMap((r,i)=>{
            if(r.deleted&&!showDeleted&&!forceShowDeleted) return [];
            const typeColor = getFaitColor(r.type, types);
            const closed_r  = isClosed(r);
            return [
              <tr key={r.id} style={{background:r.deleted?"#da363318":closed_r?"#23863612":i%2===0?"transparent":"#ffffff06",
                textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:closed_r?.85:1,
                pointerEvents:r.deleted?"none":undefined,
                borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>

                <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{r.createdDT||"—"}</span></TD>
                <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span></TD>
                <TD><Input value={r.sousEnsemble||""} onChange={v=>upd(r.id,"sousEnsemble",v.toUpperCase())} small readOnly={!!r.validated} placeholder={header?.codeArticle||header?.description||"N° Article"} style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",...(r.validated?LOCKED_INPUT_STYLE:{})}} /></TD>

                {/* Type — liste déroulante */}
                <TD>

                  {r.validated
                    ? <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:typeColor,background:typeColor+"22",padding:"2px 8px",borderRadius:4}}>{r.type||"—"}</span>
                    : <><select value={r.type||""} onChange={e=>upd(r.id,"type",e.target.value)}
                        style={{background:"#0d1117",border:`1px solid ${r.type?typeColor:C.yellow}`,borderRadius:4,
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
                  <Input value={r.numero} onChange={v=>upd(r.id,"numero",v)} small required readOnly={!!r.validated}
                    title="Numéro du fait (ex: NC-2024-001, DM-0042…)"
                    style={{fontFamily:"monospace",fontWeight:700,...(r.validated?LOCKED_INPUT_STYLE:{color:r.numero?typeColor:undefined})}}/>
                </TD>

                {/* Visa ouverture */}
                <TD>
                  <Input value={r.visa} onChange={v=>upd(r.id,"visa",v)} small readOnly={!!r.validated}
                    style={r.validated?LOCKED_INPUT_STYLE:{background:"#e05c0015",borderColor:C.accent,color:C.accent,fontWeight:700}}/>
                </TD>

                {/* Date ouverture */}
                <TD>
                  <Input value={r.date} onChange={v=>upd(r.id,"date",v)} small readOnly={!!r.validated} style={r.validated?LOCKED_INPUT_STYLE:{}}/>
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
                    if(r.validated&&r.lien) return (
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
                        <Input value={r.lien||""} onChange={v=>upd(r.id,"lien",v)} small
                          title="URL (https://…) ou chemin réseau (\\\\serveur\\dossier)"
                          style={{flex:1,fontSize:10}}/>
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
                  <Input value={r.commentaires} onChange={v=>upd(r.id,"commentaires",v)} small/>
                </TD>

                {/* Date clôture */}
                <TD>
                  <Input value={r.closedDate} onChange={v=>upd(r.id,"closedDate",v)} small
                    style={{background:closed_r?"#23863620":undefined,color:closed_r?C.green:undefined}}/>
                </TD>

                {/* Visa clôture */}
                <TD>
                  <Input value={r.closedVisa} onChange={v=>upd(r.id,"closedVisa",v)} small
                    style={{background:closed_r?"#23863620":undefined,color:closed_r?C.green:undefined,fontWeight:closed_r?700:400}}/>
                </TD>

                {/* Action */}
                <TD center>
                  <ActionGroup>
                    {!closed_r
                      ?<IconBtn onClick={()=>close(r.id)} color={C.green} title="Clôturer">✓</IconBtn>
                      :<IconBtn onClick={()=>reopen(r.id)} color={C.yellow} title="Réouvrir">↩</IconBtn>}
                  </ActionGroup>
                </TD>

                <TD center style={{pointerEvents:"all",minWidth:110}}>
                  {!r.deleted&&!r.validated&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                      <IconBtn onClick={()=>onChange({rows:rows.filter(x=>x.id!==r.id)})} color={C.border} title="Supprimer">×</IconBtn>
                    </ActionGroup>
                  )}
                  {!r.deleted&&r.validated&&(
                    <ActionGroup>
                      <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                      <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
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
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
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
      {deleteTarget&&<DeleteModal onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

// ─── 7. Étuvages ───────────────────────────────────────────────────────────
const TabEtuvage = ({data,onChange,user,allRows,tstRows,header,forceShowDeleted=false}) => {
  const rows=data.rows||[];
  const fours=(tstRows||[]).filter(t=>!t.deleted&&t.isFour);
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const add=()=>onChange({rows:[...rows,{id:uid(),sousEnsemble:header?.codeArticle||header?.description||"",createdVisa:user?.trigram||"",createdDT:nowDT(),fourN:"",duree:"",temp:"",entreeVisa:"",entreeDT:"",sortieVisa:"",sortieDT:"",comments:[]}]});
  const upd=(id,f,v)=>onChange({rows:rows.map(r=>r.id===id?{...r,[f]:v}:r)});
  const dup=id=>onChange({rows:[...rows,duplicateRow(rows.find(r=>r.id===id),user,{
    entreeVisa:"",entreeDT:"",sortieVisa:"",sortieDT:""
  })]});
  const del=id=>setDeleteTarget(id);
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ onChange({rows:rows.map(r=>r.id===deleteTarget?{...r,deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()}:r)}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  // validateAndEnter: check required fields then stamp entrée atomically
  const validateAndEnter=id=>{
    const r=rows.find(x=>x.id===id);
    if(!r) return;
    const miss=[];
    if(!r.fourN) miss.push("Four N°");
    if(!r.duree) miss.push("Durée [H]");
    if(!r.temp)  miss.push("Temp [°C]");
    if(miss.length){
      onChange({rows:rows.map(x=>x.id===id?{...x,validError:"Requis avant entrée : "+miss.join(", ")}:x)});
      return;
    }
    onChange({rows:rows.map(x=>x.id===id?{...x,entreeDT:nowDT(),entreeVisa:user?.trigram||"",validated:true,validError:""}:x)});
  };
  const unlockRow=id=>onChange({rows:rows.map(x=>x.id===id?{...x,validated:false,entreeDT:"",entreeVisa:""}:x)});
  const stamp=(id,field)=>{
    const extra = field==="entreeDT"
      ? {entreeVisa:user?.trigram||"", validated:true, validError:""}
      : field==="sortieDT"
      ? {sortieVisa:user?.trigram||""}
      : {};
    onChange({rows:rows.map(r=>r.id===id?{...r,[field]:nowDT(),...extra}:r)});
  };
  const nei = nextEtuvageInfo(allRows||rows);
  return (
    <div>
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
        {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
          {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
        </Btn>}
        <Btn onClick={add} small>+ Étuvage</Btn>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:820}}>
          <thead>
            <tr>
              <TH w={130}>Date / Heure</TH><TH w={65} color={C.accent}>Visa</TH>
              <TH w={130}>Sous-ensemble</TH>
              <TH w={80}>Four N°</TH><TH w={70}>Durée [H]</TH><TH w={70}>Temp [°C]</TH>
              <TH w={120}>▶ Entrée four</TH><TH w={145}>Date/Heure entrée</TH>
              <TH w={120}>■ Sortie four</TH><TH w={145}>Date/Heure sortie</TH>
              <TH w={40}>💬</TH>
              <TH w={30}></TH>
            </tr>
          </thead>
          <tbody>
            {[...rows].reverse().flatMap((r,i)=>{
              if(r.deleted&&!showDeleted&&!forceShowDeleted) return [];
              const inFour=!!r.entreeDT,outFour=!!r.sortieDT;
              const fourVal=r.fourN.trim().toLowerCase();
              const fourOk=!r.fourN||fours.some(t=>
                (t.nInv||"").trim().toLowerCase()===fourVal ||
                (t.designation||"").trim().toLowerCase()===fourVal
              );
              return [
                <tr key={r.id} style={{background:r.deleted?"#da363318":outFour?"#23863610":inFour?"#1f6feb10":i%2===0?"transparent":"#ffffff06",
                  textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:1,
                  pointerEvents:r.deleted?"none":undefined,
                  borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
                  <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{r.createdDT||"—"}</span></TD>
                  <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span></TD>
                  <TD><Input value={r.sousEnsemble||""} onChange={v=>upd(r.id,"sousEnsemble",v.toUpperCase())} small readOnly={!!r.validated} placeholder={header?.codeArticle||header?.description||"N° Article"} style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",...(r.validated?LOCKED_INPUT_STYLE:{})}} /></TD>
                  <TD>
                    {r.validated?(
                      <Input value={r.fourN} small readOnly style={LOCKED_INPUT_STYLE}/>
                    ):(
                      <>
                        <input list="fours-etuvage" value={r.fourN||""} onChange={e=>upd(r.id,"fourN",e.target.value)}
                          placeholder={fours.length?"Choisir four":"Aucun four"}
                          style={{width:"100%",fontFamily:"monospace",outline:"none",padding:"4px 6px",fontSize:11,
                            background:"#0d1117",color:r.fourN&&!fourOk?C.yellow:C.text,
                            border:`1px solid ${r.fourN&&!fourOk?C.yellow:C.border}`,borderRadius:4}}/>
                        <datalist id="fours-etuvage">
                          {fours.map(f=><option key={f.id} value={f.nInv||f.designation}>{[f.nInv,f.designation].filter(Boolean).join(" — ")}</option>)}
                        </datalist>
                      </>
                    )}
                    {r.fourN&&!fourOk&&!r.validated&&<div style={{color:C.yellow,fontSize:9,marginTop:1,whiteSpace:"nowrap"}}>⚠ non coché four</div>}
                    {!r.fourN&&!fours.length&&!r.validated&&<div style={{color:C.muted,fontSize:9,marginTop:1,whiteSpace:"nowrap"}}>Cochez un four dans Test Equip.</div>}
                  </TD>
                  <TD><Input value={r.duree} onChange={v=>upd(r.id,"duree",v)} small placeholder="h" readOnly={!!r.validated} style={r.validated?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD><Input value={r.temp}  onChange={v=>upd(r.id,"temp",v)}  small placeholder="°C" readOnly={!!r.validated} style={r.validated?LOCKED_INPUT_STYLE:{}}/></TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!inFour
                      ? <Btn onClick={()=>validateAndEnter(r.id)} color={C.blue} small>▶ Entrée four</Btn>
                      : <div style={{display:"flex",flexDirection:"column",gap:1,alignItems:"center"}}>
                          <Badge label="▶ EN FOUR" color={C.blue}/>
                          <span style={{fontFamily:"monospace",fontSize:9,color:C.blue}}>{r.entreeVisa}</span>
                        </div>}
                  </TD>
                  <TD><span style={{fontFamily:"monospace",fontSize:11,color:inFour?C.blue:C.muted}}>{r.entreeDT||"—"}</span></TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!outFour
                      ? <Btn onClick={()=>stamp(r.id,"sortieDT")} color={C.green} small disabled={!inFour}>■ Sortie</Btn>
                      : <div style={{display:"flex",flexDirection:"column",gap:1,alignItems:"center"}}>
                          <Badge label="■ SORTI" color={C.green}/>
                          <span style={{fontFamily:"monospace",fontSize:9,color:C.green}}>{r.sortieVisa}</span>
                        </div>}
                  </TD>
                  <TD><span style={{fontFamily:"monospace",fontSize:11,color:outFour?C.green:C.muted}}>{r.sortieDT||"—"}</span></TD>
                  <TD center style={{pointerEvents:"all"}}>
                    <CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user}/>
                  </TD>
                  <TD center style={{pointerEvents:"all",minWidth:80}}>
                    {!r.deleted&&!inFour&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <IconBtn onClick={()=>del(r.id)} color={C.border} title="Supprimer">×</IconBtn>
                      </ActionGroup>
                    )}
                    {!r.deleted&&inFour&&(
                      <ActionGroup>
                        <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                        <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                        <IconBtn onClick={()=>del(r.id)} color={C.red} title="Annuler">×</IconBtn>
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
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
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
      {deleteTarget&&<DeleteModal onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

// ─── 8. Matting / Dematting ────────────────────────────────────────────────
// Modèle : journal d'actions par connecteur
// events = [{id, dt, visa, action:"Matting"|"Dematting", remarque:"", comments:[]}]
// Cycles = events.length / 2  (décimal : 0.5, 1, 1.5, 2…)
// Alternance stricte après la première action (libre)
// Suppression avec motif sur chaque événement
const TabDeMating = ({data,onChange,user,header,forceShowDeleted=false}) => {
  const connectors = data.connectors||[];
  const [deleteEvTarget,   setDeleteEvTarget]   = useState(null); // {cid,eid}
  const [deleteConnTarget, setDeleteConnTarget] = useState(null); // cid
  const [restoreEvTarget,   setRestoreEvTarget]   = useState(null); // {cid,eid}
  const [restoreConnTarget, setRestoreConnTarget] = useState(null); // cid
  const [showDeleted, setShowDeleted] = useState(false);
  const [historyConnector,setHistoryConnector] = useState("all");

  // ── Connecteurs ─────────────────────────────────────────────
  const addC = () => onChange({connectors:[...connectors,{
    id:uid(), sousEnsemble:header?.codeArticle||header?.description||"", nConect:"", validated:false, connError:"",
    deleted:false, deletedReason:"", deletedVisa:"", deletedDate:"",
    createdVisa:user?.trigram||"",
    comments:[],
    events:[]
  }]});
  const updC = (cid,f,v) => onChange({connectors:connectors.map(c=>c.id===cid?{...c,[f]:v}:c)});
  const dupC = cid => {
    const c=connectors.find(x=>x.id===cid); if(!c) return;
    onChange({connectors:[...connectors,duplicateRow(c,user,{
      nConect:c.nConect?`${c.nConect}-COPIE`:"",
      comments:[],
      events:[]
    })]});
  };
  const validateConn = cid => {
    const c=connectors.find(x=>x.id===cid);
    if(!c?.nConect?.trim()){ onChange({connectors:connectors.map(x=>x.id===cid?{...x,connError:"Nom du connecteur requis (ex: J13)"}:x)}); return; }
    onChange({connectors:connectors.map(x=>x.id===cid?{...x,connError:"",validated:true}:x)});
  };
  const unlockConn = cid => updC(cid,"validated",false);
  const restoreC   = reason => {
    onChange({connectors:connectors.map(c=>c.id===restoreConnTarget?{...c,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:c)});
    setRestoreConnTarget(null);
  };
  const confirmDelConn = reason => {
    onChange({connectors:connectors.map(c=>c.id===deleteConnTarget
      ?{...c,deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()}:c)});
    setDeleteConnTarget(null);
  };

  // ── Événements ───────────────────────────────────────────────
  // Dernier événement actif (non supprimé)
  const lastActive = c => [...(c.events||[])].filter(e=>!e.deleted).slice(-1)[0]||null;

  // Prochaine action attendue : "either" si aucun event, sinon opposé du dernier
  const nextExpected = c => {
    const last = lastActive(c);
    if(!last) return "either";
    return last.action==="Matting" ? "Dematting" : "Matting";
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
    return last.action==="Matting"
      ? {label:"⚡ MATTÉ", color:C.green}
      : {label:"✓ DEMATTÉ", color:C.yellow};
  };

  const addEvent = (cid, action) => {
    const c = connectors.find(x=>x.id===cid); if(!c) return;
    const ne = nextExpected(c);
    if(ne!=="either"&&ne!==action) return; // should not happen (button disabled)
    const ev = {id:uid(), dt:nowDT(), visa:user?.trigram||"", action, remarque:"", comments:[], deleted:false, deletedReason:"", deletedVisa:"", deletedDate:""};
    onChange({connectors:connectors.map(x=>x.id!==cid?x:{...x,events:[...(x.events||[]),ev]})});
  };
  const requestEventFromTile = c => {
    if(!c.validated||c.deleted) return;
    const action = nextExpected(c)==="either" ? "Matting" : nextExpected(c);
    const label = action==="Matting" ? "Matting" : "Dematting";
    if(window.confirm(`${c.nConect||"Connecteur"} : enregistrer ${label} maintenant ?`)) {
      addEvent(c.id, action);
    }
  };

  const updEv = (cid,eid,f,v) => onChange({connectors:connectors.map(c=>c.id!==cid?c:{
    ...c,events:c.events.map(e=>e.id===eid?{...e,[f]:v}:e)
  })});

  const confirmDelEv = reason => {
    const {cid,eid}=deleteEvTarget;
    onChange({connectors:connectors.map(c=>c.id!==cid?c:{
      ...c,events:c.events.map(e=>e.id===eid?{...e,deleted:true,deletedReason:reason,deletedVisa:user?.trigram||"?",deletedDate:nowDT()}:e)
    })});
    setDeleteEvTarget(null);
  };
  const restoreEv = reason => {
    const {cid,eid}=restoreEvTarget;
    onChange({connectors:connectors.map(c=>c.id!==cid?c:{
      ...c,events:c.events.map(e=>e.id===eid?{...e,deleted:false,restoredReason:reason,restoredVisa:user?.trigram||"?",restoredDate:nowDT()}:e)
    })});
    setRestoreEvTarget(null);
  };

  const totalDeleted = connectors.filter(c=>c.deleted).length;
  const visibleConnectors = connectors.filter(c=>!c.deleted||showDeleted||forceShowDeleted);
  const historyRows = connectors.flatMap(c=>(c.events||[]).map((ev,idx)=>({
    c, ev, cycle:(idx+1)/2
  }))).filter(x=>
    (!x.c.deleted||showDeleted||forceShowDeleted) &&
    (!x.ev.deleted||showDeleted||forceShowDeleted) &&
    (historyConnector==="all" || x.c.id===historyConnector)
  ).reverse();

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{color:C.muted,fontSize:11}}>
          {visibleConnectors.length} connecteur{visibleConnectors.length>1?"s":""} affiché{visibleConnectors.length>1?"s":""}
        </div>
        <div style={{display:"flex",gap:8}}>
          {totalDeleted>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulés":"▼ Voir annulés"}
          </Btn>}
          <Btn onClick={addC} small>+ Connecteur</Btn>
        </div>
      </div>

      {connectors.length===0&&(
        <div style={{textAlign:"center",color:C.muted,padding:48,fontSize:13}}>
          Cliquez <strong>+ Connecteur</strong> pour ajouter un connecteur (J13, J15…)
        </div>
      )}

      {connectors.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(118px,1fr))",
          gap:10,marginBottom:16}}>
          {visibleConnectors.map(c=>{
            const st=connStatus(c);
            const cy=cycleCount(c);
            const ne=nextExpected(c);
            const nextLabel=!c.validated?"À valider":c.deleted?"Annulé":ne==="either"?"Matting":ne;
            const nextColor=!c.validated?C.muted:c.deleted?C.red:nextLabel==="Matting"?C.green:C.yellow;
            const last=lastActive(c);
            return (
              <div key={c.id} onClick={()=>requestEventFromTile(c)}
                title={c.validated&&!c.deleted?`Cliquer pour enregistrer ${nextLabel}`:"Valider le connecteur avant action"}
                style={{minHeight:138,border:`2px solid ${c.deleted?C.red:st.color}`,
                  background:c.deleted?"#da363318":st.color+"16",borderRadius:8,padding:10,
                  cursor:c.validated&&!c.deleted?"pointer":"default",display:"flex",flexDirection:"column",
                  justifyContent:"space-between",boxShadow:c.validated&&!c.deleted?`0 0 0 1px ${st.color}22 inset`:undefined}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                  {!c.validated?(
                    <div onClick={e=>e.stopPropagation()} style={{width:76}}>
                      <Input value={c.nConect} onChange={v=>updC(c.id,"nConect",v.toUpperCase())}
                        placeholder="J13" small style={{fontWeight:900,fontSize:15,textTransform:"uppercase"}}/>
                    </div>
                  ):(
                    <div style={{fontFamily:"monospace",fontSize:22,fontWeight:900,color:C.text,lineHeight:1}}>
                      {c.nConect||"J?"}
                    </div>
                  )}
                  <span style={{fontSize:10,fontFamily:"monospace",color:st.color,fontWeight:800}}>
                    {cy}
                  </span>
                </div>
                {c.connError&&<div style={{fontSize:9,color:C.yellow,fontFamily:"monospace"}}>{c.connError}</div>}
                <div>
                  <div style={{fontSize:10,color:st.color,fontWeight:800,textTransform:"uppercase",letterSpacing:.4}}>
                    {st.label.replace("⚡ ","").replace("✓ ","")}
                  </div>
                  <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginTop:2}}>
                    {last?`${last.visa||"?"} · ${last.dt||""}`:"aucune action"}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                  <span style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>Suivant</span>
                  <span style={{fontSize:10,fontFamily:"monospace",fontWeight:900,color:nextColor,
                    border:`1px solid ${nextColor}`,borderRadius:12,padding:"1px 7px"}}>
                    {nextLabel==="Matting"?"▲ Mat":nextLabel==="Dematting"?"▼ Demat":nextLabel}
                  </span>
                </div>
                <div onClick={e=>e.stopPropagation()}
                  style={{display:"flex",gap:4,alignItems:"center",justifyContent:"flex-end",marginTop:7,pointerEvents:"all"}}>
                  <CommentBtn comments={c.comments||[]} onChange={v=>updC(c.id,"comments",v)} user={user}/>
                  {!c.deleted&&!c.validated&&<>
                    <IconBtn onClick={()=>validateConn(c.id)} color={C.green} title="Valider">✓</IconBtn>
                    <IconBtn onClick={()=>onChange({connectors:connectors.filter(x=>x.id!==c.id)})} color={C.border} title="Supprimer">×</IconBtn>
                  </>}
                  {!c.deleted&&c.validated&&<>
                    <IconBtn onClick={()=>unlockConn(c.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                    <IconBtn onClick={()=>dupC(c.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                    <IconBtn onClick={()=>setDeleteConnTarget(c.id)} color={C.red} title="Annuler">×</IconBtn>
                  </>}
                  {c.deleted&&<IconBtn onClick={()=>setRestoreConnTarget(c.id)} color={C.yellow} title="Réactiver">↩</IconBtn>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {connectors.length>0&&(
        <div style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginBottom:16}}>
          <div style={{background:"#1c2128",padding:"8px 12px",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
            <div>
              <div style={{color:C.accent,fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:.8}}>Historique Matting/Dematting</div>
              <div style={{color:C.muted,fontSize:10}}>Une ligne par action enregistrée</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:C.muted,fontSize:10,textTransform:"uppercase",letterSpacing:.8}}>Connecteur</span>
              <select value={historyConnector} onChange={e=>setHistoryConnector(e.target.value)}
                style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,
                  color:C.text,padding:"4px 8px",fontSize:11,fontFamily:"monospace",outline:"none",minWidth:120}}>
                <option value="all">Tous</option>
                {visibleConnectors.map(c=><option key={c.id} value={c.id}>{c.nConect||"J?"}</option>)}
              </select>
            </div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:760,fontSize:12}}>
              <thead>
                <tr>
                  <TH w={100}>Connecteur</TH><TH w={115}>Statut</TH><TH w={55}>Cycle</TH>
                  <TH w={130}>Date / Heure</TH><TH w={65} color={C.accent}>Visa</TH>
                  <TH>Sous-ensemble</TH><TH w={55}>💬</TH><TH w={40}></TH>
                </tr>
              </thead>
              <tbody>
                {historyRows.map(({c,ev,cycle},i)=>{
                  const isMat=ev.action==="Matting";
                  return [
                    <tr key={ev.id} style={{background:ev.deleted?"#da363318":i%2===0?"transparent":"#ffffff06",
                      textDecoration:ev.deleted?"line-through":undefined,opacity:ev.deleted?.6:1,
                      borderLeft:`3px solid ${ev.deleted?C.red:isMat?C.green:C.blue}`}}>
                      <TD><span style={{fontFamily:"monospace",fontSize:13,fontWeight:900,color:C.text}}>{c.nConect||"J?"}</span></TD>
                      <TD><Badge label={isMat?"▲ Matting":"▼ Dematting"} color={isMat?C.green:C.blue}/></TD>
                      <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{cycle}</span></TD>
                      <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{ev.dt||"—"}</span></TD>
                      <TD><span style={{fontFamily:"monospace",fontWeight:800,fontSize:12,color:C.accent}}>{ev.visa||"—"}</span></TD>
                      <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{c.sousEnsemble||"—"}</span></TD>
                      <TD center style={{pointerEvents:"all"}}>
                        <CommentBtn comments={ev.comments||[]} onChange={v=>updEv(c.id,ev.id,"comments",v)} user={user}/>
                      </TD>
                      <TD center style={{pointerEvents:"all"}}>
                        {!ev.deleted
                          ? <IconBtn onClick={()=>setDeleteEvTarget({cid:c.id,eid:ev.id})} color={C.red} title="Annuler">×</IconBtn>
                          : <IconBtn onClick={()=>setRestoreEvTarget({cid:c.id,eid:ev.id})} color={C.yellow} title="Réactiver">↩</IconBtn>}
                      </TD>
                    </tr>,
                    ev.deleted&&(
                      <tr key={ev.id+"_ann"}>
                        <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",borderBottom:`1px solid #da363355`}}>
                          <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace"}}>
                            ✕ Annulé le <strong>{ev.deletedDate}</strong> par <strong>{ev.deletedVisa}</strong> — Motif : {ev.deletedReason}
                          </span>
                        </td>
                      </tr>
                    )
                  ];
                })}
              </tbody>
            </table>
            {historyRows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:14,fontSize:12}}>Aucune action enregistrée</div>}
          </div>
        </div>
      )}

      {deleteEvTarget  &&<DeleteModal onConfirm={confirmDelEv}   onCancel={()=>setDeleteEvTarget(null)}/>}
      {deleteConnTarget&&<DeleteModal onConfirm={confirmDelConn} onCancel={()=>setDeleteConnTarget(null)}/>}
      {restoreEvTarget  &&<RestoreModal onConfirm={restoreEv}   onCancel={()=>setRestoreEvTarget(null)}/>}
      {restoreConnTarget&&<RestoreModal onConfirm={restoreC} onCancel={()=>setRestoreConnTarget(null)}/>}
    </div>
  );
};
// ─── 9. Open Work ──────────────────────────────────────────────────────────
const TabOpenWork = ({data,onChange,user,header,forceShowDeleted=false}) => {
  const rows=data.rows||[];
  const add=()=>onChange({rows:[...rows,{id:uid(),sousEnsemble:header?.codeArticle||header?.description||"",createdVisa:user.trigram,createdDT:nowDT(),nOW:String(rows.length+1).padStart(3,"0"),description:"",openVisa:user.trigram,openDate:now(),closedVisa:"",closedDate:"",commentaires:""}]});
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
  const upd=(id,f,v)=>onChange({rows:rows.map(r=>r.id===id?{...r,[f]:v}:r)});
  const dup=id=>onChange({rows:[...rows,duplicateRow(rows.find(r=>r.id===id),user,{
    nOW:String(rows.length+1).padStart(3,"0"),openVisa:user.trigram,openDate:now(),closedVisa:"",closedDate:""
  })]});
  const del=id=>setDeleteTarget(id);
  const restore=reason=>{ onChange({rows:rows.map(r=>r.id===restoreTarget?{...r,deleted:false,restoredReason:reason,restoredVisa:user.trigram,restoredDate:nowDT()}:r)}); setRestoreTarget(null); };
  const confirmDel=reason=>{ onChange({rows:rows.map(r=>r.id===deleteTarget?{...r,deleted:true,deletedReason:reason,deletedVisa:user.trigram,deletedDate:nowDT()}:r)}); setDeleteTarget(null); };
  const deletedCount=rows.filter(r=>r.deleted).length;

  const REQUIRED = [
    {key:"description", label:"Description"},
    {key:"openVisa",    label:"Visa"},
  ];
  const validateRow=id=>{ const r=rows.find(x=>x.id===id); const miss=checkRequired(r,REQUIRED); if(miss.length) { upd(id,"validError","Champs requis : "+miss.join(", ")); } else { upd(id,"validError",""); upd(id,"validated",true); } };
  const unlockRow=id=>upd(id,"validated",false);
  const close=id=>onChange({rows:rows.map(r=>r.id===id?{...r,closedVisa:user.trigram,closedDate:now()}:r)});
  const reopen=id=>onChange({rows:rows.map(r=>r.id===id?{...r,closedVisa:"",closedDate:""}:r)});
  const isClosed=r=>!!r.closedDate;
  const open=rows.filter(r=>!r.deleted&&!isClosed(r)).length;
  const closed=rows.filter(r=>!r.deleted&&isClosed(r)).length;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <Badge label={`${open} OPEN`}                          color={C.yellow}/>
          <Badge label={`${closed} CLÔTURÉ${closed>1?"S":""}`}  color={C.green}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          {deletedCount>0&&<Btn onClick={()=>setShowDeleted(s=>!s)} color={showDeleted?"#da3633":C.border} small>
            {showDeleted?"▲ Masquer annulées":"▼ Voir annulées ("+deletedCount+")"}
          </Btn>}
          <Btn onClick={add} small>+ Open Work</Btn>
        </div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <TH w={130}>Date / Heure</TH><TH w={65} color={C.accent}>Visa</TH>
            <TH w={130}>Sous-ensemble</TH>
            <TH w={55}>N° OW</TH>
            <TH>Description</TH>
            <TH w={90}>Visa clôt.</TH>
            <TH w={120}>Date clôt.</TH>
            <TH>Commentaires</TH>
            <TH w={110}>Action</TH>
            <TH w={30}></TH>
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().flatMap((r,i)=>{
            if(r.deleted&&!showDeleted&&!forceShowDeleted) return [];
            return [
            <tr key={r.id} style={{background:r.deleted?"#da363318":isClosed(r)?"#23863612":i%2===0?"transparent":"#ffffff06",
              textDecoration:r.deleted?"line-through":undefined,opacity:r.deleted?.6:isClosed(r)?.8:1,
              pointerEvents:r.deleted?"none":undefined,
              borderLeft:r.validated?`3px solid ${C.green}`:r.validError?`3px solid ${C.red}`:`3px solid ${C.border}`}}>
              <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{r.createdDT||"—"}</span></TD>
              <TD><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.accent}}>{r.createdVisa||"—"}</span></TD>
              <TD><Input value={r.sousEnsemble||""} onChange={v=>upd(r.id,"sousEnsemble",v.toUpperCase())} small readOnly={!!r.validated} placeholder={header?.codeArticle||header?.description||"N° Article"} style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",...(r.validated?LOCKED_INPUT_STYLE:{})}} /></TD>
              <TD center><Badge label={r.nOW} color={isClosed(r)?C.green:C.yellow}/></TD>
              <TD><Input value={r.description} onChange={v=>upd(r.id,"description",v)} small readOnly={!!r.validated} style={r.validated?LOCKED_INPUT_STYLE:{}}/></TD>
              <TD>
                <Input value={r.closedVisa} onChange={v=>upd(r.id,"closedVisa",v)} small
                  style={{background:isClosed(r)?"#23863620":undefined}}/>
              </TD>
              <TD>
                {/* Champ date clôture — auto-rempli par le bouton, modifiable manuellement */}
                <Input value={r.closedDate} onChange={v=>upd(r.id,"closedDate",v)} small
                  placeholder="—"
                  style={{background:isClosed(r)?"#23863620":undefined,color:isClosed(r)?C.green:undefined,fontWeight:isClosed(r)?700:400}}/>
              </TD>
              <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user}/></TD>
              <TD center>
                <ActionGroup>
                  {!isClosed(r)
                    ?<IconBtn onClick={()=>close(r.id)} color={C.green} title="Clôturer">✓</IconBtn>
                    :<IconBtn onClick={()=>reopen(r.id)} color={C.yellow} title="Réouvrir">↩</IconBtn>}
                  <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                </ActionGroup>
              </TD>
              <TD center style={{pointerEvents:"all",minWidth:110}}>
                {!r.deleted&&!r.validated&&(
                  <ActionGroup>
                    <IconBtn onClick={()=>validateRow(r.id)} color={C.green} title="Valider">✓</IconBtn>
                    <IconBtn onClick={()=>onChange({rows:rows.filter(x=>x.id!==r.id)})} color={C.border} title="Supprimer">×</IconBtn>
                  </ActionGroup>
                )}
                {!r.deleted&&r.validated&&(
                  <ActionGroup>
                    <IconBtn onClick={()=>unlockRow(r.id)} color={C.yellow} title="Modifier">✎</IconBtn>
                    <IconBtn onClick={()=>setDeleteTarget(r.id)} color={C.red} title="Annuler">×</IconBtn>
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
              r.deleted&&(
                <tr key={r.id+"_ann"}>
                  <td colSpan={99} style={{padding:"3px 10px 6px",background:"#da363325",
                    borderBottom:`2px solid #da363355`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#da3633",fontSize:10,fontFamily:"monospace",letterSpacing:.3}}>
                        ✕ Annulé le <strong>{r.deletedDate}</strong> par <strong>{r.deletedVisa}</strong>
                        &nbsp;—&nbsp;Motif : {r.deletedReason}
                      </span>
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
      {deleteTarget&&<DeleteModal onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────
const hash=str=>{let h=0;for(let i=0;i<str.length;i++){h=Math.imul(31,h)+str.charCodeAt(i)|0;}return h.toString(36);};

const ADMIN_TRIGRAM = "ADMIN";
const DEFAULT_ADMIN_PASSWORD = "admin";
const USER_INDEX_KEY = "users-list";

const getUserIndex = async () => {
  try {
    const r = await window.storage.get(USER_INDEX_KEY, true);
    return r ? JSON.parse(r.value) : [];
  } catch {
    return [];
  }
};

const setUserIndex = async list => {
  const clean = [...new Set((list||[]).map(t=>String(t).toUpperCase()).filter(Boolean))].sort();
  await window.storage.set(USER_INDEX_KEY, JSON.stringify(clean), true);
  return clean;
};

const ensureDefaultAdmin = async () => {
  const key = `user:${ADMIN_TRIGRAM}`;
  try {
    await window.storage.get(key, true);
  } catch {
    await window.storage.set(key, JSON.stringify({
      trigram: ADMIN_TRIGRAM,
      pwd: hash(DEFAULT_ADMIN_PASSWORD),
      role: "Admin",
      service: "Administration",
      prenom: "Compte",
      nom: "Admin",
    }), true);
  }
  const users = await getUserIndex();
  if(!users.includes(ADMIN_TRIGRAM)) await setUserIndex([...users, ADMIN_TRIGRAM]);
};

// ─── Profil utilisateur ────────────────────────────────────────────────────
const ProfileModal = ({user, onClose, onSave}) => {
  const [profile, setProfile] = React.useState({...user});
  const [pwdSection, setPwdSection] = React.useState(false);
  const [oldPwd, setOldPwd] = React.useState("");
  const [newPwd, setNewPwd] = React.useState("");
  const [newPwd2, setNewPwd2] = React.useState("");
  const [err, setErr] = React.useState("");
  const [ok, setOk]   = React.useState("");

  const ROLES = ["Opérateur","Contrôleur","Ingénieur","Chef d'équipe","Admin"];
  const SERVICES = ["Production","Qualité","Ingénierie","Méthodes","Support"];

  const saveProfile = () => {
    onSave({...profile});
    setOk("✓ Profil mis à jour"); setErr("");
  };

  const changePwd = async () => {
    setErr(""); setOk("");
    if(!oldPwd||!newPwd){setErr("Tous les champs sont requis");return;}
    if(newPwd!==newPwd2){setErr("Les mots de passe ne correspondent pas");return;}
    if(newPwd.length<4){setErr("Mot de passe trop court (min 4 caractères)");return;}
    const key=`user:${user.trigram}`;
    try{
      const r=await window.storage.get(key,true);
      if(!r){setErr("Compte introuvable");return;}
      const u=JSON.parse(r.value);
      if(u.pwd!==hash(oldPwd)){setErr("Mot de passe actuel incorrect");return;}
      await window.storage.set(key,JSON.stringify({...u,...profile,pwd:hash(newPwd)}),true);
      setOk("✓ Mot de passe modifié");setOldPwd("");setNewPwd("");setNewPwd2("");setPwdSection(false);
    }catch{setErr("Erreur lors du changement");}
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"#161b22",border:`1px solid ${C.accent}`,borderRadius:10,width:"100%",maxWidth:480,overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:C.accent+"33",border:`1px solid ${C.accent}`,borderRadius:"50%",width:36,height:36,
              display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontWeight:900,color:C.accent,fontSize:14}}>
              {user.trigram}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:C.text}}>Mon profil</div>
              <div style={{fontSize:10,color:C.muted}}>{user.nom&&user.prenom?`${user.prenom} ${user.nom}`:user.trigram}</div>
            </div>
          </div>
          <span onClick={onClose} style={{cursor:"pointer",color:C.muted,fontSize:20}}>×</span>
        </div>

        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
          {/* Infos perso */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["Prénom","prenom",""],["Nom","nom",""],].map(([label,key,ph])=>(
              <div key={key}>
                <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{label}</div>
                <Input value={profile[key]||""} onChange={v=>setProfile(p=>({...p,[key]:v}))} placeholder={ph||label} small/>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Service</div>
              <select value={profile.service||""} onChange={e=>setProfile(p=>({...p,service:e.target.value}))}
                style={{width:"100%",background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"5px 8px",fontSize:12,fontFamily:"monospace",outline:"none"}}>
                <option value="">— choisir —</option>
                {SERVICES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Rôle</div>
              <select value={profile.role||""} onChange={e=>setProfile(p=>({...p,role:e.target.value}))}
                style={{width:"100%",background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"5px 8px",fontSize:12,fontFamily:"monospace",outline:"none"}}>
                <option value="">— choisir —</option>
                {ROLES.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {ok&&<div style={{background:"#23863620",border:"1px solid #238636",borderRadius:4,padding:"6px 12px",color:C.green,fontSize:12}}>{ok}</div>}
          {err&&<div style={{background:"#da363320",border:"1px solid #da3633",borderRadius:4,padding:"6px 12px",color:C.red,fontSize:12}}>{err}</div>}

          <Btn onClick={saveProfile} color={C.green} small>✓ Enregistrer le profil</Btn>

          {/* Changer mot de passe */}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
            <div onClick={()=>setPwdSection(v=>!v)}
              style={{cursor:"pointer",color:C.muted,fontSize:11,display:"flex",alignItems:"center",gap:6,userSelect:"none"}}>
              {pwdSection?"▼":"▶"} Changer le mot de passe
            </div>
            {pwdSection&&(
              <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
                {[["Mot de passe actuel",oldPwd,setOldPwd],["Nouveau mot de passe",newPwd,setNewPwd],["Confirmer le nouveau",newPwd2,setNewPwd2]]
                  .map(([label,val,set])=>(
                  <div key={label}>
                    <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{label}</div>
                    <input type="password" value={val} onChange={e=>set(e.target.value)}
                      style={{width:"100%",background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"5px 8px",fontSize:12,fontFamily:"monospace",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                ))}
                <Btn onClick={changePwd} color={C.blue} small>🔑 Changer le mot de passe</Btn>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUsersModal = ({onClose}) => {
  const blank = {trigram:"", prenom:"", nom:"", service:"Production", role:"Opérateur", pwd:""};
  const [users,setUsers] = React.useState([]);
  const [form,setForm] = React.useState(blank);
  const [err,setErr] = React.useState("");
  const [ok,setOk] = React.useState("");

  const load = React.useCallback(async()=>{
    await ensureDefaultAdmin();
    const index = await getUserIndex();
    const rows = [];
    for(const trigram of index){
      try{
        const r = await window.storage.get(`user:${trigram}`, true);
        if(r) rows.push(JSON.parse(r.value));
      }catch{}
    }
    setUsers(rows.sort((a,b)=>(a.trigram||"").localeCompare(b.trigram||"")));
  },[]);

  React.useEffect(()=>{ load(); },[load]);

  const resetMessages = () => { setErr(""); setOk(""); };

  const saveUser = async () => {
    resetMessages();
    const trigram = form.trigram.trim().toUpperCase();
    if(!trigram){setErr("Trigramme requis");return;}
    if(trigram.length<2||trigram.length>8){setErr("Trigramme : 2 à 8 caractères");return;}
    if(!form.pwd || form.pwd.length<4){setErr("Mot de passe requis, min. 4 caractères");return;}
    try{
      const existing = users.find(u=>u.trigram===trigram) || {};
      const next = {...existing, ...form, trigram, pwd:hash(form.pwd)};
      await window.storage.set(`user:${trigram}`, JSON.stringify(next), true);
      await setUserIndex([...await getUserIndex(), trigram]);
      setForm(blank);
      setOk(`Utilisateur ${trigram} enregistré`);
      await load();
    }catch{setErr("Erreur lors de l'enregistrement");}
  };

  const editUser = u => {
    resetMessages();
    setForm({...u, pwd:""});
  };

  const deleteUser = async trigram => {
    resetMessages();
    if(trigram===ADMIN_TRIGRAM){setErr("Le compte ADMIN ne peut pas être supprimé");return;}
    if(!window.confirm(`Supprimer l'utilisateur ${trigram} ?`)) return;
    try{
      await window.storage.delete(`user:${trigram}`, true);
      await setUserIndex((await getUserIndex()).filter(t=>t!==trigram));
      setOk(`Utilisateur ${trigram} supprimé`);
      await load();
    }catch{setErr("Erreur lors de la suppression");}
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:8,width:"100%",maxWidth:900,maxHeight:"86vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontWeight:800,color:C.accent,fontSize:14}}>Administration utilisateurs</div>
            <div style={{fontSize:11,color:C.muted}}>Compte initial : ADMIN / admin</div>
          </div>
          <span onClick={onClose} style={{cursor:"pointer",color:C.muted,fontSize:22}}>×</span>
        </div>
        <div style={{padding:16,display:"grid",gridTemplateColumns:"300px 1fr",gap:16,overflow:"auto"}}>
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:12}}>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Créer / modifier</div>
            {[
              ["Trigramme","trigram","ADMIN"],
              ["Prénom","prenom","Julien"],
              ["Nom","nom","Grosjean"],
              ["Service","service","Production"],
              ["Rôle","role","Opérateur"],
            ].map(([label,key,ph])=>(
              <div key={key} style={{marginBottom:9}}>
                <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{label}</div>
                <Input value={form[key]||""} onChange={v=>setForm(f=>({...f,[key]:key==="trigram"?v.toUpperCase():v}))} placeholder={ph} small readOnly={key==="trigram"&&form.trigram===ADMIN_TRIGRAM}/>
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Mot de passe</div>
              <Input value={form.pwd||""} onChange={v=>setForm(f=>({...f,pwd:v}))} type="password" placeholder="Min. 4 caractères" small/>
            </div>
            {err&&<ErrBox msg={err}/>}
            {ok&&<div style={{background:C.green+"22",border:`1px solid ${C.green}`,color:C.green,borderRadius:6,padding:"8px 12px",fontSize:12,marginBottom:14}}>{ok}</div>}
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={saveUser} color={C.green} small>{form.trigram&&users.some(u=>u.trigram===form.trigram)?"Mettre à jour":"Créer"}</Btn>
              <Btn onClick={()=>{setForm(blank);resetMessages();}} color={C.border} small>Réinitialiser</Btn>
            </div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr><TH>Trigramme</TH><TH>Nom</TH><TH>Service</TH><TH>Rôle</TH><TH w={180}>Actions</TH></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.trigram}>
                    <TD><span style={{fontFamily:"monospace",fontWeight:800,color:u.trigram===ADMIN_TRIGRAM?C.accent:C.text}}>{u.trigram}</span></TD>
                    <TD>{[u.prenom,u.nom].filter(Boolean).join(" ")||"—"}</TD>
                    <TD>{u.service||"—"}</TD>
                    <TD>{u.role||"—"}</TD>
                    <TD>
                      <div style={{display:"flex",gap:8}}>
                        <Btn onClick={()=>editUser(u)} color={C.blue} small>Modifier / MDP</Btn>
                        <Btn onClick={()=>deleteUser(u.trigram)} color={C.red} small disabled={u.trigram===ADMIN_TRIGRAM}>Supprimer</Btn>
                      </div>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({onLogin}) => {
  const [tri,setTri]   = useState("");
  const [pwd,setPwd]   = useState("");
  const [err,setErr]   = useState("");

  const reset=()=>{setErr("");};

  const doLogin=async()=>{
    if(!tri||!pwd){setErr("Trigramme et mot de passe requis");return;}
    const key=`user:${tri.toUpperCase()}`;
    try{
      const r=await window.storage.get(key,true);
      if(!r){setErr("Trigramme inconnu — demandez la création du compte à un admin");return;}
      const u=JSON.parse(r.value);
      if(u.pwd!==hash(pwd)){setErr("Mot de passe incorrect");return;}
      onLogin({trigram:tri.toUpperCase()});
    }catch{setErr("Erreur de connexion");}
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:10,letterSpacing:5,color:C.muted,marginBottom:8,textTransform:"uppercase"}}>Safran Space Technologies</div>
          <div style={{fontSize:30,fontWeight:900,color:C.text,fontFamily:"monospace"}}>SP-F001A7</div>
          <div style={{width:50,height:3,background:C.accent,borderRadius:2,margin:"14px auto 0"}}/>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
          <div style={{background:C.blue+"18",border:`1px solid ${C.blue}`,color:C.blue,borderRadius:6,padding:"8px 12px",fontSize:12,marginBottom:18}}>
            Premier accès : <b>ADMIN</b> / <b>admin</b>. Les autres comptes se créent depuis le menu admin.
          </div>

          {/* Trigramme — commun à tous les modes */}
          <div style={{marginBottom:14}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Trigramme</div>
            <Input value={tri} onChange={v=>setTri(v.toUpperCase())} placeholder="ex: JGR"
              style={{textTransform:"uppercase",letterSpacing:3,fontWeight:700,fontSize:16,textAlign:"center"}}/>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{color:C.muted,fontSize:10,marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Mot de passe</div>
            <Input value={pwd} onChange={setPwd} type="password" placeholder="••••••"/>
          </div>
          {err&&<ErrBox msg={err}/>}
          <Btn onClick={doLogin} color={C.accent} full>Se connecter</Btn>
        </div>
      </div>
    </div>
  );
};

const ErrBox = ({msg}) => (
  <div style={{background:C.red+"22",border:`1px solid ${C.red}`,color:C.red,borderRadius:6,
    padding:"8px 12px",fontSize:12,marginBottom:14}}>{msg}</div>
);

// ─── ACCUEIL : vue tableur + favs par user ──────────────────────────────────
const PAGE_SIZE=10;
const SORT_OPTS=[
  {id:"fav",  label:"⭐ Favoris d'abord"},
  {id:"opens",label:"Derniers ouverts"},
  {id:"of",   label:"N° OF"},
  {id:"projet",label:"Projet"},
];

const STATUTS = {
  en_cours: {label:"En cours",  color:"#1f6feb"},
  bloque:   {label:"Bloqué",    color:"#d29922"},
  cloture:  {label:"Clôturé",   color:"#238636"},
};
const OFSelector = ({ofList,onSelect,onCreate,user,onLogout,openHistory,onUpdateStatus,onSaveProfile,onManageUsers}) => {
  const [search,setSearch]          = useState("");
  const [page,setPage]               = useState(0);
  const [sort,setSort]               = useState("fav");
  const [filterStatus,setFilterStatus] = useState("all");
  const [filterCreator,setFilterCreator] = useState("all");
  const [hideCloture,setHideCloture]   = useState(true);
  const [showNew,setShowNew] = useState(false);
  const [showProfile,setShowProfile] = useState(false);
  const [favs,setFavs]       = useState([]);
  const [form,setForm]       = useState({of:"",sn:"",lot:"",snProduitFini:"",codeArticle:"",ancienArticle:"",description:"",otp:"",ofRework:""});

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
    if(sort==="projet") return (a.projet||"").localeCompare(b.projet||"");
    return 0;
  });

  const creators=[...new Set(ofList.map(o=>o.createdBy||"?"))].sort();
  const filtered=sorted.filter(o=>{
    const q=search.toLowerCase();
    if(hideCloture&&(o.status||"en_cours")==="cloture") return false;
    if(filterStatus!=="all"&&(o.status||"en_cours")!==filterStatus) return false;
    if(filterCreator!=="all"&&(o.createdBy||"?")!==filterCreator) return false;
    return !q||[o.of,o.sn,o.lot,o.snProduitFini,o.description,o.otp,o.ofRework,o.codeArticle,o.ancienArticle].some(v=>v?.toLowerCase().includes(q));
  });
  const totalPages=Math.ceil(filtered.length/PAGE_SIZE);
  const paged=filtered.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);

  const create=async()=>{
    if(!form.of)return;
    onCreate({...form,createdBy:user.trigram,createdAt:now()});
    setForm({of:"",sn:"",lot:"",snProduitFini:"",codeArticle:"",ancienArticle:"",description:"",otp:"",ofRework:""});
    setShowNew(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,padding:20}}>
      {/* Top bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:10,letterSpacing:4,color:C.muted,textTransform:"uppercase"}}>Safran Space Technologies</div>
          <div style={{fontSize:20,fontWeight:900,color:C.text,fontFamily:"monospace"}}>SP-F001A7</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {user.role==="Admin"&&<Btn onClick={onManageUsers} color={C.blue} small>Utilisateurs</Btn>}
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
          <Input value={search} onChange={v=>{setSearch(v);setPage(0);}} placeholder="🔍  OF, SN, LOT, SN Produit Fini, projet…"/>
        </div>
        {/* Tri */}
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"6px 10px",fontSize:12,fontFamily:"monospace",outline:"none"}}>
          {SORT_OPTS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {/* Filtre statut */}
        <select value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(0);}}
          style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"6px 10px",fontSize:12,fontFamily:"monospace",outline:"none"}}>
          <option value="all">Tous statuts</option>
          {Object.entries(STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        {/* Filtre créateur */}
        <select value={filterCreator} onChange={e=>{setFilterCreator(e.target.value);setPage(0);}}
          style={{background:"#0d1117",border:`1px solid ${C.border}`,borderRadius:4,color:C.text,padding:"6px 10px",fontSize:12,fontFamily:"monospace",outline:"none"}}>
          <option value="all">Tous créateurs</option>
          {creators.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        {/* Masquer clôturés */}
        <button onClick={()=>setHideCloture(v=>!v)}
          style={{background:hideCloture?"#23863622":"transparent",border:`1px solid ${hideCloture?"#238636":C.border}`,
            borderRadius:4,color:hideCloture?"#238636":C.muted,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"monospace",whiteSpace:"nowrap"}}>
          {hideCloture?"✓ Clôturés masqués":"Afficher clôturés"}
        </button>
        <Btn onClick={()=>setShowNew(v=>!v)} color={showNew?C.border:C.accent}>
          {showNew?"✕ Annuler":"+ Nouveau dossier"}
        </Btn>
      </div>

      {/* Formulaire nouveau */}
      {showNew&&(
        <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:8,padding:16,marginBottom:14}}>
          <div style={{color:C.muted,fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Nouveau dossier</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
            {[
              ["OF *","of","454545","N° de l'ordre de fabrication"],
              ["SN Composant","sn","#00042","Numéro de série du composant"],
              ["LOT","lot","SP-J12345","Numéro de lot"],
              ["N° Article","codeArticle","R4B-S001A","Référence SAP"],
              ["Ancien N° Article","ancienArticle","123-456-001","Ancienne référence"],
              ["SN Produit Fini","snProduitFini","#PF-001","SN assemblage final"],
              ["N° OTP","otp","OTP-2024-001","Numéro OTP"],
              ["OF Rework","ofRework","RWK-454545","OF de rework associé"],
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
          <Btn onClick={create} color={form.of?C.green:C.border} disabled={!form.of.trim()}>✓ Créer le dossier</Btn>
        </div>
      )}

      {/* TABLE des dossiers */}
      {filtered.length===0?(
        <div style={{textAlign:"center",color:C.muted,padding:40,fontSize:14}}>
          {search?"Aucun résultat":"Aucun dossier — créez le premier"}
        </div>
      ):(
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr>
                <TH w={30}>⭐</TH>
                <TH w={90}>OF</TH>
                <TH w={90}>SN Compo.</TH>
                <TH w={110}>LOT</TH>
                <TH w={100}>SN Prod. Fini</TH>
                <TH>Description</TH>
                <TH w={80}>Projet</TH>
                <TH w={105}>Statut</TH>
                <TH w={150}>Prochain étuvage</TH>
                <TH w={70}>Créé par</TH>
                <TH w={90}>Créé le</TH>
                <TH w={50}></TH>
              </tr>
            </thead>
            <tbody>
              {paged.map((o,i)=>{
                const isFav=favs.includes(o.id);
                const isRecent=openHistory[0]===o.id;
                return (
                  <tr key={o.id}
                    onClick={()=>onSelect(o.id)}
                    style={{background:isFav?"#e05c0008":i%2===0?"transparent":"#ffffff05",cursor:"pointer",transition:"background .1s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#e05c0015"}
                    onMouseLeave={e=>e.currentTarget.style.background=isFav?"#e05c0008":i%2===0?"transparent":"#ffffff05"}>
                    <TD center>
                      <span onClick={e=>{e.stopPropagation();toggleFav(o.id);}}
                        style={{cursor:"pointer",fontSize:14,opacity:isFav?1:.3,transition:"opacity .15s"}}
                        title={isFav?"Retirer des favoris":"Ajouter aux favoris"}>
                        ⭐
                      </span>
                    </TD>
                    <TD>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontWeight:700,fontFamily:"monospace",color:C.text}}>{o.of}</span>
                        {isRecent&&<Badge label="récent" color={C.purple}/>}
                      </div>
                    </TD>
                    <TD><span style={{fontFamily:"monospace",color:C.muted}}>{o.sn||"—"}</span></TD>
                    <TD><span style={{fontFamily:"monospace",color:C.muted}}>{o.lot||"—"}</span></TD>
                    <TD><span style={{fontFamily:"monospace",color:o.snProduitFini?C.text:C.muted}}>{o.snProduitFini||"—"}</span></TD>
                    <TD><span style={{color:C.text}}>{o.description||"—"}</span></TD>
                    <TD><span style={{fontFamily:"monospace",fontSize:11,color:C.muted}}>{o.otp||o.projet||"—"}</span></TD>
                    <TD center>
                      <select value={o.status||"en_cours"}
                        onClick={e=>e.stopPropagation()}
                        onChange={e=>{e.stopPropagation();onUpdateStatus(o.id,e.target.value);}}
                        style={{background:STATUTS[o.status||"en_cours"]?.color+"22",
                          border:`1px solid ${STATUTS[o.status||"en_cours"]?.color}`,
                          borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,
                          color:STATUTS[o.status||"en_cours"]?.color,outline:"none",cursor:"pointer"}}>
                        {Object.entries(STATUTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </TD>
                    <TD center onClick={e=>e.stopPropagation()}>{(()=>{
                      try{
                        if(!o.lastEtuvageDT) return <span style={{color:C.muted,fontSize:10}}>—</span>;
                        const nei=nextEtuvageInfo([{entreeDT:o.lastEtuvageDT,deleted:false}]);
                        return <span style={{fontFamily:"monospace",fontSize:10,color:nei.overdue?C.red:C.blue,fontWeight:nei.overdue?700:400}}>
                          {nei.overdue?"🔴 ":"🕐 "}{nei.label}
                        </span>;
                      }catch(e){return <span style={{color:C.muted,fontSize:10}}>—</span>;}
                    })()}</TD>
                    <TD center><Badge label={o.createdBy||"—"} color={C.accent}/></TD>
                    <TD><span style={{color:C.muted,fontSize:11}}>{o.createdAt||"—"}</span></TD>
                    <TD center>
                      <button onClick={e=>{e.stopPropagation();onSelect(o.id);}}
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
      )}

      {/* Pagination */}
      {totalPages>1&&(
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginTop:14}}>
          <Btn onClick={()=>setPage(p=>Math.max(0,p-1))}             disabled={page===0}              small color={C.border}>‹ Préc.</Btn>
          <span style={{color:C.muted,fontSize:12,fontFamily:"monospace"}}>{page+1} / {totalPages}</span>
          <Btn onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))}  disabled={page===totalPages-1}   small color={C.border}>Suiv. ›</Btn>
        </div>
      )}
      {showProfile&&<ProfileModal user={user} onClose={()=>setShowProfile(false)} onSave={v=>{onSaveProfile&&onSaveProfile(v);setShowProfile(false);}}/> }
    </div>
  );
};

// ─── APP ───────────────────────────────────────────────────────────────────
const TABS=[
  {id:"rework",        label:"Adjust/Rework",  short:"RWK"},
  {id:"consommables",  label:"Consommables",   short:"CSO"},
  {id:"testequip",     label:"Test Equip.",    short:"TST"},
  {id:"faits",         label:"Faits",          short:"FAITS"},
  {id:"etuvage",       label:"Étuvages",       short:"ETV"},
  {id:"demating",      label:"Matting",         short:"MTG"},
  {id:"openwork",      label:"Open Work",      short:"OW"},
];

function App(){
  const [user,setUser]               = useState(null);
  const [ofList,setOfList]           = useState([]);
  const [currentId,setCurrentId]     = useState(null);
  const [consommables,setConsommables]     = useState(DEFAULT_CONSOMMABLES);
  const [showConsoEditor,setShowConsoEditor] = useState(false);
  const [faitTypes,setFaitTypes]           = useState(DEFAULT_FAIT_TYPES);
  const [showFaitTypes,setShowFaitTypes]   = useState(false);
  const [ofData,setOfData]           = useState(null);
  const [activeTab,setActiveTab]     = useState("rework");
  const [saving,setSaving]           = useState(false);
  const [lastSaved,setLastSaved]     = useState(null);
  const [loaded,setLoaded]           = useState(false);
  const [openHistory,setOpenHistory] = useState([]); // IDs des OF récemment ouverts
  const [showAdminUsers,setShowAdminUsers] = useState(false);
  const [printAll,setPrintAll]       = useState(false);

  useEffect(()=>{
    (async()=>{
      try{await ensureDefaultAdmin();}catch{}
      try{const s=await window.storage.get("session",false);if(s)setUser(JSON.parse(s.value));}catch{}
      try{const r=await window.storage.get("consommables-list",true);if(r)setConsommables(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("fait-types",true);if(r)setFaitTypes(JSON.parse(r.value));}catch{}
      try{const r=await window.storage.get("of-list",true);if(r)setOfList(JSON.parse(r.value));}catch{}
      setLoaded(true);
    })();
  },[]);

  const handleLogin=async u=>{
    // Load full profile if exists
    try{
      const r=await window.storage.get(`user:${u.trigram}`,true);
      if(r){ const stored=JSON.parse(r.value); u={...u,...stored,pwd:undefined}; }
    }catch{}
    setUser(u);
    try{await window.storage.set("session",JSON.stringify(u),false);}catch{}
  };
  const handleSaveProfile=async profile=>{
    setUser(prev=>({...prev,...profile}));
    try{
      const key=`user:${profile.trigram||profile.trigram}`;
      const r=await window.storage.get(key,true);
      const stored=r?JSON.parse(r.value):{trigram:user.trigram,pwd:""};
      await window.storage.set(key,JSON.stringify({...stored,...profile}),true);
      await window.storage.set("session",JSON.stringify({...user,...profile}),false);
    }catch{}
  };
  const [showProfile,setShowProfile] = useState(false);
  const handleLogout=async()=>{
    setUser(null);setCurrentId(null);setOfData(null);
    try{await window.storage.delete("session",false);}catch{}
  };

  const selectOf=async id=>{
    try{
      const r=await window.storage.get(`of:${id}`,true);
      if(r){
        const parsed=JSON.parse(r.value);
        // Ensure all required keys exist
        const safe={header:{},rework:{},consommables:{},testequip:{},faits:{},etuvage:{},demating:{},openwork:{},...parsed};
        setOfData(safe);setCurrentId(id);setActiveTab("rework");
        setOpenHistory(prev=>[id,...prev.filter(x=>x!==id)].slice(0,20));
      }
    }catch(e){console.error("selectOf error",e);}
  };

  const createOf=async header=>{
    const id=uid();
    const entry={id,...header,status:"en_cours",lastEtuvageDT:null};
    const newList=[...ofList,entry];
    const newData={header:entry,rework:{},flux:{},colles:{},testequip:{},dm:{},ncr:{},etuvage:{},demating:{},openwork:{}};
    try{
      await window.storage.set("of-list",JSON.stringify(newList),true);
      await window.storage.set(`of:${id}`,JSON.stringify(newData),true);
      setOfList(newList);setOfData(newData);setCurrentId(id);setActiveTab("rework");
      setOpenHistory(prev=>[id,...prev].slice(0,20));
    }catch(e){console.error(e);}
  };

  const save=useCallback(async data=>{
    if(!currentId)return;
    setSaving(true);
    try{
      await window.storage.set(`of:${currentId}`,JSON.stringify(data),true);
      setLastSaved(new Date().toLocaleTimeString("fr-FR"));
      // Update ofList summary for home screen
      const etvRows=(data.etuvage?.rows||[]).filter(r=>!r.deleted&&r.entreeDT);
      const lastEtv=etvRows.length>0?etvRows.reduce((a,b)=>{
        const pa=a.entreeDT,pb=b.entreeDT;
        return pb>pa?b:a;
      }).entreeDT:null;
      setOfList(prev=>{
        const updated=prev.map(o=>o.id===currentId?{...o,lastEtuvageDT:lastEtv,status:o.status||"en_cours"}:o);
        window.storage.set("of-list",JSON.stringify(updated),true).catch(()=>{});
        return updated;
      });
    }catch{}
    setSaving(false);
  },[currentId]);

  const saveConsommables=async list=>{
    try{await window.storage.set("consommables-list",JSON.stringify(list),true);}catch{}
    setConsommables(list);
    setShowConsoEditor(false);
  };

  const saveFaitTypes=async list=>{
    try{await window.storage.set("fait-types",JSON.stringify(list),true);}catch{}
    setFaitTypes(list);
    setShowFaitTypes(false);
  };

  const updateTab=(tab,tabData)=>{
    const updated={...ofData,[tab]:tabData};
    setOfData(updated);save(updated);
  };

  const updateHeader=(fields)=>{
    const newHeader={...ofData.header,...fields};
    const newSE = fields.codeArticle||fields.description
      ? (fields.codeArticle||fields.description||"")
      : null;

    // Cascade sousEnsemble to all rows that still had the OLD default value
    const oldDefault = ofData.header?.codeArticle||ofData.header?.description||"";
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

  const printReport=()=>{
    setPrintAll(true);
    setTimeout(()=>window.print(),150);
  };

  if(!loaded) return <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement…</div>;
  if(!user)   return <LoginScreen onLogin={handleLogin}/>;
  if(!currentId||!ofData) return (
    <>
      <OFSelector ofList={ofList} onSelect={selectOf} onCreate={createOf}
        user={user} onLogout={handleLogout} openHistory={openHistory}
        onSaveProfile={handleSaveProfile}
        onManageUsers={()=>setShowAdminUsers(true)}
        onUpdateStatus={(id,status)=>{
          setOfList(prev=>{
            const updated=prev.map(o=>o.id===id?{...o,status}:o);
            window.storage.set("of-list",JSON.stringify(updated),true).catch(()=>{});
            return updated;
          });
        }}/>
      {showAdminUsers&&<AdminUsersModal onClose={()=>setShowAdminUsers(false)}/>}
    </>
  );

  const h    = ofData.header;
  const faits = ofData.faits?.rows?.length||0;
  const faitsOpen = ofData.faits?.rows?.filter(r=>!r.closedDate).length||0;
  const ows  = ofData.openwork?.rows?.filter(r=>!r.closedDate)?.length||0;
  // Alerte calibration
  const horsCalib = (ofData.testequip?.rows||[]).filter(r=>calibStatus(r.dateExpiration)?.color===C.red).length;
  // Prochain étuvage
  let nei = {label:"—",overdue:false};
  try{ nei = nextEtuvageInfo(ofData.etuvage?.rows); }catch{}
  const reportSous = h.codeArticle||h.description||"—";
  const ReportHead = ({tab}) => printAll ? (
    <div style={{border:`1px solid ${C.border}`,background:"#0d1117",borderRadius:6,
      padding:"8px 12px",margin:"0 0 12px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>OF</div><div style={{fontFamily:"monospace",fontWeight:800}}>{h.of||"—"}</div></div>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Sous-ensemble</div><div style={{fontFamily:"monospace",fontWeight:800}}>{reportSous}</div></div>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>SN / LOT</div><div style={{fontFamily:"monospace",fontWeight:800}}>{h.sn||"—"} / {h.lot||"—"}</div></div>
      <div><div style={{color:C.muted,fontSize:9,textTransform:"uppercase",letterSpacing:.8}}>Onglet</div><div style={{fontFamily:"monospace",fontWeight:800,color:C.accent}}>{tab}</div></div>
    </div>
  ) : null;

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"system-ui,sans-serif"}}>
      {/* Top bar */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 20px",
        display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setCurrentId(null)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>←</button>
          <div>
            <div style={{fontSize:11,color:C.muted}}>SP-F001A7</div>
            <div style={{fontWeight:700,fontFamily:"monospace",fontSize:13}}>OF {h.of} · {h.sn} / {h.lot}</div>
          </div>
          <Badge label={h.projet||"—"} color={C.blue}/>
          {faitsOpen>0  &&<Badge label={`${faitsOpen} fait${faitsOpen>1?"s":""} ouvert${faitsOpen>1?"s":""}`} color={C.yellow}/>}
          {ows>0       &&<Badge label={`${ows} OW`}   color={C.yellow}/>}
          {horsCalib>0 &&<Badge label={`⚠ ${horsCalib} hors calib.`} color={C.red}/>}
          {nei.overdue
            ?<Badge label={`🔴 Étuvage EN RETARD`} color={C.red}/>
            :<Badge label={`🕐 Étuvage ${nei.label}`} color={C.blue}/>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:11,color:C.muted}}>{saving?"⟳ …":lastSaved?`✓ ${lastSaved}`:""}</span>
          <Btn onClick={printReport} color={C.blue} small>Imprimer / PDF</Btn>
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

      {showProfile&&<ProfileModal user={user} onClose={()=>setShowProfile(false)} onSave={handleSaveProfile}/>}
      {/* Tabs */}
      <div className="sticky-tabs" style={{background:C.surface,borderBottom:`1px solid ${C.border}`,
        display:"flex",overflowX:"auto",padding:"0 12px",position:"sticky",top:51,zIndex:95}}>
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
              <span style={{fontFamily:"monospace",fontSize:10,color:active?C.accent:C.muted}}>[{t.short}]</span>
              {t.label}
              {dot&&<span style={{width:6,height:6,borderRadius:"50%",background:dotColor}}/>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{padding:20}}>
        <div className="sticky-of-header" style={{position:"sticky",top:94,zIndex:90,background:C.bg,paddingTop:4,paddingBottom:2}}>
          <Header of={h} onUpdate={updateHeader} user={user} onCommentsChange={v=>{const u={...ofData,header:{...ofData.header,comments:v}};setOfData(u);save(u);}} onUpdateStatus={status=>{
            const updated={...ofData,header:{...ofData.header,status}};
            const newList=ofList.map(o=>o.id===currentId?{...o,status}:o);
            setOfList(newList);
            try{window.storage.set("of-list",JSON.stringify(newList),true);}catch{}
            setOfData(updated);save(updated);
          }}/>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:16}}>
          {printAll&&<div style={{fontWeight:900,fontSize:18,color:C.text,marginBottom:18,fontFamily:"monospace"}}>Rapport complet OF {h.of}</div>}
          {(printAll||activeTab==="rework")&&<>
            <ReportHead tab="Adjust/Rework"/>
            <SectionTitle>Adjust/Rework</SectionTitle>
            <TabRework data={ofData.rework} onChange={d=>updateTab("rework",d)} user={user} header={ofData.header} forceShowDeleted={printAll}/>
          </>}
          {(!printAll&&activeTab==="consommables"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Consommables"/>
            <SectionTitle>Consommables</SectionTitle>
            <TabConsommables data={ofData.consommables||{}} onChange={d=>updateTab("consommables",d)} user={user} consommables={consommables} onEditList={()=>setShowConsoEditor(true)} header={ofData.header} forceShowDeleted={printAll}/>
          </div>}
          {(!printAll&&activeTab==="testequip"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Test Equip."/>
            <SectionTitle>Test Equip.</SectionTitle>
            <TabTestEquip data={ofData.testequip} onChange={d=>updateTab("testequip",d)} user={user} header={ofData.header} forceShowDeleted={printAll}/>
          </div>}
          {(!printAll&&activeTab==="faits"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Faits"/>
            <SectionTitle>Faits</SectionTitle>
            <TabFaits data={ofData.faits||{}} onChange={d=>updateTab("faits",d)} user={user} faitTypes={faitTypes} onEditTypes={()=>setShowFaitTypes(true)} header={ofData.header} forceShowDeleted={printAll}/>
          </div>}
          {(!printAll&&activeTab==="etuvage"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Étuvages"/>
            <SectionTitle>Étuvages</SectionTitle>
            <TabEtuvage data={ofData.etuvage} onChange={d=>updateTab("etuvage",d)} user={user} allRows={ofData.etuvage?.rows} tstRows={ofData.testequip?.rows} header={ofData.header} forceShowDeleted={printAll}/>
          </div>}
          {(!printAll&&activeTab==="demating"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Matting"/>
            <SectionTitle>Matting</SectionTitle>
            <TabDeMating data={ofData.demating} onChange={d=>updateTab("demating",d)} user={user} header={ofData.header} forceShowDeleted={printAll}/>
          </div>}
          {(!printAll&&activeTab==="openwork"||printAll)&&<div style={printAll?{breakBefore:"page",marginTop:24}:{}}>
            <ReportHead tab="Open Work"/>
            <SectionTitle>Open Work</SectionTitle>
            <TabOpenWork data={ofData.openwork} onChange={d=>updateTab("openwork",d)} user={user} header={ofData.header} forceShowDeleted={printAll}/>
          </div>}
        </div>
      </div>

      {/* Éditeur liste consommables (modal) */}
      {showConsoEditor&&(
        <ConsommableListManager
          items={consommables}
          onClose={()=>setShowConsoEditor(false)}
          onSave={saveConsommables}
        />
      )}
      {showFaitTypes&&(
        <FaitTypesManager
          types={faitTypes}
          onClose={()=>setShowFaitTypes(false)}
          onSave={saveFaitTypes}
        />
      )}
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />);

