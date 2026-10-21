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

const TabOpenWork = ({data,onChange,user,perms={},header,forceShowDeleted=false,onCopyAcross,onCloseRow}) => {
  const rows=data.rows||[];
  const canEdit = row => canEditLine(user,row);
  const canClose = row => canCloseWorkItems(user)&&!!row&&!row.deleted;
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
  const setClosed=(id,closed)=>{
    const row=rows.find(x=>x.id===id);
    if(!canClose(row)) return;
    if(onCloseRow) return onCloseRow(id,closed);
    onChange({rows:scopedRowsPatch(rows,id,header,r=>withEditHistory({...r,closedVisa:closed?user.trigram:"",closedDate:closed?now():"",editBase:r.editBase||snapshotFields(r,OPENWORK_EDIT_FIELDS)},user,OPENWORK_EDIT_FIELDS))});
  };
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
            <TH w={420}>Description</TH>
            <TH w={76}>Visa clôt.</TH>
            <TH w={104}>Date clôt.</TH>
            <TH w={42}>💬</TH>
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
                <ActionGroup>
                  {canClose(r)&&<button onClick={()=>setClosed(r.id,!isClosed(r))}
                    title={isClosed(r)?"Réouvrir cet Open Work":"Clore cet Open Work"}
                    style={{background:(isClosed(r)?C.yellow:C.green)+"22",border:`1px solid ${isClosed(r)?C.yellow:C.green}`,
                      borderRadius:3,color:isClosed(r)?C.yellow:C.green,fontSize:9,padding:"2px 7px",
                      cursor:"pointer",fontWeight:800,whiteSpace:"nowrap"}}>
                    {isClosed(r)?"Ouvrir":"Clore"}
                  </button>}
                  {(editable||perms.canWrite)&&<>
                    <IconBtn onClick={()=>dup(r.id)} color={C.blue} title="Dupliquer">⧉</IconBtn>
                    <HistoryBtn row={r}/>
                  </>}
                </ActionGroup>
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
