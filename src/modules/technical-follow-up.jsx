// ─── 5. DM ─────────────────────────────────────────────────────────────────
// ─── Types de faits par défaut ─────────────────────────────────────────────
const DEFAULT_FAIT_TYPES = [
  {id:"NC",  label:"NC — Non-Conformité",    color:C.red},
  {id:"DM",  label:"DM — Demande de Modif.", color:C.blue},
  {id:"ISS", label:"ISS — Fait Technique",   color:C.yellow},
  {id:"OW",  label:"OW — Open Work",         color:C.accent},
];

const ensureOpenWorkFactType = types => {
  const list=Array.isArray(types)?types.filter(type=>type&&type.id):[];
  return list.some(type=>String(type.id).toUpperCase()==="OW")
    ? list
    : [...list,DEFAULT_FAIT_TYPES.find(type=>type.id==="OW")];
};

const FaitTypeColor = {NC:C.red, DM:C.blue, ISS:C.yellow, OW:C.accent};
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
          <div style={{fontWeight:700,color:C.text,fontSize:14}}>⚙ Types de suivi technique</div>
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

const TabFaits = ({data,onChange,user,perms={},faitTypes,onEditTypes,header,forceShowDeleted=false,onCopyAcross,onCloseRow}) => {
  const rows     = data.rows||[];
  const types    = faitTypes;
  const isClosed = r => !!r.closedDate;
  const canEdit = row => canEditLine(user,row);
  const canClose = row => canCloseWorkItems(user)&&!!row&&!row.deleted;

  const add  = () => { if(!perms.canWrite) return; onChange({rows:[...rows,{
    id:uid(), createdVisa:user.trigram, createdDT:nowDT(),
    ...defaultSnScope(header),
    type:"", numero:"", visa:user.trigram, date:now(),
    lien:"", commentaires:"", closedVisa:"", closedDate:""
  }]}); };
  const upd   = (id,f,v) => { const r=rows.find(x=>x.id===id); if(f==="comments" ? !perms.canComment : !canEdit(r)) return; onChange({rows:scopedRowsPatch(rows,id,header,{[f]:v})}); };
  const patchRow = (id,fields) => { const r=rows.find(x=>x.id===id); if(canEdit(r)) onChange({rows:scopedRowsPatch(rows,id,header,fields)}); };
  const setType = (id,type) => {
    const row=rows.find(item=>item.id===id);
    if(!canEdit(row)) return;
    const numero=type==="OW"
      ? (row.type==="OW"&&row.numero?formatOpenWorkNumber(row.numero):nextOpenWorkNumber(rows))
      : row.numero;
    onChange({rows:scopedRowsPatch(rows,id,header,{type,numero})});
  };
  const dup=id=>{ const r=rows.find(x=>x.id===id); if(!r||!perms.canWrite) return; if(onCopyAcross&&!r.deleted){onCopyAcross(r);return;} onChange({rows:[...rows,duplicateRow(r,user,{
    visa:user.trigram,date:now(),closedVisa:"",closedDate:""
  })]}); };
  const [deleteTarget,setDeleteTarget] = useState(null);
  const [restoreTarget,setRestoreTarget] = useState(null);
  const [showDeleted,setShowDeleted]   = useState(false);
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
  const setClosed = (id,closed) => {
    const row=rows.find(x=>x.id===id);
    if(!canClose(row)) return;
    if(onCloseRow) return onCloseRow(id,closed);
    onChange({rows:scopedRowsPatch(rows,id,header,r=>withEditHistory({...r,closedVisa:closed?user.trigram:"",closedDate:closed?now():"",editBase:r.editBase||snapshotFields(r,FAITS_EDIT_FIELDS)},user,FAITS_EDIT_FIELDS))});
  };

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
          {perms.canWrite&&<Btn onClick={add} small>+ Suivi</Btn>}
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

      <div style={{width:"100%",maxWidth:"100%",overflowX:"auto",overflowY:"hidden"}}>
      <table style={{width:"100%",minWidth:1190,borderCollapse:"collapse",tableLayout:"fixed"}}>
        <thead>
          <tr>
            <TH w={118}>Date / Heure</TH><TH w={46} color={C.accent}>Visa</TH>
            <TH w={78}>N° SN</TH>
            <TH w={76}>Type</TH>
            <TH w={105}>N° (saisi)</TH>
            <TH w={66} color={C.accent}>Visa ✦</TH>
            <TH w={82}>Date ouv.</TH>
            <TH w={300}>Description</TH>
            <TH w={82}>Date clôt.</TH>
            <TH w={70}>Visa clôt.</TH>
            <TH w={42}>💬</TH>
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
                    : <><select value={r.type||""} onChange={e=>setType(r.id,e.target.value)}
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
                  <Input value={r.numero} onChange={v=>upd(r.id,"numero",v)} onBlur={()=>r.type==="OW"&&r.numero&&upd(r.id,"numero",formatOpenWorkNumber(r.numero))} small required readOnly={locked}
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

                {/* Description du fait */}
                <TD>
                  <Input value={r.commentaires} onChange={v=>upd(r.id,"commentaires",v)} small readOnly={locked} style={locked?LOCKED_INPUT_STYLE:{}}/>
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

                <TD center><CommentBtn comments={r.comments||[]} onChange={v=>upd(r.id,"comments",v)} user={user} disabled={!perms.canComment}/></TD>

                {/* Action */}
                <TD center>
                  {canClose(r)&&<ActionGroup>
                    <button onClick={()=>setClosed(r.id,!closed_r)}
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
      </div>
      {rows.length===0&&<div style={{textAlign:"center",color:C.muted,padding:24}}>Aucun suivi technique enregistré</div>}
      <div style={{marginTop:8,fontSize:11,color:C.muted}}>
        ✦ Visa pré-rempli · N° saisi manuellement · × annule et barre la ligne
      </div>
      {deleteTarget&&<DeleteModal godMode={perms.godMode} onConfirm={confirmDel} onCancel={()=>setDeleteTarget(null)}/>}
      {restoreTarget&&<RestoreModal onConfirm={restore} onCancel={()=>setRestoreTarget(null)}/>}
    </div>
  );
};
