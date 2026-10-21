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
  const [weekendTarget,setWeekendTarget] = useState(null);
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

  // Validate required fields and stamp the real oven start time atomically.
  const validateAndEnter=(id,entryDate="")=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r) return;
    const miss=ovenRequiredMissing(r);
    if(miss.length){
      onChange({rows:scopedRowsPatch(rows,id,header,{validError:"Requis avant entrée : "+miss.join(", ")})});
      return;
    }
    onChange({rows:scopedRowsPatch(rows,id,header,x=>{
      const next={...x,entreeDT:entryDate||x.entreeDT||nowDT(),entreeVisa:x.entreeVisa||user?.trigram||"",
        validated:true,validError:""};
      return withEditHistory(next,user,ETUVAGE_EDIT_FIELDS);
    })});
  };
  const startWeekend=(id,entryDate)=>{ setWeekendTarget(null); validateAndEnter(id,entryDate); };
  const validateRow=id=>{
    const r=rows.find(x=>x.id===id);
    if(!canEdit(r)) return;
    if(!r) return;
    const miss=ovenRequiredMissing(r);
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
              <TH w={112}>▶ Entrée</TH><TH w={138}>Date/Heure entrée</TH>
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
                  <TD><Input value={r.duree} onChange={v=>upd(r.id,"duree",v)} small placeholder="h" readOnly={locked}
                    style={locked?LOCKED_INPUT_STYLE:r.validError&&!r.duree?{borderColor:C.red,color:C.red,background:"#da363318"}:{}}/></TD>
                  <TD><Input value={r.temp}  onChange={v=>upd(r.id,"temp",v)}  small placeholder="°C" readOnly={locked}
                    style={locked?LOCKED_INPUT_STYLE:r.validError&&!r.temp?{borderColor:C.red,color:C.red,background:"#da363318"}:{}}/></TD>
                  <TD center style={{pointerEvents:"all"}}>
                    {!inFour
                      ? (editable&&<div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"stretch"}}>
                          <Btn onClick={()=>validateAndEnter(r.id)} color={C.blue} small>▶ Entrée four</Btn>
                          <Btn onClick={()=>setWeekendTarget(r.id)} color={C.border} small title="Démarrer le compteur au dimanche soir">WE · Dim. soir</Btn>
                        </div>)
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
                      ? <input type="datetime-local" value={operationDateInputValue(r.entreeDT)}
                          onChange={event=>{const v=operationDateFromInput(event.target.value);patchEtuvageStamp(r.id,{entreeDT:v,entreeVisa:v?(r.entreeVisa||user?.trigram||""):"",...(v?{}:{sortieDT:"",sortieVisa:""})});}}
                          title="Corriger la date/heure d'entrée. Vider retire l'état entrée four."
                          disabled={!editable}
                          style={{width:"100%",boxSizing:"border-box",background:C.input,color:r.entreeDT?C.blue:C.muted,
                            border:`1px solid ${C.yellow}`,borderRadius:4,padding:"4px 5px",fontFamily:"monospace",fontSize:10}}/>
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
      {weekendTarget&&<WeekendOvenModal onConfirm={date=>startWeekend(weekendTarget,date)} onCancel={()=>setWeekendTarget(null)}/>}
    </div>
  );
};
